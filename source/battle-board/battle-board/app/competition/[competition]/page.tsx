//A default export react NextJS server side rendered page component.

import Image from "next/image";
import PlayerGrid from "@/components/playerGrid/PlayerGrid";
import CompetitionClientWrapper from "@/components/CompetitonClientWrapper";

interface CompetitionData {
  id: string;
  competition_name: string;
  competition_description: string;
  game_id: string;
}

interface GameData {
  id: string;
  game_name: string;
}

type CompetitionPageProps = Promise<{ competition: number }>;

async function fetchCompetitionData(competition_id: number): Promise<CompetitionData> {
  const response = await fetch(`${process.env.BASE_URL}/api/competitions?competitionId=${competition_id}`);
  if (!response.ok) {
    return {
      id: "",
      competition_name: "",
      competition_description: "",
      game_id: "",
    };
  }
  return response.json();
}

async function fetchCompetitionGameData(game_id: string): Promise<GameData> {
  const response = await fetch(`${process.env.BASE_URL}/api/games?gameId=${game_id}`);
  if (!response.ok) {
    return {
      id: "",
      game_name: "",
    };
  }
  return response.json();
}

// Server component
const CompetitionPage = async (props: { params: CompetitionPageProps }) => {
  // Extract community ID from the URL
  const { competition } = await props.params;

  // Fetch user data from the API
  const competitionHeader = await fetchCompetitionData(competition);

  const competitionGame = await fetchCompetitionGameData(competitionHeader.game_id);

  return (
    <div className="w-full h-full  flex flex-col gap-4 items-center">
      <div className="w-full  flex text-slate-50 text-3xl flex-row items-center gap-4 px-10 py-0">
        <div className="relative inline-block flex-grow flex-shrink-0 w-96 h-96">
          <Image
            src="/competition-placeholder.jpg"
            alt="example"
            className="rounded-full"
            layout="fill"
            objectFit="cover"
          ></Image>
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full shadow-inner shadow-black"></div>
        </div>
        <div className="flex flex-col gap-4  h-full pl-12 pr-36">
          <h1 className="flex text-7xl font-odibee text-white">
            {competitionHeader.competition_name}
          </h1>
          <h2 className="flex text-4xl font-odibee text-white text-wrap">
            {competitionHeader.competition_description}
          </h2>
          <h3 className="flex text-2xl font-odibee text-foreground">
            {competitionGame.game_name}
          </h3>
        </div>
        <div className="flex flex-col gap-5  h-full items-center">
          <Image
            src="/rival_mode_icon.svg"
            alt="Competition Type Image"
            width={100}
            height={100}
          ></Image>
          <Image
            src="/user.svg"
            alt="Players Icon Image"
            width={100}
            height={100}
          ></Image>
          <div className="flex flex-col gap-0 items-center">
            <h1 className="flex text-xl font-odibee text-white py-0 my-0">
              23/12
            </h1>

            <h1 className="flex text-xl font-odibee text-white py-0 my-0">
              2024
            </h1>
          </div>
        </div>
      </div>
      <div>
        <PlayerGrid />
      </div>
      <div>
        <CompetitionClientWrapper />
      </div>
    </div>
  );
}

// Export the server component
export default CompetitionPage;
