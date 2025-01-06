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

const RivalMode: React.FC = () => {
  // Placeholder data for testing
  const leftName = "Team Alpha";
  const rightName = "Team Beta";

  const leftScores = [100, 90, 85]; // Scores for Team Alpha
  const rightScores = [80, 75, 70]; // Scores for Team Beta

  // Calculate the number of rows (max scores between both players)
  const maxRows = Math.max(leftScores.length, rightScores.length);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {/* Names and Sword */}
      <div className="flex flex-row">
        <p className="text-2xl font-bold">{leftName}</p>
        <Sword
          style={{ width: 32, height: 32, color: "var(--purple-light)" }}
        />
        <p className="text-2xl font-bold">{rightName}</p>
      </div>
      {/* Single Table for Scores */}
      <Box style={{ width: "60vw", margin: "0 10px" }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="rival scores table">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Typography className="h3">{leftName}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography className="h3">{rightName}</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: maxRows }).map((_, rowIndex) => (
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
                  <TableCell
                    align="center"
                    sx={{ color: "white", border: "none" }}
                  >
                    <Typography className="breadText">
                      {leftScores[rowIndex] !== undefined
                        ? leftScores[rowIndex]
                        : "-"}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "white", border: "none" }}
                  >
                    <Typography className="breadText">
                      {rightScores[rowIndex] !== undefined
                        ? rightScores[rowIndex]
                        : "-"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default RivalMode;
