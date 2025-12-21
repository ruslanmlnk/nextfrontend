import type { NPCity, NPWarehouse } from '../../types';

export const novaPoshtaApi = {
  async searchSettlements(cityName: string): Promise<NPCity[]> {
    const q = cityName.trim();
    if (q.length < 2) return [];

    const res = await fetch(`/api/np/cities?q=${encodeURIComponent(q)}`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) {
      const message = typeof data?.error === 'string' ? data.error : `Помилка завантаження міст (${res.status})`;
      throw new Error(message);
    }
    if (typeof data?.error === 'string') {
      throw new Error(data.error);
    }
    return data.cities || [];
  },

  async getWarehouses(cityRef: string, cityName?: string): Promise<NPWarehouse[]> {
    if (!cityRef && !cityName) return [];

    const params = new URLSearchParams();
    if (cityRef) params.set('cityRef', cityRef);
    if (cityName) params.set('cityName', cityName);

    const res = await fetch(`/api/np/warehouses?${params.toString()}`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) {
      const message = typeof data?.error === 'string' ? data.error : `Помилка завантаження відділень (${res.status})`;
      throw new Error(message);
    }
    if (typeof data?.error === 'string') {
      throw new Error(data.error);
    }
    return data.warehouses || [];
  },
};
