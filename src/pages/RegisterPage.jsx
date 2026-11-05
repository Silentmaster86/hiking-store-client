import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { validateRegistration } from "../validation/auth";
import { useAuth } from "../context/auth-context";

const Wrap = styled.div`
  max-width: 520px;
  margin: 0 auto;
  padding: 12px 0;

  /* Mobile: tighter spacing + full width feel */
  @media (max-width: 480px) {
    max-width: 100%;
    padding: 8px;
  }
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 18px;
  padding: 14px;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  backdrop-filter: blur(10px);

  @media (max-width: 480px) {
    border-radius: 14px;
    padding: 12px;
  }
`;

const H1 = styled.h1`
  margin: 0 0 6px;
  font-size: 28px;
  letter-spacing: -0.5px;

  @media (max-width: 520px) {
    font-size: 24px;
  }
`;

const Muted = styled.p`
  margin: 0 0 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Field = styled.div`
  display: grid;
  gap: 16px;
  margin-top: 10px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.muted};
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.03);
  color: ${({ theme }) => theme.colors.text};
  border-radius: 12px;
  padding: 10px 12px;
  outline: none;
  font-size: 14px;

  &:focus { box-shadow: 0 0 0 4px rgba(34,197,94,0.12); }

  /* Better mobile typing */
  @media (max-width: 520px) {
    padding: 12px 12px;
    font-size: 16px; /* prevents iOS zoom */
  }
`;

const Btn = styled.button`
  margin-top: 26px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryText};
  border-radius: 14px;
  padding: 11px;
  font-weight: 1100;
  font-size: 14px;
  cursor: pointer;

  &:hover { opacity: 0.62; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }

  @media (max-width: 520px) {
    border-radius: 13px;
    padding: 12px 12px;
  }
`;

const ErrorBox = styled.div`
  margin-top: 10px;
  border: 1px solid rgba(220, 38, 38, 0.4);
  background: rgba(220, 38, 38, 0.08);
  color: ${({ theme }) => theme.colors.danger};
  border-radius: 14px;
  padding: 10px 12px;
  font-weight: 800;
`;

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const errors = validateRegistration(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length) { document.getElementById(Object.keys(errors)[0])?.focus(); return; }
    setStatus("submitting");

    try {
      await register({
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName.trim() || null,
        lastName: form.lastName.trim() || null,
      });
      const previous = location.state?.from;
      nav(previous?.pathname ? `${previous.pathname}${previous.search || ""}${previous.hash || ""}` : "/", { replace: true });
    } catch (err) {
      setError(err?.message || "Registration failed.");
      setFieldErrors(err.fieldErrors || {});
      document.getElementById(Object.keys(err.fieldErrors || {})[0])?.focus();
      setStatus("idle");
    }
  }

  return (
    <Wrap>
      <H1>Create account</H1>
      <Muted>
        Already have an account? <Link to="/login" state={location.state}>Sign in</Link>
      </Muted>

      <Card>
        <form noValidate onSubmit={onSubmit}>
          {error && <ErrorBox>{error}</ErrorBox>}

          <Field>
            <Label htmlFor="email">Email</Label>
            <Input aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email ? "email-error" : undefined} id="email" name="email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={onChange} />
            {fieldErrors.email && <div id="email-error" role="alert">{fieldErrors.email}</div>}

          </Field>

          <Field>
            <Label htmlFor="password">Password (at least 12 characters)</Label>
            <Input aria-invalid={!!fieldErrors.password} aria-describedby={fieldErrors.password ? "password-error" : undefined} id="password" name="password" type="password" minLength={12} required autoComplete="new-password" value={form.password} onChange={onChange} />
            {fieldErrors.password && <div id="password-error" role="alert">{fieldErrors.password}</div>}
          </Field>

          <Field>
            <Label htmlFor="firstName">First name</Label>
            <Input aria-invalid={!!fieldErrors.firstName} aria-describedby={fieldErrors.firstName ? "firstName-error" : undefined} id="firstName" name="firstName" value={form.firstName} onChange={onChange} />
            {fieldErrors.firstName && <div id="firstName-error" role="alert">{fieldErrors.firstName}</div>}
          </Field>

          <Field>
            <Label htmlFor="lastName">Last name</Label>
            <Input aria-invalid={!!fieldErrors.lastName} aria-describedby={fieldErrors.lastName ? "lastName-error" : undefined} id="lastName" name="lastName" value={form.lastName} onChange={onChange} />
            {fieldErrors.lastName && <div id="lastName-error" role="alert">{fieldErrors.lastName}</div>}
          </Field>

          <Btn
            type="submit"
            disabled={status === "submitting" || !form.email.trim() || !form.password}
          >
            {status === "submitting" ? "Creating…" : "Create account"}
          </Btn>
        </form>
      </Card>
    </Wrap>
  );
}
