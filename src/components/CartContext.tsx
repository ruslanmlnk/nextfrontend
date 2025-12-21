'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, delta: number) => void;
  totalAmount: number;
  totalCount: number;
}

const STORAGE_KEY = 'ostriv_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeStock = (value: unknown): number | undefined => {
  const stock = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(stock)) return undefined;
  return Math.max(0, stock);
};

const stripModelFromName = (name: string, model: string) => {
  const trimmedName = (name ?? '').trim();
  const trimmedModel = (model ?? '').trim();

  if (!trimmedName || !trimmedModel) return trimmedName;

  const pattern = new RegExp(`\\s*(?:[-–—|:]\\s*)?${escapeRegExp(trimmedModel)}\\s*$`, 'i');
  const stripped = trimmedName.replace(pattern, '').trim();
  return stripped || trimmedName;
};

const buildCartKey = (id: string | number, colorSlug?: string, colorTitle?: string) => {
  const colorKey = (colorSlug || colorTitle || 'default').trim().toLowerCase() || 'default';
  return `${id}::${colorKey}`;
};

const normalizeCartItem = (item: CartItem): CartItem => {
  const quantity = Math.max(1, Number(item.quantity) || 1);
  const stock = normalizeStock(item.stock);
  const clampedQuantity = typeof stock === 'number' ? Math.min(quantity, stock) : quantity;
  const colorSlug = item.colorSlug?.trim?.().toLowerCase?.();
  const colorTitle = item.colorTitle?.trim?.();
  const cartKey = item.cartKey?.trim?.() || buildCartKey(item.id, colorSlug, colorTitle);

  return {
    ...item,
    stock,
    quantity: clampedQuantity,
    name: stripModelFromName(item.name, item.model),
    model: item.model?.trim?.() ?? String(item.model ?? ''),
    colorSlug: colorSlug || undefined,
    colorTitle: colorTitle || undefined,
    colorHex: item.colorHex?.trim?.() || undefined,
    cartKey,
  };
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(Array.isArray(parsed) ? parsed.map(normalizeCartItem).filter((item) => item.quantity > 0) : []);
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    const normalizedNewItem = normalizeCartItem(newItem);
    setItems(prev => {
      if (typeof normalizedNewItem.stock === 'number' && normalizedNewItem.stock <= 0) {
        return prev;
      }

      const existing = prev.find(
        item =>
          item.cartKey === normalizedNewItem.cartKey ||
          (item.id === normalizedNewItem.id &&
            (item.colorSlug || '') === (normalizedNewItem.colorSlug || '') &&
            (item.colorTitle || '') === (normalizedNewItem.colorTitle || ''))
      );
      if (existing) {
        const mergedStock = typeof normalizedNewItem.stock === 'number' ? normalizedNewItem.stock : existing.stock;
        const maxStock = typeof mergedStock === 'number' ? mergedStock : undefined;
        const requestedQuantity = existing.quantity + normalizedNewItem.quantity;
        const nextQuantity = typeof maxStock === 'number' ? Math.min(requestedQuantity, maxStock) : requestedQuantity;
        if (typeof maxStock === 'number' && nextQuantity <= 0) {
          return prev.filter((item) => item.id !== normalizedNewItem.id);
        }

        return prev.map(item => 
          item.id === normalizedNewItem.id 
            ? { ...item, ...normalizedNewItem, stock: mergedStock, quantity: nextQuantity }
            : item
        );
      }

      if (typeof normalizedNewItem.stock === 'number' && normalizedNewItem.quantity <= 0) {
        return prev;
      }

      return [...prev, normalizedNewItem].filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (id: number | string) => {
    setItems(prev => prev.filter(item => item.cartKey !== id && item.id !== id));
  };

  const updateQuantity = (id: number | string, delta: number) => {
    setItems(prev =>
      prev
        .map((item) => {
          const matches = item.cartKey ? item.cartKey === id : item.id === id;
          if (!matches) return item;

          const stock = normalizeStock(item.stock);
          const next = item.quantity + delta;

          const min = 1;
          let newQuantity = Math.max(min, next);
          if (typeof stock === 'number') {
            newQuantity = Math.min(stock, newQuantity);
          }

          return { ...item, stock, quantity: newQuantity };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, totalAmount, totalCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
