'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { ReactNode } from 'react';

export type Page =
  | 'home'
  | 'catalog'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'about'
  | 'delivery'
  | 'wishlist'
  | 'contact';

const pageToPath: Record<Page, string> = {
  home: '/',
  catalog: '/catalog',
  product: '/product',
  cart: '/cart',
  checkout: '/checkout',
  about: '/about',
  delivery: '/delivery',
  wishlist: '/wishlist',
  contact: '/contact',
};

const pathToPage = (pathname: string): Page => {
  if (pathname.startsWith('/catalog')) return 'catalog';
  if (pathname.startsWith('/product')) return 'product';
  if (pathname.startsWith('/cart')) return 'cart';
  if (pathname.startsWith('/checkout')) return 'checkout';
  if (pathname.startsWith('/about')) return 'about';
  if (pathname.startsWith('/delivery')) return 'delivery';
  if (pathname.startsWith('/wishlist')) return 'wishlist';
  if (pathname.startsWith('/contact')) return 'contact';
  return 'home';
};

// Stub provider to keep compatibility with previous API
export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;

export const useNavigation = () => {
  const router = useRouter();
  const pathname = usePathname() || '/';

  const navigateTo = (page: Page, slug?: string) => {
    const base = pageToPath[page] || '/';
    const target =
      page === 'catalog' && slug
        ? `${base}?category=${encodeURIComponent(slug)}`
        : slug
          ? `${base}/${slug}`
          : base;
    router.push(target);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    currentPage: pathToPage(pathname),
    navigateTo,
  };
};

