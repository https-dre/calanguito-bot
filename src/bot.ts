import { Client, GatewayIntentBits, Message, OmitPartialGroupDMChannel } from 'discord.js';
import { deployCommands, deleteOldCommands } from './deploy-commands';
import { commands } from './commands';
import { messageHandlers } from './messages';
import { config } from './config';

const client = new Client({
    intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once("ready", () => {
    console.log("Bot is ready")
    if(process.env.PORT) {
        console.log(`Bot using: ${process.env.PORT}`)
    }
})

client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.find(cmd => cmd.data.name === interaction.commandName);
    if (command) {
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error("❌ Erro ao executar comando:", error);
            await interaction.reply({ content: "❌ Ocorreu um erro ao executar este comando.", ephemeral: true });
        }
    }
});

client.on("messageCreate", (data) => {
    if (data.author.bot) return;
    console.log(`Mensagem recebida: ${data.content}`);
    
    const key = data.content.split(" ")[0];

    const handler = messageHandlers.get(key);
    if (handler) {
        handler(data);
    }
});[

]
deployCommands({ guildId: config.GUILD_TEST });
client.login(config.BOT_TOKEN);
