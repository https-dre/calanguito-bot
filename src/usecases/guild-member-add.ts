import Pool from "../data/conn"
import { find_build_by_id } from "../data/guild-repository"

export async function guild_member_add(guild_id: string): Promise<boolean> {
    const result = await find_build_by_id(guild_id);
    if(result == null) {
        return false;
        console.log("Guild não cadastrada!")
    }
    return false
}