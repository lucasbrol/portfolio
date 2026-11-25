/**
 * Monta a base de conhecimento do assistente (data/index.json).
 *
 * 1. Lê os arquivos em knowledge/*.md (informações sobre o Lucas).
 * 2. Busca os repositórios públicos do GitHub + READMEs (sincronização automática).
 * 3. Divide tudo em trechos e calcula o embedding de cada um.
 *
 * Roda sozinho antes de cada build (npm run build) — na Vercel, a cada deploy.
 *
 * Variáveis:
 *   GEMINI_API_KEY        chave do Gemini (obrigatória em produção)
 *   EMBEDDINGS_PROVIDER   "fake" para testes/CI sem chave
 *   SKIP_GITHUB=1         não consulta o GitHub (usa data/repos.json, se existir)
 *   GITHUB_TOKEN          opcional, aumenta o limite da API do GitHub
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { chunkMarkdown, type RawDoc } from "../src/lib/chunk";
import { embedderFor } from "../src/lib/embeddings";
import { COLLABORATIONS, GITHUB_USER, fetchReadme, fetchRepos, repoToDoc } from "../src/lib/github";
import type { KnowledgeIndex, RepoSummary } from "../src/lib/types";

const ROOT = process.cwd();
const DATA = path.join(ROOT, "data");

async function loadKnowledge(): Promise<RawDoc[]> {
  const dir = path.join(ROOT, "knowledge");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".md")).sort();
  return Promise.all(
    files.map(async (f) => ({
      id: `knowledge:${f}`,
      title: f.replace(/^\d+-/, "").replace(/\.md$/, ""),
      text: await readFile(path.join(dir, f), "utf8"),
      source: "knowledge" as const,
    })),
  );
}

async function loadRepos(): Promise<{ repos: RepoSummary[]; docs: RawDoc[] }> {
  const cachePath = path.join(DATA, "repos.json");
  if (process.env.SKIP_GITHUB === "1") {
    const repos: RepoSummary[] = existsSync(cachePath) ? JSON.parse(await readFile(cachePath, "utf8")) : [];
    console.log(`[index] SKIP_GITHUB=1 — usando ${repos.length} repositórios em cache`);
    return { repos, docs: repos.map((r) => repoToDoc(r, null)) };
  }
  try {
    const own = await fetchRepos();
    const all = [...own, ...COLLABORATIONS];
    const docs: RawDoc[] = [];
    for (const r of all) {
      const readme = await fetchReadme(r.owner, r.name).catch(() => null);
      docs.push(repoToDoc(r, readme));
    }
    console.log(`[index] GitHub: ${own.length} repositórios de ${GITHUB_USER} + ${COLLABORATIONS.length} colaborações`);
    return { repos: all, docs };
  } catch (err) {
    // Se o GitHub falhar, o deploy não quebra: usamos o último cache.
    console.warn(`[index] Falha ao consultar o GitHub (${(err as Error).message}). Usando cache.`);
    const repos: RepoSummary[] = existsSync(cachePath) ? JSON.parse(await readFile(cachePath, "utf8")) : COLLABORATIONS;
    return { repos, docs: repos.map((r) => repoToDoc(r, null)) };
  }
}

/** Um documento-resumo com a lista de todos os repositórios (para "quais projetos ele tem?"). */
function repoListDoc(repos: RepoSummary[]): RawDoc {
  const own = repos.filter((r) => !r.collaboration);
  const collab = repos.filter((r) => r.collaboration);
  const line = (r: RepoSummary) =>
    `- ${r.name}${r.language ? ` (${r.language})` : ""}${r.description ? `: ${r.description}` : ""} — ${r.url}`;
  return {
    id: "github:lista",
    title: "Lista de repositórios",
    source: "github",
    text: [
      "# Projetos do Lucas no GitHub",
      "",
      "## Lista de repositórios e links",
      `O perfil do Lucas no GitHub é https://github.com/${GITHUB_USER}. Repositórios públicos dele:`,
      ...own.map(line),
      "",
      "Trabalhos em grupo dos quais o Lucas participou (hospedados na conta de colegas):",
      ...collab.map(line),
    ].join("\n"),
  };
}

async function main() {
  await mkdir(DATA, { recursive: true });
  let provider: "gemini" | "fake" = process.env.EMBEDDINGS_PROVIDER === "fake" ? "fake" : "gemini";
  if (provider === "gemini" && !process.env.GEMINI_API_KEY) {
    if (process.env.VERCEL) throw new Error("GEMINI_API_KEY não configurada na Vercel.");
    console.warn("[index] GEMINI_API_KEY ausente — usando embeddings 'fake' (somente para desenvolvimento).");
    provider = "fake";
  }

  const knowledge = await loadKnowledge();
  const { repos, docs: repoDocs } = await loadRepos();
  const docs = [...knowledge, repoListDoc(repos), ...repoDocs];
  const chunks = docs.flatMap(chunkMarkdown);

  const embedder = embedderFor(provider);
  const vectors = await embedder.embed(
    chunks.map((c) => c.text),
    "RETRIEVAL_DOCUMENT",
  );

  const index: KnowledgeIndex = {
    provider,
    model: embedder.model,
    dimensions: vectors[0]?.length ?? 0,
    builtAt: new Date().toISOString(),
    chunks: chunks.map((c, i) => ({ ...c, embedding: vectors[i].map((x) => Number(x.toFixed(6))) })),
  };

  await writeFile(path.join(DATA, "index.json"), JSON.stringify(index));
  await writeFile(path.join(DATA, "repos.json"), JSON.stringify(repos, null, 2));
  console.log(`[index] ${chunks.length} trechos indexados com ${embedder.model} (${index.dimensions} dimensões).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
