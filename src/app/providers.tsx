'use client';
import { useEffect, useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { fetchMsalConfig } from '@/lib/msalConfig';
import { ReactNode } from 'react';
export function Providers({ children }: { children: ReactNode }) {
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchMsalConfig().then(config => setMsalInstance(new PublicClientApplication(config))).catch(() => setError('Failed to initialise Microsoft login.'));
  }, []);
  if (error) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-600">{error}</p></div>;
  if (!msalInstance) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}