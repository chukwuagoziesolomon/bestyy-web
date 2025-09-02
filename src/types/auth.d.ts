declare namespace Auth {
  interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: 'user' | 'vendor' | 'courier' | 'admin';
    date_joined?: string;
    last_login?: string;
  }

  interface AuthResponse {
    access: string;
    refresh: string;
    user: User;
  }

  interface LoginCredentials {
    email: string;
    password: string;
  }

  interface SignupData extends LoginCredentials {
    first_name: string;
    last_name: string;
    phone: string;
    confirmPassword: string;
  }



  interface AuthError {
    code?: string;
    message: string;
    details?: Record<string, string[]>;
  }
}

export default Auth;
