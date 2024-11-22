
using HermitStore;
using Microsoft.EntityFrameworkCore;
using Npgsql;

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
    var users = await dbContext.User.ToListAsync();
    return users;
});

app.MapPost("/users", async (HermitDbContext dbContext, UserDto userDto) =>
{

    var user = new User
    {
        DiscordId = userDto.DiscordId,
        UserName = userDto.UserName,
        DisplayName = userDto.DisplayName,
        Id = Guid.NewGuid()
    };
    
    //Slay queen
    if (await dbContext.User.AnyAsync(u => u.DiscordId == user.DiscordId))
    {
        return Results.Conflict("User already exists");
    }

    try 
    {
    dbContext.User.Add(user);
    await dbContext.SaveChangesAsync();
    }
    catch (Exception e)
    {
        logger.LogError(e, "Failed to create user");
        return Results.BadRequest("Failed to create user");
    }

    logger.LogInformation("User {UserId} created", user.Id);

    return Results.Created($"/users/{user.Id}", user);
    
});

app.Run();
