"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = exports.randrange = void 0;
const config_json_1 = require("./config.json");
function randrange(max, min = 0) {
    return Math.round((Math.random() * (max - min) + min));
}
exports.randrange = randrange;
function command(client, aliases, callback) {
    client.on('message', msg => {
        let content = msg.content;
        aliases.forEach(alias => {
            const command = `${config_json_1.prefix}${alias}`;
            if ((content.startsWith(`${command} `) || (content === `${command}`))) {
                console.log(`running ${command}`);
                callback(msg);
            }
        });
    });
}
exports.command = command;
