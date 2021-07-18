import { Client, Message } from "discord.js";
import * as config from "./config.json";
import { randrange } from "./command_handler";

export class PermissionError extends Error {

    constructor(msg: string = '') {
        super(msg);
        this.name = 'PermissionError';
    }
}

export function error_handler(msg: Message, error: Error) {
    let args = msg.content.substr(1).split(" ").splice(2);

    switch (error.name) {
        case 'TypeError':
            msg.channel.send(
                `${config.NOT_FOUND_MSG
                [randrange(config.NOT_FOUND_MSG.length - 1)]
                    .replace("<charName>", args.join(" "))}`
            );
            break;
        case 'PermissionError':
            msg.channel.send("Voce não tem permissão para editar esse personagem");
            return true;
        default:
            throw error;
    }
}