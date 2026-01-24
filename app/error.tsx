"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[70vh] items-center justify-center pb-20">
      <div className="max-w-xl rounded-3xl border border-cocoa/10 bg-white p-10 text-center shadow-soft">
        <p className="text-xs uppercase text-cocoa/50">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-semibold text-cocoa">
          We&apos;re refreshing the shelves
        </h1>
        <p className="mt-3 text-sm text-cocoa/70">
          Please try again, or head back to the shop while we sort things out.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            Visit shop
          </Link>
          <Link
            href="/"
            className="rounded-full border border-cocoa/20 px-5 py-2 text-sm font-semibold transition hover:border-brand/40 hover:text-brand"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
