import { Message } from "discord.js";

const messageHandlers = new Map<string, (message: Message) => void>();

messageHandlers.set("!ping", (message) => {
    message.reply("Pong!");
});

export { messageHandlers };