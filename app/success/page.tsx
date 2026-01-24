import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="container pb-20">
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-semibold">Payment confirmed</h1>
        <p className="mt-4 text-sm text-cocoa/70">
          Thank you for your order. Our team will reach out shortly to confirm Jamaica-wide
          delivery details.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-dark"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
