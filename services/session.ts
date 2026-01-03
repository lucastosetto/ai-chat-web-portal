import Cookies from 'js-cookie';

const TOKEN_COOKIE_NAME = 'auth_token';
const TOKEN_EXPIRY_DAYS = 7;

/**
 * Session management utilities for token storage and retrieval
 */
export const session = {
  /**
   * Get the authentication token from cookies
   */
  getToken(): string | undefined {
    return Cookies.get(TOKEN_COOKIE_NAME);
  },

  /**
   * Set the authentication token in cookies
   */
  setToken(token: string): void {
    Cookies.set(TOKEN_COOKIE_NAME, token, {
      expires: TOKEN_EXPIRY_DAYS,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  },

  /**
   * Remove the authentication token from cookies
   */
  clearToken(): void {
    Cookies.remove(TOKEN_COOKIE_NAME);
  },

  /**
   * Check if a token exists
   */
  hasToken(): boolean {
    return !!this.getToken();
  },

  /**
   * Clear all session data
   */
  clearSession(): void {
    this.clearToken();
  },
};

