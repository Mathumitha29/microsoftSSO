"use client";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

const LoginButton = () => {
  const { login, logout, isAuthenticated, accessToken, decodedToken } = useAuth();

  useEffect(() => {
    // Add any side effects here if necessary
  }, [isAuthenticated]);

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={login}>Sign in with Microsoft</button>
      ) : (
        <div>
          <div>{decodedToken?.name}</div>
          <button onClick={logout}>Sign out</button>
          <pre>{JSON.stringify(accessToken, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default LoginButton;