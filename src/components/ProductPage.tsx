'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { House, ChevronRight, Heart, Star, Minus, Plus, ShoppingBasket, Check, X } from 'lucide-react';
import SidebarCategories from './SidebarCategories';
import SidebarWidgets from './SidebarWidgets';
import ProductCard from './ProductCard';
import { useCart } from './CartContext';
import { useWishlist } from './WishlistContext';
import { useCategories } from './useCategories';
import { Product } from '../types';
import { api, getImageUrl } from '../api';

interface ProductPageProps {
  product: Product;
}

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColorSlug, setSelectedColorSlug] = useState<string | undefined>(() => {
    const first = Array.isArray(product.colors) && product.colors.length > 0 ? product.colors[0] : null;
    return first ? (first.slug || first.title || undefined) : undefined;
  });
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const currentProductId = product.id;
  const isLiked = isInWishlist(currentProductId);
  const productTitle = product.model ? `${product.name} ${product.model}` : product.name;
  const stockCount = typeof product.stock === 'number' ? product.stock : 0;
  const isInStock = stockCount > 0;
  const { categories } = useCategories();
  const categoryTitle = categories.find((c) => c.slug === product.category)?.title || product.category;

  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    const first = Array.isArray(product.colors) && product.colors.length > 0 ? product.colors[0] : null;
    setSelectedColorSlug(first ? (first.slug || first.title || undefined) : undefined);
  }, [product.id]);

  useEffect(() => {
    const loadRelated = async () => {
      const products = await api.getProducts('all', product.category);
      const filtered = products.filter((p) => p.id !== product.id);
      setRelatedProducts(filtered.slice(0, 4));
    };

    loadRelated();
  }, [product.category, product.id]);

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    if (!isInStock) return;
    setQuantity((prev) => (prev < stockCount ? prev + 1 : prev));
  };

  const getSelectedColor = () => {
    if (!Array.isArray(product.colors)) return undefined;
    return product.colors.find(
      (c) => (c.slug || c.title) && (c.slug === selectedColorSlug || c.title === selectedColorSlug),
    );
  };

  const handleAddToCart = () => {
    if (!isInStock) return;
    const safeQuantity = Math.max(1, Math.min(quantity, stockCount));
    const color = getSelectedColor();
    addToCart({
      id: currentProductId,
      name: product.name,
      model: product.model ?? product.slug ?? String(product.id),
      price: product.price,
      quantity: safeQuantity,
      image: getImageUrl(product.image),
      stock: stockCount,
      colorTitle: color?.title,
      colorSlug: color?.slug || color?.title,
      colorHex: typeof color?.hex === 'string' ? color.hex : undefined,
    });
  };

  const baseImage =
    getImageUrl(product.image) ||
    'https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png';

  const galleryImages = [
    baseImage,
    ...((product.gallery ?? []).map((img) => getImageUrl(img))),
  ].filter((url, index, arr) => Boolean(url) && arr.indexOf(url) === index);

  const mainImage = galleryImages[activeImageIndex] || baseImage;

  return (
    <div className="w-full max-w-[1352px] mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-amber-400 mb-8">
        <Link href="/" aria-label="На головну">
          <House
            size={16}
            className="fill-gray-400 text-gray-400 hover:text-amber-500 hover:fill-amber-500 transition-colors"
          />
        </Link>
        <ChevronRight size={14} className="text-gray-300" />
        <Link href="/catalog" className="text-amber-500 font-medium hover:underline">
          Каталог
        </Link>
        {product.category && (
          <>
            <ChevronRight size={14} className="text-gray-300" />
            <Link
              href={`/catalog?category=${encodeURIComponent(product.category)}`}
              className="text-amber-500 font-medium hover:underline"
            >
              {categoryTitle || 'Категорія'}
            </Link>
          </>
        )}
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-amber-500 font-medium">{productTitle}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-[270px] flex-shrink-0 hidden lg:block">
          <SidebarCategories />
          <SidebarWidgets />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Product Details Section */}
          <div className="bg-white rounded-sm mb-12">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Images Column */}
              <div className="w-full md:w-1/2">
                <div className="border border-gray-100 p-8 flex items-center justify-center mb-4 h-[500px]">
                  <img
                    src={mainImage}
                    alt={productTitle}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-4">
                  {galleryImages.map((imageUrl, index) => (
                    <button
                      key={`${imageUrl}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`border p-2 h-24 flex items-center justify-center cursor-pointer transition-colors ${
                        index === activeImageIndex ? 'border-amber-400' : 'border-gray-200 hover:border-amber-400'
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`${productTitle} - ${index + 1}`}
                        className="max-h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Column */}
              <div className="w-full md:w-1/2 pt-2 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h1 className="text-xl md:text-2xl font-extrabold text-[#282828] uppercase leading-tight">
                    {productTitle}
                  </h1>
                  <button
                    onClick={() => toggleWishlist(currentProductId, product)}
                    className={`w-10 h-10 border flex items-center justify-center rounded-sm transition-colors flex-shrink-0 ml-4 ${
                      isLiked
                        ? 'border-amber-400 text-amber-500'
                        : 'border-gray-200 text-gray-400 hover:text-amber-500 hover:border-amber-400'
                    }`}
                  >
                    <Heart size={20} className={isLiked ? 'fill-amber-500' : ''} />
                  </button>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < (product.rating || 0)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-200 fill-gray-200'
                      }
                    />
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-8">
                  <div className="text-4xl font-extrabold text-[#282828]">
                    {product.price.toLocaleString('uk-UA')} ₴
                  </div>
                  {product.oldPrice && (
                    <div className="text-gray-400 text-lg line-through">
                      {product.oldPrice.toLocaleString('uk-UA')} ₴
                    </div>
                  )}
                </div>

                {/* Meta Data */}
                <div className="space-y-3 mb-8 text-[13px]">
                  <div className="flex items-center">
                    <span className="text-[#8C8C8C] w-32">Бренд:</span>
                    <span className="text-[#282828]">{product.brand || '—'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[#8C8C8C] w-32">Код товару:</span>
                    <span className="text-[#282828]">
                      {product.model || product.slug || String(product.id)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[#8C8C8C] w-32">Доступність:</span>
                    <span className={`flex items-center gap-2 ${isInStock ? 'text-[#282828]' : 'text-gray-400'}`}>
                      {isInStock ? (
                        <Check size={16} strokeWidth={3} className="text-green-500" />
                      ) : (
                        <X size={16} strokeWidth={3} className="text-red-400" />
                      )}
                      {isInStock ? 'В наявності' : 'Немає в наявності'}
                    </span>
                  </div>
                </div>

                {/* Color */}
                <div className="mb-8">
                  <span className="text-[13px] font-bold uppercase text-[#282828] block mb-3">
                    ВИБЕРІТЬ КОЛІР
                  </span>
                <div className="flex flex-wrap items-center gap-2">
                  {product.colors && product.colors.length > 0 ? (
                    product.colors.map((color) => {
                      const rawHex = typeof color.hex === 'string' ? color.hex.trim() : '';
                      const hex = /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(rawHex) ? rawHex : '#E0E0E0';
                      const isActive = selectedColorSlug === (color.slug || color.title);
                      return (
                        <button
                          key={String(color.id ?? color.slug ?? color.title)}
                          type="button"
                          title={color.title}
                          aria-label={color.title}
                          onClick={() => setSelectedColorSlug(color.slug || color.title)}
                          className={`w-8 h-8 rounded-full border outline-none transition-colors ${
                            isActive
                              ? 'border-amber-500 ring-2 ring-amber-200'
                              : 'border-gray-200 hover:border-amber-400 focus:border-amber-400'
                          }`}
                          style={{ backgroundColor: hex }}
                        />
                      );
                    })
                  ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-8">
                  <span className="text-[13px] font-bold uppercase text-[#282828] block mb-3">
                    КІЛЬКІСТЬ
                  </span>
                <div className="bg-[#F0F0F0] rounded-[3px] p-[3px] flex items-center w-fit gap-[3px]">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={!isInStock || quantity <= 1}
                    className="w-[45px] h-[45px] flex items-center justify-center text-[#8C8C8C] hover:text-[#282828] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-[#8C8C8C]"
                    aria-label="Зменшити кількість"
                  >
                    <Minus size={16} />
                  </button>

                    <div className="w-[60px] h-[45px] bg-white flex items-center justify-center">
                      <input
                        type="text"
                        value={quantity}
                        readOnly
                        className="w-full text-center text-[15px] font-bold text-[#282828] bg-transparent focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleIncrease}
                      disabled={!isInStock || quantity >= stockCount}
                      className="w-[45px] h-[45px] flex items-center justify-center text-[#8C8C8C] hover:text-[#282828] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-[#8C8C8C]"
                      aria-label="Збільшити кількість"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Buy Button */}
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!isInStock}
                    className="bg-amber-400 hover:bg-amber-500 text-white font-bold uppercase text-[13px] px-10 py-4 rounded-sm transition-colors shadow-md hover:shadow-lg tracking-wider flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-400 disabled:hover:shadow-md"
                  >
                    <ShoppingBasket size={18} />
                    КУПИТИ
                  </button>
                </div>
              </div>
            </div>

            {/* Description Tab */}
            <div className="mt-16">
              <div className="flex gap-8 border-b border-gray-200 mb-8">
                <button className="text-amber-500 font-bold uppercase text-[13px] border-b-2 border-amber-500 pb-3 -mb-[1px]">
                  Опис
                </button>
              </div>

              {product.description && (
                <>
                  <h3 className="font-bold text-[#282828] text-[15px] mb-4">Опис товару</h3>
                  <div className="text-[#777] text-[14px] leading-relaxed space-y-6 mb-10">
                    <p>{product.description}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div className="mb-12 border-t border-gray-200 pt-10">
            <h3 className="text-[18px] font-bold uppercase text-[#282828] mb-8">
              Тематичні товари
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
