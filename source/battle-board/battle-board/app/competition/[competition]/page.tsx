import { Suspense } from 'react'
import Image from 'next/image'
import PlayerGrid from '@/components/playerGrid/PlayerGrid'
import fetchCompetitionData from '@/lib/leaderboard/fetchCompetitionData'
import fetchGameName from '@/lib/leaderboard/fetchGameName'
import fetchClassicLeaderBoard from '@/lib/leaderboard/fetchClassicLeaderBoard'
import fetchCompetitionUsers from '@/lib/leaderboard/fetchCompetitionUsers'
import LeaderboardComponent from '@/components/competition/LeaderboardComponent'
import { formatDate, getCompetitonTypeIcon } from '@/lib/utils'
import { competitionTypeEnum } from '@/models/interfaces/competitionTypeEnum'

// Server-side data fetching
async function getCompetitionData(competitionId: string) {
  const competitionData = await fetchCompetitionData(competitionId)
  if (!competitionData) {
    throw new Error('Competition not found')
  }

  const imageUrl = `http://localhost:8080/competitions/${competitionData.id}/image`

  const gameName = await fetchGameName(competitionData.game_id)
  const leaderboard = await fetchClassicLeaderBoard(competitionId)
  const competitionUsers = await fetchCompetitionUsers(competitionId)
  return { competitionData, gameName, leaderboard, competitionUsers, imageUrl }
}

type CompetitionPageProps = Promise<{ competition: string }>

// Main Page Component
const CompetitionPage = async (props: { params: CompetitionPageProps }) => {
  const { competitionData, gameName, leaderboard, competitionUsers, imageUrl } =
    await getCompetitionData((await props.params).competition)

  return (
    <div className='w-full h-full  flex flex-col gap-4 items-center' style={{maxWidth:'1500px', width:'90vw', margin:'0 auto', paddingBottom:'100px'}}>

      <div
        style={{ width: '100%', justifyContent: 'space-between', gap: '20px' }}
        className='flex flex-col md:flex-row'
      >
        <div className=' flex text-slate-50 text-3xl flex-row items-center gap-4  py-0'>
          <div
            className='relative inline-block flex-shrink-0'
            style={{ width: '20vw', height: '20vw' }}
          >
            <Image
              src={
                competitionData.competition_image_path ? imageUrl : '/comp.jpg'
              }
              alt='Competition image'
              className='rounded-full'
              fill={true}
              sizes='50vw'
              style={{
                objectFit: 'cover'
                }
              }
            />      

            <div className='absolute inset-0 bg-black bg-opacity-20 rounded-full shadow-inner shadow-black'></div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', height: '100%', justifyContent: 'center' }}>
            <h1 className='text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-odibee text-white'>
              {competitionData.competition_name}
            </h1>
            <h2 className='flex text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-odibee text-white'>
              {competitionData.competition_description}
            </h2>
            <h3 className='flex text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-odibee text-white'>
              {gameName}
            </h3>
          </div>
        </div>

        <div
          className='flex flex-1 flex-row md:flex-col gap-5 items-end md:w-30% w-full'
          style={{
            justifyContent: 'flex-end',
          }}
        >
          <h1 className='flex text-xl font-odibee text-white py-0 my-0'>
            Created by {competitionData.creator_name}
          </h1>

          <h1 className='flex text-xl font-odibee text-white py-0 my-0'>
            {formatDate(competitionData.competition_start_date)}
          </h1>
          <Image
            src={getCompetitonTypeIcon(competitionData.competition_type)}
            alt='Competition Type Image'
            width={40}
            height={40}
            style={{ maxWidth: '40px', maxHeight:'40px', padding: '5px' }}
          />
        </div>
      </div>

      {/* List players in competition */}
      <Suspense fallback={<p>Loading players...</p>}>
          <PlayerGrid playerList={competitionUsers} />
      </Suspense>
      {/* Leaderboard component - contains edit and upload buttons to avoid excessive state inheritance (pls om ni kommer på bättre sätt help) */}
      <LeaderboardComponent
        competitionId={competitionData.id}
        competitionData={competitionData}
        creatorName={competitionData.creator_name}
        initialLeaderboard={leaderboard}
        userNames={competitionUsers}
        gameName={gameName}
      />
    </div>
  )
}
export default CompetitionPage
