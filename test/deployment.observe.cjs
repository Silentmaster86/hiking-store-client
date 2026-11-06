// Observe the currently deployed version; feature PRs have not been deployed yet.
const { chromium } = require("playwright");
const fs = require("node:fs");
const base = "https://hiking-store-uk.netlify.app";
async function main() {
  const result = { observedAt: new Date().toISOString(), site: base, placedOrders: 0, thirdPartyCookieRestriction: false };
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext(), page = await context.newPage();
    const origins = new Set();
    page.on("request", request => { const url = new URL(request.url()); if (/\/(auth\/me|cart)(\?|$)/.test(url.pathname)) origins.add(url.origin); });
    try {
      const client = await context.newCDPSession(page); await client.send("Network.enable");
      await client.send("Network.setCookieControls", { enableThirdPartyCookieRestriction: true, disableThirdPartyCookieMetadata: true, disableThirdPartyCookieHeuristics: true });
      result.thirdPartyCookieRestriction = true;
    } catch { result.cookieControlNote = "Browser cookie-control command was unavailable"; }
    await page.goto(base, { timeout: 45000, waitUntil: "domcontentloaded" });
    await page.locator("main h1").waitFor({ timeout: 20000 });
    result.homeHeading = await page.locator("main h1").innerText();
    result.appApiOrigins = [...origins];
    result.appUsesSameOriginApi = result.appApiOrigins.length > 0 && result.appApiOrigins.every(origin => origin === base);
    result.proxy = await page.evaluate(async () => {
      const read = async path => {
        try { const response = await fetch(path, { credentials: "include", signal: AbortSignal.timeout(45000) }); let data = null; try { data = await response.json(); } catch { /* Preserve status for non-JSON responses. */ } return { status: response.status, data }; }
        catch { return { status: null }; }
      };
      const health = await read("/api/health"), ready = await read("/api/ready");
      // Normal cart reads can create empty guest carts; no products or orders are added.
      const first = await read("/api/cart"), second = await read("/api/cart");
      return { health: health.status, ready: ready.status,
        cartSessionPersists: !!first.data?.cartId && first.data.cartId === second.data?.cartId,
        cartIsEmpty: Array.isArray(second.data?.items) && second.data.items.length === 0 };
    });
    result.providers = {};
    for (const provider of ["google", "facebook"]) {
      const response = await context.request.get(`${base}/api/auth/${provider}`, { maxRedirects: 0, timeout: 45000 });
      const location = response.headers().location;
      const target = location ? new URL(location, base) : null;
      const callback = target?.searchParams.get("redirect_uri");
      result.providers[provider] = { status: response.status(), hasState: !!target?.searchParams.get("state"), callbackOrigin: callback ? new URL(callback).origin : null,
        callbackUsesFrontendProxy: callback ? callback.startsWith(`${base}/api/auth/${provider}/callback`) : false };
    }
    result.realProviderLoginVerified = false;
  } catch (error) { result.error = error.name || "Observation failed"; }
  finally { await browser.close(); }
  fs.mkdirSync("artifacts", { recursive: true });
  fs.writeFileSync("artifacts/deployment-observation.json", JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result));
}
main().catch(error => { console.error(error.name || "Observation failed"); process.exitCode = 1; });
