import { CommunityData } from "@/models/interfaces/UserPage";


let baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
baseUrl = baseUrl?.includes("localhost") ? baseUrl : "https://" + baseUrl;

export async function fetchUserCommunitiesData(
  user_name: string
): Promise<CommunityData> {
  const response = await fetch(
    `${baseUrl}/api/users/communities?user_name=${user_name}` // Correct URL
  );
  if (!response.ok) {
    return { community_id: "", community_name: "" };
  }
  return response.json();
}
