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
            const contentType = response.headers.get("Content-Type") || "";

            if (contentType.includes("application/json")) {
                // Attempt to parse the error response as JSON
                const errorData = await response.json();
                console.error("Error response from backend:", errorData);
                return NextResponse.json(
                    { message: errorData.message || "An error occurred" },
                    { status: response.status }
                );
            } else {
                // Handle non-JSON error response
                const errorText = await response.text();
                console.error("Non-JSON error response from backend:", errorText);
                return NextResponse.json(
                    { message: "Unexpected error from backend", details: errorText },
                    { status: response.status }
                );
            }
        }

        // Handle successful response
        const contentType = response.headers.get("Content-Type") || "";
        if (contentType.includes("application/json")) {
            // Parse and return JSON response
            const response_data = await response.json();
            console.log("Tournament POST response data:", response_data);
            return NextResponse.json({ response_data });
        } else {
            // Handle non-JSON success response
            const responseText = await response.text();
            console.warn("Tournament POST Unexpected non-JSON success response:", responseText);
            return NextResponse.json(
                { message: "Unexpected response format", details: responseText },
                { status: 500 }
            );
        }
    } catch (error) {
        // Catch and handle unexpected errors
        console.error("Error creating tournament tree:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}
