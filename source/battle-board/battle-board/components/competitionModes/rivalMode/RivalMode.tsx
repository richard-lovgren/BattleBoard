"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import { DivideIcon, Sword, Swords } from "lucide-react";

import { Leaderboard } from "@/models/leaderboard";

import fetchCompetitionUsers from "@/lib/leaderboard/fetchCompetitionUsers";

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

const calculateTotal = (scores: number[]) => {
  const total = scores.reduce((acc, score) => acc + score);
  return total;
};

const RivalMode: React.FC<RivalModeProps> = ({ competitionId, userNames }) => {
  const [leaderboardData, setLeaderboardData] = useState<Leaderboard | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  // Type of competitionUsers is sring[] || null

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

  /*if (!leaderboardData || !leaderboardData.leaderboard_entries.length) {
    return <Typography>No leaderboard data available.</Typography>;
  }*/

  /*const rows = leaderboardData.leaderboard_entries;
  const columns = leaderboardData.column_names;*/

  console.log(leaderboardData);

  console.log("Competition Users: ", userNames);

  // Placeholder data for testing
  const leftName = userNames ? userNames[0] : "Anton_1";
  const rightName = userNames ? userNames[1] : "Anton_2";

  const leftScores = [100, 90, 85, 40, 30]; // Scores for Team Alpha
  const rightScores = [80, 75, 70, 45, 35]; // Scores for Team Beta

  // How to comment out a block of jsx code?
  //

  const renderTable = (name: string, scores: number[]) => (
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

  // Render metrics using a table with the same amount of rows as the other tables consisting of a metric string in each row

  const metrics = ["Total", "Average", "Best", "Worst", "Difference"];

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

        {renderMetrics(metrics)}
      </div>

      {renderTable(rightName, rightScores)}
    </div>
  );
};

export default RivalMode;
