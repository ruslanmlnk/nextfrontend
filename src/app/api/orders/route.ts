import { NextRequest, NextResponse } from 'next/server';

const payloadUrlFromEnv =
  process.env.NEXT_PUBLIC_PAYLOAD_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? process.env.PAYLOAD_URL;

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '');

const resolvePayloadBaseUrl = (request: NextRequest) => {
  const requestOrigin = request.nextUrl.origin;
  const envBase = payloadUrlFromEnv ? normalizeBaseUrl(payloadUrlFromEnv) : null;

  if (envBase) {
    return { baseUrl: envBase, requestOrigin, isExplicit: true };
  }

  const fallback = normalizeBaseUrl('http://localhost:3000');

  if (fallback === requestOrigin && requestOrigin.includes('localhost:3000')) {
    return { baseUrl: normalizeBaseUrl('http://localhost:3001'), requestOrigin, isExplicit: false };
  }

  return { baseUrl: fallback, requestOrigin, isExplicit: false };
};

export async function POST(request: NextRequest) {
  const { baseUrl, requestOrigin, isExplicit } = resolvePayloadBaseUrl(request);
  const ordersUrl = `${baseUrl}/api/orders`;

  if (isExplicit && baseUrl === requestOrigin) {
    return NextResponse.json(
      {
        error:
          'PAYLOAD_URL вказано як URL фронтенду. Вкажи URL Payload CMS (наприклад, http://localhost:3000).',
        payloadUrl: baseUrl,
      },
      { status: 500 }
    );
  }

  const contentType = request.headers.get('content-type') || 'application/json';
  const authorization = request.headers.get('authorization');
  const origin = request.headers.get('origin') || requestOrigin;
  const referer = request.headers.get('referer') || origin;

  const body = await request.text();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(ordersUrl, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        ...(authorization ? { Authorization: authorization } : {}),
        ...(origin ? { Origin: origin } : {}),
        ...(referer ? { Referer: referer } : {}),
      },
      body,
      cache: 'no-store',
      signal: controller.signal,
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: 'Не вдалося звернутися до Payload CMS для створення замовлення.',
        target: ordersUrl,
        details: message,
      },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
