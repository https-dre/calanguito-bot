import Pool from "../data/conn";
import { RowDataPacket } from "mysql2";

type AutoRole = {
    id: number
    guild_id: string
    role_id: string
}

export async function verify_auto_role(guild_id: string): Promise<AutoRole|null> {
    try {
        const [rows] = await Pool.query<RowDataPacket[]>("SELECT * FROM auto_role WHERE guild_id = ?", [guild_id]);
        if(rows.length === 0) {
            return null;
        }

        return rows[0] as AutoRole;
    }
    catch (err) {
        console.error(`Erro ao buscar auto_role: ${err}`)
        return null;
    }
}