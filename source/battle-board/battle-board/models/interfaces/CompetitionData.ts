export default interface CompetitionData {
    id: string,
    community_id?: string,
    participants: number,
    competition_name: string,
    creator_name: string,
    competition_start_date: Date;
    competition_description?: string,
    competition_type: number,
    format: number,
    competition_image?: string,
    is_open: boolean,
    is_running: boolean,
    game_id: string,
    rank_alg: number,
    is_public: boolean,
    competition_image_path: string,
    game_name?: string,
}