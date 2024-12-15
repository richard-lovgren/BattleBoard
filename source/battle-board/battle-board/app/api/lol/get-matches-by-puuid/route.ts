import { NextRequest, NextResponse } from "next/server";
//Gets an array of match data for a given user puuid. Metadata as described in the Riot API documentation: https://developer.riotgames.com/apis#match-v5/GET_getMatch
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const puuid = searchParams.get("puuid");

    if (!puuid) {
        return NextResponse.json({ message: "Missing puuid" }, { status: 400 });
    }

    try {
        const riotApiKey = process.env.RIOT_API_KEY;
        if (!riotApiKey) return NextResponse.json({ message: "Missing Riot API key" }, { status: 500 });
        const response = await fetch(
            `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids`,
            {
                headers: {
                    "X-Riot-Token": riotApiKey!,
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

            const matchData = await matchResponse.json();
            matches.push(matchData);
        }
        return NextResponse.json(matches);
    } catch (error) {
        console.error("Error fetching PUUID:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}