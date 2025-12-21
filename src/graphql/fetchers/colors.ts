'use client'

import { Color } from '@/types'
import { graphqlClient } from '../client'
import { GET_COLORS } from '../queries/colors'
import type { PayloadColor } from '../types'

const USE_MOCK = false
let cachedColors: Color[] | null = null
let colorsPromise: Promise<Color[]> | null = null

type ColorsQuery = {
  Colors?: {
    docs?: PayloadColor[] | null
  } | null
}

const normalizeColor = (item: PayloadColor): Color | null => {
  if (!item) return null
  return {
    id: item.id ?? item.slug ?? item.title ?? '',
    title: item.title ?? '',
    slug: item.slug ?? '',
    hex: item.hex ?? undefined,
  }
}

export const fetchColors = async (): Promise<Color[]> => {
  if (cachedColors && cachedColors.length > 0) return cachedColors
  if (colorsPromise) return colorsPromise

  if (USE_MOCK) {
    cachedColors = []
    return cachedColors
  }

  colorsPromise = (async () => {
    try {
      const data = await graphqlClient.request<ColorsQuery>(GET_COLORS, { limit: 1000 })
      const raw = data.Colors?.docs ?? []
      const normalized = (raw || [])
        .map(normalizeColor)
        .filter((c: Color | null): c is Color => Boolean(c))

      cachedColors = normalized
      return normalized
    } catch (error) {
      console.warn('Payload colors fetch failed', error)
      cachedColors = []
      return []
    } finally {
      colorsPromise = null
    }
  })()

  return colorsPromise
}

