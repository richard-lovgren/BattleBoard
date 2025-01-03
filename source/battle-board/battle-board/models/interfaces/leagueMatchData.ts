
export type RawMatchData = {
    metadata: {
        matchId: string;
        participants: string[];
        [key: string]: any;
    };
    info: {
        participants: any[];
        [key: string]: any;
    };
};

export type FilteredParticipant = {
    summonerName: string;
    summonerId: string;
    puuid: string;
    championName: string;
    championId: number;
    teamId: number;
    kills: number;
    deaths: number;
    assists: number;
    totalDamageDealtToChampions: number;
    totalDamageTaken: number;
    goldEarned: number;
    items: number[];
    summonerSpells: number[];
    win: boolean;
};

export type FilteredMatchData = {
    matchId: string;
    participants: FilteredParticipant[];
    startTime: number;
};

//Metrics that are used for Leaderboard in DB
const lolLeaderboardMetricsDTO: string[] = ["Name", "Champion", "Kills", "Deaths", "Assists", "Damage Dealt", "Gold Earned", "Win"]