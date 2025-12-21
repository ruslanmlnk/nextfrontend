'use client';

import React from 'react';
import { CartProvider } from './CartContext';
import { NavigationProvider } from './NavigationContext';
import { WishlistProvider } from './WishlistContext';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NavigationProvider>
      <CartProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </CartProvider>
    </NavigationProvider>
  );
};

export default Providers;
