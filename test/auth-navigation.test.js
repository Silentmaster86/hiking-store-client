import { test } from "node:test";
import assert from "node:assert/strict";
import { authReturnTo, oauthError } from "../src/utils/authNavigation.js";

test("sign-in preserves an order destination through navigation and callback queries", () => {
  assert.equal(authReturnTo({ pathname: "/order/28/confirmation", search: "?saved=1", hash: "#items" }), "/order/28/confirmation?saved=1#items");
  assert.equal(authReturnTo(null, "/order/28/confirmation"), "/order/28/confirmation");
  assert.equal(authReturnTo({ pathname: "/orders" }, "/cart"), "/orders");
});

test("sign-in rejects external or malformed return destinations", () => {
  for (const value of [undefined, "https://example.com", "//example.com", "/\\example.com", "/\n/example.com", "/".repeat(2049), ["/orders"]]) {
    assert.equal(authReturnTo(null, value), "/");
    assert.equal(authReturnTo({ pathname: value }), "/");
  }
});

test("OAuth feedback uses only known messages and never reflects provider error details", () => {
  assert.match(oauthError("google", "session"), /expired/);
  assert.match(oauthError("facebook", "cancelled"), /cancelled/);
  assert.match(oauthError("google", "account_conflict"), /original method/);
  assert.match(oauthError("google", "unverified_email"), /Verify it with Google/);
  assert.match(oauthError("facebook", "unavailable"), /unavailable/);
  assert.equal(oauthError("google", "token=private-value").includes("private-value"), false);
  assert.equal(oauthError("<script>", "failed"), "");
  assert.equal(oauthError("__proto__", "failed"), "");
  assert.equal(typeof oauthError("google", "__proto__"), "string");
});
