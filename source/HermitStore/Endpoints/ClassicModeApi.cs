using HermitStore;
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
            .Produces<Leaderboard>(StatusCodes.Status201Created)
            .WithDescription("Create a new leaderboard for a classic mode competition.")
            .Produces(StatusCodes.Status400BadRequest);

        app.MapGet(
                "/competition/classic/{competition_id}",
                async (HermitDbContext dbContext, Guid competition_id) =>
                    await GetLeaderboardByCompetitionId(dbContext, competition_id)
            )
            .Produces<Leaderboard>(StatusCodes.Status200OK)
            .WithDescription("Get a leaderboard by competition id.")
            .Produces(StatusCodes.Status404NotFound);

        app.MapPost(
                "/competition/classic/metric",
                async (HermitDbContext dbContext, LeaderboardMetricDto leaderboardMetricDto) =>
                    await AddMetric(dbContext, leaderboardMetricDto)
            )
            .Produces<LeaderboardMetric>(StatusCodes.Status201Created)
            .WithDescription("Add a metric to a classic mode leaderboard.")
            .Produces(StatusCodes.Status400BadRequest);

        app.MapPut(
                "/competition/classic/metric/value",
                async (HermitDbContext dbContext, LeaderboardEntryDto leaderboardEntryDto) =>
                    await AddOrUpdateMetricValue(dbContext, leaderboardEntryDto)
            )
            .Produces<LeaderboardEntry>(StatusCodes.Status200OK)
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
            .Produces<LeaderboardEntry>(StatusCodes.Status200OK)
            .WithDescription("Get the sum of a user's metric value for a classic mode leaderboard.")
            .Produces(StatusCodes.Status404NotFound);

        app.MapGet(
                "/competition/{competition_id}/leaderboard",
                async (HermitDbContext dbContext, Guid competition_id) =>
                    await GetLeaderboardMegaObj(dbContext, competition_id)
            )
            .Produces<LeaderboardMegaObj>(StatusCodes.Status200OK)
            .WithDescription("Get an all you need object for displaying a leaderboard.")
            .Produces(StatusCodes.Status404NotFound);

        app.MapPost(
                "/competition/{competition_id}/leaderboard",
                async (HermitDbContext dbContext, LeaderboardMegaObjDto leaderboardMegaObjDto) =>
                    await createOrUpdateLeaderboard(dbContext, leaderboardMegaObjDto)
            )
            .Produces<Leaderboard>(StatusCodes.Status201Created)
            .WithDescription("Create a leaderboard.")
            .Produces<Leaderboard>(StatusCodes.Status200OK)
            .WithDescription("Update a leaderboard.")
            .Produces(StatusCodes.Status404NotFound);

        app.MapPut(
                "/competition/{competition_id}/leaderboard",
                async (HermitDbContext dbContext, LeaderboardMegaObjDto leaderboardMegaObjDto) =>
                    await incrementLeaderboard(dbContext, leaderboardMegaObjDto)
            )
            .Produces<Leaderboard>(StatusCodes.Status200OK)
            .WithDescription("Update a leaderboard.")
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
            leaderboard_id = leaderboardMetricDto.leaderboard_id,
            metric_name = leaderboardMetricDto.metric_name,
        };

        dbContext.leaderboard_metric.Add(leaderboardMetric);

        await dbContext.SaveChangesAsync();

        return Results.Created(
            $"/leaderboards/{leaderboardMetric.leaderboard_id}, {leaderboardMetric.metric_name}",
            leaderboardMetric
        );
    }

    private static async Task<IResult> AddOrUpdateMetricValue(
        HermitDbContext dbContext,
        LeaderboardEntryDto leaderboardEntryDto
    )
    {
        var entryExists =
            dbContext
                .leaderboard_entry.Where(l =>
                    l.metric_name == leaderboardEntryDto.metric_name
                    && l.user_name == leaderboardEntryDto.user_name
                )
                .ToList()
                .Count != 0;

        if (!entryExists)
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

    private static async Task<IResult> GetLeaderboardMegaObj(
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

        List<string> column_names = ["name"];
        var columns = await dbContext
            .leaderboard_metric.Where(l => l.leaderboard_id == leaderboard.id)
            .Select(l => l.metric_name)
            .OrderBy(l => l)
            .ToListAsync();

        column_names = columns != null ? [.. column_names, .. columns] : column_names;

        var user_names = await dbContext
            .leaderboard_entry.Where(l => l.leaderboard_id == leaderboard.id)
            .Select(l => l.user_name)
            .Distinct()
            .ToListAsync();

        List<Dictionary<string, string>> leaderboad_entries = [];

        LeaderboardMegaObj? megaObj = null;
        foreach (var user_name in user_names)
        {
            var user_column_values = new Dictionary<string, string>();
            foreach (var column_name in column_names)
            {
                var leaderboardEntry = await dbContext.leaderboard_entry.FirstOrDefaultAsync(l =>
                    l.metric_name == column_name
                    && l.user_name == user_name
                    && l.leaderboard_id == leaderboard.id
                );

                if (leaderboardEntry == null)
                {
                    if (column_name == "name")
                    {
                        user_column_values.Add(column_name, user_name);
                    }
                    else
                    {
                        user_column_values.Add(column_name, "0");
                    }
                }
                else
                {
                    user_column_values.Add(column_name, leaderboardEntry.metric_value.ToString());
                }
            }

            leaderboad_entries.Add(user_column_values);

            megaObj = new LeaderboardMegaObj()
            {
                competition_id = competition_id,
                leaderboard_id = leaderboard.id,
                leaderboard_entries = leaderboad_entries,
                column_names = column_names,
            };
        }
        return megaObj != null ? Results.Ok(megaObj) : Results.NotFound();
    }

    private static async Task<Leaderboard> CreateNewLeaderboardDB(
        HermitDbContext dbContext,
        LeaderboardMegaObjDto leaderboardMegaObjDto
    )
    {
        var leaderboard = new Leaderboard
        {
            id = Guid.NewGuid(),
            competition_id = leaderboardMegaObjDto.competition_id,
        };

        dbContext.leaderboard.Add(leaderboard);
        await dbContext.SaveChangesAsync();

        var metrics = leaderboardMegaObjDto.column_names.Where(c => c != "name").ToList();
        foreach (var metric in metrics)
        {
            var leaderboardMetric = new LeaderboardMetric
            {
                leaderboard_id = leaderboard.id,
                metric_name = metric,
            };

            dbContext.leaderboard_metric.Add(leaderboardMetric);
        }
        await dbContext.SaveChangesAsync();

        var leaderboad_entries = leaderboardMegaObjDto.leaderboard_entries;
        foreach (var leaderboard_entry in leaderboad_entries)
        {
            var user_name = leaderboard_entry["name"];
            foreach (var metric in metrics)
            {
                var leaderboardEntry = new LeaderboardEntry
                {
                    id = Guid.NewGuid(),
                    leaderboard_id = leaderboard.id,
                    user_name = user_name,
                    metric_name = metric,
                    metric_value = leaderboard_entry[metric],
                };

                dbContext.leaderboard_entry.Add(leaderboardEntry);
            }
        }

        await dbContext.SaveChangesAsync();

        Console.WriteLine("Leaderboard created.");
        return leaderboard;
    }

    private static async Task<Leaderboard?> UpdateLeaderboardDB(
        HermitDbContext dbContext,
        Leaderboard leaderboard,
        LeaderboardMegaObjDto leaderboardMegaObjDto
    )
    {
        var metrics = leaderboardMegaObjDto.column_names.Where(c => c != "name").ToList();
        var leaderboad_entries = leaderboardMegaObjDto.leaderboard_entries;
        var user_names = leaderboad_entries.Select(l => l["name"]).ToList();

        foreach (var user_name in user_names)
        {
            foreach (var metric in metrics)
            {
                var leaderboardEntry = await dbContext.leaderboard_entry.FirstOrDefaultAsync(l =>
                    l.metric_name == metric
                    && l.user_name == user_name
                    && l.leaderboard_id == leaderboard.id
                );

                if (leaderboardEntry == null)
                {
                    Console.WriteLine("\nLeaderboard entry not found. Aborting.\n" +
                    "Metric: " + metric + "\n" +
                    "User: " + user_name + "\n" +
                    "Leaderboard id: " + leaderboard.id);
                    return null;
                }

                var metric_value = leaderboardMegaObjDto
                    .leaderboard_entries.Where(l => l["name"] == user_name)
                    .Select(l => l[metric])
                    .FirstOrDefault();

                if (metric_value == null)
                {
                    Console.WriteLine("Metric value not found. Aborting.");
                    return null;
                }
                leaderboardEntry.metric_value = metric_value;
                await dbContext.SaveChangesAsync();
            }
        }
        Console.WriteLine("\nLeaderboard updated.\n");
        return leaderboard;
    }

    private static async Task<IResult> createOrUpdateLeaderboard(
        HermitDbContext dbContext,
        LeaderboardMegaObjDto leaderboardMegaObjDto
    )
    {
        var leaderboard = await dbContext.leaderboard.FirstOrDefaultAsync(l =>
            l.competition_id == leaderboardMegaObjDto.competition_id
        );

        if (leaderboard == null)
        {
            Console.WriteLine("\n Chose to create new leaderboard. \n");
            leaderboard = await CreateNewLeaderboardDB(dbContext, leaderboardMegaObjDto);
            return Results.Created($"/leaderboards/{leaderboard.id}", leaderboard);
        }

        Console.WriteLine("\nLeaderboard found: " + leaderboard.id + "\n");
        Console.WriteLine("\n Chose to update leaderboard. \n");

        var updatedLeaderboard = await UpdateLeaderboardDB(
            dbContext,
            leaderboard,
            leaderboardMegaObjDto
        );

        return Results.Ok(updatedLeaderboard);
    }

    private static async Task<IResult> incrementLeaderboard(HermitDbContext dbContext, LeaderboardMegaObjDto leaderboardMegaObjDto)
    {
        var leaderboard = await dbContext.leaderboard.FirstOrDefaultAsync(l =>
            l.competition_id == leaderboardMegaObjDto.competition_id
        );

        if (leaderboard == null)
        {
            Console.WriteLine("\nLeaderboard not found. Aborting.\n");
            return Results.NotFound();
        }

        var metrics = leaderboardMegaObjDto.column_names.Where(c => c != "name").ToList();
        var leaderboad_entries = leaderboardMegaObjDto.leaderboard_entries;
        var user_names = leaderboad_entries.Select(l => l["name"]).ToList();

        foreach (var user_name in user_names)
        {
            foreach (var metric in metrics)
            {
                var leaderboardEntry = await dbContext.leaderboard_entry.FirstOrDefaultAsync(l =>
                    l.metric_name == metric
                    && l.user_name == user_name
                    && l.leaderboard_id == leaderboard.id
                );

                if (leaderboardEntry == null)
                {
                    Console.WriteLine("\nLeaderboard entry not found. Aborting.\n" +
                    "Metric: " + metric + "\n" +
                    "User: " + user_name + "\n" +
                    "Leaderboard id: " + leaderboard.id);
                    return Results.NotFound();
                }

                var metric_value = leaderboardMegaObjDto
                    .leaderboard_entries.Where(l => l["name"] == user_name)
                    .Select(l => l[metric])
                    .FirstOrDefault();

                if (metric_value == null)
                {
                    Console.WriteLine("Metric value not found. Aborting.");
                    return Results.NotFound();
                }
                if (double.TryParse(metric_value, out double parsed_metric_value) && double.TryParse(leaderboardEntry.metric_value, out double parsed_leaderboard_metric_value))
                {
                    leaderboardEntry.metric_value = (parsed_metric_value + parsed_leaderboard_metric_value).ToString();
                }
                else
                {
                    leaderboardEntry.metric_value = metric_value;
                }
                await dbContext.SaveChangesAsync();
            }
        }
        Console.WriteLine("\nLeaderboard updated.\n");
        return Results.Ok(leaderboard);
    }
}
