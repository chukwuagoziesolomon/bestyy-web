// API configuration
export const API_BASE = `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api`;
export const WHATSAPP_URL = process.env.REACT_APP_WHATSAPP_URL || 'https://wa.me/2340000000000';

// Add other configuration variables as needed
export default {
  API_BASE,
  WHATSAPP_URL,
};
