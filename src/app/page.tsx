"use client";
import { useAuth } from "../hooks/useAuth";

export default function Page() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <h1>Microsoft SSO</h1>
      {isAuthenticated ? <p>Welcome back!</p> : <p>Please sign in.</p>}
      <LoginButton />
    </div>
  );
}