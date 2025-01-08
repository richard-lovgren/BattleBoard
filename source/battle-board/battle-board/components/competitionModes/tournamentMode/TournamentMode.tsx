import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import './tournamentMode.css'

import GeneralButton from '@/components/general-btn'

import Tournament from '@/models/interfaces/tournament'
import TournamentMatch from '@/models/interfaces/tournamentMatch'

// Helper to shuffle arrays
const shuffleArray = (array: string[]): string[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

interface MatchState {
  round_number: number
  match_in_round: number
  player1: string
  player2: string
  winner: string
  localId: string
}

const TournamentMode: React.FC<{ competitionId: string }> = ({ competitionId }) => {
  const [players, setPlayers] = useState<string[]>([])
  const [rounds, setRounds] = useState<MatchState[][]>([])
  const [existingTournament, setExistingTournament] = useState<Tournament | null>(null)

  // ---------------- 1) FETCH PLAYERS ON MOUNT ----------------
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`/api/competitions/users?competitionId=${competitionId}`)
        if (!response.ok) {
          throw new Error(`Error fetching players: ${response.statusText}`)
        }
        const data: string[] = await response.json()
        setPlayers(data)
      } catch (err) {
        console.error('Error fetching players:', err)
      }
    }

    fetchPlayers()
  }, [competitionId])

  // ---------------- 2) FETCH EXISTING TOURNAMENT ON MOUNT ----------------
  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(`/api/competitions/tournament?competitionId=${competitionId}`)
        if (response.ok) {
          const data: Tournament = await response.json()
          console.log('Existing tournament:', data)
          setExistingTournament(data)

          const localRounds = convertMatchesToRounds(data.tournament_matches)
          setRounds(localRounds)
        } else if (response.status === 404) {
          console.log('No existing tournament found.')
        } else {
          console.error('Failed to fetch tournament. Status:', response.status)
        }
      } catch (err) {
        console.error('Error fetching tournament:', err)
      }
    }

    fetchTournament()
  }, [competitionId])

  // ---------------- 3) CONVERT MATCHES → ROUNDS ----------------
  const convertMatchesToRounds = (matches: TournamentMatch[]): MatchState[][] => {
    // Group by round_number
    const roundsMap: Record<number, MatchState[]> = {}
    for (const m of matches) {
      if (!roundsMap[m.round_number]) {
        roundsMap[m.round_number] = []
      }
      roundsMap[m.round_number].push({
        round_number: m.round_number,
        match_in_round: m.match_in_round,
        player1: m.player_1 || '',
        player2: m.player_2 || '',
        winner: m.winner || '',
        localId: `round${m.round_number}-match${m.match_in_round}`
      })
    }

    const sortedRounds: MatchState[][] = Object.keys(roundsMap)
      .map(Number)
      .sort((a, b) => a - b)
      .map(roundNum =>
        roundsMap[roundNum].sort((a, b) => a.match_in_round - b.match_in_round)
      )

    return sortedRounds
  }

  // ---------------- 4) START TOURNAMENT ----------------
  const startTournament = async (): Promise<void> => {
    // Don’t recreate a tournament if one exists
    if (existingTournament) {
      alert('A tournament already exists for this competition.')
      return
    }

    // at least 2 players to start a bracket
    if (players.length < 2) {
      alert('Not enough players to start a tournament.')
      return
    }

    const shuffledPlayers = shuffleArray(players)
    const n = shuffledPlayers.length
    const totalRounds = Math.ceil(players.length / 2)
    console.log('Total rounds:', totalRounds)

    const allMatches: TournamentMatch[] = []
    let matchInRound = 1

    // First round players
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      allMatches.push({
        round_number: 1,
        match_in_round: matchInRound++,
        player_1: shuffledPlayers[i],
        // If odd # of players, the last one becomes an empty match i.e. a bye
        player_2: shuffledPlayers[i + 1] || null,
        winner: null
      })
    }

    console.log('Round 1 matches:', allMatches)

    let currentPlayersCount = n / 2

    // ---------------- Subsequent Rounds ----------------
    for (let round = 2; round <= totalRounds; round++) {

      const matchesInRound = currentPlayersCount / 2;

      console.log(`Round ${round} matches:`, matchesInRound)

      let matchInRound = 1;

      for (let i = 0; i < matchesInRound; i++) {
        console.log(`Round ${round} match ${matchInRound}`)
        allMatches.push({
          round_number: round,
          match_in_round: matchInRound++,
          player_1: null,
          player_2: null,
          winner: null
        })
      }

      currentPlayersCount /= 2;

    }

    // Build the new tournament object
    const newTournament: Tournament = {
      competition_id: competitionId,
      number_of_players: n,
      tournament_matches: allMatches
    }

    try {
      const response = await fetch(`/api/competitions/tournament`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTournament)
      })
      if (response.ok) {
        console.log('Tournament created successfully.')
        setExistingTournament(newTournament)

        const localRounds = convertMatchesToRounds(allMatches)
        setRounds(localRounds)
      } else {
        const errorText = await response.text()
        console.error('Error creating tournament:', errorText)
        alert(`Error creating tournament: ${errorText}`)
      }
    } catch (error) {
      console.error('Error creating tournament:', error)
      alert(`Error creating tournament: ${error}`)
    }
  }

  // ---------------- 5) HANDLE WINNER CLICK ----------------
  const handlePlayerClick = async (
    winner: string,
    roundIndex: number,
    matchIndex: number
  ): Promise<void> => {
    // Update local state optimistically hehe
    setRounds(prevRounds => {
      const updatedRounds = [...prevRounds]
      const match = { ...updatedRounds[roundIndex][matchIndex] }
      match.winner = winner
      updatedRounds[roundIndex][matchIndex] = match
      return updatedRounds
    })

    if (!existingTournament) return

    const updatedMatches: TournamentMatch[] = []
    for (const round of rounds) {
      for (const m of round) {
        updatedMatches.push({
          round_number: m.round_number,
          match_in_round: m.match_in_round,
          player_1: m.player1 || null,
          player_2: m.player2 || null,
          winner: m.winner || null
        })
      }
    }

    const target = updatedMatches.find(
      x =>
        x.round_number === rounds[roundIndex][matchIndex].round_number &&
        x.match_in_round === rounds[roundIndex][matchIndex].match_in_round
    )
    if (target) {
      target.winner = winner
    }

    const updatedTournament: Tournament = {
      ...existingTournament,
      tournament_matches: updatedMatches
    }

    try {
      const response = await fetch(`/api/competitions/tournament`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTournament)
      })
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error updating match winner:', errorText)
        // Should probably revert if fail
      }
    } catch (err) {
      console.error('Error updating match winner:', err)
    }
  }

  // ---------------- 6) RENDERING ----------------
  return (
    <Box className="tournament-container">
      {(!existingTournament || rounds.length === 0) && (
        <GeneralButton onClick={startTournament} text="Start Tournament" />
      )}

      <Box className="all-rounds-container">
        {rounds.map((round, roundIndex) => (
          <Box className="round-container-and-title" key={roundIndex}>
            <Typography className="h3">Round {roundIndex + 1}</Typography>
            <Box className="round-container">
              {round.map((match, matchIndex) => (
                <Box key={match.localId} className="match-container">
                  <Box
                    className={`player-box ${
                      match.winner === match.player1 ? 'player-box-winner' : ''
                    }`}
                    onClick={() => handlePlayerClick(match.player1, roundIndex, matchIndex)}
                  >
                    {match.player1 || 'N/A'}
                  </Box>
                  <Box
                    className={`player-box ${
                      match.winner === match.player2 ? 'player-box-winner' : ''
                    }`}
                    onClick={() => handlePlayerClick(match.player2, roundIndex, matchIndex)}
                  >
                    {match.player2 || 'N/A'}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default TournamentMode