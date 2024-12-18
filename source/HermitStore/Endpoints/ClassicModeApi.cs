using HermitStore;
using Microsoft.AspNetCore.StaticAssets;
using Microsoft.EntityFrameworkCore;

public static class ClassicModeApi
{
    public static void MapClassicModeEndpoints(this WebApplication app)
    {
        app.MapPost(
                "/competition/classic",
                async (HermitDbContext dbContext, LeaderboardDto leaderboardDto) =>
                    await CreateLeaderboard(dbContext, leaderboardDto)
            )
            .Produces<Competition>(StatusCodes.Status201Created)
            .WithDescription("Create a new leaderboard for a classic mode competition.")
            .Produces(StatusCodes.Status400BadRequest);

        app.MapGet(
                "/competition/classic/{competition_id}",
                async (HermitDbContext dbContext, Guid competition_id) =>
                    await GetLeaderboardByCompetitionId(dbContext, competition_id)
            )
            .Produces<Competition>(StatusCodes.Status200OK)
            .WithDescription("Get a leaderboard by competition id.")
            .Produces(StatusCodes.Status404NotFound);

        app.MapPost(
                "/competition/classic/metric",
                async (HermitDbContext dbContext, LeaderboardMetricDto leaderboardMetricDto) =>
                    await AddMetric(dbContext, leaderboardMetricDto)
            )
            .Produces<Competition>(StatusCodes.Status201Created)
            .WithDescription("Add a metric to a classic mode leaderboard.")
            .Produces(StatusCodes.Status400BadRequest);

        app.MapPut(
                "/competition/classic/metric/value",
                async (HermitDbContext dbContext, LeaderboardEntryDto leaderboardEntryDto) =>
                    await AddOrUpdateMetricValue(dbContext, leaderboardEntryDto)
            )
            .Produces<Competition>(StatusCodes.Status200OK)
            .WithDescription("Update a metric value for a classic mode leaderboard.")
            .Produces(StatusCodes.Status201Created)
            .WithDescription("Create a new metric value for a classic mode leaderboard.")
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound);

        app.MapGet(
                "/competition/classic/{competition_id}/{user_name}/{metric_name}",
                async (
                    HermitDbContext dbContext,
                    Guid competition_id,
                    string user_name,
                    string metric_name
                ) => await GetUserSumForMetric(dbContext, competition_id, metric_name, user_name)
            )
            .Produces<Competition>(StatusCodes.Status200OK)
            .WithDescription("Get the sum of a user's metric value for a classic mode leaderboard.")
            .Produces(StatusCodes.Status404NotFound);

