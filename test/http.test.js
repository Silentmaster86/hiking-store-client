import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { apiGet, apiRequest } from "../src/api/http.js";
const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });
test("uses the same-origin API and includes session credentials", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "/api/cart");
    assert.equal(options.credentials, "include");
    assert.equal(options.headers["Content-Type"], undefined);
    return new Response(JSON.stringify({ items: [] }));
  };
  assert.deepEqual(await apiGet("/cart"), { items: [] });
});
test("preserves status and field errors for form handling", async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ error: "Check your postcode", code: "VALIDATION_ERROR", fieldErrors: { postcode: "Invalid" } }), { status: 422 });
  await assert.rejects(apiRequest("/checkout", { method: "POST", body: "{}" }), (error) => {
    assert.equal(error.status, 422);
    assert.equal(error.code, "VALIDATION_ERROR");
    assert.equal(error.fieldErrors.postcode, "Invalid");
    return true;
  });
});
test("keeps the existing unauthorized contract and HTTP status", async () => {
  globalThis.fetch = async () => new Response("{}", { status: 401 });
  await assert.rejects(apiGet("/orders"), (error) => error.status === 401 && error.message === "Unauthorized");
});
test("does not expose HTML error responses to customers", async () => {
  globalThis.fetch = async () => new Response("<html>Internal proxy details</html>", { status: 503 });
  await assert.rejects(apiGet("/products"), (error) => error.status === 503 && !error.message.includes("<html>"));
});
test("allows empty successful responses", async () => {
  globalThis.fetch = async () => new Response(null, { status: 204 });
  assert.equal(await apiRequest("/cart/items/1", { method: "DELETE" }), null);
});
test("a timed-out write is aborted and never automatically retried", async () => {
  let calls = 0;
  globalThis.fetch = (_url, options) => new Promise((_resolve, reject) => {
    calls++;
    options.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
  });
  await assert.rejects(apiRequest("/checkout", { method: "POST", body: "{}", timeoutMs: 5 }), error => error.code === "REQUEST_TIMEOUT");
  assert.equal(calls, 1);
});
test("caller cancellation and network failures have distinct results", async () => {
  const controller = new AbortController();
  globalThis.fetch = (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
  });
  const pending = apiGet("/products", { signal: controller.signal }); controller.abort();
  await assert.rejects(pending, error => error.name === "AbortError");
  globalThis.fetch = async () => { throw new TypeError("Private network details"); };
  await assert.rejects(apiGet("/products"), error => error.code === "NETWORK_ERROR" && !error.message.includes("Private"));
});
test("mutations include the browser request-verification header", async () => {
  globalThis.fetch = async (_url, options) => {
    assert.equal(options.headers["X-Store-Request"], "1");
    return new Response("{}");
  };
  await apiRequest("/auth/login", { method: "POST", body: "{}" });
  await apiRequest("/cart/items/1", { method: "DELETE" });
});
