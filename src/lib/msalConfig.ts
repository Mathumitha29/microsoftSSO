"use client";

import { Configuration, PublicClientApplication } from "@azure/msal-browser";

/**
 * Fetches MSAL configuration from the server-side API route.
 * This keeps AZURE_TENANT_ID and the authority URL server-side only.
 */
export async function fetchMsalConfig(): Promise<PublicClientApplication> {
  const res = await fetch("/api/auth/config");
  if (!res.ok) {
    throw new Error("Failed to fetch MSAL configuration from server");
  }

  const { clientId, authority, redirectUri } = await res.json();

  const msalConfig: Configuration = {
    auth: {
      clientId,
      authority,
      redirectUri,
    },
    cache: {
      cacheLocation: "sessionStorage",
    },
  };

  const msalInstance = new PublicClientApplication(msalConfig);
  await msalInstance.initialize();
  return msalInstance;
}
