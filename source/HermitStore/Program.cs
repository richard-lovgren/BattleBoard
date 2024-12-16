
using HermitStore;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"Connection String: {connectionString}");

// Add services before building
builder.Services.AddDbContext<HermitDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddOpenApi("API Reference");
builder.Services.AddControllers();

var app = builder.Build();

app.MapOpenApi();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/openapi/API Reference.json", "HermitStore API");
    options.RoutePrefix = "ref";
});

var logger = app.Services.GetRequiredService<ILogger<Program>>();


app.MapGet("/", () => "Hello World!").Produces<string>(StatusCodes.Status200OK);

app.MapUserEndpoints();

app.MapGet("/communities", async (HermitDbContext dbContext) =>
{
    var communities = await dbContext.community.ToListAsync();
    return communities;
}).Produces<List<Community>>(StatusCodes.Status200OK).WithDescription("Get all communities");

app.MapGet("/communities/{id}", async (HermitDbContext dbContext, ulong id) =>
{
    var community = await dbContext.community.FindAsync(id);
    if (community == null)
    {
        return Results.NotFound();
    }

    logger.LogInformation("Community {CommunityId} found", community.id);

    return Results.Ok(community);
}).Produces<Community>(StatusCodes.Status200OK).Produces(StatusCodes.Status404NotFound).WithDescription("Get a community by ID");

app.MapPost("/communities", async (HermitDbContext dbContext, CommunityDto communityDto) =>
{

    logger.LogInformation("CommunityDto: {CommunityDto}", communityDto);

    var community = new Community
    {
        community_name = communityDto.community_name,
        community_image = communityDto.community_image,
        id = communityDto.id,
        created_at = DateTime.Now.ToUniversalTime(),
    };

    dbContext.community.Add(community);
    await dbContext.SaveChangesAsync();

    logger.LogInformation("Community {CommunityId} created", community.id);

    return Results.Created($"/communities/{community.id}", community);
}).Produces<Community>(StatusCodes.Status201Created).WithDescription("Create a new community");

app.MapDelete("/communities/{id}", async (HermitDbContext dbContext, ulong id) =>
{
    var community = await dbContext.community.Where(x => x.id == id).FirstOrDefaultAsync();
    if (community == null)
    {
        return Results.NotFound();
    }

    dbContext.community.Remove(community);
    await dbContext.SaveChangesAsync();

    logger.LogInformation("Community {CommunityId} deleted", community.id);

    return Results.Ok();
}).Produces(StatusCodes.Status200OK).Produces(StatusCodes.Status404NotFound).WithDescription("Delete a community by ID");

app.MapPost("/communities/{id}/users", async (HermitDbContext dbContext, UserCommunityDto userCommunityDto, ulong id) =>
{
    var userCommunity = new UserCommunity
    {
        user_name = userCommunityDto.user_name,
        community_id = id,
        id = Guid.NewGuid(),
    };

    dbContext.user_community.Add(userCommunity);
    await dbContext.SaveChangesAsync();

    logger.LogInformation("User: {UserName}:{UserId} joined community {CommunityId}", userCommunity.user_name, userCommunity.id, id);

    return Results.Created();
}).Produces(StatusCodes.Status201Created).WithDescription("Join a community");

app.MapGet("/communities/{id}/competitions", async (HermitDbContext dbContext, ulong id) =>
{
    var community = await dbContext.community.FindAsync(id);
    if (community == null)
    {
        return Results.NotFound("Community not found");
    }

    var competitionIds = await dbContext.competition.Where(x => x.community_id == id).Select(x => x.id).ToListAsync();
    return Results.Ok(competitionIds);
}).Produces<List<Guid>>(StatusCodes.Status200OK).Produces(StatusCodes.Status404NotFound).WithDescription("Get all competitions for a community");


app.MapGet("/communities/{id}/competitions", async (HermitDbContext dbContext, Guid id) =>
{
    var competitions = await dbContext.competition
        .Where(c => c.community_id == id)

        .Select(c => new
        {
            c.id,
            c.competition_name,
        })


        .ToListAsync();

    return competitions.Any() ? Results.Ok(competitions) : Results.NotFound();
});




