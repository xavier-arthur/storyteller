"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roll = void 0;
function randrange(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
function roll(sides, times) {
    let rolls = [];
    // generating random numbers
    for (let i = 0; i < times; i++) {
        rolls.push(randrange(1, sides));
    }
    rolls.sort((a, b) => b - a);
    return rolls;
}
exports.roll = roll;
