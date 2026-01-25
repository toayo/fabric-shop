import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="container pb-20">
      <div className="rounded-3xl p-10 text-center shadow-sm surface card-hover">
        <h1 className="text-3xl font-semibold">Payment confirmed</h1>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Thank you for your order. Our team will reach out shortly to confirm Jamaica-wide
          delivery details.
        </p>
        <Link
          href="/shop"
          className="btn-primary mt-6 inline-flex rounded-full px-6 py-3 text-sm font-semibold"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
