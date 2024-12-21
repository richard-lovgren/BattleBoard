import { Leaderboard } from "@/models/leaderboard";

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
async function fetchClassicLeaderBoard(competitionId: string): Promise<Leaderboard | null> {
    const response = await fetch(
        `${baseUrl}/api/competitions/leaderboard?competitionId=${competitionId}`
    );
    if (!response.ok) return null;
    return response.json();
}
export default fetchClassicLeaderBoard;