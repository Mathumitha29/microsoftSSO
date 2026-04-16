'use client';
import { useState, useEffect } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { AccountInfo, InteractionRequiredAuthError } from '@azure/msal-browser';
import { loginRequest } from '@/lib/msalConfig';
export interface DecodedToken { name: string | null; preferred_username: string | null; oid: string | null; roles: string[]; exp: number | null; }
export function useAuth() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const account: AccountInfo | null = accounts[0] ?? null;
  useEffect(() => { if (isAuthenticated && account) void acquireAndDecode(); else { setAccessToken(null); setDecodedToken(null); } }, [isAuthenticated]);
  async function acquireAndDecode() {
    if (!account) return;
    setLoading(true); setError(null);
    try {
      let token: string;
      try { token = (await instance.acquireTokenSilent({ ...loginRequest, account })).accessToken; }
      catch (e) { if (e instanceof InteractionRequiredAuthError) token = (await instance.acquireTokenPopup({ ...loginRequest, account })).accessToken; else throw e; }
      setAccessToken(token);
      const res = await fetch('/api/auth/decode', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accessToken: token }) });
      if (!res.ok) throw new Error('Decode failed');
      setDecodedToken(await res.json());
    } catch { setError('Failed to acquire or decode token.'); }
    finally { setLoading(false); }
  }
  async function login() { setError(null); try { await instance.loginPopup(loginRequest); } catch { setError('Login failed.'); } }
  async function logout() { try { await instance.logoutPopup({ account: account ?? undefined }); } catch { } }
  return { account, isAuthenticated, accessToken, decodedToken, loading, error, login, logout };
}