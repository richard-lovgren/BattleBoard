import CompetitionData from "@/models/interfaces/CompetitionData";
import baseUrl from "@/lib/baseUrl";

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