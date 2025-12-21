'use client';

import React, { useEffect, useState } from 'react';
import Hero from './Hero';
import CategoryGrid from './CategoryGrid';
import ProductSection from './ProductSection';
import PromoSection from './PromoSection';
import Features from './Features';
import { api } from '../api';
import { Product, Category } from '../types';

interface HomePageProps {
  initialHits?: Product[];
  initialNew?: Product[];
  initialCategories?: Category[];
}

const HomePage: React.FC<HomePageProps> = ({ initialHits, initialNew, initialCategories }) => {
  const [hitProducts, setHitProducts] = useState<Product[]>(initialHits || []);
  const [newProducts, setNewProducts] = useState<Product[]>(initialNew || []);
  
  useEffect(() => {
    if (initialHits && initialHits.length > 0 && initialNew && initialNew.length > 0) return;

    const loadData = async () => {
      const hits = await api.getProducts('hit');
      setHitProducts(hits.slice(0, 9));

      const newArrivals = await api.getProducts('new');
      setNewProducts(newArrivals);
    };

    loadData();
  }, [initialHits, initialNew]);

  return (
    <>
      <Hero />
      <CategoryGrid initialCategories={initialCategories} /> 
      {hitProducts.length > 0 && (
      <ProductSection 
        title="Хіти продажів" 
        subtitle="Топ із нашого каталогу" 
        products={hitProducts} 
        showButton 
        viewMode="grid"
      />
      )}
      <PromoSection />
      {/* {newProducts.length > 0 && (
      <ProductSection 
        title="Нові надходження товарів" 
        subtitle="Свіже надходження" 
        products={newProducts} 
        withArrows 
        viewMode="slider"
      />
      )} */}
      <Features />
    </>
  );
};

export default HomePage;
