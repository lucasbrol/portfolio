import { Fragment, type ReactNode } from "react";

/** Renderiza texto simples com **negrito**, listas "- " e links clicáveis, sem HTML cru. */
export function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`}>
          {list.map((item, i) => (
            <li key={i}>{inline(item)}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  for (const line of lines) {
    const m = line.match(/^\s*(?:[-*•]|\d+\.)\s+(.*)/);
    if (m) {
      list.push(m[1]);
      continue;
    }
    flush();
    if (line.trim()) blocks.push(<p key={`p-${blocks.length}`}>{inline(line)}</p>);
  }
  flush();
  return <>{blocks}</>;
}

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      out.push(<strong key={m.index}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("[")) {
      const [, label, href] = tok.match(/\[([^\]]+)\]\(([^)]+)\)/)!;
      out.push(
        <a key={m.index} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>,
      );
    } else if (tok.startsWith("http")) {
      const href = tok.replace(/[.,;:]+$/, "");
      out.push(
        <Fragment key={m.index}>
          <a href={href} target="_blank" rel="noopener noreferrer">
            {href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
          </a>
          {tok.slice(href.length)}
        </Fragment>,
      );
    } else {
      out.push(
        <a key={m.index} href={`mailto:${tok}`}>
          {tok}
        </a>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
