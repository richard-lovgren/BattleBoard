import CompetitionData from "@/models/interfaces/CompetitionData";
const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
async function fetchCompetitionData(
    competitionId: string
): Promise<CompetitionData | null> {
    const response = await fetch(
        `${baseUrl}/api/competitions?competitionId=${competitionId}`
    );
    if (!response.ok) return null;
    return response.json();
}

export default fetchCompetitionData;