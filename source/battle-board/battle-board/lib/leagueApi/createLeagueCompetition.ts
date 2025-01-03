import getMatches from "@/lib/leagueApi/getMatches";
import { FilteredMatchData } from "@/models/interfaces/leagueMatchData";
import LeaderboardDTO from "@/models/dtos/leaderboard-dto";

async function createLeagueCompetition(puuid: string, targetMatches: number, competition_id: string, ...otherPUUIDs: string[]) {
    const matches = await getMatches(puuid, targetMatches, ...otherPUUIDs);
    for (const match of matches) {
        addMatchToCompetition(match);
    }
}

function addMatchToCompetition(match: FilteredMatchData) {
    throw new Error("Function not implemented.");
}
