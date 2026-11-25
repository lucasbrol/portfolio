import { describe, expect, it } from "vitest";
import { chunkMarkdown, extractUrls, splitLong } from "@/lib/chunk";
import { cleanReadme, repoToDoc } from "@/lib/github";
import { rateLimit } from "@/lib/rate-limit";
import { cosine, topK } from "@/lib/similarity";
import { tokenize } from "@/lib/embeddings";

describe("chunkMarkdown", () => {
  const md = `# Sobre o Lucas

## Onde mora
Lucas mora em Ouro Branco, MG.

## Projeto
Repositório: https://github.com/lucasbrol/x
`;
  const chunks = chunkMarkdown({ id: "k", title: "sobre", text: md, source: "knowledge" });

  it("cria um trecho por seção ##, com o título do documento como contexto", () => {
    expect(chunks).toHaveLength(2);
    expect(chunks[0].title).toBe("Sobre o Lucas > Onde mora");
    expect(chunks[0].text).toContain("Ouro Branco");
  });

  it("associa o link quando a seção cita exatamente uma URL", () => {
    expect(chunks[0].url).toBeUndefined();
    expect(chunks[1].url).toBe("https://github.com/lucasbrol/x");
  });

  it("gera ids únicos", () => {
    expect(new Set(chunks.map((c) => c.id)).size).toBe(chunks.length);
  });
});

describe("splitLong / extractUrls", () => {
  it("não corta textos curtos e divide os longos em partes <= max", () => {
    expect(splitLong("curto", 10)).toEqual(["curto"]);
    const parts = splitLong(["a".repeat(8), "b".repeat(8), "c".repeat(25)].join("\n\n"), 10);
    expect(parts.every((p) => p.length <= 10)).toBe(true);
    expect(parts.join("")).toContain("c".repeat(10));
  });

  it("extrai URLs sem pontuação final e sem duplicatas", () => {
    expect(extractUrls("veja https://a.com/x. e https://a.com/x")).toEqual(["https://a.com/x"]);
  });
});

describe("similaridade", () => {
  it("cosine: vetores iguais = 1, ortogonais = 0, zero = 0", () => {
    expect(cosine([1, 2], [1, 2])).toBeCloseTo(1);
    expect(cosine([1, 0], [0, 1])).toBe(0);
    expect(cosine([0, 0], [1, 1])).toBe(0);
    expect(() => cosine([1], [1, 2])).toThrow();
  });

  it("topK ordena por score e aplica o mínimo", () => {
    const mk = (id: string, e: number[]) => ({ id, title: id, text: id, source: "knowledge" as const, embedding: e });
    const res = topK([1, 0], [mk("a", [0, 1]), mk("b", [1, 0]), mk("c", [1, 1])], 5, 0.5);
    expect(res.map((r) => r.chunk.id)).toEqual(["b", "c"]);
  });
});

describe("tokenize", () => {
  it("normaliza acentos e caixa", () => {
    expect(tokenize("Formação em Viçosa!")).toEqual(["formacao", "vicosa"]);
  });
});

describe("github", () => {
  it("cleanReadme remove imagens, HTML e comentários", () => {
    const out = cleanReadme("<!-- x -->\n![badge](a.svg)\n<p align='center'>Olá</p>\n\n\n\nTexto");
    expect(out).not.toMatch(/badge|<p|<!--/);
    expect(out).toContain("Olá");
  });

  it("repoToDoc inclui o link e marca trabalhos em grupo", () => {
    const doc = repoToDoc(
      {
        name: "AlphaPulse",
        description: "previsão",
        url: "https://github.com/o/AlphaPulse",
        language: "Python",
        topics: [],
        updatedAt: "",
        homepage: null,
        owner: "o",
        collaboration: true,
      },
      null,
    );
    expect(doc.url).toBe("https://github.com/o/AlphaPulse");
    expect(doc.text).toContain("trabalho em grupo");
    expect(doc.text).toContain("Link do repositório: https://github.com/o/AlphaPulse");
  });
});

describe("rateLimit", () => {
  it("bloqueia a (max+1)-ésima requisição na mesma janela e libera depois", () => {
    const key = `t-${Math.random()}`;
    const t0 = 1_000_000;
    for (let i = 0; i < 3; i++) expect(rateLimit(key, t0 + i, 3)).toBe(true);
    expect(rateLimit(key, t0 + 10, 3)).toBe(false);
    expect(rateLimit(key, t0 + 61_000, 3)).toBe(true);
  });
});
