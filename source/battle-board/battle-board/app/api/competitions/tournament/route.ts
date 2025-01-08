import { NextRequest, NextResponse } from "next/server";
const db_conn_str = process.env.DB_CONN_STR;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const competitionId = searchParams.get("competitionId");
    try {
        const url = `${db_conn_str}/competition/${competitionId}/tournament`
        const response = await fetch(
            url,
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
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching tournament tree:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        // Parse query parameters

        // Build the target URL
        const url = `${db_conn_str}/competition/tournament`;

        // Parse and log the request body
        const body = await req.json();
        console.log("Tournament POST request body:", body);

        // Make the POST request to the backend
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        // Check if the response is OK
        if (!response.ok) {
            // Handle error response
            const errorText = await response.text();
            console.error("Tournament POST error response:", errorText);
            return NextResponse.json({ message: "Error creating tournament tree", details: errorText }, { status: 500 });
        }

        // Handle successful response
        return NextResponse.json({ message: "Tournament tree created successfully" });
    } catch (error) {
        // Catch and handle unexpected errors
        console.error("Error creating tournament tree:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}
