import type { Lang } from "./types";

export const LINKS = {
  email: "lucasbrasil7@outlook.com",
  linkedin: "https://www.linkedin.com/in/lucasbrasil7/",
  github: "https://github.com/lucasbrol",
};

const pt = {
  nav: { about: "Sobre", experience: "Trajetória", skills: "Habilidades", projects: "Projetos", contact: "Contato" },
  hero: {
    kicker: "Ouro Branco, MG · Sistemas de Informação · UFV",
    title: "Lucas Brasil Oliveira",
    role: "QA & Testes de Software",
    lead: "Estudante brasileiro determinado e sonhador, começando a carreira em tecnologia. Gosto de entender como as coisas funcionam — e de quebrá-las de propósito para achar bugs antes do usuário.",
    status: "Buscando a primeira oportunidade em tecnologia",
    cta: "Falar comigo",
  },
  chat: {
    title: "Faça uma pergunta sobre o Lucas",
    subtitle: "Assistente com IA que responde só com informações verificadas. Se não souber, ele avisa.",
    placeholder: "Ex.: Quais projetos de QA ele já fez?",
    send: "Enviar",
    thinking: "Consultando a base…",
    suggestions: [
      "Que tipo de vaga o Lucas procura?",
      "Quais ferramentas de teste ele usa?",
      "Me mostra os projetos dele no GitHub",
      "O que ele gosta de fazer fora da tecnologia?",
    ],
    sources: "Links",
    notFound: "Fora da base",
    error: "Não consegui responder agora. Tente novamente em instantes.",
    disclaimer: "Respostas geradas por IA (Gemini) a partir de uma base revisada pelo Lucas.",
  },
  about: {
    title: "Sobre",
    body: [
      "Estou no 8º período de Sistemas de Informação na UFV – Campus Rio Paranaíba e sou trainee na InfoAlto, a empresa júnior do curso. Antes disso, me formei técnico em Metalurgia pelo IFMG e passei dois anos fazendo manutenção de computadores e atendendo clientes.",
      "Meu foco é QA: escrever bons casos de teste, reportar bugs de forma clara e automatizar o que se repete. Também curto desenvolvimento e estou aberto a outras áreas de tecnologia.",
      "Fora do código: filmes, discussões filosóficas, conversa com os amigos, games e futebol — jogo desde os 4 anos, disputo futsal universitário e torço pro Flamengo.",
    ],
  },
  experience: {
    title: "Trajetória",
    items: [
      { period: "Atual", role: "Trainee", org: "InfoAlto — Empresa Júnior de SI (UFV)", text: "Atuação na empresa júnior do curso de Sistemas de Informação." },
      { period: "2023 – 2027", role: "Bacharelado em Sistemas de Informação", org: "UFV – Campus Rio Paranaíba", text: "8º período. TCC: ParkFinder, assistência para encontrar vagas de estacionamento com crowdsensing e imagens de satélite." },
      { period: "2021 – 2023", role: "Auxiliar de Manutenção de Computadores", org: "Inforall Soluções em Informática", text: "Diagnóstico e reparo de hardware e software, montagem de notebooks e desktops, suporte e atendimento a clientes." },
      { period: "2022", role: "Técnico em Metalurgia", org: "IFMG", text: "Análise de dados experimentais, raciocínio lógico e padronização de processos." },
    ],
  },
  skills: {
    title: "Habilidades",
    groups: [
      { name: "QA & Testes", items: ["Casos e cenários de teste", "Testes funcionais e de regressão", "Testes exploratórios", "Bug reporting", "Valor limite", "Partição de equivalência"] },
      { name: "Automação & APIs", items: ["Playwright", "Postman", "REST / HTTP / JSON", "CI/CD", "JavaScript / TypeScript"] },
      { name: "Desenvolvimento", items: ["Python", "C", "Django REST Framework", "FastAPI", "HTML & CSS", "SQL / MySQL"] },
      { name: "Ferramentas", items: ["Git & GitHub", "Jira", "Docker", "UML", "Metodologias ágeis"] },
    ],
    languages: "Português nativo · Inglês B2",
  },
  projects: {
    title: "Projetos",
    subtitle: "Sincronizados automaticamente do GitHub.",
    collab: "Trabalho em grupo",
    view: "Ver repositório",
    noDescription: "Sem descrição — pergunte ao assistente.",
    all: "Ver tudo no GitHub",
  },
  contact: {
    title: "Vamos conversar?",
    body: "Estou buscando minha primeira oportunidade em tecnologia — QA é prioridade, mas estou aberto a outras áreas.",
  },
  footer: "Feito com Next.js, Gemini e testes automatizados.",
};

