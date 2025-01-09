import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import GeneralButton from '@/components/general-btn';
import "./tournamentMode.css";

interface TournamentMatch {
  round_number: number;
  match_in_round: number;
  player_1: string | null;
  player_2: string | null;
  winner: string | null;
}

interface Tournament {
  competition_id: string;
  number_of_players: number;
  tournament_matches: TournamentMatch[];
}

interface MatchState {
  round_number: number;
  match_in_round: number;
  player1: string | null;
  player2: string | null;
  winner: string | null;
  localId: string;
}

interface TournamentModeProps {
  competitionId: string;
}

const TournamentMode: React.FC<TournamentModeProps> = ({ competitionId }) => {
  const [players, setPlayers] = useState<string[]>([]);
  const [rounds, setRounds] = useState<MatchState[][]>([]);
  const [existingTournament, setExistingTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    const fetchPlayers = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/competitions/users?competitionId=${competitionId}`);
        if (!response.ok) {
          throw new Error(`Error fetching players: ${response.statusText}`);
        }
        const data: string[] = await response.json();
        setPlayers(data);
      } catch (err) {
        console.error('Error fetching players:', err);
      }
    };

    fetchPlayers();
  }, [competitionId]);

  useEffect(() => {
    const fetchTournament = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/competitions/tournament?competitionId=${competitionId}`);
        if (response.ok) {
          const data: Tournament = await response.json();
          setExistingTournament(data);
          setRounds(convertMatchesToRounds(data.tournament_matches));
        }
      } catch (err) {
        console.error('Error fetching tournament:', err);
      }
    };

    fetchTournament();
  }, [competitionId]);

  const convertMatchesToRounds = (matches: TournamentMatch[]): MatchState[][] => {
    const roundsMap: Record<number, MatchState[]> = {};
    
    matches.forEach((match) => {
      if (!roundsMap[match.round_number]) {
        roundsMap[match.round_number] = [];
      }
      
      roundsMap[match.round_number].push({
        round_number: match.round_number,
        match_in_round: match.match_in_round,
        player1: match.player_1,
        player2: match.player_2,
        winner: match.winner,
        localId: `round${match.round_number}-match${match.match_in_round}`
      });
    });

    return Object.keys(roundsMap)
      .map(Number)
      .sort((a, b) => a - b)
      .map(roundNum => 
        roundsMap[roundNum].sort((a, b) => a.match_in_round - b.match_in_round)
      );
  };

  const handlePlayerClick = async (
    winner: string,
    roundIndex: number,
    matchIndex: number
  ): Promise<void> => {
    if (!existingTournament || !winner) return;

    const updatedRounds = JSON.parse(JSON.stringify(rounds)) as MatchState[][];
    const currentMatch = updatedRounds[roundIndex][matchIndex];
    
    currentMatch.winner = winner;

    // Update next round's match if not in final round
    if (roundIndex < updatedRounds.length - 1) {
      const nextRound = roundIndex + 1;
      const nextMatchIndex = Math.floor(matchIndex / 2);
      const isFirstPlayer = matchIndex % 2 === 0;
      
      if (updatedRounds[nextRound] && updatedRounds[nextRound][nextMatchIndex]) {
        const nextMatch = updatedRounds[nextRound][nextMatchIndex];
        if (isFirstPlayer) {
          nextMatch.player1 = winner;
        } else {
          nextMatch.player2 = winner;
        }
      }
    }

    setRounds(updatedRounds);

    const updatedMatches: TournamentMatch[] = updatedRounds.flat().map(m => ({
      round_number: m.round_number,
      match_in_round: m.match_in_round,
      player_1: m.player1,
      player_2: m.player2,
      winner: m.winner
    }));

    const updatedTournament: Tournament = {
      ...existingTournament,
      tournament_matches: updatedMatches
    };

    try {
      const response = await fetch('/api/competitions/tournament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTournament)
      });
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
    } catch (err) {
      console.error('Error updating tournament:', err);
      setRounds(rounds); // Revert on error
    }
  };

  const startTournament = async (): Promise<void> => {
    if (existingTournament || players.length < 2) return;

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const totalRounds = Math.ceil(Math.log2(shuffledPlayers.length));
    const allMatches: TournamentMatch[] = [];

    // First round matches
    let matchInRound = 1;
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      allMatches.push({
        round_number: 1,
        match_in_round: matchInRound++,
        player_1: shuffledPlayers[i],
        player_2: i + 1 < shuffledPlayers.length ? shuffledPlayers[i + 1] : null,
        winner: null
      });
    }

    // Subsequent rounds
    for (let round = 2; round <= totalRounds; round++) {
      const matchesInRound = Math.pow(2, totalRounds - round);
      for (let match = 1; match <= matchesInRound; match++) {
        allMatches.push({
          round_number: round,
          match_in_round: match,
          player_1: null,
          player_2: null,
          winner: null
        });
      }
    }

    const newTournament: Tournament = {
      competition_id: competitionId,
      number_of_players: shuffledPlayers.length,
      tournament_matches: allMatches
    };

    try {
      const response = await fetch('/api/competitions/tournament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTournament)
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setExistingTournament(newTournament);
      setRounds(convertMatchesToRounds(allMatches));
    } catch (err) {
      console.error('Error creating tournament:', err);
    }
  };

  const getFinalWinner = (): string | null => {
    if (!rounds.length) return null;
    const finalRound = rounds[rounds.length - 1];
    if (!finalRound || !finalRound[0]) return null;
    return finalRound[0].winner;
  };

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
                    className={`player-box ${!match.player1 ? 'player-box-empty' : ''} 
                    ${match.winner && match.winner === match.player1 ? 'player-box-winner' : ''} 
                    ${match.player1 ? 'player-box-filled' : 'player-box-disabled'} 
                    player-box-border`}
                    onClick={() => match.player1 && handlePlayerClick(match.player1, roundIndex, matchIndex)}
                  >
                    {match.player1 || 'N/A'}
                  </Box>
                  <Box
                    className={`player-box ${match.winner === match.player2 ? 'player-box-winner' : 'player-box-no-winner'}
                              ${!match.player2 ? 'player-box-disabled' : ''}`}
                    onClick={() => match.player2 && handlePlayerClick(match.player2, roundIndex, matchIndex)}
                  >
                    {match.player2 || 'N/A'}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}

        {/* Winner bracket */}
        {rounds.length > 0 && (
          <Box className="round-container-and-title">
            <Typography className="h3">Winner</Typography>
            <Box className="round-container">
              <Box className="match-container winner-container">
                <Box
                  className={`player-box player-box-winner winner-box`}
                >
                  {getFinalWinner() || 'Pending...'}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TournamentMode;
