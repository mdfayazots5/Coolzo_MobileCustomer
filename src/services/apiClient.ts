import { API_CONFIG } from '../config/apiConfig';

export interface ApiErrorItem {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T | null;
  errors: ApiErrorItem[];
  traceId?: string;
  timestampUtc?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

const ACCESS_TOKEN_KEY = 'coolzo.customer.accessToken';
const REFRESH_TOKEN_KEY = 'coolzo.customer.refreshToken';
const TOKEN_EXPIRY_KEY = 'coolzo.customer.expiresAtUtc';

export const tokenStorage = {
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setTokens(accessToken: string, refreshToken: string, expiresAtUtc?: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    if (expiresAtUtc) {
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAtUtc);
    }
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },
};

export class ApiClientError extends Error {
  status: number;
  code?: string;
  traceId?: string;
  errors: ApiErrorItem[];

  constructor(message: string, status: number, code?: string, traceId?: string, errors: ApiErrorItem[] = []) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.traceId = traceId;
    this.errors = errors;
  }
}

class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  private buildUrl(endpoint: string, params?: QueryParams) {
    const url = endpoint.startsWith('http') ? new URL(endpoint) : new URL(`${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
    return url.toString();
  }

  private buildHeaders(options: RequestInit = {}) {
    const headers = new Headers(options.headers);
    const token = tokenStorage.getAccessToken();

    if (!headers.has('Content-Type') && options.body) {
      headers.set('Content-Type', 'application/json');
    }
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const payload = await response.json().catch(() => null);
    const envelope = payload as ApiResponse<T> | null;

    if (!response.ok || envelope?.isSuccess === false) {
      throw new ApiClientError(
        envelope?.message || response.statusText || 'Request failed',
        response.status,
        envelope?.code,
        envelope?.traceId,
        envelope?.errors || [],
      );
    }

    if (envelope && typeof envelope === 'object' && 'isSuccess' in envelope && 'data' in envelope) {
      return envelope.data as T;
    }

    return payload as T;
  }

  private async refreshToken() {
    const accessToken = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new ApiClientError('Authentication is required.', 401, 'auth_required');
    }

    if (!this.refreshPromise) {
      this.refreshPromise = fetch(this.buildUrl('/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, refreshToken }),
      })
        .then((response) => this.parseResponse<{ accessToken: string; refreshToken: string; expiresAtUtc?: string }>(response))
        .then((tokens) => {
          tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken, tokens.expiresAtUtc);
        })
        .catch((error) => {
          tokenStorage.clear();
          throw error;
        })
        .finally(() => {
          this.refreshPromise = null;
        });
    }

    return this.refreshPromise;
  }

  async request<T>(endpoint: string, options: RequestInit = {}, params?: QueryParams): Promise<T> {
    if (API_CONFIG.IS_MOCK) {
      console.log(`[Mock API] Request to: ${this.baseUrl}${endpoint}`, options);
    }

    const request = () => fetch(this.buildUrl(endpoint, params), {
      ...options,
      headers: this.buildHeaders(options),
    });

    let response = await request();

    if (response.status === 401 && !endpoint.includes('/auth/refresh')) {
      await this.refreshToken();
      response = await request();
    }

    return this.parseResponse<T>(response);
  }

  get<T>(endpoint: string, params?: QueryParams, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' }, params);
  }

  post<T>(endpoint: string, data: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
