export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified?: boolean;
  createdAt?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface AuthResponse extends ApiResponse {
  data?: {
    token: string;
    user: User;
  };
}

export interface ProfileResponse extends ApiResponse {
  data?: User;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
  type: 'REGISTRATION' | 'PASSWORD_RESET';
}
