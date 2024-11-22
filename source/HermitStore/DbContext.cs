
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace HermitStore
{

    public class HermitDbContext : DbContext
    {
        public HermitDbContext(DbContextOptions<HermitDbContext> options) : base(options)
        {

        }
        public required DbSet<User> user { get; set; }
    }

    public class User
    {
        public Guid id { get; set; }
        public Guid discord_id { get; set; }
        public required string user_name { get; set; }
        public required string display_name { get; set; }
    }

    public class UserDto
    {
        public Guid discord_id { get; set; }
        public required string user_name { get; set; }
        public required string display_name { get; set; }
    }

}