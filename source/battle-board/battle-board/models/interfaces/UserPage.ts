export interface CommunityData {
    communityData: Record<string, string>
}

export type UserPageProps = Promise<{ discord_id: number }>;

export interface UserData {
    id: string;
    discord_id: number;
    user_name: string;
    display_name: string;
    league_puuid: string;
}
