export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'vendor' | 'courier' | 'admin';
  date_joined?: string;
  last_login?: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface AuthError {
  code?: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface SocialAuthProvider {
  id: string;
  name: string;
  loginUrl: string;
  signupUrl: string;
  connectUrl: string;
}



export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  first_name: string;
  last_name: string;
  phone: string;
  confirmPassword: string;
}
