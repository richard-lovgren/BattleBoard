
import React from "react";
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
import { Sword } from "lucide-react";

interface RivalModeProps {
  competitionId: string;
}

const RivalMode: React.FC<RivalModeProps> = (competitionId) => {
  // Placeholder data for testing
  const leftName = "Anton";
  const rightName = "Anton_2";

  const leftScores = [100, 90, 85]; // Scores for Team Alpha
  const rightScores = [80, 75, 70]; // Scores for Team Beta

  const renderTable = (name: string, scores: number[]) => (
    <TableContainer className="">
      <Table sx={{ minWidth: 300 }} aria-label={`${name} scores table`}>
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <Typography className="text-4xl font-odibee" align="center">{name}</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scores.map((score, index) => (
            <TableRow
              key={index}
              sx={{
                backgroundColor:
                  index % 2 === 0
                    ? "#765DEA"
                    : "#856BF9",
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell align="center" sx={{ color: "white", border: "none" }}>
                <Typography className="breadText">{score}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer >
  );

  return (
    <div className="flex flex-col items-center justify-start gap-4 border-2 border-accent p-4 rounded-xl">
      {/* Names and Sword */}
      <div className="flex flex-row items-center justify-center gap-2">
        <Typography variant="h4" sx={{ marginRight: 2 }}>
          {leftName}
        </Typography>
        ⚔️
        <Typography variant="h4" sx={{ marginLeft: 2 }}>
          {rightName}
        </Typography>
      </div>

      {/* Two Tables */}
      <div className="flex flex-row items-center justify-center gap-4">
        {/* Left Table */}
        {renderTable(leftName, leftScores)}

        {/* Sword Icon */}
        <circle className="rounded-full  p-4 bg-accent">
          <Sword style={{ width: 64, height: 64, color: "var(--purple-light)", }} />
        </circle>

        {/* Right Table */}
        {renderTable(rightName, rightScores)}
      </div>
    </div>
  );
};

export default RivalMode;
