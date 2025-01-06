import getMatches from "@/lib/leagueApi/getMatches";
import { FilteredMatchData, usernamePUUID } from "@/models/interfaces/leagueMatchData";
import LeaderboardDTO from "@/models/dtos/leaderboard-dto";
import Leaderboard from "@/models/interfaces/leaderboard";

async function createLeagueCompetition(competition_id: string, targetMatches: number) {
    const allUsers: usernamePUUID[] = await getAllUserNamePUUIDs(competition_id);
    if (allUsers.length < 2) {
        console.error("Not enough users to create competition");
        return;
    }
    const firstUser = allUsers.shift()!;
    const matches = await getMatches(firstUser.puuid, targetMatches, ...allUsers.map(user => user.puuid));
    for (const match of matches) {
        addMatchToCompetition(match, competition_id, allUsers);
    }
}

async function getAllUserNamePUUIDs(competition_id: string): Promise<usernamePUUID[]> {
    const users: string[] = await (await fetch(`/api/competitions/users?competitionId=${competition_id}`)).json();
    const otherUsers: usernamePUUID[] = [];
    for (const user of users) {
        const user_data: usernamePUUID = await getUserNamePUUID(user);
        otherUsers.push(user_data);
    }
    return otherUsers;
}

async function getUserNamePUUID(username: string): Promise<usernamePUUID> {
    return {
        username: username,
        puuid: (await (await fetch(`/api/competitions/users/${username}`)).json()).league_puuid
    }
}

async function addMatchToCompetition(match: FilteredMatchData, competition_id: string, users: usernamePUUID[]) {
    const leaderboard_dto: LeaderboardDTO = {
        competition_id: competition_id,
        column_names: ["Name", "Summoner Name", "Champion", "Kills", "Deaths", "Assists", "Damage Dealt", "Gold Earned", "Win"],
        leaderboard_entries: users.map((user) => {
            const participant = match.participants.find((participant) => participant.puuid === user.puuid);
            if (!participant) {
                throw new Error("Participant not found in match data");
            }
            return {
                "Name": user.username,
                "Summoner Name": participant.summonerName,
                "Champion": participant.championName,
                "Kills": participant.kills.toString(),
                "Deaths": participant.deaths.toString(),
                "Assists": participant.assists.toString(),
                "Damage Dealt": participant.totalDamageDealtToChampions.toString(),
                "Gold Earned": participant.goldEarned.toString(),
                "Win": participant.win ? "true" : "false"
            }
        })
    };

    try {
        const leaderboard = await postLeaderboard(leaderboard_dto);
        if (leaderboard) {
            console.log("Success - returned leaderboard");
            return leaderboard;
        } else {
            return "Failed to save leaderboard";
        }
    } catch (error) {
        console.error("Error saving leaderboard:", error);
        return "Big oof";
    }
}

async function postLeaderboard(
    leaderboard: LeaderboardDTO
): Promise<Leaderboard> {
    const response = await fetch(
        `/api/competitions/leaderboard?competitionId=${leaderboard.competition_id}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(leaderboard),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to post leaderboard");
    }

    return response.json();
}

export default createLeagueCompetition;