import * as React from 'react'
import {
  Box,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Typography
} from '@mui/material'

// type for a single row
type RowData = {
  [key: string]: string | number // allow both strings and numbers
}

// JSON data
const rows: RowData[] = [
  { rank: 1, name: 'nattap', calories: 159, fat: 6.0, carbs: 24, protein: 4.0 },
  { rank: 2, name: 'user2', calories: 237, fat: 9.0, carbs: 37, protein: 4.3 },
  { rank: 3, name: 'user3', calories: 262, fat: 16.0, carbs: 24, protein: 6.0 },
  { rank: 4, name: 'user4', calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
  { rank: 5, name: 'user5', calories: 356, fat: 16.0, carbs: 49, protein: 3.9 },
]

export default function ClassicMode() {
  const columns = rows.length > 0 ? Object.keys(rows[0]) : []

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
                  <TableCell key={column} sx={{ color: 'white', border:'none' }}>
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
