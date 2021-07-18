"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command_handler_1 = require("./library/command_handler");
const dice_1 = require("./library/dice");
const fs_1 = require("fs");
const XP_1 = __importDefault(require("./library/XP"));
const PermissionError_1 = require("./library/PermissionError");
const config_json_1 = require("./library/config.json");
// const CLOSED_CIRCLE = '●';
// const OPEN_CIRCLE   = '○';
let bot = new discord_js_1.Client();
bot.on("ready", () => {
    var _a;
    console.log(`up and running as ${(_a = bot.user) === null || _a === void 0 ? void 0 : _a.username}`);
    command_handler_1.command(bot, ['ping'], msg => {
        msg.channel.send('pong');
    });
    command_handler_1.command(bot, ['xp list'], msg => {
        const characters = fs_1.readdirSync(XP_1.default.dirPath, 'utf-8');
        characters.forEach((value, i) => {
            characters[i] = value.replace(/(XP_|\.json)/g, '');
        });
        msg.channel.send(`\`\`\`${characters.join('\n')}\`\`\``);
    });
    command_handler_1.command(bot, ["xp delete"], msg => {
    });
    command_handler_1.command(bot, ["xp new"], msg => {
        var _a, _b;
        let args = msg.content.substr(1).split(" ").splice(2);
        let narrator = '';
        if (args.length >= 3)
            narrator = args.pop();
        let charName = args.join(" ").toLowerCase();
        if (fs_1.existsSync(`${XP_1.default.dirPath}/XP_${charName}.json`)) {
            let existing = new XP_1.default('').deserialize(`XP_${charName}.json`);
            msg.channel.send(`O personagem ${charName} ja existe e pertence a ${existing.jogador}`);
            return;
        }
        let created = new XP_1.default(args.join(" "), narrator, (_a = msg.author) === null || _a === void 0 ? void 0 : _a.username);
        created.serialize();
        msg.channel.send(`Criado personagem \`${args.join(" ")}\` para <@${(_b = msg.author) === null || _b === void 0 ? void 0 : _b.id}>`);
    });
    command_handler_1.command(bot, ["xp get"], msg => {
        let args = msg.content.substr(1).split(" ").splice(2);
        let ser = new XP_1.default('');
        let char = args.join(" ").toLowerCase();
        try {
            ser.deserialize(`./XP_${char}.json`);
            msg.channel.send(`\`\`\`${ser.charName}\n`
                + `JOGADOR:     ${ser.jogador}\n`
                + `NARRADOR:    ${ser.narrador}\n`
                + `XP NA POOL:  ${ser.current}\n`
                + `TOTAL GANHO: ${ser.total}\n`
                + `TOTAL GASTO: ${ser.spent}\n`
                + `GASTO EM:    ${ser.spentOn}\`\`\``);
        }
        catch (err) {
            PermissionError_1.error_handler(msg, err);
        }
    });
    command_handler_1.command(bot, ["xp add"], msg => {
        var _a;
        let args = msg.content.substr(1).split(" ").splice(2);
        let howMuch = parseInt(args.pop());
        let char = new XP_1.default('');
        try {
            char.deserialize(`XP_${args.join(" ").toLowerCase()}.json`);
            if (char.jogador != ((_a = msg.author) === null || _a === void 0 ? void 0 : _a.username))
                throw new PermissionError_1.PermissionError();
        }
        catch (err) {
            if (PermissionError_1.error_handler(msg, err))
                return;
        }
        char.addXp(howMuch);
        msg.channel.send(`Adicionando ${howMuch}XP para ${char.charName}!`);
        char.serialize();
    });
    command_handler_1.command(bot, ["xp buy"], msg => {
        var _a;
        let args = msg.content.substr(1).split(" ").splice(2);
        while (args.includes('')) {
            args.forEach((value, index) => {
                if (value === '')
                    args.splice(index, 1);
            });
        }
        let char = new XP_1.default('');
        let cost = parseInt(args.pop());
        let whatOn = args.reverse().splice(0, 2).reverse();
        let charName = args.splice(0, whatOn.length).reverse().join(" ");
        try {
            char.deserialize(`XP_${charName}.json`);
            if (char.jogador != ((_a = msg.author) === null || _a === void 0 ? void 0 : _a.username))
                throw new PermissionError_1.PermissionError();
        }
        catch (err) {
            if (PermissionError_1.error_handler(msg, err))
                return;
        }
        if (!char.spendXp(cost, whatOn.join(" "))) {
            msg.channel.send("Você não tem XP suficiente!");
            return;
        }
        char.serialize();
        msg.channel.send(`${charName} comprou ${whatOn.join(" ")} por ${cost}XP!`);
    });
    command_handler_1.command(bot, ["xp help"], msg => {
        var _a;
        msg.channel.send(`<@${(_a = msg.author) === null || _a === void 0 ? void 0 : _a.id}>\n`
            + `AQUI VEM A MENSAGEM DE AJUDA DO BOT`
            + `AINDA VAI SER IMPLEMENTADO`);
    });
});
bot.on("message", msg => {
    var _a, _b, _c;
    if (((_a = msg.author) === null || _a === void 0 ? void 0 : _a.id) === ((_b = bot.user) === null || _b === void 0 ? void 0 : _b.id))
        return;
    let dice_regex = /[0-9]+d[0-9]+/;
    let content = msg.content;
    if (!dice_regex.test(content))
        return;
    let info = content.split("d");
    let sides = parseInt(info[1]);
    let times = parseInt(info[0]);
    let rolls = dice_1.roll(sides, times);
    msg.channel.send(`<@${(_c = msg.author) === null || _c === void 0 ? void 0 : _c.id}> rolou ${times}d${sides}\n\`${rolls}\``);
});
bot.login(config_json_1.TOKEN);
