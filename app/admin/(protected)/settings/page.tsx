export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  return (
    <div className="rounded-3xl p-8 shadow-sm surface card-hover">
      <h2 className="text-xl font-semibold">Shipping rates</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Shipping configuration is static in this build. Update <code>lib/shipping.ts</code>
        for new rates.
      </p>
    </div>
  );
}
