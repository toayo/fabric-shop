"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim() ?? "";

  return (
    <PayPalScriptProvider
      deferLoading={!paypalClientId}
      options={{
        clientId: paypalClientId,
        currency: "USD",
        intent: "capture",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 1, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 1, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </PayPalScriptProvider>
  );
}
