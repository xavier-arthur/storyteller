import * as fs from "fs";
import { Serializable } from "./serializable"

export default class XP implements Serializable<XP> {

    static dirPath: string = './registros';

    private _willpower: number;
    private _current  : number;
    private _total    : number;
    private _spent    : number;
    private _spentOn  : string[];
    private _charName : string;
    private _narrador : string;
    private _jogador  : string;
    
    constructor(name: string, narrador = '', jogador = '') {
        this._current  = 0;
        this._total    = 0;
        this._spent    = 0;
        this._spentOn  = [];
        this._charName = name;
        this._willpower= 0;
        this._jogador = jogador;
        this._narrador = narrador;
    }

    public deserialize(path: string): XP {
        let obj: any;

        try {
            obj = JSON.parse(fs.readFileSync(`${XP.dirPath}/${path}`, 'utf-8'));
        } catch (err) {
            if (err.code === 'ENOENT')
                console.log(`file not found`);
            else
                throw err;
        }

        this._current  = obj._current;
        this._total    = obj._total;
        this._spent    = obj._spent;
        this._spentOn  = obj._spentOn;
        this._charName = obj._charName;
        this._jogador  = obj._jogador;
        this._narrador = obj._narrador;

        return this;
    }

    public serialize() {

        if (!fs.existsSync(XP.dirPath)) {
            console.log(`criando pasta de registros`)
            fs.mkdirSync(XP.dirPath);
        }

        try {
            fs.writeFileSync(`${XP.dirPath}/XP_${this._charName.toLowerCase()}.json`, JSON.stringify(this));
        } catch (err) { 
            return false;
        }
        return true;
    }

    /**
     * Gasta a xp que o jogador adquiriu.
     * @param howMuch: a quantidade de xp gasta 
     * @param whatOn : what the player bought
     */
    public spendXp(howMuch: number, whatOn: string): boolean {
        /* you can't spent more than you have can you? */
        if (howMuch > this.current)
            return false;

        this._spentOn.push(whatOn);
        this._spent   += howMuch;
        this._current -= howMuch;
        return true;
    }

    /**
     * Adiciona xp a pool do jogador 
     * @param more: a quantidade a ser adicionada
     */
    public addXp(more: number) {
        this._current += more;
        this._total   += more;
    }

    public get current(): number {
        return this._current;
    }

    public set current(n: number) {
        this._current = n;
    }

    public get total() {
        return this._total;
    }

    public set total(n: number) {
        this._total = n;
    }

    public get spent() {
        return this._spent;
    }

    public set spent(n : number) {
        this._spent = n;
    }

    public get spentOn() {
        return this._spentOn;
    }

    public set spentOn(st: string[]) {
        this._spentOn = st;
    }

    public get charName() {
        return this._charName;
    }

    public set charName(st: string) {
        this._charName = st;
    }

    public get jogador() {
        return this._jogador;
    }

    public set jogador(j: string) {
        this._jogador = j;
    }

    public get narrador() {
        return this._narrador;
    }

    public set narrador(j: string) {
        this._narrador = j;
    }

    public toString() {
        return `${JSON.stringify(this)}`
    }
}