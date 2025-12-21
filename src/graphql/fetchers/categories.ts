'use client'

import { Category } from '@/types'
import { graphqlClient } from '../client'
import { GET_CATEGORIES } from '../queries/categories'
import type { PayloadCategory } from '../types'
import { getImageUrl } from '@/api'
import { CATEGORIES } from '@/constants'

const USE_MOCK = false
let cachedCategories: Category[] | null = null
let categoriesPromise: Promise<Category[]> | null = null

type CategoriesQuery = {
  Categories?: {
    docs?: PayloadCategory[] | null
  } | null
}

const normalizeCategory = (item: PayloadCategory): Category | null => {
  if (!item) return null
  return {
    id: item.id ?? item.slug ?? item.title ?? '',
    title: item.title ?? '',
    slug: item.slug ?? '',
    image: getImageUrl(item.image) || '',
  }
}

export const fetchCategories = async (): Promise<Category[]> => {
  if (cachedCategories && cachedCategories.length > 0) return cachedCategories
  if (categoriesPromise) return categoriesPromise

  if (USE_MOCK) {
    cachedCategories = CATEGORIES.map((c) => ({
      ...c,
      image: getImageUrl(c.image) || '',
    }))
    return cachedCategories
  }

  categoriesPromise = (async () => {
    try {
      const data = await graphqlClient.request<CategoriesQuery>(GET_CATEGORIES, { limit: 100 })
      const raw = data.Categories?.docs ?? []
      const normalized = (raw || [])
        .map(normalizeCategory)
        .filter((c: Category | null): c is Category => Boolean(c))

      cachedCategories = normalized
      return normalized
    } catch (error) {
      console.warn('Payload categories fetch failed', error)
      const fallback = CATEGORIES.map((c) => ({
        ...c,
        image: getImageUrl(c.image) || '',
      }))
      cachedCategories = fallback
      return fallback
    } finally {
      categoriesPromise = null
    }
  })()

  return categoriesPromise
}
