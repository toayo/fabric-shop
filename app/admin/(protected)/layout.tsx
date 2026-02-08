import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  requireAdmin();

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
