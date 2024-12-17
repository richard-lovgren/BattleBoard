
-- User table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    discord_id bigserial NOT NULL,
    user_name VARCHAR(30) NOT NULL UNIQUE,
    display_name VARCHAR(30),
    league_puuid VARCHAR(100)
);

-- Community table
CREATE TABLE community (
    id bigserial PRIMARY KEY,
    community_name VARCHAR(30) NOT NULL,
    community_image VARCHAR(120),
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
    community_id bigserial REFERENCES community(id) ON DELETE CASCADE
);

-- User Community N-N table
CREATE TABLE user_community (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    user_name VARCHAR(30) NOT NULL,
    community_id bigserial REFERENCES community(id) ON DELETE CASCADE
);



-- Competition table
CREATE TABLE competition (
    id UUID PRIMARY KEY,
    competition_name VARCHAR(30) NOT NULL,
    competition_description VARCHAR(30),
    competition_type INT NOT NULL,
    format INT NOT NULL,
    competition_image BYTEA,
    is_open BOOLEAN NOT NULL DEFAULT TRUE,
    is_running BOOLEAN NOT NULL DEFAULT FALSE,
    game_id UUID REFERENCES game(id) ON DELETE SET NULL,
    rank_alg INT NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    participants INT NOT NULL,
    community_id bigserial REFERENCES community(id) ON DELETE CASCADE
);

CREATE TABLE user_competition (
    id UUID PRIMARY KEY,
    user_name VARCHAR(30) NOT NULL REFERENCES users(user_name) ON DELETE CASCADE,
    competition_id UUID REFERENCES competition(id) ON DELETE CASCADE
);

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