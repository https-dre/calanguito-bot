import { Client, GatewayIntentBits } from 'discord.js';
import { deployCommands } from './deploy-commands';
import { commands } from './commands';
import { messageHandlers } from './messages';
import { config } from './config';
import { guild_create } from './usecases/guild-create';
import { guild_member_add } from './usecases/guild-member-add';

const client = new Client({
    intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
]
});

client.once("ready", () => {
    console.log("Bot is ready")
    if(process.env.PORT) {
        console.log(`Bot using: ${process.env.PORT}`)
    }
})

client.on("guildCreate", guild_create);

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
});

client.on("guildMemberAdd", async (member) => {
    await guild_member_add(member);
})

client.login(config.BOT_TOKEN);
