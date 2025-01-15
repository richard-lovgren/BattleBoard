import UserPageBanner from '@/components/UserPageBanner'
import CommunitiesList from '@/components/CommunitiesList'
import CompetitionList from '@/components/CompetitionList'

import { UserPageProps } from '@/models/interfaces/UserPage'
import { fetchUserData } from '@/lib/users/fetchUserData'
import { fetchUserCommunitiesData } from '@/lib/users/fetchUserCommunitiesData'
import { fetchUserCompetitionIds } from '@/lib/users/fetchUserCompetitionIds'
import { fetchAllCompetitionsData } from '@/lib/users/fetchAllCompetitionsData'

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
    <div className='min-h-screen flex flex-col pb-[100px] w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[75vw] xl:w-[75vw] mx-auto'>
      <div className=' flex  items-start'>
        <UserPageBanner
          id={userDataHeader.id}
          discord_id={userDataHeader.discord_id}
          user_name={userDataHeader.user_name}
          display_name={userDataHeader.display_name}
          league_puuid={userDataHeader.league_puuid}
          langcode={userDataHeader.locale}
        />
      </div>

      {userCommunitiesMap.length > 0 ? (
        <div className=' flex  flex-col items-start'>
          <h1 className='text-3xl font-semibold text-accent text-white font-odibee'>
            Communities
          </h1>
          <CommunitiesList communities={userCommunitiesMap}></CommunitiesList>
        </div>
      ) : (
        <div className=' flex  flex-col items-start mb-10'>
          <h1 className='text-3xl font-semibold text-accent text-white font-odibee'>
            Once you join communities, they will appear here!
          </h1>
        </div>
      )}
      {userCompetitionsData.length > 0 && (
        <div className='flex flex-col items-start'>
          <CompetitionList
            competitions={userCompetitionsData}
          ></CompetitionList>
        </div>
      )}
    </div>
  )
}

// Export the server component
export default UserPage
