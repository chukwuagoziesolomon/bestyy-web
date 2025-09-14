import React, { useState } from 'react';

interface GuestCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (guestInfo: GuestInfo) => void;
  cartTotal: number;
  itemCount: number;
}

export interface GuestInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  city: string;
  deliveryInstructions?: string;
}

const GuestCheckoutModal: React.FC<GuestCheckoutModalProps> = ({
  isOpen,
  onClose,
  onProceed,
  cartTotal,
  itemCount
}) => {
  const [formData, setFormData] = useState<GuestInfo>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    deliveryAddress: '',
    city: '',
    deliveryInstructions: ''
  });
  const [errors, setErrors] = useState<Partial<GuestInfo>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<GuestInfo> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+234|0)?[789][01]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Nigerian phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onProceed(formData);
    } catch (error) {
      console.error('Error proceeding to checkout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof GuestInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // If it starts with 234, keep it as is
    if (digits.startsWith('234')) {
      return digits;
    }
    
    // If it starts with 0, replace with 234
    if (digits.startsWith('0')) {
      return '234' + digits.slice(1);
    }
    
    // If it doesn't start with 234, add it
    if (digits.length > 0 && !digits.startsWith('234')) {
      return '234' + digits;
    }
    
    return digits;
  };

  if (!isOpen) return null;

  return (
    <div className="guest-checkout-modal-overlay">
      <div className="guest-checkout-modal">
        <div className="guest-checkout-modal__header">
          <h2>Complete Your Order</h2>
          <p className="guest-checkout-modal__subtitle">
            We need some details to deliver your {itemCount} item{itemCount > 1 ? 's' : ''}
          </p>
          <button 
            className="guest-checkout-modal__close"
            onClick={onClose}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="guest-checkout-modal__content">
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="guest-checkout-modal__section">
              <h3>Personal Information</h3>
              <div className="guest-checkout-modal__row">
                <div className="guest-checkout-modal__field">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={errors.firstName ? 'error' : ''}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>
                <div className="guest-checkout-modal__field">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={errors.lastName ? 'error' : ''}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                </div>
              </div>

              <div className="guest-checkout-modal__field">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', formatPhoneNumber(e.target.value))}
                  className={errors.phone ? 'error' : ''}
                  placeholder="+234 801 234 5678"
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              <div className="guest-checkout-modal__field">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                  placeholder="your.email@example.com"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="guest-checkout-modal__section">
              <h3>Delivery Information</h3>
              <div className="guest-checkout-modal__field">
                <label htmlFor="deliveryAddress">Delivery Address *</label>
                <textarea
                  id="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  className={errors.deliveryAddress ? 'error' : ''}
                  placeholder="Enter your full delivery address including street, building, and landmarks"
                  rows={3}
                />
                {errors.deliveryAddress && <span className="error-text">{errors.deliveryAddress}</span>}
              </div>

              <div className="guest-checkout-modal__field">
                <label htmlFor="city">City *</label>
                <select
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={errors.city ? 'error' : ''}
                >
                  <option value="">Select your city</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Port Harcourt">Port Harcourt</option>
                  <option value="Kano">Kano</option>
                  <option value="Ibadan">Ibadan</option>
                  <option value="Benin">Benin</option>
                  <option value="Kaduna">Kaduna</option>
                  <option value="Warri">Warri</option>
                  <option value="Aba">Aba</option>
                  <option value="Jos">Jos</option>
                </select>
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>

              <div className="guest-checkout-modal__field">
                <label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</label>
                <textarea
                  id="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
                  placeholder="Any special delivery instructions? (e.g., gate code, floor, etc.)"
                  rows={2}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="guest-checkout-modal__section guest-checkout-modal__summary">
              <h3>Order Summary</h3>
              <div className="guest-checkout-modal__summary-item">
                <span>{itemCount} item{itemCount > 1 ? 's' : ''}</span>
                <span>₦{cartTotal.toLocaleString()}</span>
              </div>
              <div className="guest-checkout-modal__summary-item">
                <span>Delivery Fee</span>
                <span>₦500</span>
              </div>
              <div className="guest-checkout-modal__summary-total">
                <span>Total</span>
                <span>₦{(cartTotal + 500).toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="guest-checkout-modal__actions">
              <button
                type="button"
                className="guest-checkout-modal__cancel"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="guest-checkout-modal__proceed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 2a10 10 0 0 1 10 10"/>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    Proceed to Payment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .guest-checkout-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .guest-checkout-modal {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .guest-checkout-modal__header {
          position: relative;
          padding: 24px 24px 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .guest-checkout-modal__header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
        }

        .guest-checkout-modal__subtitle {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .guest-checkout-modal__close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #6b7280;
          transition: all 0.2s ease;
        }

        .guest-checkout-modal__close:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .guest-checkout-modal__content {
          padding: 24px;
        }

        .guest-checkout-modal__section {
          margin-bottom: 32px;
        }

        .guest-checkout-modal__section h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: #374151;
        }

        .guest-checkout-modal__row {
          display: flex;
          gap: 16px;
        }

        .guest-checkout-modal__row .guest-checkout-modal__field {
          flex: 1;
        }

        .guest-checkout-modal__field {
          margin-bottom: 16px;
        }

        .guest-checkout-modal__field label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .guest-checkout-modal__field input,
        .guest-checkout-modal__field textarea,
        .guest-checkout-modal__field select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .guest-checkout-modal__field input:focus,
        .guest-checkout-modal__field textarea:focus,
        .guest-checkout-modal__field select:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .guest-checkout-modal__field input.error,
        .guest-checkout-modal__field textarea.error,
        .guest-checkout-modal__field select.error {
          border-color: #ef4444;
        }

        .error-text {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }

        .guest-checkout-modal__summary {
          background: #f9fafb;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .guest-checkout-modal__summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          color: #6b7280;
        }

        .guest-checkout-modal__summary-total {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
          font-weight: 600;
          font-size: 16px;
          color: #1f2937;
        }

        .guest-checkout-modal__actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .guest-checkout-modal__cancel {
          flex: 1;
          padding: 12px 24px;
          background: white;
          color: #6b7280;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .guest-checkout-modal__cancel:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .guest-checkout-modal__proceed {
          flex: 2;
          padding: 12px 24px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .guest-checkout-modal__proceed:hover {
          background: #059669;
        }

        .guest-checkout-modal__proceed:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .guest-checkout-modal {
            margin: 0;
            border-radius: 0;
            max-height: 100vh;
          }

          .guest-checkout-modal__row {
            flex-direction: column;
            gap: 0;
          }

          .guest-checkout-modal__actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default GuestCheckoutModal;


