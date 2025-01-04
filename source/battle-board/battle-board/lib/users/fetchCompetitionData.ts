import CompetitionData from "@/models/interfaces/CompetitionData";
import baseUrl from "@/lib/baseUrl";

export async function fetchCompetitionData(
  competitionId: string
): Promise<CompetitionData> {
  const response = await fetch(
    `${baseUrl}/api/competitions?competitionId=${competitionId}`
  );
  return response.json();
}
