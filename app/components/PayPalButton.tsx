"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import type { CartItem } from "@/lib/cart-store";

export type ShippingDetails = {
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

type PayPalButtonProps = {
  items: CartItem[];
  shippingFee: number;
  total: number;
  currency: string;
  deliveryMethod: "delivery" | "pickup";
  shippingDetails: ShippingDetails;
  onSuccess: (payload: { orderId: string }) => void;
  onError: (message: string) => void;
};

export default function PayPalButton({
  items,
  shippingFee,
  total,
  currency,
  deliveryMethod,
  shippingDetails,
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!paypalClientId) {
    return (
      <p className="text-xs text-red-500">
        PayPal is not configured. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID.
      </p>
    );
  }

  if (isRejected) {
    return (
      <p className="text-xs text-red-500">
        PayPal failed to load. Please refresh and try again.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {isPending && <p className="text-sm text-[var(--muted)]">Loading PayPal...</p>}
      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "pill", label: "pay" }}
        createOrder={async () => {
          const response = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items,
              shipping: shippingFee,
              email: shippingDetails.email,
              deliveryMethod,
              shippingDetails,
              currency,
              total,
            }),
          });
          const data = await response.json();
          if (!response.ok || data.error) {
            const message = data.error || "Unable to create PayPal order.";
            onError(message);
            throw new Error(message);
          }
          return data.orderId as string;
        }}
        onApprove={async (data) => {
          const response = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderID,
              email: shippingDetails.email,
              deliveryMethod,
              shippingDetails,
            }),
          });
          const result = await response.json();
          if (!response.ok || result.error) {
            onError(result.error || "Unable to capture PayPal payment.");
            return;
          }
          onSuccess({ orderId: data.orderID });
        }}
        onError={() => onError("PayPal payment failed. Please try again.")}
      />
    </div>
  );
}
