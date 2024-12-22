"use client";

import { Suspense, useState } from "react";
import EditCompetitionButton from "@/components/competition/EditCompetitionButton";
import FileUploadAndParseComponent from "@/components/competition/FileUploadAndParseButton";
import { Leaderboard } from "@/models/leaderboard";
import CompetitionData from "@/models/interfaces/CompetitionData";
import CompetitonModeWrapper from '@/components/competition/CompetitionModeWrapper';

const LeaderboardComponent = ({
  competitionId,
  competitionData,
  creatorName,
  initialLeaderboard,
  userNames,
}: {
  competitionId: string;
  competitionData: CompetitionData;
  creatorName: string;
  initialLeaderboard: Leaderboard | null;
  userNames: string[] | null;
}) => {
  

  const [reload, setReload] = useState(0);

  const triggerReload = () => {
    console.log("triggering reload");
    setReload((prev) => prev + 1);
  }

  if (userNames === null) {
    return <p> Failed to load usernames for competition! </p>;
  }

  return (
    <Suspense fallback={<p>Loading competition data...</p>}>

      <EditCompetitionButton competitionCreator={creatorName} />
      <FileUploadAndParseComponent
        prevLeaderboard={initialLeaderboard}
        userNames={userNames}
        handleCompetitionDataParsed={triggerReload}
        competitionId={competitionId}
      />

      <CompetitonModeWrapper mode={competitionData.competition_type} competitionId={competitionId} reloadTrigger={reload} />

    </Suspense>
  );
};

export default LeaderboardComponent;
