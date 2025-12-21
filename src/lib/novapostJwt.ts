let cached: { jwt: string; exp: number } | null = null;

const BASE = 'https://api.novapost.com/v.1.0'; // рекомендований endpoint :contentReference[oaicite:2]{index=2}

export async function getNpJwt(): Promise<string> {
  const now = Date.now();
  if (cached && cached.exp > now) return cached.jwt;

  const apiKey = (process.env.NP_API_KEY || '').trim();
  if (!apiKey) throw new Error('NP_API_KEY is not set');

  const url = `${BASE}/clients/authorization?apiKey=${encodeURIComponent(apiKey)}`; // :contentReference[oaicite:3]{index=3}
  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();

  if (!res.ok || !data?.jwt) throw new Error('JWT auth failed');

  cached = { jwt: data.jwt, exp: now + 55 * 60 * 1000 };
  return data.jwt;
}
