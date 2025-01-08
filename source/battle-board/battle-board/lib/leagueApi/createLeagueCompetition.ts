import getMatches from "@/lib/leagueApi/getMatches";
import { FilteredMatchData, usernamePUUID } from "@/models/interfaces/leagueMatchData";
import LeaderboardDTO from "@/models/dtos/leaderboard-dto";
import Leaderboard from "@/models/interfaces/leaderboard";
import user from "@/models/interfaces/user";

async function createLeagueCompetition(competition_id: string, targetMatches: number): Promise<string> {
    const allUsers: usernamePUUID[] = await getAllUserNamePUUIDs(competition_id);
    if (allUsers.length < 2) {
        return "Not enough users to create competition";
    }
    //Check if any users puuid is null
    for (const user of allUsers) {
        if (user.puuid === null) {
            return "User" + user.username + " does not have a puuid";
        }
    }
    const firstUser = allUsers.shift()!;
    const matches = await getMatches(firstUser.puuid, targetMatches, ...allUsers.map(user => user.puuid));
    allUsers.unshift(firstUser);
    for (const match of matches) {
        addMatchToCompetition(match, competition_id, allUsers);
    }
    return "Competition created";
}

async function getAllUserNamePUUIDs(competition_id: string): Promise<usernamePUUID[]> {
    const users: user[] = await (await fetch(`/api/competitions/users?competitionId=${competition_id}`)).json();
    const usersPUUID = [];
    for (var user of users) {
        usersPUUID.push({
            username: user.user_name,
            puuid: user.league_puuid
        });
    }
    return usersPUUID;
}

async function getUserNamePUUID(username: string): Promise<usernamePUUID> {
    const puuid = (await (await fetch(`/api/users?userId=${username}`)).json()).league_puuid
    console.log("Got puuid", puuid);
    return {
        username: username,
        puuid: puuid
    }
}

async function addMatchToCompetition(match: FilteredMatchData, competition_id: string, users: usernamePUUID[]) {
    const leaderboard_dto: LeaderboardDTO = {
        competition_id: competition_id,
        column_names: ["name", "Summoner Name", "Kills", "Deaths", "Assists", "Damage Dealt", "Gold Earned", "Wins"],
        leaderboard_entries: users.map((user) => {
            const participant = match.participants.find((participant) => participant.puuid === user.puuid);
            if (!participant) {
                throw new Error("Participant not found in match data");
            }
            return {
                "name": user.username,
                "Summoner Name": participant.summonerName,
                "Kills": participant.kills.toString(),
                "Deaths": participant.deaths.toString(),
                "Assists": participant.assists.toString(),
                "Damage Dealt": participant.totalDamageDealtToChampions.toString(),
                "Gold Earned": participant.goldEarned.toString(),
                "Wins": participant.win ? "1" : "0"
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