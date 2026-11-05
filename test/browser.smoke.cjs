// Optional browser checks. CI installs a pinned Playwright tool separately.
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const product = { id: 1, name: "Test Backpack", description: "Browser fixture", price_cents: 1499, category_slug: "backpacks", image_url: "" };
const orderItems = [{ product_id: 1, name: product.name, quantity: 1, price_cents: 1499, line_total_cents: 1499 }];
async function scenario(browser, run) {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [], fixture = { user: null, items: [{ ...product, cart_item_id: 1, product_id: 1, quantity: 1 }], order: null, claimed: false, keys: [], failFirst: true, posts: 0 };
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", async (route) => {
    const request = route.request(), url = new URL(request.url()), p = url.pathname;
    let data, status = 200;
    if (p.startsWith("/api/")) {
      if (p === "/api/auth/me") data = { user: fixture.user };
      else if (p === "/api/auth/login") { fixture.user = { id: 7, email: "buyer@example.com" }; data = { user: fixture.user }; }
      else if (p === "/api/auth/logout") { fixture.user = null; data = { ok: true }; }
      else if (p === "/api/cart") data = { cartId: 1, items: fixture.items };
      else if (p === "/api/products") data = [product];
      else if (p === "/api/checkout") {
        fixture.posts++; fixture.keys.push(request.headers()["idempotency-key"]);
        const body = request.postDataJSON();
        fixture.order ||= { id: 1, status: "pending", currency: "GBP", created_at: "2026-11-05T12:00:00Z", email: body.email, first_name: body.firstName, last_name: body.lastName, shipping_address1: body.shipping.address1, shipping_city: body.shipping.city, shipping_postcode: body.shipping.postcode, shipping_country: "GB", subtotal_cents: 1499, shipping_cents: 0, total_cents: 1499 };
        fixture.items = [];
        if (fixture.failFirst) { fixture.failFirst = false; await route.abort("failed"); return; }
        data = { order: fixture.order, replay: true };
      } else if (p.startsWith("/api/checkout/attempt/")) {
        if (fixture.order) data = { order: fixture.order }; else { status = 404; data = { error: "Not found" }; }
      } else if (p === "/api/orders/1/claim") { fixture.claimed = true; data = { order: { ...fixture.order, canClaim: false } }; }
      else if (p === "/api/orders/1" && fixture.order) data = { order: { ...fixture.order, canClaim: !fixture.claimed, canSimulate: false }, items: orderItems };
      else { status = 404; data = { error: "Order unavailable" }; }
      await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(data) }); return;
    }
    const relative = p.startsWith("/assets/") || p.startsWith("/img/") ? p.slice(1) : "index.html";
    const filename = path.join(__dirname, "../dist", relative);
    const mime = { ".js": "application/javascript", ".css": "text/css", ".jpg": "image/jpeg", ".png": "image/png" }[path.extname(filename)] || "text/html";
    await route.fulfill(fs.existsSync(filename) ? { body: fs.readFileSync(filename), contentType: mime } : { status: 404, body: "" });
  });
  try { await run(page, fixture); assert.deepEqual(errors, [], "No unhandled browser errors"); }
  finally { await context.close(); }
}
async function fillCheckout(page) {
  for (const [id, value] of Object.entries({ email: "buyer@example.com", firstName: "Jan", lastName: "Kowalski", address1: "10 Test Road", city: "London", postcode: "sw1a1aa" })) await page.locator(`#${id}`).fill(value);
}
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await scenario(browser, async (page, fixture) => {
      await page.goto("http://hiking.test/checkout");
      await page.getByRole("button", { name: "Place demo order" }).click();
      await page.locator("#email-error").waitFor();
      assert.equal(fixture.posts, 0, "Invalid form cannot send checkout");
      await fillCheckout(page);
      await page.getByRole("button", { name: "Place demo order" }).click();
      await page.getByRole("alert").filter({ hasText: "Retry to safely check" }).waitFor();
      await page.getByRole("button", { name: "Place demo order" }).click();
      await page.getByRole("heading", { name: "Order confirmed", exact: true }).waitFor();
      assert.equal(fixture.keys.length, 2);
      assert.equal(fixture.keys[0], fixture.keys[1], "A failed response must reuse the same key");
      await page.reload();
      await page.getByRole("heading", { name: "Order confirmed", exact: true }).waitFor();
      await page.getByRole("link", { name: "Sign in to save this order to your account" }).click();
      await page.locator("#email").fill("buyer@example.com");
      await page.locator("#password").fill("test password");
      await page.getByRole("button", { name: "Sign in", exact: true }).click();
      await page.getByRole("button", { name: "Save order to my account" }).click();
      await page.getByRole("button", { name: "Save order to my account" }).waitFor({ state: "hidden" });
      assert.equal(fixture.claimed, true);
      await page.getByRole("link", { name: "View full order details" }).click();
      await page.getByRole("heading", { name: "Order #1", exact: true }).waitFor();
      await page.goto("http://hiking.test/order/999/confirmation");
      await page.getByRole("heading", { name: "We couldn’t display this order" }).waitFor();
      assert.equal(await page.getByRole("heading", { name: "Order confirmed", exact: true }).count(), 0);
    });
    console.log("PASS: validation, retry key, confirmation reload, guest claim and unavailable order UI");
    await scenario(browser, async (page, fixture) => {
      await page.goto("http://hiking.test/checkout"); await fillCheckout(page);
      await page.getByRole("button", { name: "Place demo order" }).click();
      await page.getByRole("alert").filter({ hasText: "Retry to safely check" }).waitFor();
      await page.reload();
      await page.getByRole("heading", { name: "Order confirmed", exact: true }).waitFor();
      assert.equal(fixture.posts, 1, "Reload recovers the completed attempt without another POST");
    });
    console.log("PASS: lost response followed by reload recovers the completed order");
    await scenario(browser, async (page) => {
      await page.goto("http://hiking.test/register");
      await page.locator("#email").fill("buyer@example.com"); await page.locator("#password").fill("x");
      await page.getByRole("button", { name: "Create account", exact: true }).click();
      await page.locator("#password-error").waitFor();
      assert.equal(await page.locator("#password").getAttribute("aria-invalid"), "true");
    });
    console.log("PASS: registration password feedback");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
