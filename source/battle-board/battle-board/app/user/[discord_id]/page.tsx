import UserPageBanner from "@/components/UserPageBanner";
import CommunitiesList from "@/components/CommunitiesList";
import CompetitionList from "@/components/CompetitionList";

import { UserPageProps } from "@/models/interfaces/UserPage";
import { fetchUserData } from "@/lib/users/fetchUserData";
import { fetchUserCommunitiesData } from "@/lib/users/fetchUserCommunitiesData";
import { fetchUserCompetitionIds } from "@/lib/users/fetchUserCompetitionIds";
import { fetchAllCompetitionsData } from "@/lib/users/fetchAllCompetitionsData";


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



  return (
   <div className="min-h-screen flex flex-col pb-[100px] w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[75vw] xl:w-[75vw] mx-auto">
      <UserPageBanner
        id={userDataHeader.id}
        discord_id={userDataHeader.discord_id}
        user_name={userDataHeader.user_name}
        display_name={userDataHeader.display_name}
        league_puuid={userDataHeader.league_puuid}
        langcode={userDataHeader.locale}
      ></UserPageBanner>
      {userCommunitiesMap.length > 0 && (
        <div className=" flex  flex-col items-start " >
          <h1 className="text-2xl font-semibold text-accent text-white">Communities:</h1>
          <CommunitiesList communities={userCommunitiesMap}></CommunitiesList>
        </div>
      )}
      {userCompetitionsData.length > 0 && (
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-semibold text-accent text-white mb-5">Competitions:</h1>
          <CompetitionList competitions={userCompetitionsData}></CompetitionList>
        </div>
      )}
    </div>
  );
};

// Export the server component
export default UserPage;