/*app.MapGet("/communities/{id}/competitions", async (HermitDbContext dbContext, Guid id) =>
{
    try
    {
        // Verify community exists
        var community = await dbContext.community.FindAsync(id);
        if (community == null)
        {
            return Results.NotFound($"Community with ID {id} not found.");
        }

        // Fetch games associated with the community
        var gameIds = await dbContext.game_community
            .Where(gc => gc.community_id == id)
            .Select(gc => gc.game_id)
            .ToListAsync();

        if (!gameIds.Any())
        {
            return Results.Ok(new List<object>()); // No games, hence no competitions
        }

        // Fetch competitions associated with these games
        var competitions = await dbContext.competition
            .Where(c => gameIds.Contains(c.game_id))
            .Select(c => new
            {
                c.id,
                c.competition_name,
                c.competition_description,
                c.competition_type,
                c.format,
                c.competition_image,
                c.is_public,
                c.participants,
                c.rank_alg,
                c.game_id
            })
            .ToListAsync();

        return Results.Ok(competitions);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error retrieving competitions for community {CommunityId}", id);
        return Results.Problem("An error occurred while retrieving competitions for the community.");
    }
});*/




/*app.MapGet("/communities/{id}/competitions", async (HermitDbContext dbContext, Guid id) =>
{
    try
    {
        // Check if the community exists
        var community = await dbContext.community.FindAsync(id);
        if (community == null)
        {
            return Results.NotFound($"Community with ID {id} not found.");
        }

        // Query competitions associated with the community
        var competitions = await dbContext.user_competition
            .Where(uc => uc.community_id == id)
            .Join(dbContext.competition,
                  uc => uc.competition_id,
                  c => c.id,
                  (uc, c) => new
                  {
                      c.id,
                      c.competition_name,
                      c.competition_description,
                      c.competition_type,
                      c.format,
                      c.competition_image,
                      c.is_public,
                      c.participants,
                      c.rank_alg,
                      c.game_id
                  })
            .ToListAsync();

        // Return competitions if found
        return Results.Ok(competitions);
    }
    catch (Exception ex)
    {
        // Log and return an error response
        logger.LogError(ex, "Failed to retrieve competitions for community {CommunityId}", id);
        return Results.Problem("An error occurred while fetching competitions.");
    }
});*/


/*app.MapGet("/communities/{id}/competitions", async (HermitDbContext dbContext, Guid id) =>
{
    try
    {
        // Check if the community exists
        var community = await dbContext.community.FindAsync(id);
        if (community == null)
        {
            return Results.NotFound($"Community with ID {id} not found.");
        }

        // Get games associated with the community
        var gameIds = await dbContext.game_community
            .Where(gc => gc.community_id == id)
            .Select(gc => gc.game_id)
            .ToListAsync();

        if (!gameIds.Any())
        {
            return Results.Ok(new List<object>()); // No games, hence no competitions
        }

        // Find competitions associated with these games
        var competitions = await dbContext.competition
            .Where(c => gameIds.Contains(c.game_id))
            .Select(c => new
            {
                c.id,
                c.competition_name,
                c.competition_description,
                c.competition_type,
                c.format,
                c.competition_image,
                c.is_public,
                c.participants,
                c.rank_alg,
                c.game_id
            })
            .ToListAsync();

        return Results.Ok(competitions);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to retrieve competitions for community {CommunityId}", id);
        return Results.Problem("An error occurred while fetching competitions.");
    }
});*/






