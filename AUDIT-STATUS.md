# Audit status — 7 November 2026

This is the implementation/retest ledger for the 30 October audit. The direct-to-main
rollout through PR #8 in both repositories is complete. API PR #15 and client PR
#25 are merged; the client release commit is
[e1b347f](https://github.com/Silentmaster86/hiking-store-client/commit/e1b347f9e9d95292afa7aa238f43988d04430c3b).

Results below distinguish automated checks, production observations and owner
reports. They do not certify full WCAG/security compliance.

| Original findings | Implementation and verification |
| --- | --- |
| 1, 8–9, 39–40: build, cart/404 routes, checks, docs | Implemented. Build/lint/unit/CI and direct-route browser checks. |
| 2: cross-site cookies | Completed. The 7 November production observation confirms same-origin application API traffic, persistent proxy cart sessions with third-party cookies restricted, and Netlify callback URLs for both providers. See [DEPLOYMENT-SETTINGS.md](DEPLOYMENT-SETTINGS.md). |
| 3–7, 13–16, 22: identity, checkout, guest orders, demo statuses | Implemented. PostgreSQL integration, fixture browser suite and real combined integration. |
| 10–12: cart writes and catalogue failures | Implemented with pending-write protection, explicit recovery and generic errors. |
| 17: password reset | Optional product expansion; no email service or reset endpoint added. |
| 18–19, 21, 23–29: catalogue wording, demo, contact/privacy | Implemented. Illustrations remain fictional; deletion requests remain manual. |
| 20: product information/options | Detail pages and illustrative specifications added. Size/variant selection and inventory remain outside this demo. |
| 30–36: dialogs, semantics, theme, mobile spacing, metadata | Implemented. Multi-engine browser checks, focus/Escape/width checks and colour-pair tests. Physical iOS/screen reader checks remain manual. |
| 37: large backgrounds | Existing 72 KB background and small category assets reused. Bundle budget and local mobile Lighthouse lab reports added. Production Web Vitals remain unmeasured. |
| 38: database setup | Versioned migrations, explicit seed and tested fresh DB; scratch-database backup/restore round-trip added. Hosted backup status needs owner access. |
| 41: OAuth state | Implemented with session/provider binding, expiry and replay checks; provider responses simulated in tests. Production start redirects use state and matching Netlify callback URLs. The owner reports successful Google/Facebook sign-in after configuring the dashboards; automated checks do not complete provider authentication. |

Additional fixes: merged cart quantities cap at 99 with visible notice; old
oversized carts are repaired without changing order history. Auth outages remain
separate from logged-out state. Requests have bounded waits, caller cancellation
and no automatic write retries. Trusted-origin/header checks, PostgreSQL-backed
attempt limits, request body errors, readiness and graceful shutdown are covered
by API integration tests.

New catalogue features: name search, price/name sorting, URL-preserved filters,
result counts, reset, product deep links and missing-product recovery. New tooling:
Node 24, verify commands, EditorConfig, Dependabot, local PostgreSQL Compose,
paired real integration, browser-engine matrix and report artifacts.

## Verified release evidence

- [Client checks on main](https://github.com/Silentmaster86/hiking-store-client/actions/runs/42356965232):
  React/React DOM alignment, lint, 20/20 tests, build, bundle budget and fixture
  browser scenarios in Chromium, Firefox and WebKit.
- [Store integration on main](https://github.com/Silentmaster86/hiking-store-client/actions/runs/42356965228):
  real API/PostgreSQL flows in all three browser engines.
- Production observation at **2026-11-07 08:49 UTC** in the Chromium integration
  log/artifact: home, proxy health and readiness return 200; no page JavaScript
  errors; cart session persists; both provider start redirects use the Netlify
  callback host. This observation creates no orders or accounts.
- The owner reports that hosting/provider settings were updated and both external
  sign-in methods work. Provider cancellation, a real-provider guest-order return
  and physical-device/screen-reader checks have no separate recorded result.
- Dependency audit recorded with [client PR #25](https://github.com/Silentmaster86/hiking-store-client/pull/25):
  production dependencies have zero reported advisories. The full audit retains
  four moderate entries from one Minimatch advisory in the ESLint toolchain.
  Audit results describe that dependency snapshot, not future advisory status.

## Remaining verification

- Hosted database backup schedule, retention, latest successful backup and
  restoration of an authorized copy into a separate, empty database.
- Physical iPhone/Android and screen-reader checks.
- Record the remaining manual authentication scenarios above and validate the
  hosting health checks/proxy rate-limit configuration.

See [RELEASE-CHECKLIST.md](RELEASE-CHECKLIST.md) for future releases and the
remaining owner checks.
