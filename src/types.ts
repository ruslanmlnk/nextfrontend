import React from 'react';

export interface Media {
  id: string | number;
  url: string;
  alt?: string;
}

export interface Product {
  id: number | string; // Payload IDs are usually strings
  slug?: string;
  name: string;
  model?: string;
  brand?: string;
  category: string; // Or Category object if populated
  price: number;
  stock?: number;
  oldPrice?: number;
  image: string | Media; // Can be URL string or Payload Media object
  gallery?: string[];
  rating: number;
  isNew?: boolean;
  isHit?: boolean;
  discount?: number;
  description?: string;
  colors?: Color[];
}

export interface Category {
  id: number | string;
  title: string;
  image: string | Media;
  slug: string;
}

export interface Brand {
  id: number | string;
  title: string;
  slug: string;
}

export interface Color {
  id: number | string;
  title: string;
  slug: string;
  hex?: string;
}

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface CartItem {
  id: number | string;
  name: string;
  model: string;
  price: number;
  quantity: number;
  image: string;
  stock?: number;
  cartKey?: string;
  colorTitle?: string;
  colorSlug?: string;
  colorHex?: string;
}

export interface OrderData {
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  delivery: {
    city: string;
    warehouse: string;
    method: string;
  };
  paymentMethod: string;
  items: {
    product_id: string | number;
    quantity: number;
    colorTitle?: string;
    colorSlug?: string;
    colorHex?: string;
  }[];
  total: number;
}


export interface NPCity {
  Ref: string;
  Present: string; 
  MainDescription: string; 
  Area: string;
  Region: string;
  SettlementId?: number;
  CityRef?: string;
  DeliveryCity?: string;
}

export interface NPWarehouse {
  Ref: string;
  Description: string;
  Number: string;
  Name?: string;
  Address?: string;
  DivisionCategory?: string;
}
