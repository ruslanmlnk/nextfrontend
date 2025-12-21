'use client';

import { useEffect, useState } from 'react';
import { api } from '../api';
import { Brand } from '../types';

let cachedBrands: Brand[] | null = null;
let brandsPromise: Promise<Brand[]> | null = null;

const seedCache = (initial?: Brand[]) => {
  if (initial && initial.length > 0 && (!cachedBrands || cachedBrands.length === 0)) {
    cachedBrands = initial;
  }
};

const fetchBrands = async (): Promise<Brand[]> => {
  if (cachedBrands && cachedBrands.length > 0) return cachedBrands;

  if (!brandsPromise) {
    brandsPromise = api.getBrands()
      .then((data) => {
        if (data.length > 0) {
          cachedBrands = data;
        } else {
          cachedBrands = null;
        }
        return data;
      })
      .finally(() => {
        brandsPromise = null;
      });
  }

  return brandsPromise;
};

export const useBrands = (initial?: Brand[]) => {
  seedCache(initial);
  const [brands, setBrands] = useState<Brand[]>(initial || cachedBrands || []);
  const [loading, setLoading] = useState(() => {
    if (initial && initial.length > 0) return false;
    return !cachedBrands || cachedBrands.length === 0;
  });

  useEffect(() => {
    seedCache(initial);
    let isActive = true;

    if ((!cachedBrands || cachedBrands.length === 0) && (!initial || initial.length === 0)) {
      setLoading(true);
      fetchBrands()
        .then((data) => {
          if (isActive) setBrands(data);
        })
        .catch(() => {})
        .finally(() => {
          if (isActive) setLoading(false);
        });
    }

    return () => {
      isActive = false;
    };
  }, [initial]);

  return { brands, loading };
};

