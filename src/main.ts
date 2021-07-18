import { Client, DiscordAPIError } from "discord.js";
import { exit } from "process";
import { command, randrange } from "./library/command_handler";
import { roll } from "./library/dice";
import { existsSync, readdirSync, rmSync } from "fs";
import XP from "./library/XP";
import { error_handler, PermissionError } from "./library/PermissionError";
import { TOKEN } from "./library/config.json";

let bot = new Client();

bot.on("ready", () => {
    console.log(`up and running as ${bot.user?.username}`)

    command(bot, ['ping'], msg => {
        msg.channel.send('pong');
    });

    command(bot, ['xp list'], msg => {
        const characters = readdirSync(XP.dirPath, 'utf-8');
        characters.forEach((value, i) => {
            characters[i] = value.replace(/(XP_|\.json)/g, '');
        });

        msg.channel.send(`\`\`\`${characters.join('\n')}\`\`\``);
    });


    command(bot, ["xp delete"], msg => {
        
    });

    command(bot, ["xp new"], msg => {
        let args = msg.content.substr(1).split(" ").splice(2);
        let narrator = '';
        if (args.length >= 3) narrator = args.pop()!;
        let charName = args.join(" ").toLowerCase();

        if (existsSync(`${XP.dirPath}/XP_${charName}.json`)) {
            let existing = new XP('').deserialize(`XP_${charName}.json`);
            msg.channel.send(`O personagem ${charName} ja existe e pertence a ${existing.jogador}`);
            return;
        }

        let created = new XP(args.join(" "), narrator, msg.author?.username);
        created.serialize();

        msg.channel.send(
            `Criado personagem \`${args.join(" ")}\` para <@${msg.author?.id}>`
        );
    });

    command(bot, ["xp get"], msg => {
        let args = msg.content.substr(1).split(" ").splice(2);
        let ser = new XP('');
        let char = args.join(" ").toLowerCase();

        try { 
            ser.deserialize(`./XP_${char}.json`);

            msg.channel.send(
                `\`\`\`${ser!.charName}\n`
                + `JOGADOR:     ${ser!.jogador}\n`
                + `NARRADOR:    ${ser!.narrador}\n`
                + `XP NA POOL:  ${ser!.current}\n`
                + `TOTAL GANHO: ${ser!.total}\n`
                + `TOTAL GASTO: ${ser!.spent}\n`
                + `GASTO EM:    ${ser!.spentOn}\`\`\``
            );
        } catch (err) {
            error_handler(msg, err);
        }

    });

    command(bot, ["xp add"], msg => {
        let args = msg.content.substr(1).split(" ").splice(2);
        let howMuch = parseInt(args.pop()!);
        let char = new XP('');

        try {
            char.deserialize(`XP_${args.join(" ").toLowerCase()}.json`)
            if (char.jogador != msg.author?.username) throw new PermissionError();
        } catch (err) {
            if(error_handler(msg, err)) return;
        }

        char.addXp(howMuch);
        msg.channel.send(`Adicionando ${howMuch}XP para ${char.charName}!`);
        char.serialize();
    });

    command(bot, ["xp buy"], msg => {
        let args: string[] = msg.content.substr(1).split(" ").splice(2);

        while (args.includes('')) {
            args.forEach((value, index) => {
                if (value === '') args.splice(index, 1);
            });
        }

        let char     = new XP('');
        let cost     = parseInt(args.pop()!);
        let whatOn   = args.reverse().splice(0, 2).reverse();
        let charName = args.splice(0, whatOn.length).reverse().join(" "); 
   

        try {
            char.deserialize(`XP_${charName}.json`)
            if (char.jogador != msg.author?.username) throw new PermissionError();
        } catch (err) {
            if (error_handler(msg, err)) return;
        }

        if (!char.spendXp(cost, whatOn.join(" "))) {
            msg.channel.send("Você não tem XP suficiente!");
            return;
        }

        char.serialize();
        msg.channel.send(
            `${charName} comprou ${whatOn.join(" ")} por ${cost}XP!`
        );
    });

    command(bot, ["xp help"], msg => {
        msg.channel.send(
            `<@${msg.author?.id}>\n`
          + `AQUI VEM A MENSAGEM DE AJUDA DO BOT`
          + `AINDA VAI SER IMPLEMENTADO`
        );
    });
});

bot.on("message", msg => {
    if (msg.author?.id === bot.user?.id)
        return;

    let dice_regex = /[0-9]+d[0-9]+/
    let content    = msg.content;

    if (!dice_regex.test(content))
        return;

    let info:  string[] = content.split("d");
    let sides: number   = parseInt(info[1]);
    let times: number   = parseInt(info[0]);
    let rolls = roll(sides, times);

    msg.channel.send(`<@${msg.author?.id}> rolou ${times}d${sides}\n\`${rolls}\``)
});

bot.login(TOKEN);