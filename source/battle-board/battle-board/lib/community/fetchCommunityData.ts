import baseUrl from "@/lib/baseUrl";

interface CommunityData {
  community_name: string;
  community_id: string;
  community_image?: string;
}

// Fetch community data directly inside the server component
async function fetchCommunityData(
  communityId: string,
): Promise<CommunityData | null> {
  console.log("fetchCommunityData: communityId", communityId);
  const response = await fetch(
    `${baseUrl}/api/community?communityId=${communityId}`,
  );

  console.log(
    `Me look at de url dem: ${baseUrl}/api/community?communityId=${communityId}`,
  );

  if (!response.ok) {
    console.log("fetchCommunityData: response not ok");
    return null;
  }
  return response.json();
}

export default fetchCommunityData;
