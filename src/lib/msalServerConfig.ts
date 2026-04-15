// Server-only file — do NOT add "use client"
// Reads AZURE_CLIENT_ID and AZURE_TENANT_ID from server-side environment variables

export interface MsalServerConfig {
  clientId: string;
  authority: string;
  redirectUri: string;
}

export function getMsalServerConfig(): MsalServerConfig {
  const clientId = process.env.AZURE_CLIENT_ID;
  const tenantId = process.env.AZURE_TENANT_ID;
  const redirectUri =
    process.env.AZURE_REDIRECT_URI ?? "http://localhost:3000";

  if (!clientId) {
    throw new Error("AZURE_CLIENT_ID environment variable is not set");
  }
  if (!tenantId) {
    throw new Error("AZURE_TENANT_ID environment variable is not set");
  }

  const authority = `https://login.microsoftonline.com/${tenantId}`;

  return { clientId, authority, redirectUri };
}
