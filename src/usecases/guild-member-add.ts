import { GuildMember } from "discord.js";
import { verify_auto_role } from "../repositories/auto-role";
import { find_build_by_id } from "../repositories/guild-repository"

export async function guild_member_add(member: GuildMember): Promise<boolean> {
    console.log(`${member.displayName} entrou no servidor ${member.guild.name}`)
    const result = await find_build_by_id(member.guild.id);

    if (result == null) {
        console.log("Guild não cadastrada!")
        return false;
    }

    const has_auto_role = await verify_auto_role(member.guild.id);
    console.log(has_auto_role);

    if(!has_auto_role) {
        return false;
    }

    const { guild } = member;

    const role = guild.roles.cache.get(has_auto_role.role_id)
    const botMember = guild.members.me;

    if(!botMember) {
        console.log("Bot não encontrado na guild!");
        return false;
    }

    if(!role) {
        return false;
    }

    if(member.roles.cache.get(role.id)) {
        return false;
    }

    // Verifica se o cargo está acima do cargo mais alto do bot
    if (role.position >= botMember.roles.highest.position) {
        console.log(`O cargo "${role.name}" está acima do cargo mais alto do bot!`);
        return false;
    }

    try {
        await member.roles.add(role);
    } catch (err) {
        console.error(err);
    }

    return false;
}