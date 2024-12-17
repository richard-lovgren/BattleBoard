import * as React from 'react'
import { Box, Paper, Typography } from '@mui/material'

export default function PlayerGrid() {
  // Extract column headers dynamically from the first row
  type PlayerType = {
    name: string // Specify that name is a string
  }

  const players: PlayerType[] = [
    { name: 'nattap' },
    { name: 'user2' },
    { name: 'user3' },
    { name: 'user4' },
    { name: 'user5' },
  ]

  // Rename the component to avoid conflict
  const PlayerComponent = ({ player }: { player: PlayerType }) => {
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
        <Typography className='h3'>{player.name}</Typography>
      </Box>
    )
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
        {players.map((player, index) => (
          <PlayerComponent key={index} player={player} />
        ))}
      </Box>
    </Box>
  )
}
