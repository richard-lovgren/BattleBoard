import baseUrl from "@/lib/baseUrl";

async function fetchCompetitionData(
    competitionId: string
): Promise<string[] | null> {
    const response = await fetch(
        `${baseUrl}/api/competitions/users?competitionId=${competitionId}`
    );
    if (!response.ok) return null;
    return response.json();
}

export default fetchCompetitionData;