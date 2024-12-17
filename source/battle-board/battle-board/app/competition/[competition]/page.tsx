"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import PlayerGrid from "@/components/playerGrid/PlayerGrid";
import ClassicMode from "@/components/competitionModes/classicMode/ClassicMode";
import Button from "@mui/material/Button";
import { useParams } from "next/navigation";

interface CompetitionData {
  competition_name: string;
  creator_name: string;
  competition_description: string;
  competition_type: number;
  format: number;
  is_open: boolean;
  is_running: boolean;
  game_id: string;
  rank_alg: number;
  is_public: boolean;
}

async function fetchCompetitionData(
  competitionId: string
): Promise<CompetitionData | null> {
  const response = await fetch(
    `/api/competitions?competitionId=${competitionId}`
  );
  if (!response.ok) return null;
  return response.json();
}

async function fetchGameName(gameId: string): Promise<string | null> {
  const response = await fetch(`/api/game?gameId=${gameId}`);
  if (!response.ok) return null;
  return response.json();
}

const CompetitionPage = () => {
  const params = useParams();
  const { competition } = params;
  const { data: session } = useSession();
  const username = session?.user?.name;
  const [competitionData, setCompetitionData] =
    useState<CompetitionData | null>(null);
  const [gameName, setGameName] = useState<string | null>(null);
  useEffect(() => {
    const loadCompetitionData = async () => {
      const data = await fetchCompetitionData(competition as string);
      if (data) {
        setCompetitionData(data);
        const gameName = await fetchGameName(data.game_id);
        setGameName(gameName || "Game not found");
      }
    };
    loadCompetitionData();
  }, [username, competition]);

  if (!competitionData) {
    return <div>Loading competition data...</div>;
  }

  let competitionMainElement: JSX.Element = <></>;
  if (competitionData.competition_type === 0) {
    // TODO: Implement Tournament mode
  } else if (competitionData.competition_type === 1) {
    competitionMainElement = <ClassicMode />;
  } else if (competitionData.competition_type === 2) {
    // TODO: Implement Rival mode
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center">
      <div className="w-full flex text-slate-50 text-3xl flex-row items-center gap-4 px-10 py-0">
        <div className="relative inline-block flex-grow flex-shrink-0 w-96 h-96">
          <Image
            src="/competition-placeholder.jpg"
            alt="example"
            className="rounded-full"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full shadow-inner shadow-black"></div>
        </div>

        <div className="flex flex-col gap-4 h-full pl-12 pr-36">
          <h1 className="flex text-8xl font-odibee text-white">
            {competitionData.competition_name}
          </h1>
          <h2 className="flex text-4xl font-odibee text-white text-wrap">
            {competitionData.competition_description}
          </h2>
          <h3 className="flex text-xl font-odibee text-white">{gameName}</h3>
        </div>

        <div className="flex flex-col gap-5 h-full items-center">
          <Image
            src="/rival_mode_icon.svg"
            alt="Competition Type Image"
            width={100}
            height={100}
          />
          <Image
            src="/user.svg"
            alt="Players Icon Image"
            width={100}
            height={100}
          />
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

      {username === competitionData.creator_name && (
        <div>
          <Button variant="contained" color="primary">
            Edit competition results
          </Button>
        </div>
      )}

      <div>{competitionMainElement}</div>
    </div>
  );
};

export default CompetitionPage;
