'use client'

import { OrderData } from '@/types'

const USE_MOCK = false

export const createOrderRequest = async (orderData: OrderData): Promise<{ success: boolean; id: string | number }> => {
  if (USE_MOCK) {
    return { success: true, id: 'mock-order-id' }
  }

  const items = orderData.items.map((item) => {
    const productId = String(item.product_id)
    const numericId = Number(productId)

    return {
      product: Number.isFinite(numericId) ? numericId : productId,
      quantity: item.quantity,
      colorTitle: item.colorTitle,
      colorSlug: item.colorSlug,
      colorHex: item.colorHex,
    }
  })

  const payloadBody = {
    firstName: orderData.customer.firstName,
    lastName: orderData.customer.lastName,
    phone: orderData.customer.phone,
    email: orderData.customer.email,
    city: orderData.delivery.city,
    warehouse: orderData.delivery.warehouse,
    deliveryMethod: orderData.delivery.method,
    paymentMethod: orderData.paymentMethod,
    total: orderData.total,
    items,
  }

  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payloadBody),
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Order create failed (${res.status})`)
  }

  const json = await res.json().catch(() => null)
  const id = json?.id ?? json?.doc?.id ?? 'order-created'
  return { success: true, id }
}
