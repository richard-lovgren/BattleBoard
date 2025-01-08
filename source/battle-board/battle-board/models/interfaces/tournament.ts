
import tournamentMatch from "./tournamentMatch";

export default interface Tournament {
    "competition_id": string;
    "number_of_players": number;
    "tournament_matches" : tournamentMatch[];
}