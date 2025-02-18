using Microsoft.EntityFrameworkCore;

namespace HermitStore
{
    public class HermitDbContext : DbContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LeaderboardMetric>().HasKey(lm => new { lm.leaderboard_id, lm.metric_name });
            base.OnModelCreating(modelBuilder);
        }
        public HermitDbContext(DbContextOptions<HermitDbContext> options)
            : base(options) { }

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

        public required DbSet<Leaderboard> leaderboard { get; set; }
        public required DbSet<LeaderboardMetric> leaderboard_metric { get; set; }
        public required DbSet<LeaderboardEntry> leaderboard_entry { get; set; }

        public required DbSet<Tournament> tournament { get; set; }
        public required DbSet<TournamentMatch> tournament_match { get; set; }

    }

    public class UserDto
    {
        public required ulong discord_id { get; set; }
        public required string user_name { get; set; }
        public string? display_name { get; set; }
        public string? league_puuid { get; set; }
        public string? locale { get; set; }
    }

    public class User : UserDto
    {
        public required Guid id { get; set; }
    }

    public class CommunityDto
    {
        public required string community_name { get; set; }
        public string? community_image { get; set; }
        public required string id { get; set; }
    }

    public class Community : CommunityDto
    {
        public required DateTime created_at { get; set; }

        public int community_members { get; set; } = 0;
    }

    public class UserCommunityDto
    {
        public required string user_name { get; set; }
    }

    public class UserCommunity : UserCommunityDto
    {
        public required Guid id { get; set; }
        public required string community_id { get; set; }
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
        public required string community_id { get; set; }
    }

    public class GameCommunity : GameCommunityDto
    {
        public required Guid id { get; set; }
    }

    public class CompetitionFormDto
    {
        public required string competition_data { get; set; }
        public IFormFile? competition_image { get; set; }
    }

    public class CompetitionDto
    {
        public required string competition_name { get; set; }
        public required string creator_name { get; set; }
        public required DateTime competition_start_date { get; set; }
        public string? competition_description { get; set; }
        public required int competition_type { get; set; }
        public required int format { get; set; }
        public bool is_open { get; set; } = true;
        public bool is_running { get; set; } = false;
        public Guid? game_id { get; set; }
        public required int rank_alg { get; set; }
        public required bool is_public { get; set; }

        public string? community_id { get; set; }
    }

    public class Competition : CompetitionDto
    {
        public byte[]? competition_image { get; set; }
        public string? competition_image_path { get; set; }
        public string? competition_image_content_type {get; set;}
        public required int participants { get; set; }
        public required Guid id { get; set; }
    }

    public class JoinCompetitionDto
    {
        public required Guid competition_id { get; set; }
        public required string[] user_names { get; set; }
    }
    
    public class UserCompetitionDto
    {
        public required Guid competition_id { get; set; }
        public required string user_name { get; set; }
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
        public required string user_name { get; set; }
        public required Guid match_id { get; set; }
    }

    public class MatchUser : MatchUserDto
    {
        public required Guid id { get; set; }
    }

    // Leaderboard stuff
    public class LeaderboardDto
    {
        public required Guid competition_id { get; set; }
    }

    public class Leaderboard : LeaderboardDto
    {
        public required Guid id { get; set; }
    }

    public class LeaderboardMetricDto
    {
        public required Guid leaderboard_id { get; set; }
        public required string metric_name { get; set; }
    }

    public class LeaderboardMetric : LeaderboardMetricDto;

    public class LeaderboardEntryDto
    {
        public required Guid leaderboard_id { get; set; }
        public required string user_name { get; set; }
        public required string metric_name { get; set; }
        public required string metric_value { get; set; }
    }

    public class LeaderboardEntry : LeaderboardEntryDto
    {
        public required Guid id { get; set; }
    }

    public class LeaderboardMegaObjDto
    {
        public required Guid competition_id { get; set; }
        public required List<Dictionary<string,string>> leaderboard_entries { get; set; }
        public required List<string> column_names { get; set; }
    }

    public class LeaderboardMegaObj: LeaderboardMegaObjDto
    {
        public required Guid leaderboard_id {get; set; }
    }

    public class Tournament
    {
        public required Guid id { get; set; }
        public required Guid competition_id { get; set; }

        public required int number_of_players { get; set; }
    }

    public class TournamentMatchDto
    {
        public required int round_number { get; set; }
        public required int match_in_round { get; set; }

        public string? player_1 { get; set; }
        public string? player_2 { get; set; }
        public string? winner { get; set; }
    }

    public class TournamentMatch : TournamentMatchDto
    {
        public int? id { get; set; }
        public required Guid tournament_id { get; set; }
    }

    public class TournamentMegaObjDto
    {
        public required Guid competition_id { get; set; }

        public required int number_of_players { get; set; }
        public required List<TournamentMatchDto> tournament_matches { get; set; }
    }
}
