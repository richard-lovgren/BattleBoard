
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace HermitStore
{

    public class HermitDbContext : DbContext
    {
        public HermitDbContext(DbContextOptions<HermitDbContext> options) : base(options)
        {

        }
        public required DbSet<User> User { get; set; }
    }

    public class User
    {
        public Guid Id { get; set; }
        public Guid DiscordId { get; set; }
        public required string UserName { get; set; }
        public required string DisplayName { get; set; }
    }

    public class UserDto
    {
        public Guid DiscordId { get; set; }
        public required string UserName { get; set; }
        public required string DisplayName { get; set; }
    }

}