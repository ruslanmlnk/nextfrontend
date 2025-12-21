'use client';

import { useEffect, useState } from 'react';
import { api } from '../api';
import { Category } from '../types';

let cachedCategories: Category[] | null = null;
let categoriesPromise: Promise<Category[]> | null = null;

const seedCache = (initial?: Category[]) => {
  if (initial && initial.length > 0 && (!cachedCategories || cachedCategories.length === 0)) {
    cachedCategories = initial;
  }
};

const fetchCategories = async (): Promise<Category[]> => {
  if (cachedCategories && cachedCategories.length > 0) return cachedCategories;

  if (!categoriesPromise) {
    categoriesPromise = api.getCategories().then((data) => {
      if (data.length > 0) {
        cachedCategories = data;
      } else {
        cachedCategories = null;
      }
      return data;
    }).finally(() => {
      categoriesPromise = null;
    });
  }

  return categoriesPromise;
};

export const useCategories = (initial?: Category[]) => {
  seedCache(initial);
  const [categories, setCategories] = useState<Category[]>(initial || cachedCategories || []);
  const [loading, setLoading] = useState(() => {
    if (initial && initial.length > 0) return false;
    return !cachedCategories || cachedCategories.length === 0;
  });

  useEffect(() => {
    seedCache(initial);
    let isActive = true;

    if ((!cachedCategories || cachedCategories.length === 0) && (!initial || initial.length === 0)) {
      setLoading(true);
      fetchCategories()
        .then((data) => {
          if (isActive) setCategories(data);
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

  return { categories, loading };
};

