# Checkout and order UI

This branch pairs with hiking-store-api's fix/orders-and-checkout branch. Deploy
the API first: the UI relies on the new order access, claim and attempt-recovery
routes. Server startup applies the additive migrations documented there.

Checkout shows field errors, normalizes the postcode, submits country GB and
explains that purchases are a portfolio demonstration. The summary counts units
and shows products, subtotal, free demo delivery and total.

A per-account or guest attempt key is retained in sessionStorage until the result
is confirmed. No delivery address or password is stored there. A failed response
reuses the same key; reloading checks whether that attempt already placed an
order. If browser storage is disabled, retry protection remains in memory for the
current page. Closing the tab can remove sessionStorage, so this is not a
cross-device recovery feature.

Confirmation always fetches and authorizes the order before showing success.
Guests can reopen an order in the same browser for up to seven days and sign in
or register to save it to their account. Login/registration preserve the return
path. Order details are permitted by the API rather than an unconditional
frontend login guard. Unavailable orders never show an order-confirmed heading.

Demo status controls appear only when the API grants canSimulate; enable them by
setting DEMO_MODE=true on the API. They do not represent a real payment/shipment.

## Checks (Node.js 24)

```sh
npm ci
npm test
npm run lint
npm run build
```

Optional browser checks use a pinned test tool without changing the app lockfile:

```sh
npm install --no-save --package-lock=false playwright@1.56.1
npx playwright install --with-deps chromium
npm run test:browser
```

CI performs those checks. Browser scenarios use the actual built React app with
controlled API fixtures: validation, a lost response and same-key retry,
confirmation reload, recovery after page reload, sign-in and claiming, unknown
orders, and registration feedback. Real SQL/session authorization is verified
separately in the API's PostgreSQL integration suite. These do not certify real
Google/Facebook provider configuration or third-party cookie settings.
