'use client'

import { Product } from '@/types'
import { getImageUrl } from '@/api'
import { graphqlClient } from '../client'
import { PayloadBrand, PayloadCategory, PayloadColor, PayloadProduct } from '../types'
import { CATALOG_PRODUCTS, HIT_PRODUCTS, NEW_PRODUCTS } from '@/constants'
import { GET_PRODUCTS } from '../queries/products'

type ProductKey = 'all' | 'hit' | 'new'
const productCache: Record<string, Product[]> = {}
const productPromises: Record<string, Promise<Product[]> | undefined> = {}
const USE_MOCK = false

type ProductsQuery = {
  Products?: {
    docs?: PayloadProduct[] | null
  } | null
}

const normalizeProduct = (item: PayloadProduct): Product | null => {
  if (!item) return null

  const media = Array.isArray(item.image) ? item.image[0] : item.image
  const galleryUrls = Array.isArray(item.gallery)
    ? item.gallery
        .map((galleryItem) => {
          if (!galleryItem || typeof galleryItem === 'number') return ''
          return getImageUrl(galleryItem as any)
        })
        .filter((url) => Boolean(url))
    : []

  const brandField = item.brand
  const brandTitle =
    typeof brandField === 'object' && brandField !== null && 'title' in brandField
      ? (brandField as PayloadBrand).title ?? undefined
      : undefined

  const colors = Array.isArray(item.colors)
    ? item.colors
        .map((colorField) => {
          if (!colorField || typeof colorField === 'string' || typeof colorField === 'number') return null
          const color = colorField as PayloadColor
          const id = color.id ?? color.slug ?? color.title ?? ''
          const title = color.title ?? ''
          if (!id || !title) return null

          return {
            id,
            title,
            slug: color.slug ?? '',
            hex: color.hex ?? undefined,
          }
        })
        .filter((c): c is NonNullable<typeof c> => Boolean(c))
    : []
  const categoryField = item.category
  const categorySlug =
    typeof categoryField === 'string'
      ? categoryField
      : typeof categoryField === 'object' && categoryField !== null && 'slug' in categoryField
        ? (categoryField as PayloadCategory).slug ?? ''
        : ''

  const discount =
    typeof item.discount === 'number'
      ? item.discount
      : item.oldPrice && item.price
        ? Math.round((1 - item.price / item.oldPrice) * 100)
        : undefined

  return {
    id: item.id ?? item.slug ?? item.name ?? '',
    slug: item.slug ?? '',
    name: item.name ?? '',
    model: item.model ?? undefined,
    brand: brandTitle,
    category: categorySlug,
    price: item.price ?? 0,
    stock: item.stock ?? 0,
    oldPrice: item.oldPrice ?? undefined,
    rating: item.rating ?? 0,
    description: item.description ?? '',
    isHit: Boolean(item.isHit),
    isNew: Boolean(item.isNew),
    discount,
    image: getImageUrl(media) || '',
    gallery: galleryUrls,
    colors,
  }
}

const mockProducts = (type: ProductKey = 'all', categorySlug?: string): Product[] => {
  let base: Product[] =
    type === 'new'
      ? NEW_PRODUCTS
      : type === 'hit'
        ? HIT_PRODUCTS
        : [...CATALOG_PRODUCTS, ...HIT_PRODUCTS, ...NEW_PRODUCTS]

  if (categorySlug) {
    base = base.filter((p) => p.category === categorySlug)
  }

  return base.map((p) => ({
    ...p,
    slug: p.slug ?? `product-${p.id}`,
    image: getImageUrl(p.image) || '',
  }))
}

export const fetchProducts = async (type: ProductKey = 'all', categorySlug?: string): Promise<Product[]> => {
  const cacheKey = `${type}:${categorySlug ?? 'all'}`
  if (productCache[cacheKey]) return productCache[cacheKey]
  const existingPromise = productPromises[cacheKey]
  if (existingPromise) return existingPromise

  if (USE_MOCK) {
    const data = mockProducts(type, categorySlug)
    productCache[cacheKey] = data
    return data
  }

  const where =
    type === 'hit'
      ? { isHit: { equals: true } }
      : type === 'new'
        ? { isNew: { equals: true } }
        : undefined

  const promise = graphqlClient.request<ProductsQuery>(GET_PRODUCTS, {
    where,
    limit: 100,
  })
    .then((data) => {
      const normalized = (data.Products?.docs || [])
        .map(normalizeProduct)
        .filter((p: Product | null): p is Product => Boolean(p))
        .filter((p) => (categorySlug ? p.category === categorySlug : true))

      productCache[cacheKey] = normalized
      return normalized
    })
    .catch((e) => {
      console.warn(`Payload products fetch failed (${type}, ${categorySlug || 'all'})`, e)
      return []
    })
    .finally(() => {
      delete productPromises[cacheKey]
    })

  productPromises[cacheKey] = promise
  return promise
}
