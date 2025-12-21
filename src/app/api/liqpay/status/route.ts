import { NextRequest, NextResponse } from 'next/server'

const payloadUrlFromEnv =
  process.env.NEXT_PUBLIC_PAYLOAD_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? process.env.PAYLOAD_URL

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '')

const resolvePayloadBaseUrl = (request: NextRequest) => {
  const requestOrigin = request.nextUrl.origin
  const envBase = payloadUrlFromEnv ? normalizeBaseUrl(payloadUrlFromEnv) : null

  if (envBase) {
    return { baseUrl: envBase, requestOrigin, isExplicit: true }
  }

  const fallback = normalizeBaseUrl('http://localhost:3000')

  if (fallback === requestOrigin && requestOrigin.includes('localhost:3000')) {
    return { baseUrl: normalizeBaseUrl('http://localhost:3001'), requestOrigin, isExplicit: false }
  }

  return { baseUrl: fallback, requestOrigin, isExplicit: false }
}

export async function GET(request: NextRequest) {
  const { baseUrl, requestOrigin, isExplicit } = resolvePayloadBaseUrl(request)

  const orderId = request.nextUrl.searchParams.get('orderId') || request.nextUrl.searchParams.get('order_id')
  if (!orderId) {
    return NextResponse.json({ error: 'orderId is required.' }, { status: 400 })
  }

  if (isExplicit && baseUrl === requestOrigin) {
    return NextResponse.json(
      {
        error:
          'PAYLOAD_URL вказано як URL фронтенду. Вкажіть URL Payload CMS (наприклад, http://localhost:3000).',
        payloadUrl: baseUrl,
      },
      { status: 500 },
    )
  }

  const targetUrl = `${normalizeBaseUrl(baseUrl)}/api/liqpay/status?orderId=${encodeURIComponent(orderId)}`
  const authorization = request.headers.get('authorization')
  const origin = request.headers.get('origin') || requestOrigin
  const referer = request.headers.get('referer') || origin

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
        ...(origin ? { Origin: origin } : {}),
        ...(referer ? { Referer: referer } : {}),
      },
      cache: 'no-store',
      signal: controller.signal,
    })

    const text = await res.text()
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        error: 'Не вдалося отримати статус оплати від Payload CMS.',
        target: targetUrl,
        details: message,
      },
      { status: 502 },
    )
  } finally {
    clearTimeout(timeout)
  }
}

