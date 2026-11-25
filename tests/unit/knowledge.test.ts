/**
 * Testes de "qualidade dos dados": a base de conhecimento é o que impede
 * a IA de inventar — então ela também é testada.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { chunkMarkdown, extractUrls } from "@/lib/chunk";

const dir = path.join(process.cwd(), "knowledge");
const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
const all = files.map((f) => readFileSync(path.join(dir, f), "utf8")).join("\n");

describe("base de conhecimento", () => {
  it("tem arquivos e todos começam com título #", () => {
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) expect(readFileSync(path.join(dir, f), "utf8")).toMatch(/^# /);
  });

  it("nenhum trecho passa do tamanho máximo do embedding", () => {
    for (const f of files) {
      const chunks = chunkMarkdown({ id: f, title: f, text: readFileSync(path.join(dir, f), "utf8"), source: "knowledge" });
      for (const c of chunks) expect(c.text.length).toBeLessThan(2000);
    }
  });

  it("contém os fatos essenciais", () => {
    for (const fact of ["Ouro Branco", "Universidade Federal de Viçosa", "InfoAlto", "lucasbrasil7@outlook.com", "github.com/lucasbrol"]) {
      expect(all).toContain(fact);
    }
  });

  it("não expõe dados sensíveis (telefone, documentos)", () => {
    expect(all).not.toMatch(/\(?\d{2}\)?\s?9?\d{4}-?\d{4}/); // telefone
    expect(all).not.toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/); // CPF
    expect(all.toLowerCase()).not.toContain("passaporte");
  });

  it("todos os links do GitHub apontam para repositórios em formato válido", () => {
    const links = extractUrls(all).filter((u) => u.includes("github.com"));
    expect(links.length).toBeGreaterThan(0);
    for (const l of links) expect(l).toMatch(/^https:\/\/github\.com\/[\w-]+(\/[\w.-]+)?$/);
  });
});
