import { NextResponse } from "next/server";
import indexData from "../../../../data/index.json";
import { embedderFor } from "@/lib/embeddings";
import { CONTACT, ValidationError, answerQuestion, geminiLlm } from "@/lib/rag";
import { rateLimit } from "@/lib/rate-limit";
import type { KnowledgeIndex } from "@/lib/types";

export const runtime = "nodejs";

const index = indexData as unknown as KnowledgeIndex;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Muitas perguntas em pouco tempo. Tente de novo em um minuto." }, { status: 429 });
  }

  let body: { question?: unknown; history?: unknown; lang?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  try {
    const result = await answerQuestion({
      question: body.question,
      history: body.history,
      lang: body.lang,
      index,
      embedder: embedderFor(index.provider),
      // Criado sob demanda: perguntas fora da base são recusadas sem gastar chamada ao Gemini.
      llm: { generate: (input) => geminiLlm().generate(input) },
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[chat]", err);
    const lang = body.lang === "en" ? "en" : "pt";
    return NextResponse.json(
      {
        answer:
          lang === "en"
            ? `The assistant is unavailable right now. You can reach Lucas at ${CONTACT.email} or on LinkedIn: ${CONTACT.linkedin}`
            : `O assistente está indisponível no momento. Você pode falar com o Lucas pelo e-mail ${CONTACT.email} ou pelo LinkedIn: ${CONTACT.linkedin}`,
        found: false,
        sources: [],
      },
      { status: 503 },
    );
  }
}
