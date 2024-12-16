// app/community/[communityId]/page.tsx

import UserPageBanner from "@/components/UserPageBanner";
import CommunitiesList from "@/components/CommunitiesList";

interface CommunityData {
  community_id: string;
  community_name: string;
}

type UserPageProps = Promise<{ user_id: number }>;

interface UserData {
  id: string;
  discord_id: number;
  user_name: string;
  display_name: string;
  league_puuid: string;
}

const baseUrl = "http://localhost:3000";

async function fetchUserData(discord_id: number): Promise<UserData> {
  // Example API endpoint; replace with your actual API request
  const response = await fetch(`${baseUrl}/api/users?userId=${discord_id}`);
  if (!response.ok) {
    return {
      id: "",
      discord_id: 0,
      user_name: "",
      display_name: "",
      league_puuid: "",
    };
  }
  return response.json();
}

async function fetchUserCommunitiesData(
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

// Server component
const UserPage = async (props: { params: UserPageProps }) => {
  // Extract community ID from the URL
  const discord_id = (await props.params).user_id;
  console.log("USER ID", discord_id);

  // Fetch user data from the API
  const userDataHeader = await fetchUserData(discord_id);

  const userCommunitiesData = await fetchUserCommunitiesData(
    userDataHeader.user_name
  );

  console.log("Communities for user: ", userCommunitiesData);

  const userCommunitiesMap = Object.entries(userCommunitiesData).map(
    ([id, name]) => ({
      id: id,
      name,
    })
  );

  console.log(
    "Communities for user: " + userDataHeader.user_name,
    userCommunitiesMap
  );

  return (
    <div className="min-h-screen w-full flex flex-col">
      <UserPageBanner
        id={userDataHeader.id}
        discord_id={userDataHeader.discord_id}
        user_name={userDataHeader.user_name}
        display_name={userDataHeader.display_name}
        league_puuid={userDataHeader.league_puuid}
      ></UserPageBanner>
      <div className=" flex  flex-col items-start px-48">
        <h1 className="text-2xl font-semibold text-accent">Communities:</h1>
        <CommunitiesList communities={userCommunitiesMap}></CommunitiesList>
      </div>
    </div>
  );
};

// Export the server component
export default UserPage;
