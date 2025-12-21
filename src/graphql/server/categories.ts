import { Category } from '@/types'
import { graphqlClient } from '../client'
import { getImageUrl } from '@/api'
import { PayloadCategory } from '../types'
import { CATEGORIES } from '@/constants'
import { GET_CATEGORIES } from '../queries/categories'

const USE_MOCK = false
const CACHE_TTL = 60_000 // 1 minute
let cachedCategories: Category[] | null = null
let cacheExpiresAt = 0
let categoriesPromise: Promise<Category[]> | null = null

type CategoriesQuery = {
  Categories?: {
    docs?: PayloadCategory[] | null
  } | null
}

const normalize = (item: PayloadCategory): Category | null => {
  if (!item) return null
  return {
    id: item.id ?? item.slug ?? item.title ?? '',
    title: item.title ?? '',
    slug: item.slug ?? '',
    image: getImageUrl(item.image) || '',
  }
}

export const fetchCategoriesServer = async (): Promise<Category[]> => {
  const now = Date.now()

  if (cachedCategories && now < cacheExpiresAt) {
    return cachedCategories
  }
  if (categoriesPromise) {
    return categoriesPromise
  }

  if (USE_MOCK) {
    cachedCategories = CATEGORIES.map((c) => ({
      ...c,
      image: getImageUrl(c.image) || '',
    }))
    cacheExpiresAt = Date.now() + CACHE_TTL
    return cachedCategories
  }

  categoriesPromise = (async () => {
    try {
      const data = await graphqlClient.request<CategoriesQuery>(GET_CATEGORIES, { limit: 100 })
      const raw = data.Categories?.docs ?? []
      const normalized = (raw || [])
        .map(normalize)
        .filter((c: Category | null): c is Category => Boolean(c))

      cachedCategories = normalized
      cacheExpiresAt = Date.now() + CACHE_TTL
      return normalized
    } catch (error) {
      console.warn('Payload categories fetch failed (SSR). Using fallback.', error)
      const fallback = CATEGORIES.map((c) => ({
        ...c,
        image: getImageUrl(c.image) || '',
      }))
      cachedCategories = fallback
      cacheExpiresAt = Date.now() + 30_000
      return fallback
    } finally {
      categoriesPromise = null
    }
  })()

  return categoriesPromise
}
