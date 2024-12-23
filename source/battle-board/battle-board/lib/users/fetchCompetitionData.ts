import CompetitionData from "@/models/interfaces/CompetitionData";

let baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export async function fetchCompetitionData(
  competitionId: string
): Promise<CompetitionData> {
  const response = await fetch(
    `${baseUrl}/api/competitions?competitionId=${competitionId}`
  );
  return response.json();
}
