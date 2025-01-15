import { NextRequest, NextResponse } from "next/server";

const db_conn_str = process.env.DB_CONN_STR;

export async function POST(req: NextRequest) {
    try {
        const url = `${db_conn_str}/competitions/join-requests`;
        const body = await req.json();

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ message: errorData.message }, { status: response.status });
        }

        const response_data = await response.json();
        return NextResponse.json({ response_data });
    } catch (error) {
        console.error("Error processing POST request:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const url = `${db_conn_str}/competitions/join-requests`;
        const body = await req.json();

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ message: errorData.message }, { status: response.status });
        }

        const response_data = await response.json();
        return NextResponse.json({ response_data });
    } catch (error) {
        console.error("Error processing PUT request:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const competition_id = searchParams.get("competition_id");

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
