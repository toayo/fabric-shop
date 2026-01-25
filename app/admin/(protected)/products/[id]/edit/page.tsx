import { notFound, redirect } from "next/navigation";
import { getPrismaClient } from "@/lib/db";
import ProductForm from "@/app/admin/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const prisma = await getPrismaClient();
  if (!prisma) {
    return null;
  }
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) {
    notFound();
  }

  async function updateProduct(formData: FormData) {
    "use server";
    const prisma = await getPrismaClient();
    if (!prisma) {
      return;
    }
    const images = JSON.parse(String(formData.get("images") ?? "[]")) as string[];
    const colorsRaw = String(formData.get("colors") ?? "");
    const colors = colorsRaw
      .split(",")
      .map((color) => color.trim())
      .filter(Boolean);

    await prisma.product.update({
      where: { id: params.id },
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

    redirect(`/admin/products/${params.id}/edit`);
  }

  return (
    <div className="rounded-3xl p-8 shadow-sm surface card-hover">
      <h2 className="text-xl font-semibold">Edit product</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Update pricing, inventory, colors, and imagery.
      </p>
      <div className="mt-6">
        <ProductForm
          action={updateProduct}
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            pricePerYard: product.pricePerYard,
            pricePerMeter: product.pricePerMeter,
            currency: product.currency,
            type: product.type,
            colors: product.colors,
            description: product.description,
            images: product.images,
            inStock: product.inStock,
            shippingProfile: product.shippingProfile,
          }}
        />
      </div>
    </div>
  );
}
