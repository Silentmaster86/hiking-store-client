// Real browser + Express + PostgreSQL. No API routes are mocked.
const assert = require("node:assert/strict");
const { spawn, spawnSync } = require("node:child_process");
const path = require("node:path"), fs = require("node:fs");
const playwright = require("playwright");
const browserType = playwright[process.env.BROWSER || "chromium"];
const apiDirectory = path.resolve(process.env.E2E_API_DIR || "../api");
const { Pool } = require(path.join(apiDirectory, "node_modules/pg"));
const base = "http://127.0.0.1:4173";
const processes = [];
const env = { ...process.env, NODE_ENV: "test", PORT: "4000", DATABASE_URL: process.env.E2E_DATABASE_URL,
  SESSION_SECRET: "isolated-e2e-session-secret-not-for-production", APP_ORIGIN: base, CORS_ORIGIN: base,
  SESSION_SAME_SITE: "lax", DEMO_MODE: "true", AUTH_RATE_LIMIT: "1000", REGISTER_RATE_LIMIT: "1000" };
function start(command, args, cwd) {
  const child = spawn(command, args, { cwd, env, stdio: ["ignore", "pipe", "pipe"] });
  child.stdout.on("data", data => process.stdout.write(data));
  child.stderr.on("data", data => process.stderr.write(data));
  processes.push(child); return child;
}
async function waitFor(url) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (processes.some(child => child.exitCode !== null)) throw new Error("A test server stopped unexpectedly");
    try { const response = await fetch(url); if (response.ok) return; } catch { /* Startup is pending. */ }
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error("Test server did not become ready");
}
async function main() {
  if (!env.DATABASE_URL) throw new Error("E2E_DATABASE_URL is required");
  const url = new URL(env.DATABASE_URL);
  if (!url.pathname.endsWith("_e2e") || !["127.0.0.1", "localhost", "postgres"].includes(url.hostname)) throw new Error("Use a local, dedicated _e2e database");
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  try {
    const tables = (await pool.query("SELECT count(*) FROM information_schema.tables WHERE table_schema='public'")).rows[0].count;
    assert.equal(tables, "0", "E2E database must be empty; existing tables are never reset");
  } finally { await pool.end(); }
  const seed = spawnSync(process.execPath, ["db/seed.js"], { cwd: apiDirectory, env, stdio: "inherit" });
  assert.equal(seed.status, 0, "Seed succeeds on a fresh database");
  start(process.execPath, ["index.js"], apiDirectory);
  await waitFor("http://127.0.0.1:4000/ready");
  start(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", "4173", "--strictPort"], process.cwd());
  await waitFor(base);
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext(), page = await context.newPage();
  const errors = []; page.on("pageerror", error => errors.push(error.message));
  page.setDefaultTimeout(15000);
  try {
    await page.waitForLoadState("networkidle");
    await page.goto(base + "/products?q=torch&sort=price-asc");
    await page.getByRole("link", { name: "300 lm Head Torch", exact: true }).click();
    await page.getByRole("heading", { name: "300 lm Head Torch", exact: true }).waitFor();
    await page.getByRole("heading", { name: "Demo specifications", exact: true }).waitFor();
    await page.getByRole("button", { name: "Add to cart", exact: true }).click();
    const cart = page.getByRole("dialog", { name: "Shopping cart" }); await cart.waitFor();
    await cart.getByRole("button", { name: "Increase quantity of 300 lm Head Torch" }).click();
    await page.waitForFunction(() => [...document.querySelectorAll('dialog[open] button')].some(button => button.textContent === 'Checkout' && !button.disabled));
    await cart.getByText("£39.98", { exact: true }).first().waitFor();
    await cart.getByRole("button", { name: "Checkout", exact: true }).click();
    for (const [id, value] of Object.entries({ email: "e2e@example.com", firstName: "Example", lastName: "Tester", address1: "1 Test Road", city: "London", postcode: "SW1A 1AA" })) await page.locator(`#${id}`).fill(value);
    await page.getByRole("button", { name: "Place demo order", exact: true }).click();
    await page.getByRole("heading", { name: "Order confirmed", exact: true }).waitFor();
    const confirmation = page.url();
    assert.equal((await context.request.get(base + "/api/cart").then(r => r.json())).items.length, 0);
    await page.reload(); await page.getByRole("heading", { name: "Order confirmed", exact: true }).waitFor();
    const anotherTab = await context.newPage(); await anotherTab.goto(confirmation);
    await anotherTab.getByRole("heading", { name: "Order confirmed", exact: true }).waitFor(); await anotherTab.close();
    const stranger = await browser.newContext(), strangerPage = await stranger.newPage(); await strangerPage.goto(confirmation);
    await strangerPage.getByRole("heading", { name: "We couldn’t display this order", exact: true }).waitFor(); await stranger.close();
    await page.getByRole("link", { name: "Sign in to save this order to your account" }).click();
    await page.getByRole("link", { name: "Create one", exact: true }).click();
    await page.getByRole("heading", { name: "Create account", exact: true }).waitFor();
    await page.locator("#email").fill("e2e@example.com"); await page.locator("#password").fill("a secure integration password");
    await page.getByRole("button", { name: "Create account", exact: true }).click();
    await page.getByRole("button", { name: "Save order to my account", exact: true }).click();
    await page.getByRole("button", { name: "Save order to my account", exact: true }).waitFor({ state: "hidden" });
    await page.getByRole("link", { name: "View full order details" }).click();
    await page.getByRole("heading", { name: /^Order #/ }).waitFor();
    await page.waitForLoadState("networkidle");
    await page.goto(base + "/products?q=torch");
    await page.getByRole("button", { name: "Add to cart", exact: true }).click();
    await cart.waitFor(); await page.keyboard.press("Escape");
    const before = await context.request.get(base + "/api/cart").then(r => r.json());
    assert.equal(before.items[0].quantity, 1);
    const target = before.items[0].product_id;
    assert.equal((await context.request.post(base + "/api/cart/items", { data: { productId: target, quantity: 1 } })).status(), 403);
    assert.equal((await context.request.post(base + "/api/cart/items", { headers: { "X-Store-Request": "1", Origin: "https://evil.invalid" }, data: { productId: target, quantity: 1 } })).status(), 403);
    await page.locator("header").getByRole("button", { name: "Sign out", exact: true }).click();
    await page.locator("header").getByRole("link", { name: "Sign in", exact: true }).click();
    await page.locator("#email").fill("e2e@example.com"); await page.locator("#password").fill("a secure integration password");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.locator("header").getByRole("button", { name: "Sign out", exact: true }).waitFor();
    const after = await context.request.get(base + "/api/cart").then(r => r.json());
    assert.equal(after.items[0].quantity, 1, "Sign-out/sign-in must not duplicate the account cart");
    await page.setViewportSize({ width: 390, height: 844 }); await page.goto(base + "/products/1");
    await page.getByRole("heading", { name: "35 L Trail Backpack", exact: true }).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    fs.mkdirSync("artifacts", { recursive: true });
    await page.screenshot({ path: "artifacts/product-mobile.png", fullPage: true });
    fs.writeFileSync("artifacts/integration-result.json", JSON.stringify({ passed: true, database: "isolated PostgreSQL", browser: process.env.BROWSER || "chromium", mockedApi: false, checks: ["search", "details", "cart", "checkout", "guest reload/new tab", "stranger denied", "register/claim", "request protection", "no cart duplication", "mobile width"] }, null, 2));
    console.log("PASS real integration: browser + API + PostgreSQL, guest order claim, request protection and persistent cart");
    if (process.env.RUN_LIGHTHOUSE === "true") {
      const cli = path.join(process.cwd(), "node_modules/lighthouse/cli/index.js");
      const result = spawnSync(process.execPath, [cli, base, "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage", "--output=json", "--output=html", "--output-path=artifacts/lighthouse", "--quiet"], { env: { ...env, CHROME_PATH: playwright.chromium.executablePath() }, encoding: "utf8", timeout: 120000 });
      assert.equal(result.status, 0, "Lighthouse lab measurement completes");
      console.log("PASS Lighthouse lab reports saved; scores describe this CI environment only");
    }
  } catch (error) { console.error("Integration URL:", page.url(), "Browser errors:", errors); try { console.error((await page.locator("body").innerText({ timeout: 1000 })).slice(0, 2500)); } catch { /* Keep the original error. */ } throw error; } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  for (const child of processes.reverse()) { child.kill("SIGTERM"); await new Promise(resolve => { if (child.exitCode !== null) return resolve(); const timer = setTimeout(() => { child.kill("SIGKILL"); resolve(); }, 12000); child.once("exit", () => { clearTimeout(timer); resolve(); }); }); }
});
