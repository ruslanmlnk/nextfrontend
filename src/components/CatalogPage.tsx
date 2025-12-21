'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SidebarFilters from './SidebarFilters';
import ProductCard from './ProductCard';
import { api } from '../api';
import { Product } from '../types';
import { House, ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigation } from './NavigationContext';
import { useCategories } from './useCategories';

const normalizeKey = (value?: string) => (value || '').trim().toLowerCase();
const getBrandKey = (value?: string) => normalizeKey(value);
const getColorKey = (slug?: string, title?: string) => normalizeKey(slug || title);

interface CatalogPageProps {
  categorySlug?: string;
  searchQuery?: string;
  initialProducts?: Product[];
  initialCategories?: any[];
}

const CatalogPage: React.FC<CatalogPageProps> = ({
  categorySlug,
  searchQuery,
  initialProducts,
  initialCategories,
}) => {
  const { navigateTo } = useNavigation();
  const router = useRouter();
  const pathname = usePathname();

  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts || initialProducts.length === 0);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(categorySlug);
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [searchTerm, setSearchTerm] = useState<string>(searchQuery || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const { categories } = useCategories(initialCategories);
  const activeSearchTerm = searchTerm.trim();

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setAllProducts(initialProducts);
      setLoading(false);
    }
  }, [initialProducts]);

  useEffect(() => {
    setSelectedCategory(categorySlug);
  }, [categorySlug]);

  useEffect(() => {
    setSearchTerm(searchQuery || '');
  }, [searchQuery]);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) return;
    const loadProducts = async () => {
      setLoading(true);
      const data = await api.getProducts('all');
      setAllProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, [initialProducts]);

  const brandSet = useMemo(() => new Set(selectedBrands), [selectedBrands]);
  const colorSet = useMemo(() => new Set(selectedColors), [selectedColors]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = activeSearchTerm.toLowerCase();
    let products = selectedCategory
      ? allProducts.filter((p) => p.category === selectedCategory)
      : allProducts;

    if (activeSearchTerm) {
      products = products.filter((p) => {
        const haystack = [p.name, p.model ?? '', p.brand ?? '', p.description ?? '']
          .join(' ')
          .toLowerCase();

        return haystack.includes(normalizedSearch);
      });
    }

    if (brandSet.size > 0) {
      products = products.filter((p) => {
        const key = getBrandKey(p.brand);
        return key && brandSet.has(key);
      });
    }

    if (colorSet.size > 0) {
      products = products.filter((p) => {
        if (!Array.isArray(p.colors)) return false;
        return p.colors.some((c) => colorSet.has(getColorKey(c.slug, c.title)));
      });
    }

    return products;
  }, [activeSearchTerm, allProducts, brandSet, colorSet, selectedCategory]);

  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];
    if (sort === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    }
    return items;
  }, [filteredProducts, sort]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [allProducts]);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach((p) => {
      const key = getBrandKey(p.brand);
      if (!key) return;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [allProducts]);

  const colorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach((p) => {
      if (!Array.isArray(p.colors)) return;
      p.colors.forEach((c) => {
        if (!c) return;
        const key = getColorKey(c.slug, c.title);
        if (!key) return;
        counts[key] = (counts[key] || 0) + 1;
      });
    });
    return counts;
  }, [allProducts]);

  const toggleBrand = (opt: { slug?: string; label: string }) => {
    const key = getBrandKey(opt.slug || opt.label);
    if (!key) return;
    setSelectedBrands((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const toggleColor = (opt: { slug?: string; label: string }) => {
    const key = getColorKey(opt.slug, opt.label);
    if (!key) return;
    setSelectedColors((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const handleSelectCategory = (slug?: string) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams();
    if (slug) params.set('category', slug);

    if (activeSearchTerm) {
      params.set('search', activeSearchTerm);
    }

    const query = params.toString();
    const nextPath = query ? `${pathname}?${query}` : pathname;
    router.replace(nextPath, { scroll: false });
  };

  const currentCategoryTitle = useMemo(() => {
    if (!selectedCategory) return 'Каталог';
    const found = categories.find((c) => c.slug === selectedCategory);
    return found?.title || 'Каталог';
  }, [categories, selectedCategory]);

  const emptyMessage = activeSearchTerm
    ? `Немає результатів за запитом "${activeSearchTerm}".`
    : 'Товарів не знайдено';

  return (
    <div className="w-full max-w-[1352px] mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-amber-400 mb-8">
        <button onClick={() => navigateTo('home')}>
          <House
            size={16}
            className="fill-gray-400 text-gray-400 hover:text-amber-500 hover:fill-amber-500 transition-colors"
          />
        </button>
        <ChevronRight size={14} className="text-gray-300" />
        <button onClick={() => navigateTo('catalog')} className="text-amber-500 font-medium hover:underline">
          Каталог
        </button>
        {selectedCategory && (
          <>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-amber-500 font-medium">{currentCategoryTitle}</span>
          </>
        )}
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-[270px] flex-shrink-0">
          <SidebarFilters
            selectedSlug={selectedCategory}
            categoryCounts={categoryCounts}
            brandCounts={brandCounts}
            colorCounts={colorCounts}
            selectedBrands={selectedBrands}
            selectedColors={selectedColors}
            onToggleBrand={toggleBrand}
            onToggleColor={toggleColor}
            onSelectCategory={handleSelectCategory}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header & Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentCategoryTitle}</h1>
              {activeSearchTerm && (
                <p className="text-sm text-gray-500 mt-1">Результати за запитом "{activeSearchTerm}"</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-800">Сортування:</span>
              <div className="relative inline-flex items-center border border-gray-200 rounded-sm bg-white px-3 py-1.5 min-w-[200px]">
                <select
                  className="appearance-none bg-transparent text-xs text-gray-700 focus:outline-none w-full pr-6 cursor-pointer"
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value as 'default' | 'price-asc' | 'price-desc')
                  }
                >
                  <option value="default">За замовчуванням</option>
                  <option value="price-asc">За ціною (зростання)</option>
                  <option value="price-desc">За ціною (спадання)</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {!loading && sortedProducts.length > 0 ? (
              sortedProducts.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="col-span-3 py-10 text-center text-gray-500">
                {loading ? 'Завантаження...' : emptyMessage}
              </div>
            )}
          </div>

          <div className="flex justify-center mt-12">
            {/* <button className="bg-amber-400 text-white font-bold uppercase text-xs px-8 py-3 rounded-sm hover:bg-amber-500 transition-colors shadow-md hover:shadow-lg">
              Показати ще
            </button> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CatalogPage;
