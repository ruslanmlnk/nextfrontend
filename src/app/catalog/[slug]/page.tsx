import { redirect } from "next/navigation";

interface CatalogBySlugProps {
  params: { slug: string };
}

export default function CatalogBySlug({ params }: CatalogBySlugProps) {
  const slug = params.slug;
  redirect(`/catalog?category=${encodeURIComponent(slug)}`);
}
