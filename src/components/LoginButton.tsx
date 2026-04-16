"use client";

import { useAuth } from "@/hooks/useAuth";

export function LoginButton() {
  const {
    account,
    claims,
    isAuthenticated,
    login,
    logout,
    acquireTokenAndDecode,
    error,
  } = useAuth();

  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <p className="rounded bg-red-100 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {!isAuthenticated ? (
        <button
          onClick={login}
          className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sign in with Microsoft
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-gray-700">
            Signed in as{" "}
            <span className="font-semibold">{account?.username}</span>
          </p>

          <button
            onClick={acquireTokenAndDecode}
            className="rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Fetch &amp; Decode Token
          </button>

          {claims && (
            <div className="mt-2 w-full max-w-sm rounded border border-gray-200 bg-gray-50 p-4 text-sm">
              <h3 className="mb-2 font-semibold text-gray-800">Token Claims</h3>
              <dl className="space-y-1">
                {claims.name && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Name</dt>
                    <dd className="text-gray-800">{claims.name}</dd>
                  </div>
                )}
                {claims.preferred_username && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Email</dt>
                    <dd className="text-gray-800">{claims.preferred_username}</dd>
                  </div>
                )}
                {claims.oid && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">OID</dt>
                    <dd className="truncate text-gray-800">{claims.oid}</dd>
                  </div>
                )}
                {claims.roles && claims.roles.length > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Roles</dt>
                    <dd className="text-gray-800">{claims.roles.join(", ")}</dd>
                  </div>
                )}
                {claims.exp && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Expires</dt>
                    <dd className="text-gray-800">
                      {new Date(claims.exp * 1000).toLocaleString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          <button
            onClick={logout}
            className="rounded border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
