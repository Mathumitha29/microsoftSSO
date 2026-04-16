/**
 * SERVER-ONLY — never import this in a 'use client' file.
 */
export function getMsalServerConfig() {
  const clientId = process.env.AZURE_CLIENT_ID;
  const tenantId = process.env.AZURE_TENANT_ID;
  const redirectUri = process.env.AZURE_REDIRECT_URI ?? 'http://localhost:3000';
  if (!clientId || !tenantId) throw new Error('Missing AZURE_CLIENT_ID or AZURE_TENANT_ID');
  return { clientId, authority: `https://login.microsoftonline.com/${tenantId}`, redirectUri };
}
