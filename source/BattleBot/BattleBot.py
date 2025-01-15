import discord
from discord.ext import commands
from discord import Game
from dotenv import load_dotenv
from os import getenv

from asyncio import sleep

import requests
import logging

import json

intents = discord.Intents.default()
intents.message_content = True
intents.members = True
bot = commands.Bot(command_prefix="!", intents=intents)

# state_url_obj =
# https://discord.com/oauth2/authorize?client_id=1308029231342555136&permissions=18136036801537&integration_type=0&scope=bot

POLL_COMPETITIONS = True
competitions_printed: list[str] = []


@bot.event
async def on_ready():
    try:
        synced = await bot.tree.sync()  # Sync all slash commands

        activity = Game(name="BattleBoard")
        await bot.change_presence(activity=activity)

        print(f"Synced {len(synced)} commands successfully!")
        print(f"API URL: {getenv('API_URL')}")

        if POLL_COMPETITIONS:
            print("Polling of community competitions enabled!")
            bot.loop.create_task(poll_community_competitions())

    except Exception as e:
        print(f"Error syncing commands: {e}")


@bot.event
async def on_guild_join(guild: discord.Guild):

    existing_communities_res = requests.get(getenv("API_URL") + "/communities")

    if existing_communities_res.status_code != 200:
        print(f"Failed to get existing communities: {existing_communities_res}")
        return

    existing_communities = existing_communities_res.json()

    if str(guild.id) in str(existing_communities):
        print(f"Skipping existing community: {guild.name}")
        return

    try:

        print(f"Joined server: {guild.name}")

        if guild.icon is None:
            community_data = {
                "community_name": guild.name,
                "community_image": None,
                "id": str(guild.id),
            }
        else:
            community_data = {
                "community_name": guild.name,
                "community_image": guild.icon.url,
                "id": str(guild.id),
            }

        res = requests.post(getenv("API_URL") + "/communities", json=community_data)

        if res.status_code != 201:
            print(f"Failed to register community: {res.raw.read(), res.status_code}")
            return

        print(f"Registered community: {guild.name} with ID: {guild.id}")

        community_id = res.json()["id"]

        for member in guild.members:

            if member.id == bot.user.id:
                print(f"Skipping bot user: {member.name}")
                continue

            print(f"Adding member: {member.name} to community: {guild.name}")

            member_data = {"user_name": member.name}

            res = requests.post(
                getenv("API_URL") + f"/communities/{community_id}/users",
                json=member_data,
            )

            if res.status_code != 201:
                print(f"Failed to register member: {res}")
                break

            print(f"Added member: {member.name} to community: {guild.name}")
        
        # send message to the server
        channel = guild.text_channels[0]
        await channel.send(f"Community: {guild.name} has been registered with BattleBot!")

    except Exception as e:
        print(f"Error joining server: {e}")

@bot.event 
async def on_guild_remove(guild: discord.Guild):
    print(f"BattleBot removed from server: {guild.name}")

    print(f"Deleting community: {guild.name}")

    try:

        res = requests.delete(getenv("API_URL") + f"/communities/{guild.id}")

    except Exception as e:
        print(f"Error deleting community: {e}")
        return

    if res.status_code != 200:
        print(f"Failed to delete community: {res}")
        return
    
    print(f"Deleted community: {guild.name}")

@bot.event
async def on_member_join(member: discord.Member):
    print(f"Member joined: {member.name}")

    if member.id == bot.user.id:
        print(f"Skipping bot user: {member.name}")
        return

    print(f"Adding member: {member.name} to community: {member.guild.name}")

    member_data = {"user_name": member.name}

    try:

        res = requests.post(
            getenv("API_URL") + f"/communities/{str(member.guild.id)}/users",
            json=member_data,
        )

    except Exception as e:
        print(f"Error adding member: {e}")
        return

    if res.status_code != 201:
        print(f"Failed to add member: {res}")
        return

    print(f"Added member: {member.name} to community: {member.guild.name}")

@bot.event
async def on_member_remove(member: discord.Member):
    print(f"Member left: {member.name}")

    try:
        res = requests.delete(getenv("API_URL") + f"/communities/{member.guild.id}/{member.name}")

    except Exception as e:
        print(f"Error deleting member: {e}")
        return

    if res.status_code != 200:
        print(f"Failed to delete member: {res}")
        return
    
    print(f"Deleted member: {member.name}")


async def poll_community_competitions():
    #await bot.wait_until_ready()

    print("Polling servers")

    while not bot.is_closed(): #loop while bot online
        print("Polling competitions for all communities...")

        for guild in bot.guilds:
            res = requests.get(getenv("API_URL") + f"/communities/{str(guild.id)}/competitions")

            if res.status_code != 200:
                print(f"No competitions for community: {guild.name}")
                continue

            guild_competition_ids: list[str] = res.json()
            print(guild_competition_ids)
            guild_competitions = []

            for competition_id in guild_competition_ids:
                competition = requests.get(getenv("API_URL") + f"/competitions/{competition_id}")
                guild_competitions.append(competition.json())

            if len(guild_competitions) == 0:
                print(f"No competitions found for community: {guild.name}")
                continue

            for competition in guild_competitions:
                if competition["id"] in competitions_printed:
                    continue

                is_running = competition["is_running"]
                print(f"Is running: {is_running}")

                if is_running or not is_running:
                    print("Sending to channel")
                    print(competition)
                    channel = guild.text_channels[0]
                    competitions_printed.append(competition["id"])
                    await channel.send(f"Competition: {competition['competition_name']} has started!")

        print("Finished polling competitions for all communities.")

        await sleep(300)  # Poll every 5 minutes




@bot.tree.command(name="test", description="skibidi toilet")
async def competitions(interaction: discord.Interaction):

    await interaction.response.send_message(f"skibidi\n\n[]")


# Run the bot
load_dotenv()
token = getenv("DISCORD_TOKEN")
print(f"Starting bot with token: {token}")

bot.run(token=token)
