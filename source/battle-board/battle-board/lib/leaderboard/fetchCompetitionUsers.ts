const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
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