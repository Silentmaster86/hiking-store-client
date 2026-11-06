// Optional browser checks. CI installs a pinned Playwright tool separately.
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const product = { id: 1, name: "Test Backpack", description: "Browser fixture", price_cents: 1499, category_slug: "backpacks", image_url: "/img/products/backpacks-01.jpg" };
const orderItems = [{ product_id: 1, name: product.name, quantity: 1, price_cents: 1499, line_total_cents: 1499 }];
async function scenario(browser, run) {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [], fixture = { user: null, items: [{ ...product, cart_item_id: 1, product_id: 1, quantity: 1 }], order: null, claimed: false, keys: [], failFirst: true, posts: 0, productRequests: 0, failProducts: false };
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", async (route) => {
    const request = route.request(), url = new URL(request.url()), p = url.pathname;
    let data, status = 200;
    if (p.startsWith("/api/")) {
      if (p === "/api/auth/me") { if (fixture.authGate) await fixture.authGate; data = { user: fixture.user }; }
      else if ((p === "/api/auth/login" || p === "/api/auth/register")) { fixture.user = { id: 7, email: "buyer@example.com" }; data = { user: fixture.user }; }
      else if (p === "/api/auth/logout") { fixture.user = null; data = { ok: true }; }
      else if (p === "/api/cart") data = { cartId: 1, items: fixture.items };
      else if (p === "/api/products") { fixture.productRequests++; if (fixture.failProducts) { status = 503; data = { error: "Internal test details" }; } else data = [product]; }
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
  catch (error) { console.error("Fixture checkout posts:", fixture.posts, "Browser errors:", errors); console.error(await page.locator("main").innerText()); throw error; }
  finally { await context.close(); }
}
async function fillCheckout(page) {
  for (const [id, value] of Object.entries({ email: "buyer@example.com", firstName: "Jan", lastName: "Kowalski", address1: "10 Test Road", city: "London", postcode: "sw1a1aa" })) await page.locator(`#${id}`).fill(value);
}
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await scenario(browser, async (page, fixture) => {
      await page.goto("https://hiking.test/checkout");
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
      const oauth = await page.getByRole("link", { name: "Continue with Google" }).getAttribute("href");
      assert.equal(new URL(oauth, "https://hiking.test").searchParams.get("returnTo"), "/order/1/confirmation");
      await page.getByRole("button", { name: "Sign in", exact: true }).click();
      await page.getByRole("button", { name: "Save order to my account" }).click();
      await page.getByRole("button", { name: "Save order to my account" }).waitFor({ state: "hidden" });
      assert.equal(fixture.claimed, true);
      await page.getByRole("link", { name: "View full order details" }).click();
      await page.getByRole("heading", { name: "Order #1", exact: true }).waitFor();
      await page.goto("https://hiking.test/order/999/confirmation");
      await page.getByRole("heading", { name: "We couldn’t display this order" }).waitFor();
      assert.equal(await page.getByRole("heading", { name: "Order confirmed", exact: true }).count(), 0);
    });
    console.log("PASS: validation, retry key, confirmation reload, guest claim and unavailable order UI");
    await scenario(browser, async (page, fixture) => {
      await page.goto("https://hiking.test/checkout"); await fillCheckout(page);
      await page.getByRole("button", { name: "Place demo order" }).click();
      await page.getByRole("alert").filter({ hasText: "Retry to safely check" }).waitFor();
      await page.reload();
      await page.getByRole("heading", { name: "Order confirmed", exact: true }).waitFor();
      assert.equal(fixture.posts, 1, "Reload recovers the completed attempt without another POST");
    });
    console.log("PASS: lost response followed by reload recovers the completed order");
    await scenario(browser, async (page) => {
      await page.goto("https://hiking.test/register");
      await page.locator("#email").fill("buyer@example.com"); await page.locator("#password").fill("x");
      await page.getByRole("button", { name: "Create account", exact: true }).click();
      await page.locator("#password-error").waitFor();
      assert.equal(await page.locator("#password").getAttribute("aria-invalid"), "true");
    });
    console.log("PASS: registration password feedback");
    await scenario(browser, async (page, fixture) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("https://hiking.test/");
      await page.getByRole("heading", { name: "Gear up for the trail." }).waitFor();
      assert.equal(fixture.productRequests, 0, "The static home page does not need a catalogue API request");
      await page.locator("main").getByRole("link", { name: "Backpacks & Accessories" }).click();
      await page.getByRole("heading", { name: "Backpacks & Accessories", exact: true }).waitFor();
      await page.getByRole("img", { name: "Test Backpack", exact: true }).waitFor();
      await page.waitForFunction(() => document.title === "Backpacks & Accessories — Hiking Store");
      const surface = await page.locator("main article").first().evaluate((element) => getComputedStyle(element).backgroundColor);
      assert.equal(surface, "rgb(16, 27, 44)", "Product cards have an opaque background");
      await page.locator("header").getByRole("link", { name: "Home", exact: true }).click();
      await page.waitForFunction(() => document.title === "Hiking Store UK");
      await page.getByRole("link", { name: "Privacy", exact: true }).click();
      await page.getByRole("heading", { name: "Privacy policy", exact: true }).waitFor();
      const contact = await page.locator("main a[href^='mailto:']").getAttribute("href");
      assert.ok(contact && !contact.includes(".local"));
      await page.getByRole("link", { name: "Delete my data", exact: true }).click();
      await page.getByRole("heading", { name: "Delete your data", exact: true }).waitFor();
      assert.ok((await page.locator("main a[href^='mailto:']").getAttribute("href")).startsWith(contact));
      await page.goto("https://hiking.test/products");
      await page.locator("header").getByRole("link", { name: "Sign in", exact: true }).waitFor();
      const trigger = page.locator("header").getByRole("button", { name: /^Cart/ });
      await trigger.click();
      const cart = page.getByRole("dialog", { name: "Shopping cart" });
      await cart.waitFor();
      for (let index = 0; index < 8; index++) {
        await page.keyboard.press("Tab");
        assert.equal(await page.evaluate(() => document.activeElement.closest("dialog")?.getAttribute("aria-label")), "Shopping cart");
      }
      await page.keyboard.press("Escape");
      await cart.waitFor({ state: "hidden" });
      assert.equal(await trigger.evaluate((element) => document.activeElement === element), true, "Closing the dialog restores focus");
      fixture.failProducts = true;
      await page.goto("https://hiking.test/products");
      await page.getByRole("alert").filter({ hasText: "We couldn’t load the products" }).waitFor();
      assert.equal((await page.locator("main").innerText()).includes("Internal test details"), false);
      fixture.failProducts = false;
      await page.getByRole("button", { name: "Try again", exact: true }).click();
      await page.getByRole("heading", { name: "Test Backpack", exact: true }).waitFor();
    });
    console.log("PASS: category labels, metadata, contact links, opaque cards, modal focus and catalogue retry");
    await scenario(browser, async (page, fixture) => {
      await page.setViewportSize({ width: 390, height: 844 });
      let releaseAuth;
      fixture.authGate = new Promise((resolve) => { releaseAuth = resolve; });
      await page.goto("https://hiking.test/");
      const trigger = page.getByRole("button", { name: "Open menu", exact: true });
      await trigger.click();
      const menu = page.getByRole("dialog", { name: "Mobile navigation" });
      await menu.waitFor();
      releaseAuth();
      await menu.getByRole("link", { name: "Sign in", exact: true }).waitFor();
      assert.equal(await menu.evaluate((element) => element.open), true, "Finishing the auth lookup must not dismiss the menu");
      for (let index = 0; index < 8; index++) {
        await page.keyboard.press("Tab");
        assert.equal(await page.evaluate(() => document.activeElement.closest("dialog")?.getAttribute("aria-label")), "Mobile navigation");
      }
      await page.keyboard.press("Escape");
      await menu.waitFor({ state: "hidden" });
      assert.equal(await trigger.evaluate((element) => document.activeElement === element), true);
      await trigger.click();
      await menu.getByRole("link", { name: "Shop", exact: true }).click();
      await page.getByRole("heading", { name: "All products", exact: true }).waitFor();
      await menu.waitFor({ state: "hidden" });
      for (const width of [320, 390, 768]) {
        await page.setViewportSize({ width, height: 844 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `No page overflow at ${width}px`);
      }
    });
    console.log("PASS: mobile menu survives auth lookup, traps focus, handles Escape and narrow viewports");
    await scenario(browser, async (page, fixture) => {
      fixture.order = { id: 1, status: "pending", currency: "GBP", created_at: "2026-11-05T12:00:00Z", subtotal_cents: 1499, shipping_cents: 0, total_cents: 1499 };
      const destination = "/order/1/confirmation";
      await page.goto(`https://hiking.test/login?${new URLSearchParams({ error: "google", reason: "cancelled", returnTo: destination })}`);
      await page.getByRole("alert").filter({ hasText: "Google sign-in was cancelled" }).waitFor();
      const googleLink = await page.getByRole("link", { name: "Continue with Google" }).getAttribute("href");
      assert.equal(new URL(googleLink, "https://hiking.test").searchParams.get("returnTo"), destination);
      await page.locator("#email").fill("buyer@example.com");
      await page.locator("#password").fill("test password");
      await page.getByRole("button", { name: "Sign in", exact: true }).click();
      await page.getByRole("heading", { name: "Order confirmed", exact: true }).waitFor();
      assert.equal(new URL(page.url()).pathname, destination);
      for (const [reason, expected] of [["session", "expired"], ["account_conflict", "original method"], ["unverified_email", "Verify it with Google"], ["unavailable", "unavailable"], ["__proto__", "failed"]]) {
        await page.goto(`https://hiking.test/login?${new URLSearchParams({ error: "google", reason })}`);
        await page.getByRole("alert").filter({ hasText: expected }).waitFor();
      }
      fixture.user = null;
      await page.goto(`https://hiking.test/login?${new URLSearchParams({ returnTo: destination })}`);
      await page.getByRole("link", { name: "Create one" }).click();
      await page.reload();
      await page.locator("#email").fill("buyer@example.com");
      await page.locator("#password").fill("a secure test password");
      await page.getByRole("button", { name: "Create account", exact: true }).click();
      await page.getByRole("heading", { name: "Order confirmed", exact: true }).waitFor();
      assert.equal(new URL(page.url()).pathname, destination);
      await page.goto("https://hiking.test/login?returnTo=https%3A%2F%2Fexample.com");
      const safeLink = await page.getByRole("link", { name: "Continue with Google" }).getAttribute("href");
      assert.equal(new URL(safeLink, "https://hiking.test").searchParams.get("returnTo"), "/");
    });
    console.log("PASS: OAuth feedback, safe return paths and email/registration fallback preserve the order destination");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
