const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
async function fetchClassicLeaderBoard(competitionId: string) {
    const response = await fetch(
        `${baseUrl}/api/competitions/classic/leaderboard?competitionId=${competitionId}`
    );
    if (!response.ok) return null;
    return response.json();
}
export default fetchClassicLeaderBoard;