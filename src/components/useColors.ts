'use client';

import { useEffect, useState } from 'react';
import { api } from '../api';
import { Color } from '../types';

let cachedColors: Color[] | null = null;
let colorsPromise: Promise<Color[]> | null = null;

const seedCache = (initial?: Color[]) => {
  if (initial && initial.length > 0 && (!cachedColors || cachedColors.length === 0)) {
    cachedColors = initial;
  }
};

const fetchColors = async (): Promise<Color[]> => {
  if (cachedColors && cachedColors.length > 0) return cachedColors;

  if (!colorsPromise) {
    colorsPromise = api.getColors()
      .then((data) => {
        if (data.length > 0) {
          cachedColors = data;
        } else {
          cachedColors = null;
        }
        return data;
      })
      .finally(() => {
        colorsPromise = null;
      });
  }

  return colorsPromise;
};

export const useColors = (initial?: Color[]) => {
  seedCache(initial);
  const [colors, setColors] = useState<Color[]>(initial || cachedColors || []);
  const [loading, setLoading] = useState(() => {
    if (initial && initial.length > 0) return false;
    return !cachedColors || cachedColors.length === 0;
  });

  useEffect(() => {
    seedCache(initial);
    let isActive = true;

    if ((!cachedColors || cachedColors.length === 0) && (!initial || initial.length === 0)) {
      setLoading(true);
      fetchColors()
        .then((data) => {
          if (isActive) setColors(data);
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

  return { colors, loading };
};

