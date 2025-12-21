import { NextRequest, NextResponse } from 'next/server';

const PAYLOAD_URL =
  process.env.NEXT_PUBLIC_PAYLOAD_URL ??
  process.env.NEXT_PUBLIC_CMS_URL ??
  process.env.PAYLOAD_URL ??
  'http://localhost:3000';

const GRAPHQL_URL = `${PAYLOAD_URL}/api/graphql`;

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') || 'application/json';
  const authorization = request.headers.get('authorization');

  const body = await request.text();

  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body,
    cache: 'no-store',
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('content-type') || 'application/json',
    },
  });
}

