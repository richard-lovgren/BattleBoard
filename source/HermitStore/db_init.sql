
-- User table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    discord_id BIGINT NOT NULL,
    user_name VARCHAR(30) NOT NULL UNIQUE,
    display_name VARCHAR(30),
    league_puuid VARCHAR(100),
    locale VARCHAR(30)
);

-- Community table
CREATE TABLE community (
    id VARCHAR(50) PRIMARY KEY,
    community_name VARCHAR(30) NOT NULL UNIQUE,
    community_image VARCHAR(120),
    community_members INT DEFAULT 0 NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Game table
CREATE TABLE game (
    id UUID PRIMARY KEY,
    game_name VARCHAR(30) NOT NULL
);

-- Game Community N-N table
CREATE TABLE game_community (
    id UUID PRIMARY KEY,
    game_id UUID REFERENCES game(id) ON DELETE CASCADE,
    community_id VARCHAR(50) REFERENCES community(id) ON DELETE CASCADE
);

-- User Community N-N table
CREATE TABLE user_community (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    user_name VARCHAR(30) NOT NULL,
    community_id VARCHAR(50) REFERENCES community(id) ON DELETE CASCADE
);



-- Competition table
CREATE TABLE competition (
    id UUID PRIMARY KEY,
    competition_name VARCHAR(30) NOT NULL,
    creator_name VARCHAR(30) NOT NULL REFERENCES users(user_name) ON DELETE CASCADE,
    competition_start_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    competition_description VARCHAR(250),
    competition_type INT NOT NULL,
    format INT NOT NULL DEFAULT 0,
    competition_image BYTEA,
    competition_image_path VARCHAR(80),
    competition_image_content_type VARCHAR(80),
    is_open BOOLEAN NOT NULL DEFAULT TRUE,
    is_running BOOLEAN NOT NULL DEFAULT FALSE,
    game_id UUID REFERENCES game(id) ON DELETE SET NULL,
    rank_alg INT NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    participants INT DEFAULT 0 NOT NULL,
    community_id VARCHAR(50) REFERENCES community(id) ON DELETE CASCADE
);

CREATE TABLE user_competition (
    id UUID PRIMARY KEY,
    user_name VARCHAR(30) NOT NULL REFERENCES users(user_name) ON DELETE CASCADE,
    competition_id UUID REFERENCES competition(id) ON DELETE CASCADE
);

-- RUSH CLASSIC CUSTOM TABLES

CREATE TABLE "leaderboard" (
    id UUID PRIMARY KEY,
    competition_id UUID REFERENCES competition(id) ON DELETE CASCADE
);

CREATE TABLE "leaderboard_metric" (
    leaderboard_id UUID REFERENCES leaderboard(id) ON DELETE CASCADE,
    metric_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (leaderboard_id, metric_name)
);

CREATE TABLE "leaderboard_entry" ( 
    id UUID PRIMARY KEY,
    leaderboard_id UUID REFERENCES leaderboard(id) ON DELETE CASCADE,
    user_name VARCHAR(30) NOT NULL REFERENCES users(user_name) ON DELETE CASCADE,
    metric_name VARCHAR(30),
    metric_value VARCHAR(30) NOT NULL,
    FOREIGN KEY (leaderboard_id, metric_name) REFERENCES leaderboard_metric(leaderboard_id, metric_name) ON DELETE CASCADE
);

-- END RUSH 

-- Match table
CREATE TABLE "match" (
    id UUID PRIMARY KEY,
    competition_id UUID REFERENCES competition(id) ON DELETE CASCADE,
    prev_match UUID REFERENCES "match"(id) ON DELETE SET NULL,
    winner_score INT,
    loser_score INT,
    kills INT,
    deaths INT,
    networth INT,
    match_time DATE
);

-- Match Game N-N table
CREATE TABLE match_game (
    id UUID PRIMARY KEY,
    match_id UUID REFERENCES "match"(id) ON DELETE CASCADE,
    game_id UUID REFERENCES game(id) ON DELETE CASCADE
);

-- Match user table
CREATE TABLE match_user (
    id UUID PRIMARY KEY,
    user_name VARCHAR(30) REFERENCES users(user_name) ON DELETE CASCADE,
    match_id UUID REFERENCES "match"(id) ON DELETE CASCADE
);

-- Tournament and tournament match table
CREATE TABLE "tournament" (
    id UUID PRIMARY KEY,
    competition_id UUID REFERENCES competition(id) ON DELETE CASCADE,
    number_of_players INT NOT NULL
);

CREATE TABLE "tournament_match" (
    id SERIAL PRIMARY KEY,
    tournament_id UUID REFERENCES "tournament"(id) ON DELETE CASCADE NOT NULL,
    round_number INT NOT NULL,
    match_in_round INT NOT NULL,
    player_1 VARCHAR(255) REFERENCES users(user_name) ON DELETE CASCADE,
    player_2 VARCHAR(255) REFERENCES users(user_name) ON DELETE CASCADE,
    winner VARCHAR(255) REFERENCES users(user_name) ON DELETE CASCADE,
    UNIQUE(tournament_id, round_number, match_in_round)
);



-- Constraints
ALTER TABLE competition ADD CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES game(id) ON DELETE SET NULL;
ALTER TABLE "match" ADD CONSTRAINT fk_competition FOREIGN KEY (competition_id) REFERENCES competition(id) ON DELETE CASCADE;
ALTER TABLE match_user ADD CONSTRAINT fk_user FOREIGN KEY (user_name) REFERENCES users(user_name) ON DELETE CASCADE;
ALTER TABLE match_user ADD CONSTRAINT fk_match FOREIGN KEY (match_id) REFERENCES "match" (id) ON DELETE CASCADE;
ALTER TABLE match_game ADD CONSTRAINT fk_match FOREIGN KEY (match_id) REFERENCES "match"(id) ON DELETE CASCADE;
ALTER TABLE match_game ADD CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES game(id) ON DELETE CASCADE;
ALTER TABLE game_community ADD CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES game(id) ON DELETE CASCADE;
ALTER TABLE game_community ADD CONSTRAINT fk_community FOREIGN KEY (community_id) REFERENCES community(id) ON DELETE CASCADE;
ALTER TABLE user_community ADD CONSTRAINT fk_community FOREIGN KEY (community_id) REFERENCES community(id) ON DELETE CASCADE;

-- Dummy data

-- Users
INSERT INTO users(id, discord_id, user_name, display_name, locale, league_puuid) VALUES('c41e3728-5a50-45a1-92cf-c8695af932e1', 125874175400911360, 'ShadowSlayer', 'Shadow Slayer', 'en-US', 'Y7JjjA-kWCyEQ19BQPLfXiJ-iQRXu9Bi-YJMg2adeuOPk04q2H7KGKHw4pL3WTX7GTeInTayyNd1OQ');
INSERT INTO users(id, discord_id, user_name, display_name, locale) VALUES('c41e3728-5a50-45a1-92cf-c8695af932e2', 125854175400911360, 'DragonFury', 'Dragon Fury', 'es-ES');
INSERT INTO users(id, discord_id, user_name, display_name, locale) VALUES('c41e3728-5a50-45a1-92cf-c8695af932e3', 125834175400911360, 'PhoenixRider', 'Phoenix Rider', 'fr-FR');
INSERT INTO users(id, discord_id, user_name, display_name, locale) VALUES('c41e3728-5a50-45a1-92cf-c8695af932e4', 125814175400911360, 'ViperStrike', 'Viper Strike', 'de-DE');
INSERT INTO users(id, discord_id, user_name, display_name, locale) VALUES('c41e3728-5a50-45a1-92cf-c8695af932e5', 125894275400911360, 'BlazeHunter', 'Blaze Hunter', 'it-IT');
INSERT INTO users(id, discord_id, user_name, display_name, locale) VALUES('c41e3728-5a50-45a1-92cf-c8695af932e6', 125894275400911361, 'StormBringer', 'Storm Bringer', 'it-IT');
INSERT INTO users(id, discord_id, user_name, display_name, locale) VALUES('c41e3728-5a50-45a1-92cf-c8695af932e7', 125894275400911362, 'NightHawk', 'Night Hawk', 'it-IT');
INSERT INTO users(id, discord_id, user_name, display_name, locale) VALUES('c41e3728-5a50-45a1-92cf-c8695af932e8', 125894275400911363, 'RogueAssassin', 'Rogue Assassin', 'it-IT');

--Communities
INSERT INTO community(id, community_name, community_members) VALUES('1238571109418926131', 'BattleBoard Team', 8);
INSERT INTO community(id, community_name, community_members) VALUES('1318571109418926132', 'Pathetic Failure Squad', 8);
INSERT INTO community(id, community_name, community_members) VALUES('1318571109418926133', 'Uppsala FGC', 8);
INSERT INTO community(id, community_name, community_members) VALUES('1318571109418966134', 'Gnarp FGC', 8);
INSERT INTO community(id, community_name, community_members) VALUES('1318571109418926135', 'IT Sektionen', 8);
INSERT INTO community(id, community_name, community_members) VALUES('1318571109418926136', 'Ångström Warriors', 8);
INSERT INTO community(id, community_name, community_members) VALUES('1318571109418926137', 'Moba Pro Club', 8);
-- Join users to communities
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('123e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e1', 'ShadowSlayer', '1238571109418926131');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('133e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e1', 'ShadowSlayer', '1318571109418926132');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('143e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e1', 'ShadowSlayer', '1318571109418926133');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('153e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e1', 'ShadowSlayer', '1318571109418966134');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('163e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e1', 'ShadowSlayer', '1318571109418926135');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('173e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e1', 'ShadowSlayer', '1318571109418926136');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('183e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e1', 'ShadowSlayer', '1318571109418926137');

-- Join DragonFury to all communities
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('223e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e2', 'DragonFury', '1238571109418926131');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('233e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e2', 'DragonFury', '1318571109418926132');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('243e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e2', 'DragonFury', '1318571109418926133');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('253e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e2', 'DragonFury', '1318571109418966134');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('263e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e2', 'DragonFury', '1318571109418926135');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('273e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e2', 'DragonFury', '1318571109418926136');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('283e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e2', 'DragonFury', '1318571109418926137');

-- Join PhoenixRider to all communities
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('323e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e3', 'PhoenixRider', '1238571109418926131');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('333e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e3', 'PhoenixRider', '1318571109418926132');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('343e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e3', 'PhoenixRider', '1318571109418926133');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('353e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e3', 'PhoenixRider', '1318571109418966134');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('363e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e3', 'PhoenixRider', '1318571109418926135');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('373e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e3', 'PhoenixRider', '1318571109418926136');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('383e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e3', 'PhoenixRider', '1318571109418926137');

-- Join ViperStrike to all communities
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('423e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e4', 'ViperStrike', '1238571109418926131');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('433e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e4', 'ViperStrike', '1318571109418926132');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('443e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e4', 'ViperStrike', '1318571109418926133');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('453e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e4', 'ViperStrike', '1318571109418966134');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('463e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e4', 'ViperStrike', '1318571109418926135');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('473e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e4', 'ViperStrike', '1318571109418926136');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('483e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e4', 'ViperStrike', '1318571109418926137');

-- Join BlazeHunter to all communities
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('523e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e5', 'BlazeHunter', '1238571109418926131');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('533e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e5', 'BlazeHunter', '1318571109418926132');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('543e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e5', 'BlazeHunter', '1318571109418926133');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('553e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e5', 'BlazeHunter', '1318571109418966134');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('563e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e5', 'BlazeHunter', '1318571109418926135');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('573e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e5', 'BlazeHunter', '1318571109418926136');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('583e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e5', 'BlazeHunter', '1318571109418926137');

-- Join StormBringer to all communities
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('623e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e6', 'StormBringer', '1238571109418926131');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('633e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e6', 'StormBringer', '1318571109418926132');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('643e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e6', 'StormBringer', '1318571109418926133');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('653e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e6', 'StormBringer', '1318571109418966134');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('663e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e6', 'StormBringer', '1318571109418926135');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('673e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e6', 'StormBringer', '1318571109418926136');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('683e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e6', 'StormBringer', '1318571109418926137');

-- Join NightHawk to all communities
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('723e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e7', 'NightHawk', '1238571109418926131');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('733e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e7', 'NightHawk', '1318571109418926132');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('743e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e7', 'NightHawk', '1318571109418926133');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('753e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e7', 'NightHawk', '1318571109418966134');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('763e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e7', 'NightHawk', '1318571109418926135');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('773e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e7', 'NightHawk', '1318571109418926136');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('783e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e7', 'NightHawk', '1318571109418926137');

-- Join RogueAssassin to all communities
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('823e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e8', 'RogueAssassin', '1238571109418926131');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('833e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e8', 'RogueAssassin', '1318571109418926132');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('843e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e8', 'RogueAssassin', '1318571109418926133');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('853e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e8', 'RogueAssassin', '1318571109418966134');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('863e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e8', 'RogueAssassin', '1318571109418926135');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('873e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e8', 'RogueAssassin', '1318571109418926136');
INSERT INTO user_community(id, user_id, user_name, community_id) VALUES('883e3928-5b50-45a1-92cf-c8695af932e0', 'c41e3728-5a50-45a1-92cf-c8695af932e8', 'RogueAssassin', '1318571109418926137');



-- Games
INSERT INTO game(id, game_name) VALUES('141e3728-5a50-45a1-92cf-c8695af932e1', 'Dota 2');
INSERT INTO game(id, game_name) VALUES('121e3728-5a50-45a1-92cf-c8695af932e1', 'League of Legends');
INSERT INTO game(id, game_name) VALUES('131e3728-5a50-45a1-92cf-c8695af932e1', 'Street fighter 6');
INSERT INTO game(id, game_name) VALUES('141f3728-5a50-45a1-92cf-c8695af932e1', 'Counter strike 2');
INSERT INTO game(id, game_name) VALUES('151e3728-5a50-45a1-92cf-c8695af932e1', 'Valorant');
INSERT INTO game(id, game_name) VALUES('141f3738-5a50-45a1-92cf-c8695af932e1', 'Marvel Rivals');
INSERT INTO game(id, game_name) VALUES('131e4727-5a60-45a1-92cf-c8695af932e1', 'Overwatch 2');
INSERT INTO game(id, game_name) VALUES('241e3728-5b50-45a1-92cf-c8695af932e1', 'Tekken 8');
INSERT INTO game(id, game_name) VALUES('241e3728-5b50-45a1-92cf-c8695af932e2', 'Among us');



-- Competitions
INSERT INTO competition(id, creator_name, competition_name, competition_description, competition_type, format, game_id, rank_alg, participants, community_id)
VALUES('152e3928-5b50-45a1-92cf-c8695af932e5', 'ShadowSlayer', 'LOL rival league', 'Rival league in LOL', 2, 1, '121e3728-5a50-45a1-92cf-c8695af932e1', 1,  2, '1238571109418926131');

INSERT INTO competition(id, creator_name, competition_name, competition_description, competition_type, format, game_id, rank_alg, participants, community_id)
VALUES('152e3928-5b50-45a1-92cf-c8695af932e6', 'DragonFury', 'Kappa clash 10', '10th kappa clash in sf6', 0, 1, '131e3728-5a50-45a1-92cf-c8695af932e1', 1,  8, '1318571109418926133');

INSERT INTO competition(id, creator_name, competition_name, competition_description, competition_type, format, game_id, rank_alg, participants, community_id)
VALUES('152e3928-5b50-45a1-92cf-c8695af932e8', 'DragonFury', 'Kappa Clash 11', '11th kappa clash in sf6', 0, 1, '131e3728-5a50-45a1-92cf-c8695af932e1', 1, 8, '1318571109418926133');

INSERT INTO competition(id, creator_name, competition_name, competition_description, competition_type, format, game_id, rank_alg, participants, community_id)
VALUES('152e3928-5b50-45a1-92cf-c8695af932e7', 'PhoenixRider', 'Lab Wars: Ångström Edt', 'sussy @ ångström', 0, 1, '241e3728-5b50-45a1-92cf-c8695af932e2', 1,  8, '1318571109418926136');

INSERT INTO competition(id, creator_name, competition_name, competition_description, competition_type, format, game_id, rank_alg, participants, community_id)
VALUES('152c3928-5b50-45a1-92cf-c9695af931e7', 'ShadowSlayer', 'Valorant IT Leaderboard', 'Classic mode leaderboard', 1, 1, '151e3728-5a50-45a1-92cf-c8695af932e1', 1,  2, '1318571109418926135');

-- join users to LOL Rival League
INSERT INTO user_competition(id, user_name, competition_id) VALUES('123d4923-5b50-45a1-92cf-c1695af931e1', 'ShadowSlayer', '152e3928-5b50-45a1-92cf-c8695af932e5');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('123d4923-5b50-45a1-92cf-c1695af931e2', 'RogueAssassin', '152e3928-5b50-45a1-92cf-c8695af932e5');

-- Join all users to Kappa clash 10
INSERT INTO user_competition(id, user_name, competition_id) VALUES('223d4923-5b50-45a1-92cf-c1695af931e2', 'ShadowSlayer', '152e3928-5b50-45a1-92cf-c8695af932e6');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('223d4923-5b50-45a1-92cf-c1695af931e3', 'DragonFury', '152e3928-5b50-45a1-92cf-c8695af932e6');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('223d4923-5b50-45a1-92cf-c1695af931e4', 'PhoenixRider', '152e3928-5b50-45a1-92cf-c8695af932e6');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('223d4923-5b50-45a1-92cf-c1695af931e5', 'ViperStrike', '152e3928-5b50-45a1-92cf-c8695af932e6');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('223d4923-5b50-45a1-92cf-c1695af931e6', 'BlazeHunter', '152e3928-5b50-45a1-92cf-c8695af932e6');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('223d4923-5b50-45a1-92cf-c1695af931e7', 'StormBringer', '152e3928-5b50-45a1-92cf-c8695af932e6');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('223d4923-5b50-45a1-92cf-c1695af931e8', 'NightHawk', '152e3928-5b50-45a1-92cf-c8695af932e6');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('223d4923-5b50-45a1-92cf-c1695af931e9', 'RogueAssassin', '152e3928-5b50-45a1-92cf-c8695af932e6');

-- Join all users to Kappa Clash 11
INSERT INTO user_competition(id, user_name, competition_id) VALUES('223d4923-5b50-45a1-92cf-c1695af931ea', 'ShadowSlayer', '152e3928-5b50-45a1-92cf-c8695af932e8');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('223d4923-5b50-45a1-92cf-c1695af931eb', 'DragonFury', '152e3928-5b50-45a1-92cf-c8695af932e8');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('223d4923-5b50-45a1-92cf-c1695af931ec', 'PhoenixRider', '152e3928-5b50-45a1-92cf-c8695af932e8');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('223d4923-5b50-45a1-92cf-c1695af931ed', 'ViperStrike', '152e3928-5b50-45a1-92cf-c8695af932e8');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('223d4923-5b50-45a1-92cf-c1695af931ee', 'BlazeHunter', '152e3928-5b50-45a1-92cf-c8695af932e8');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('223d4923-5b50-45a1-92cf-c1695af931ef', 'StormBringer', '152e3928-5b50-45a1-92cf-c8695af932e8');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('223d4923-5b50-45a1-92cf-c1695af931f1', 'NightHawk', '152e3928-5b50-45a1-92cf-c8695af932e8');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('223d4923-5b50-45a1-92cf-c1695af931f2', 'RogueAssassin', '152e3928-5b50-45a1-92cf-c8695af932e8');

-- Join all users to Lab Wars: Ångström Edt
INSERT INTO user_competition(id, user_name, competition_id) VALUES('323d4923-5b50-45a1-92cf-c1695af931d1', 'ShadowSlayer', '152e3928-5b50-45a1-92cf-c8695af932e7');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('323d4923-5b50-45a1-92cf-c1695af931d2', 'DragonFury', '152e3928-5b50-45a1-92cf-c8695af932e7');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('323d4923-5b50-45a1-92cf-c1695af931d3', 'PhoenixRider', '152e3928-5b50-45a1-92cf-c8695af932e7');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('323d4923-5b50-45a1-92cf-c1695af931d4', 'ViperStrike', '152e3928-5b50-45a1-92cf-c8695af932e7');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('323d4923-5b50-45a1-92cf-c1695af931d5', 'BlazeHunter', '152e3928-5b50-45a1-92cf-c8695af932e7');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('323d4923-5b50-45a1-92cf-c1695af931d6', 'StormBringer', '152e3928-5b50-45a1-92cf-c8695af932e7');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('323d4923-5b50-45a1-92cf-c1695af931d7', 'NightHawk', '152e3928-5b50-45a1-92cf-c8695af932e7');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('323d4923-5b50-45a1-92cf-c1695af931d8', 'RogueAssassin', '152e3928-5b50-45a1-92cf-c8695af932e7');


-- join users to Valorant IT Leaderboard
INSERT INTO user_competition(id, user_name, competition_id) VALUES('123d4928-5b50-45a1-92cf-c9695af931e1', 'ShadowSlayer', '152c3928-5b50-45a1-92cf-c9695af931e7');
INSERT INTO user_competition(id, user_name, competition_id) VALUES('123d5928-5b50-45a1-92cf-c9695af931e2', 'DragonFury', '152c3928-5b50-45a1-92cf-c9695af931e7');

--Leaderboard
INSERT INTO leaderboard(id, competition_id)
VALUES('d242ad95-555e-4dc5-8756-19c60d13264e', '152c3928-5b50-45a1-92cf-c9695af931e7');

--Leaderboard metrics
INSERT INTO leaderboard_metric(leaderboard_id, metric_name)
VALUES('d242ad95-555e-4dc5-8756-19c60d13264e', 'kills');

INSERT INTO leaderboard_metric(leaderboard_id, metric_name)
VALUES('d242ad95-555e-4dc5-8756-19c60d13264e', 'deaths');

-- Additional metrics
INSERT INTO leaderboard_metric(leaderboard_id, metric_name)
VALUES('d242ad95-555e-4dc5-8756-19c60d13264e', 'assists');

INSERT INTO leaderboard_metric(leaderboard_id, metric_name)
VALUES('d242ad95-555e-4dc5-8756-19c60d13264e', 'headshots');

INSERT INTO leaderboard_metric(leaderboard_id, metric_name)
VALUES('d242ad95-555e-4dc5-8756-19c60d13264e', 'damage');

--Leaderboard metric values
INSERT INTO leaderboard_entry(id, leaderboard_id, user_name, metric_name, metric_value)
VALUES('c242ad95-555e-4c25-8756-19c60d13264e', 'd242ad95-555e-4dc5-8756-19c60d13264e', 'ShadowSlayer', 'kills', 50);

INSERT INTO leaderboard_entry(id, leaderboard_id, user_name, metric_name, metric_value)
VALUES('c242ad95-557e-4c25-8756-19c60d13464e', 'd242ad95-555e-4dc5-8756-19c60d13264e', 'ShadowSlayer', 'deaths', 10);

INSERT INTO leaderboard_entry(id, leaderboard_id, user_name, metric_name, metric_value)
VALUES('c242ad95-555e-4c25-8756-19c60d13264f', 'd242ad95-555e-4dc5-8756-19c60d13264e', 'DragonFury', 'kills', 20);

INSERT INTO leaderboard_entry(id, leaderboard_id, user_name, metric_name, metric_value)
VALUES('c242ad95-555e-4c24-8756-19c60d13264f', 'd242ad95-555e-4dc5-8756-19c60d13264e', 'DragonFury', 'deaths', 16);

-- Additional game metrics for ShadowSlayer
INSERT INTO leaderboard_entry(id, leaderboard_id, user_name, metric_name, metric_value)
VALUES('c242ad95-555e-4c25-8756-19c60d132650', 'd242ad95-555e-4dc5-8756-19c60d13264e', 'ShadowSlayer', 'assists', 30);

INSERT INTO leaderboard_entry(id, leaderboard_id, user_name, metric_name, metric_value)
VALUES('c242ad95-555e-4c25-8756-19c60d132651', 'd242ad95-555e-4dc5-8756-19c60d13264e', 'ShadowSlayer', 'headshots', 15);

INSERT INTO leaderboard_entry(id, leaderboard_id, user_name, metric_name, metric_value)
VALUES('c242ad95-555e-4c25-8756-19c60d132652', 'd242ad95-555e-4dc5-8756-19c60d13264e', 'ShadowSlayer', 'damage', 5000);

-- Additional game metrics for DragonFury
INSERT INTO leaderboard_entry(id, leaderboard_id, user_name, metric_name, metric_value)
VALUES('c242ad95-555e-4c25-8756-19c60d132653', 'd242ad95-555e-4dc5-8756-19c60d13264e', 'DragonFury', 'assists', 25);

INSERT INTO leaderboard_entry(id, leaderboard_id, user_name, metric_name, metric_value)
VALUES('c242ad95-555e-4c25-8756-19c60d132654', 'd242ad95-555e-4dc5-8756-19c60d13264e', 'DragonFury', 'headshots', 10);

INSERT INTO leaderboard_entry(id, leaderboard_id, user_name, metric_name, metric_value)
VALUES('c242ad95-555e-4c25-8756-19c60d132655', 'd242ad95-555e-4dc5-8756-19c60d13264e', 'DragonFury', 'damage', 4500);





