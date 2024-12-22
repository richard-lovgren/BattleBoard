
export type Leaderboard = {
    competition_id: string,
    leaderboard_id: string,
    column_names: string[],
    leaderboard_entries: Array<Record<string, string>>,
};
