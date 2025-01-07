import baseUrl from "@/lib/baseUrl";
import User from "@/models/interfaces/user";

async function fetchCompetitionData(
    competitionId: string
): Promise<string[] | null> {
    const response = await fetch(
        `${baseUrl}/api/competitions/users?competitionId=${competitionId}`
    );
    if (!response.ok) return null;
    const res: User[] = await response.json();
    return res.map((user) => user.user_name);
}

export default fetchCompetitionData;