'use client'

import { Category } from '@/types'
import { graphqlClient } from '../client'
import { GET_CATEGORIES } from '../queries/categories'
import type { PayloadCategory } from '../types'
import { getImageUrl } from '@/api'
import { CATEGORIES } from '@/constants'
import { sortCategoriesByOrder } from '@/utils/categories'

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
    order: typeof item.order === 'number' ? item.order : 0,
  }
}

export const fetchCategories = async (): Promise<Category[]> => {
  if (cachedCategories && cachedCategories.length > 0) return cachedCategories
  if (categoriesPromise) return categoriesPromise

  if (USE_MOCK) {
    cachedCategories = sortCategoriesByOrder(
      CATEGORIES.map((c) => ({
        ...c,
        image: getImageUrl(c.image) || '',
      })),
    )
    return cachedCategories
  }

  categoriesPromise = (async () => {
    try {
      const data = await graphqlClient.request<CategoriesQuery>(GET_CATEGORIES, { limit: 100 })
      const raw = data.Categories?.docs ?? []
      const normalized = (raw || [])
        .map(normalizeCategory)
        .filter((c: Category | null): c is Category => Boolean(c))

      const ordered = sortCategoriesByOrder(normalized)
      cachedCategories = ordered
      return ordered
    } catch (error) {
      console.warn('Payload categories fetch failed', error)
      const fallback = sortCategoriesByOrder(
        CATEGORIES.map((c) => ({
          ...c,
          image: getImageUrl(c.image) || '',
          order: typeof c.order === 'number' ? c.order : 0,
        })),
      )
      cachedCategories = fallback
      return fallback
    } finally {
      categoriesPromise = null
    }
  })()

  return categoriesPromise
}
