// Observe deployed routing independently of whether React can render.
const { chromium } = require("playwright");
const fs = require("node:fs");
const base = "https://hiking-store-uk.netlify.app";
async function main() {
  const result = { observedAt: new Date().toISOString(), site: base, placedOrders: 0, thirdPartyCookieRestriction: false, realProviderLoginVerified: false };
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext(), page = await context.newPage();
    const origins = new Set(), errors = [];
    page.on("pageerror", error => errors.push(error.message.slice(0, 500)));
    page.on("request", request => { const url = new URL(request.url()); if (/\\/(auth\\/me|cart)(\\?|$)/.test(url.pathname)) origins.add(url.origin); });
    try {
      const client = await context.newCDPSession(page); await client.send("Network.enable");
      await client.send("Network.setCookieControls", { enableThirdPartyCookieRestriction: true, disableThirdPartyCookieMetadata: true, disableThirdPartyCookieHeuristics: true });
      result.thirdPartyCookieRestriction = true;
    } catch { result.cookieControlNote = "Browser cookie-control command was unavailable"; }
    try {
      const response = await page.goto(base, { timeout: 45000, waitUntil: "domcontentloaded" });
      result.homeStatus = response.status();
      await page.locator("main h1").waitFor({ timeout: 20000 });
      result.homeHeading = await page.locator("main h1").innerText();
    } catch (error) { result.pageLoadError = error.name; }
    result.pageErrors = errors;
    result.appApiOrigins = [...origins];
    result.appUsesSameOriginApi = origins.size ? [...origins].every(origin => origin === base) : null;
    try {
      result.proxy = await page.evaluate(async () => {
        const read = async path => {
          try {
            const response = await fetch(path, { credentials: "include", signal: AbortSignal.timeout(45000) });
            let data = null; try { data = await response.json(); } catch { /* Retain status. */ }
            return { status: response.status, data };
          } catch { return { status: null }; }
        };
        const health = await read("/api/health"), ready = await read("/api/ready");
        const first = await read("/api/cart"), second = await read("/api/cart");
        return { health: health.status, ready: ready.status,
          cartSessionPersists: !!first.data?.cartId && first.data.cartId === second.data?.cartId,
          cartIsEmpty: Array.isArray(second.data?.items) && second.data.items.length === 0 };
      });
    } catch (error) { result.proxyError = error.name; }
    result.providers = {};
    for (const provider of ["google", "facebook"]) {
      try {
        const response = await context.request.get(`${base}/api/auth/${provider}`, { maxRedirects: 0, timeout: 45000 });
        const location = response.headers().location, target = location ? new URL(location, base) : null;
        const callback = target?.searchParams.get("redirect_uri");
        result.providers[provider] = { status: response.status(), hasState: !!target?.searchParams.get("state"),
          callbackOrigin: callback ? new URL(callback).origin : null,
          callbackUsesFrontendProxy: callback ? callback.startsWith(`${base}/api/auth/${provider}/callback`) : false };
      } catch (error) { result.providers[provider] = { error: error.name }; }
    }
  } catch (error) { result.error = error.name || "Observation failed"; }
  finally { await browser.close(); }
  fs.mkdirSync("artifacts", { recursive: true });
  fs.writeFileSync("artifacts/deployment-observation.json", JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result));
}
main().catch(error => { console.error(error.name || "Observation failed"); process.exitCode = 1; });
