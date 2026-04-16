import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface TokenClaims {
  name?: string;
  preferred_username?: string;
  oid?: string;
  roles?: string[];
  exp?: number;
}

/**
 * POST /api/auth/decode
 * Accepts { accessToken: string } and decodes it server-side.
 * Returns selected claims — never echoes the raw token back.
 */
export async function POST(request: NextRequest) {
  let body: { accessToken?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { accessToken } = body;

  if (!accessToken || typeof accessToken !== "string") {
    return NextResponse.json(
      { error: "accessToken is required" },
      { status: 400 }
    );
  }

  try {
    const claims = jwtDecode<TokenClaims>(accessToken);
    return NextResponse.json({
      name: claims.name,
      preferred_username: claims.preferred_username,
      oid: claims.oid,
      roles: claims.roles,
      exp: claims.exp,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid or malformed token" },
      { status: 400 }
    );
  }
}
