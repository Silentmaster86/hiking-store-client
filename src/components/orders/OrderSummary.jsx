import styled from "styled-components";
import { money, statusLabels } from "../../utils/orderFormatting";
const Summary = styled.div`
  dl { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; }
  dt { color: ${({ theme }) => theme.colors.muted}; }
  dd { margin: 0; text-align: right; overflow-wrap: anywhere; }
  li { margin: 12px 0; }
  address { font-style: normal; line-height: 1.6; overflow-wrap: anywhere; }
`;
export default function OrderSummary({ order, items = [] }) {
  return <Summary>
    <dl>
      <dt>Order number</dt><dd>#{order.id}</dd>
      <dt>Status</dt><dd>{statusLabels[order.status] || order.status}</dd>
      <dt>Placed on</dt><dd>{new Date(order.created_at).toLocaleString("en-GB")}</dd>
      <dt>Subtotal</dt><dd>{money(order.subtotal_cents ?? order.total_cents)}</dd>
      <dt>Delivery</dt><dd>{Number(order.shipping_cents || 0) === 0 ? "Free (demo)" : money(order.shipping_cents)}</dd>
      <dt>Total</dt><dd><strong>{money(order.total_cents)}</strong></dd>
    </dl>
    <h2>Items</h2>
    <ul>{items.map((item, index) => <li key={`${item.product_id}-${index}`}>{item.name} × {item.quantity} — {money(item.line_total_cents ?? item.price_cents * item.quantity)}</li>)}</ul>
    <h2>Delivery details</h2>
    <address>{[`${order.first_name || ""} ${order.last_name || ""}`.trim(), order.shipping_address1, order.shipping_address2, order.shipping_city, order.shipping_postcode, order.shipping_country === "GB" || order.shipping_country === "UK" ? "United Kingdom" : order.shipping_country].filter(Boolean).map((line, index) => <div key={index}>{line}</div>)}</address>
    <p>Portfolio demo — no payments are taken and no goods are shipped.</p>
  </Summary>;
}
