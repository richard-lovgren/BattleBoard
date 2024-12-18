
-- User table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    discord_id BIGINT NOT NULL,
    user_name VARCHAR(30) NOT NULL UNIQUE,
    display_name VARCHAR(30),
    league_puuid VARCHAR(100)
);

-- Community table
CREATE TABLE community (
    id BIGINT PRIMARY KEY,
    community_name VARCHAR(30) NOT NULL,
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
    community_id BIGINT REFERENCES community(id) ON DELETE CASCADE
);

-- User Community N-N table
CREATE TABLE user_community (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    user_name VARCHAR(30) NOT NULL,
    community_id BIGINT REFERENCES community(id) ON DELETE CASCADE
);



-- Competition table
CREATE TABLE competition (
    id UUID PRIMARY KEY,
    creator_name VARCHAR(30) NOT NULL REFERENCES users(user_name) ON DELETE CASCADE,
    competition_name VARCHAR(30) NOT NULL,
    competition_description VARCHAR(250),
    competition_type INT NOT NULL,
    format INT NOT NULL,
    competition_image BYTEA,
    is_open BOOLEAN NOT NULL DEFAULT TRUE,
    is_running BOOLEAN NOT NULL DEFAULT FALSE,
    game_id UUID REFERENCES game(id) ON DELETE SET NULL,
    rank_alg INT NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    participants INT DEFAULT 0 NOT NULL,
    community_id BIGINT REFERENCES community(id) ON DELETE CASCADE
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

CREATE TABLE "leaderboard_user_score" ( 
    id UUID PRIMARY KEY,
    leaderboard_id UUID REFERENCES leaderboard(id) ON DELETE CASCADE,
    user_name VARCHAR(30) NOT NULL REFERENCES users(user_name) ON DELETE CASCADE,
    metric_name VARCHAR(30),
    score INT NOT NULL,
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
INSERT INTO users(id, discord_id, user_name, display_name) VALUES('c41e3728-5a50-45a1-92cf-c8695af932e1', 125874175400911360, 'dummy1', 'Dummy 1');
INSERT INTO users(id, discord_id, user_name, display_name) VALUES('c41e3728-5a50-45a1-92cf-c8695af932e2', 125854175400911360, 'dummy2', 'Dummy 2');
INSERT INTO users(id, discord_id, user_name, display_name) VALUES('c41e3728-5a50-45a1-92cf-c8695af932e3', 125834175400911360, 'dummy3', 'Dummy 3');
INSERT INTO users(id, discord_id, user_name, display_name) VALUES('c41e3728-5a50-45a1-92cf-c8695af932e4', 125814175400911360, 'dummy4', 'Dummy 4');
INSERT INTO users(id, discord_id, user_name, display_name) VALUES('c41e3728-5a50-45a1-92cf-c8695af932e5', 125894275400911360, 'dummy5', 'Dummy 5');

-- Games
INSERT INTO game(id, game_name) VALUES('141e3728-5a50-45a1-92cf-c8695af932e1', 'Dota 2');
INSERT INTO game(id, game_name) VALUES('121e3728-5a50-45a1-92cf-c8695af932e1', 'League of legends');
INSERT INTO game(id, game_name) VALUES('131e3728-5a50-45a1-92cf-c8695af932e1', 'Street fighter 6');
INSERT INTO game(id, game_name) VALUES('141f3728-5a50-45a1-92cf-c8695af932e1', 'Counter strike 2');
INSERT INTO game(id, game_name) VALUES('151e3728-5a50-45a1-92cf-c8695af932e1', 'Valorant');
INSERT INTO game(id, game_name) VALUES('141f3738-5a50-45a1-92cf-c8695af932e1', 'Marvel Rivals');
INSERT INTO game(id, game_name) VALUES('131e4727-5a60-45a1-92cf-c8695af932e1', 'Overwatch 2');
INSERT INTO game(id, game_name) VALUES('241e3728-5b50-45a1-92cf-c8695af932e1', 'Tekken 8');
INSERT INTO game(id, game_name) VALUES('241e3728-5b50-45a1-92cf-c8695af932e2', 'Among us');


--Communities
INSERT INTO community(id, community_name, community_members) VALUES(1318571109418926131, 'BattleBoard Team', 5);
INSERT INTO community(id, community_name, community_members) VALUES(1318571109418926132, 'Pathetic Failure Squad', 10);
INSERT INTO community(id, community_name, community_members) VALUES(1318571109418926133, 'Uppsala FGC', 50);
INSERT INTO community(id, community_name, community_members) VALUES(1318571109418966134, 'Gnarp FGC', 8);
INSERT INTO community(id, community_name, community_members) VALUES(1318571109418926135, 'IT Sektionen', 500);
INSERT INTO community(id, community_name, community_members) VALUES(1318571109418926136, 'Ångström Warriors', 75);
INSERT INTO community(id, community_name, community_members) VALUES(1318571109418926137, 'Moba Pro Club', 24);

-- Competitions
INSERT INTO competition(id, creator_name, competition_name, competition_description, competition_type, format, game_id, rank_alg, participants, community_id)
VALUES('152e3928-5b50-45a1-92cf-c8695af932e5', 'dummy1', 'LOL rival league', 'Rival leauge in LOL', 3, 1, '121e3728-5a50-45a1-92cf-c8695af932e1', 1,  2, 1318571109418926131);


INSERT INTO competition(id, creator_name, competition_name, competition_description, competition_type, format, game_id, rank_alg, participants, community_id)
VALUES('152e3928-5b50-45a1-92cf-c8695af932e6', 'dummy2', 'Kapp clash 10', '10th kappa clash in sf6', 1, 1, '131e3728-5a50-45a1-92cf-c8695af932e1', 1,  2, 1318571109418926133);


INSERT INTO competition(id, creator_name, competition_name, competition_description, competition_type, format, game_id, rank_alg, participants, community_id)
VALUES('152e3928-5b50-45a1-92cf-c8695af932e7', 'dummy3', 'Lab Wars: Ångström Edt', 'sussy @ ångström', 1, 1, '241e3728-5b50-45a1-92cf-c8695af932e2', 1,  2, 1318571109418926136);
