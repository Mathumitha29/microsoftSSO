# Microsoft SSO — Next.js 16 + MSAL

A **Next.js 16** (App Router) application that implements Microsoft Single Sign-On (SSO) using the **MSAL** library and decodes the resulting JWT access token on the frontend.

---

## Features

- Sign in / sign out with a Microsoft (Azure AD) account via a popup
- Acquire an access token silently (with popup fallback)
- Decode and display JWT claims (name, email, OID, roles, expiry) using `jwt-decode`
- Fully client-side auth — no server-side token handling required for basic SSO

---

## Prerequisites — Azure App Registration

1. Go to the [Azure Portal](https://portal.azure.com) → **Azure Active Directory** → **App registrations** → **New registration**
2. Give the app a name (e.g. `nextjs-msal-sso`)
3. Under **Supported account types**, choose the appropriate option (e.g. *Accounts in this organizational directory only*)
4. Add a **Redirect URI**:
   - Platform: **Single-page application (SPA)**
   - URI: `http://localhost:3000`
5. Click **Register**
6. Copy the **Application (client) ID** and **Directory (tenant) ID** — you will need them below
7. Under **API permissions**, verify that `User.Read` (Microsoft Graph, Delegated) is present; grant admin consent if required

---

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/Mathumitha29/microsoftSSO.git
cd microsoftSSO

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your values:

```
NEXT_PUBLIC_AZURE_CLIENT_ID=<your Application (client) ID>
NEXT_PUBLIC_AZURE_TENANT_ID=<your Directory (tenant) ID>
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000
```

```bash
# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── globals.css          — global styles
│   ├── layout.tsx           — root layout (wraps app in MsalProvider)
│   ├── page.tsx             — home page with decoded token display
│   └── providers.tsx        — "use client" MsalProvider wrapper
├── components/
│   └── LoginButton.tsx      — Sign in/out button + decoded claims view
├── hooks/
│   └── useAuth.ts           — login, logout, acquireToken, jwtDecode
└── lib/
    └── msalConfig.ts        — MSAL configuration and loginRequest scopes
```

---

## How MSAL SSO Works

1. `PublicClientApplication` is instantiated once in `providers.tsx` using the config from `msalConfig.ts`.
2. `MsalProvider` wraps the entire app, making the MSAL instance available via React context.
3. The `useAuth` hook calls `instance.loginPopup()` to start the sign-in flow. Azure redirects the popup back to the configured `redirectUri`.
4. After login, `instance.acquireTokenSilent()` fetches a fresh access token from the cache (or the Microsoft identity platform) without user interaction. If silent acquisition fails, it falls back to `acquireTokenPopup()`.

---

## Access Token Decoding

The access token returned by Microsoft is a **JWT** (JSON Web Token). It is decoded on the frontend using the `jwtDecode` function from `jwt-decode` (v4+):

```ts
import { jwtDecode } from "jwt-decode";

const decoded = jwtDecode(accessToken);
// decoded.name, decoded.preferred_username, decoded.oid, decoded.roles, decoded.exp …
```

> **Note:** `jwtDecode` only *parses* the token — it does **not** verify the signature. Token signature verification must be done server-side if you need to trust the claims for access-control decisions.

---

## Security Notes

| Topic | Guidance |
|-------|----------|
| **Never send raw tokens to your own backend** unless that backend validates them (signature + audience + issuer). | Use an API protected by Azure AD if you need server-side access. |
| **Token expiry** | The `exp` claim is a Unix timestamp. Always check or let MSAL handle renewal automatically via `acquireTokenSilent`. |
| **localStorage caching** | MSAL is configured to use `localStorage` for token caching. For highly sensitive apps, consider `sessionStorage` to limit cross-tab token sharing. |
| **PKCE** | MSAL Browser automatically uses PKCE for the SPA authorization-code flow — no client secret is needed or stored. |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at http://localhost:3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |