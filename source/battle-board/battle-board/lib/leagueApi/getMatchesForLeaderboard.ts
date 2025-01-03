import { FilteredMatchData } from "@/models/interfaces/leagueMatchData";

async function getMatchesForLeaderboard(puuid: string, targetMatches: number, ...summonerIDs: string[]): Promise<FilteredMatchData[]> {
    const matches: FilteredMatchData[] = [];
    let totalMatches = 0;
    const matchSet = new Set<string>();
    const MAX_MATCHES = 250;
    try {
        let response = await fetch(`https://api.example.com/matches?puuid=${puuid}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        let data: FilteredMatchData[] = await response.json();

        while (matches.length < targetMatches && totalMatches < MAX_MATCHES && data.length > 0) {

            for (const match of data) {
                if (!matchSet.has(match.matchId) &&
                    (summonerIDs.length === 0 || match.participants.some(p => summonerIDs.includes(p.summonerId)))) {
                    matches.push(match);
                    matchSet.add(match.matchId);
                }

                if (matches.length === targetMatches) {
                    break;
                }
            }

            totalMatches += data.length;

            if (matches.length === targetMatches || totalMatches >= MAX_MATCHES) {
                break;
            }
            response = await fetch(`https://api.example.com/matches?puuid=${puuid}&start=${totalMatches}`);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            data = await response.json();
        }

        return matches;
    } catch (error) {
        console.error('Fetch failed:', error);
        return [];
    }
}

export default getMatchesForLeaderboard;