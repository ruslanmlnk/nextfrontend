import type { MetadataRoute } from 'next'
import { fetchProductsServer } from '@/graphql/server/products'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://ostrowtor.net')

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL.replace(/\/$/, '')
  const generatedAt = new Date()

  let productEntries: MetadataRoute.Sitemap = []
  try {
    const products = await fetchProductsServer('all')
    productEntries = (products || [])
      .filter((product) => Boolean(product?.slug))
      .map((product) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: generatedAt,
      }))
  } catch (error) {
    console.warn('Failed to build product part of sitemap', error)
  }

  const staticRoutes = ['/', '/catalog', '/about', '/contact', '/delivery', '/cart', '/checkout', '/wishlist']
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: generatedAt,
  }))

  return [...staticEntries, ...productEntries]
}
