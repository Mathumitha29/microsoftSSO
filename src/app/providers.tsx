"use client";

import { useState, useEffect, ReactNode } from "react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { fetchMsalConfig } from "@/lib/msalConfig";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [msalInstance, setMsalInstance] =
    useState<PublicClientApplication | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMsalConfig()
      .then(setMsalInstance)
      .catch((err) => {
        console.error("Failed to initialise MSAL:", err);
        setError("Authentication configuration failed. Please try again.");
      });
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!msalInstance) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading authentication…</p>
      </div>
    );
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
