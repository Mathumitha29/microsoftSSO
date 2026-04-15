# Microsoft SSO - Next.js 16

## Overview
This project demonstrates the integration of MSAL (Microsoft Authentication Library) with Next.js 16 for Single Sign-On (SSO) using Microsoft accounts.

## Azure App Registration Steps
1. Go to the Azure Portal.
2. Register a new application.
3. Configure redirect URIs and permissions.

## Setup Instructions
1. Clone the repository: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Copy .env.local.example to .env.local and fill in your Azure credentials.
4. Run the app: `npm run dev`

## How MSAL SSO Works
MSAL provides methods to login, acquire tokens, and manage sessions.

## JWT Decoding
This project decodes JWT tokens using the jwt-decode library.

## Security Notes
- Always validate tokens on your backend.
- Do not commit .env.local file to version control.