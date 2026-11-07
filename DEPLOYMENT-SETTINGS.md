# Production settings and verification

## Completed same-origin rollout

The rollout is complete. The [main Store integration run](https://github.com/Silentmaster86/hiking-store-client/actions/runs/42356965228)
observed the published site at **2026-11-07 08:49 UTC**:

- Home, /api/health and /api/ready returned 200, with no page JavaScript errors.
- Application API traffic used https://hiking-store-uk.netlify.app.
- Two proxy cart reads retained the same empty guest cart with browser
  third-party cookie restrictions enabled.
- Google/Facebook start redirects returned 302 with state and the matching
  Netlify /api/auth/{provider}/callback URL.

The owner reports updating Netlify/Render and both provider dashboards, then
successfully signing in with both providers. The automated observation checks
routing and session persistence; it does not authenticate real provider accounts.
Hosted backup status and physical-device tests remain to verify.

The production route is browser -> Netlify /api/* -> Render API. The rewrite in
[netlify.toml](netlify.toml) removes the /api prefix before forwarding to
https://hiking-store-api.onrender.com.

The observation JSON is in the Chromium Store integration artifact and contains
no cookie/state values or private account data. For remaining checks, see
[RELEASE-CHECKLIST.md](RELEASE-CHECKLIST.md).

The table below is the reference configuration for reproducing this deployment.
Dashboard values and private secrets were not read by the automated observation.

## Configuration reference

| Service | Setting | Required value |
| --- | --- | --- |
| Netlify, client build | VITE_API_URL | /api |
| Render, API | APP_ORIGIN | https://hiking-store-uk.netlify.app |
| Render, API | CORS_ORIGIN | https://hiking-store-uk.netlify.app |
| Render, API | GOOGLE_CALLBACK_URL | https://hiking-store-uk.netlify.app/api/auth/google/callback |
| Google OAuth client | Authorized redirect URI | https://hiking-store-uk.netlify.app/api/auth/google/callback |
| Render, API | FB_CALLBACK_URL | https://hiking-store-uk.netlify.app/api/auth/facebook/callback |
| Facebook Login | Valid OAuth redirect URI | https://hiking-store-uk.netlify.app/api/auth/facebook/callback |
| Render, API | SESSION_SAME_SITE | lax |

Keep production NODE_ENV, secure cookies and SESSION_SECRET intact. Do not put
provider secrets in Netlify VITE variables. These are public URLs, not credentials.
Use the exact callback paths, scheme and host, with no extra trailing slash.

## Future domain migrations

1. Follow [RELEASE-CHECKLIST.md](RELEASE-CHECKLIST.md) for compatible releases.
   When changing a request contract, deploy its compatible client first. Update
   public URLs and the production observer's target when changing the domain.
2. In Google/Facebook dashboards, allow the new Netlify callback URLs. Retain old
   callbacks until the cutover is verified if the provider permits multiple URLs.
3. Prepare the Netlify build variable and matching Render origin/callback variables.
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
