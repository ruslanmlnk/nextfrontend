import { Product, Category, OrderData, Media, Brand, Color } from './types';
import { HIT_PRODUCTS, NEW_PRODUCTS, CATALOG_PRODUCTS } from './constants';
import { PAYLOAD_URL } from './graphql/client';
import { fetchCategories } from './graphql/fetchers/categories';
import { fetchBrands } from './graphql/fetchers/brands';
import { fetchColors } from './graphql/fetchers/colors';
import { fetchProducts } from './graphql/fetchers/products';
import { createOrderRequest } from './graphql/fetchers/order';
import { PayloadMedia } from './graphql/types';

export const getImageUrl = (image: PayloadMedia | PayloadMedia[] | Media | string | null | undefined): string => {
  if (!image) return '';

  const pick = Array.isArray(image) ? image[0] : image;

  if (typeof pick === 'string') {
    return pick.startsWith('http') ? pick : `${PAYLOAD_URL}${pick}`;
  }
  if ('url' in pick && typeof pick.url === 'string' && pick.url) {
    return pick.url.startsWith('http') ? pick.url : `${PAYLOAD_URL}${pick.url}`;
  }
  if ('sizes' in pick && pick.sizes) {
    const firstSized = Object.values(pick.sizes).find((s) => s?.url);
    if (firstSized?.url) {
      return firstSized.url.startsWith('http') ? firstSized.url : `${PAYLOAD_URL}${firstSized.url}`;
    }
  }
  return '';
};

// --- API ---
export const api = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const categories = await fetchCategories();
      return categories;
    } catch (error) {
      console.warn('Payload Connection Failed (Categories).', error);
      return [];
    }
  },

  getBrands: async (): Promise<Brand[]> => {
    try {
      const brands = await fetchBrands();
      return brands;
    } catch (error) {
      console.warn('Payload Connection Failed (Brands).', error);
      return [];
    }
  },

  getColors: async (): Promise<Color[]> => {
    try {
      const colors = await fetchColors();
      return colors;
    } catch (error) {
      console.warn('Payload Connection Failed (Colors).', error);
      return [];
    }
  },

  getProducts: async (type: 'all' | 'hit' | 'new' = 'all', categorySlug?: string): Promise<Product[]> => {
    try {
      let products = await fetchProducts(type, categorySlug);

      if (products.length === 0 && type !== 'all') {
        const allProducts = await fetchProducts('all', categorySlug);
        products = type === 'hit'
          ? allProducts.filter((p) => p.isHit)
          : allProducts.filter((p) => p.isNew);
      }

      if (categorySlug) {
        products = products.filter((p) => p.category === categorySlug);
      }

      if (products.length === 0) {
        throw new Error('No products from Payload');
      }

      return products;  
    } catch (error) {
      console.warn(`Payload Connection Failed (Products: ${type}). Using Mock Data.`, error);
      let fallback = type === 'new' ? NEW_PRODUCTS : type === 'hit' ? HIT_PRODUCTS : CATALOG_PRODUCTS;
      if (categorySlug) {
        fallback = fallback.filter((p) => p.category === categorySlug);
      }
      return fallback;
    }
  },

  createOrder: async (orderData: OrderData): Promise<{ success: boolean; id: string | number }> => {
    try {
      const response = await createOrderRequest(orderData);
      return response;
    } catch (error) {
      console.error('API Error (Create Order):', error);
      alert('Не вдалося створити замовлення у Payload. Спробуйте ще раз пізніше.');
      return { success: false, id: 'mock-order-id' };
    }
  }
};
