import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import './tournamentMode.css'

import GeneralButton from '@/components/general-btn' 
interface TournamentModeProps {
  competitionId: string
}

interface Match {
  player1: string
  player2: string
  winner: string
  number: number
  competitionId: string
  id: string
}

const TournamentMatch: React.FC<
  Match & {
    onPlayerClick: (winner: string, matchId: string) => void
    isDisabled: boolean
  }
> = ({ player1, player2, winner, id, onPlayerClick, isDisabled }) => {
  const handleClick = (player: string): void => {
    if (!isDisabled && onPlayerClick) {
      onPlayerClick(player, id)
    }
  }

  return (
    <Box className='match-container'>
      <Box
        className={`player-box player-box-border ${
          isDisabled ? 'player-box-disabled' : ''
        } ${winner === player1 ? 'player-box-winner' : 'player-box-no-winner'}`}
        onClick={() => handleClick(player1)}
      >
        {player1}
      </Box>
      <Box
        className={`player-box ${isDisabled ? 'player-box-disabled' : ''} ${
          winner === player2 && winner !== ''
            ? 'player-box-winner'
            : 'player-box-no-winner'
        }`}
        onClick={() => handleClick(player2)}
      >
        {player2 !== '' ? player2 : 'No opponent'}
      </Box>
    </Box>
  )
}

const TournamentMode: React.FC<TournamentModeProps> = ({ competitionId }) => {
  const [players, setPlayers] = useState<string[]>([
    'player1',
    'player2',
    'player3',
    'player4',
    'player5',
    'player6',
    'player7',
    'player8',
    'player9',
    'player10',
    'player11',

  ])
  const [rounds, setRounds] = useState<Match[][]>([])

  console.log(rounds)
  const lastRound = Math.ceil(Math.log2(players.length)) === rounds.length

  const allWinnersSelected =
    rounds.length > 0
      ? rounds[rounds.length - 1].every((match) => match.winner !== '')
      : false

  const shuffleArray = (array: string[]): string[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const startTournament = (): void => {
    const shuffledPlayers = shuffleArray(players)
    const firstRoundMatches = shuffledPlayers.reduce<Match[]>(
      (acc, player, index, arr) => {
        if (index % 2 === 0) {
          const match: Match = {
            player1: player,
            player2: arr[index + 1] || '',
            winner: '',
            number: acc.length,
            competitionId: competitionId,
            id: `round0-match${acc.length}`, // Include round number in the ID
          }
          acc.push(match)
        }
        return acc
      },
      []
    )

    setRounds([firstRoundMatches])
  }

  const generateNextRound = (): void => {
    const lastRoundMatches = rounds[rounds.length - 1]
    const winners = lastRoundMatches.map((match) => match.winner)

    const newRoundMatches = shuffleArray(winners).reduce<Match[]>(
      (acc, player, index, arr) => {
        if (index % 2 === 0) {
          const match: Match = {
            player1: player,
            player2: arr[index + 1] || '',
            winner: '',
            number: acc.length + lastRoundMatches.length,
            competitionId: competitionId,
            id: `round${rounds.length}-match${acc.length}`, // Include round number in the ID
          }
          acc.push(match)
        }
        return acc
      },
      []
    )

    setRounds((prevRounds) => [...prevRounds, newRoundMatches])
  }

  const handlePlayerClick = (winner: string, matchId: string): void => {
    setRounds((prevRounds) => {
      const updatedRounds = prevRounds.map((round) =>
        round.map((match) =>
          match.id === matchId ? { ...match, winner } : match
        )
      )
      return updatedRounds
    })
  }

  return (
    <Box className='tournament-container'>
      <Box>
        {rounds.length === 0 && (
          <GeneralButton onClick={startTournament} text='Start Tournament' />
        )}

        {!lastRound && allWinnersSelected && (
          <GeneralButton onClick={generateNextRound} text='Next Round' />
        )}
      </Box>

      <Box className='all-rounds-container'>
        {rounds.map((round, roundIndex) => (
          <Box className='round-container-and-title' key={roundIndex}>
            <Typography className='h3'>Round {roundIndex + 1}</Typography>

            <Box key={roundIndex} className='round-container'>
              {round.map((match) => (
                <TournamentMatch
                  key={match.id}
                  {...match}
                  onPlayerClick={handlePlayerClick}
                  isDisabled={roundIndex < rounds.length - 1} // Disable matches from previous rounds
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default TournamentMode
