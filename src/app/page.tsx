import HomePage from '@/components/HomePage';
import { fetchCategoriesServer } from '@/graphql/server/categories';
import { fetchProductsServer } from '@/graphql/server/products';

export default async function Home() {
  const [categories, hits, news] = await Promise.all([
    fetchCategoriesServer(),
    fetchProductsServer('hit'),
    fetchProductsServer('new'),
  ]);

  return (
    <HomePage
      initialCategories={categories}
      initialHits={hits.slice(0, 9)}
      initialNew={news}
    />
  );
}
