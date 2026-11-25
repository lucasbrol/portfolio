import { GoogleGenAI } from "@google/genai";

export const GEMINI_EMBED_MODEL = process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001";
export const EMBED_DIMENSIONS = 768;

export type EmbedTask = "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY";

export interface Embedder {
  provider: "gemini" | "fake";
  model: string;
  embed(texts: string[], task: EmbedTask): Promise<number[][]>;
}

/** Embeddings reais via Gemini. Requer GEMINI_API_KEY. */
export function geminiEmbedder(apiKey = process.env.GEMINI_API_KEY): Embedder {
  if (!apiKey) throw new Error("GEMINI_API_KEY não definida");
  const ai = new GoogleGenAI({ apiKey });
  return {
    provider: "gemini",
    model: GEMINI_EMBED_MODEL,
    async embed(texts, task) {
      const out: number[][] = [];
      // Lotes pequenos para respeitar os limites do plano gratuito.
      for (let i = 0; i < texts.length; i += 50) {
        const batch = texts.slice(i, i + 50);
        const res = await ai.models.embedContent({
          model: GEMINI_EMBED_MODEL,
          contents: batch,
          config: { taskType: task, outputDimensionality: EMBED_DIMENSIONS },
        });
        const embs = res.embeddings ?? [];
        if (embs.length !== batch.length) throw new Error("Resposta de embeddings incompleta");
        out.push(...embs.map((e) => e.values ?? []));
      }
      return out;
    },
  };
}

/** Normaliza texto: minúsculas, sem acentos, só letras/números. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);
}

/**
 * Embedder "falso" e determinístico (bag-of-words com hashing).
 * Usado em testes automatizados e no CI, onde não há chave de API.
 * Não é bom como o Gemini, mas palavras em comum geram vetores parecidos.
 */
export function fakeEmbedder(dimensions = 256): Embedder {
  const hash = (s: string) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h) % dimensions;
  };
  return {
    provider: "fake",
    model: `fake-bow-${dimensions}`,
    async embed(texts) {
      return texts.map((t) => {
        const v = new Array(dimensions).fill(0);
        for (const tok of tokenize(t)) v[hash(tok)] += 1;
        return v;
      });
    },
  };
}

export function embedderFor(provider: "gemini" | "fake"): Embedder {
  return provider === "fake" ? fakeEmbedder() : geminiEmbedder();
}
