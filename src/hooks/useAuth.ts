"use client";

import { useState, useCallback } from "react";
import { useMsal } from "@azure/msal-react";
import { AccountInfo, InteractionRequiredAuthError } from "@azure/msal-browser";

interface DecodedClaims {
  name?: string;
  preferred_username?: string;
  oid?: string;
  roles?: string[];
  exp?: number;
}

interface UseAuthReturn {
  account: AccountInfo | null;
  claims: DecodedClaims | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  acquireTokenAndDecode: () => Promise<void>;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const { instance, accounts } = useMsal();
  const account = accounts[0] ?? null;
  const isAuthenticated = !!account;
  const [claims, setClaims] = useState<DecodedClaims | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async () => {
    try {
      setError(null);
      await instance.loginPopup({
        scopes: ["User.Read"],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }, [instance]);

  const logout = useCallback(async () => {
    try {
      setError(null);
      setClaims(null);
      await instance.logoutPopup();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed");
    }
  }, [instance]);

  const acquireTokenAndDecode = useCallback(async () => {
    if (!account) {
      setError("No account found. Please log in first.");
      return;
    }

    try {
      setError(null);
      let tokenResponse;
      try {
        tokenResponse = await instance.acquireTokenSilent({
          scopes: ["User.Read"],
          account,
        });
      } catch (silentError) {
        if (silentError instanceof InteractionRequiredAuthError) {
          tokenResponse = await instance.acquireTokenPopup({
            scopes: ["User.Read"],
            account,
          });
        } else {
          throw silentError;
        }
      }

      // Decode the access token server-side — never call jwtDecode in the browser
      const res = await fetch("/api/auth/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: tokenResponse.accessToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to decode token");
      }

      const decoded = await res.json();
      setClaims(decoded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Token acquisition failed");
    }
  }, [instance, account]);

  return {
    account,
    claims,
    isAuthenticated,
    login,
    logout,
    acquireTokenAndDecode,
    error,
  };
}
