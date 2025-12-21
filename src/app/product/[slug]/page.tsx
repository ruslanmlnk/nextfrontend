import ProductPage from "@/components/ProductPage";
import { fetchProductBySlugServer } from "@/graphql/server/products";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: { slug: string } | Promise<{ slug: string }>;
}

export default async function ProductBySlug({ params }: ProductPageProps) {
  const { slug } = await Promise.resolve(params);

  if (!slug) {
    return notFound();
  }
  const product = await fetchProductBySlugServer(slug);

  if (!product) {
    return notFound();
  }

  return <ProductPage product={product} />;
}