        Console.WriteLine("Classic mode endpoints mapped.");
    }

    private static async Task<IResult> CreateLeaderboard(
        HermitDbContext dbContext,
        LeaderboardDto leaderboardDto
    )
    {
        var leaderboard = new Leaderboard
        {
            id = Guid.NewGuid(),
            competition_id = leaderboardDto.competition_id,
        };

        dbContext.leaderboard.Add(leaderboard);

        await dbContext.SaveChangesAsync();

        return Results.Created($"/leaderboards/{leaderboard.id}", leaderboard);
    }

    private static async Task<IResult> GetLeaderboardByCompetitionId(
        HermitDbContext dbContext,
        Guid competition_id
    )
    {
        var leaderboard = await dbContext.leaderboard.FirstOrDefaultAsync(l =>
            l.competition_id == competition_id
        );

        if (leaderboard == null)
        {
            return Results.NotFound();
        }

        return Results.Ok(leaderboard);
    }

    private static async Task<IResult> AddMetric(
        HermitDbContext dbContext,
        LeaderboardMetricDto leaderboardMetricDto
    )
    {
        var leaderboardMetric = new LeaderboardMetric
        {
            id = Guid.NewGuid(),
            leaderboard_id = leaderboardMetricDto.leaderboard_id,
            metric_name = leaderboardMetricDto.metric_name,
        };

        dbContext.leaderboard_metric.Add(leaderboardMetric);

        await dbContext.SaveChangesAsync();

        return Results.Created($"/leaderboards/{leaderboardMetric.id}", leaderboardMetric);
    }

    private static async Task<IResult> AddOrUpdateMetricValue(
        HermitDbContext dbContext,
        LeaderboardEntryDto leaderboardEntryDto
    )
    {
        if (
            dbContext.leaderboard_entry.FirstOrDefault(l =>
                l.metric_name == leaderboardEntryDto.metric_name
            ) == null
        )
        {
            var leaderboardEntry = new LeaderboardEntry
            {
                id = Guid.NewGuid(),
                leaderboard_id = leaderboardEntryDto.leaderboard_id,
                user_name = leaderboardEntryDto.user_name,
                metric_name = leaderboardEntryDto.metric_name,
                metric_value = leaderboardEntryDto.metric_value,
            };

            dbContext.leaderboard_entry.Add(leaderboardEntry);
            await dbContext.SaveChangesAsync();
            return Results.Created($"/leaderboards/{leaderboardEntry.id}", leaderboardEntry);
        }

        var oldLeaderboardEntry = await dbContext.leaderboard_entry.FirstOrDefaultAsync(l =>
            l.metric_name == leaderboardEntryDto.metric_name
            && l.user_name == leaderboardEntryDto.user_name
            && l.leaderboard_id == leaderboardEntryDto.leaderboard_id
        );

        if (oldLeaderboardEntry == null)
        {
            return Results.NotFound();
        }

        oldLeaderboardEntry.metric_value += leaderboardEntryDto.metric_value;

        await dbContext.SaveChangesAsync();

        return Results.Ok(
            "Metric: "
                + leaderboardEntryDto.metric_name
                + " updated for user: "
                + leaderboardEntryDto.user_name
                + "."
                + " New value: "
                + oldLeaderboardEntry.metric_value
        );
    }

    private static async Task<IResult> GetUserSumForMetric(
        HermitDbContext dbContext,
        Guid competition_id,
        string metric_name,
        string user_name
    )
    {
        var leaderboard = await dbContext.leaderboard.FirstOrDefaultAsync(l =>
            l.competition_id == competition_id
        );

        if (leaderboard == null)
        {
            return Results.NotFound();
        }

        var leaderboardEntry = await dbContext.leaderboard_entry.FirstOrDefaultAsync(l =>
            l.metric_name == metric_name
            && l.user_name == user_name
            && l.leaderboard_id == leaderboard.id
        );

        if (leaderboardEntry == null)
        {
            return Results.NotFound();
        }

        return Results.Ok(leaderboardEntry.metric_value);
    }

    private static async Task<IResult> GetEntireFuckingCompetitionAsMegaJsonObjectMaxxingRot (HermitDbContext dbContext, Guid competition_id)
    {
        var leaderboard = await dbContext.leaderboard.FirstOrDefaultAsync(l => l.competition_id == competition_id);

        if (leaderboard == null)
        {
            return Results.NotFound();
        }

        var column_names = await dbContext.leaderboard_metric.Where(l => l.leaderboard_id == leaderboard.id).Select(l => l.metric_name).ToListAsync();
        column_names.Prepend("Name");

        var user_names = await dbContext.leaderboard_entry.Where(l => l.leaderboard_id == leaderboard.id).Select(l => l.user_name).Distinct().ToListAsync();

        var user_column_values_dict = new Dictionary<string, Dictionary<string, int>>();

        foreach (var user_name in user_names)
        {
            var user_column_values = new Dictionary<string, int>();
            foreach (var column_name in column_names)
            {
                var leaderboardEntry = await dbContext.leaderboard_entry.FirstOrDefaultAsync(l =>
                    l.metric_name == column_name
                    && l.user_name == user_name
                    && l.leaderboard_id == leaderboard.id
                );

                if (leaderboardEntry == null)
                {
                    user_column_values.Add(column_name, 0);
                }
                else
                {
                    user_column_values.Add(column_name, leaderboardEntry.metric_value);
                }
            }

            user_column_values_dict.Add(user_name, user_column_values);
        }

        //var
        return Results.Ok(user_column_values_dict); 
    
    }
}
