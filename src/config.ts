import dotenv from "dotenv";

dotenv.config();

const { BOT_TOKEN, DISCORD_CLIENT_ID } = process.env;

if (!BOT_TOKEN || !DISCORD_CLIENT_ID) {
    throw new Error("Missing required environment variables")
}

export const config = {
    BOT_TOKEN,
    DISCORD_CLIENT_ID
}