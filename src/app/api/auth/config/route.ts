import { NextResponse } from "next/server";
import { getMsalServerConfig } from "@/lib/msalServerConfig";

/**
 * GET /api/auth/config
 * Returns only what the browser needs to initialise MSAL:
 *   { clientId, authority, redirectUri }
 * Tenant ID and the full authority URL are constructed server-side and
 * never stored in NEXT_PUBLIC_ variables.
 */
export async function GET() {
  try {
    const config = getMsalServerConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("Failed to load MSAL server config:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
