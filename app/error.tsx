"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container pb-20 pt-10">
      <div className="rounded-3xl p-10 text-center shadow-sm surface card-hover">
        <p className="text-xs uppercase text-[var(--muted)]">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-semibold">We hit a snag</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Please try again. If the issue persists, return to the storefront.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="btn-primary rounded-full px-6 py-3 text-sm font-semibold"
          >
            Try again
          </button>
          <Link
            href="/"
            className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
