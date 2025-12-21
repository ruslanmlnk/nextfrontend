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

export async function POST(request: NextRequest) {
  const { baseUrl, requestOrigin, isExplicit } = resolvePayloadBaseUrl(request)

  if (isExplicit && baseUrl === requestOrigin) {
    return NextResponse.json(
      {
        error:
          'PAYLOAD_URL вказано як URL фронтенду. Вкажи URL Payload CMS (наприклад, http://localhost:3000).',
        payloadUrl: baseUrl,
      },
      { status: 500 },
    )
  }

  const target = `${baseUrl}/api/contact-requests`
  const body = await request.text()

  try {
    const res = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
      },
      body,
      cache: 'no-store',
    })

    const text = await res.text()
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Failed to submit contact request', details: message, target },
      { status: 502 },
    )
  }
}
