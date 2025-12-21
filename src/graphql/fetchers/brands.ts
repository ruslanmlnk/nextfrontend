'use client'

import { Brand } from '@/types'
import { graphqlClient } from '../client'
import { GET_BRANDS } from '../queries/brands'
import type { PayloadBrand } from '../types'

const USE_MOCK = false
let cachedBrands: Brand[] | null = null
let brandsPromise: Promise<Brand[]> | null = null

type BrandsQuery = {
  Brands?: {
    docs?: PayloadBrand[] | null
  } | null
}

const normalizeBrand = (item: PayloadBrand): Brand | null => {
  if (!item) return null
  return {
    id: item.id ?? item.slug ?? item.title ?? '',
    title: item.title ?? '',
    slug: item.slug ?? '',
  }
}

export const fetchBrands = async (): Promise<Brand[]> => {
  if (cachedBrands && cachedBrands.length > 0) return cachedBrands
  if (brandsPromise) return brandsPromise

  if (USE_MOCK) {
    cachedBrands = []
    return cachedBrands
  }

  brandsPromise = (async () => {
    try {
      const data = await graphqlClient.request<BrandsQuery>(GET_BRANDS, { limit: 500 })
      const raw = data.Brands?.docs ?? []
      const normalized = (raw || [])
        .map(normalizeBrand)
        .filter((b: Brand | null): b is Brand => Boolean(b))

      cachedBrands = normalized
      return normalized
    } catch (error) {
      console.warn('Payload brands fetch failed', error)
      cachedBrands = []
      return []
    } finally {
      brandsPromise = null
    }
  })()

  return brandsPromise
}

