
using HermitStore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"Connection String: {connectionString}");

// Add services before building
builder.Services.AddDbContext<HermitDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();


app.MapGet("/", () => "Hello World!");

app.MapGet("/users", async (HermitDbContext dbContext) =>
{
    var users = await dbContext.user.ToListAsync();
    return users;
});

app.MapPost("/users", async (HermitDbContext dbContext, UserDto userDto) =>
{

    var user = new User
    {
        discord_id = userDto.discord_id,
        user_name = userDto.user_name,
        display_name = userDto.display_name,
        id = Guid.NewGuid()
    };

    //Slay queen
    if (await dbContext.user.AnyAsync(u => u.discord_id == user.discord_id))
    {
        return Results.Conflict("User already exists");
    }

    try
    {
        dbContext.user.Add(user);
        await dbContext.SaveChangesAsync();
    }
    catch (Exception e)
    {
        logger.LogError(e, "Failed to create user");
        return Results.BadRequest("Failed to create user");
    }

    logger.LogInformation("User {UserId} created", user.id);

    return Results.Created($"/users/{user.id}", user);

});

/**
Get competions that a user has joined
Need to query get competitions to get more info about them
*/
app.MapGet("/users/{id}/competitions", async (HermitDbContext dbContext, Guid id) =>
{
    try
    {
        var user = await dbContext.user.FindAsync(id);
        if (user != null)
        {
            var communityIds = await dbContext.user_competition.Where(x => x.user_id == id).Select(x => x.competition_id).ToListAsync();
            return Results.Ok(communityIds);
        }
        else
        {
            return Results.NotFound();
        }
    }
    catch (Exception)
    {
        return Results.Problem("Failed to get competitions");
    }
});

/**
Get communities that a user has joined
Need to query get communities to get more info about them
*/
app.MapGet("/user/{id}/communities", async (HermitDbContext dbContext, Guid id) =>
{
    // return await dbContext.user_community.Where(x => x.user_id == id).Select(x => x.community_id).ToListAsync();
    try
    {
        var user = await dbContext.user.FindAsync(id);
        if (user != null)
        {
            var communityIds = dbContext.user_community.Where(x => x.user_id == id).Select(x => x.community_id).ToListAsync();
            return Results.Ok(communityIds);
        }
        else
        {
            return Results.NotFound();
        }
    }
    catch (Exception)
    {
        return Results.Problem("Failed to get communities");
    }
});
/**
Get matches that a user has joined
Need to query get matches to get more info about them
*/
app.MapGet("/user/{id}/matches", async (HermitDbContext dbContext, Guid id) =>
{
    // return await dbContext.match_user.Where(x => x.user_id == id).Select(x => x.match_id).ToListAsync();
    try
    {
        var user = await dbContext.user.FindAsync(id);
        if (user != null)
        {
            var matchIds = dbContext.match_user.Where(x => x.user_id == id).Select(x => x.match_id).ToListAsync();
            return Results.Ok(matchIds);
        }
        else
        {
            return Results.NotFound();
        }
    }
    catch (Exception)
    {
        return Results.Problem("Failed to get matches");
    }
});



app.MapGet("/communities", async (HermitDbContext dbContext) =>
{
    var communities = await dbContext.community.ToListAsync();
    return communities;
});

app.MapGet("/communities/{id}", async (HermitDbContext dbContext, Guid id) =>
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
    var community = new Community
    {
        community_name = communityDto.community_name,
        community_image = communityDto.community_image,
        id = Guid.NewGuid()
    };

    dbContext.community.Add(community);
    await dbContext.SaveChangesAsync();

    logger.LogInformation("Community {CommunityId} created", community.id);

    return Results.Created($"/communities/{community.id}", community);
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

    var user = await dbContext.user.FindAsync(user_id);
    if (user == null)
    {
        return Results.NotFound();
    }

    //var competitionUser = new CompetitionUser
    //{
    //    competition_id = competition_id,
    //    user_id = user_id
    //};

    //dbContext.competition_user.Add(competitionUser);
    await dbContext.SaveChangesAsync();

    competition.participants++;
    await dbContext.SaveChangesAsync();

    logger.LogInformation("User {UserId} joined competition {CompetitionId}", user_id, competition_id);

    return Results.Created($"/competitions/{competition.id}", competition);
});



app.Run();
