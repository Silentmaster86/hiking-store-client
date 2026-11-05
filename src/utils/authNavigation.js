export function authReturnTo(previous, queryReturnTo) {
  const value = typeof previous?.pathname === "string"
    ? `${previous.pathname}${previous.search || ""}${previous.hash || ""}` : queryReturnTo;
  if (typeof value !== "string" || value.length > 2048 || !value.startsWith("/")
      || value.startsWith("//") || value.includes("\\")) return "/";
  try {
    const url = new URL(value, "https://hiking.invalid");
    return url.origin === "https://hiking.invalid" ? `${url.pathname}${url.search}${url.hash}` : "/";
  } catch { return "/"; }
}

export function oauthError(provider, reason) {
  const providers = { google: "Google", facebook: "Facebook" };
  if (!Object.hasOwn(providers, provider)) return "";
  const name = providers[provider];
  const messages = {
    session: "Your sign-in attempt expired or could not be verified. Start again in this browser. If this repeats, try email and password.",
    cancelled: `${name} sign-in was cancelled. Try again or use another sign-in method.`,
    unavailable: `${name} sign-in is currently unavailable. You can still use email and password.`,
    account_conflict: "An account already uses this email. Sign in using your original method. Accounts are not linked automatically.",
    unverified_email: "Google did not confirm your email address. Verify it with Google, then try again, or use email and password.",
  };
  return Object.hasOwn(messages, reason) ? messages[reason]
    : `${name} sign-in failed. Please try again or use email and password.`;
}
