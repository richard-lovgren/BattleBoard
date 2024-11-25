
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

app.Run();
