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
const fs = __importStar(require("fs"));
class XP {
    constructor(name, narrador = '', jogador = '') {
        this._current = 0;
        this._total = 0;
        this._spent = 0;
        this._spentOn = [];
        this._charName = name;
        this._willpower = 0;
        this._jogador = jogador;
        this._narrador = narrador;
    }
    deserialize(path) {
        let obj;
        try {
            obj = JSON.parse(fs.readFileSync(`${XP.dirPath}/${path}`, 'utf-8'));
        }
        catch (err) {
            if (err.code === 'ENOENT')
                console.log(`file not found`);
            else
                throw err;
        }
        this._current = obj._current;
        this._total = obj._total;
        this._spent = obj._spent;
        this._spentOn = obj._spentOn;
        this._charName = obj._charName;
        this._jogador = obj._jogador;
        this._narrador = obj._narrador;
        return this;
    }
    serialize() {
        if (!fs.existsSync(XP.dirPath)) {
            console.log(`criando pasta de registros`);
            fs.mkdirSync(XP.dirPath);
        }
        try {
            fs.writeFileSync(`${XP.dirPath}/XP_${this._charName.toLowerCase()}.json`, JSON.stringify(this));
        }
        catch (err) {
            return false;
        }
        return true;
    }
    /**
     * Gasta a xp que o jogador adquiriu.
     * @param howMuch: a quantidade de xp gasta
     * @param whatOn : what the player bought
     */
    spendXp(howMuch, whatOn) {
        /* you can't spent more than you have can you? */
        if (howMuch > this.current)
            return false;
        this._spentOn.push(whatOn);
        this._spent += howMuch;
        this._current -= howMuch;
        return true;
    }
    /**
     * Adiciona xp a pool do jogador
     * @param more: a quantidade a ser adicionada
     */
    addXp(more) {
        this._current += more;
        this._total += more;
    }
    get current() {
        return this._current;
    }
    set current(n) {
        this._current = n;
    }
    get total() {
        return this._total;
    }
    set total(n) {
        this._total = n;
    }
    get spent() {
        return this._spent;
    }
    set spent(n) {
        this._spent = n;
    }
    get spentOn() {
        return this._spentOn;
    }
    set spentOn(st) {
        this._spentOn = st;
    }
    get charName() {
        return this._charName;
    }
    set charName(st) {
        this._charName = st;
    }
    get jogador() {
        return this._jogador;
    }
    set jogador(j) {
        this._jogador = j;
    }
    get narrador() {
        return this._narrador;
    }
    set narrador(j) {
        this._narrador = j;
    }
    toString() {
        return `${JSON.stringify(this)}`;
    }
}
exports.default = XP;
XP.dirPath = './registros';
