import CatalogPage from '@/components/CatalogPage';
import { fetchCategoriesServer } from '@/graphql/server/categories';
import { fetchProductsServer } from '@/graphql/server/products';

interface CatalogProps {
  searchParams?: Promise<{
    category?: string;
    search?: string;
    q?: string;
  }>;
}

export default async function Catalog({ searchParams }: CatalogProps) {
  const params = searchParams ? await searchParams : undefined;
  const categorySlug = params?.category || undefined;
  const searchQuery = params?.search || params?.q || undefined;

  const [categories, products] = await Promise.all([
    fetchCategoriesServer(),
    // С'С?Р?Р?РчР?Р? Р?С?С- С'Р?Р?Р°С?Рё, С"С-Р>С?С'С?С?С"Р?Р? Р?Р° РєР>С-С"Р?С'С-, С%Р?Р+ Р·Р+РчС?РчР?С'Рё РєР?С?РчРєС'Р?С- Р>С-С╪РёР>С?Р?РёРєРё
    fetchProductsServer('all'),
  ]);

  return (
    <CatalogPage
      categorySlug={categorySlug}
      searchQuery={searchQuery}
      initialProducts={products}
      initialCategories={categories}
    />
  );
}
