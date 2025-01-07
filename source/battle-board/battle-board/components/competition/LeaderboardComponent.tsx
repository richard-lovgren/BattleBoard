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

  const mode = competitionData.competition_type

  return (
    <Suspense fallback={<p>Loading competition data...</p>}>
      
      {mode !== 0 &&  //dont want these components in tournament mode
      <>
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
      </>
      }

      <CompetitonModeWrapper
        mode={mode}
        competitionId={competitionId}
        reloadTrigger={reload}
      />

    </Suspense>
  );
};

export default LeaderboardComponent;
