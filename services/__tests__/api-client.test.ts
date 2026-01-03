import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AxiosError } from 'axios';
import { ApiError, NetworkError, UnauthorizedError } from '@/types/api';

describe('api-client error types', () => {
  describe('error transformation', () => {
    it('should create NetworkError for network issues', () => {
      const error = new NetworkError('Network error');
      expect(error).toBeInstanceOf(NetworkError);
      expect(error.message).toBe('Network error');
    });

    it('should create UnauthorizedError for 401 errors', () => {
      const error = new UnauthorizedError('Unauthorized');
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect(error.statusCode).toBe(401);
    });

    it('should create ApiError for other HTTP errors', () => {
      const error = new ApiError('Forbidden', 403);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(403);
    });

    it('should create ApiError with data', () => {
      const errorData = { code: 'FORBIDDEN' };
      const error = new ApiError('Forbidden', 403, errorData);
      expect(error.data).toEqual(errorData);
    });
  });
});

