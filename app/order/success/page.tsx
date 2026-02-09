"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatCurrency, formatQuantity } from "@/lib/format";

type OrderResponse = {
  id: string;
  email: string;
  items: Array<{
    name: string;
    length: number;
    unit: "yard" | "meter" | "spool";
    priceAtAdd: number;
    currency: string;
  }>;
  total: number;
  shipping: number;
  parish: string;
  deliveryMethod: string;
};

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const paymentIntent = params.get("payment_intent");
  const paypalOrderId = params.get("paypal_order_id");
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (paypalOrderId) {
      const stored = localStorage.getItem("harveys-paypal-order");
      if (stored) {
        try {
          setOrder(JSON.parse(stored) as OrderResponse);
        } catch (err) {
          setError("Unable to read PayPal order details.");
        }
      }
      return;
    }
    if (!paymentIntent) {
      setError("Missing payment reference.");
      return;
    }
    fetch(`/api/order/confirm?payment_intent=${paymentIntent}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setOrder(data);
      })
      .catch(() => setError("Unable to load order confirmation."));
  }, [paymentIntent, paypalOrderId]);

  return (
    <div className="container pb-20 pt-10">
      <div className="rounded-3xl p-10 shadow-sm surface card-hover">
        <h1 className="text-3xl font-semibold">Order confirmed</h1>
        {paypalOrderId ? (
          <>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Thank you for shopping with Harvey&apos;s. Your PayPal reference is{" "}
              <span className="font-semibold text-[var(--text)]">{paypalOrderId}</span>.
            </p>
            {order ? (
              <>
                <div className="mt-6 space-y-3 rounded-2xl border border-theme p-4 text-sm text-[var(--muted)]">
                  {(Array.isArray(order.items) ? order.items : []).map((item) => (
                    <div
                      key={`${item.name}-${item.unit}-${item.length}`}
                      className="flex justify-between"
                    >
                      <span>
                        {item.name} · {formatQuantity(item.length, item.unit)} {item.unit}
                        {item.length === 1 ? "" : "s"}
                      </span>
                      <span>{formatCurrency(item.priceAtAdd * item.length, item.currency)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-theme pt-3 text-sm font-semibold">
                    <span>Shipping ({order.deliveryMethod})</span>
                    <span>{formatCurrency(order.shipping, "JMD")}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total, "JMD")}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-[var(--muted)]">
                  Delivery parish: {order.parish}. We&apos;ll follow up with delivery details by
                  email.
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm text-[var(--muted)]">
                We&apos;ll follow up with delivery details by email.
              </p>
            )}
          </>
        ) : error ? (
          <p className="mt-3 text-sm text-red-200">{error}</p>
        ) : order ? (
          <>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Thank you for shopping with Harvey&apos;s. Your order number is{" "}
              <span className="font-semibold text-[var(--text)]">{order.id}</span>.
            </p>
            <div className="mt-6 space-y-3 rounded-2xl border border-theme p-4 text-sm text-[var(--muted)]">
              {(Array.isArray(order.items) ? order.items : []).map((item) => (
                <div
                  key={`${item.name}-${item.unit}-${item.length}`}
                  className="flex justify-between"
                >
                  <span>
                    {item.name} · {formatQuantity(item.length, item.unit)} {item.unit}
                    {item.length === 1 ? "" : "s"}
                  </span>
                  <span>{formatCurrency(item.priceAtAdd * item.length, item.currency)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-theme pt-3 text-sm font-semibold">
                <span>Shipping ({order.deliveryMethod})</span>
                <span>{formatCurrency(order.shipping, "JMD")}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total, "JMD")}</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-[var(--muted)]">
              Delivery parish: {order.parish}. We&apos;ll follow up with delivery details by
              email.
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-[var(--muted)]">Loading your order...</p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/shop" className="btn-primary rounded-full px-6 py-3 text-sm font-semibold">
            Continue shopping
          </Link>
          <Link href="/" className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
