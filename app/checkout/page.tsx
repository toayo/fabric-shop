"use client";

import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/format";
import CartSummary from "@/app/components/CartSummary";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setSubmitting(true);
    setMessage(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (result.error) {
      setMessage(result.error.message ?? "Payment failed. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {message && <p className="text-xs text-red-500">{message}</p>}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="btn-primary w-full rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
      >
        {submitting ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.priceAtAdd * item.length, 0),
    [items]
  );
  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState({ name: "", email: "" });

  useEffect(() => {
    const createIntent = async () => {
      if (items.length === 0) {
        return;
      }
      try {
        const response = await fetch("/.netlify/functions/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        const data = await response.json();
        if (data.error) {
          setError(data.error);
          return;
        }
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError("Unable to start checkout. Please refresh and try again.");
      }
    };

    createIntent();
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="container pb-20">
        <div className="rounded-3xl p-8 text-center shadow-sm surface card-hover">
          <p className="text-sm text-[var(--muted)]">Your cart is empty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container pb-20">
      <h1 className="text-3xl font-semibold">Checkout</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Secure checkout powered by Stripe. Card and Apple Pay are supported.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl p-6 shadow-sm surface card-hover">
          <div className="flex items-center gap-3 text-xs uppercase text-[var(--muted)]">
            <span className={step >= 1 ? "text-[var(--accent)]" : ""}>Cart summary</span>
            <span>→</span>
            <span className={step >= 2 ? "text-[var(--accent)]" : ""}>
              Customer info
            </span>
            <span>→</span>
            <span className={step >= 3 ? "text-[var(--accent)]" : ""}>Payment</span>
          </div>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <p className="text-sm text-[var(--muted)]">
                  You&apos;re purchasing {items.length} fabric selections.
                </p>
                <button
                  onClick={() => setStep(2)}
                  className="btn-primary mt-4 rounded-full px-6 py-3 text-sm font-semibold"
                >
                  Continue
                </button>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="text-xs uppercase text-[var(--muted)]">Name</label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(event) =>
                      setCustomer((prev) => ({ ...prev, name: event.target.value }))
                    }
                    className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase text-[var(--muted)]">Email</label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(event) =>
                      setCustomer((prev) => ({ ...prev, email: event.target.value }))
                    }
                    className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="btn-primary rounded-full px-6 py-3 text-sm font-semibold"
                  >
                    Continue to payment
                  </button>
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                {error && <p className="text-xs text-red-500">{error}</p>}
                {!clientSecret ? (
                  <p className="text-sm text-[var(--muted)]">
                    Preparing secure payment...
                  </p>
                ) : (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "night",
                        variables: {
                          colorPrimary: "#e3b66f",
                          colorBackground: "#3a1a54",
                          colorText: "#f8f2ff",
                          colorTextSecondary: "#d8c7ee",
                          colorBorder: "#5c2c7f",
                        },
                      },
                      loader: "auto",
                    }}
                  >
                    <CheckoutForm clientSecret={clientSecret} />
                  </Elements>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div>
          <CartSummary items={items} />
          <div className="mt-6 rounded-3xl p-6 text-sm text-[var(--muted)] shadow-sm surface card-hover">
            <p className="font-semibold text-[var(--text)]">Total due</p>
            <p className="mt-2 text-2xl font-semibold">
              {formatCurrency(total, items[0]?.currency ?? "JMD")}
            </p>
            <p className="mt-2 text-xs">
              Payments processed securely with Stripe. Apple Pay requires domain verification
              in the Stripe dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
