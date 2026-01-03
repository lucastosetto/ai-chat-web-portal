import { apiClient } from './api-client';
import { session } from './session';
import type {
  RequestMagicLinkRequest,
  RequestMagicLinkResponse,
  VerifyMagicLinkResponse,
  User,
  UpdateUserRequest,
} from '@/types/api';

// Check if mock mode is enabled (only in development)
// NEXT_PUBLIC_ prefix makes it available on both client and server
const isMockModeEnabled =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

/**
 * Mock user data for development
 */
const mockUser: User = {
  id: 'mock-user-123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@example.com',
};

/**
 * Authentication service for handling user authentication and profile management
 */
export const authService = {
  /**
   * Request a magic link to be sent to the user's email
   * NOTE: This endpoint is not yet in the API specification and is mocked
   */
  async requestMagicLink(email: string): Promise<RequestMagicLinkResponse> {
    // Use mock response in development mode
    if (isMockModeEnabled) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        message: 'Magic link sent! (Mock mode - check console for token)',
      };
    }

    const data: RequestMagicLinkRequest = { email };
    const response = await apiClient.post<RequestMagicLinkResponse>(
      '/auth/magic-link/request',
      data
    );
    return response.data;
  },

  /**
   * Verify a magic link token and authenticate the user
   * NOTE: This endpoint is not yet in the API specification and is mocked
   */
  async verifyMagicLink(token: string): Promise<VerifyMagicLinkResponse> {
    // Use mock response in development mode
    if (isMockModeEnabled) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockToken = 'mock-auth-token-' + Date.now();
      session.setToken(mockToken);
      
      if (typeof window !== 'undefined') {
        console.log('🔐 Mock Authentication - Token:', mockToken);
        console.log('👤 Mock User:', mockUser);
      }
      
      return {
        token: mockToken,
        user: mockUser,
        message: 'Successfully authenticated (Mock mode)',
      };
    }

    const response = await apiClient.get<VerifyMagicLinkResponse>(
      `/auth/magic-link/verify?token=${encodeURIComponent(token)}`
    );
    const authToken = response.data.token || response.headers.authorization?.replace('Bearer ', '');
    
    if (authToken) {
      session.setToken(authToken);
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
    // Use mock response in development mode
    if (isMockModeEnabled) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockUser;
    }

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
   * Authenticate/validate current token
   */
  async authenticate(): Promise<{ authenticated: boolean }> {
    // Use mock response in development mode
    if (isMockModeEnabled) {
      const hasToken = session.hasToken();
      return { authenticated: hasToken };
    }

    try {
      await apiClient.get('/auth/authenticate');
      return { authenticated: true };
    } catch {
      return { authenticated: false };
    }
  },
};

