import { NextRequest, NextResponse } from "next/server";
const db_conn_str = process.env.DB_CONN_STR;

export async function POST(req: NextRequest) {
    try {
        const url = `${db_conn_str}/competitions/leader`
        const body = await req.json();
        console.log("body", JSON.stringify(body));
        const response = await fetch(
            url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ message: errorData.message }, { status: response.status });
        }

        const response_data = await response.json();
        return NextResponse.json({ response_data });
    } catch (error) {
        console.error("Error creating classic leaderboard:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}