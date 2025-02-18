import { NextRequest, NextResponse } from "next/server";
const db_conn_str = process.env.DB_CONN_STR;

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const competitionId = searchParams.get("competitionId");
        const url = `${db_conn_str}/competitions/${competitionId}`;
        const response = await fetch(
            url,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if(!response.ok) {
            const errorData = response;
            return NextResponse.json({ message: errorData }, { status: response.status});
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching competition:", error);
        return NextResponse.json({ message: "Internal server error"}, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const url = `${db_conn_str}/competitions`
        const formData = await req.formData();

        const response = await fetch(
            url,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ message: errorData.message }, { status: response.status });
        }

        const response_data = await response.json();
        return NextResponse.json({ id: response_data });
    } catch (error) {
        console.error("Error creating competition:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}