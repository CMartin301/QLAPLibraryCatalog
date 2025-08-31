import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from '../types/auth';
import api from './apiService';
export const authService = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/Users/Login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<User>('/api/Users', userData);
    return response.data;
  }
  // Add other auth methods as needed
  // async logout() { ... }
  // async refreshToken() { ... }
};