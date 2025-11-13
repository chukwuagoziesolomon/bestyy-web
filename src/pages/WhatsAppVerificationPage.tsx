import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Copy, ExternalLink, RefreshCw, CheckCircle } from 'lucide-react';
import { resendVerificationCode, checkVerificationStatus } from '../api';
import { showSuccess, showError } from '../toast';

const WhatsAppVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = location.state?.userType || 'vendor';
  const signupResponse = location.state?.signupResponse;
  const bankVerified = location.state?.bankVerified || false;
  const bankData = location.state?.bankData;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [updatedSignupResponse, setUpdatedSignupResponse] = useState(signupResponse);
  const [isVerified, setIsVerified] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const handleVerificationComplete = (verified: boolean, phone: string) => {
    if (verified) {
      // Navigate to bank verification after successful WhatsApp verification
      navigate('/bank-verification', {
        state: {
          userType,
          bankVerified,
          bankData,
          signupResponse: updatedSignupResponse || signupResponse,
          whatsappVerified: true
        }
      });
    }
  };

  const handleVerificationSkip = () => {
    // Navigate to bank verification even if WhatsApp verification is skipped
    navigate('/bank-verification', {
      state: {
        userType,
        bankVerified,
        bankData,
        signupResponse: updatedSignupResponse || signupResponse,
        whatsappVerified: false
      }
    });
  };

  const handleResendCode = async () => {
    if (!signupResponse?.phone) {
      showError('Phone number not available');
      return;
    }

    setIsResending(true);
    try {
      const response = await resendVerificationCode(signupResponse.phone);
      showSuccess(response.message || 'New verification code sent successfully');

      // Update the signupResponse with new expires_at
      if (response.expires_at) {
        setUpdatedSignupResponse(prev => ({
          ...prev,
          expires_at: response.expires_at
        }));
      }
    } catch (error) {
      console.error('Failed to resend code:', error);
      showError(error instanceof Error ? error.message : 'Failed to resend verification code');
    } finally {
      setIsResending(false);
    }
  };

  const pollVerificationStatus = async () => {
    if (!signupResponse?.phone) {
      return;
    }

    setIsCheckingStatus(true);
    try {
      const response = await checkVerificationStatus(signupResponse.phone);
      if (response.verification_complete === true) {
        setIsVerified(true);
        showSuccess('WhatsApp verification completed successfully!');

        // Auto-navigate to bank verification after a short delay
        setTimeout(() => {
          navigate('/bank-verification', {
            state: {
              userType,
              bankVerified,
              bankData,
              signupResponse: updatedSignupResponse || signupResponse,
              whatsappVerified: true
            }
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to check verification status:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Poll for verification status every 5 seconds
  useEffect(() => {
    if (!isVerified && signupResponse?.phone) {
      const interval = setInterval(pollVerificationStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [signupResponse?.phone, isVerified]);

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
          WhatsApp Verification
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#212529',
                margin: 0
              }}>
                Verify Your WhatsApp
              </h2>
              {isVerified && (
                <CheckCircle size={28} color="#10b981" style={{ animation: 'bounce 0.6s ease' }} />
              )}
            </div>
            <p style={{
              fontSize: '16px',
              color: '#6c757d',
              lineHeight: '1.5'
            }}>
              {isVerified
                ? 'WhatsApp verification completed successfully! Redirecting to bank verification...'
                : 'We need to verify your WhatsApp number to send you important notifications about your account.'
              }
            </p>

            {/* Display signup response data if available */}
            {(updatedSignupResponse || signupResponse) && (
              <div style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '20px',
                textAlign: 'left'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0369a1',
                  marginBottom: '12px'
                }}>
                  WhatsApp Verification Code
                </h3>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#1e40af',
                      fontFamily: 'monospace',
                      background: '#dbeafe',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      display: 'inline-block',
                      userSelect: 'all'
                    }}>
                      {(updatedSignupResponse || signupResponse).verification_code || 'N/A'}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText((updatedSignupResponse || signupResponse).verification_code || '');
                        // You could add a toast notification here
                      }}
                      style={{
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Copy code"
                    >
                      <Copy size={16} color="#6b7280" />
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#0369a1' }}>Phone:</strong> {(updatedSignupResponse || signupResponse).phone || 'N/A'}
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#0369a1' }}>Message:</strong>
                  <div style={{
                    fontSize: '14px',
                    color: '#374151',
                    marginTop: '4px',
                    padding: '8px',
                    background: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0'
                  }}>
                    {(updatedSignupResponse || signupResponse).message || 'Send the verification code to WhatsApp'}
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={() => {
                      const whatsappUrl = process.env.REACT_APP_WHATSAPP_URL || 'https://wa.me/2340000000000';
                      const message = `VERIFY ${(updatedSignupResponse || signupResponse).verification_code}`;
                      const fullUrl = `${whatsappUrl}?text=${encodeURIComponent(message)}`;
                      window.open(fullUrl, '_blank');
                    }}
                    style={{
                      background: '#25d366',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '14px 20px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#128c7e';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#25d366';
                    }}
                  >
                    <MessageCircle size={20} />
                    Send Verification Code via WhatsApp
                  </button>

                  <button
                    onClick={handleResendCode}
                    disabled={isResending}
                    style={{
                      background: isResending ? '#9ca3af' : '#f59e0b',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '14px 20px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: isResending ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      opacity: isResending ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isResending) {
                        e.currentTarget.style.background = '#d97706';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isResending) {
                        e.currentTarget.style.background = '#f59e0b';
                      }
                    }}
                  >
                    <RefreshCw size={20} className={isResending ? 'animate-spin' : ''} />
                    {isResending ? 'Resending...' : 'Resend Verification Code'}
                  </button>

                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    textAlign: 'center',
                    padding: '8px',
                    background: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0'
                  }}>
                    📱 This will open WhatsApp with your verification code ready to send
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={handleVerificationSkip}
                    style={{
                      background: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#e5e7eb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f3f4f6';
                    }}
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppVerificationPage;