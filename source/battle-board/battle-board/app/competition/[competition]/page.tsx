import { Suspense } from "react";
import Image from "next/image";
import PlayerGrid from "@/components/playerGrid/PlayerGrid";
import fetchCompetitionData from "@/lib/leaderboard/fetchCompetitionData";
import fetchGameName from "@/lib/leaderboard/fetchGameName";
import fetchClassicLeaderBoard from "@/lib/leaderboard/fetchClassicLeaderBoard";
import fetchCompetitionUsers from "@/lib/leaderboard/fetchCompetitionUsers";
import LeaderboardComponent from "@/components/competition/LeaderboardComponent";
import fetchCommunityData from "@/lib/community/fetchCommunityData";
import GeneralButton from "@/components/general-btn";

// Server-side data fetching
async function getCompetitionData(competitionId: string) {
  const competitionData = await fetchCompetitionData(competitionId);
  if (!competitionData) {
    throw new Error("Competition not found");
  }
  const gameName = await fetchGameName(competitionData.game_id);
  const leaderboard = await fetchClassicLeaderBoard(competitionId);
  const competitionUsers = await fetchCompetitionUsers(competitionId);
  return {
    competitionData,
    gameName,
    leaderboard,
    competitionUsers,
    community_id: competitionData.community_id,
  };
}

const getCommunity = async (community_id: string) => {
  const communityData = await fetchCommunityData(community_id);

  if (!communityData) {
    throw new Error("Competition not found");
  }

  return communityData;
};

type CompetitionPageProps = Promise<{ competition: string }>;

// Main Page Component
const CompetitionPage = async (props: { params: CompetitionPageProps }) => {
  const {
    competitionData,
    gameName,
    leaderboard,
    competitionUsers,
    community_id, //TODO: Use this to fetch community data
  } = await getCompetitionData((await props.params).competition);

  console.log("New community id?: ", community_id)

  const community_name = await getCommunity("1317111159274471444"); // TODO: Fetch community data with actual community_id but javascript cant handle large numbers

  if (!competitionData) {
    return <p>Competition not found</p>;
  }

  const joined = true;

  const requestPending = false;

  const renderCommunity = () => {
    if (!community_name) {
      return <h1 className="opacity-100 font-odibee">Community not found</h1>;
    }
    return (
      <div className="flex flex-row items-center justify-center gap-4">
        {community_name.community_image && (
          <Image
            src={community_name.community_image}
            alt="Community Image"
            width={50}
            height={50}
            className="rounded-full"
          />
        )}
        <h1 className="font-odibee text-sm">{community_name.community_name}</h1>
      </div>
    );
  };

  const renderButtons = () => {
    // Use the GeneralButton component to render the buttons.

    if (joined) {
      return (
        <div className="flex flex-row gap-4">
          <GeneralButton
            text="Leave"
            onClick={() => {
              console.log("Leave competition");
            }}
          />
          <GeneralButton
            text="Edit"
            onClick={() => {
              console.log("Edit competition");
            }}
          />
        </div>
      );
    }
    else if (requestPending) {
      return (
        <div className="flex flex-row gap-4">
          <GeneralButton
            text="Cancel Request"
            onClick={() => {
              console.log("Cancel request");
            }}
          />
        </div>
      );
    }
    else {
      return (
        <div className="flex flex-row gap-4">
          <GeneralButton
            text="Join"
            onClick={() => {
              console.log("Join competition");
            }}
          />
        </div>
      );
    }
  }



  return (
    <div className="w-full h-full flex flex-col gap-4 items-center">
      <div className="w-full flex text-slate-50 text-3xl flex-row items-center gap-4 px-10 py-0">
        <div className="relative inline-block flex-shrink-0 w-96 h-96">
          <Image
            src="/competition-placeholder.jpg"
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
          <h3 className="flex text-xl font-odibee text-white">{gameName}</h3>



        </div>

        <div className="flex flex-col gap-5 h-full items-center">
          <Image
            src="/rival_mode_icon.svg"
            alt="Competition Type Image"
            width={50}
            height={50}
          />
          <Image
            src="/user.svg"
            alt="Players Icon Image"
            width={50}
            height={50}
          />
          <div className="flex flex-col gap-0 items-center">
            <h1 className="flex text-xl font-odibee text-white py-0 my-0">
              23/12
            </h1>
            <h1 className="flex text-xl font-odibee text-white py-0 my-0">
              2024
            </h1>
          </div>

          <div>{renderCommunity()}</div>
        </div>
      </div>

      {/* List players in competition */}
      <Suspense fallback={<p>Loading players...</p>}>
        <div>
          <PlayerGrid playerList={competitionUsers} />
        </div>
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
  );
};
export default CompetitionPage;
