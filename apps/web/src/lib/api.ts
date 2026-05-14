const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4100';

function resolveUrl(path: string): string {
  // Next.js API routes (/api/...) use relative URL — no external base needed
  if (path.startsWith('/api/')) return path;
  return `${API_BASE}${path}`;
}

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(resolveUrl(path), {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost<T>(path: string, body: any, token?: string): Promise<T> {
  const res = await fetch(resolveUrl(path), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
