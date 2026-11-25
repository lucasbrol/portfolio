import type { Chunk } from "./types";

/**
 * Similaridade de cosseno: mede o ângulo entre dois vetores.
 * 1 = mesma direção (mesmo assunto), 0 = nada a ver.
 */
export function cosine(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new Error(`Dimensões diferentes: ${a.length} vs ${b.length}`);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export interface ScoredChunk {
  chunk: Chunk;
  score: number;
}

/** Retorna os `k` trechos mais parecidos com a pergunta, acima de `minScore`. */
export function topK(query: number[], chunks: Chunk[], k: number, minScore = 0): ScoredChunk[] {
  return chunks
    .map((chunk) => ({ chunk, score: cosine(query, chunk.embedding) }))
    .filter((s) => s.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
