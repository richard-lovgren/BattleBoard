import UserPageBanner from "@/components/UserPageBanner";
import CommunitiesList from "@/components/CommunitiesList";

import CompetitionList from "@/components/CompetitionList";
import CompetitionData from "@/models/interfaces/CompetitionData";

let baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
baseUrl = baseUrl?.includes("localhost") ? baseUrl : "https://" + baseUrl;
interface CommunityData {
  community_id: string;
  community_name: string;
}

type UserPageProps = Promise<{ discord_id: number }>;

interface UserData {
  id: string;
  discord_id: number;
  user_name: string;
  display_name: string;
  league_puuid: string;
}

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

async function fetchUserCompetitionIds(
  competition_id: string
): Promise<string[]> {
  const response = await fetch(
    `${baseUrl}/api/users/competitions?user_name=${competition_id}` // Correct URL
  );
  if (!response.ok) {
    return [];
  }
  return response.json();
}

async function fetchCompetitionData(
  competitionId: string
): Promise<CompetitionData> {
  const response = await fetch(
    `${baseUrl}/api/competitions?competitionId=${competitionId}`
  );
  return response.json();
}

async function fetchAllCompetitionsData(
  competitionIds: string[]
): Promise<CompetitionData[]> {
  const competitionsData: CompetitionData[] = [];
  for (const competitionId of competitionIds) {
    const competitionData = await fetchCompetitionData(competitionId);
    competitionsData.push(competitionData);
  }
  return competitionsData;
}


// Server component
const UserPage = async (props: { params: UserPageProps }) => {
  // Extract community ID from the URL
  const { discord_id } = await props.params;
  // Fetch user data from the API
  const userDataHeader = await fetchUserData(discord_id);
  const user_name = userDataHeader.user_name;

  const userCommunitiesData = await fetchUserCommunitiesData(
    user_name
  );

  const userCompetitionsList = await fetchUserCompetitionIds(
    user_name
  );


  const userCommunitiesMap = Object.entries(userCommunitiesData).map(
    ([id, name]) => ({
      id: id,
      name,
    })
  );

  const userCompetitionsData = await fetchAllCompetitionsData(
    userCompetitionsList);

  console.log(
    "Communities for user: " + userDataHeader.user_name,
    userCommunitiesMap
  );
  console.log("Competitions for user: ", user_name, userCompetitionsList);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <UserPageBanner
        id={userDataHeader.id}
        discord_id={userDataHeader.discord_id}
        user_name={userDataHeader.user_name}
        display_name={userDataHeader.display_name}
        league_puuid={userDataHeader.league_puuid}
      ></UserPageBanner>
      {userCommunitiesMap.length > 0 && (
        <div className=" flex  flex-col items-start px-48">
          <h1 className="text-2xl font-semibold text-accent text-white">Communities:</h1>
          <CommunitiesList communities={userCommunitiesMap}></CommunitiesList>
        </div>
      )}
      {userCompetitionsData.length > 0 && (
        <div className="flex flex-col items-start px-48">
          <h1 className="text-2xl font-semibold text-accent text-white">Competitions:</h1>
          <CompetitionList competitions={userCompetitionsData}></CompetitionList>
        </div>
      )}
    </div>
  );
};

// Export the server component
export default UserPage;
