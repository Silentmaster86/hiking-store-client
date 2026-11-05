import { test } from "node:test";
import assert from "node:assert/strict";
import { checkoutPayload, validateCheckout, localFieldErrors } from "../src/validation/checkout.js";
import { validateRegistration } from "../src/validation/auth.js";
const form = { email: " A@example.com ", firstName: "Jan", lastName: "Kowalski", address1: "10 Test Road", address2: "", city: "London", postcode: "sw1a1aa", country: "GB" };
test("valid UK form is normalized before submission", () => {
  assert.deepEqual(validateCheckout(form), {});
  assert.equal(checkoutPayload(form).shipping.postcode, "SW1A 1AA");
  assert.equal(checkoutPayload(form).email, "a@example.com");
});
test("invalid postcode and missing names have field-level errors", () => {
  const errors = validateCheckout({ ...form, firstName: "", postcode: "abc", country: "Narnia" });
  for (const name of ["firstName", "postcode", "country"]) assert.ok(errors[name]);
});
test("backend shipping error paths map to checkout input IDs", () => {
  assert.deepEqual(localFieldErrors({ "shipping.postcode": "Invalid", email: "Invalid" }), { postcode: "Invalid", email: "Invalid" });
});
test("registration checks both password characters and UTF-8 bytes", () => {
  assert.ok(validateRegistration({ ...form, password: "x" }).password);
  assert.ok(validateRegistration({ ...form, password: "😀".repeat(20) }).password);
  assert.deepEqual(validateRegistration({ ...form, password: "a secure test password" }), {});
});
