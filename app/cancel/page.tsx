import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="container pb-20">
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-semibold">Payment cancelled</h1>
        <p className="mt-4 text-sm text-cocoa/70">
          Your payment was cancelled. You can review your cart or start checkout again.
        </p>
        <Link
          href="/cart"
          className="mt-6 inline-flex rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white"
        >
          Back to cart
        </Link>
      </div>
    </div>
  );
}
