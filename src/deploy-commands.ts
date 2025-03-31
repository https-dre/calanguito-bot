import { REST, Routes } from 'discord.js';
import { config } from "./config";
import { commands } from "./commands/index";

const commandsData = Object.values(commands).map(command => command.data);

const rest = new REST({ version: "10" }).setToken(config.BOT_TOKEN);

type DeployCommandsProps = {
    guildId: string
}

export async function deployCommands({ guildId }: DeployCommandsProps) {
    try {
        console.log("🚀 Atualizando Slash Commands...");

        await rest.put(
            Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
            { body: commands.map(cmd => cmd.data.toJSON()) }
        );

        console.log("✅ Comandos registrados com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao registrar comandos:", error);
    }
}

export async function deleteOldCommands({ guildId }: DeployCommandsProps) {
    try {
        console.log("🗑️ Buscando comandos antigos...");

        const registeredCommands = (await rest.get(
            Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId)
        )) as any[];

        // Obter os nomes dos comandos novos
        const newCommandNames = commandsData.map(cmd => cmd.name);

        // Filtrar comandos que não estão mais na lista de novos
        const oldCommands = registeredCommands.filter(cmd => !newCommandNames.includes(cmd.name));

        if (oldCommands.length > 0) {
            console.log("🚨 Removendo comandos antigos...");
            for (const cmd of oldCommands) {
                await rest.delete(Routes.applicationGuildCommand(config.DISCORD_CLIENT_ID, guildId, cmd.id));
                console.log(`🗑️ Comando deletado: ${cmd.name}`);
            }
        } else {
            console.log("✅ Nenhum comando antigo para remover.");
        }
    } catch (error) {
        console.error("❌ Erro ao deletar comandos:", error);
    }
}
