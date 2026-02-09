import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import ProductDetailClient from "@/app/product/[slug]/ProductDetailClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: "Product not found" };
  }
  const description =
    product.description.length > 160
      ? `${product.description.slice(0, 157)}...`
      : product.description;
  return {
    title: `${product.name} | Harvey's`,
    description,
    openGraph: {
      title: `${product.name} | Harvey's`,
      description,
      type: "article",
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container pb-20">
      <ProductDetailClient product={product} />
    </div>
  );
}
