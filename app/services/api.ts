import { API_BASE_URL } from '../constants/api';
import { useAuthStore } from '../store/authStore';

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const token = useAuthStore.getState().token;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      return { data: null, error: data.detail || data.error || 'API Request failed' };
    }

    return { data: data as T, error: null };
  } catch (err) {
    console.warn(`[API] Failed to fetch ${endpoint}, returning fallback:`, err);
    return { data: null, error: 'Network unavailable. Operating in offline/cached mode.' };
  }
}
