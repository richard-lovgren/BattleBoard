export default interface Community {
    community_name: string;
    community_image?: string;
    id: number;
    created_at: Date;
    community_members: number;
};