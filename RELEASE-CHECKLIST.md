# Release verification

## Current release

The direct-to-main PR #8 rollout in both repositories is complete. API PR #15 and
client PR #25 are merged. The 7 November main checks and production observation
are recorded in [AUDIT-STATUS.md](AUDIT-STATUS.md). The owner reports successful
Google/Facebook sign-in after applying the matching hosting/provider settings.

## Future releases

1. Start from current main and target main in each pull request. Review the checks
   for the exact proposed commit.
2. For application/tooling changes, use Node 24 and run the relevant verification
   below. For a paired API/client change, verify the intended API version in Store
   integration and update the committed API pin deliberately.
3. Deploy a compatible client before enforcing a new API request contract. This
   was the order for the completed request-header rollout. Independent frontend
   and API changes can use their respective Netlify and Render deployments.
4. Wait for the affected hosting deployments to complete. Check the published
   app, proxy health/readiness and session persistence. After authentication or
   domain changes, also verify the real provider flows described below.
5. Record dated evidence and any remaining manual checks in the audit status.
   [DEPLOYMENT-SETTINGS.md](DEPLOYMENT-SETTINGS.md) is the configuration reference
   for the working same-origin deployment.

## Automated checks

Use Node 24 and `npm run verify` for lint, unit tests, build and the 450 KiB
JavaScript bundle budget. Client checks run the fixture browser suite in Chromium,
Firefox and WebKit. These include desktop/mobile layouts, keyboard dialogs,
checkout recovery, OAuth feedback, session outages and catalogue deep links.

Store integration checks out the API SHA in [.github/integration-api-ref](.github/integration-api-ref), installs
both projects and uses an empty, local PostgreSQL database ending in _e2e. It never
resets an existing database. It starts the actual API and Vite preview proxy in Chromium, Firefox and WebKit; no
API routes are mocked. The browser checks search/details, cart quantities, guest
checkout, same-session reload/new tab, denial to another browser, registration,
claiming, sign-out/sign-in and request protection. Real OAuth accounts are not used.

The workflow produces an integration JSON result, a mobile screenshot and mobile
Lighthouse HTML/JSON lab reports under the integration-and-lighthouse artifact.
A separate deployment-observation.json records the current public site, proxy-session persistence with browser third-party cookie restrictions where supported, and provider redirect configuration. Normal cart reads may create empty guest carts, never an order or account. The observation describes the currently published site independently of the isolated integration result; its status does not gate CI. It does not verify real provider sign-in.

The score measures a CI machine/local server, not production Core Web Vitals or
physical-device performance. The weekly schedule checks API main; manual workflow
inputs can select another API ref. Update the pin deliberately when the API
contract changes, after checking the paired workflow.

To run locally, clone API into ../api, install its dependencies, create a NEW
empty hiking_store_e2e database, build the client and install the pinned browser
and Lighthouse tools from the workflow. Set E2E_DATABASE_URL explicitly, then use
`npm run test:e2e`. The fixture database is left available for inspection; create
a new empty database for the next run. Credentials in workflow files are only
for disposable CI services. No real credentials belong in VITE variables.

See [DEPLOYMENT-SETTINGS.md](DEPLOYMENT-SETTINGS.md) for the verified routing and configuration reference.

## Remaining manual checks and later regressions

The current proxy routing and provider redirect URLs are verified; the owner
reports successful Google/Facebook login. Keep these checks for scenarios not yet
recorded and for later hosting/authentication changes:

- Verify real-provider cancellation and a guest-order return. Include an
  incognito window with third-party cookies blocked.
- Confirm hosting health checks and the proxy-observed IP chain before tuning
  TRUST_PROXY_HOPS or request limits; check normal users' HTTP 429 behaviour.
- Record the hosted database backup schedule, retention and latest successful
  backup. Follow the API's [backup/restore procedure](https://github.com/Silentmaster86/hiking-store-api/blob/main/OPERATIONS.md#backups)
  to test an authorized copy in a separate, empty database.
- Check a physical iPhone/Android device and a screen reader. Browser-engine
  emulation does not establish physical-device accessibility results.

Hosting dashboard values and backup status require owner access. Record
production observations and owner reports separately from isolated CI results.
