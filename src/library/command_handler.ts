import { Client, Message } from "discord.js"
import { prefix } from "./config.json"

export function randrange(max: number, min = 0): number {
    return Math.round((Math.random() * (max - min) + min));
}

export function command(client: Client, aliases: string[], callback: (arg0: Message) => void) {

    client.on('message', msg => {

        let content = msg.content;

        aliases.forEach(alias => {
            const command = `${prefix}${alias}`

            if ((content.startsWith(`${command} `) || (content === `${command}`))) {
                console.log(`running ${command}`);
                callback(msg);
            }
        });
    });
}
