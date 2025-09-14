import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';

export interface CustomizationVariant {
  id: number;
  name: string;
  type: 'size' | 'extra' | 'addon' | 'substitute';
  price_modifier: number;
  is_required: boolean;
  formatted_price: string;
}

export interface MenuItemCustomization {
  menu_item: {
    id: number;
    name: string;
    description: string;
    base_price: number;
    currency: string;
    image?: string;
    preparation_time?: number;
    ingredients?: string[];
    allergens?: string[];
    is_vegetarian: boolean;
    is_spicy: boolean;
    calories?: number;
  };
  variants: {
    size?: CustomizationVariant[];
    extra?: CustomizationVariant[];
    addon?: CustomizationVariant[];
    substitute?: CustomizationVariant[];
  };
  customization_summary: {
    has_sizes: boolean;
    has_extras: boolean;
    has_addons: boolean;
    has_substitutes: boolean;
    total_variants: number;
    required_variants: number;
  };
}

export interface SelectedCustomization {
  size?: number; // variant ID
  extras: number[]; // array of variant IDs
  addons: number[]; // array of variant IDs
  substitutes: number[]; // array of variant IDs
  special_instructions?: string;
}

interface MenuCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customizationData: MenuItemCustomization;
  onAddToCart: (customization: SelectedCustomization, quantity: number) => void;
}

const MenuCustomizationModal: React.FC<MenuCustomizationModalProps> = ({
  isOpen,
  onClose,
  customizationData,
  onAddToCart
}) => {
  const [selectedCustomization, setSelectedCustomization] = useState<SelectedCustomization>({
    extras: [],
    addons: [],
    substitutes: []
  });
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setSelectedCustomization({
        extras: [],
        addons: [],
        substitutes: []
      });
      setQuantity(1);
      setSpecialInstructions('');
    }
  }, [isOpen]);

  const calculateTotalPrice = () => {
    let total = customizationData.menu_item.base_price;
    
    // Add size modifier
    if (selectedCustomization.size) {
      const sizeVariant = customizationData.variants.size?.find(v => v.id === selectedCustomization.size);
      if (sizeVariant) {
        total += sizeVariant.price_modifier;
      }
    }
    
    // Add extras
    selectedCustomization.extras.forEach(extraId => {
      const extra = customizationData.variants.extra?.find(v => v.id === extraId);
      if (extra) {
        total += extra.price_modifier;
      }
    });
    
    // Add add-ons
    selectedCustomization.addons.forEach(addonId => {
      const addon = customizationData.variants.addon?.find(v => v.id === addonId);
      if (addon) {
        total += addon.price_modifier;
      }
    });
    
    // Add substitutes
    selectedCustomization.substitutes.forEach(subId => {
      const substitute = customizationData.variants.substitute?.find(v => v.id === subId);
      if (substitute) {
        total += substitute.price_modifier;
      }
    });
    
    return total * quantity;
  };

  const handleVariantToggle = (variantId: number, type: 'size' | 'extra' | 'addon' | 'substitute') => {
    setSelectedCustomization(prev => {
      if (type === 'size') {
        // Size is radio button - only one selection
        return {
          ...prev,
          size: prev.size === variantId ? undefined : variantId
        };
      } else {
        // Others are checkboxes - multiple selections
        const currentArray = prev[type] || [];
        const newArray = currentArray.includes(variantId)
          ? currentArray.filter(id => id !== variantId)
          : [...currentArray, variantId];
        
        return {
          ...prev,
          [type]: newArray
        };
      }
    });
  };

  const isVariantSelected = (variantId: number, type: 'size' | 'extra' | 'addon' | 'substitute') => {
    if (type === 'size') {
      return selectedCustomization.size === variantId;
    } else {
      return (selectedCustomization[type] || []).includes(variantId);
    }
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...selectedCustomization,
      special_instructions: specialInstructions.trim() || undefined
    }, quantity);
    onClose();
  };

  const getVariantTypeColor = (type: string) => {
    switch (type) {
      case 'size': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'extra': return 'bg-green-100 text-green-800 border-green-200';
      case 'addon': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'substitute': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getVariantTypeLabel = (type: string) => {
    switch (type) {
      case 'size': return 'Size';
      case 'extra': return 'Extras';
      case 'addon': return 'Add-ons';
      case 'substitute': return 'Substitutes';
      default: return type;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{customizationData.menu_item.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{customizationData.menu_item.description}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          {/* Base Price */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Base Price</span>
              <span className="font-bold text-lg">
                ₦{customizationData.menu_item.base_price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Variants */}
          {Object.entries(customizationData.variants).map(([type, variants]) => {
            if (!variants || variants.length === 0) return null;
            
            return (
              <div key={type} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {getVariantTypeLabel(type)}
                </h3>
                <div className="space-y-2">
                  {variants.map((variant) => (
                    <label
                      key={variant.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        isVariantSelected(variant.id, type as any)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type={type === 'size' ? 'radio' : 'checkbox'}
                          name={type === 'size' ? 'size' : `${type}_${variant.id}`}
                          checked={isVariantSelected(variant.id, type as any)}
                          onChange={() => handleVariantToggle(variant.id, type as any)}
                          className={`${
                            type === 'size' ? 'w-4 h-4' : 'w-4 h-4'
                          } text-blue-600 focus:ring-blue-500`}
                        />
                        <div>
                          <div className="font-medium text-gray-900">{variant.name}</div>
                          {variant.is_required && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-sm font-medium rounded-full border ${getVariantTypeColor(type)}`}>
                        {variant.formatted_price}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Special Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Instructions</h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special requests? (Optional)"
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="text-lg font-medium min-w-[2rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-green-600">
              ₦{calculateTotalPrice().toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCustomizationModal;
