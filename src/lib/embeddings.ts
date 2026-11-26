import { GoogleGenAI } from "@google/genai";

export const GEMINI_EMBED_MODEL = process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001";
export const EMBED_DIMENSIONS = 768;

export type EmbedTask = "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY";

export interface Embedder {
  provider: "gemini" | "fake";
  model: string;
  embed(texts: string[], task: EmbedTask): Promise<number[][]>;
}

type EmbedClient = Pick<GoogleGenAI["models"], "embedContent">;

export interface EmbedOptions {
  /**
   * Quantas vezes tentar de novo quando o Gemini responde "limite excedido"
   * (HTTP 429). Só o build usa: no chat, esperar um minuto travaria a resposta.
   */
  retries?: number;
  /** Para testes: cliente e espera simulados. */
  client?: EmbedClient;
  sleep?: (ms: number) => Promise<void>;
}

const BATCH = 50;

/** Se o erro for de limite (429), quanto esperar antes de tentar de novo; senão null. */
export function rateLimitDelayMs(err: unknown): number | null {
  const msg = err instanceof Error ? err.message : String(err);
  if (!/\b429\b|RESOURCE_EXHAUSTED|rate limit|quota/i.test(msg)) return null;
  const m = msg.match(/retry in ([\d.]+)\s*s/i) ?? msg.match(/"retryDelay"\s*:\s*"([\d.]+)s"/);
  return Math.ceil((m ? Number(m[1]) : 60) * 1000) + 1000;
}

/** Embeddings reais via Gemini. Requer GEMINI_API_KEY. */
export function geminiEmbedder(apiKey = process.env.GEMINI_API_KEY, opts: EmbedOptions = {}): Embedder {
  const client: EmbedClient = opts.client ?? (() => {
    if (!apiKey) throw new Error("GEMINI_API_KEY não definida");
    return new GoogleGenAI({ apiKey }).models;
  })();
  const retries = opts.retries ?? 0;
  const sleep = opts.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  return {
    provider: "gemini",
    model: GEMINI_EMBED_MODEL,
    async embed(texts, task) {
      const out: number[][] = [];
      // Lotes pequenos; o plano gratuito limita quantos textos por minuto.
      for (let i = 0; i < texts.length; i += BATCH) {
        const batch = texts.slice(i, i + BATCH);
        let res;
        for (let attempt = 0; ; attempt++) {
          try {
            res = await client.embedContent({
              model: GEMINI_EMBED_MODEL,
              contents: batch,
              config: { taskType: task, outputDimensionality: EMBED_DIMENSIONS },
            });
            break;
          } catch (err) {
            const wait = rateLimitDelayMs(err);
            if (wait === null || attempt >= retries) throw err;
            console.warn(`[embeddings] limite do Gemini atingido; nova tentativa em ${Math.round(wait / 1000)}s (${attempt + 1}/${retries})`);
            await sleep(wait);
          }
        }
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

export function embedderFor(provider: "gemini" | "fake", opts?: EmbedOptions): Embedder {
  return provider === "fake" ? fakeEmbedder() : geminiEmbedder(undefined, opts);
}
