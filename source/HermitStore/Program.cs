
using HermitStore;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"Connection String: {connectionString}");

// Add services before building
builder.Services.AddDbContext<HermitDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();


app.MapGet("/", () => "Hello World!");

app.MapUserEndpoints();

app.MapGet("/communities", async (HermitDbContext dbContext) =>
{
    var communities = await dbContext.community.ToListAsync();
    return communities;
});

app.MapGet("/communities/{id}", async (HermitDbContext dbContext, ulong id) =>
{
    var community = await dbContext.community.FindAsync(id);
    if (community == null)
    {
        return Results.NotFound();
    }

    logger.LogInformation("Community {CommunityId} found", community.id);

    return Results.Ok(community);
});

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
});

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
});

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
});

app.MapGet("/competitions", async (HermitDbContext dbContext) =>
{
    var competitions = await dbContext.competition.ToListAsync();
    return competitions;
});

app.MapGet("/competitions/{id}", async (HermitDbContext dbContext, Guid id) =>
{
    var competition = await dbContext.competition.FindAsync(id);
    if (competition == null)
    {
        return Results.NotFound();
    }

    logger.LogInformation("Competition {CompetitionId} found", competition.id);

    return Results.Ok(competition);
});

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
        participants = 0
    };

    dbContext.competition.Add(competition);
    await dbContext.SaveChangesAsync();

    logger.LogInformation("Competition {CompetitionId} created", competition.id);

    return Results.Created($"/competitions/{competition.id}", competition);
});

app.MapPost("/competitions/join/{competition_id, user_id}", async (HermitDbContext dbContext, Guid competition_id, Guid user_id) =>
{
    var competition = await dbContext.competition.FindAsync(competition_id);
    if (competition == null)
    {
        return Results.NotFound();
    }

    var user = await dbContext.users.FindAsync(user_id);
    if (user == null)
    {
        return Results.NotFound();
    }

    await dbContext.SaveChangesAsync();

    competition.participants++;
    await dbContext.SaveChangesAsync();

    logger.LogInformation("User {UserId} joined competition {CompetitionId}", user_id, competition_id);

    return Results.Created($"/competitions/{competition.id}", competition);
});

app.MapGet("/games", async (HermitDbContext dbContext) =>
{
    var games = await dbContext.game.ToListAsync();
    return games;
});

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
});



app.Run();
