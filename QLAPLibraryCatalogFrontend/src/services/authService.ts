import api from './apiService';

// Types for login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  userId: number;
  email: string;
  username: string;
  userPreferences: any;
}

// Backend API response types
export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: {
    userId: number;
    email: string;
    username: string;
    userPreferences: any;
  };
}

export const authService = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/Users/Login', credentials);
    return response.data;
  },

  // Add other auth methods as needed
  // async logout() { ... }
  // async refreshToken() { ... }
};