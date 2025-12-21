'use client';

import React from 'react';
import { House, ChevronRight, Heart } from 'lucide-react';
import { useNavigation } from './NavigationContext';
import { useWishlist } from './WishlistContext';
import ProductCard from './ProductCard';

const WishlistPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { wishlistIds, wishlistItems } = useWishlist();

  return (
    <div className="w-full max-w-[1352px] mx-auto px-4 py-6">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-amber-400 mb-8">
        <button onClick={() => navigateTo('home')}>
            <House size={16} className="fill-gray-400 text-gray-400 hover:text-amber-500 hover:fill-amber-500 transition-colors" />
        </button>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-amber-500 font-medium">Мої уподобання</span>
      </nav>

      <h1 className="text-3xl font-extrabold uppercase text-gray-900 mb-8 flex items-center gap-3">
          Мої уподобання
          <span className="text-gray-400 text-xl font-normal lowercase">({wishlistIds.length} товарів)</span>
      </h1>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {wishlistItems.map(product => (
                <ProductCard key={product.id} product={product} variant="wishlist" />
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 border border-gray-100 rounded-sm">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Heart size={40} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 uppercase mb-2">Список порожній</h2>
            <p className="text-gray-500 text-sm mb-8">Додайте товари в уподобання, натиснувши на сердечко.</p>
            <button 
                onClick={() => navigateTo('catalog')}
                className="bg-amber-400 hover:bg-amber-500 text-white font-bold uppercase text-xs px-8 py-4 rounded-sm shadow-md transition-colors"
            >
                До каталогу
            </button>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

