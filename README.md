# Hiking Store — React portfolio demo

Live: https://hiking-store-uk.netlify.app/
API source: https://github.com/Silentmaster86/hiking-store-api

A React 19/Vite storefront with styled-components, React Router, session-based
carts and saved demonstration orders. No payments are taken and no goods are
shipped. Catalogue images and product information are illustrative.

## Local development (Node.js 24)

Start the companion API on port 4000, using its development cookie configuration.
Then:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Vite proxies `/api` to the local API. Netlify proxies the same path before its SPA
fallback. `VITE_API_URL` can override the API address; it defaults to `/api`.
`VITE_CONTACT_EMAIL` optionally overrides the public contact already used by the
original project. No secrets belong in VITE variables: they are part of the build.

## Features

- Four category links with stable slugs and one shared label definition.
- Cart page and modal drawer, quantity changes, recovery from failed writes.
- Account cart persistence and one-time merging of actual guest additions.
- UK address validation, demo checkout and retry-safe order creation.
- Authorized guest confirmation reload, account claiming and order history.
- Explicit demo status controls when enabled by the API.
- Keyboard-accessible native cart/menu dialogs, responsive cards and public
  privacy, terms, project information and data-deletion instructions.

## Checks

```sh
npm test
npm run lint
npm run build
```

Optional browser checks use the pinned tool configured in CI:

```sh
npm install --no-save --package-lock=false playwright@1.56.1
npx playwright install --with-deps chromium
npm run test:browser
```

Browser checks use the built app with API fixtures; real PostgreSQL/session flows
are tested in the API repository. They do not validate live Google/Facebook account
configuration. [ORDER-FLOWS.md](ORDER-FLOWS.md) documents the order flow and limits.

## Hosting and project notes

[STABILIZATION.md](STABILIZATION.md) explains the coordinated proxy/cookie rollout.
[CATALOGUE-AND-UX.md](CATALOGUE-AND-UX.md) records the presentation and catalogue work.
Guest access is tied to a browser session for up to seven days; there is no email
recovery. Real payments, delivery, inventory and product sizes are outside this demo.

Author: Przemysław Pietkun — https://github.com/Silentmaster86
