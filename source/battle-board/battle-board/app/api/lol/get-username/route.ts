import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const puuid = searchParams.get("puuid");

    if (!puuid) {
        return NextResponse.json({ message: "Missing puuid" }, { status: 400 });
    }

    try {
        const riotApiKey = process.env.RIOT_API_KEY;
        const response = await fetch(
            `https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/${encodeURIComponent(puuid)}`,
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
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching PUUID:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}