import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductForm from "@/app/admin/components/ProductForm";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  async function createProduct(formData: FormData) {
    "use server";
    const images = JSON.parse(String(formData.get("images") ?? "[]")) as string[];
    const colorsRaw = String(formData.get("colors") ?? "");
    const colors = colorsRaw
      .split(",")
      .map((color) => color.trim())
      .filter(Boolean);

    const product = await prisma.product.create({
      data: {
        name: String(formData.get("name")),
        slug: String(formData.get("slug")),
        pricePerYard: Number(formData.get("pricePerYard")),
        pricePerMeter: Number(formData.get("pricePerMeter")),
        currency: String(formData.get("currency") ?? "JMD"),
        type: String(formData.get("type")),
        colors,
        description: String(formData.get("description")),
        images,
        inStock: Boolean(formData.get("inStock")),
        shippingProfile: String(formData.get("shippingProfile") ?? "") || null,
      },
    });

    redirect(`/admin/products/${product.id}/edit`);
  }

  return (
    <div className="rounded-3xl p-8 shadow-sm surface card-hover">
      <h2 className="text-xl font-semibold">Add product</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Create a new fabric entry and upload images to Cloudinary.
      </p>
      <div className="mt-6">
        <ProductForm action={createProduct} />
      </div>
    </div>
  );
}
