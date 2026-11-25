export type Lang = "pt" | "en";

/** Um pedaço de texto da base de conhecimento, já com o seu vetor (embedding). */
export interface Chunk {
  id: string;
  /** Título legível da origem, ex.: "Formação acadêmica > TCC" ou "Repositório: labdeprog" */
  title: string;
  text: string;
  /** "knowledge" (arquivos .md) ou "github" (repositórios sincronizados) */
  source: "knowledge" | "github";
  /** Link público associado ao trecho, quando houver (ex.: URL do repositório). */
  url?: string;
  embedding: number[];
}

export interface KnowledgeIndex {
  provider: "gemini" | "fake";
  model: string;
  dimensions: number;
  builtAt: string;
  chunks: Chunk[];
}

export interface RepoSummary {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  topics: string[];
  updatedAt: string;
  homepage: string | null;
  owner: string;
  collaboration?: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatSource {
  title: string;
  url: string;
}

export interface ChatResponse {
  answer: string;
  /** false quando o assistente não encontrou a resposta na base */
  found: boolean;
  sources: ChatSource[];
}
