"use client";

import { Suspense, useState, useEffect } from "react";
import EditCompetitionButton from "@/components/competition/EditCompetitionButton";
import FileUploadAndParseComponent from "@/components/competition/FileUploadAndParseButton";
import { Leaderboard } from "@/models/leaderboard";

const LeaderboardComponent = ({
  competitionId,
  creatorName,
  initialLeaderboard,
  userNames,
}: {
  competitionId: string;
  creatorName: string;
  initialLeaderboard: Leaderboard | null;
  userNames: string[] | null;
}) => {
  const [leaderboardData, setLeaderboardData] = useState<Leaderboard | null>(
    null
  );

  useEffect(() => {
    setLeaderboardData(initialLeaderboard);
  }, [initialLeaderboard]);

  const handleCompetitionDataParsed = (data: Leaderboard) => {
    setLeaderboardData(data);
  };

  if (userNames === null) {
    return <p>silli :P</p>;
  }

  return (
    <Suspense fallback={<p>Loading competition data...</p>}>
      epic leaderboard
      <EditCompetitionButton competitionCreator={creatorName} />
      <FileUploadAndParseComponent
        prevLeaderboard={leaderboardData}
        userNames={userNames}
        handleCompetitionDataParsed={handleCompetitionDataParsed}
        competitionId={competitionId}
      />
    </Suspense>
  );
};

export default LeaderboardComponent;
