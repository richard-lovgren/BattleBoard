export default interface Community {
    created_at: Date;
    community_members: number;
    community_name: string;
    community_image?: string;
    id: bigint;
};