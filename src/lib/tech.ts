/**
 * Tecnologias que o Lucas já usou em projetos (as mesmas do README do perfil
 * no GitHub). "Usou" não quer dizer "domina": cada item diz onde foi usado.
 *
 * Os logos ficam em public/tech/<id>.svg. Para baixar de novo ou incluir um
 * novo, adicione o item aqui e rode `npm run icons`.
 *   devicon (MIT): https://devicon.dev · simple-icons (CC0): https://simpleicons.org
 */

const DEVICON = (name: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-original.svg`;
const SIMPLE = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

export interface Tech {
  id: string;
  name: string;
  /** URL de origem do logo (usada só pelo script de download). */
  src: string;
  /** Projetos em que foi usada. */
  usedIn: string[];
}

export interface TechGroup {
  id: string;
  name: { pt: string; en: string };
  items: Tech[];
}

const PF = "ParkFinder";
const AP = "AlphaPulse";
const LK = "Leukemia Classification";
const PO = "Portfolio";
const EH = "EventHub QA";
const LB = "LabDeProg";
const AG = "Agenda UFV";
const RF = "RideFleet";

export const TECH_GROUPS: TechGroup[] = [
  {
    id: "qa",
    name: { pt: "QA & Testes", en: "QA & Testing" },
    items: [
      { id: "jira", name: "Jira", src: DEVICON("jira"), usedIn: [EH] },
      { id: "postman", name: "Postman", src: DEVICON("postman"), usedIn: [] },
      { id: "playwright", name: "Playwright", src: DEVICON("playwright"), usedIn: [PO] },
      { id: "pytest", name: "Pytest", src: DEVICON("pytest"), usedIn: [PF, LB, RF] },
      { id: "vitest", name: "Vitest", src: DEVICON("vitest"), usedIn: [PO] },
      { id: "swagger", name: "Swagger", src: DEVICON("swagger"), usedIn: [PF, RF] },
    ],
  },
  {
    id: "ai",
    name: { pt: "IA & Machine Learning", en: "AI & Machine Learning" },
    items: [
      { id: "pytorch", name: "PyTorch", src: DEVICON("pytorch"), usedIn: [AP, LK] },
      { id: "huggingface", name: "Hugging Face", src: SIMPLE("huggingface"), usedIn: [AP] },
      { id: "scikitlearn", name: "scikit-learn", src: DEVICON("scikitlearn"), usedIn: [AP, LK] },
      { id: "pandas", name: "pandas", src: SIMPLE("pandas"), usedIn: [AP, LK] },
      { id: "numpy", name: "NumPy", src: DEVICON("numpy"), usedIn: [AP, LK] },
      { id: "matplotlib", name: "Matplotlib", src: DEVICON("matplotlib"), usedIn: [AP, LK] },
      { id: "jupyter", name: "Jupyter", src: DEVICON("jupyter"), usedIn: [LK] },
      { id: "streamlit", name: "Streamlit", src: DEVICON("streamlit"), usedIn: [AP] },
      { id: "gemini", name: "Gemini", src: SIMPLE("googlegemini"), usedIn: [PO] },
      { id: "kaggle", name: "Kaggle", src: DEVICON("kaggle"), usedIn: [LK] },
    ],
  },
  {
    id: "backend",
    name: { pt: "Back-end & Dados", en: "Back-end & Data" },
    items: [
      { id: "fastapi", name: "FastAPI", src: DEVICON("fastapi"), usedIn: [PF, RF] },
      { id: "pydantic", name: "Pydantic", src: SIMPLE("pydantic"), usedIn: [PF, RF] },
      { id: "sqlalchemy", name: "SQLAlchemy", src: SIMPLE("sqlalchemy"), usedIn: [PF, RF] },
      { id: "postgresql", name: "PostgreSQL + PostGIS", src: DEVICON("postgresql"), usedIn: [PF, RF] },
      { id: "jwt", name: "JWT", src: SIMPLE("jsonwebtokens"), usedIn: [PF] },
      { id: "sqlite", name: "SQLite", src: DEVICON("sqlite"), usedIn: [AP, LB, RF] },
      { id: "mysql", name: "MySQL", src: SIMPLE("mysql"), usedIn: [LB] },
      { id: "django", name: "Django", src: SIMPLE("django"), usedIn: [LB] },
      { id: "nodejs", name: "Node.js", src: DEVICON("nodejs"), usedIn: [] },
      { id: "redis", name: "Redis", src: DEVICON("redis"), usedIn: [RF] },
    ],
  },
  {
    id: "languages",
    name: { pt: "Linguagens", en: "Languages" },
    items: [
      { id: "python", name: "Python", src: DEVICON("python"), usedIn: [PF, AP, LK, LB, RF] },
      { id: "typescript", name: "TypeScript", src: DEVICON("typescript"), usedIn: [PF, PO] },
      { id: "javascript", name: "JavaScript", src: DEVICON("javascript"), usedIn: [AG, LB, RF] },
      { id: "c", name: "C", src: DEVICON("c"), usedIn: [] },
      { id: "php", name: "PHP", src: DEVICON("php"), usedIn: [AG] },
      { id: "html5", name: "HTML5", src: DEVICON("html5"), usedIn: [AG, LB] },
      { id: "css3", name: "CSS3", src: DEVICON("css3"), usedIn: [AG, LB] },
    ],
  },
  {
    id: "mobile",
    name: { pt: "Mobile & Web", en: "Mobile & Web" },
    items: [
      { id: "reactnative", name: "React Native", src: DEVICON("react"), usedIn: [PF] },
      { id: "expo", name: "Expo", src: SIMPLE("expo"), usedIn: [PF] },
      { id: "openstreetmap", name: "OpenStreetMap", src: SIMPLE("openstreetmap"), usedIn: [PF] },
      { id: "react", name: "React", src: DEVICON("react"), usedIn: [PO, RF] },
      { id: "nextjs", name: "Next.js", src: SIMPLE("nextdotjs"), usedIn: [PO] },
    ],
  },
  {
    id: "devops",
    name: { pt: "DevOps & Observabilidade", en: "DevOps & Observability" },
    items: [
      { id: "docker", name: "Docker", src: DEVICON("docker"), usedIn: [PF, LB, RF] },
      { id: "nginx", name: "Nginx", src: DEVICON("nginx"), usedIn: [RF] },
      { id: "prometheus", name: "Prometheus", src: DEVICON("prometheus"), usedIn: [RF] },
      { id: "grafana", name: "Grafana", src: DEVICON("grafana"), usedIn: [RF] },
      { id: "git", name: "Git", src: DEVICON("git"), usedIn: [] },
      { id: "github", name: "GitHub", src: SIMPLE("github"), usedIn: [] },
      { id: "githubactions", name: "GitHub Actions", src: SIMPLE("githubactions"), usedIn: [PO] },
    ],
  },
];
