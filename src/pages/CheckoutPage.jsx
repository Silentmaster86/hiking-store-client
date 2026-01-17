import { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createCheckout } from "../api/checkout";

const Wrap = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 12px 0;
`;

const H1 = styled.h1`
  margin: 0 0 6px;
  font-size: 28px;
  letter-spacing: -0.5px;
`;

const Sub = styled.p`
  margin: 0 0 18px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 18px;
  padding: 14px;
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const Grid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;

  @media (min-width: 720px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Field = styled.div`
  display: grid;
  gap: 6px;
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
  padding: 11px 12px;
  outline: none;
  &:focus { box-shadow: 0 0 0 4px rgba(34,197,94,0.12); }
`;

const Row = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 12px;
`;

const ErrorBox = styled.div`
  border: 1px solid rgba(220, 38, 38, 0.4);
  background: rgba(220, 38, 38, 0.08);
  color: rgba(220, 38, 38, 0.95);
  border-radius: 14px;
  padding: 10px 12px;
  font-weight: 800;
`;

const Btn = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.primary};
  color: #03130f;
  border-radius: 14px;
  padding: 12px 12px;
  font-weight: 1100;
  cursor: pointer;
  &:hover { opacity: 0.92; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const Muted = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
`;

function formatPrice(cents) {
  const v = (Number(cents || 0) / 100).toFixed(2);
  return `£${v}`;
}

export default function CheckoutPage() {
  const nav = useNavigate();
  const { items, totalCents, refresh } = useCart();

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    postcode: "",
    country: "UK",
  });

  const [status, setStatus] = useState("idle"); // idle | submitting
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    if (items.length === 0) return false;
    if (!form.email.trim()) return false; // guest checkout wymaga email (backend)
    if (!form.address1.trim() || !form.city.trim() || !form.postcode.trim()) return false;
    return true;
  }, [items.length, form]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setStatus("submitting");

    try {
      const payload = {
        email: form.email.trim(),
        firstName: form.firstName.trim() || null,
        lastName: form.lastName.trim() || null,
        shipping: {
          address1: form.address1.trim(),
          address2: form.address2.trim() || null,
          city: form.city.trim(),
          postcode: form.postcode.trim(),
          country: form.country.trim() || "UK",
        },
      };

      const data = await createCheckout(payload);
      const orderId = data?.order?.id;

      // odśwież cart (backend usuwa cart_items po checkout)
      await refresh?.();

      if (!orderId) throw new Error("Checkout succeeded but no order id returned.");
      nav(`/order/${orderId}/confirmation`, { replace: true, state: { order: data.order } });
    } catch (err) {
      // mapuj "Failed to fetch" na user-friendly
      const msg =
        err?.message === "Failed to fetch"
          ? "Cannot connect to the server. Please try again in a moment."
          : err?.message || "Checkout failed.";
      setError(msg);
      setStatus("idle");
    }
  }

  return (
    <Wrap>
      <H1>Checkout</H1>
      <Sub>Complete your order in one step.</Sub>

      <Card>
        {items.length === 0 ? (
          <Muted>Your cart is empty. Add items from Products first.</Muted>
        ) : (
          <Muted>
            Items: <b>{items.length}</b> · Total: <b>{formatPrice(totalCents)}</b>
          </Muted>
        )}

        <form onSubmit={onSubmit}>
          <Row>
            {error && <ErrorBox>{error}</ErrorBox>}

            <Grid>
              <Field>
                <Label htmlFor="email">Email (required)</Label>
                <Input id="email" name="email" value={form.email} onChange={onChange} placeholder="you@example.com" />
              </Field>

              <Field>
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" value={form.country} onChange={onChange} />
              </Field>

              <Field>
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" name="firstName" value={form.firstName} onChange={onChange} />
              </Field>

              <Field>
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" name="lastName" value={form.lastName} onChange={onChange} />
              </Field>

              <Field>
                <Label htmlFor="address1">Address line 1 (required)</Label>
                <Input id="address1" name="address1" value={form.address1} onChange={onChange} />
              </Field>

              <Field>
                <Label htmlFor="address2">Address line 2</Label>
                <Input id="address2" name="address2" value={form.address2} onChange={onChange} />
              </Field>

              <Field>
                <Label htmlFor="city">City (required)</Label>
                <Input id="city" name="city" value={form.city} onChange={onChange} />
              </Field>

              <Field>
                <Label htmlFor="postcode">Postcode (required)</Label>
                <Input id="postcode" name="postcode" value={form.postcode} onChange={onChange} />
              </Field>
            </Grid>

            <Btn type="submit" disabled={!canSubmit || status === "submitting"}>
              {status === "submitting" ? "Placing order…" : "Place order"}
            </Btn>

            <Muted>
              After placing your order, you’ll see a confirmation screen with order details.
            </Muted>
          </Row>
        </form>
      </Card>
    </Wrap>
  );
}
