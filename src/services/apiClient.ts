/**
 * InfinityHub API Client
 * Centralized HTTP client for communicating with the InfinityHub backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/** Fired when the server rejects the stored token so the app can drop back to guest mode. */
export const AUTH_EXPIRED_EVENT = 'infinityhub:auth-expired';

/** Error from the API. `status === 0` means the server could not be reached at all. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// localStorage can throw (private mode / blocked storage); fall back to memory so the app still works.
const memoryStore: Record<string, string> = {};
function readStore(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return memoryStore[key] ?? null;
  }
}
function writeStore(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    memoryStore[key] = value;
  }
}
function removeStore(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    delete memoryStore[key];
  }
}

export function getGuestId(): string {
  let guestId = readStore('infinityhub_guest_id');
  if (!guestId) {
    const random =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID().replace(/-/g, '')
        : Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    guestId = 'guest_' + random;
    writeStore('infinityhub_guest_id', guestId);
  }
  return guestId;
}

export function getAuthToken(): string | null {
  return readStore('infinityhub_auth_token');
}

export function setAuthToken(token: string): void {
  writeStore('infinityhub_auth_token', token);
}

export function clearAuthToken(): void {
  removeStore('infinityhub_auth_token');
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

function buildHeaders(extra?: HeadersInit, json = true): Record<string, string> {
  const headers: Record<string, string> = { 'x-guest-id': getGuestId() };
  if (json) headers['Content-Type'] = 'application/json';
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return { ...headers, ...(extra as Record<string, string> | undefined) };
}

async function parseResponse<T>(response: Response, hadToken: boolean): Promise<T> {
  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: response.statusText };
    }
    // A rejected token must not linger, otherwise every request keeps failing.
    if (response.status === 401 && hadToken) {
      clearAuthToken();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    throw new ApiError(errorData.error || errorData.message || `API Error: ${response.status}`, response.status);
  }

  if (response.status === 204) return undefined as T;
  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError('The server returned an unreadable response.', response.status);
  }
}

async function send(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch {
    throw new ApiError('Cannot reach the InfinityHub server. Please check your connection.', 0);
  }
}

export async function apiRequest<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...restOptions } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const hadToken = !!getAuthToken();
  const response = await send(url, { ...restOptions, headers: buildHeaders(headers) });
  return parseResponse<T>(response, hadToken);
}

export const api = {
  get: <T = any>(endpoint: string, params?: Record<string, any>) =>
    apiRequest<T>(endpoint, { method: 'GET', params }),

  post: <T = any>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T = any>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, {
      method: 'DELETE',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  upload: async <T = any>(endpoint: string, formData: FormData): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const hadToken = !!getAuthToken();
    // No Content-Type: the browser must set the multipart boundary itself.
    const response = await send(url, { method: 'POST', body: formData, headers: buildHeaders(undefined, false) });
    return parseResponse<T>(response, hadToken);
  },
};
