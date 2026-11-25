"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Dict } from "@/lib/i18n";
import type { ChatMessage, ChatSource, Lang } from "@/lib/types";
import { RichText } from "./RichText";

interface UiMessage extends ChatMessage {
  sources?: ChatSource[];
  found?: boolean;
  error?: boolean;
}

export function Chat({ t, lang }: { t: Dict["chat"]; lang: Lang }) {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;
    const history: ChatMessage[] = messages
      .filter((m) => !m.error)
      .map(({ role, content }) => ({ role, content }));
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (typeof data.answer === "string") {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.answer, sources: data.sources ?? [], found: data.found },
        ]);
      } else {
        // 400/429 trazem uma mensagem útil do servidor; o resto vira erro genérico.
        const serverMsg = res.status === 400 || res.status === 429 ? data.error : null;
        setMessages((m) => [...m, { role: "assistant", content: serverMsg || t.error, error: true }]);
      }
    } catch {
      // Falha de rede: nunca mostrar mensagens técnicas ("Failed to fetch") ao visitante.
      setMessages((m) => [...m, { role: "assistant", content: t.error, error: true }]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(input);
  }

  return (
    <section className="chat" aria-labelledby="chat-title" data-testid="chat">
      <header className="chat-head">
        <span className="chat-dot" aria-hidden />
        <div>
          <h2 id="chat-title">{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>
      </header>

      <div className="chat-log" ref={logRef} role="log" aria-live="polite" data-testid="chat-log">
        {messages.length === 0 && (
          <div className="chat-suggestions">
            {t.suggestions.map((s) => (
              <button key={s} type="button" onClick={() => ask(s)} data-testid="suggestion">
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`msg msg-${m.role}${m.error ? " msg-error" : ""}`}
            data-testid={`msg-${m.role}`}
            data-found={m.found === undefined ? undefined : String(m.found)}
          >
            {m.role === "assistant" && m.found === false && !m.error && (
              <span className="msg-badge">{t.notFound}</span>
            )}
            <RichText text={m.content} />
            {m.sources && m.sources.length > 0 && (
              <div className="msg-sources" data-testid="sources">
                <span>{t.sources}</span>
                {m.sources.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.url.includes("github.com") ? "↗ " : "→ "}
                    {s.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="msg msg-assistant msg-loading" data-testid="loading">
            <span className="dots" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            {t.thinking}
          </div>
        )}
      </div>

      <form className="chat-form" onSubmit={onSubmit}>
        <label htmlFor="chat-input" className="sr-only">
          {t.title}
        </label>
        <input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          maxLength={500}
          autoComplete="off"
          data-testid="chat-input"
        />
        <button type="submit" disabled={loading || !input.trim()} data-testid="chat-send">
          {t.send}
        </button>
      </form>
      <p className="chat-note">{t.disclaimer}</p>
    </section>
  );
}
