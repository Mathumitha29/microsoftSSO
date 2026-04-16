"use client";

import { useState, useCallback, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { AccountInfo, InteractionRequiredAuthError, EventType, AuthenticationResult } from "@azure/msal-browser";

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
  login: () => void;
  logout: () => void;
  acquireTokenAndDecode: () => Promise<void>;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const { instance, accounts } = useMsal();
  const account = accounts[0] ?? null;
  const isAuthenticated = !!account;
  const [claims, setClaims] = useState<DecodedClaims | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle redirect response on page load
  useEffect(() => {
    instance.handleRedirectPromise()
      .then((response: AuthenticationResult | null) => {
        if (response) {
          // User just logged in via redirect
          instance.setActiveAccount(response.account);
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Redirect handling failed");
      });
  }, [instance]);

  // Listen for login success events
  useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload as AuthenticationResult;
        instance.setActiveAccount(payload.account);
      }
    });

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, [instance]);

  const login = useCallback(() => {
    setError(null);
    instance.loginRedirect({
      scopes: ["User.Read"],
    }).catch((err) => {
      setError(err instanceof Error ? err.message : "Login failed");
    });
  }, [instance]);

  const logout = useCallback(() => {
    setError(null);
    setClaims(null);
    instance.logoutRedirect().catch((err) => {
      setError(err instanceof Error ? err.message : "Logout failed");
    });
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
          // Use redirect instead of popup
          instance.acquireTokenRedirect({
            scopes: ["User.Read"],
            account,
          });
          return; // Will redirect, so exit here
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
