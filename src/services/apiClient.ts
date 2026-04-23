import { API_CONFIG } from '../config/apiConfig';
import { AUTH_STORAGE_KEYS, clearAuthSession, readStoredTokens } from './authStorage';

interface ApiError {
  code?: string;
  message: string;
}

interface ApiEnvelope<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T;
  errors: ApiError[];
  traceId: string;
  timestampUtc: string;
}

class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<string | null> | null = null;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const { accessToken, refreshToken } = readStoredTokens();

      if (!accessToken || !refreshToken) {
        return null;
      }

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken,
          refreshToken,
        }),
      });

      if (!response.ok) {
        clearAuthSession();
        return null;
      }

      const payload = await response.json() as ApiEnvelope<{
        accessToken: string;
        refreshToken: string;
      }>;
      const nextAccessToken = payload.data?.accessToken ?? null;
      const nextRefreshToken = payload.data?.refreshToken ?? null;

      if (!nextAccessToken || !nextRefreshToken) {
        clearAuthSession();
        return null;
      }

      localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, nextAccessToken);
      localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, nextRefreshToken);

      return nextAccessToken;
    })().finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  private async rawRequest(endpoint: string, options: RequestInit = {}, skipAuthRefresh = false): Promise<Response> {
    const { accessToken } = readStoredTokens();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
    });

    if (response.status === 401 && !skipAuthRefresh && !endpoint.startsWith('/auth/')) {
      const refreshedAccessToken = await this.refreshAccessToken();

      if (refreshedAccessToken) {
        return fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshedAccessToken}`,
            ...options.headers,
          },
        });
      }

      clearAuthSession();
      window.location.assign('/login');
    }

    return response;
  }

  async request<T>(endpoint: string, options: RequestInit = {}, skipAuthRefresh = false): Promise<T> {
    if (API_CONFIG.IS_MOCK) {
      console.log(`[Mock API] Request to: ${this.baseUrl}${endpoint}`, options);
    }

    const response = await this.rawRequest(endpoint, options, skipAuthRefresh);

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({ message: 'An error occurred' })) as Partial<ApiEnvelope<unknown>> & { message?: string };
      const firstError = errorPayload.errors?.[0]?.message;

      throw new Error(firstError || errorPayload.message || 'Network response was not ok');
    }

    const payload = await response.json() as ApiEnvelope<T> | T;

    if (typeof payload === 'object' && payload !== null && 'isSuccess' in payload) {
      return (payload as ApiEnvelope<T>).data;
    }

    return payload as T;
  }

  get<T>(endpoint: string, options?: RequestInit, skipAuthRefresh?: boolean) {
    return this.request<T>(endpoint, { ...options, method: 'GET' }, skipAuthRefresh);
  }

  post<T>(endpoint: string, data: unknown, options?: RequestInit, skipAuthRefresh?: boolean) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }, skipAuthRefresh);
  }

  put<T>(endpoint: string, data: unknown, options?: RequestInit, skipAuthRefresh?: boolean) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }, skipAuthRefresh);
  }

  delete<T>(endpoint: string, options?: RequestInit, skipAuthRefresh?: boolean) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' }, skipAuthRefresh);
  }
}

export const apiClient = new ApiClient();