const en: typeof pt = {
  nav: { about: "About", experience: "Journey", skills: "Skills", projects: "Projects", contact: "Contact" },
  hero: {
    kicker: "Ouro Branco, Brazil · Information Systems · UFV",
    title: "Lucas Brasil Oliveira",
    role: "QA & Software Testing",
    lead: "A determined, big-dreaming Brazilian student starting a career in tech. I like understanding how things work — and breaking them on purpose to find bugs before users do.",
    status: "Looking for my first opportunity in tech",
    cta: "Get in touch",
  },
  chat: {
    title: "Ask anything about Lucas",
    subtitle: "AI assistant that only answers from verified information. If it doesn't know, it says so.",
    placeholder: "e.g. What QA projects has he done?",
    send: "Send",
    thinking: "Searching the knowledge base…",
    suggestions: [
      "What kind of role is Lucas looking for?",
      "Which testing tools does he use?",
      "Show me his GitHub projects",
      "What does he enjoy outside tech?",
    ],
    sources: "Links",
    notFound: "Not in knowledge base",
    error: "Couldn't answer right now. Please try again shortly.",
    disclaimer: "AI-generated answers (Gemini) based on a knowledge base reviewed by Lucas.",
  },
  about: {
    title: "About",
    body: [
      "I'm in the 8th semester of Information Systems at UFV (Rio Paranaíba campus) and a trainee at InfoAlto, the program's student-run company. Before that, I earned a technical degree in Metallurgy from IFMG and spent two years repairing computers and helping customers.",
      "My focus is QA: writing good test cases, reporting bugs clearly and automating what repeats. I also enjoy development and I'm open to other areas in tech.",
      "Away from code: movies, philosophical discussions, hanging out with friends, games and football — I've played since I was 4, compete in university futsal and support Flamengo.",
    ],
  },
  experience: {
    title: "Journey",
    items: [
      { period: "Current", role: "Trainee", org: "InfoAlto — Information Systems Junior Enterprise (UFV)", text: "Working at the program's student-run company." },
      { period: "2023 – 2027", role: "B.Sc. in Information Systems", org: "UFV – Rio Paranaíba campus", text: "8th semester. Thesis: ParkFinder, helping drivers find parking spots using crowdsensing and satellite imagery." },
      { period: "2021 – 2023", role: "Computer Maintenance Assistant", org: "Inforall Soluções em Informática", text: "Hardware and software diagnostics and repair, laptop and desktop assembly, customer support." },
      { period: "2022", role: "Technical Degree in Metallurgy", org: "IFMG", text: "Experimental data analysis, logical reasoning and process standardization." },
    ],
  },
  skills: {
    title: "Skills",
    groups: [
      { name: "QA & Testing", items: ["Test cases & scenarios", "Functional & regression testing", "Exploratory testing", "Bug reporting", "Boundary value analysis", "Equivalence partitioning"] },
      { name: "Automation & APIs", items: ["Playwright", "Postman", "REST / HTTP / JSON", "CI/CD", "JavaScript / TypeScript"] },
      { name: "Development", items: ["Python", "C", "Django REST Framework", "FastAPI", "HTML & CSS", "SQL / MySQL"] },
      { name: "Tools", items: ["Git & GitHub", "Jira", "Docker", "UML", "Agile"] },
    ],
    languages: "Portuguese (native) · English B2",
  },
  projects: {
    title: "Projects",
    subtitle: "Automatically synced from GitHub.",
    collab: "Group project",
    view: "View repository",
    noDescription: "No description — ask the assistant.",
    all: "See everything on GitHub",
  },
  contact: {
    title: "Let's talk?",
    body: "I'm looking for my first opportunity in tech — QA is my priority, but I'm open to other areas.",
  },
  footer: "Built with Next.js, Gemini and automated tests.",
};

export const dict: Record<Lang, typeof pt> = { pt, en };
export type Dict = typeof pt;
