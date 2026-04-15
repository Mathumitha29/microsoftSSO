"use client";

import { useAuth } from "@/hooks/useAuth";

export default function LoginButton() {
  const { login, logout, account, isAuthenticated, decodedToken, error } =
    useAuth();

  return (
    <div>
      {!isAuthenticated ? (
        <button
          onClick={login}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 1.2rem",
            background: "#0078d4",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            fontSize: "1rem",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
          </svg>
          Sign in with Microsoft
        </button>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <span style={{ fontWeight: 600 }}>{account?.name}</span>
              {account?.username && (
                <span style={{ marginLeft: "0.5rem", color: "#666" }}>
                  ({account.username})
                </span>
              )}
            </div>
            <button
              onClick={logout}
              style={{
                padding: "0.4rem 1rem",
                background: "#fff",
                color: "#0078d4",
                border: "1px solid #0078d4",
                borderRadius: 4,
                fontSize: "0.9rem",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Sign out
            </button>
          </div>

          {decodedToken && (
            <div>
              <h3 style={{ marginBottom: "0.5rem" }}>Decoded Token Claims</h3>
              <pre
                style={{
                  background: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: "1rem",
                  borderRadius: 6,
                  overflowX: "auto",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  maxHeight: 400,
                  overflowY: "auto",
                }}
              >
                {JSON.stringify(decodedToken, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {error && (
        <p style={{ color: "#d32f2f", marginTop: "0.75rem", fontSize: "0.9rem" }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
