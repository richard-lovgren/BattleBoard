"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Leaderboard } from "@/models/leaderboard";
import TableModal from "@/components/competition/CreateTableComponent";
import LeaderboardDTO from "@/models/dtos/leaderboard-dto";
import GeneralButton from "@/components/general-btn";

interface EditCompetitionButtonProps {
  competitionCreator: string;
  competitionId: string;
  userNames: string[] | null;
  leaderboard: Leaderboard | null;
  triggerReload: () => void;
  gameName: string | null;
}

const postLeaderboard = async (
  competitionId: string,
  columns: string[],
  rows: string[][]
) => {
  const entries: Record<string, string>[] = rows.map((row) => {
    const entry: Record<string, string> = {};
    columns.forEach((column, idx) => {
      entry[column] = row[idx];
    });
    return entry;
  });

  const leaderboard_dto: LeaderboardDTO = {
    competition_id: competitionId,
    column_names: columns,
    leaderboard_entries: entries,
  };

  const response = await fetch(
    `/api/competitions/leaderboard?competitionId=${competitionId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leaderboard_dto),
    }
  );

  if (!response.ok) {
    console.error("Failed to post leaderboard data:", response);
    return;
  }

  return response.json();
};

const EditCompetitionButton: React.FC<EditCompetitionButtonProps> = ({
  competitionCreator,
  competitionId,
  leaderboard,
  userNames,
  triggerReload,
  gameName,
}) => {

  const { data: session } = useSession();
  const username = session?.user?.name;

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Build error on conditional statement before useSession etc
  if (gameName === "League of Legends") {
    return null;
  } 

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
        triggerReload();
        }, 500);
  };

  const handleModalSave = (columns: string[], rows: string[][]) => {
    try {
      postLeaderboard(competitionId, columns, rows);
    } catch (error) {
      console.error("Failed to post leaderboard data:", error);
      handleCloseModal();
      return <div>Failed to post leaderboard data!</div>;
    }
    handleCloseModal();
  };

  if (username !== competitionCreator) {
    return null;
  }

  if (userNames === null) {
    return <p> Failed to load usernames for competition! </p>;
  }

  if (leaderboard === null) {
    return (
      <div>
         <GeneralButton text="Create competition table" onClick={handleOpenModal} />
        <TableModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleModalSave}
          leaderboard={leaderboard}
          userNames={userNames}
        />
      </div>
    );
  }

  if (leaderboard) {
    return (
      <div>
         <GeneralButton text="Edit competition results" onClick={handleOpenModal} />
        <TableModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleModalSave}
          leaderboard={leaderboard}
          userNames={userNames}
        />
      </div>
    );
  }

  return null;
};

export default EditCompetitionButton;
