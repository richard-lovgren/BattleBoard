
using Microsoft.EntityFrameworkCore;

namespace HermitStore
{

    public class HermitDbContext : DbContext
    {
        public HermitDbContext(DbContextOptions<HermitDbContext> options) : base(options)
        {

        }
        public required DbSet<User> users { get; set; }
        public required DbSet<Community> community { get; set; }
        public required DbSet<Game> game { get; set; }
        public required DbSet<Competition> competition { get; set; }
        public required DbSet<Match> match { get; set; }
        public required DbSet<MatchUser> match_user { get; set; }
        public required DbSet<MatchGame> match_game { get; set; }
        public required DbSet<UserCommunity> user_community { get; set; }
        public required DbSet<GameCommunity> game_community { get; set; }
        public required DbSet<UserCompetition> user_competition { get; set; }
    }

    public class UserDto
    {
        public required ulong discord_id { get; set; }
        public required string user_name { get; set; }
        public string? display_name { get; set; }
        public string? league_puuid { get; set; }
    }
    public class User : UserDto
    {
        public required Guid id { get; set; }
    }
    public class CommunityDto
    {
        public required string community_name { get; set; }
        public byte[]? community_image { get; set; }
    }
    public class Community : CommunityDto
    {
        public required Guid id { get; set; }
    }
    public class UserCommunityDto
    {
        public required Guid user_id { get; set; }
        public required Guid community_id { get; set; }
    }
    public class UserCommunity : UserCommunityDto
    {
        public required Guid id { get; set; }
    }
    public class GameDto
    {
        public required string game_name { get; set; }
    }
    public class Game : GameDto
    {
        public required Guid id { get; set; }
    }
    public class GameCommunityDto
    {
        public required Guid game_id { get; set; }
        public required Guid community_id { get; set; }
    }
    public class GameCommunity : GameCommunityDto
    {
        public required Guid id { get; set; }
    }
    public class CompetitionDto
    {
        public required string competition_name { get; set; }
        public string? competition_description { get; set; }
        public required int competition_type { get; set; }
        public required int format { get; set; }
        public byte[]? competition_image { get; set; }
        public bool is_open { get; set; } = true;
        public bool is_running { get; set; } = false;
        public required Guid game_id { get; set; }
        public required int rank_alg { get; set; }
        public required bool is_public { get; set; }
    }
    public class Competition : CompetitionDto
    {
        public required int participants { get; set; }
        public required Guid id { get; set; }
    }
    public class UserCompetitionDto
    {
        public required Guid user_id { get; set; }
        public required Guid competition_id { get; set; }
    }
    public class UserCompetition : UserCompetitionDto
    {
        public required Guid id { get; set; }
    }
    public class MatchDto
    {
        public Guid competition_id { get; set; }
        public Guid prev_match { get; set; }
        public int winner_score { get; set; }
        public int loser_score { get; set; }
        public int kills { get; set; }
        public int deaths { get; set; }
        public int networth { get; set; }
        public int match_time { get; set; }
    }
    public class MatchGameDto
    {
        public required Guid game_id { get; set; }
        public required Guid match_id { get; set; }
    }
    public class MatchGame : MatchGameDto
    {
        public required Guid id { get; set; }
    }
    public class Match : MatchDto
    {
        public required Guid id { get; set; }
    }
    public class MatchUserDto
    {
        public required Guid user_id { get; set; }
        public required Guid match_id { get; set; }
    }
    public class MatchUser : MatchUserDto
    {
        public required Guid id { get; set; }
    }
}