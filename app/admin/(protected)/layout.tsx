import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { isDatabaseConfigured } from "@/lib/db";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  requireAdmin();

  if (!isDatabaseConfigured()) {
    return (
      <div className="container pb-20 pt-10">
        <div className="rounded-3xl p-8 shadow-sm surface card-hover">
          <h1 className="text-2xl font-semibold">Database not configured</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Set DATABASE_URL in your environment to enable the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container pb-20 pt-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase text-[var(--muted)]">Admin dashboard</p>
          <h1 className="text-3xl font-semibold">Harvey&apos;s Control Room</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold" href="/admin">
            Products
          </Link>
          <Link
            className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold"
            href="/admin/settings"
          >
            Shipping
          </Link>
          <form action="/admin/logout" method="post">
            <button className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold">
              Logout
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
