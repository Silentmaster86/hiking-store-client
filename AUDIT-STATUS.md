# Audit status — 6 November 2026

This is an implementation/retest ledger for the 30 October audit. It does not
certify production deployment, real OAuth provider setup or full WCAG/security
compliance. PR #1–#4 are merged; PR #5–#7 contain the remaining implementation.
Use each PR's Checks for the result for its exact commit.

| Original findings | Implementation and verification |
| --- | --- |
| 1, 8–9, 39–40: build, cart/404 routes, checks, docs | Implemented. Build/lint/unit/CI and direct-route browser checks. |
| 2: cross-site cookies | Proxy/defaults and matching configuration documented. CI observation confirms proxy session persistence with third-party cookies blocked, but deployed app traffic/callbacks still use Render. Owner cutover settings are listed in DEPLOYMENT-SETTINGS.md. |
| 3–7, 13–16, 22: identity, checkout, guest orders, demo statuses | Implemented. PostgreSQL integration, fixture browser suite and real combined integration. |
| 10–12: cart writes and catalogue failures | Implemented with pending-write protection, explicit recovery and generic errors. |
| 17: password reset | Optional product expansion; no email service or reset endpoint added. |
| 18–19, 21, 23–29: catalogue wording, demo, contact/privacy | Implemented. Illustrations remain fictional; deletion requests remain manual. |
| 20: product information/options | Detail pages and illustrative specifications added. Size/variant selection and inventory remain outside this demo. |
| 30–36: dialogs, semantics, theme, mobile spacing, metadata | Implemented. Multi-engine browser checks, focus/Escape/width checks and colour-pair tests. Physical iOS/screen reader checks remain manual. |
| 37: large backgrounds | Existing 72 KB background and small category assets reused. Bundle budget and local mobile Lighthouse lab reports added. Production Web Vitals remain unmeasured. |
| 38: database setup | Versioned migrations, explicit seed and tested fresh DB; scratch-database backup/restore round-trip added. Hosted backup status needs owner access. |
| 41: OAuth state | Implemented with session/provider binding, expiry and replay checks; provider responses simulated in tests. Real provider configuration remains to verify. |

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

See RELEASE-CHECKLIST.md for exact merge order and remaining deployment checks.
