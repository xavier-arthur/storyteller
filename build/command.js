"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("./config.json");
function command(client, aliases, callback) {
    client.on('message', msg => {
        let content = msg.content;
        aliases.forEach(alias => {
            const command = `${config_json_1.prefix}${alias}`;
            if ((content.startsWith(`${command} `) || (content === `${command}`))) {
                console.log(`running ${command}`);
            }
        });
    });
}
exports.default = command;
