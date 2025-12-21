'use client';

import Link from 'next/link';
import React from 'react';
import { Star, Heart } from 'lucide-react';
import { Product } from '../types';
import { getImageUrl } from '../api';
import { useWishlist } from './WishlistContext';
import UiImage from './UiImage';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'wishlist';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'default' }) => {
  const { isInWishlist, toggleWishlist, removeFromWishlist } = useWishlist();

  const isLiked = isInWishlist(product.id);
  const productHref = product.slug ? `/product/${product.slug}` : `/product/${product.id}`;

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, product);
  };

  const handleRemoveFromWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWishlist(product.id);
  };

  const productTitle = product.model ? `${product.name} ${product.model}` : product.name;

  return (
    <Link
      href={productHref}
      className="bg-white border border-gray-100 rounded-sm relative group/card hover:shadow-lg transition-all duration-300 flex flex-col items-center w-full max-w-[303px] cursor-pointer"
    >
      {/* Discount Badge - Ribbon Style */}
      {variant === 'default' && product.discount && product.discount > 0 && (
        <div className="absolute top-4 left-[-8px] z-10">
          <div className="bg-amber-400 text-white text-lg font-bold px-3 py-1 shadow-sm relative">
            -{product.discount}%
          </div>
          <div className="absolute top-full left-0 w-0 h-0 border-t-[8px] border-t-amber-600 border-l-[8px] border-l-transparent" />
        </div>
      )}

      {/* Heart Icon (Top Right) - Only for default variant */}
      {variant === 'default' && (
        <button
          onClick={handleHeartClick}
          className="absolute top-4 right-4 z-20 text-gray-400 hover:text-amber-500 transition-colors"
        >
          <Heart size={24} className={isLiked ? 'fill-amber-500 text-amber-500' : ''} />
        </button>
      )}

      {/* Image Area */}
      <div className="w-full h-[303px] flex items-center justify-center p-6 overflow-hidden">
        <UiImage
          src={getImageUrl(product.image)}
          alt={productTitle}
          className="max-w-full max-h-full object-contain group-hover/card:scale-105 transition-transform duration-300"
          width={500}
          height={500}
          sizes="(min-width: 1024px) 300px, 50vw"
        />
      </div>

      {/* Wishlist Remove Bar (Only for wishlist variant) */}
      {variant === 'wishlist' && (
        <div
          onClick={handleRemoveFromWishlist}
          className="w-full bg-[#282828] text-white flex items-center justify-center gap-2 py-3 hover:bg-black transition-colors cursor-pointer"
        >
          <Heart size={16} className="fill-white" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            ПРИБРАТИ З ВИБРАНОГО
          </span>
        </div>
      )}

      {/* Content Area */}
      <div className="flex flex-col items-center w-full px-4 pb-6 text-center pt-4">
        <h3 className="text-xs md:text-sm font-bold text-gray-900 uppercase leading-snug mb-2 min-h-[40px] flex items-center">
          {productTitle}
        </h3>

        <div className="flex gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className={
                i < (product.rating || 0)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-200 fill-gray-200'
              }
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-amber-500 font-bold text-lg">
            {product.price.toLocaleString('uk-UA')} ₴
          </span>
          {product.oldPrice && (
            <span className="text-gray-400 text-sm line-through">
              {product.oldPrice.toLocaleString('uk-UA')} ₴
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
