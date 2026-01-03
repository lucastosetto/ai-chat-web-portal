import { apiClient } from './api-client';
import { session } from './session';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  UpdateUserRequest,
  RequestPasswordResetRequest,
  RequestPasswordResetResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SocialAuthResponse,
} from '@/types/api';

/**
 * Authentication service for handling user authentication and profile management
 */
export const authService = {
  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    const token = response.data.token || response.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      session.setToken(token);
    }
    
    return response.data;
  },

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    const token = response.data.token || response.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      session.setToken(token);
    }
    
    return response.data;
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      session.clearSession();
    }
  },

  /**
   * Get current user profile
   */
  async getUserProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/user');
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateUserProfile(data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>('/auth/user', data);
    return response.data;
  },

  /**
   * Initiate Google OAuth sign-in
   */
  async googleSignIn(): Promise<SocialAuthResponse> {
    const response = await apiClient.get<SocialAuthResponse>('/auth/user/google');
    return response.data;
  },

  /**
   * Initiate Apple OAuth sign-in
   */
  async appleSignIn(): Promise<SocialAuthResponse> {
    const response = await apiClient.get<SocialAuthResponse>('/auth/user/apple');
    return response.data;
  },

  /**
   * Initiate Facebook OAuth sign-in
   */
  async facebookSignIn(): Promise<SocialAuthResponse> {
    const response = await apiClient.get<SocialAuthResponse>('/auth/user/facebook');
    return response.data;
  },

  /**
   * Request password reset email
   */
  async requestPasswordReset(
    data: RequestPasswordResetRequest
  ): Promise<RequestPasswordResetResponse> {
    const response = await apiClient.post<RequestPasswordResetResponse>(
      '/auth/request-reset-password',
      data
    );
    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await apiClient.put<ResetPasswordResponse>(
      '/auth/reset-password',
      data
    );
    return response.data;
  },

  /**
   * Authenticate/validate current token
   */
  async authenticate(): Promise<{ authenticated: boolean }> {
    try {
      await apiClient.get('/auth/authenticate');
      return { authenticated: true };
    } catch {
      return { authenticated: false };
    }
  },
};

