import { NextRequest, NextResponse } from "next/server";

const db_conn_str = process.env.DB_CONN_STR;

export async function GET(req: NextRequest, { params }: { params: { competition_id: string } }) {
    const competition_id = params.competition_id;

    if (!competition_id) {
        return NextResponse.json({ message: "Competition ID is required" }, { status: 400 });
    }

    try {
        const url = `${db_conn_str}/competitions/${competition_id}/join-requests`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ message: errorData.message }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching join requests:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
