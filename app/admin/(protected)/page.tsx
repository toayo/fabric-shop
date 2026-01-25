import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getPrismaClient } from "@/lib/db";
import ProductMedia from "@/app/components/ProductMedia";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const prisma = await getPrismaClient();
  if (!prisma) {
    return null;
  }
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  async function toggleStock(formData: FormData) {
    "use server";
    const prisma = await getPrismaClient();
    if (!prisma) {
      return;
    }
    const id = String(formData.get("id"));
    const current = formData.get("current") === "true";
    await prisma.product.update({
      where: { id },
      data: { inStock: !current },
    });
    revalidatePath("/admin");
  }

  async function deleteProduct(formData: FormData) {
    "use server";
    const prisma = await getPrismaClient();
    if (!prisma) {
      return;
    }
    const id = String(formData.get("id"));
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products</h2>
        <Link className="btn-primary rounded-full px-4 py-2 text-sm font-semibold" href="/admin/products/new">
          Add product
        </Link>
      </div>
      <div className="grid gap-4">
        {products.length === 0 ? (
          <div className="rounded-3xl p-8 shadow-sm surface">
            <p className="text-sm text-[var(--muted)]">No products yet. Add your first one.</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-4 rounded-3xl p-6 shadow-sm surface card-hover md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-28 overflow-hidden rounded-2xl border border-theme">
                  <ProductMedia
                    image={product.images[0]}
                    color={product.colors[0] ?? "beige"}
                    label={product.name}
                    className="absolute inset-0"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold">{product.name}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {product.type} · {product.colors.join(", ")}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {product.inStock ? "In stock" : "Out of stock"} · {product.currency}{" "}
                    {product.pricePerYard} / yard
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="btn-secondary rounded-full px-4 py-2 text-xs font-semibold"
                >
                  Edit
                </Link>
                <form action={toggleStock}>
                  <input type="hidden" name="id" value={product.id} />
                  <input type="hidden" name="current" value={String(product.inStock)} />
                  <button className="btn-secondary rounded-full px-4 py-2 text-xs font-semibold">
                    {product.inStock ? "Mark out of stock" : "Mark in stock"}
                  </button>
                </form>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={product.id} />
                  <button className="rounded-full border border-red-400/50 px-4 py-2 text-xs font-semibold text-red-200">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
