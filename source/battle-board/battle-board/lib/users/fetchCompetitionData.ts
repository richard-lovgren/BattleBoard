import CompetitionData from "@/models/interfaces/CompetitionData";

export async function fetchCompetitionData(
  competitionId: string
): Promise<CompetitionData> {
  const response = await fetch(
    `${baseUrl}/api/competitions?competitionId=${competitionId}`
  );
  return response.json();
}
