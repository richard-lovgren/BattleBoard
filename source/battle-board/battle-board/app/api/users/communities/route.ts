import { NextRequest, NextResponse } from "next/server";
const db_conn_str = process.env.DB_CONN_STR;
console.log("DB Connection String: ", db_conn_str);
console.log("HELLO");

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const url = `${db_conn_str}/user/${userId}/communities`;
    console.log("URL: ", url);
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
    console.error("Error fetching competition:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
