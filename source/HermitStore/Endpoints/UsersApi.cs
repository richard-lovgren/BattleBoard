using HermitStore;
using Microsoft.EntityFrameworkCore;

public static class UsersApi
{
    public static void MapUserEndpoints(this WebApplication app)
    {
        app.MapGet("/users", async (HermitDbContext dbContext) => await GetUsers(dbContext))
            .Produces<List<User>>(StatusCodes.Status200OK);
        app.MapGet(
                "/users/{id}",
                async (HermitDbContext dbContext, ulong id) => await GetUserById(dbContext, id)
            )
            .Produces<User>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);
        app.MapPost(
                "/users",
                async (HttpContext httpContext, HermitDbContext dbContext) =>
                    await CreateUser(httpContext, dbContext)
            )
            .Produces<User>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status409Conflict);
        app.MapPut(
                "/users/{id}",
                async (HermitDbContext dbContext, ulong id, UserDto userDto) =>
                    await UpdateUser(dbContext, id, userDto)
            )
            .Produces<User>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest);
        app.MapGet(
                "/users/{user_name}/competitions",
                async (HermitDbContext dbContext, string user_name) =>
                    await GetUserCompetitions(dbContext, user_name)
            )
            .Produces<List<Guid>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest);
        app.MapGet(
                "/users/{user_name}/communities",
                async (HermitDbContext dbContext, string user_name) =>
                    await GetUserCommunities(dbContext, user_name)
            )
            .Produces<Dictionary<ulong, string>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest);
        app.MapGet(
                "/users/{user_name}/matches",
                async (HermitDbContext dbContext, string user_name) =>
                    await GetUserMatches(dbContext, user_name)
            )
            .Produces<List<Guid>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest);

        Console.WriteLine("Mapped /users endpoints");
    }

    private static async Task<IResult> GetUsers(HermitDbContext dbContext)
    {
        var users = await dbContext.users.ToListAsync();
        return Results.Ok(users);
    }

    private static async Task<IResult> GetUserById(HermitDbContext dbContext, ulong id)
    {
        try
        {
            var user = await dbContext.users.Where(x => x.discord_id == id).FirstOrDefaultAsync();
            if (user != null)
            {
                return Results.Ok(user);
            }
            else
            {
                return Results.NotFound();
            }
        }
        catch (Exception)
        {
            return Results.Problem("Failed to get user");
        }
    }

    private static async Task<IResult> CreateUser(
        HttpContext httpContext,
        HermitDbContext dbContext
    )
    {
        var userDto = await httpContext.Request.ReadFromJsonAsync<UserDto>();
        if (userDto == null)
        {
            return Results.BadRequest("Invalid or missing request body.");
        }

        var user = new User
        {
            discord_id = userDto.discord_id,
            user_name = userDto.user_name,
            display_name = userDto.display_name,
            id = Guid.NewGuid(),
        };

        if (await dbContext.users.AnyAsync(u => u.discord_id == user.discord_id))
        {
            return Results.Conflict("User already exists");
        }

        try
        {
            dbContext.users.Add(user);
            await dbContext.SaveChangesAsync();
        }
        catch (Exception e)
        {
            Console.WriteLine(e.ToString(), "Failed to create user");
            return Results.BadRequest("Failed to create user");
        }

        Console.WriteLine($"User {user.user_name} created");

        return Results.Created($"/users/{user.id}", user);
    }

    private static async Task<IResult> UpdateUser(
        HermitDbContext dbContext,
        ulong id,
        UserDto userDto
    )
    {
        try
        {
            var user = await dbContext.users.Where(x => x.discord_id == id).FirstOrDefaultAsync();
            if (user != null)
            {
                user.display_name =
                    userDto.display_name != string.Empty ? userDto.display_name : user.display_name;
                user.league_puuid =
                    userDto.league_puuid != string.Empty ? userDto.league_puuid : user.league_puuid;
                dbContext.users.Update(user);
                await dbContext.SaveChangesAsync();
                return Results.Ok(user);
            }
            else
            {
                return Results.NotFound();
            }
        }
        catch (Exception)
        {
            return Results.Problem("Failed to update user");
        }
    }

    private static async Task<IResult> GetUserCompetitions(
        HermitDbContext dbContext,
        string user_name
    )
    {
        Console.WriteLine($"Getting competitions for user {user_name}");
        try
        {
            var user = await dbContext
                .users.Where(x => x.user_name == user_name)
                .FirstOrDefaultAsync();
            if (user != null)
            {
                var competitionIds = await dbContext
                    .user_competition.Where(x => x.user_name == user_name)
                    .Select(x => x.competition_id)
                    .ToListAsync();
                Console.WriteLine(
                    "Found {0} competitions for user {1}",
                    competitionIds.Count,
                    user_name
                );
                return Results.Ok(competitionIds);
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
    }

    private static async Task<IResult> GetUserCommunities(
        HermitDbContext dbContext,
        string user_name
    )
    {
        try
        {
            var user = await dbContext
                .users.Where(x => x.user_name == user_name)
                .FirstOrDefaultAsync();
            if (user != null)
            {
                var communityIds = await dbContext
                    .user_community.Where(x => x.user_name == user_name)
                    .Select(x => x.community_id)
                    .ToListAsync();
                var communityNames = await dbContext
                    .community.Where(x => communityIds.Contains(x.id))
                    .Select(x => x.community_name)
                    .ToListAsync();
                var communityIdsAndNames = new Dictionary<ulong, string>();

                if (communityIds.Count != communityNames.Count)
                {
                    return Results.Problem("Failed to get communities");
                }

                for (int i = 0; i < communityIds.Count; i++)
                {
                    communityIdsAndNames.Add(communityIds[i], communityNames[i]);
                }

                return Results.Ok(communityIdsAndNames);
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
    }

    private static async Task<IResult> GetUserMatches(HermitDbContext dbContext, string user_name)
    {
        try
        {
            var user = await dbContext
                .users.Where(x => x.user_name == user_name)
                .FirstOrDefaultAsync();
            if (user != null)
            {
                var matchIds = dbContext
                    .match_user.Where(x => x.user_name == user_name)
                    .Select(x => x.match_id)
                    .ToListAsync();
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
    }
}
