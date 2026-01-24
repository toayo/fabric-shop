"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type EmptyStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({
  title = "No fabrics found",
  description = "Try adjusting your filters or explore the full collection.",
  actionLabel = "Back to shop",
  actionHref = "/shop",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-dashed border-cocoa/20 bg-white/70 p-10 text-center shadow-sm"
    >
      <h2 className="text-xl font-semibold text-cocoa">{title}</h2>
      <p className="mt-3 text-sm text-cocoa/70">{description}</p>
      <Link
        href={actionHref}
        className="mt-6 inline-flex rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-dark"
      >
        {actionLabel}
      </Link>
    </motion.div>
  );
}
