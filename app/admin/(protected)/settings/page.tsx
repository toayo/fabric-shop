import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getShippingConfig } from "@/lib/shipping";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const config = await getShippingConfig();

  async function updateConfig(formData: FormData) {
    "use server";
    await prisma.shippingConfig.update({
      where: { id: config.id },
      data: {
        kingstonFee: Number(formData.get("kingstonFee")),
        otherParishFee: Number(formData.get("otherParishFee")),
        pickupFee: Number(formData.get("pickupFee")),
      },
    });
    revalidatePath("/admin/settings");
  }

  return (
    <div className="rounded-3xl p-8 shadow-sm surface card-hover">
      <h2 className="text-xl font-semibold">Shipping rates</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Configure delivery and pickup fees for Jamaica checkout.
      </p>
      <form action={updateConfig} className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs uppercase text-[var(--muted)]">Kingston &amp; St. Andrew</label>
          <input
            name="kingstonFee"
            type="number"
            defaultValue={config.kingstonFee}
            className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase text-[var(--muted)]">Other parishes</label>
          <input
            name="otherParishFee"
            type="number"
            defaultValue={config.otherParishFee}
            className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase text-[var(--muted)]">Pickup fee</label>
          <input
            name="pickupFee"
            type="number"
            defaultValue={config.pickupFee}
            className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button className="btn-primary rounded-full px-6 py-3 text-sm font-semibold">
            Save rates
          </button>
        </div>
      </form>
    </div>
  );
}
