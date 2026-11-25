/**
 * Divide documentos em trechos ("chunks") para o RAG.
 *
 * Analogia: em vez de entregar o livro inteiro para a IA, recortamos fichas
 * com um assunto cada. Na hora da pergunta, só as fichas mais parecidas com
 * a pergunta são entregues — assim a resposta fica presa ao que está escrito.
 */

export interface RawDoc {
  id: string;
  title: string;
  text: string;
  source: "knowledge" | "github";
  url?: string;
}

export interface TextChunk {
  id: string;
  title: string;
  text: string;
  source: "knowledge" | "github";
  url?: string;
}

const MAX_CHARS = 1200;

/** Extrai URLs http(s) de um texto. */
export function extractUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s)>\]]+/g) ?? [];
  return [...new Set(matches.map((u) => u.replace(/[.,;:]+$/, "")))];
}

/** Quebra um texto longo em pedaços de até `max` caracteres, respeitando parágrafos. */
export function splitLong(text: string, max = MAX_CHARS): string[] {
  if (text.length <= max) return [text];
  const parts: string[] = [];
  let current = "";
  for (const para of text.split(/\n{2,}/)) {
    if (para.length > max) {
      if (current) {
        parts.push(current);
        current = "";
      }
      for (let i = 0; i < para.length; i += max) parts.push(para.slice(i, i + max));
      continue;
    }
    if ((current + "\n\n" + para).length > max && current) {
      parts.push(current);
      current = para;
    } else {
      current = current ? `${current}\n\n${para}` : para;
    }
  }
  if (current) parts.push(current);
  return parts;
}

/**
 * Markdown: cada seção "## " vira um trecho, prefixado pelo título do
 * documento ("# ") para dar contexto ao embedding.
 */
export function chunkMarkdown(doc: RawDoc): TextChunk[] {
  const lines = doc.text.replace(/\r\n/g, "\n").split("\n");
  let docTitle = doc.title;
  const sections: { heading: string; body: string[] }[] = [];
  let current: { heading: string; body: string[] } = { heading: "", body: [] };

  for (const line of lines) {
    const h1 = line.match(/^#\s+(.+)/);
    const h2 = line.match(/^##\s+(.+)/);
    if (h1 && !h2) {
      docTitle = h1[1].trim();
      continue;
    }
    if (h2) {
      if (current.heading || current.body.join("").trim()) sections.push(current);
      current = { heading: h2[1].trim(), body: [] };
      continue;
    }
    current.body.push(line);
  }
  if (current.heading || current.body.join("").trim()) sections.push(current);

  const chunks: TextChunk[] = [];
  sections.forEach((sec, si) => {
    const body = sec.body.join("\n").trim();
    if (!body) return;
    const title = sec.heading ? `${docTitle} > ${sec.heading}` : docTitle;
    splitLong(body).forEach((piece, pi) => {
      const urls = extractUrls(piece);
      chunks.push({
        id: `${doc.id}#${si}-${pi}`,
        title,
        text: `${title}\n${piece}`,
        source: doc.source,
        // Se o trecho cita exatamente um link, ele vira o link "oficial" do trecho.
        url: doc.url ?? (urls.length === 1 ? urls[0] : undefined),
      });
    });
  });
  return chunks;
}
