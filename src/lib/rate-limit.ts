/**
 * Limite simples de perguntas por IP (protege a cota gratuita do Gemini).
 * Em ambiente serverless é "melhor esforço": cada instância tem sua memória.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = Number(process.env.RATE_LIMIT_PER_MIN ?? 10);
const hits = new Map<string, number[]>();

export function rateLimit(key: string, now = Date.now(), max = MAX_PER_WINDOW): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return true;
}
