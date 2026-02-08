import { CartItem } from "@/lib/cart-store";
import { formatCurrency, formatQuantity, formatUnit } from "@/lib/format";

export default function CartSummary({ items }: { items: CartItem[] }) {
  const total = items.reduce((sum, item) => sum + item.priceAtAdd * item.length, 0);

  return (
    <div className="rounded-3xl p-6 shadow-sm surface card-hover">
      <h3 className="text-sm font-semibold">Order Summary</h3>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-[var(--muted)]">
                {formatQuantity(item.length, item.unit)} {item.unit}
                {item.length === 1 ? "" : "s"} · {formatUnit(item.unit)}
              </p>
            </div>
            <span>{formatCurrency(item.priceAtAdd * item.length, item.currency)}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-theme pt-4 text-sm font-semibold">
        <span>Total</span>
        <span>{formatCurrency(total, items[0]?.currency ?? "JMD")}</span>
      </div>
      <p className="mt-3 text-xs text-[var(--muted)]">
        Shipping within Jamaica calculated at checkout. Need bulk delivery? Contact our team.
      </p>
    </div>
  );
}
