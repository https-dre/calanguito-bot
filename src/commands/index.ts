import { pingCommand } from "./ping";
import * as registerMessage from "./register-message"
import * as clearChat from "./clear-chat"

export const commands = [
  pingCommand,
  registerMessage,
  clearChat
];
