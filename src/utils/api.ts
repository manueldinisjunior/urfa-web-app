export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
const base = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
export class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }
let refresh: Promise<unknown> | null = null;
export async function api<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
 const response = await fetch(`${base}${path}`, { ...options, credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-Urfa-Request': '1', ...options.headers } });
 if (response.status === 401 && retry && !path.startsWith('/customer/') && !path.startsWith('/auth/login') && !path.startsWith('/auth/refresh') && path !== '/auth/logout') {
  if (!refresh) refresh = api('/auth/refresh', { method: 'POST', body: '{}' }, false).finally(() => { refresh = null; });
  try { await refresh; return api<T>(path, options, false); } catch { window.dispatchEvent(new Event('urfa:logout')); }
 }
 const data = await response.json().catch(() => ({ error: 'Dienst nicht erreichbar. Bitte später erneut versuchen.' }));
 if (!response.ok) throw new ApiError(response.status, data.error || 'Anfrage fehlgeschlagen');
 return data as T;
}
export const mutate = <T>(path: string, method: string, body: unknown = {}) => api<T>(path, { method, body: JSON.stringify(body) });
