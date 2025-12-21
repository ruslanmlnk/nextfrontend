'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded' | null

type SyncResponse = {
  paymentStatus?: string
  liqpayStatus?: string
  liqpayAction?: string
  error?: string
}

const STORAGE_KEY = 'lastCheckoutOrderId'

function getContent(paymentStatus: PaymentStatus, orderId: string | null) {
  if (paymentStatus === 'paid') {
    return {
      title: 'Оплату успішно виконано',
      message: `Дякуємо за покупку${orderId ? `! Номер замовлення: ${orderId}` : '!'}.`,
    }
  }

  if (paymentStatus === 'refunded') {
    return {
      title: 'Оплату повернено',
      message: `Оплату повернено${orderId ? ` (замовлення ${orderId})` : ''}.`,
    }
  }

  if (paymentStatus === 'failed') {
    return {
      title: 'Оплату скасовано',
      message: `Замовлення${orderId ? ` ${orderId}` : ''} не оплачено. Ви можете спробувати ще раз.`,
    }
  }

  return {
    title: 'Оплата в обробці',
    message: `Ми перевіряємо статус оплати${orderId ? ` для замовлення ${orderId}` : ''}.`,
  }
}

export default function CheckoutPaymentResult() {
  const searchParams = useSearchParams()

  const [orderId, setOrderId] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null)
  const [liqpayStatus, setLiqpayStatus] = useState<string | null>(null)
  const [liqpayAction, setLiqpayAction] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fromQuery = searchParams?.get('orderId') || searchParams?.get('order_id')
    if (fromQuery) {
      setOrderId(fromQuery)
      try {
        localStorage.setItem(STORAGE_KEY, fromQuery)
      } catch {
        // ignore
      }
      return
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setOrderId(saved)
    } catch {
      // ignore
    }
  }, [searchParams])

  const sync = useCallback(async () => {
    if (!orderId) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/liqpay/status?orderId=${encodeURIComponent(orderId)}`, {
        method: 'GET',
        cache: 'no-store',
      })

      const json = (await res.json().catch(() => null)) as SyncResponse | null
      if (!res.ok) {
        setError(json?.error || 'Не вдалося перевірити статус оплати.')
        return
      }

      const nextStatus = typeof json?.paymentStatus === 'string' ? json.paymentStatus : null
      if (nextStatus === 'paid' || nextStatus === 'pending' || nextStatus === 'failed' || nextStatus === 'refunded') {
        setPaymentStatus(nextStatus)
        if (nextStatus !== 'pending') {
          try {
            localStorage.removeItem(STORAGE_KEY)
          } catch {
            // ignore
          }
        }
      } else {
        setPaymentStatus(null)
      }

      setLiqpayStatus(typeof json?.liqpayStatus === 'string' ? json.liqpayStatus : null)
      setLiqpayAction(typeof json?.liqpayAction === 'string' ? json.liqpayAction : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося перевірити статус оплати.')
    } finally {
      setIsLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    if (!orderId) return
    void sync()
  }, [orderId, sync])

  const content = useMemo(() => {
    if (!orderId) {
      return {
        title: 'Оплата',
        message: 'Не вдалося визначити номер замовлення. Поверніться до checkout і спробуйте ще раз.',
      }
    }

    return getContent(paymentStatus, orderId)
  }, [paymentStatus, orderId])

  return (
    <div className="w-full max-w-[1352px] mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-extrabold uppercase text-gray-900 mb-4">{content.title}</h1>
      <p className="text-gray-700 mb-6">{content.message}</p>

      {error ? <p className="text-sm text-red-600 mb-6">{error}</p> : null}

      {liqpayStatus || liqpayAction ? (
        <p className="text-xs text-gray-500 mb-6">
          {liqpayStatus ? `LiqPay status: ${liqpayStatus}` : null}
          {liqpayStatus && liqpayAction ? ' • ' : null}
          {liqpayAction ? `action: ${liqpayAction}` : null}
        </p>
      ) : null}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/checkout"
          className="inline-flex items-center justify-center bg-amber-400 text-gray-900 font-bold uppercase px-6 py-3 rounded-sm hover:bg-amber-500 transition-colors w-full sm:w-auto"
        >
          Повернутись до checkout
        </Link>

        {orderId ? (
          <button
            type="button"
            onClick={() => void sync()}
            disabled={isLoading}
            className="inline-flex items-center justify-center bg-[#8C8C8C] hover:bg-[#777] text-white font-bold uppercase px-6 py-3 rounded-sm transition-colors w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Перевіряємо…' : 'Перевірити статус'}
          </button>
        ) : null}

        <Link href="/" className="text-amber-500 underline">
          На головну
        </Link>
      </div>
    </div>
  )
}
