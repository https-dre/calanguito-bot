import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName("clear-messages")
    .setDescription("Deleta mensagens de um canal")
    .addIntegerOption(option =>
        option.setName("range")
            .setDescription("Número de mensagens a serem deletadas")
            .setRequired(true)
    );

export const execute = async (interaction: ChatInputCommandInteraction) => {
    if (interaction.isRepliable()) {
        await interaction.reply("Deletando mensagens...");
    }
}