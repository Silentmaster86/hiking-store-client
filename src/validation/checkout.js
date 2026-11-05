const text = (value) => typeof value === "string" ? value.trim() : "";
const postcodePattern = /^(?:GIR 0AA|[A-PR-UWYZ](?:\d{1,2}|[A-HK-Y]\d{1,2}|\d[A-HJKPSTUW]|[A-HK-Y]\d[ABEHMNPRVWXY]) \d[ABD-HJLNP-UW-Z]{2})$/;
export function checkoutPayload(form) {
  const compact = text(form.postcode).toUpperCase().replace(/\s+/g, "");
  return { email: text(form.email).toLowerCase(), firstName: text(form.firstName), lastName: text(form.lastName),
    shipping: { address1: text(form.address1), address2: text(form.address2), city: text(form.city), country: form.country,
      postcode: compact.length > 3 ? `${compact.slice(0, -3)} ${compact.slice(-3)}` : compact } };
}
export function validateCheckout(form) {
  const value = checkoutPayload(form), errors = {};
  if (value.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) errors.email = "Enter a valid email address.";
  for (const name of ["firstName", "lastName"]) if (!value[name] || value[name].length > 80) errors[name] = "Enter a name of up to 80 characters.";
  for (const name of ["address1", "city"]) if (!value.shipping[name] || value.shipping[name].length > 200) errors[name] = "Enter a value of up to 200 characters.";
  if (value.shipping.address2.length > 200) errors.address2 = "Use up to 200 characters.";
  if (!postcodePattern.test(value.shipping.postcode)) errors.postcode = "Enter a valid UK postcode, for example SW1A 1AA.";
  if (value.shipping.country !== "GB") errors.country = "United Kingdom addresses only.";
  return errors;
}
export function localFieldErrors(errors = {}) {
  return Object.fromEntries(Object.entries(errors).map(([key, value]) => [key.replace(/^shipping\./, ""), value]));
}
