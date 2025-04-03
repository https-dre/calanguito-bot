import Pool from "../data/conn"
import { RowDataPacket } from 'mysql2/promise';

export async function insertGuild(id: string, name: string): Promise<void> {
    try {
        const [result] = await Pool.execute(
            'INSERT INTO guilds (id, name) VALUES (?, ?)',
            [id, name]
        );

        console.log('Resultado da inserção:', result);

        if ((result as any).affectedRows > 0) {
            console.log('Inserção bem-sucedida!');
        } else {
            console.log('Nenhuma linha foi inserida.');
        }
    } catch (error) {
        console.error('Erro ao inserir guild:', error);
    }
}

export async function find_build_by_id(id: string): Promise<{ name: string; id: string } | null> {
    try {
        const [rows] = await Pool.query<RowDataPacket[]>('SELECT name, id FROM guilds WHERE id = ?', [id]);

        console.log(rows); // Debug

        if (rows.length === 0) {
            return null;
        }

        return rows[0] as { name: string; id: string };
    } catch (error) {
        console.error('Erro ao buscar build:', error);
        return null;
    }
}