import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  Phone, 
  Shield,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  whatsappVerificationService, 
  WhatsAppVerificationResponse, 
  WhatsAppOTPResponse 
} from '../services/whatsappVerificationService';
import { showError, showSuccess } from '../toast';

interface WhatsAppVerificationProps {
  phoneNumber: string;
  countryCode?: string;
  onVerificationComplete: (verified: boolean, phoneNumber: string) => void;
  onVerificationSkip?: () => void;
  required?: boolean;
  className?: string;
}

const WhatsAppVerification: React.FC<WhatsAppVerificationProps> = ({
  phoneNumber,
  countryCode = '+234',
  onVerificationComplete,
  onVerificationSkip,
  required = true,
  className = ''
}) => {
  const [step, setStep] = useState<'check' | 'otp' | 'verified' | 'failed'>('check');
  const [loading, setLoading] = useState(false);
  const [isWhatsAppRegistered, setIsWhatsAppRegistered] = useState<boolean | null>(null);
  const [verificationId, setVerificationId] = useState<string>('');
  const [otpCode, setOtpCode] = useState('');
  const [otpExpiresAt, setOtpExpiresAt] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState<string>('');

  // Timer for OTP expiration
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Format time left
  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Check if phone number is registered on WhatsApp
  const checkWhatsAppRegistration = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await whatsappVerificationService.checkWhatsAppRegistration(phoneNumber, countryCode);
      
      if (response.success) {
        setIsWhatsAppRegistered(response.is_whatsapp_registered);
        
        if (response.is_whatsapp_registered) {
          setStep('otp');
          // Send OTP automatically
          await sendOTP();
        } else {
          setStep('failed');
          setError('This phone number is not registered on WhatsApp. Please use a different number or contact support.');
        }
      } else {
        setError(response.message || 'Failed to check WhatsApp registration');
        setStep('failed');
      }
    } catch (error) {
      setError('Failed to verify WhatsApp number. Please try again.');
      setStep('failed');
    } finally {
      setLoading(false);
    }
  };

  // Send OTP to WhatsApp
  const sendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await whatsappVerificationService.sendWhatsAppOTP(phoneNumber, countryCode);
      
      if (response.success && response.verification_id) {
        setVerificationId(response.verification_id);
        setOtpExpiresAt(response.expires_at || '');
        
        // Set timer for 5 minutes (300 seconds)
        setTimeLeft(300);
        
        showSuccess('OTP sent to your WhatsApp number');
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    if (!otpCode.trim()) {
      setError('Please enter the OTP code');
      return;
    }

    if (otpCode.length !== 6) {
      setError('OTP code must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await whatsappVerificationService.verifyWhatsAppOTP(phoneNumber, verificationId, otpCode);
      
      if (response.success && response.verified) {
        setStep('verified');
        onVerificationComplete(true, phoneNumber);
        showSuccess('WhatsApp number verified successfully!');
      } else {
        setError(response.message || 'Invalid OTP code');
      }
    } catch (error) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    await sendOTP();
  };

  // Skip verification
  const skipVerification = () => {
    if (onVerificationSkip) {
      onVerificationSkip();
    } else {
      onVerificationComplete(false, phoneNumber);
    }
  };

  // Reset verification
  const resetVerification = () => {
    setStep('check');
    setIsWhatsAppRegistered(null);
    setVerificationId('');
    setOtpCode('');
    setOtpExpiresAt('');
    setTimeLeft(0);
    setError('');
  };

  // Auto-check when phone number changes
  useEffect(() => {
    if (phoneNumber.trim() && step === 'check') {
      const timer = setTimeout(() => {
        checkWhatsAppRegistration();
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(timer);
    }
  }, [phoneNumber]);

  const renderCheckStep = () => (
    <div style={{
      background: '#f8fafc',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <MessageCircle size={24} color="#25d366" />
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#1f2937' }}>
          WhatsApp Verification
        </h3>
      </div>

      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
        We'll verify that your phone number is registered on WhatsApp to ensure you can receive important notifications.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Phone size={16} color="#6b7280" />
        <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
          {countryCode} {phoneNumber}
        </span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
          <RefreshCw size={16} className="animate-spin" />
          <span>Checking WhatsApp registration...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={checkWhatsAppRegistration}
            style={{
              background: '#25d366',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <MessageCircle size={16} />
            Check WhatsApp
          </button>

          {!required && (
            <button
              onClick={skipVerification}
              style={{
                background: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Skip for now
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderOTPStep = () => (
    <div style={{
      background: '#f0f9ff',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #bae6fd'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <CheckCircle size={24} color="#10b981" />
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#1f2937' }}>
          WhatsApp Number Verified
        </h3>
      </div>

      <p style={{ fontSize: '14px', color: '#0369a1', marginBottom: '16px' }}>
        Great! Your number is registered on WhatsApp. We've sent a 6-digit OTP to your WhatsApp number.
      </p>

      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px'
        }}>
          Enter OTP Code
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={showOtp ? 'text' : 'password'}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '16px',
              textAlign: 'center',
              letterSpacing: '2px',
              fontFamily: 'monospace'
            }}
          />
          <button
            type="button"
            onClick={() => setShowOtp(!showOtp)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            {showOtp ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {timeLeft > 0 && (
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
          OTP expires in: <span style={{ fontWeight: '600', color: '#ef4444' }}>{formatTimeLeft(timeLeft)}</span>
        </div>
      )}

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} color="#ef4444" />
            <span style={{ fontSize: '14px', color: '#dc2626' }}>{error}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={verifyOTP}
          disabled={loading || otpCode.length !== 6}
          style={{
            background: loading || otpCode.length !== 6 ? '#d1d5db' : '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: loading || otpCode.length !== 6 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1
          }}
        >
          {loading ? <RefreshCw size={16} className="animate-spin" /> : <Shield size={16} />}
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        {timeLeft === 0 && (
          <button
            onClick={resendOTP}
            disabled={loading}
            style={{
              background: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Resend
          </button>
        )}
      </div>
    </div>
  );

  const renderVerifiedStep = () => (
    <div style={{
      background: '#f0fdf4',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #bbf7d0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <CheckCircle size={24} color="#10b981" />
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#1f2937' }}>
          WhatsApp Verified Successfully!
        </h3>
      </div>

      <p style={{ fontSize: '14px', color: '#166534', marginBottom: '16px' }}>
        Your WhatsApp number has been verified. You'll receive important notifications about your account status.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <MessageCircle size={16} color="#10b981" />
        <span style={{ fontSize: '14px', color: '#166534', fontWeight: '500' }}>
          {countryCode} {phoneNumber}
        </span>
        <CheckCircle size={16} color="#10b981" />
      </div>

      <button
        onClick={resetVerification}
        style={{
          background: '#f3f4f6',
          color: '#374151',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer'
        }}
      >
        Verify Different Number
      </button>
    </div>
  );

  const renderFailedStep = () => (
    <div style={{
      background: '#fef2f2',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #fecaca'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <XCircle size={24} color="#ef4444" />
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#1f2937' }}>
          WhatsApp Verification Failed
        </h3>
      </div>

      <p style={{ fontSize: '14px', color: '#dc2626', marginBottom: '16px' }}>
        {error || 'This phone number is not registered on WhatsApp or verification failed.'}
      </p>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={resetVerification}
          style={{
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <RefreshCw size={16} />
          Try Again
        </button>

        {!required && (
          <button
            onClick={skipVerification}
            style={{
              background: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className={`whatsapp-verification ${className}`}>
      {step === 'check' && renderCheckStep()}
      {step === 'otp' && renderOTPStep()}
      {step === 'verified' && renderVerifiedStep()}
      {step === 'failed' && renderFailedStep()}
    </div>
  );
};

export default WhatsAppVerification;
