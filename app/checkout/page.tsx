"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/format";
import CartSummary from "@/app/components/CartSummary";
import { parishes } from "@/lib/locations";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: Record<string, unknown>) => { render: (selector: HTMLElement) => void };
    };
  }
}

type PaymentMethod = "stripe" | "paypal";

type ShippingFormState = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  parish: string;
  city: string;
  postalCode: string;
  deliveryNotes: string;
};

type ShippingFormErrors = Partial<Record<keyof ShippingFormState, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getGmailOnlyFlag = () =>
  (process.env.NEXT_PUBLIC_GMAIL_ONLY ?? process.env.GMAIL_ONLY ?? "false").toLowerCase() ===
  "true";

const isValidPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 7) {
    return false;
  }
  return /^[+\d][\d\s-]*$/.test(value.trim());
};

const getShippingSchema = (gmailOnly: boolean, deliveryMethod: "delivery" | "pickup") =>
  z.object({
    fullName: z.string().min(2, "Full name is required."),
    email: z
      .string()
      .regex(emailRegex, "Enter a valid email address.")
      .refine(
        (value) => !gmailOnly || value.toLowerCase().endsWith("@gmail.com"),
        "Email must be a @gmail.com address."
      ),
    phone: z.string().refine(isValidPhone, "Enter a valid phone number."),
    addressLine1:
      deliveryMethod === "delivery"
        ? z.string().min(5, "Address line 1 must be at least 5 characters.")
        : z.string().optional(),
    addressLine2: z.string().optional(),
    parish:
      deliveryMethod === "delivery"
        ? z.string().min(1, "Select a parish.")
        : z.string().optional(),
    city:
      deliveryMethod === "delivery"
        ? z.string().min(2, "City/Town must be at least 2 characters.")
        : z.string().optional(),
    postalCode: z.string().optional(),
    deliveryNotes: z.string().optional(),
  });

