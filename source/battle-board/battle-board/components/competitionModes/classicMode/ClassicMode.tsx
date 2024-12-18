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

// type for a single row
type RowData = {
  [key: string]: string | number // allow both strings and numbers
}

// Interface for the ClassicMode components props
interface ClassicModeProps {
  Rows: RowData[];
}

const ClassicMode: React.FC<ClassicModeProps> = ({ Rows }) => {
  const columns = Rows.length > 0 ? Object.keys(Rows[0]) : []

  if (columns.length === 0) {
    return (
      <div className="flex">
        <h1 className="font-bold text-2xl">Input some data to visualize it!</h1>
      </div>
    );
  }

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
            {Rows.map((row, rowIndex) => (
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
