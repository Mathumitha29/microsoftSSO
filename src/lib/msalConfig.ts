import { Configuration, PopupRequest } from '@azure/msal-browser';
export async function fetchMsalConfig(): Promise<Configuration> {
  const res = await fetch('/api/auth/config');
  if (!res.ok) throw new Error('Failed to load MSAL configuration from server.');
  const { clientId, authority, redirectUri } = await res.json();
  return { auth: { clientId, authority, redirectUri }, cache: { cacheLocation: 'localStorage', storeAuthStateInCookie: false } };
}
export const loginRequest: PopupRequest = { scopes: ['openid', 'profile', 'User.Read'] };
