import { Guild } from "discord.js";
import Pool from "../data/conn";
import { insertGuild } from "../repositories/guild-repository";
import { deployCommands } from "../deploy-commands";

export async function guild_create(guild: Guild) {
    await insertGuild(guild.id, guild.name);
    await deployCommands({ guildId: guild.id })
}