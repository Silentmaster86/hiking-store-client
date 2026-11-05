> Historical notes for the first stabilization stage. Guest order flows and browser
> checks have since been added; see ORDER-FLOWS.md and README.md for current behaviour.

# Store stabilization

This branch fixes the production build, resets cart state when authentication
changes, handles failed cart writes, blocks conflicting writes and checkout
while saving, and adds `/cart` and a not-found page. Closed cart controls are
inert; Escape closes the drawer. Cart recovery is explicit so a successful read
cannot immediately hide an unsuccessful write.

## Run and verify (Node.js 24)

```sh
npm ci
npm test
npm run lint
npm run build
```

`npm test` checks the HTTP client's session credentials, structured validation
errors, unauthorized responses, HTML error handling and empty responses. These
are unit tests, not a complete browser or backend integration suite.

For local development, copy `.env.example` to `.env.local`, start the backend on
port 4000 with development cookies enabled, and run `npm run dev`. Vite proxies
`/api` to the backend. The shared HTTP client respects an existing VITE_API_URL;
otherwise it uses `/api`. Netlify's API proxy is ordered before its SPA fallback.

## Rollout checklist

Deploy this together with the companion API stabilization branch to a test
environment. Existing Netlify environment values override the source fallback.
Switch VITE_API_URL to `/api` explicitly to use the proxy. Verify cookies and
OAuth callbacks as described in the API repository's STABILIZATION.md.

Manually verify add/remove/quantity changes, a failed write and refresh recovery,
reload, sign-out/sign-in without duplicated items, the footer cart link, 404,
Escape and keyboard access to the closed drawer. Browser smoke checks were
prepared in the audit workspace but could not run in the restricted execution
sandbox; do not treat this as full end-to-end verification.

Guest order recovery, checkout validation, product data and editorial changes
remain separate stages. This branch does not claim to resolve the complete audit.
