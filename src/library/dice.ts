function randrange(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
}

export function roll(sides: number, times: number): number[] {
    let rolls: number[] = [];

    // generating random numbers
    for (let i = 0; i < times; i++) {
        rolls.push(randrange(1, sides));
    }
    rolls.sort((a, b) => b - a);

    return rolls;
}