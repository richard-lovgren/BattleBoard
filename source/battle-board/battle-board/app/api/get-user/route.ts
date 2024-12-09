import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const db_conn_str = process.env.DB_CONN_STR;

        const response = await fetch(
            `${db_conn_str}/users/${userId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorData = response;
            return NextResponse.json({ message: errorData }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ puuid: data.puuid });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}