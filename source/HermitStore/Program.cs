using HermitStore;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"Connection String: {connectionString}");

// Add services before building
builder.Services.AddDbContext<HermitDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);
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
app.MapClassicModeEndpoints();

app.MapGet(
        "/communities",
        async (HermitDbContext dbContext) =>
        {
            var communities = await dbContext.community.ToListAsync();
            return communities;
        }
    )
    .Produces<List<Community>>(StatusCodes.Status200OK)
    .WithDescription("Get all communities");

app.MapGet(
        "/communities/{id}",
        async (HermitDbContext dbContext, ulong id) =>
        {
            var community = await dbContext.community.FindAsync(id);
            if (community == null)
            {
                return Results.NotFound();
            }

            logger.LogInformation("Community {CommunityId} found", community.id);

            return Results.Ok(community);
        }
    )
    .Produces<Community>(StatusCodes.Status200OK)
    .Produces(StatusCodes.Status404NotFound)
    .WithDescription("Get a community by ID");

app.MapPost(
        "/communities",
        async (HermitDbContext dbContext, CommunityDto communityDto) =>
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
        }
    )
    .Produces<Community>(StatusCodes.Status201Created)
    .WithDescription("Create a new community");

app.MapDelete(
        "/communities/{id}",
        async (HermitDbContext dbContext, ulong id) =>
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
        }
    )
    .Produces(StatusCodes.Status200OK)
    .Produces(StatusCodes.Status404NotFound)
    .WithDescription("Delete a community by ID");

app.MapPost(
        "/communities/{id}/users",
        async (HermitDbContext dbContext, UserCommunityDto userCommunityDto, ulong id) =>
        {
            //Check that community exists
            var community = await dbContext.community.FindAsync(id);
            if (community == null)
            {
                return Results.BadRequest("Community not found");
            }
            logger.LogInformation("Community {CommunityId} found", community.id);

            var userCommunity = new UserCommunity
            {
                user_name = userCommunityDto.user_name,
                community_id = id,
                id = Guid.NewGuid(),
            };

            dbContext.user_community.Add(userCommunity);
            //Increment member count
            community.community_members++;
            await dbContext.SaveChangesAsync();

            logger.LogInformation(
                "User: {UserName}:{UserId} joined community {CommunityId}",
                userCommunity.user_name,
                userCommunity.id,
                id
            );

            return Results.Created();
        }
    )
    .Produces(StatusCodes.Status201Created)
    .WithDescription("Join a community");

app.MapGet(
        "/communities/{id}/competitions",
        async (HermitDbContext dbContext, ulong id) =>
        {
            var community = await dbContext.community.FindAsync(id);
            if (community == null)
            {
                return Results.NotFound("Community not found");
            }

            var competitionIds = await dbContext
                .competition.Where(x => x.community_id == id)
                .Select(x => x.id)
                .ToListAsync();
            return Results.Ok(competitionIds);
        }
    )
    .Produces<List<Guid>>(StatusCodes.Status200OK)
    .Produces(StatusCodes.Status404NotFound)
    .WithDescription("Get all competitions for a community");

app.MapGet(
        "/competitions/public",
        async (HermitDbContext dbContext) =>
        {
            var competitions = await dbContext.competition.Where(x => x.is_public).ToListAsync();
            return Results.Ok(competitions);
        }
    )
    .Produces<List<Competition>>(StatusCodes.Status200OK)
    .WithDescription("Get all public competitions");

app.MapGet(
        "/competitions",
        async (HermitDbContext dbContext) =>
        {
            var competitions = await dbContext.competition.ToListAsync();
            return competitions;
        }
    )
    .Produces<List<Competition>>(StatusCodes.Status200OK)
    .WithDescription("Get all competitions");

app.MapGet(
        "/competitions/{id}",
        async (HermitDbContext dbContext, Guid id) =>
        {
            var competition = await dbContext.competition.FindAsync(id);
            if (competition == null)
            {
                return Results.NotFound();
            }

            logger.LogInformation("Competition {CompetitionId} found", competition.id);

            return Results.Ok(competition);
        }
    )
    .Produces<Competition>(StatusCodes.Status200OK)
    .Produces(StatusCodes.Status404NotFound)
    .WithDescription("Get a competition by ID");

