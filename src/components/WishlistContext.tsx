'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistItems: Product[];
  addToWishlist: (id: number | string, product?: Product) => void;
  removeFromWishlist: (id: number | string) => void;
  isInWishlist: (id: number | string) => boolean;
  toggleWishlist: (id: number | string, product?: Product) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const normalizeId = (id: number | string) => String(id);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ostriv_wishlist');
    const savedItems = localStorage.getItem('ostriv_wishlist_items');
    if (saved) {
      try {
        setWishlistIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
    if (savedItems) {
      try {
        setWishlistItems(JSON.parse(savedItems));
      } catch (e) {
        console.error("Failed to parse wishlist items", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ostriv_wishlist', JSON.stringify(wishlistIds));
    localStorage.setItem('ostriv_wishlist_items', JSON.stringify(wishlistItems));
  }, [wishlistIds, wishlistItems]);

  const upsertProduct = (product?: Product) => {
    if (!product) return;
    const norm = normalizeId(product.id);
    setWishlistItems((prev) => {
      const existing = prev.findIndex((p) => normalizeId(p.id) === norm);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = product;
        return next;
      }
      return [...prev, product];
    });
  };

  const addToWishlist = (id: number | string, product?: Product) => {
    const norm = normalizeId(id);
    setWishlistIds((prev) => (prev.includes(norm) ? prev : [...prev, norm]));
    upsertProduct(product);
  };

  const removeFromWishlist = (id: number | string) => {
    const norm = normalizeId(id);
    setWishlistIds((prev) => prev.filter((itemId) => itemId !== norm));
    setWishlistItems((prev) => prev.filter((item) => normalizeId(item.id) !== norm));
  };

  const toggleWishlist = (id: number | string, product?: Product) => {
    const norm = normalizeId(id);
    setWishlistIds((prev) =>
      prev.includes(norm) ? prev.filter((itemId) => itemId !== norm) : [...prev, norm]
    );
    if (!product) {
      if (!wishlistIds.includes(norm)) return;
      setWishlistItems((prev) => prev.filter((item) => normalizeId(item.id) !== norm));
    } else {
      upsertProduct(product);
    }
  };

  const isInWishlist = (id: number | string) => wishlistIds.includes(normalizeId(id));

  return (
    <WishlistContext.Provider value={{ 
      wishlistIds, 
      wishlistItems,
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist, 
      toggleWishlist,
      count: wishlistIds.length 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

