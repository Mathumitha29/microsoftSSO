import { NextRequest, NextResponse } from 'next/server';
function decodeJwt(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const padded = payload.padEnd(payload.length + (4 - payload.length % 4) % 4, '=');
  return JSON.parse(Buffer.from(padded, 'base64').toString('utf-8'));
}
export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();
    if (!accessToken) return NextResponse.json({ error: 'accessToken is required.' }, { status: 400 });
    const p = decodeJwt(accessToken);
    return NextResponse.json({ name: p.name ?? null, preferred_username: p.preferred_username ?? null, oid: p.oid ?? null, roles: p.roles ?? [], exp: p.exp ?? null });
  } catch {
    return NextResponse.json({ error: 'Failed to decode token.' }, { status: 400 });
  }
}
