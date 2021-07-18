"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.error_handler = exports.PermissionError = void 0;
const config = __importStar(require("./config.json"));
const command_handler_1 = require("./command_handler");
class PermissionError extends Error {
    constructor(msg = '') {
        super(msg);
        this.name = 'PermissionError';
    }
}
exports.PermissionError = PermissionError;
function error_handler(msg, error) {
    let args = msg.content.substr(1).split(" ").splice(2);
    switch (error.name) {
        case 'TypeError':
            msg.channel.send(`${config.NOT_FOUND_MSG[command_handler_1.randrange(config.NOT_FOUND_MSG.length - 1)]
                .replace("<charName>", args.join(" "))}`);
            break;
        case 'PermissionError':
            msg.channel.send("Voce não tem permissão para editar esse personagem");
            return true;
        default:
            throw error;
    }
}
exports.error_handler = error_handler;
