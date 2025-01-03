import { NextRequest, NextResponse } from "next/server";
import { RawMatchData, FilteredMatchData, FilteredParticipant } from "@/models/interfaces/leagueMatchData";

function filterMatchData(rawData: RawMatchData): FilteredMatchData {
    const { metadata, info } = rawData;
    const matchId = metadata.matchId;

    const filteredParticipants: FilteredParticipant[] = info.participants.map((p: any) => {
        return {
            summonerName: p.summonerName,
            summonerId: p.summonerId,
            championName: p.championName,
            championId: p.championId,
            teamId: p.teamId,
            kills: p.kills,
            deaths: p.deaths,
            assists: p.assists,
            totalDamageDealtToChampions: p.totalDamageDealtToChampions,
            totalDamageTaken: p.totalDamageTaken,
            goldEarned: p.goldEarned,
            items: [
                p.item0,
                p.item1,
                p.item2,
                p.item3,
                p.item4,
                p.item5,
            ].filter((item: number) => item !== 0),
            summonerSpells: [p.summoner1Id, p.summoner2Id],
            win: p.win,
        };
    });

    return {
        matchId,
        participants: filteredParticipants,
        startTime: info.gameStartTimestamp,
    };
}
//Gets an array of match data for a given user puuid.
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const puuid = searchParams.get("puuid");
    const start = searchParams.get("start");

    if (!puuid) {
        return NextResponse.json({ message: "Missing puuid" }, { status: 400 });
    }

    try {
        const riotApiKey = process.env.RIOT_API_KEY;
        if (!riotApiKey) return NextResponse.json({ message: "Missing Riot API key" }, { status: 500 });
        const response = await fetch(
            `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?start=${start || ""}`,
            {
                headers: {
                    "X-Riot-Token": process.env.RIOT_API_KEY!,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ message: errorData.message }, { status: response.status });
        }

        const data = await response.json();

        //Cycle through the match ids and get the match data
        const matches = [];
        for (const matchId of data) {
            const matchResponse = await fetch(
                `https://europe.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(matchId)}`,
                {
                    headers: {
                        "X-Riot-Token": riotApiKey!,
                    },
                }
            );

            if (!matchResponse.ok) {
                const errorData = await matchResponse.json();
                return NextResponse.json({ message: errorData.message }, { status: matchResponse.status });
            }

            const rawData = await matchResponse.json();
            const matchData = filterMatchData(rawData);
            matches.push(matchData);
        }
        return NextResponse.json(matches);
    } catch (error) {
        console.error("Error fetching PUUID:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
