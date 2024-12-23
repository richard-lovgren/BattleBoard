"use client";

import { Suspense, useState } from "react";
import EditCompetitionButton from "@/components/competition/ManualEditCompetition";
import FileUploadAndParseComponent from "@/components/competition/FileUploadAndParseButton";
import { Leaderboard } from "@/models/leaderboard";
import CompetitionData from "@/models/interfaces/CompetitionData";
import CompetitonModeWrapper from "@/components/competition/CompetitionModeWrapper";

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
    setReload((prev) => prev + 1);
    console.log("Triggered reload of leaderboard!");
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  if (userNames === null) {
    return <p> Failed to load usernames for competition! </p>;
  }

  return (
    <Suspense fallback={<p>Loading competition data...</p>}>
      <EditCompetitionButton
        competitionCreator={creatorName}
        leaderboard={initialLeaderboard}
        triggerReload={triggerReload}
        competitionId={competitionId}
        userNames={userNames}
      />
      <FileUploadAndParseComponent
        prevLeaderboard={initialLeaderboard}
        userNames={userNames}
        handleCompetitionDataParsed={triggerReload}
        competitionId={competitionId}
      />

      <CompetitonModeWrapper
        mode={competitionData.competition_type}
        competitionId={competitionId}
        reloadTrigger={reload}
      />
    </Suspense>
  );
};

export default LeaderboardComponent;
