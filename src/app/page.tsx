"use client";

import { useAuth } from "@/hooks/useAuth";
import LoginButton from "@/components/LoginButton";

export default function Home() {
  const { isAuthenticated, decodedToken, account } = useAuth();

  const expiry = decodedToken?.exp
    ? new Date(decodedToken.exp * 1000).toLocaleString()
    : null;

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Microsoft SSO Demo</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Next.js 16 · MSAL · JWT Decode
      </p>

      <LoginButton />

      {isAuthenticated && decodedToken && (
        <section
          style={{
            marginTop: "2rem",
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: "1.5rem",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Welcome, {account?.name ?? decodedToken.name ?? "User"}!
          </h2>

          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              {[
                { label: "Name", value: decodedToken.name },
                {
                  label: "Email",
                  value: decodedToken.preferred_username,
                },
                { label: "Object ID", value: decodedToken.oid },
                {
                  label: "Roles",
                  value: decodedToken.roles
                    ? (decodedToken.roles as string[]).join(", ")
                    : "—",
                },
                { label: "Token Expiry", value: expiry },
              ].map(({ label, value }) => (
                <tr
                  key={label}
                  style={{ borderBottom: "1px solid #f0f0f0" }}
                >
                  <td
                    style={{
                      padding: "0.5rem 0.75rem 0.5rem 0",
                      fontWeight: 600,
                      width: 160,
                      color: "#555",
                    }}
                  >
                    {label}
                  </td>
                  <td style={{ padding: "0.5rem 0" }}>
                    {value ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
