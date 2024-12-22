import * as React from 'react'
import { Box, Typography } from '@mui/material'

const noPlayersBox = (
  <Box
    style={{
      width: '95vw',
      margin: '40px',
      border: '3px solid #fff',
      borderRadius: '15px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      padding: '50px',
    }}
  >
    <Typography className="h2">Players</Typography>
    <Typography className="h3" style={{ color: 'gray' }}>
      No players available.
    </Typography>
  </Box>
);

export default function PlayerGrid({ playerList }: { playerList: string[] | null }) {
  // Extract column headers dynamically from the first row

  // Rename the component to avoid conflict
  const PlayerComponent = ({ player }: { player: string }) => {
    return (
      <Box
        style={{
          background: 'var(--purple-light)',
          width: '200px',
          borderRadius: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography className='h3'>{player}</Typography>
      </Box>
    )
  }

  if (!playerList || playerList.length === 0) {
    return noPlayersBox;
  }

  return (
    <Box
      style={{
        width: '95vw',
        margin: '40px',
        border: '3px solid #fff',
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        padding:'50px'
      }}
    >
      <Typography className='h2'>Players</Typography>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {playerList.map((player, index) => (
          <PlayerComponent key={index} player={player} />
        ))}
      </Box>
    </Box>
  )
}
