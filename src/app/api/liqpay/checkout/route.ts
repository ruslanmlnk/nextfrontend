import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

type CheckoutBody = {
  orderId: string | number;
  amount: number;
  description?: string;
  currency?: string;
};

const LIQPAY_CHECKOUT_URL = 'https://www.liqpay.ua/api/3/checkout';
const PAYLOAD_URL =
  process.env.NEXT_PUBLIC_PAYLOAD_URL ??
  process.env.NEXT_PUBLIC_CMS_URL ??
  process.env.PAYLOAD_URL ??
  'http://localhost:3000';

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, '');
}

function toBase64(value: string) {
  return Buffer.from(value, 'utf8').toString('base64');
}

function sign(privateKey: string, data: string) {
  return crypto
    .createHash('sha1')
    .update(`${privateKey}${data}${privateKey}`, 'utf8')
    .digest('base64');
}

export async function POST(request: NextRequest) {
  const publicKey = process.env.LIQPAY_PUBLIC_KEY;
  const privateKey = process.env.LIQPAY_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    const missing = [!publicKey ? 'LIQPAY_PUBLIC_KEY' : null, !privateKey ? 'LIQPAY_PRIVATE_KEY' : null]
      .filter((value): value is string => Boolean(value))
      .join(', ');
    return NextResponse.json({ error: `${missing} не задано` }, { status: 500 });
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: 'Некоректний JSON у запиті' }, { status: 400 });
  }

  const orderId = body?.orderId;
  const amount = Number(body?.amount);

  if (!orderId) {
    return NextResponse.json({ error: 'orderId обовʼязковий' }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: 'amount має бути числом > 0' }, { status: 400 });
  }

  const origin = request.headers.get('origin') || request.nextUrl.origin;
  const orderIdStr = String(orderId);
  const currency = (body.currency || process.env.LIQPAY_CURRENCY || 'UAH').toUpperCase();
  const serverBaseUrl = normalizeBaseUrl(process.env.LIQPAY_SERVER_URL || PAYLOAD_URL);

  const payload: Record<string, unknown> = {
    public_key: publicKey,
    version: '3',
    action: 'pay',
    amount: amount.toFixed(2),
    currency,
    description: body.description || `Оплата замовлення #${orderIdStr}`,
    order_id: orderIdStr,
    result_url: `${origin}/checkout/return?orderId=${encodeURIComponent(orderIdStr)}`,
    server_url: `${serverBaseUrl}/api/liqpay/callback`,
    language: 'uk',
  };

  if ((process.env.LIQPAY_SANDBOX || '').trim() === '1') {
    payload.sandbox = 1;
  }

  const data = toBase64(JSON.stringify(payload));
  const signature = sign(privateKey, data);

  return NextResponse.json({
    endpoint: LIQPAY_CHECKOUT_URL,
    data,
    signature,
  });
}
