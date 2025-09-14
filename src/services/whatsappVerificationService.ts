import { showError, showSuccess } from '../toast';

// Types for WhatsApp verification
export interface WhatsAppVerificationRequest {
  phone_number: string;
  country_code?: string;
}

export interface WhatsAppVerificationResponse {
  success: boolean;
  is_whatsapp_registered: boolean;
  phone_number: string;
  message: string;
  verification_id?: string;
  expires_at?: string;
}

export interface WhatsAppOTPRequest {
  phone_number: string;
  verification_id: string;
  otp_code: string;
}

export interface WhatsAppOTPResponse {
  success: boolean;
  verified: boolean;
  message: string;
  phone_number: string;
}

export interface WhatsAppStatusResponse {
  success: boolean;
  is_whatsapp_registered: boolean;
  phone_number: string;
  last_seen?: string;
  profile_name?: string;
  message: string;
}

class WhatsAppVerificationService {
  private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('WhatsApp verification API request failed:', error);
      throw error;
    }
  }

  // Check if phone number is registered on WhatsApp
  async checkWhatsAppRegistration(phoneNumber: string, countryCode: string = '+234'): Promise<WhatsAppVerificationResponse> {
    try {
      // Format phone number (remove spaces, dashes, etc.)
      const formattedNumber = this.formatPhoneNumber(phoneNumber, countryCode);
      
      const response = await this.makeRequest<WhatsAppVerificationResponse>(
        '/api/verification/whatsapp/check/',
        {
          method: 'POST',
          body: JSON.stringify({
            phone_number: formattedNumber,
            country_code: countryCode
          })
        }
      );

      return response;
    } catch (error) {
      console.error('Failed to check WhatsApp registration:', error);
      showError('Failed to verify WhatsApp number');
      throw error;
    }
  }

  // Send OTP to WhatsApp number for verification
  async sendWhatsAppOTP(phoneNumber: string, countryCode: string = '+234'): Promise<WhatsAppVerificationResponse> {
    try {
      const formattedNumber = this.formatPhoneNumber(phoneNumber, countryCode);
      
      const response = await this.makeRequest<WhatsAppVerificationResponse>(
        '/api/verification/whatsapp/send-otp/',
        {
          method: 'POST',
          body: JSON.stringify({
            phone_number: formattedNumber,
            country_code: countryCode
          })
        }
      );

      if (response.success) {
        showSuccess('OTP sent to your WhatsApp number');
      }

      return response;
    } catch (error) {
      console.error('Failed to send WhatsApp OTP:', error);
      showError('Failed to send OTP to WhatsApp');
      throw error;
    }
  }

  // Verify OTP sent to WhatsApp
  async verifyWhatsAppOTP(phoneNumber: string, verificationId: string, otpCode: string): Promise<WhatsAppOTPResponse> {
    try {
      const formattedNumber = this.formatPhoneNumber(phoneNumber);
      
      const response = await this.makeRequest<WhatsAppOTPResponse>(
        '/api/verification/whatsapp/verify-otp/',
        {
          method: 'POST',
          body: JSON.stringify({
            phone_number: formattedNumber,
            verification_id: verificationId,
            otp_code: otpCode
          })
        }
      );

      if (response.success && response.verified) {
        showSuccess('WhatsApp number verified successfully!');
      } else {
        showError('Invalid OTP code');
      }

      return response;
    } catch (error) {
      console.error('Failed to verify WhatsApp OTP:', error);
      showError('Failed to verify OTP');
      throw error;
    }
  }

  // Get WhatsApp status (if number is registered and last seen)
  async getWhatsAppStatus(phoneNumber: string, countryCode: string = '+234'): Promise<WhatsAppStatusResponse> {
    try {
      const formattedNumber = this.formatPhoneNumber(phoneNumber, countryCode);
      
      const response = await this.makeRequest<WhatsAppStatusResponse>(
        '/api/verification/whatsapp/status/',
        {
          method: 'POST',
          body: JSON.stringify({
            phone_number: formattedNumber,
            country_code: countryCode
          })
        }
      );

      return response;
    } catch (error) {
      console.error('Failed to get WhatsApp status:', error);
      showError('Failed to check WhatsApp status');
      throw error;
    }
  }

  // Format phone number to international format
  private formatPhoneNumber(phoneNumber: string, countryCode: string = '+234'): string {
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');
    
    // Remove leading zeros
    const cleanNumber = digits.replace(/^0+/, '');
    
    // Add country code if not present
    if (!cleanNumber.startsWith(countryCode.replace('+', ''))) {
      return `${countryCode}${cleanNumber}`;
    }
    
    return `+${cleanNumber}`;
  }

  // Validate phone number format
  validatePhoneNumber(phoneNumber: string, countryCode: string = '+234'): { valid: boolean; formatted: string; error?: string } {
    try {
      const formatted = this.formatPhoneNumber(phoneNumber, countryCode);
      
      // Basic validation - should be at least 10 digits after country code
      const digitsOnly = formatted.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        return {
          valid: false,
          formatted,
          error: 'Phone number is too short'
        };
      }

      // Check if it's a valid Nigerian number (for +234)
      if (countryCode === '+234') {
        const nigerianNumber = digitsOnly.replace(/^234/, '');
        if (nigerianNumber.length !== 10) {
          return {
            valid: false,
            formatted,
            error: 'Invalid Nigerian phone number format'
          };
        }
        
        // Check if it starts with valid Nigerian mobile prefixes
        const validPrefixes = ['70', '80', '81', '90', '91'];
        const prefix = nigerianNumber.substring(0, 2);
        if (!validPrefixes.includes(prefix)) {
          return {
            valid: false,
            formatted,
            error: 'Invalid Nigerian mobile number prefix'
          };
        }
      }

      return {
        valid: true,
        formatted
      };
    } catch (error) {
      return {
        valid: false,
        formatted: phoneNumber,
        error: 'Invalid phone number format'
      };
    }
  }

  // Get country code options
  getCountryCodeOptions(): Array<{ code: string; country: string; flag: string }> {
    return [
      { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
      { code: '+1', country: 'United States', flag: '🇺🇸' },
      { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
      { code: '+33', country: 'France', flag: '🇫🇷' },
      { code: '+49', country: 'Germany', flag: '🇩🇪' },
      { code: '+91', country: 'India', flag: '🇮🇳' },
      { code: '+86', country: 'China', flag: '🇨🇳' },
      { code: '+55', country: 'Brazil', flag: '🇧🇷' },
      { code: '+27', country: 'South Africa', flag: '🇿🇦' },
      { code: '+254', country: 'Kenya', flag: '🇰🇪' },
      { code: '+233', country: 'Ghana', flag: '🇬🇭' },
      { code: '+256', country: 'Uganda', flag: '🇺🇬' }
    ];
  }
}

export const whatsappVerificationService = new WhatsAppVerificationService();
