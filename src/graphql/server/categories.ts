import { Category } from '@/types'
import { graphqlClient } from '../client'
import { getImageUrl } from '@/api'
import { PayloadCategory } from '../types'
import { CATEGORIES } from '@/constants'
import { GET_CATEGORIES } from '../queries/categories'
import { sortCategoriesByOrder } from '@/utils/categories'

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
    order: typeof item.order === 'number' ? item.order : 0,
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
    cachedCategories = sortCategoriesByOrder(
      CATEGORIES.map((c) => ({
        ...c,
        image: getImageUrl(c.image) || '',
      })),
    )
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

      const ordered = sortCategoriesByOrder(normalized)
      cachedCategories = ordered
      cacheExpiresAt = Date.now() + CACHE_TTL
      return ordered
    } catch (error) {
      console.warn('Payload categories fetch failed (SSR). Using fallback.', error)
      const fallback = sortCategoriesByOrder(
        CATEGORIES.map((c) => ({
          ...c,
          image: getImageUrl(c.image) || '',
          order: typeof c.order === 'number' ? c.order : 0,
        })),
      )
      cachedCategories = fallback
      cacheExpiresAt = Date.now() + 30_000
      return fallback
    } finally {
      categoriesPromise = null
    }
  })()

  return categoriesPromise
}
