using HermitStore;
using Microsoft.EntityFrameworkCore;

public static class TournamentModeApi
{
    public static void MapTournamentModeEndpoints(this WebApplication app)
    {
        app.MapPost(
            "/competition/tournament",
            async (HermitDbContext db, TournamentMegaObjDto tournamentMegaObjDto) =>
            {
                var result = await CreateOrUpdateTournament(db, tournamentMegaObjDto);
                return result;
            }
        );

        app.MapGet(
            "/competition/{competition_id}/tournament",
            async (HermitDbContext db, Guid competition_id) =>
            {
                var result = await GetTournamentMegaObj(db, competition_id);
                return result;
            }
        );

        Console.WriteLine("Tournament mode endpoints mapped!");
    }

    private static async Task<IResult> CreateTournament(
        HermitDbContext dbContext,
        TournamentMegaObjDto tournamentMegaObjDto
    )
    {
        try
        {
            var tournament = new Tournament
            {
                id = Guid.NewGuid(),
                competition_id = tournamentMegaObjDto.competition_id,
                number_of_players = tournamentMegaObjDto.number_of_players,
            };

            await dbContext.tournament.AddAsync(tournament);
            await dbContext.SaveChangesAsync();

            var tournamentMatchDtos = tournamentMegaObjDto.tournament_matches;

            var number_of_players = tournamentMegaObjDto.number_of_players;
            var number_of_tournament_match_dtos = tournamentMatchDtos.Count;

            //Handle bye rounds and if that doesn't match, throw an error

            if (number_of_players % 2 != 0)
            {
                number_of_players++;
            }

            if (number_of_tournament_match_dtos != number_of_players - 1)
            {
                return Results.BadRequest(
                    "Number of tournament matches does not match the number of players"
                );
            }

            var expectedMatchesPerRound = new Dictionary<int, int>();
            var totalRounds = (int)Math.Ceiling(Math.Log2(number_of_players));
            for (int i = 0; i < totalRounds; i++)
            {
                expectedMatchesPerRound[i + 1] = (int)Math.Pow(2, totalRounds - i - 1);
            }

            foreach (var group in tournamentMatchDtos.GroupBy(m => m.round_number))
            {
                if (group.Count() != expectedMatchesPerRound[group.Key])
                {
                    return Results.BadRequest($"Round {group.Key} has an incorrect number of matches.");
                }
            }

            foreach (var tournamentMatchDto in tournamentMatchDtos)
            {
                var tournamentMatch = new TournamentMatch
                {
                    tournament_id = tournament.id,
                    round_number = tournamentMatchDto.round_number,
                    match_in_round = tournamentMatchDto.match_in_round,
                    player_1 = tournamentMatchDto.player_1,
                    player_2 = tournamentMatchDto.player_2,
                    winner = tournamentMatchDto.winner,
                };

                await dbContext.tournament_match.AddAsync(tournamentMatch);
                await dbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            return Results.InternalServerError(e.Message);
        }

        Console.WriteLine("Tournament created successfully!");

        return Results.Ok();
    }

    private static async Task<IResult> UpdateTournament(
        HermitDbContext dbContext,
        TournamentMegaObjDto tournamentMegaObjDto,
        Tournament tournament
    )
    {
        try
        {
            foreach (var tournamentMatchDto in tournamentMegaObjDto.tournament_matches)
            {
                var tournamentMatch = await dbContext.tournament_match.FirstOrDefaultAsync(tm =>
                    tm.tournament_id == tournament.id
                    && tm.round_number == tournamentMatchDto.round_number
                    && tm.match_in_round == tournamentMatchDto.match_in_round
                );

                if (tournamentMatch == null)
                {
                    return Results.NotFound("Tournament match not found!");
                }

                tournamentMatch.player_1 = tournamentMatchDto.player_1;
                tournamentMatch.player_2 = tournamentMatchDto.player_2;
                tournamentMatch.winner = tournamentMatchDto.winner;

                dbContext.tournament_match.Update(tournamentMatch);
                await dbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            return Results.InternalServerError(e.Message);
        }

        Console.WriteLine("Tournament updated successfully!");

        return Results.Ok();
    }

    private static async Task<IResult> CreateOrUpdateTournament(
        HermitDbContext db,
        TournamentMegaObjDto tournamentMegaObjDto
    )
    {
        var competition = await db.competition.FirstOrDefaultAsync(c =>
            c.id == tournamentMegaObjDto.competition_id
        );
        if (competition == null)
        {
            return Results.NotFound("Competition not found!");
        }

        var tournament = await db.tournament.FirstOrDefaultAsync(t =>
            t.competition_id == competition.id
        );

        if (tournament == null)
        {
            Console.WriteLine("Creating tournament...");
            return await CreateTournament(db, tournamentMegaObjDto);
        }
        else
        {
            Console.WriteLine("Updating tournament...");
            return await UpdateTournament(db, tournamentMegaObjDto, tournament);
        }
    }

    private static async Task<IResult> GetTournamentMegaObj(
        HermitDbContext dbContext,
        Guid competition_id
    )
    {
        var competition = await dbContext.competition.FirstOrDefaultAsync(c =>
            c.id == competition_id
        );

        if (competition == null)
        {
            return Results.NotFound("Competition not found!");
        }

        var tournament = await dbContext.tournament.FirstOrDefaultAsync(t =>
            t.competition_id == competition.id
        );

        if (tournament == null)
        {
            return Results.NotFound("Tournament not found!");
        }

        var tournamentMatches = await dbContext
            .tournament_match.Where(tm => tm.tournament_id == tournament.id)
            .ToListAsync();

        var tournamentMatchDtos = tournamentMatches
            .Select(tm => new TournamentMatchDto
            {
                round_number = tm.round_number,
                match_in_round = tm.match_in_round,
                player_1 = tm.player_1,
                player_2 = tm.player_2,
                winner = tm.winner,
            })
            .ToList();

        var tournamentMegaObj = new TournamentMegaObjDto
        {
            competition_id = competition.id,
            tournament_matches = tournamentMatchDtos,
            number_of_players = tournament.number_of_players,
        };

        return Results.Ok(tournamentMegaObj);
    }
}
