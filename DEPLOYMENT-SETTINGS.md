# Production settings to finish the session rollout

Observed 6 November 2026 by a fresh Chromium browser in CI:

- Application API traffic still uses https://hiking-store-api.onrender.com.
- The Netlify /api proxy is reachable and two cart reads retain the same guest
  cart with browser third-party cookie restrictions enabled.
- Google/Facebook start redirects contain state, but redirect_uri still points
  to the Render host rather than the Netlify proxy.
- Real provider account sign-in and hosting backup configuration were not tested.

No hosted settings were changed. The observation JSON is in the Chromium Store
integration artifact and includes no cookie/state values or private account data.

## Values

| Service | Setting | Required value |
| --- | --- | --- |
| Netlify, client build | VITE_API_URL | /api |
| Render, API | APP_ORIGIN | https://hiking-store-uk.netlify.app |
| Render, API | CORS_ORIGIN | https://hiking-store-uk.netlify.app |
| Render, API | GOOGLE_CALLBACK_URL | https://hiking-store-uk.netlify.app/api/auth/google/callback |
| Google OAuth client | Authorized redirect URI | https://hiking-store-uk.netlify.app/api/auth/google/callback |
| Render, API | FB_CALLBACK_URL | https://hiking-store-uk.netlify.app/api/auth/facebook/callback |
| Facebook Login | Valid OAuth redirect URI | https://hiking-store-uk.netlify.app/api/auth/facebook/callback |
| Render, API | SESSION_SAME_SITE | lax after all session traffic uses /api |

Keep production NODE_ENV, secure cookies and SESSION_SECRET intact. Do not put
provider secrets in Netlify VITE variables. These are public URLs, not credentials.
Use the exact callback paths, scheme and host, with no extra trailing slash.

## Coordinated cutover

1. Merge/deploy code in the order in RELEASE-CHECKLIST.md. In particular deploy
   the new client write header before API request security.
2. In Google/Facebook dashboards, allow the new Netlify callback URLs. Retain old
   callbacks until the cutover is verified if the provider permits multiple URLs.
3. Prepare the Netlify build variable and matching Render callback variables.
   Redeploy both in one maintenance window: mixed start/callback hosts correctly
   fail state verification until both deployments match. A changed VITE variable
   requires a new frontend build, not just a browser reload.
4. Verify that all session traffic is same-origin, then use SESSION_SAME_SITE=lax.
5. Sign in again, add a product, reload, sign out/in and confirm no duplication.
   Check real Google/Facebook success and cancellation, and a guest-order return.
6. Repeat in incognito with third-party cookies blocked. Verify /api/health and
   /api/ready, then record results. Check actual proxy-observed rate-limit behaviour.

Moving the cookie host creates a new browser session. Account history remains in
the database, but old guest-order grants belong to the old cookie. Save important
accessible guest orders to an account before cutover. Keep the old configuration
recorded so a coordinated rollback restores matching hosts if needed; do not
weaken state verification. A new anonymous test cart does not migrate old grants.

After deployment, run Store integration with API ref main. Its production
observation should report appUsesSameOriginApi=true, cartSessionPersists=true and
callbackUsesFrontendProxy=true for both configured providers. This checks routing;
real provider sign-in still requires the owner to complete authentication.
