import { Category } from '@/types'

export const sortCategoriesByOrder = (categories: Category[] = []): Category[] => {
  return [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}
