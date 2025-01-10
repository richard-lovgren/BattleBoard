import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import GeneralButton from '@/components/general-btn';
import clsx from 'clsx';
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
  const [loading, setLoading] = useState(true);

  const fetchPlayers = useCallback(async () => {
    try {
      const response = await fetch(`/api/competitions/users?competitionId=${competitionId}`);
      if (!response.ok) throw new Error(`Error fetching players: ${response.statusText}`);
      const data: string[] = await response.json();
      setPlayers(data);
    } catch (err) {
      console.error('Error fetching players:', err);
    }
  }, [competitionId]);

  const convertMatchesToRounds = useCallback((matches: TournamentMatch[]): MatchState[][] => {
    const roundsMap: Record<number, MatchState[]> = {};

    matches.forEach((match) => {
      if (!roundsMap[match.round_number]) roundsMap[match.round_number] = [];

      roundsMap[match.round_number].push({
        round_number: match.round_number,
        match_in_round: match.match_in_round,
        player1: match.player_1,
        player2: match.player_2,
        winner: match.winner,
        localId: `round${match.round_number}-match${match.match_in_round}`,
      });
    });

    return Object.keys(roundsMap)
      .map(Number)
      .sort((a, b) => a - b)
      .map((roundNum) =>
        roundsMap[roundNum].sort((a, b) => a.match_in_round - b.match_in_round)
      );
  }, []);

  const fetchTournament = useCallback(async () => {
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
  }, [competitionId, convertMatchesToRounds]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPlayers(), fetchTournament()]).finally(() => setLoading(false));
  }, [fetchPlayers, fetchTournament]);

  const handlePlayerClick = useCallback(
    async (winner: string, roundIndex: number, matchIndex: number) => {
      if (!existingTournament || !winner) return;

      const updatedRounds = structuredClone(rounds);
      const currentMatch = updatedRounds[roundIndex][matchIndex];

      currentMatch.winner = winner;

      if (roundIndex < updatedRounds.length - 1) {
        const nextRound = updatedRounds[roundIndex + 1];
        const nextMatchIndex = Math.floor(matchIndex / 2);
        const nextMatch = nextRound[nextMatchIndex];

        if (nextMatch) {
          if (matchIndex % 2 === 0) {
            nextMatch.player1 = winner;
          } else {
            nextMatch.player2 = winner;
          }
        }
      }

      setRounds(updatedRounds);

      try {
        const updatedMatches: TournamentMatch[] = updatedRounds.flat().map((m) => ({
          round_number: m.round_number,
          match_in_round: m.match_in_round,
          player_1: m.player1,
          player_2: m.player2,
          winner: m.winner,
        }));

        const updatedTournament: Tournament = {
          ...existingTournament,
          tournament_matches: updatedMatches,
        };

        const response = await fetch('/api/competitions/tournament', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTournament),
        });

        if (!response.ok) throw new Error(await response.text());
      } catch (err) {
        console.error('Error updating tournament:', err);
        setRounds(rounds); // Revert changes
      }
    },
    [existingTournament, rounds]
  );

  const startTournament = useCallback(async () => {
    if (existingTournament || players.length < 2) return;

    const shuffledPlayers = players.sort(() => Math.random() - 0.5);
    const totalRounds = Math.ceil(Math.log2(shuffledPlayers.length));
    const allMatches: TournamentMatch[] = [];

    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      allMatches.push({
        round_number: 1,
        match_in_round: Math.floor(i / 2) + 1,
        player_1: shuffledPlayers[i],
        player_2: shuffledPlayers[i + 1] || null,
        winner: null,
      });
    }

    for (let round = 2; round <= totalRounds; round++) {
      const matchesInRound = Math.pow(2, totalRounds - round);
      for (let match = 1; match <= matchesInRound; match++) {
        allMatches.push({
          round_number: round,
          match_in_round: match,
          player_1: null,
          player_2: null,
          winner: null,
        });
      }
    }

    const newTournament: Tournament = {
      competition_id: competitionId,
      number_of_players: shuffledPlayers.length,
      tournament_matches: allMatches,
    };

    try {
      const response = await fetch('/api/competitions/tournament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTournament),
      });

      if (!response.ok) throw new Error(await response.text());

      setExistingTournament(newTournament);
      setRounds(convertMatchesToRounds(allMatches));
    } catch (err) {
      console.error('Error creating tournament:', err);
    }
  }, [competitionId, convertMatchesToRounds, existingTournament, players]);

  const getFinalWinner = useMemo(() => {
    if (!rounds.length) return null;
    const finalRound = rounds[rounds.length - 1];
    return finalRound[0]?.winner || null;
  }, [rounds]);

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

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
                    className={clsx(
                      'player-box',
                      { 'player-box-empty': !match.player1 },
                      { 'player-box-winner': match.winner === match.player1 },
                      { 'player-box-disabled': !match.player1 },
                    )}
                    onClick={() => match.player1 && handlePlayerClick(match.player1, roundIndex, matchIndex)}
                  >
                    {match.player1 || 'N/A'}
                  </Box>
                  <Box
                    className={clsx(
                      'player-box',
                      { 'player-box-empty': !match.player2 },
                      { 'player-box-winner': match.winner === match.player2 },
                      { 'player-box-disabled': !match.player2 },
                    )}
                    onClick={() => match.player2 && handlePlayerClick(match.player2, roundIndex, matchIndex)}
                  >
                    {match.player2 || 'N/A'}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}

        {rounds.length > 0 && (
          <Box className="round-container-and-title">
            <Typography className="h3">Winner</Typography>
            <Box className="round-container">
              <Box className="match-container winner-container">
                <Box className="player-box player-box-winner winner-box">
                  {getFinalWinner || 'Pending...'}
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
