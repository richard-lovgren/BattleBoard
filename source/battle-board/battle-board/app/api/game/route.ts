import { NextRequest, NextResponse } from "next/server";
const db_conn_str = process.env.DB_CONN_STR;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId");
    const url = `${db_conn_str}/games/${gameId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = response;
      return NextResponse.json(
        { message: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching game : ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}