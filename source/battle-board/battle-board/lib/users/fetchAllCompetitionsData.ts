import CompetitionData from "@/models/interfaces/CompetitionData";

import { fetchCompetitionData } from "./fetchCompetitionData";

export async function fetchAllCompetitionsData(
  competitionIds: string[]
): Promise<CompetitionData[]> {
  const competitionsData: CompetitionData[] = [];
  for (const competitionId of competitionIds) {
    const competitionData = await fetchCompetitionData(competitionId);
    competitionsData.push(competitionData);
  }
  return competitionsData;
}
