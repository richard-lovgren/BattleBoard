"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import { Swords } from "lucide-react";

import { Leaderboard } from "@/models/leaderboard";

interface RivalModeProps {
  competitionId: string;
  userNames: string[] | null;
}

const fetchRivalLeaderBoardDodge = async (
  competitionId: string,
): Promise<Leaderboard | null> => {
  //Jag är för dålig på react, vet ej hur man fetchar denna server-side + trigga reload
  const response = await fetch(
    `/api/competitions/leaderboard?competitionId=${competitionId}`,
  );
  if (!response.ok) return null;
  return response.json();
};

const parseRows = (
  rows: Record<string, string>[],
  leftScores: string[],
  rightScores: string[],
) => {
  leftScores.push(...Object.values(rows[0]).slice(1));
  rightScores.push(...Object.values(rows[1]).slice(1));
  return 1;
};

const RivalMode: React.FC<RivalModeProps> = ({ competitionId, userNames }) => {
  const [leaderboardData, setLeaderboardData] = useState<Leaderboard | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await fetchRivalLeaderBoardDodge(competitionId);
        setLeaderboardData(data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [competitionId]);

  if (loading) {
    return <Typography>Loading leaderboard...</Typography>;
  }

  if (!leaderboardData || !leaderboardData.leaderboard_entries.length) {
    return <Typography>No leaderboard data available.</Typography>;
  }

  const rows = leaderboardData.leaderboard_entries;
  const columns = leaderboardData.column_names;

  // Placeholder data for testing
  // TODO: Replace with leage usernames if games is leage of legends
  const leftName = userNames ? userNames[0] : "";
  const rightName = userNames ? userNames[1] : "";

  const leftScores: string[] = [];
  const rightScores: string[] = [];

  parseRows(rows, leftScores, rightScores);

  const renderTable = (name: string, scores: string[]) => (
    <TableContainer>
      <Table sx={{ minWidth: 300 }} aria-label={`${name} scores table`}>
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <div className="flex flex-col items-center justify-center gap-2">
                <Typography className="text-4xl font-odibee">{name}</Typography>
              </div>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {scores.map((score, index) => (
            <TableRow
              key={index}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell align="center" sx={{ color: "white", border: "none" }}>
                <div className=" border-[3px] border-accent p-4 w-full rounded-xl">
                  <Typography className="breadText font-bold">
                    {score}
                  </Typography>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMetrics = (metrics: string[]) => (
    <TableContainer className="flex-1">
      <Table aria-label="metrics table">
        <TableBody>
          {metrics.map((metric, index) => (
            <TableRow key={index}>
              <TableCell align="center" sx={{ color: "white" }}>
                <div className=" border-[3px]  p-4 w-full rounded-xl border-background underline">
                  <Typography textAlign="center">{metric}</Typography>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div className="flex flex-row items-end justify-center gap-4   ">
      {renderTable(leftName, leftScores)}

      <div className="  h-full items-center flex flex-col">
        <div className="rounded-full p-2 bg-white self-center">
          <Swords size={64} />
        </div>

        {renderMetrics(columns.slice(1))}
      </div>

      {renderTable(rightName, rightScores)}
    </div>
  );
};

export default RivalMode;
