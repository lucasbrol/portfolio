import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000",
  ),
  title: "Lucas Brasil Oliveira — QA & Testes de Software",
  description:
    "Portfólio do Lucas Brasil Oliveira, estudante de Sistemas de Informação (UFV) focado em QA. Pergunte qualquer coisa ao assistente com IA.",
  openGraph: {
    title: "Lucas Brasil Oliveira — QA & Testes de Software",
    description: "Portfólio com assistente de IA que responde só o que sabe.",
    images: ["/lucas.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
