import { describe, it, expect, beforeEach, vi } from 'vitest';
import Cookies from 'js-cookie';
import { session } from '../session';

// Mock js-cookie
vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

describe('session', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getToken', () => {
    it('should return token from cookies', () => {
      const mockToken = 'test-token-123';
      vi.mocked(Cookies.get).mockReturnValue(mockToken);

      const token = session.getToken();

      expect(Cookies.get).toHaveBeenCalledWith('auth_token');
      expect(token).toBe(mockToken);
    });

    it('should return undefined when no token exists', () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined);

      const token = session.getToken();

      expect(token).toBeUndefined();
    });
  });

  describe('setToken', () => {
    it('should set token in cookies with correct options', () => {
      const mockToken = 'test-token-123';
      const originalEnv = process.env.NODE_ENV;

      process.env.NODE_ENV = 'production';
      session.setToken(mockToken);

      expect(Cookies.set).toHaveBeenCalledWith('auth_token', mockToken, {
        expires: 7,
        sameSite: 'strict',
        secure: true,
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('should set secure to false in development', () => {
      const mockToken = 'test-token-123';
      const originalEnv = process.env.NODE_ENV;

      process.env.NODE_ENV = 'development';
      session.setToken(mockToken);

      expect(Cookies.set).toHaveBeenCalledWith('auth_token', mockToken, {
        expires: 7,
        sameSite: 'strict',
        secure: false,
      });

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('clearToken', () => {
    it('should remove token from cookies', () => {
      session.clearToken();

      expect(Cookies.remove).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('hasToken', () => {
    it('should return true when token exists', () => {
      vi.mocked(Cookies.get).mockReturnValue('test-token');

      expect(session.hasToken()).toBe(true);
    });

    it('should return false when no token exists', () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined);

      expect(session.hasToken()).toBe(false);
    });
  });

  describe('clearSession', () => {
    it('should clear token', () => {
      session.clearSession();

      expect(Cookies.remove).toHaveBeenCalledWith('auth_token');
    });
  });
});

