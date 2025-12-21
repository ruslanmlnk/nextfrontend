import { NextResponse } from 'next/server';
import type { NPWarehouse } from '@/types';

const NOVA_API_URL = 'https://api.novaposhta.ua/v2.0/json/';

type WarehouseResponse = {
  success: boolean;
  data?: any[];
  errors?: string[];
  warnings?: string[];
};

type WarehousesCallResult = {
  items: any[];
  errors: string[];
  warnings: string[];
  status: number;
};

async function callWarehouses(apiKey: string, props: Record<string, string>): Promise<WarehousesCallResult> {
  const payload = {
    apiKey,
    modelName: 'AddressGeneral',
    calledMethod: 'getWarehouses',
    methodProperties: {
      Language: 'UA',
      ...props,
    },
  };

  const response = await fetch(NOVA_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data: WarehouseResponse = await response.json();
  const items = data.success && Array.isArray(data.data) ? data.data : [];

  return {
    items,
    errors: Array.isArray(data.errors) ? data.errors : [],
    warnings: Array.isArray(data.warnings) ? data.warnings : [],
    status: response.status,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cityRef = (searchParams.get('cityRef') || searchParams.get('settlementId') || '').trim();
  const cityName = (searchParams.get('cityName') || '').trim();
  if (!cityRef && !cityName) {
    return NextResponse.json({ warehouses: [] });
  }

  const apiKey = process.env.NOVAPOSHTA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { warehouses: [], error: 'NOVAPOSHTA_API_KEY не налаштовано' },
      { status: 500 }
    );
  }

  try {
    const primary = await callWarehouses(apiKey, {
      ...(cityRef ? { CityRef: cityRef } : {}),
      ...(cityName ? { CityName: cityName } : {}),
    });

    let items = primary.items;
    let errors = primary.errors;
    let warnings = primary.warnings;

    // Фолбек: якщо CityRef не дав результатів — пробуємо по назві міста
    if (items.length === 0 && cityName) {
      const byName = await callWarehouses(apiKey, { CityName: cityName });
      if (byName.items.length > 0) {
        items = byName.items;
        errors = byName.errors;
        warnings = byName.warnings;
      } else if (errors.length === 0) {
        errors = byName.errors;
        warnings = byName.warnings;
      }
    }

    const warehouses: NPWarehouse[] = items.map((item: any) => ({
      Ref: item.Ref,
      Description: `${item.Description || item.ShortAddress || ''}${item.Number ? ` | №${item.Number}` : ''}`.trim(),
      Number: item.Number || '',
      Name: item.Description || '',
      Address: item.ShortAddress || item.Description || '',
      DivisionCategory: item.TypeOfWarehouse?.Description || item.TypeOfWarehouse || '',
    }));

    const body: Record<string, unknown> = { warehouses };
    if (warehouses.length === 0) {
      if (errors.length) body.error = errors.join('; ');
      if (warnings.length) body.warnings = warnings;
    }

    const status = primary.status >= 400 ? primary.status : 200;
    return NextResponse.json(body, { status });
  } catch (error) {
    console.error('Error requesting Nova Poshta warehouses:', error);
    return NextResponse.json({ warehouses: [], error: 'Не вдалося завантажити відділення' }, { status: 500 });
  }
}
