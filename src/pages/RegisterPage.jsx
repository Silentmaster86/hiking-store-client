import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

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
  color: rgba(220, 38, 38, 0.95);
  border-radius: 14px;
  padding: 10px 12px;
  font-weight: 800;
`;

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setStatus("submitting");

    try {
      await register({
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName.trim() || null,
        lastName: form.lastName.trim() || null,
      });
      nav("/", { replace: true });
    } catch (err) {
      setError(err?.message || "Registration failed.");
      setStatus("idle");
    }
  }

  return (
    <Wrap>
      <H1>Create account</H1>
      <Muted>
        Already have an account? <Link to="/login">Sign in</Link>
      </Muted>

      <Card>
        <form onSubmit={onSubmit}>
          {error && <ErrorBox>{error}</ErrorBox>}

          <Field>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={onChange} />

          </Field>

          <Field>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={onChange} />
          </Field>

          <Field>
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" name="firstName" value={form.firstName} onChange={onChange} />
          </Field>

          <Field>
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" name="lastName" value={form.lastName} onChange={onChange} />
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
