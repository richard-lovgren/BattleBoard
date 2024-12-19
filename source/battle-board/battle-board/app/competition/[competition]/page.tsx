"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Image from "next/image";
import PlayerGrid from "@/components/playerGrid/PlayerGrid";
import ClassicMode from "@/components/competitionModes/classicMode/ClassicMode";
import CompetitionData from "@/models/interfaces/CompetitionData";
import { Button } from "@mui/material";
import { parse } from "papaparse";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from '@mui/material/styles';

import LeaderboardDTO from "@/models/dtos/leaderboard-dto";
import LeaderboardEntryDTO from "@/models/dtos/leaderboard-entry-dto";
import LeaderboardMetricDTO from "@/models/dtos/leaderboard-metric-dto";
import Leaderboard from "@/models/interfaces/leaderboard";

interface GameData {
  game_id: string;
  game_name: string;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function parseCsv<T>(fileContent: string): T[] | string {
  const { data, errors } = parse<T>(fileContent, {
    header: true, // Treat the first row as the header
    skipEmptyLines: true, // Ignore empty rows
  });
  if (errors.length > 0) {
    return errors[0].message;
  }
  return data;
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

  const gameData = await response.json();
  return gameData?.game_name || null; // Return the game_name directly
}

async function fetchClassicLeaderBoard(competitionId: string) {
  const response = await fetch(
    `/api/competitions/classic/leaderboard?competitionId=${competitionId}`
  );
  if (!response.ok) return null;
  return response.json();
}

async function createClassicLeaderboard(competitionId: string) {
  const leaderboardDto: LeaderboardDTO = {
    competition_id: competitionId,
  };

  const response = await fetch(`/api/competitions/classic/leaderboard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(leaderboardDto),
  });

  if (!response.ok) {
    console.error("Failed to create leaderboard");
    return null;
  }

  return await response.json();
}

async function handleFileSubmit(files: FileList | null) : Promise<string | null> {
  if (!files) {
    return "No files selected";
  }
  const reader = new FileReader();
  for(const file of files) {
    reader.readAsText(file);
    const data = parseCsv(reader.result as string);
    if (typeof data === "string") {
      return data;
    }
  }
  return null;
}

const CompetitionPage = () => {
  const params = useParams();
  const { competition } = params;
  const { data: session } = useSession();
  const username = session?.user?.name;

  const [competitionData, setCompetitionData] =
    useState<CompetitionData | null>(null);
  const [gameName, setGameName] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [fileHelperText, setFileHelperText] = useState<string | null>(null);

  // Fetch competition data and game name
  useEffect(() => {
    if (!competition) return;
    const loadCompetitionData = async () => {
      const data = await fetchCompetitionData(competition as string);
      if (data) {
        setCompetitionData(data);

        // Fetch game name if competition data is fetched
        const fetchedGameName = await fetchGameName(data.game_id);
        setGameName(fetchedGameName || "Game not found");
      }
    };
    loadCompetitionData();
  }, [competition]);

  // Fetch leaderboard data when competitionData is available
  useEffect(() => {
    if (!competitionData?.id) return;
    const loadLeaderboard = async () => {
      const data = await fetchClassicLeaderBoard(competitionData.id);
      if (data) {
        setLeaderboard(data);
      }
    };
    loadLeaderboard();
  }, [competitionData]);

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

      <div>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload CSV
          <VisuallyHiddenInput
            type="file"
            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => setFileHelperText(await handleFileSubmit(event.target.files))}
            multiple
          />
        </Button>
        <p>{fileHelperText}</p>
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
