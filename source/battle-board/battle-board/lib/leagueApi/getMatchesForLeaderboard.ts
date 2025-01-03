import { FilteredMatchData } from "@/models/interfaces/leagueMatchData";
import baseUrl from "@/lib/baseUrl";

async function getMatchesForLeaderboard(puuid: string, targetMatches: number, ...otherPUUIDs: string[]): Promise<FilteredMatchData[]> {
    const matches: FilteredMatchData[] = [];
    let totalMatches = 0;
    const matchSet = new Set<string>();
    const MAX_MATCHES = 250;
    try {
        let response = await fetch(`${baseUrl}/lol/get-matches-by-puuid?puuid=${puuid}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        let data: FilteredMatchData[] = await response.json();

        while (matches.length < targetMatches && totalMatches < MAX_MATCHES && data.length > 0) {

            for (const match of data) {
                if (!matchSet.has(match.matchId) &&
                    (otherPUUIDs.length === 0 || match.participants.some(p => otherPUUIDs.includes(p.puuid)))) {
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
            response = await fetch(`${baseUrl}/lol/get-matches-by-puuid?puuid=${puuid}&start=${totalMatches}`);
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