function CheckoutForm({
  clientSecret,
  email,
  deliveryMethod,
  shippingDetails,
}: {
  clientSecret: string;
  email: string;
  deliveryMethod: "delivery" | "pickup";
  shippingDetails: ShippingFormState;
}) {
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
        return_url: `${window.location.origin}/order/success`,
        payment_method_data: {
          billing_details: {
            name: shippingDetails.fullName,
            email,
            phone: shippingDetails.phone,
            address:
              deliveryMethod === "delivery"
                ? {
                    line1: shippingDetails.addressLine1,
                    line2: shippingDetails.addressLine2 || undefined,
                    city: shippingDetails.city,
                    postal_code: shippingDetails.postalCode || undefined,
                    country: "JM",
                  }
                : undefined,
          },
        },
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
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.priceAtAdd * item.length, 0),
    [items]
  );
  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [shippingConfig, setShippingConfig] = useState<{
    kingstonFee: number;
    otherParishFee: number;
    pickupFee: number;
  } | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [formErrors, setFormErrors] = useState<ShippingFormErrors>({});
  const [showErrorSummary, setShowErrorSummary] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const [paypalReady, setPaypalReady] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement | null>(null);
  const [shippingForm, setShippingForm] = useState<ShippingFormState>({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    parish: "Kingston",
    city: "",
    postalCode: "",
    deliveryNotes: "",
  });

  useEffect(() => {
    fetch("/api/shipping-config")
      .then((res) => res.json())
      .then((data) => setShippingConfig(data))
      .catch(() => setShippingConfig(null));
  }, []);

  const shippingFee = useMemo(() => {
    if (!shippingConfig) {
      return 0;
    }
    if (deliveryMethod === "pickup") {
      return shippingConfig.pickupFee;
    }
    const normalized = shippingForm.parish.toLowerCase();
    const isKingston =
      normalized === "kingston" || normalized === "st. andrew" || normalized === "st andrew";
    return isKingston ? shippingConfig.kingstonFee : shippingConfig.otherParishFee;
  }, [deliveryMethod, shippingConfig, shippingForm.parish]);

  const total = subtotal + shippingFee;

  useEffect(() => {
    if (step < 3) {
      setClientSecret(null);
    }
  }, [step]);

  useEffect(() => {
    setClientSecret(null);
  }, [deliveryMethod, shippingForm.parish, shippingFee]);

  useEffect(() => {
    setClientSecret(null);
  }, [shippingForm.email]);

  useEffect(() => {
    if (paymentMethod !== "paypal") {
      setPaypalError(null);
      return;
    }
    if (paypalClientId) {
      return;
    }
    fetch("/api/paypal/client-id")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setPaypalError(data.error);
          return;
        }
        if (data.clientId) {
          setPaypalClientId(data.clientId);
        }
      })
      .catch(() => {
        setPaypalError("Unable to load PayPal. Please try again.");
      });
  }, [paymentMethod, paypalClientId]);

  useEffect(() => {
    if (paymentMethod !== "paypal" || !paypalClientId) {
      return;
    }
    if (window.paypal) {
      setPaypalReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=${(
      items[0]?.currency ?? "JMD"
    ).toUpperCase()}`;
    script.async = true;
    script.onload = () => setPaypalReady(true);
    script.onerror = () => setPaypalError("Unable to load PayPal. Please try again.");
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [paymentMethod, paypalClientId, items]);

  useEffect(() => {
    if (!paypalReady || paymentMethod !== "paypal" || !paypalContainerRef.current) {
      return;
    }
    paypalContainerRef.current.innerHTML = "";
    setPaypalError(null);
    window.paypal
      ?.Buttons({
        style: {
          layout: "vertical",
          color: "gold",
          shape: "pill",
          label: "pay",
        },
        createOrder: async () => {
          const response = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items,
              shipping: shippingFee,
              email: shippingForm.email,
              deliveryMethod,
              shippingDetails: shippingForm,
              currency: items[0]?.currency ?? "JMD",
              total,
            }),
          });
          const data = await response.json();
          if (!response.ok || data.error) {
            throw new Error(data.error || "Unable to create PayPal order.");
          }
          return data.orderId;
        },
        onApprove: async (data: { orderID: string }) => {
          const response = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderID,
              email: shippingForm.email,
              deliveryMethod,
              shippingDetails: shippingForm,
            }),
          });
          const result = await response.json();
          if (!response.ok || result.error) {
            setPaypalError(result.error || "Unable to capture PayPal payment.");
            return;
          }
          window.location.href = `/order/success?paypal_order_id=${data.orderID}`;
        },
        onError: () => {
          setPaypalError("PayPal payment failed. Please try again.");
        },
      })
      .render(paypalContainerRef.current);
  }, [paypalReady, paymentMethod, shippingFee, shippingForm, deliveryMethod, items, total]);

  useEffect(() => {
    const createIntent = async () => {
      if (
        paymentMethod !== "stripe" ||
        items.length === 0 ||
        !shippingForm.email ||
        step < 3 ||
        clientSecret
      ) {
        return;
      }
      try {
        const orderParish = deliveryMethod === "pickup" ? "Pickup" : shippingForm.parish;
        const response = await fetch("/.netlify/functions/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            shipping: shippingFee,
            parish: orderParish,
            deliveryMethod,
            email: shippingForm.email,
            shippingDetails: shippingForm,
            fullName: shippingForm.fullName,
          }),
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
  }, [items, shippingForm, deliveryMethod, shippingFee, step, paymentMethod]);

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
        Secure checkout powered by Stripe and PayPal. Card and Apple Pay are supported.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl p-6 shadow-sm surface card-hover">
          <div className="flex items-center gap-3 text-xs uppercase text-[var(--muted)]">
            <span className={step >= 1 ? "text-[var(--accent)]" : ""}>Cart summary</span>
            <span>→</span>
            <span className={step >= 2 ? "text-[var(--accent)]" : ""}>Shipping</span>
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
                {showErrorSummary && Object.keys(formErrors).length > 0 && (
                  <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                    Please correct the highlighted fields before continuing.
                  </div>
                )}
                <div>
                  <label className="text-xs uppercase text-[var(--muted)]">Full name</label>
                  <input
                    type="text"
                    value={shippingForm.fullName}
                    onChange={(event) =>
                      setShippingForm((prev) => ({ ...prev, fullName: event.target.value }))
                    }
                    className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs uppercase text-[var(--muted)]">Email</label>
                  <input
                    type="email"
                    value={shippingForm.email}
                    onChange={(event) =>
                      setShippingForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs uppercase text-[var(--muted)]">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 876 555 1234"
                    value={shippingForm.phone}
                    onChange={(event) =>
                      setShippingForm((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs uppercase text-[var(--muted)]">
                    Delivery method
                  </label>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {(["delivery", "pickup"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setDeliveryMethod(option)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          deliveryMethod === option ? "btn-primary shadow-soft" : "btn-secondary"
                        }`}
                      >
                        {option === "delivery" ? "Delivery" : "Pickup"}
                      </button>
                    ))}
                  </div>
                </div>
                {deliveryMethod === "delivery" && (
                  <>
                    <div>
                      <label className="text-xs uppercase text-[var(--muted)]">
                        Address line 1
                      </label>
                      <input
                        type="text"
                        placeholder="House # / Street / Road"
                        value={shippingForm.addressLine1}
                        onChange={(event) =>
                          setShippingForm((prev) => ({
                            ...prev,
                            addressLine1: event.target.value,
                          }))
                        }
                        className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
                      />
                      {formErrors.addressLine1 && (
                        <p className="mt-1 text-xs text-red-400">
                          {formErrors.addressLine1}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs uppercase text-[var(--muted)]">
                        Address line 2 (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Apt/Suite/Community"
                        value={shippingForm.addressLine2}
                        onChange={(event) =>
                          setShippingForm((prev) => ({
                            ...prev,
                            addressLine2: event.target.value,
                          }))
                        }
                        className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase text-[var(--muted)]">Parish</label>
                      <select
                        value={shippingForm.parish}
                        onChange={(event) =>
                          setShippingForm((prev) => ({
                            ...prev,
                            parish: event.target.value,
                          }))
                        }
                        className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
                      >
                        {parishes.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                      {formErrors.parish && (
                        <p className="mt-1 text-xs text-red-400">{formErrors.parish}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs uppercase text-[var(--muted)]">City/Town</label>
                      <input
                        type="text"
                        value={shippingForm.city}
                        onChange={(event) =>
                          setShippingForm((prev) => ({ ...prev, city: event.target.value }))
                        }
                        className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
                      />
                      {formErrors.city && (
                        <p className="mt-1 text-xs text-red-400">{formErrors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs uppercase text-[var(--muted)]">
                        Postal code (optional)
                      </label>
                      <input
                        type="text"
                        value={shippingForm.postalCode}
                        onChange={(event) =>
                          setShippingForm((prev) => ({
                            ...prev,
                            postalCode: event.target.value,
                          }))
                        }
                        className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase text-[var(--muted)]">
                        Delivery notes (optional)
                      </label>
                      <textarea
                        value={shippingForm.deliveryNotes}
                        onChange={(event) =>
                          setShippingForm((prev) => ({
                            ...prev,
                            deliveryNotes: event.target.value,
                          }))
                        }
                        className="input-theme mt-2 w-full rounded-3xl px-4 py-3 text-sm"
                        rows={3}
                      />
                    </div>
                  </>
                )}
                <div className="rounded-2xl border border-theme p-4 text-sm text-[var(--muted)]">
                  <p className="font-semibold text-[var(--text)]">Shipping total</p>
                  <p className="mt-1">{formatCurrency(shippingFee, "JMD")}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      const schema = getShippingSchema(getGmailOnlyFlag(), deliveryMethod);
                      const result = schema.safeParse(shippingForm);
                      if (!result.success) {
                        const nextErrors: ShippingFormErrors = {};
                        result.error.errors.forEach((issue) => {
                          const field = issue.path[0] as keyof ShippingFormState;
                          if (field) {
                            nextErrors[field] = issue.message;
                          }
                        });
                        setFormErrors(nextErrors);
                        setShowErrorSummary(true);
                        return;
                      }
                      setFormErrors({});
                      setShowErrorSummary(false);
                      setStep(3);
                    }}
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
                className="mt-6 space-y-6"
              >
                <div>
                  <p className="text-xs uppercase text-[var(--muted)]">Payment method</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {([
                      { id: "stripe", label: "Card / Apple Pay" },
                      { id: "paypal", label: "PayPal" },
                    ] as const).map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setPaymentMethod(option.id)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          paymentMethod === option.id
                            ? "btn-primary shadow-soft"
                            : "btn-secondary"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                {paymentMethod === "stripe" && (
                  <div>
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
                            },
                          },
                          loader: "auto",
                        }}
                      >
                        <CheckoutForm
                          clientSecret={clientSecret}
                          email={shippingForm.email}
                          deliveryMethod={deliveryMethod}
                          shippingDetails={shippingForm}
                        />
                      </Elements>
                    )}
                  </div>
                )}
                {paymentMethod === "paypal" && (
                  <div className="space-y-4">
                    {paypalError && <p className="text-xs text-red-500">{paypalError}</p>}
                    {!paypalReady && (
                      <p className="text-sm text-[var(--muted)]">Loading PayPal...</p>
                    )}
                    <div ref={paypalContainerRef} />
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold"
                  >
                    Back
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div>
          <CartSummary items={items} />
          <div className="mt-6 rounded-3xl p-6 text-sm text-[var(--muted)] shadow-sm surface card-hover">
            <p className="font-semibold text-[var(--text)]">Total due</p>
            <div className="mt-2 space-y-2 text-sm text-[var(--muted)]">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal, items[0]?.currency ?? "JMD")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>{formatCurrency(shippingFee, "JMD")}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-[var(--text)]">
                <span>Total</span>
                <span>{formatCurrency(total, items[0]?.currency ?? "JMD")}</span>
              </div>
            </div>
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
