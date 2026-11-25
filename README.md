# Portfólio — Lucas Brasil Oliveira

Portfólio pessoal com um **assistente de IA que responde só o que sabe**. Visitantes podem perguntar sobre minha formação, experiência, habilidades, hobbies e projetos — e receber links diretos para os repositórios.

![CI](https://github.com/lucasbrol/portfolio/actions/workflows/ci.yml/badge.svg)

**Stack:** Next.js · TypeScript · Gemini API (chat + embeddings) · Vercel · Vitest · Playwright · GitHub Actions

---

## Como o assistente evita inventar coisas (RAG)

Pense numa prova com consulta: em vez de responder "de cabeça" (e arriscar inventar), o assistente recebe só as fichas que têm a ver com a pergunta e é proibido de usar qualquer outra coisa.

```
pergunta ──► embedding ──► busca os 6 trechos mais parecidos ──► nota máxima < limite? ──► "não sei" (sem chamar a IA)
                                                              └─► Gemini responde SÓ com esses trechos
                                                                   └─► links passam por filtro: só URLs que existem na base
```

1. **Base de conhecimento** (`knowledge/*.md`) — fatos revisados por mim.
2. **Sincronização com o GitHub** — a cada build, `scripts/build-index.ts` lê meus repositórios públicos e READMEs pela API do GitHub. Repositório novo entra no chat sozinho (um workflow redeploya todo dia).
3. **Embeddings** (`gemini-embedding-001`) transformam cada trecho num vetor; a pergunta vira outro vetor e a **similaridade de cosseno** encontra os trechos relevantes.
4. **Quatro barreiras contra alucinação:**
   - limiar de similaridade: pergunta sem relação com a base é recusada sem nem chamar o modelo;
   - prompt de sistema com regras rígidas + saída em JSON (`found: true/false`);
   - links só saem se o id do trecho citado existir no contexto (o modelo não consegue "criar" URLs);
   - avaliação automatizada com perguntas-armadilha e tentativas de prompt injection (`npm run eval`).

## Estratégia de testes (QA)

| Camada | Ferramenta | O que cobre |
|---|---|---|
| Unitário | Vitest | chunking, similaridade, validação de entrada (valor limite: 500/501 caracteres), filtro de links inventados, rate limit, qualidade da base (sem telefone/documentos, links válidos) |
| E2E | Playwright (desktop + mobile) | página, troca de idioma, chat com API simulada, erros de rede, API real recusando perguntas fora da base |
| Avaliação de IA | `scripts/eval.ts` | 20 perguntas reais ao Gemini: fatos corretos, recusas e prompt injection |
| CI | GitHub Actions | typecheck + unitários + build + E2E a cada push/PR |

Os testes E2E já encontraram um bug real durante o desenvolvimento: em falha de rede, o chat exibia a mensagem técnica `Failed to fetch` ao visitante.

## Rodando localmente

```bash
npm install
cp .env.example .env.local      # coloque sua GEMINI_API_KEY
npm run index                   # monta a base (data/index.json)
npm run dev                     # http://localhost:3000

npm test                        # unitários
npm run build && npm run test:e2e
BASE_URL=http://localhost:3000 npm run eval   # avaliação com a IA real
```

Sem `GEMINI_API_KEY`, o índice é montado com embeddings "fake" (só para desenvolvimento e CI).

## Atualizando informações

- **Sobre mim:** edite os arquivos em `knowledge/` e faça push. O deploy refaz a base.
- **Projetos:** basta criar/atualizar repositórios públicos no GitHub com um bom README.
- **Esconder um repositório:** variável `GITHUB_EXCLUDE=nome1,nome2` na Vercel.
