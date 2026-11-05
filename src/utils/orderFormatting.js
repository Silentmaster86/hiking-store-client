export const money = (cents) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(Number(cents || 0) / 100);
export const statusLabels = { pending: "Order placed", paid: "Demo payment complete", shipped: "Demo shipment sent", delivered: "Demo delivery complete", cancelled: "Cancelled", created: "Order placed" };
