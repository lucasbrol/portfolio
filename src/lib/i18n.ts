import type { Lang } from "./types";

export const LINKS = {
  email: "lucasbrasil7@outlook.com",
  linkedin: "https://www.linkedin.com/in/lucasbrasil7/",
  github: "https://github.com/lucasbrol",
  instagram: "https://www.instagram.com/lucasbr_ol/",
};

const pt = {
  nav: { about: "Sobre", experience: "Trajetória", skills: "Habilidades", projects: "Projetos", contact: "Contato" },
  hero: {
    kicker: "Ouro Branco, MG · Sistemas de Informação · UFV",
    title: "Lucas Brasil Oliveira",
    role: "QA & Testes de Software",
    lead: "Estudante brasileiro determinado e sonhador, começando a carreira em tecnologia. Gosto de entender como as coisas funcionam — e de quebrá-las de propósito para achar bugs antes do usuário. Hoje construo o ParkFinder, meu TCC, e venho colocando a mão na massa com IA.",
    status: "Buscando a primeira oportunidade em tecnologia",
    cta: "Falar comigo",
  },
  chat: {
    title: "Faça uma pergunta sobre o Lucas",
    subtitle: "Assistente com IA que responde só com informações verificadas. Se não souber, ele avisa.",
    placeholder: "Ex.: Do que se trata o AlphaPulse?",
    send: "Enviar",
    thinking: "Consultando a base…",
    suggestions: [
      "O que é o ParkFinder?",
      "O que o Lucas já fez com IA?",
      "Que tipo de vaga ele procura?",
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
      "No TCC, estou construindo o ParkFinder: um app (React Native + FastAPI + PostGIS) que mostra a chance de achar vaga de estacionamento em cada região da cidade, alimentado pelos próprios motoristas. Na graduação também mergulhei em IA: fine-tuning de um modelo de linguagem para notícias financeiras (AlphaPulse) e redes convolucionais para identificar leucemia em imagens de microscópio — sempre com o olhar de QA de checar se o resultado se sustenta.",
      "Fora do código: amo viajar, e curto filmes, discussões filosóficas, conversa com os amigos, games e futebol — jogo desde os 4 anos, disputo futsal universitário e torço pro Flamengo.",
    ],
  },
  experience: {
    title: "Trajetória",
    items: [
      { period: "Atual", role: "Trainee", org: "InfoAlto — Empresa Júnior de SI (UFV)", text: "Atuação na empresa júnior do curso de Sistemas de Informação." },
      { period: "2023 – 2027", role: "Bacharelado em Sistemas de Informação", org: "UFV – Campus Rio Paranaíba", text: "8º período. TCC: ParkFinder, app mobile que mostra a chance de encontrar vaga de estacionamento por região, com dados colaborativos (crowdsensing)." },
      { period: "2021 – 2023", role: "Auxiliar de Manutenção de Computadores", org: "Inforall Soluções em Informática", text: "Diagnóstico e reparo de hardware e software, montagem de notebooks e desktops, suporte e atendimento a clientes." },
      { period: "2022", role: "Técnico em Metalurgia", org: "IFMG", text: "Análise de dados experimentais, raciocínio lógico e padronização de processos." },
    ],
  },
  skills: {
    title: "Habilidades",
    note: "Ferramentas que já usei em projetos — isso não quer dizer que domino todas. Algumas uso sempre, outras usei em um único trabalho. Passe o mouse (ou toque) em uma ferramenta para ver onde usei.",
    usedIn: "Usado em",
    usedInNone: "Usado em estudos e na graduação",
    practicesTitle: "Práticas",
    practices: ["Casos e cenários de teste", "Testes funcionais, negativos e de regressão", "Testes exploratórios", "Bug reporting", "Valor limite e partição de equivalência", "REST / HTTP / JSON", "Transfer learning e fine-tuning", "Avaliação de modelos sem vazamento de dados", "RAG", "UML e metodologias ágeis"],
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
    body: "Estou buscando minha primeira oportunidade em tecnologia — QA é prioridade, mas estou aberto a outras áreas. Posso começar já, com cerca de 40 horas semanais, em home office (a partir de julho de 2027, qualquer modalidade).",
  },
  footer: "Feito com Next.js, Gemini e testes automatizados.",
};

const en: typeof pt = {
  nav: { about: "About", experience: "Journey", skills: "Skills", projects: "Projects", contact: "Contact" },
  hero: {
    kicker: "Ouro Branco, Brazil · Information Systems · UFV",
    title: "Lucas Brasil Oliveira",
    role: "QA & Software Testing",
    lead: "A determined, big-dreaming Brazilian student starting a career in tech. I like understanding how things work — and breaking them on purpose to find bugs before users do. Right now I'm building ParkFinder, my thesis, and getting hands-on with AI.",
    status: "Looking for my first opportunity in tech",
    cta: "Get in touch",
  },
  chat: {
    title: "Ask anything about Lucas",
    subtitle: "AI assistant that only answers from verified information. If it doesn't know, it says so.",
    placeholder: "e.g. What is AlphaPulse about?",
    send: "Send",
    thinking: "Searching the knowledge base…",
    suggestions: [
      "What is ParkFinder?",
      "What has Lucas done with AI?",
      "What kind of role is he looking for?",
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
      "For my thesis I'm building ParkFinder: an app (React Native + FastAPI + PostGIS) that shows the chance of finding a parking spot in each area of the city, powered by drivers' own reports. At university I also dove into AI: fine-tuning a language model on financial news (AlphaPulse) and CNNs that spot leukemia in microscope images — always with a QA eye on whether the results really hold up.",
      "Away from code: I love traveling, and I enjoy movies, philosophical discussions, hanging out with friends, games and football — I've played since I was 4, compete in university futsal and support Flamengo.",
    ],
  },
  experience: {
    title: "Journey",
    items: [
      { period: "Current", role: "Trainee", org: "InfoAlto — Information Systems Junior Enterprise (UFV)", text: "Working at the program's student-run company." },
      { period: "2023 – 2027", role: "B.Sc. in Information Systems", org: "UFV – Rio Paranaíba campus", text: "8th semester. Thesis: ParkFinder, a mobile app that shows the chance of finding a parking spot in each area, using crowdsourced reports (crowdsensing)." },
      { period: "2021 – 2023", role: "Computer Maintenance Assistant", org: "Inforall Soluções em Informática", text: "Hardware and software diagnostics and repair, laptop and desktop assembly, customer support." },
      { period: "2022", role: "Technical Degree in Metallurgy", org: "IFMG", text: "Experimental data analysis, logical reasoning and process standardization." },
    ],
  },
  skills: {
    title: "Skills",
    note: "Tools I've used in projects — that doesn't mean I've mastered all of them. Some I use all the time, others I used in a single project. Hover (or tap) a tool to see where I used it.",
    usedIn: "Used in",
    usedInNone: "Used in coursework and self-study",
    practicesTitle: "Practices",
    practices: ["Test cases & scenarios", "Functional, negative & regression testing", "Exploratory testing", "Bug reporting", "Boundary values & equivalence partitioning", "REST / HTTP / JSON", "Transfer learning & fine-tuning", "Leak-free model evaluation", "RAG", "UML & Agile"],
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
    body: "I'm looking for my first opportunity in tech — QA is my priority, but I'm open to other areas. I can start right away, about 40 hours a week, remote (from July 2027 on, any work arrangement).",
  },
  footer: "Built with Next.js, Gemini and automated tests.",
};

export const dict: Record<Lang, typeof pt> = { pt, en };
export type Dict = typeof pt;
