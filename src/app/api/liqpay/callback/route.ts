import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const PAYLOAD_URL =
  process.env.NEXT_PUBLIC_PAYLOAD_URL ??
  process.env.NEXT_PUBLIC_CMS_URL ??
  process.env.PAYLOAD_URL ??
  'http://localhost:3000';

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, '');
}

function sign(privateKey: string, data: string) {
  return crypto
    .createHash('sha1')
    .update(`${privateKey}${data}${privateKey}`, 'utf8')
    .digest('base64');
}

export async function POST(request: NextRequest) {
  const privateKey = process.env.LIQPAY_PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json({ error: 'LIQPAY_PRIVATE_KEY не задано' }, { status: 500 });
  }

  let data = '';
  let signature = '';

  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    const form = await request.formData();
    data = String(form.get('data') || '');
    signature = String(form.get('signature') || '');
  } else {
    const json = (await request.json().catch(() => null)) as any;
    data = String(json?.data || '');
    signature = String(json?.signature || '');
  }

  if (!data || !signature) {
    return NextResponse.json({ error: 'Очікуються поля data та signature' }, { status: 400 });
  }

  const expected = sign(privateKey, data);
  if (signature !== expected) {
    return NextResponse.json({ error: 'Невірний signature' }, { status: 400 });
  }

  try {
    const decoded = Buffer.from(data, 'base64').toString('utf8');
    const payload = JSON.parse(decoded);
    console.log('LiqPay callback:', payload);
  } catch (error) {
    console.warn('LiqPay callback parse error:', error);
  }

  const payloadBaseUrl = normalizeBaseUrl(PAYLOAD_URL);
  const requestOrigin = normalizeBaseUrl(request.nextUrl.origin);

  if (payloadBaseUrl && payloadBaseUrl !== requestOrigin) {
    const forwardRes = await fetch(`${payloadBaseUrl}/api/liqpay/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, signature }),
      cache: 'no-store',
    });

    const forwardJson = await forwardRes.json().catch(() => null);
    if (!forwardRes.ok) {
      return NextResponse.json(
        { error: 'Не вдалося передати callback у Payload', details: forwardJson },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
