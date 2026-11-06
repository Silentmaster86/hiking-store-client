# Release verification

## Merge and deployment order

1. API/client cart-and-recovery (PR #5 in each repository).
2. Client request-security (PR #6), then API request-security (PR #6).
3. API catalogue-and-release (PR #7), then this client catalogue-and-release (PR #7).

The security API requires the new write header, so deploy its client first. New
product detail fields are optional in this client until the API migration runs.
Stacked PRs initially target their predecessor branch. After merging a predecessor,
retarget the next PR to main if GitHub has not already done so. Keep feature
branches until dependent PRs have been merged. Never merge a predecessor into a
successor in place of reviewing the successor changes.

## Automated checks

Use Node 24 and `npm run verify` for lint, unit tests, build and the 450 KiB
JavaScript bundle budget. Client checks run the fixture browser suite in Chromium,
Firefox and WebKit. These include desktop/mobile layouts, keyboard dialogs,
checkout recovery, OAuth feedback, session outages and catalogue deep links.

Store integration checks out the API SHA in .github/integration-api-ref, installs
both projects and uses an empty, local PostgreSQL database ending in _e2e. It never
resets an existing database. It starts the actual API and Vite preview proxy; no
API routes are mocked. The browser checks search/details, cart quantities, guest
checkout, same-session reload/new tab, denial to another browser, registration,
claiming, sign-out/sign-in and request protection. Real OAuth accounts are not used.

The workflow produces an integration JSON result, a mobile screenshot and mobile
Lighthouse HTML/JSON lab reports under the integration-and-lighthouse artifact.
A separate deployment-observation.json records the current public site, proxy-session persistence with browser third-party cookie restrictions where supported, and provider redirect configuration. It may create one empty guest cart, never an order or account. This observation does not gate feature CI because the feature is not yet deployed. It does not verify real provider sign-in.

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

## Hosting checks requiring owner access

- Confirm Netlify VITE_API_URL=/api and matching OAuth callback URLs in Render and
  provider dashboards, following API OAUTH.md.
- Verify actual Google/Facebook success/cancellation in the browser, including a
  guest-order return. Use an incognito window with third-party cookies blocked.
- Check /api/health and /api/ready after deployment. Configure hosting health checks.
- Verify the observed proxy chain before adjusting TRUST_PROXY_HOPS or request
  limits; confirm a normal user does not receive unexpected HTTP 429 responses.
- Record the hosting database backup schedule, retention and latest successful
  backup. Use the API's empty-database restore procedure to test an authorized copy.
- Check at least one physical iPhone/Android device. WebKit/Firefox emulation is
  not a physical-device or screen-reader audit.

Hosting/provider configuration and hosted backup status cannot be established by
repository CI. Record results in the audit status after deployment.
