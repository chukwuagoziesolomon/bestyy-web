import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Building2, CheckCircle, Upload } from 'lucide-react';
import { showError, showSuccess } from '../toast';
import { verifyBankAccount } from '../api';
import PremiumLoadingAnimation from '../components/PremiumLoadingAnimation';

// Add spinner animation and responsive styles
const spinnerStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 480px) {
    .bank-verification-container {
      padding: 16px 12px !important;
    }
    .bank-verification-form {
      padding: 24px 20px !important;
      border-radius: 16px !important;
    }
    .bank-verification-title {
      font-size: 24px !important;
    }
    .bank-verification-subtitle {
      font-size: 15px !important;
    }
  }
`;

// Inject styles if not already present
if (!document.getElementById('bank-verification-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'bank-verification-styles';
  styleSheet.textContent = spinnerStyles;
  document.head.appendChild(styleSheet);
}

const BankVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = location.state?.userType || 'vendor';
  const signupResponse = location.state?.signupResponse;

  // Get token from localStorage (prioritize fresh tokens) or signup response
  const token = localStorage.getItem('access_token') || signupResponse?.tokens?.access;

  const [formData, setFormData] = useState({
    bank_name: '',
    account_number: '',
    account_name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);





  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.bank_name.trim()) {
      showError('Bank name is required');
      return false;
    }
    if (!formData.account_number.trim()) {
      showError('Account number is required');
      return false;
    }
    if (!formData.account_name.trim()) {
      showError('Account name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called');
    console.log('Form data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Starting bank verification...');
    setIsLoading(true);

    try {
      // Verify bank account details
      const bankVerificationData = {
        account_number: formData.account_number,
        account_name: formData.account_name,
        bank_name: formData.bank_name
      };

      console.log('Bank verification data:', bankVerificationData);
      console.log('Token being used:', token);
      console.log('Token from localStorage:', localStorage.getItem('access_token'));
      console.log('Signup response tokens:', signupResponse?.tokens);

      // Ensure we have a token - prioritize localStorage for fresh tokens
      const authToken = localStorage.getItem('access_token') || token;
      if (!authToken) {
        console.error('No authentication token available');
        showError('Authentication required. Please try logging in again.');
        navigate('/login');
        return;
      }

      console.log('Using auth token:', authToken.substring(0, 20) + '...');

      const bankResponse = await verifyBankAccount(bankVerificationData, authToken);

      console.log('Bank verification response:', bankResponse);

      if (bankResponse.success) {
        setIsVerified(true);
        showSuccess('Bank details verified successfully!');
        setTimeout(() => {
          // After bank verification, go to success page with userType
          navigate('/success', {
            state: { userType }
          });
        }, 2000);
      } else {
        showError(bankResponse.error || 'Bank verification failed');
      }
    } catch (error) {
      console.error('Bank verification error:', error);
      showError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Skip bank verification and go to success page
  const handleSkip = () => {
    navigate('/success', {
      state: { userType }
    });
  };

  if (isVerified) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 16px',
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          borderBottom: '1px solid #e9ecef'
        }}>
          <ArrowLeft
            size={24}
            color="#333"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(-1)}
          />
          <h1 style={{
            margin: '0 0 0 16px',
            fontSize: '20px',
            fontWeight: '600',
            color: '#212529'
          }}>
            Bank Verification
          </h1>
        </div>

        {/* Success Content */}
        <div style={{
          flex: 1,
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#f0fdf4',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            maxWidth: '400px',
            width: '100%'
          }}>
            <CheckCircle size={64} color="#10b981" style={{ marginBottom: '16px' }} />
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#166534',
              marginBottom: '8px'
            }}>
              Bank Details Verified!
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#166534',
              lineHeight: '1.5'
            }}>
              Your bank details have been successfully verified. Redirecting to WhatsApp verification...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while submitting
  if (isLoading) {
    return <PremiumLoadingAnimation message="Verifying bank details..." />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 16px',
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderBottom: '1px solid #e9ecef'
      }}>
        <ArrowLeft
          size={24}
          color="#333"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(-1)}
        />
        <h1 style={{
          margin: '0 0 0 16px',
          fontSize: '20px',
          fontWeight: '600',
          color: '#212529'
        }}>
          Bank Verification
        </h1>
      </div>

      {/* Content */}
      <div className="bank-verification-container" style={{
        flex: 1,
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '480px',
          margin: '0 auto'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)'
            }}>
              <Building2 size={48} color="#10b981" />
            </div>
            <h2 className="bank-verification-title" style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#111827',
              marginBottom: '12px',
              lineHeight: '1.2'
            }}>
              Verify Your Bank Details
            </h2>
            <p className="bank-verification-subtitle" style={{
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '1.6',
              maxWidth: '360px',
              margin: '0 auto'
            }}>
              We need your bank details to process payouts and ensure secure transactions.
            </p>
          </div>

          <div className="bank-verification-form" style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '32px 24px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '12px'
              }}>
                Bank Name
              </label>
              <input
                type="text"
                placeholder="Enter your bank name (e.g., Access Bank, GTBank)"
                value={formData.bank_name}
                onChange={(e) => handleInputChange('bank_name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '16px',
                  outline: 'none',
                  background: '#fff',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '12px'
              }}>
                Account Number
              </label>
              <input
                type="text"
                placeholder="Enter your account number"
                value={formData.account_number}
                onChange={(e) => handleInputChange('account_number', e.target.value.replace(/\D/g, ''))}
                maxLength={10}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '16px',
                  outline: 'none',
                  background: '#fff',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '12px'
              }}>
                Account Name
              </label>
              <input
                type="text"
                placeholder="Enter account holder name"
                value={formData.account_name}
                onChange={(e) => handleInputChange('account_name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '16px',
                  outline: 'none',
                  background: '#fff',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>



            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '16px'
            }}>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: isLoading ? '#d1d5db' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  boxShadow: isLoading ? 'none' : '0 8px 24px rgba(16, 185, 129, 0.3)',
                  minHeight: '56px'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.3)';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid transparent',
                      borderTop: '2px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Verify Bank Details
                  </>
                )}
              </button>

              <button
                onClick={handleSkip}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  background: 'transparent',
                  color: '#6b7280',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minHeight: '52px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankVerificationPage;