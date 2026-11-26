/**
 * Baixa os logos das tecnologias (src/lib/tech.ts) para public/tech/<id>.svg.
 * Os arquivos são versionados, então o build não depende de CDN externa.
 *
 * Uso: npm run icons
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { TECH_GROUPS } from "../src/lib/tech";

async function main() {
  const dir = path.join(process.cwd(), "public", "tech");
  await mkdir(dir, { recursive: true });
  const items = TECH_GROUPS.flatMap((g) => g.items);
  for (const t of items) {
    const res = await fetch(t.src, { headers: { "User-Agent": "lucasbrol-portfolio" } });
    if (!res.ok) throw new Error(`${t.name}: HTTP ${res.status} (${t.src})`);
    await writeFile(path.join(dir, `${t.id}.svg`), await res.text());
    console.log(`✓ ${t.id}`);
  }
  console.log(`${items.length} logos em public/tech`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
