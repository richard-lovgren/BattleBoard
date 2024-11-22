
-- User table
CREATE TABLE "User" ( -- Slight inconvenience - ASP requires pascal case, but Postgres converts unquoted identifiers to lowercase
    "Id" UUID PRIMARY KEY,
    "DiscordId" UUID NOT NULL,
    "UserName" VARCHAR(30) NOT NULL,
    "DisplayName" VARCHAR(30)
);

-- Community table
CREATE TABLE community (
    id UUID PRIMARY KEY,
    community_name VARCHAR(30) NOT NULL,
    community_image BYTEA
);

-- Game table
CREATE TABLE game (
    id UUID PRIMARY KEY,
    game_name VARCHAR(30) NOT NULL
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
    participants INT NOT NULL
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

-- Match participant table
CREATE TABLE match_participant (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES "User"("Id") ON DELETE CASCADE,
    match_id UUID REFERENCES "User"("Id") ON DELETE CASCADE
);

-- Constraints
ALTER TABLE competition ADD CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES game(id) ON DELETE SET NULL;
ALTER TABLE "match" ADD CONSTRAINT fk_competition FOREIGN KEY (competition_id) REFERENCES competition(id) ON DELETE CASCADE;
ALTER TABLE match_participant ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "User"("Id") ON DELETE CASCADE;
ALTER TABLE match_participant ADD CONSTRAINT fk_match FOREIGN KEY (match_id) REFERENCES "match"(id) ON DELETE CASCADE;