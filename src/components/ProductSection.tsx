'use client';

import React, { useRef } from 'react';
import SectionHeader from './SectionHeader';
import ProductCard from './ProductCard';
import { Product } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigation } from './NavigationContext';

interface ProductSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  showButton?: boolean;
  withArrows?: boolean;
  viewMode?: 'slider' | 'grid';
}

const ProductSection: React.FC<ProductSectionProps> = ({ 
  title, 
  subtitle, 
  products, 
  showButton = false,
  withArrows = false,
  viewMode = 'slider'
}) => {
  const { navigateTo } = useNavigation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 330; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="w-full max-w-[1352px] mx-auto px-4 py-10 relative">
      <SectionHeader subtitle={subtitle} title={title} />
      
      {viewMode === 'slider' ? (
        <>
          {withArrows && (
            <>
                <button 
                    onClick={() => scroll('left')}
                    className="absolute left-0 md:left-2 top-1/2 -translate-y-1/2 bg-white border border-gray-200 w-[52px] h-[52px] flex items-center justify-center rounded-full shadow-sm text-[#282828] hover:text-amber-500 hover:border-amber-500 transition-colors z-10 hidden md:flex"
                >
                    <ChevronLeft size={28} strokeWidth={1.5} />
                </button>
                <button 
                    onClick={() => scroll('right')}
                    className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 bg-white border border-gray-200 w-[52px] h-[52px] flex items-center justify-center rounded-full shadow-sm text-[#282828] hover:text-amber-500 hover:border-amber-500 transition-colors z-10 hidden md:flex"
                >
                    <ChevronRight size={28} strokeWidth={1.5} />
                </button>
            </>
          )}

          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth hide-scrollbar px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, idx) => (
              <div key={`${product.id}-${idx}`} className="flex-shrink-0">
                 <ProductCard product={product} />
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {products.map((product, idx) => (
               <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
        </div>
      )}

      {showButton && (
        <div className="text-center mt-12">
          <button 
            onClick={() => navigateTo('catalog')}
            className="bg-amber-400 text-white font-bold uppercase text-xs px-8 py-3 rounded-sm hover:bg-amber-500 transition-colors shadow-md hover:shadow-lg"
          >
            Дивитися всі товари
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductSection;

