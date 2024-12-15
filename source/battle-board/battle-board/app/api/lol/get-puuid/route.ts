import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const tagline = searchParams.get("tagline");

    if (!username || !tagline) {
        return NextResponse.json({ message: "Missing username or tagline" }, { status: 400 });
    }

    try {
        const riotApiKey = process.env.RIOT_API_KEY;
        if (!riotApiKey) return NextResponse.json({ message: "Missing Riot API key" }, { status: 500 });
        const response = await fetch(
            `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
                username
            )}/${encodeURIComponent(tagline)}`,
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
        return NextResponse.json({ puuid: data.puuid });
    } catch (error) {
        console.error("Error fetching PUUID:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}