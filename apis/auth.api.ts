import api from './axiosInstance';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  VerifyOtpData, 
  ProfileResponse,
  ApiResponse
} from '@/types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/user/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/user/register', data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/verify/otp', data);
    return response.data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>('/user/profile');
    return response.data;
  },

  logout: async () => {
    // Usually frontend only, but can be API call
    return { success: true };
  }
};
