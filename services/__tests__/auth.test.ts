import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../auth';
import { apiClient } from '../api-client';
import { session } from '../session';
import type {
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
} from '@/types/api';

// Mock dependencies
vi.mock('../api-client');
vi.mock('../session');

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call API and set token on success', async () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        data: { token: 'new-token-123', user: { id: '1', email: 'test@example.com' } },
        headers: {},
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse as any);

      const result = await authService.login(loginData);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', loginData);
      expect(session.setToken).toHaveBeenCalledWith('new-token-123');
      expect(result).toEqual(mockResponse.data);
    });

    it('should extract token from Authorization header if not in body', async () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        data: { user: { id: '1', email: 'test@example.com' } },
        headers: { authorization: 'Bearer header-token-123' },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse as any);

      await authService.login(loginData);

      expect(session.setToken).toHaveBeenCalledWith('header-token-123');
    });
  });

  describe('register', () => {
    it('should call API and set token on success', async () => {
      const registerData: RegisterRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const mockResponse = {
        data: { token: 'new-token-123', user: { id: '1', email: 'test@example.com' } },
        headers: {},
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse as any);

      const result = await authService.register(registerData);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', registerData);
      expect(session.setToken).toHaveBeenCalledWith('new-token-123');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('logout', () => {
    it('should call API and clear session', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: {} } as any);

      await authService.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
      expect(session.clearSession).toHaveBeenCalled();
    });

    it('should clear session even if API call fails', async () => {
      vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'));

      await expect(authService.logout()).rejects.toThrow();
      expect(session.clearSession).toHaveBeenCalled();
    });
  });

  describe('getUserProfile', () => {
    it('should fetch user profile', async () => {
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
      };

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockUser } as any);

      const result = await authService.getUserProfile();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/user');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile', async () => {
      const updateData: UpdateUserRequest = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const mockUser = {
        id: '1',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'test@example.com',
      };

      vi.mocked(apiClient.put).mockResolvedValue({ data: mockUser } as any);

      const result = await authService.updateUserProfile(updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/auth/user', updateData);
      expect(result).toEqual(mockUser);
    });
  });

  describe('social sign-in', () => {
    it('should initiate Google sign-in', async () => {
      const mockResponse = { data: { url: 'https://google-oauth-url.com' } };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse as any);

      const result = await authService.googleSignIn();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/user/google');
      expect(result).toEqual(mockResponse.data);
    });

    it('should initiate Apple sign-in', async () => {
      const mockResponse = { data: { url: 'https://apple-oauth-url.com' } };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse as any);

      const result = await authService.appleSignIn();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/user/apple');
      expect(result).toEqual(mockResponse.data);
    });

    it('should initiate Facebook sign-in', async () => {
      const mockResponse = { data: { url: 'https://facebook-oauth-url.com' } };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse as any);

      const result = await authService.facebookSignIn();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/user/facebook');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('password reset', () => {
    it('should request password reset', async () => {
      const requestData: RequestPasswordResetRequest = {
        email: 'test@example.com',
      };

      const mockResponse = { data: { message: 'Reset email sent' } };
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse as any);

      const result = await authService.requestPasswordReset(requestData);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/request-reset-password',
        requestData
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should reset password', async () => {
      const resetData: ResetPasswordRequest = {
        id: 'reset-token-123',
        newPassword: 'newpassword123',
        confirmNewPassword: 'newpassword123',
      };

      const mockResponse = { data: { message: 'Password reset successful' } };
      vi.mocked(apiClient.put).mockResolvedValue(mockResponse as any);

      const result = await authService.resetPassword(resetData);

      expect(apiClient.put).toHaveBeenCalledWith('/auth/reset-password', resetData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('authenticate', () => {
    it('should return authenticated true on success', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: {} } as any);

      const result = await authService.authenticate();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/authenticate');
      expect(result).toEqual({ authenticated: true });
    });

    it('should return authenticated false on failure', async () => {
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Unauthorized'));

      const result = await authService.authenticate();

      expect(result).toEqual({ authenticated: false });
    });
  });
});

