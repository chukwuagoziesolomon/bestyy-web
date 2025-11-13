import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Building2, CheckCircle, Upload } from 'lucide-react';
import { showError, showSuccess } from '../toast';
import { useImageUpload } from '../hooks/useImageUpload';
import { fetchSupportedBanks, verifyBankAccount } from '../api';

const BankVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = location.state?.userType || 'vendor';
  const signupResponse = location.state?.signupResponse;

  // Get token from localStorage or signup response
  const token = localStorage.getItem('access_token') || signupResponse?.tokens?.access;

  const [banks, setBanks] = useState([]);
  const [formData, setFormData] = useState({
    bank_name: '',
    account_number: '',
    account_name: '',
    bank_statement: '' // Cloudinary URL for bank statement
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);

  // Image upload hook for bank statement
  const { uploadImage: uploadBankStatement, isUploading: isUploadingStatement, error: statementUploadError, clearError: clearStatementError } = useImageUpload({
    onSuccess: (file) => {
      if (file instanceof File) {
        setFormData(prev => ({ ...prev, bank_statement: file.name })); // Store filename for display
      }
      showSuccess('Bank statement uploaded successfully!');
    },
    onError: (error) => {
      showError(error);
    }
  });

  // Load supported banks on component mount
  useEffect(() => {
    loadSupportedBanks();
  }, []);

  const loadSupportedBanks = async () => {
    try {
      setIsLoadingBanks(true);
      const response = await fetchSupportedBanks(token);
      if (response.success) {
        setBanks(response.banks);
      } else {
        showError('Failed to load supported banks');
      }
    } catch (error) {
      console.error('Error loading banks:', error);
      showError('Failed to load supported banks');
    } finally {
      setIsLoadingBanks(false);
    }
  };

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
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // First verify bank account with Paystack
      // Find the bank code from the selected bank name
      const selectedBank = banks.find(bank => bank.name === formData.bank_name);
      if (!selectedBank) {
        showError('Please select a valid bank');
        return;
      }

      const bankVerificationData = {
        account_number: formData.account_number,
        account_name: formData.account_name,
        bank_code: selectedBank.code,
        bank_name: formData.bank_name
      };

      console.log('Bank verification data:', bankVerificationData);
      console.log('Token being used:', token);
      console.log('Token from localStorage:', localStorage.getItem('access_token'));
      console.log('Signup response tokens:', signupResponse?.tokens);

      // Ensure we have a token
      const authToken = token || localStorage.getItem('access_token');
      if (!authToken) {
        showError('Authentication required. Please try logging in again.');
        navigate('/login');
        return;
      }

      const bankResponse = await verifyBankAccount(bankVerificationData, authToken);

      console.log('Bank verification response:', bankResponse);

      if (bankResponse.success) {
        setIsVerified(true);
        showSuccess('Bank details verified successfully!');
        setTimeout(() => {
          // After bank verification, go to correct dashboard
          let dashboardPath = '/vendor/dashboard';
          if (userType === 'courier') dashboardPath = '/courier/dashboard';
          // Redirect
          navigate(dashboardPath);
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

  // Skip bank verification and go directly to dashboard
  const handleSkip = () => {
    let dashboardPath = '/vendor/dashboard';
    if (userType === 'courier') dashboardPath = '/courier/dashboard';
    navigate(dashboardPath);
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
      <div style={{
        flex: 1,
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Building2 size={48} color="#10b981" style={{ marginBottom: '16px' }} />
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#212529',
              marginBottom: '8px'
            }}>
              Verify Your Bank Details
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6c757d',
              lineHeight: '1.5'
            }}>
              We need your bank details to process payouts and ensure secure transactions.
            </p>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Bank Name
              </label>
              <select
                value={formData.bank_name}
                onChange={(e) => handleInputChange('bank_name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  outline: 'none',
                  background: '#fff'
                }}
                disabled={isLoadingBanks}
              >
                <option value="">
                  {isLoadingBanks ? 'Loading banks...' : 'Select Bank'}
                </option>
                {banks.map(bank => (
                  <option key={bank.code} value={bank.name}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
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
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
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
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Bank Statement (Optional)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: '#f9fafb',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.background = '#f0fdf4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.background = '#f9fafb';
                }}
                onClick={() => document.getElementById('statement-upload')?.click()}
                >
                  <div style={{ fontSize: '24px', color: '#6b7280', marginBottom: '8px' }}>📄</div>
                  <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                    Click to upload bank statement
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    PDF, PNG, JPG up to 10MB
                  </div>
                </div>
                <input
                  id="statement-upload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      uploadBankStatement(file, 'vendor-logo'); // Reuse vendor logo upload for statements
                    }
                  }}
                  disabled={isUploadingStatement}
                  style={{ display: 'none' }}
                />
                {isUploadingStatement && <div style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>Uploading...</div>}
                {statementUploadError && <div style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>{statementUploadError}</div>}
                {formData.bank_statement && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <Upload size={20} color="#10b981" />
                    <span style={{ color: '#10b981', fontSize: '0.9rem' }}>Bank statement uploaded successfully</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: isLoading ? '#d1d5db' : '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isLoading ? 'Verifying...' : (
                  <>
                    <CreditCard size={18} />
                    Verify Bank Details
                  </>
                )}
              </button>

              <button
                onClick={handleSkip}
                style={{
                  padding: '14px 20px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer'
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