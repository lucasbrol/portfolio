/**
 * Testes de "qualidade dos dados": a base de conhecimento é o que impede
 * a IA de inventar — então ela também é testada.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { chunkMarkdown, extractUrls } from "@/lib/chunk";
import { TECH_GROUPS } from "@/lib/tech";

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
    for (const fact of ["Ouro Branco", "Universidade Federal de Viçosa", "InfoAlto", "lucasbrasil7@outlook.com", "github.com/lucasbrol", "instagram.com/lucasbr_ol", "viajar", "ParkFinder", "AlphaPulse", "40 horas semanais", "julho de 2027", "Interestelar"]) {
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

  it("deixa claro que tecnologias usadas não significam domínio", () => {
    expect(all).toMatch(/usou não é o mesmo que domina/i);
    expect(all).not.toMatch(/(domina|especialista em|expert em) (Python|Django|FastAPI|PyTorch|React)/i);
  });

  it("descreve o ParkFinder atual (crowdsensing, sem imagens de satélite)", () => {
    expect(all).toContain("crowdsensing");
    expect(all.toLowerCase()).not.toContain("satélite");
  });

  it("cada seção de projeto cita no máximo um link (vira o link oficial do trecho)", () => {
    const projects = readFileSync(path.join(dir, "06-projetos.md"), "utf8");
    for (const section of projects.split(/\n## /).slice(1)) {
      expect(extractUrls(section).length, section.split("\n")[0]).toBeLessThanOrEqual(1);
    }
  });
});

describe("tecnologias do site", () => {
  const items = TECH_GROUPS.flatMap((g) => g.items);

  it("ids únicos e logo salvo em public/tech", () => {
    expect(new Set(items.map((t) => t.id)).size).toBe(items.length);
    for (const t of items) expect(existsSync(path.join(process.cwd(), "public", "tech", `${t.id}.svg`)), t.id).toBe(true);
  });

  it("toda tecnologia do site também está na base do assistente", () => {
    for (const t of items) {
      const name = t.name.split(" + ")[0];
      expect(all, t.name).toContain(name);
    }
  });
});
