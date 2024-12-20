import * as React from 'react'
import {
  Box,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Typography
} from '@mui/material'

import fetchClassicLeaderBoard from '@/lib/leaderboard/fetchClassicLeaderBoard'

interface ClassidModeProps {
  competitionId: string
}

const ClassicMode: React.FC<ClassidModeProps> = async ({ competitionId }) => {

  const leaderboardData = await fetchClassicLeaderBoard(competitionId);

  const rows = leaderboardData?.leaderboard_entries || [];

  const columns = leaderboardData?.column_names ? Object.keys(rows[0]) : []

  return (
    <Box style={{ width: '60vw', margin: '0 0 100px 0' }}>
      <TableContainer >
        <Table sx={{ minWidth: 650 }} aria-label="dynamic table">
          <TableHead>
            <TableRow >
              {columns.map((column) => (
                <TableCell key={column}>
                  <Typography className="h3">{column}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody >
            {rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{
                  backgroundColor: rowIndex % 2 === 0 ? 'var(--purple-light)' : 'var(--purple-lighter)',
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column} sx={{ color: 'white', border: 'none' }}>
                    <Typography className="breadText">{row[column]}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ClassicMode;