app.MapPost(
        "/competitions",
        async (HermitDbContext dbContext, CompetitionDto competitionDto) =>
        {
            var competition = new Competition
            {
                id = Guid.NewGuid(),
                competition_name = competitionDto.competition_name,
                creator_name = competitionDto.creator_name,
                competition_start_date = competitionDto.competition_start_date.ToUniversalTime(),
                competition_description = competitionDto.competition_description,
                competition_type = competitionDto.competition_type,
                format = competitionDto.format,
                competition_image = competitionDto.competition_image,
                is_public = competitionDto.is_public,
                game_id = competitionDto.game_id,
                rank_alg = competitionDto.rank_alg,
                participants = 0,
                community_id = competitionDto.community_id,
            };
            
            if (competition.creator_name != null)
            {
                var user = await dbContext
                    .users.Where(x => x.user_name == competition.creator_name)
                    .FirstOrDefaultAsync();
                if (user == null)
                {
                    return Results.NotFound("User not found");
                }

                dbContext.user_competition.Add(
                    new UserCompetition
                    {
                        id = Guid.NewGuid(),
                        user_name = competition.creator_name,
                        competition_id = competition.id,
                    }
                );
            }

            competition.participants++;

            dbContext.competition.Add(competition);
            await dbContext.SaveChangesAsync();

            logger.LogInformation("Competition {CompetitionId} created", competition.id);

            return Results.Created<Guid>("/competitions/{competition.id}", competition.id);
        }
    )
    .Produces<Guid>(StatusCodes.Status201Created)
    .WithDescription("Create a new competition");

app.MapPost(
        "/competitions/join",
        async (HermitDbContext dbContext, JoinCompetitionDto joinCompetitionDto) =>
        {
            var competition_id = joinCompetitionDto.competition_id;
            var competition = await dbContext.competition.FindAsync(competition_id);
            var createdUserCompetitionsIds = new List<Guid>();

            if (competition == null)
            {
                return Results.BadRequest("Competition not found");
            }
            if(joinCompetitionDto.user_names.Length == 0) {
                return Results.BadRequest("No users to join");
            }

            User? user;
            foreach(var user_name in joinCompetitionDto.user_names) {
                user = await dbContext
                    .users.Where(x => x.user_name == user_name)
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return Results.BadRequest($"User {user_name} not found");
                }

                // Check if user is already a participant in the competition
                bool userIsAlreadyParticipant = await dbContext.user_competition.Where(x=> x.user_name == user_name && x.competition_id == competition_id).FirstOrDefaultAsync() != null;
                if (userIsAlreadyParticipant)
                {
                    return Results.BadRequest($"User {user_name} is already a participant");
                }

                var userCompetition = new UserCompetition
                {
                    id = Guid.NewGuid(),
                    user_name = user_name,
                    competition_id = competition_id,
                };

                dbContext.user_competition.Add(userCompetition);
                createdUserCompetitionsIds.Add(userCompetition.id);
                competition.participants++;

                logger.LogInformation(
                    "User {userName} joined competition {competitionId}",
                    user_name,
                    competition_id
                );
            };

            await dbContext.SaveChangesAsync();
            return Results.Created<List<Guid>>("/competitions/join", createdUserCompetitionsIds);
        }
    )
    .Produces<List<Guid>>(StatusCodes.Status201Created)
    .Produces(StatusCodes.Status400BadRequest)
    .WithDescription("Join one or multiple users to a competition.");

app.MapGet(
        "/games",
        async (HermitDbContext dbContext) =>
        {
            var games = await dbContext.game.ToListAsync();
            return Results.Ok(games);
        }
    )
    .Produces<List<Game>>(StatusCodes.Status200OK)
    .WithDescription("Get all games");

app.MapGet(
    "/games/{id}",
    async (HermitDbContext dbContext, Guid id) =>
    {
        var game = await dbContext.game.FindAsync(id);
        if (game == null)
        {
            return Results.NotFound();
        }

        logger.LogInformation("Game {GameId} found", game.id);

        return Results.Ok(game);
    }
);

app.MapPost(
        "/games",
        async (HermitDbContext dbContext, GameDto gameDto) =>
        {
            var game = new Game { game_name = gameDto.game_name, id = Guid.NewGuid() };

            dbContext.game.Add(game);
            await dbContext.SaveChangesAsync();

            logger.LogInformation("Game {GameId} created", game.id);

            return Results.Created($"/communities/{game.id}", game);
        }
    )
    .Produces<Game>(StatusCodes.Status201Created)
    .WithDescription("Create a new game");

app.Run();
