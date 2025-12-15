import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './Checkout.css';
import { useCart } from './context/CartContext';
import { vendorApi, VendorProfile } from './services/vendorApi';
import { getThumbnailUrl } from './services/cloudinaryService';
import { getFallbackImageUrl } from './utils/imageUtils';
import { checkoutApi, CheckoutPayload } from './services/checkoutApi';
import AddressAutocomplete from './components/AddressAutocomplete';
import { getVendorProfileUrl } from './utils/urlUtils';
import PremiumLoadingAnimation from './components/PremiumLoadingAnimation';


interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'wallet' | 'bank_transfer';
  icon: string;
}

interface OrderSummaryData {
  success: boolean;
  summary: {
    subtotal: number;
    delivery_fee: number;
    platform_fee: number;
    grand_total: number;
    currency: string;
  };
  delivery_info: {
    distance_km: number;
    distance_text: string;
    estimated_time: string;
    vendor_address: string;
    delivery_address: string;
  };
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  item_count: number;
  vendor: {
    id: number;
    name: string;
    address: string;
  };
}

const Checkout: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();
  const { state: cartState, updateQuantity, removeItem, clearCart } = useCart();

  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Order details state
  // Address & contact
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('bank'); // default bank transfer
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [placing, setPlacing] = useState<boolean>(false);
  const [orderResponse, setOrderResponse] = useState<any>(null);
  const [orderSummary, setOrderSummary] = useState<OrderSummaryData | null>(null);
  const [calculatingSummary, setCalculatingSummary] = useState<boolean>(false);

  const paymentMethods: PaymentMethod[] = [
    { id: 'card', name: 'Card (Paystack)', type: 'card', icon: '💳' },
    { id: 'bank', name: 'Bank Transfer', type: 'bank_transfer', icon: '🏦' },
    { id: 'crypto', name: 'Crypto (USDT)', type: 'bank_transfer', icon: '🪙' }
  ];

  // Filter cart items for this vendor only
  const vendorCartItems = cartState.items.filter(item => item.vendorId === parseInt(vendorId || '0'));

  // Use order summary data if available, otherwise fall back to local calculations
  const subtotal = orderSummary?.summary.subtotal || vendorCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = orderSummary?.summary.delivery_fee || 500; // Fallback to fixed fee
  const platformFee = orderSummary?.summary.platform_fee || Math.round(subtotal * 0.05);
  const grandTotal = orderSummary?.summary.grand_total || (subtotal + deliveryFee + platformFee);

  useEffect(() => {
    if (vendorId) {
      fetchVendorInfo();
    }
  }, [vendorId]);

  // Calculate order summary when delivery address changes
  useEffect(() => {
    if (deliveryAddress.trim() && vendorCartItems.length > 0) {
      calculateOrderSummary();
    }
  }, [deliveryAddress, vendorCartItems.length]);

  const fetchVendorInfo = async () => {
    try {
      setLoading(true);
      const response = await vendorApi.getVendorProfile(parseInt(vendorId!));
      if (response.success) {
        setVendor(response.vendor);
      }
    } catch (err) {
      console.error('Error fetching vendor info:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateOrderSummary = async () => {
    if (!vendorCartItems.length || !deliveryAddress.trim()) {
      return;
    }

    try {
      setCalculatingSummary(true);

      const summaryData = {
        cart_items: vendorCartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          variants: item.variants || { extras: [], addons: [], substitutes: [] }
        })),
        delivery_address: deliveryAddress,
        vendor_id: parseInt(vendorId!)
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/order-summary/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include Django session cookies
        body: JSON.stringify(summaryData)
      });

      if (!response.ok) {
        throw new Error('Failed to calculate order summary');
      }

      const result = await response.json();

      if (result.success) {
        setOrderSummary(result);
      } else {
        throw new Error(result.error || 'Failed to calculate order summary');
      }
    } catch (error: any) {
      console.error('Error calculating order summary:', error);
      // Keep existing fallback pricing if API fails
    } finally {
      setCalculatingSummary(false);
    }
  };


  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        await removeItem(itemId);
      } else {
        await updateQuantity(itemId, newQuantity);
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!vendor || vendorCartItems.length === 0) return;

    try {
      setPlacing(true);

      // Parse address more intelligently
      let street = deliveryAddress;
      let city = '';
      let state = '';

      // Try to parse Google Places formatted addresses
      const addressParts = deliveryAddress.split(',').map(part => part.trim());
      if (addressParts.length >= 3) {
        // Assume format: "Street Address, City, State/Country"
        [street, city, state] = addressParts;
      } else if (addressParts.length === 2) {
        // Assume format: "Street Address, City"
        [street, city] = addressParts;
        state = 'Lagos'; // Default for Lagos addresses
      } else if (addressParts.length === 1) {
        // Single part address
        street = deliveryAddress;
        city = 'Lagos'; // Default city
        state = 'Lagos'; // Default state
      }

      // Ensure we have minimum required fields
      if (!street.trim()) {
        throw new Error('Please enter a valid delivery address');
      }
      if (!city.trim()) {
        city = 'Lagos';
      }
      if (!state.trim()) {
        state = 'Lagos';
      }

      const mappedPaymentMethod = (selectedPaymentMethod === 'bank'
        ? 'bank_transfer'
        : selectedPaymentMethod === 'card'
        ? 'debit_card'
        : 'crypto') as 'bank_transfer' | 'debit_card' | 'crypto';

      const payload: CheckoutPayload = {
        cart_items: vendorCartItems.map(ci => ({
          menu_item_id: ci.id,
          quantity: ci.quantity,
        })),
        user: {
          email,
          phone,
          first_name: firstName,
          last_name: lastName,
          password: password || undefined,
        },
        address: {
          address_type: 'home' as const,
          label: 'Home',
          street_address: street.trim(),
          city: city.trim(),
          state: state.trim(),
          postal_code: '',
          landmark: specialInstructions || '',
          phone,
          is_default: true,
        },
        payment_method: mappedPaymentMethod,
        crypto_currency: 'usdt',
      };

      const resp = await checkoutApi.createCheckout(payload);

      // Navigate to order confirmation page with order details
      if (resp.success && resp.order) {
        navigate(`/order-confirmation/${resp.order.id}`, {
          state: {
            orderDetails: resp,
            orderResponse: resp
          }
        });
        clearCart();
      } else {
        // Fallback for older API responses
        setOrderResponse(resp);
        setOrderPlaced(true);
        clearCart();
      }

    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return <PremiumLoadingAnimation message="Preparing checkout..." />;
  }

  if (!vendor) {
    return (
      <div className="checkout-page">
        <div className="error-state">
          <div className="error-content">
            <h3>Vendor not found</h3>
            <Link to="/explore" className="retry-button">
              Back to Explore
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (vendorCartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <div className="empty-cart-content">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-cart-icon">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-6"/>
            </svg>
            <h3>Your cart is empty</h3>
            <p>Add some delicious items from {vendor.business_name} to get started!</p>
            <Link to={getVendorProfileUrl(vendor.business_name, vendor.id)} className="retry-button">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="order-success">
          <div className="success-content">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="success-icon">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            <h3>Order Placed Successfully!</h3>
            <p>{orderResponse?.message || "Thank you for your order."}</p>
            {orderResponse?.summary && (
              <div className="order-summary" style={{ marginTop: 12 }}>
                <div className="summary-row"><span>Subtotal</span><span>₦{Number(orderResponse.summary.subtotal).toLocaleString()}</span></div>
                <div className="summary-row"><span>Shipping</span><span>₦{Number(orderResponse.summary.shipping_fee).toLocaleString()}</span></div>
                <div className="summary-row"><span>Platform fee</span><span>₦{Number(orderResponse.summary.platform_fee).toLocaleString()}</span></div>
                <div className="summary-row total"><span>Total</span><span>₦{Number(orderResponse.summary.grand_total).toLocaleString()}</span></div>
              </div>
            )}
            {orderResponse?.payment && (
              <div style={{ marginTop: 16, fontSize: 14 }}>
                <div><strong>Payment:</strong> {orderResponse.payment.type}</div>
                {orderResponse.payment.type === 'bank_transfer' && (
                  <div style={{ marginTop: 6 }}>
                    <div>Bank: {orderResponse.payment.bank_name}</div>
                    <div>Account Name: {orderResponse.payment.account_name}</div>
                    <div>Account Number: {orderResponse.payment.account_number}</div>
                    <div>Amount: ₦{Number(orderResponse.payment.amount).toLocaleString()}</div>
                    <div>Reference: {orderResponse.payment.reference}</div>
                  </div>
                )}
              </div>
            )}
            <div className="order-actions">
              <Link to="/explore" className="primary-button">
                Continue Shopping
              </Link>
              <Link to="/user/orders" className="secondary-button">
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <Link to={getVendorProfileUrl(vendor.business_name, vendor.id)} className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
          Back to {vendor.business_name}
        </Link>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-content">
        {/* Cart Items */}
        <div className="checkout-section">
          <h3>Order Summary</h3>
          <div className="cart-items">
            {vendorCartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img
                    src={getThumbnailUrl(item.image) || "/placeholder-food.jpg"}
                    alt={item.name}
                    onError={(e) => {
                      const fallbackUrl = getFallbackImageUrl(item.image);
                      if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
                        e.currentTarget.src = fallbackUrl;
                      } else if (e.currentTarget.src !== item.image && item.image) {
                        e.currentTarget.src = item.image;
                      } else {
                        e.currentTarget.src = "/placeholder-food.jpg";
                      }
                    }}
                  />
                </div>
                <div className="item-details">
                  <h4 className="item-name">{item.name}</h4>
                  <p className="item-description">{item.description}</p>
                  <div className="item-price">₦{item.price.toLocaleString()}</div>
                </div>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>


        {/* Contact & Delivery Address */}
        <div className="checkout-section">
          <h3>Contact & Delivery</h3>
          <div className="contact-grid">
            <input className="text-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="text-input" placeholder="Phone (e.g. +234...)" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className="text-input" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input className="text-input" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <input className="text-input" placeholder="Password (for account creation)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div style={{ marginTop: '20px' }}>
            <AddressAutocomplete
              value={deliveryAddress}
              onChange={setDeliveryAddress}
              onSelect={(suggestion) => {
                // Optional: Handle place selection for additional validation
                console.log('Selected address:', suggestion);
              }}
              placeholder="Enter your delivery address (Street, City, State)..."
              className="address-input"
            />
          </div>
        </div>

        {/* Special Instructions */}
        <div className="checkout-section">
          <h3>Special Instructions (Optional)</h3>
          <textarea
            className="instructions-input"
            placeholder="Any special requests or delivery instructions..."
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            rows={2}
          />
        </div>

        {/* Payment Method */}
        <div className="checkout-section">
          <h3>Payment Method</h3>
          <div className="payment-methods">
            {paymentMethods.map((method) => (
              <label key={method.id} className={`payment-method ${selectedPaymentMethod === method.id ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={selectedPaymentMethod === method.id}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                <span className="payment-icon">{method.icon}</span>
                <span className="payment-name">{method.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-section">
          <h3>Order Total</h3>

          {calculatingSummary ? (
            <div className="summary-loading">
              <div className="loading-spinner"></div>
              <p>Calculating delivery costs...</p>
            </div>
          ) : (
            <>
              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                {platformFee > 0 && (
                  <div className="summary-row">
                    <span>Platform Fee</span>
                    <span>₦{platformFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>₦{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {orderSummary?.delivery_info && (
                <div className="delivery-info" style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
                  <div>📍 Distance: {orderSummary.delivery_info.distance_text}</div>
                  <div>⏱️ Estimated delivery: {orderSummary.delivery_info.estimated_time}</div>
                </div>
              )}
            </>
          )}

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={!deliveryAddress.trim() || placing || !email || !phone || !firstName || !lastName}
          >
            {placing ? 'Placing Order...' : `Place Order - ₦${grandTotal.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;