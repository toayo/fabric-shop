import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container pb-20 pt-10">
      <div className="rounded-3xl p-10 text-center shadow-sm surface card-hover">
        <p className="text-xs uppercase text-[var(--muted)]">404</p>
        <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          The page you&apos;re looking for doesn&apos;t exist. Explore the latest fabrics or return
          home.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/shop"
            className="btn-primary rounded-full px-6 py-3 text-sm font-semibold"
          >
            Browse fabrics
          </Link>
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
