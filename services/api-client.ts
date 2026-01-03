import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { session } from './session';
import { ApiError, NetworkError, UnauthorizedError } from '@/types/api';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.iamwarpspeed.com';
const DEFAULT_TIMEOUT = 40000; // 40 seconds
const CHAT_TIMEOUT = 120000; // 120 seconds

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Create axios instance with base configuration
 */
const createAxiosInstance = (timeout = DEFAULT_TIMEOUT): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor: Add Bearer token to Authorization header
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = session.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor: Handle errors and token refresh
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 401 Unauthorized - attempt token refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers && token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return instance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt to refresh token via authenticate endpoint
          const token = session.getToken();
          if (token) {
            const response = await axios.get(`${API_BASE_URL}/auth/authenticate`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            // If authenticate succeeds, token is still valid
            // Retry the original request
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            processQueue(null, token);
            isRefreshing = false;
            return instance(originalRequest);
          } else {
            throw new UnauthorizedError('No token available');
          }
        } catch (refreshError) {
          // Token refresh failed - clear session and reject
          processQueue(
            new UnauthorizedError('Session expired. Please login again.'),
            null
          );
          isRefreshing = false;
          session.clearSession();

          // Redirect to login if in browser
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }

          return Promise.reject(
            new UnauthorizedError('Session expired. Please login again.')
          );
        }
      }

      // Handle other errors
      return Promise.reject(transformError(error));
    }
  );

  return instance;
};

/**
 * Transform axios error to application error
 */
function transformError(error: AxiosError): Error {
  if (!error.response) {
    // Network error or timeout
    if (error.code === 'ECONNABORTED') {
      return new NetworkError('Request timeout. Please try again.');
    }
    return new NetworkError(
      error.message || 'Network error. Please check your connection.'
    );
  }

  const status = error.response.status;
  const data = error.response.data;
  const message =
    (data as { message?: string })?.message ||
    error.message ||
    `Request failed with status ${status}`;

  switch (status) {
    case 401:
      return new UnauthorizedError(message);
    case 403:
      return new ApiError('Forbidden', 403, data);
    case 404:
      return new ApiError('Resource not found', 404, data);
    case 500:
      return new ApiError('Server error. Please try again later.', 500, data);
    default:
      return new ApiError(message, status, data);
  }
}

// Default axios instance for regular requests (40s timeout)
export const apiClient = createAxiosInstance(DEFAULT_TIMEOUT);

// Separate axios instance for chat messages (120s timeout)
export const chatApiClient = createAxiosInstance(CHAT_TIMEOUT);

