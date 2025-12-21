import { NextRequest, NextResponse } from 'next/server';
import type { NPCity } from '@/types';

const NOVA_API_URL = 'https://api.novaposhta.ua/v2.0/json/';
const MIN_QUERY_LENGTH = 2;
const RESULTS_LIMIT = 30;

function toNpcity(item: any): NPCity {
  const deliveryCity = item?.DeliveryCity || item?.CityRef || item?.cityRef || '';
  const settlementRef = item?.SettlementRef || item?.Ref || item?.ref || '';
  const ref = deliveryCity || settlementRef;

  const present = item?.Present || item?.Description || item?.name || item?.MainDescription || '';
  const mainDescription = item?.MainDescription || item?.Description || item?.name || present;
  const area = item?.AreaDescription || item?.Area || item?.area || '';
  const region = item?.RegionDescription || item?.Region || item?.region || '';

  return {
    Ref: String(ref),
    Present: String(present),
    MainDescription: String(mainDescription),
    Area: String(area),
    Region: String(region),
    CityRef: deliveryCity ? String(deliveryCity) : undefined,
    DeliveryCity: deliveryCity ? String(deliveryCity) : undefined,
  };
}

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get('q') || '').trim();
  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ cities: [] });
  }

  const apiKey = process.env.NOVAPOSHTA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { cities: [], error: 'NOVAPOSHTA_API_KEY не налаштовано' },
      { status: 500 }
    );
  }

  try {
    const payload = {
      apiKey,
      modelName: 'Address',
      calledMethod: 'searchSettlements',
      methodProperties: {
        CityName: query,
        Limit: RESULTS_LIMIT,
        Language: 'UA',
      },
    };

    const res = await fetch(NOVA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const data = await res.json();
    if (!data?.success || !Array.isArray(data?.data)) {
      const errors = Array.isArray(data?.errors) ? data.errors : [];
      return NextResponse.json(
        { cities: [], error: errors.length ? errors.join('; ') : 'Помилка відповіді Nova Poshta' },
        { status: res.status || 502 }
      );
    }

    const addresses: any[] = data.data.flatMap((entry: any) =>
      Array.isArray(entry?.Addresses) ? entry.Addresses : [entry]
    );

    const cities = addresses
      .slice(0, RESULTS_LIMIT)
      .map((item) => toNpcity(item))
      .filter((city) => city.Ref && city.Present);

    return NextResponse.json({ cities });
  } catch (error) {
    console.error('Error querying Nova Poshta cities:', error);
    return NextResponse.json(
      { cities: [], error: 'Не вдалося завантажити міста' },
      { status: 500 }
    );
  }
}
