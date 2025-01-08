"use client";

import { Suspense, useState } from "react";
import EditCompetitionButton from "@/components/competition/ManualEditCompetition";
import { Leaderboard } from "@/models/leaderboard";
import CompetitionData from "@/models/interfaces/CompetitionData";
import CompetitonModeWrapper from "@/components/competition/CompetitionModeWrapper";
import UploadButtonWrapper from "@/components/competition/UploadButtonWrapper";


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
    }, 1000);
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
      <UploadButtonWrapper
        initialLeaderboard={initialLeaderboard}
        userNames={userNames}
        competitionId={competitionId}
        competitionData={competitionData}
        creatorName={creatorName}
        triggerReload={triggerReload}
      />

      <CompetitonModeWrapper mode={competitionData.competition_type} competitionId={competitionId} reloadTrigger={reload} />

    </Suspense>
  );
};

export default LeaderboardComponent;
