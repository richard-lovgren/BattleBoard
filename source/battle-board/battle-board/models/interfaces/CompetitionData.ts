export default interface CompetitionData {
    participants: number,
    id: string,
    competition_name: string,
    creator_name: string,
    competition_description: string,
    competition_type: number,
    format: number,
    competition_image: string,
    is_open: boolean,
    is_running: boolean,
    game_id: string,
    rank_alg: number,
    is_public: boolean,
    community_id: number
}