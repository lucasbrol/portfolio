import repos from "../../data/repos.json";
import { Portfolio } from "@/components/Portfolio";
import type { RepoSummary } from "@/lib/types";

export default function Home() {
  return <Portfolio repos={repos as RepoSummary[]} />;
}
