import React, { useState, useEffect } from 'react';
import './AddToCartModal.css';
import { getMenuItemCustomization } from './api';
import MenuCustomizationModal, { MenuItemCustomization, SelectedCustomization } from './components/MenuCustomizationModal';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: number;
    name: string;
    description: string;
    price: string | number | { amount: number; display?: string; value?: number };
    image: string;
    category: string;
  };
  onAddToCart: (item: any, quantity: number, customizations: any) => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ 
  isOpen, 
  onClose, 
  item, 
  onAddToCart 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [customizationData, setCustomizationData] = useState<MenuItemCustomization | null>(null);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load customization data when modal opens
  useEffect(() => {
    if (isOpen && item.id) {
      loadCustomizationData();
    }
  }, [isOpen, item.id]);

  const loadCustomizationData = async () => {
    try {
      setLoading(true);
      const data = await getMenuItemCustomization(item.id);
      setCustomizationData(data);
    } catch (error) {
      console.log('No customization options available for this item');
      setCustomizationData(null);
    } finally {
      setLoading(false);
    }
  };

  const hasVariants = customizationData?.customization_summary.total_variants > 0;

  const handleAddToCartClick = () => {
    if (hasVariants) {
      // Show customization modal
      setShowCustomizationModal(true);
    } else {
      // Add directly to cart without customization
      onAddToCart(item, quantity, {});
      onClose();
    }
  };

  const handleCustomizedAddToCart = (customization: SelectedCustomization, customQuantity: number) => {
    onAddToCart(item, customQuantity, customization);
    setShowCustomizationModal(false);
    onClose();
  };

  // Legacy hardcoded data (fallback for items without variants)
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const sizes = [
    { name: 'Small', price: 0 },
    { name: 'Regular', price: 0 },
    { name: 'Large', price: 2000 }
  ];

  const extras = [
    { name: 'Extra Cheese', price: 1500 },
    { name: 'Extra Bacon', price: 2000 },
    { name: 'Extra Lettuce', price: 500 },
    { name: 'Extra Tomato', price: 500 },
    { name: 'Extra Onion', price: 300 },
    { name: 'Extra Sauce', price: 800 }
  ];

  const handleExtraToggle = (extraName: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraName) 
        ? prev.filter(extra => extra !== extraName)
        : [...prev, extraName]
    );
  };

  const calculateTotal = () => {
    try {
      // Handle different price types (string, number, or object with amount)
      let basePrice = 0;
      
      if (typeof item.price === 'string') {
        // If price is a string, extract numbers (e.g., "₦2,500" -> 2500)
        const priceString = item.price.replace(/[^\d]/g, '');
        basePrice = parseInt(priceString) || 0;
      } else if (typeof item.price === 'number') {
        // If price is already a number
        basePrice = item.price;
      } else if (item.price && typeof item.price === 'object') {
        // If price is an object (e.g., { amount: 2500, display: "₦2,500" })
        basePrice = item.price.amount || item.price.value || 0;
      } else {
        // Fallback to 0 if price is invalid
        console.warn('Invalid price format:', item.price);
        basePrice = 0;
      }
      
      const sizePrice = sizes.find(s => s.name === selectedSize)?.price || 0;
      const extrasPrice = selectedExtras.reduce((total, extraName) => {
        const extra = extras.find(e => e.name === extraName);
        return total + (extra?.price || 0);
      }, 0);
      
      return (basePrice + sizePrice + extrasPrice) * quantity;
    } catch (error) {
      console.error('Error calculating total:', error, 'Item:', item);
      return 0;
    }
  };

  const handleAddToCart = () => {
    const customizations = {
      size: selectedSize,
      extras: selectedExtras,
      specialInstructions
    };
    
    onAddToCart(item, quantity, customizations);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="add-to-cart-overlay">
      <div className="add-to-cart-modal">
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-content">
          <div className="item-image-section">
            <img src={item.image} alt={item.name} />
          </div>

          <div className="item-details-section">
            <h2>{item.name}</h2>
            <p className="item-description">{item.description}</p>
            <p className="item-price">₦ {calculateTotal().toLocaleString()}</p>

            {/* Size Selection */}
            <div className="customization-section">
              <h3>Size</h3>
              <div className="size-options">
                {sizes.map((size) => (
                  <button
                    key={size.name}
                    className={`size-option ${selectedSize === size.name ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size.name)}
                  >
                    <span className="size-name">{size.name}</span>
                    {size.price > 0 && (
                      <span className="size-price">+₦{size.price.toLocaleString()}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Extras Selection */}
            <div className="customization-section">
              <h3>Add Extras</h3>
              <div className="extras-options">
                {extras.map((extra) => (
                  <button
                    key={extra.name}
                    className={`extra-option ${selectedExtras.includes(extra.name) ? 'selected' : ''}`}
                    onClick={() => handleExtraToggle(extra.name)}
                  >
                    <span className="extra-name">{extra.name}</span>
                    <span className="extra-price">+₦{extra.price.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="customization-section">
              <h3>Special Instructions</h3>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests? (e.g., no onions, extra spicy)"
                className="special-instructions"
                rows={3}
              />
            </div>

            {/* Quantity Selector */}
            <div className="quantity-section">
              <h3>Quantity</h3>
              <div className="quantity-selector">
                <button 
                  className="quantity-btn minus"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  className="quantity-btn plus"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="total-section">
            <span className="total-label">Total</span>
            <span className="total-amount">₦ {calculateTotal().toLocaleString()}</span>
          </div>
          <button 
            className="add-to-cart-btn" 
            onClick={handleAddToCartClick}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {loading ? 'Loading...' : (hasVariants ? 'Customize & Add to Cart' : 'Add to Cart')}
          </button>
        </div>
      </div>

      {/* Customization Modal */}
      {customizationData && (
        <MenuCustomizationModal
          isOpen={showCustomizationModal}
          onClose={() => setShowCustomizationModal(false)}
          customizationData={customizationData}
          onAddToCart={handleCustomizedAddToCart}
        />
      )}
    </div>
  );
};

export default AddToCartModal;
