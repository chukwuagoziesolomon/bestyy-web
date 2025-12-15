import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { cartService, CartProduct } from '../services/cartService';

export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  vendorId: number;
  vendorName: string;
  quantity: number;
  specialInstructions?: string;
  variants?: {
    size?: number;
    extras: number[];
    addons: number[];
    substitutes: number[];
  };
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'UPDATE_SPECIAL_INSTRUCTIONS'; payload: { id: number; instructions: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'REPLACE_CART'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

const variantsEqual = (v1?: CartItem['variants'], v2?: CartItem['variants']): boolean => {
  if (!v1 && !v2) return true;
  if (!v1 || !v2) return false;
  return (
    v1.size === v2.size &&
    JSON.stringify(v1.extras.sort()) === JSON.stringify(v2.extras.sort()) &&
    JSON.stringify(v1.addons.sort()) === JSON.stringify(v2.addons.sort()) &&
    JSON.stringify(v1.substitutes.sort()) === JSON.stringify(v2.substitutes.sort())
  );
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && item.vendorId === action.payload.vendorId && variantsEqual(item.variants, action.payload.variants)
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          ...action.payload,
          quantity: action.payload.quantity || 1,
        };
        newItems = [...state.items, newItem];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id: action.payload.id } });
      }

      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    }

    case 'UPDATE_SPECIAL_INSTRUCTIONS': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, specialInstructions: action.payload.instructions }
          : item
      );

      return {
        ...state,
        items: newItems,
      };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'REPLACE_CART': {
      const totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        items: action.payload,
        totalItems,
        totalAmount,
      };
    }

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  updateSpecialInstructions: (id: number, instructions: string) => void;
  clearCart: () => Promise<void>;
  replaceCart: (items: CartItem[]) => void;
  refreshCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [loading, setLoading] = useState(false);

  // Convert backend cart product to frontend CartItem format
  const convertToCartItem = (product: CartProduct): CartItem => ({
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: product.price,
    currency: 'NGN',
    image: product.image || '',
    category: product.category || '',
    vendorId: product.vendor.id,
    vendorName: product.vendor.name,
    quantity: product.quantity,
  });

  // Load cart from backend on mount
  useEffect(() => {
    refreshCart();
  }, []);

  // Refresh cart from backend
  const refreshCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      if (response.success && response.products) {
        const cartItems = response.products.map(convertToCartItem);
        dispatch({ type: 'REPLACE_CART', payload: cartItems });
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart (with backend sync)
  const addItem = async (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    try {
      setLoading(true);
      const response = await cartService.addToCart(item.id, item.quantity || 1);
      
      if (response.success) {
        // Refresh cart to get latest state
        await refreshCart();
      }
    } catch (error: any) {
      console.error('Failed to add item to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart (with backend sync)
  const removeItem = async (id: number) => {
    try {
      setLoading(true);
      await cartService.removeItem(id);
      dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    } catch (error) {
      console.error('Failed to remove item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update quantity (with backend sync)
  const updateQuantity = async (id: number, quantity: number) => {
    try {
      setLoading(true);
      if (quantity <= 0) {
        await removeItem(id);
      } else {
        await cartService.updateQuantity(id, quantity);
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update special instructions (local only for now)
  const updateSpecialInstructions = (id: number, instructions: string) => {
    dispatch({ type: 'UPDATE_SPECIAL_INSTRUCTIONS', payload: { id, instructions } });
  };

  // Clear cart (with backend sync)
  const clearCart = async () => {
    try {
      setLoading(true);
      await cartService.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Replace cart (local only)
  const replaceCart = (items: CartItem[]) => {
    dispatch({ type: 'REPLACE_CART', payload: items });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        updateSpecialInstructions,
        clearCart,
        replaceCart,
        refreshCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};