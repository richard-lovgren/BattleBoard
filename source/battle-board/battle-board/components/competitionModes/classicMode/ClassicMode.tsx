import React, { useState, useEffect } from "react";
import {
  Box,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Typography,
} from "@mui/material";

import { Leaderboard } from "@/models/leaderboard";

interface ClassicModeProps {
  competitionId: string;
}

const fetchClassicLeaderBoardDodge = async (
  competitionId: string
): Promise<Leaderboard | null> => {
  //Jag är för dålig på react, vet ej hur man fetchar denna server-side + trigga reload
  const response = await fetch(
    `/api/competitions/leaderboard?competitionId=${competitionId}`
  );
  if (!response.ok) return null;
  return response.json();
};

const ClassicMode: React.FC<ClassicModeProps> = ({ competitionId }) => {
  const [leaderboardData, setLeaderboardData] = useState<Leaderboard | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await fetchClassicLeaderBoardDodge(competitionId);
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

  return (
    <Box style={{ width: "60vw", margin: "0 0 100px 0" }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="dynamic table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>
                  <Typography className="h3">{column}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{
                  backgroundColor:
                    rowIndex % 2 === 0
                      ? "var(--purple-light)"
                      : "var(--purple-lighter)",
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column}
                    sx={{ color: "white", border: "none" }}
                  >
                    <Typography className="breadText">{row[column]}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ClassicMode;
