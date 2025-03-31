import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("register-message")
    .setDescription("Registers a message")
    .addStringOption(option =>
        option.setName("message_id")
            .setDescription("The message to register")
            .setRequired(true)
    )
    .addStringOption(option => 
        option.setName("id_cargo")
            .setDescription("O cargo que será atribuído ao usuário")
            .setRequired(true)
    )

export const execute = async (interaction: CommandInteraction) => {
    console.log("Registrando mensagem...");
    /* Armazenamento dos dados da mensagem aqui. */
    return interaction.reply("Nova mensagem registrada!");
}