import { NextResponse } from 'next/server';
import { getMsalServerConfig } from '@/lib/msalServerConfig';
export async function GET() {
  try {
    const config = getMsalServerConfig();
    return NextResponse.json({ clientId: config.clientId, authority: config.authority, redirectUri: config.redirectUri });
  } catch {
    return NextResponse.json({ error: 'MSAL configuration is missing on the server.' }, { status: 500 });
  }
}
