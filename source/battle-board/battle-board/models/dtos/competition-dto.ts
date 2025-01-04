export default interface CompetitionDto {
    competition_name: string;
    creator_name: string;
    competition_start_date: string;
    competition_description?: string;
    competition_type: number;
    format: number;
    competition_image?: Blob;
    is_open: boolean;
    is_running: boolean;
    game_id: string;
    rank_alg: number;
    is_public: boolean;
    community_id: string;
}