/*app.MapGet("/communities/{id}/competitions", async (HermitDbContext dbContext, Guid id) =>
{
    try
    {
        // Find the community first to ensure it exists
        var community = await dbContext.community.FindAsync(id);
        if (community == null)
        {
            return Results.NotFound($"Community with ID {id} not found.");
        }

        // Get competitions associated with the community
        var competitions = await dbContext.community_competition
            .Where(cc => cc.community_id == id)
            .Select(cc => new
            {
                cc.competition.id,
                cc.competition.competition_name,
                cc.competition.competition_description,
                cc.competition.competition_type,
                cc.competition.format,
                cc.competition.competition_image,
                cc.competition.is_public,
                cc.competition.participants,
                cc.competition.rank_alg,
                cc.competition.game_id
            })
            .ToListAsync();

        return Results.Ok(competitions);
    }
    catch (Exception ex)
    {
        // Log and return an error response
        logger.LogError(ex, "Failed to retrieve competitions for community {CommunityId}", id);
        return Results.Problem("An error occurred while fetching competitions.");
    }
});*/



//app.MapGet("/communities/{id}/competitions", async ...) {}



app.MapGet("/competitions", async (HermitDbContext dbContext) =>
{
    var competitions = await dbContext.competition.ToListAsync();
    return competitions;
}).Produces<List<Competition>>(StatusCodes.Status200OK).WithDescription("Get all competitions");

app.MapGet("/competitions/{id}", async (HermitDbContext dbContext, Guid id) =>
{
    var competition = await dbContext.competition.FindAsync(id);
    if (competition == null)
    {
        return Results.NotFound();
    }

    logger.LogInformation("Competition {CompetitionId} found", competition.id);

    return Results.Ok(competition);
}).Produces<Competition>(StatusCodes.Status200OK).Produces(StatusCodes.Status404NotFound).WithDescription("Get a competition by ID");

app.MapPost("/competitions", async (HermitDbContext dbContext, CompetitionDto competitionDto) =>
{
    var competition = new Competition
    {
        id = Guid.NewGuid(),
        competition_name = competitionDto.competition_name,
        competition_description = competitionDto.competition_description,
        competition_type = competitionDto.competition_type,
        format = competitionDto.format,
        competition_image = competitionDto.competition_image,
        is_public = competitionDto.is_public,
        game_id = competitionDto.game_id,
        rank_alg = competitionDto.rank_alg,
        participants = 0,
        community_id = competitionDto.community_id
    };

    dbContext.competition.Add(competition);
    await dbContext.SaveChangesAsync();

    logger.LogInformation("Competition {CompetitionId} created", competition.id);

    return Results.Created($"/competitions/{competition.id}", competition);
}).Produces<Competition>(StatusCodes.Status201Created).WithDescription("Create a new competition");

app.MapPost("/competitions/join", async (HermitDbContext dbContext, UserCompetitionDto userCompetitionDto) =>
{

    var competition_id = userCompetitionDto.competition_id;
    var user_name = userCompetitionDto.user_name;

    var competition = await dbContext.competition.FindAsync(competition_id);
    if (competition == null)
    {
        return Results.NotFound();
    }

    var user = await dbContext.users.Where(x => x.user_name == user_name).FirstOrDefaultAsync();
    if (user == null)
    {
        return Results.NotFound();
    }

    var userCompetition = new UserCompetition
    {
        id = Guid.NewGuid(),
        user_name = user_name,
        competition_id = competition_id
    };

    dbContext.user_competition.Add(userCompetition);

    competition.participants++;
    await dbContext.SaveChangesAsync();

    logger.LogInformation("User {userName} joined competition {competitionId}", user_name, competition_id);

    return Results.Created();
}).Produces(StatusCodes.Status201Created).Produces(StatusCodes.Status404NotFound).WithDescription("Join a competition");

app.MapGet("/games", async (HermitDbContext dbContext) =>
{
    var games = await dbContext.game.ToListAsync();
    return Results.Ok(games);
}).Produces<List<Game>>(StatusCodes.Status200OK).WithDescription("Get all games");

app.MapPost("/games", async (HermitDbContext dbContext, GameDto gameDto) =>
{
    var game = new Game
    {
        game_name = gameDto.game_name,
        id = Guid.NewGuid()
    };

    dbContext.game.Add(game);
    await dbContext.SaveChangesAsync();

    logger.LogInformation("Game {GameId} created", game.id);

    return Results.Created($"/communities/{game.id}", game);
}).Produces<Game>(StatusCodes.Status201Created).WithDescription("Create a new game");



app.Run();
