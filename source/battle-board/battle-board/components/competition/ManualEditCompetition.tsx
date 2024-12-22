"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@mui/material";
import { Leaderboard } from "@/models/leaderboard";
import TableModal from "@/components/competition/CreateTableComponent";
import LeaderboardDTO from "@/models/dtos/leaderboard-dto";

interface EditCompetitionButtonProps {
  competitionCreator: string;
  competitionId: string;
  userNames: string[] | null;
  leaderboard: Leaderboard | null;
  triggerReload: () => void;
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
}) => {
  const { data: session } = useSession();
  const username = session?.user?.name;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    triggerReload();
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
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Create competition table
        </Button>
        <TableModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleModalSave}
          leaderboard={leaderboard}
        />
      </div>
    );
  }

  if (leaderboard) {
    return (
      <div>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Edit competition results
        </Button>
        <TableModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleModalSave}
          leaderboard={leaderboard}
        />
      </div>
    );
  }

  return null;
};

export default EditCompetitionButton;
