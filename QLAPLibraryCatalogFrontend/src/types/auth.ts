
// Types for login
export interface LoginRequest {
  email: string;
  password: string;
}

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

export interface User {
  userId: number;
  email: string;
  username: string;
  userPreferences: any;
}

//Types for register

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  userPreferences: any;
}

export interface RegisterResponse {
  userId: number;
  email: string;
  username: string;
  userPreferences: any;
}