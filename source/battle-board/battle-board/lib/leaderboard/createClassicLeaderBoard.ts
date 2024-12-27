import LeaderboardDTO from "@/models/dtos/leaderboard-dto";
import baseUrl from "@/lib/baseUrl";

async function createClassicLeaderboard(competitionId: string) {
    const leaderboardDto: LeaderboardDTO = {
        competition_id: competitionId,
    };

    const response = await fetch(`${baseUrl}/api/competitions/classic/leaderboard`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(leaderboardDto),
    });

    if (!response.ok) {
        console.error("Failed to create leaderboard");
        return null;
    }

    return await response.json();
}
export default createClassicLeaderboard;