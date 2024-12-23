
export default interface LeaderboardDTO {
    "competition_id": string;
    "column_names"?: string[];
    "leaderboard_entries"?: Array<Record<string, string>>,
}