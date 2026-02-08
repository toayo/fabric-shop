export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div className="rounded-3xl p-8 shadow-sm surface card-hover">
      <h2 className="text-xl font-semibold">Add product</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Product management is disabled in this static configuration. Update
        <code> data/products.ts</code> to add new items.
      </p>
    </div>
  );
}
