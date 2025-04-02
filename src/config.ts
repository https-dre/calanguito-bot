import dotenv from "dotenv";

dotenv.config();

const { BOT_TOKEN, DISCORD_CLIENT_ID, GUILD_TEST } = process.env;
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

if (!BOT_TOKEN || !DISCORD_CLIENT_ID || !GUILD_TEST) {
    throw new Error("Missing required environment variables")
}

export const config = {
    BOT_TOKEN,
    DISCORD_CLIENT_ID,
    GUILD_TEST,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE
}