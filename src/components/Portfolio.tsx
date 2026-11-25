"use client";

import { useEffect, useState } from "react";
import { LINKS, dict } from "@/lib/i18n";
import type { Lang, RepoSummary } from "@/lib/types";
import { Chat } from "./Chat";

export function Portfolio({ repos }: { repos: RepoSummary[] }) {
  const [lang, setLang] = useState<Lang>("pt");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "en" || saved === "pt") setLang(saved);
      else if (navigator.language && !navigator.language.toLowerCase().startsWith("pt")) setLang("en");
    } catch {
      /* armazenamento indisponível */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
    try {
      localStorage.setItem("lang", lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const t = dict[lang];
  const own = repos.filter((r) => !r.collaboration);
  const collab = repos.filter((r) => r.collaboration);

  return (
    <>
      <nav className="nav">
        <a href="#top" className="nav-logo">
          lucas<span>.</span>brol
        </a>
        <div className="nav-links">
          <a href="#sobre">{t.nav.about}</a>
          <a href="#trajetoria">{t.nav.experience}</a>
          <a href="#projetos">{t.nav.projects}</a>
          <a href="#contato">{t.nav.contact}</a>
        </div>
        <div className="lang" role="group" aria-label="Idioma / Language">
          {(["pt", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={lang === l}
              onClick={() => setLang(l)}
              data-testid={`lang-${l}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      <main id="top">
        <section className="hero">
          <div className="hero-id">
            <p className="kicker">{t.hero.kicker}</p>
            <div className="hero-name">
              <img src="/lucas.jpg" alt="Foto de Lucas Brasil Oliveira" width={132} height={132} />
              <h1>
                {t.hero.title}
                <span>{t.hero.role}</span>
              </h1>
            </div>
            <p className="lead">{t.hero.lead}</p>
            <p className="status">
              <span aria-hidden /> {t.hero.status}
            </p>
            <div className="hero-links">
              <a className="btn" href="#contato">
                {t.hero.cta}
              </a>
              <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
              <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </div>
          </div>
          <Chat t={t.chat} lang={lang} />
        </section>

        <section id="sobre" className="block">
          <h2 className="block-title">
            <span>01</span>
            {t.about.title}
          </h2>
          <div className="prose">
            {t.about.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <section id="trajetoria" className="block">
          <h2 className="block-title">
            <span>02</span>
            {t.experience.title}
          </h2>
          <ol className="timeline">
            {t.experience.items.map((it) => (
              <li key={it.role}>
                <span className="period">{it.period}</span>
                <div>
                  <h3>{it.role}</h3>
                  <p className="org">{it.org}</p>
                  <p>{it.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="habilidades" className="block">
          <h2 className="block-title">
            <span>03</span>
            {t.skills.title}
          </h2>
          <div className="skills">
            {t.skills.groups.map((g) => (
              <div key={g.name}>
                <h3>{g.name}</h3>
                <ul>
                  {g.items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="langs">{t.skills.languages}</p>
        </section>

        <section id="projetos" className="block">
          <h2 className="block-title">
            <span>04</span>
            {t.projects.title}
          </h2>
          <p className="block-sub">{t.projects.subtitle}</p>
          <div className="repos" data-testid="repos">
            {[...own, ...collab].map((r) => (
              <a key={r.url} className="repo" href={r.url} target="_blank" rel="noopener noreferrer">
                <div className="repo-top">
                  <h3>{r.name}</h3>
                  {r.collaboration && <span className="tag">{t.projects.collab}</span>}
                </div>
                <p>{r.description ?? t.projects.noDescription}</p>
                <div className="repo-meta">
                  {r.language && <span>{r.language}</span>}
                  <span className="repo-link">{t.projects.view} ↗</span>
                </div>
              </a>
            ))}
          </div>
          <a className="more" href={LINKS.github} target="_blank" rel="noopener noreferrer">
            {t.projects.all} ↗
          </a>
        </section>

        <section id="contato" className="block contact">
          <h2>{t.contact.title}</h2>
          <p>{t.contact.body}</p>
          <div className="contact-links">
            <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
            <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
              linkedin.com/in/lucasbrasil7 ↗
            </a>
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
              github.com/lucasbrol ↗
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Lucas Brasil Oliveira</span>
        <span>{t.footer}</span>
      </footer>
    </>
  );
}
