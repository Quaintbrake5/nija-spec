import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiError, ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiService {
  private readonly instance: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && originalRequest) {
          // Try to refresh token
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.instance.post('/auth/refresh', {
                refreshToken,
              });
              const { accessToken, refreshToken: newRefreshToken } = response.data;
              this.setAccessToken(accessToken);
              localStorage.setItem('refreshToken', newRefreshToken);

              // Retry original request
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.instance(originalRequest);
            }
          } catch {
            // Refresh failed, clear tokens and redirect to login
            this.clearAccessToken();
            localStorage.removeItem('refreshToken');
            globalThis.location.href = '/login';
          }
        }

        // Format error response
        const apiError: ApiError = {
          message: 'An error occurred',
          code: 'UNKNOWN_ERROR',
        };

        if (error.response?.data) {
          const responseData = error.response.data as Record<string, unknown>;
          apiError.message = (responseData.message as string) || error.message;
          apiError.code = (responseData.code as string) || `HTTP_${error.response.status}`;
          apiError.details = responseData.details as Record<string, unknown>;
        } else if (error.request) {
          apiError.message = 'Network error - please check your connection';
          apiError.code = 'NETWORK_ERROR';
        }

        throw apiError;
      }
    );
  }

  setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  clearAccessToken(): void {
    this.accessToken = null;
  }

  async get<TResponse, TParams = Record<string, unknown>>(url: string, params?: TParams): Promise<ApiResponse<TResponse>> {
    const response = await this.instance.get<ApiResponse<TResponse>>(url, { params });
    return response.data;
  }

  async post<TResponse, TRequest = unknown>(url: string, data?: TRequest): Promise<ApiResponse<TResponse>> {
    const response = await this.instance.post<ApiResponse<TResponse>>(url, data);
    return response.data;
  }

  async put<TResponse, TRequest = unknown>(url: string, data?: TRequest): Promise<ApiResponse<TResponse>> {
    const response = await this.instance.put<ApiResponse<TResponse>>(url, data);
    return response.data;
  }

  async delete<TResponse>(url: string): Promise<ApiResponse<TResponse>> {
    const response = await this.instance.delete<ApiResponse<TResponse>>(url);
    return response.data;
  }

  async upload<TResponse>(url: string, formData: FormData): Promise<ApiResponse<TResponse>> {
    const response = await this.instance.post<ApiResponse<TResponse>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
