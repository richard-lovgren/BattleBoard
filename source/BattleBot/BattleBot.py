import discord
from discord.ext import commands
from dotenv import load_dotenv
from os import getenv

import requests
import logging

import json

intents = discord.Intents.default()
intents.message_content = True
intents.members = True
bot = commands.Bot(command_prefix="!", intents=intents)

# state_url_obj =
# https://discord.com/oauth2/authorize?client_id=1308029231342555136&permissions=18136036801537&integration_type=0&scope=bot


@bot.event
async def on_ready():
    try:
        synced = await bot.tree.sync()  # Sync all slash commands
        print(f"Synced {len(synced)} commands successfully!")
        print(f"API URL: {getenv('API_URL')}")

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
                "id": guild.id,
            }
        else:
            community_data = {
                "community_name": guild.name,
                "community_image": guild.icon.url,
                "id": guild.id,
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


@bot.tree.command(name="test", description="skibidi toilet")
async def competitions(interaction: discord.Interaction):

    await interaction.response.send_message(f"skibidi\n\n[]")


# Run the bot
load_dotenv()
token = getenv("DISCORD_TOKEN")
print(f"Starting bot with token: {token}")

bot.run(token=token)
