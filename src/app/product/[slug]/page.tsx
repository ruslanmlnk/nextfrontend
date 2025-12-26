import ProductPage from "@/components/ProductPage";
import { fetchProductBySlugServer, fetchProductsServer } from "@/graphql/server/products";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: { slug: string } | Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await Promise.resolve(params);
  const product = await fetchProductBySlugServer(slug);
  console.log("Generating metadata for product:", product);

  return {
    title: product?.meta?.metaTitle || "Product Details",
    description: product?.meta?.metaDescription || "Get in touch with us",
  };
}

export default async function ProductBySlug({ params }: ProductPageProps) {
  const { slug } = await Promise.resolve(params);

  if (!slug) {
    return notFound();
  }
  const product = await fetchProductBySlugServer(slug);
  const products = await fetchProductsServer('hit');

  if (!product) {
    return notFound();
  }

  return <ProductPage product={product} products={products}/>;
}
