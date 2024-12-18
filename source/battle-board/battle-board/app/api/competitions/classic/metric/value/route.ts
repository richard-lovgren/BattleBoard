import { NextRequest, NextResponse } from "next/server";
const db_conn_str = process.env.DB_CONN_STR;

export async function PUT(req: NextRequest) {
    try {
        const url = `${db_conn_str}/competitions/classic/metric/value`
        const body = await req.json();
        console.log("body", JSON.stringify(body));
        const response = await fetch(
            url,
            {
                method: "PUT",
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
        console.error("Error creating/updating metric value:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const competition_id = searchParams.get("competitionId");
        const user_name = searchParams.get("userName");
        const metric_name = searchParams.get("metricName");
        const url = `${db_conn_str}/competitions/classic/${competition_id}/${user_name}/${metric_name}`;
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