import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import jwtDecode from "jwt-decode";
import { useState, useEffect } from "react";

interface DecodedToken {
  name: string;
  preferred_username: string;
  oid: string;
  roles: string[];
  exp: number;
}

export const useAuth = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const getAccessToken = async () => {
      setLoading(true);
      try {
        const response = await instance.acquireTokenSilent({ scopes: ["openid", "profile", "User.Read"] });
        setAccessToken(response.accessToken);
        const decoded = jwtDecode<DecodedToken>(response.accessToken);
        setDecodedToken(decoded);
      } catch (err) {
        setError(err.message);
        // Fall back to popup if silent token acquisition fails
        try {
          const response = await instance.acquireTokenPopup({ scopes: ["openid", "profile", "User.Read"] });
          setAccessToken(response.accessToken);
          const decoded = jwtDecode<DecodedToken>(response.accessToken);
          setDecodedToken(decoded);
        } catch (popupErr) {
          setError(popupErr.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      getAccessToken();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, instance]);

  const login = () => {
    instance.loginPopup();
  };

  const logout = () => {
    instance.logoutPopup();
  };

  return { account: accounts[0], isAuthenticated, accessToken, decodedToken, loading, error, login, logout };
};