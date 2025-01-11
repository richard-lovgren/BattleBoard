import { Suspense } from 'react';
import Image from 'next/image';
import PlayerGrid from '@/components/playerGrid/PlayerGrid';
import fetchCompetitionData from '@/lib/leaderboard/fetchCompetitionData';
import fetchGameName from '@/lib/leaderboard/fetchGameName';
import fetchClassicLeaderBoard from '@/lib/leaderboard/fetchClassicLeaderBoard';
import fetchCompetitionUsers from '@/lib/leaderboard/fetchCompetitionUsers';
import LeaderboardComponent from '@/components/competition/LeaderboardComponent';
import { formatDate, getCompetitonTypeIcon } from "@/lib/utils";
import { competitionTypeEnum } from '@/models/interfaces/competitionTypeEnum';

// Server-side data fetching
async function getCompetitionData(competitionId: string) {
  const competitionData = await fetchCompetitionData(competitionId);
  if (!competitionData) {
    throw new Error('Competition not found');
  }
  const gameName = await fetchGameName(competitionData.game_id);
  const leaderboard = await fetchClassicLeaderBoard(competitionId);
  const competitionUsers = await fetchCompetitionUsers(competitionId);
  return { competitionData, gameName, leaderboard, competitionUsers };
}

type CompetitionPageProps = Promise<{ competition: string }>;

// Main Page Component
const CompetitionPage = async (props: { params: CompetitionPageProps }) => {
  const { competitionData, gameName, leaderboard, competitionUsers } = await getCompetitionData((await props.params).competition);

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center">
      <div className="w-full flex text-slate-50 text-3xl flex-row items-center gap-4 px-10 py-0">
        <div className="relative inline-block flex-shrink-0 w-96 h-96">
          <Image
            src= {`http://localhost:8080/competitions/${competitionData.id}/image`}
            alt="example"
            className="rounded-full"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full shadow-inner shadow-black"></div>
        </div>

        <div className="flex flex-col gap-4 h-full pl-12 pr-36 flex-grow">
          <h1 className="flex text-8xl font-odibee text-white">
            {competitionData.competition_name}
          </h1>
          <h2 className="flex text-4xl font-odibee text-white">
            {competitionData.competition_description}
          </h2>
          <h2 className="flex text-4xl font-odibee text-white">
            {competitionTypeEnum[competitionData.competition_type] } mode
          </h2>
          <h3 className="flex text-xl font-odibee text-white">{gameName}</h3>
        </div>

        <div className="flex flex-col gap-5 h-full items-center">
          <Image
            src={getCompetitonTypeIcon(competitionData.competition_type)}
            alt="Competition Type Image"
            width={50}
            height={50}
          />
          <div className="flex flex-col gap-0 items-center">
          <h1 className="flex text-xl font-odibee text-white py-0 my-0"> Created by {competitionData.creator_name}</h1>
            <h1 className="flex text-xl font-odibee text-white py-0 my-0">
              Starts
            </h1>
            <h1 className="flex text-xl font-odibee text-white py-0 my-0">
              {formatDate(competitionData.competition_start_date)}
            </h1>
          </div>
        </div>
      </div>

      {/* List players in competition */}
      <Suspense fallback={<p>Loading players...</p>}>
        <div>
          <PlayerGrid playerList={competitionUsers} />
        </div>
      </Suspense>
      {/* Leaderboard component - contains edit and upload buttons to avoid excessive state inheritance (pls om ni kommer på bättre sätt help) */}
      <LeaderboardComponent competitionId={competitionData.id} competitionData={competitionData} creatorName={competitionData.creator_name} initialLeaderboard={leaderboard} userNames={competitionUsers} gameName={gameName} />
    </div>
  );
}
export default CompetitionPage;
