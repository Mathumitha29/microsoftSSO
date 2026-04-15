"use client";

import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { jwtDecode } from "jwt-decode";
import { loginRequest } from "@/lib/msalConfig";

export interface DecodedToken {
  name?: string;
  preferred_username?: string;
  oid?: string;
  roles?: string[];
  exp?: number;
  [key: string]: unknown;
}

export function useAuth() {
  const { instance, accounts } = useMsal();
  const account = accounts[0] ?? null;
  const isAuthenticated = accounts.length > 0;

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!account) {
      setAccessToken(null);
      setDecodedToken(null);
      return;
    }

    instance
      .acquireTokenSilent({ ...loginRequest, account })
      .then((response) => {
        const token = response.accessToken;
        setAccessToken(token);
        setDecodedToken(jwtDecode<DecodedToken>(token));
        setError(null);
      })
      .catch(() => {
        // Silent acquisition failed – fall back to popup
        instance
          .acquireTokenPopup({ ...loginRequest, account })
          .then((response) => {
            const token = response.accessToken;
            setAccessToken(token);
            setDecodedToken(jwtDecode<DecodedToken>(token));
            setError(null);
          })
          .catch((err: unknown) => {
            const message =
              err instanceof Error ? err.message : "Token acquisition failed";
            setError(message);
          });
      });
  }, [instance, account]);

  const login = async () => {
    try {
      await instance.loginPopup(loginRequest);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    }
  };

  const logout = async () => {
    try {
      await instance.logoutPopup();
      setAccessToken(null);
      setDecodedToken(null);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Logout failed";
      setError(message);
    }
  };

  return {
    login,
    logout,
    account,
    isAuthenticated,
    accessToken,
    decodedToken,
    error,
  };
}
