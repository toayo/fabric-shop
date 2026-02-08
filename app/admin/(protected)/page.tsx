export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  return (
    <div className="rounded-3xl p-8 shadow-sm surface card-hover">
      <h2 className="text-xl font-semibold">Admin dashboard unavailable</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        The admin dashboard is disabled in this static configuration. Update the product
        catalog in <code>data/products.ts</code>.
      </p>
    </div>
  );
}
