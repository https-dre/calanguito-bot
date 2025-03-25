import { Client, GatewayIntentBits } from 'discord.js';
import { deployCommands } from './deploy-commands';
import { commands } from './commands';

const client = new Client({
    intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
})

client.once("ready", () => {
    console.log("Bot is ready")
})

client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    if (message.content == "!ping") {
        message.reply("Pong!")
        client.emit("customPing", message)
    }
});

client.login(process.env.BOT_TOKEN)