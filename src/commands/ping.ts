import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const pingCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responde com Pong!"),
  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.reply("Pong!");
  }
};