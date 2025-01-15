import baseUrl from "@/lib/baseUrl";
import RequestJoinCompetitionDto from "@/models/dtos/request-join-competition-dto";

export async function addToJoinQueue(competitionId: string, userName: string): Promise<string> {
    const body = { competition_id: competitionId, user_name: userName } as RequestJoinCompetitionDto;
    const response = await fetch(`${baseUrl}/api/competitions/join-requests`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add user to join queue: ${errorData.message}`);
    }

    const data = await response.json();
    return data.response_data.id; // The ID of the created join request.
}

export async function removeFromJoinQueue(
    competitionId: string,
    userName: string,
    accept: boolean
): Promise<string> {
    const response = await fetch(`${baseUrl}/api/competitions/join-requests`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ competition_id: competitionId, user_name: userName, accept: accept }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update join request: ${errorData.message}`);
    }

    const data = await response.json();
    return data.response_data.message;
}

export async function getJoinQueue(competitionId: string): Promise<string[]> {
    const response = await fetch(`${baseUrl}/api/competitions/${competitionId}/join-requests`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
            return []; // No join requests found, return an empty array.
        }
        throw new Error(`Failed to fetch join queue: ${errorData.message}`);
    }

    const data = await response.json();
    return data.map((item: { user_name: string }) => item.user_name); // Extract usernames from the response.
}
