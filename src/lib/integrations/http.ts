// Helper HTTP para integrações. Timeout curto e parsing defensivo.

export async function fetchJson<T = unknown>(
  url: string,
  init?: RequestInit,
  timeoutMs = 12000,
): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "MudaConduta/1.0 (+editorial médico)",
        ...(init?.headers ?? {}),
      },
      // Coleta sempre busca dados frescos.
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
