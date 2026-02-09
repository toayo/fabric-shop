import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="container pb-20">
      <div className="rounded-3xl p-10 text-center shadow-sm surface card-hover">
        <h1 className="text-3xl font-semibold">Payment cancelled</h1>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Your payment was cancelled. You can review your cart or start checkout again.
        </p>
        <Link
          href="/cart"
          className="btn-primary mt-6 inline-flex rounded-full px-6 py-3 text-sm font-semibold"
        >
          Back to cart
        </Link>
      </div>
    </div>
  );
}
