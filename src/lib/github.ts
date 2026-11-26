import type { RawDoc } from "./chunk";
import type { RepoSummary } from "./types";

export const GITHUB_USER = process.env.GITHUB_USER ?? "lucasbrol";

/** Repositórios de trabalhos em grupo hospedados em contas de colegas. */
export const COLLABORATIONS: RepoSummary[] = [
  {
    name: "SIN393-Leukemia-Classification",
    description: "Trabalho em grupo (SIN 393 – Visão Computacional, UFV): CNNs em PyTorch (ResNet50, DenseNet121, EfficientNet-B3) que classificam células leucêmicas em imagens de microscópio.",
    url: "https://github.com/otavio-pierin/SIN393-Leukemia-Classification",
    language: "Jupyter Notebook",
    topics: [],
    updatedAt: "",
    homepage: null,
    owner: "otavio-pierin",
    collaboration: true,
  },
  {
    name: "AlphaPulse",
    description: "Trabalho em grupo (SIN 323 – IA, UFV): sentimento de notícias do Ibovespa com FinBERT-PT-BR ajustado (88,4% de acurácia) e teste rigoroso de previsão do mercado.",
    url: "https://github.com/otavio-pierin/AlphaPulse",
    language: "Python",
    topics: [],
    updatedAt: "",
    homepage: null,
    owner: "otavio-pierin",
    collaboration: true,
  },
];

/** Repositórios da conta do Lucas que são trabalhos em grupo (ganham a etiqueta no site). */
const GROUP_REPOS = new Set(["sin142-ridefleet"]);

/** Repositórios que não devem aparecer no site nem no chat. */
const EXCLUDE = new Set(
  (process.env.GITHUB_EXCLUDE ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean),
);

interface GhRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  topics?: string[];
  pushed_at: string;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
  private: boolean;
  owner: { login: string };
}

type Fetch = typeof fetch;

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "lucasbrol-portfolio",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

export async function fetchRepos(user = GITHUB_USER, f: Fetch = fetch): Promise<RepoSummary[]> {
  const res = await f(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const repos = (await res.json()) as GhRepo[];
  return repos
    .filter((r) => !r.fork && !r.private && !EXCLUDE.has(r.name.toLowerCase()))
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      topics: r.topics ?? [],
      updatedAt: r.pushed_at,
      homepage: r.homepage || null,
      owner: r.owner.login,
      ...(GROUP_REPOS.has(r.name.toLowerCase()) ? { collaboration: true } : {}),
    }));
}

export async function fetchReadme(owner: string, repo: string, f: Fetch = fetch): Promise<string | null> {
  const res = await f(`https://api.github.com/repos/${owner}/${repo}/readme`, {
    headers: { ...headers(), Accept: "application/vnd.github.raw+json" },
  });
  if (!res.ok) return null;
  return res.text();
}

/** Limpa o README (tira imagens, badges e HTML) e limita o tamanho. */
export function cleanReadme(md: string, max = 4000): string {
  return md
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

/** Converte um repositório (+ README) num documento para o RAG. */
export function repoToDoc(repo: RepoSummary, readme: string | null): RawDoc {
  const kind = repo.collaboration ? "trabalho em grupo do Lucas com colegas" : "repositório do Lucas";
  const header = [
    `# Repositório: ${repo.name}`,
    "",
    "## Resumo",
    `${repo.name} é um ${kind} no GitHub.`,
    repo.description ? `Descrição: ${repo.description}` : "O repositório não tem descrição.",
    repo.language ? `Linguagem principal: ${repo.language}.` : "",
    repo.topics.length ? `Tópicos: ${repo.topics.join(", ")}.` : "",
    repo.homepage ? `Site/demo: ${repo.homepage}` : "",
    `Link do repositório: ${repo.url}`,
  ]
    .filter(Boolean)
    .join("\n");
  const body = readme ? `\n\n## README de ${repo.name}\n${cleanReadme(readme)}` : "";
  return {
    id: `github:${repo.owner}/${repo.name}`,
    title: `Repositório ${repo.name}`,
    text: header + body,
    source: "github",
    url: repo.url,
  };
}
