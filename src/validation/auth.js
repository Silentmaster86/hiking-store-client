export function validateRegistration(form) {
  const errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) || form.email.trim().length > 254) errors.email = "Enter a valid email address.";
  if (form.password.length < 12) errors.password = "Use at least 12 characters.";
  else if (new TextEncoder().encode(form.password).length > 72) errors.password = "This password is too long. Choose a shorter password.";
  for (const name of ["firstName", "lastName"]) if (form[name].trim().length > 80) errors[name] = "Use up to 80 characters.";
  return errors;
}
