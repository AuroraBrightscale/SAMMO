/**
 * Does an in place shuffle of an array.
 * Gracefully stolen from 
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * @param array The array to shuffle
 */
export function shuffle(array: string[]): void {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

/**
 * Generates an array of incrementing numbers from 0, up to but not including max
 * For example: max = 2 generates [0, 1], max = 3 generates [0, 1, 2], and so forth
 * @param max 
 * @returns 
 */
export function range(max: number): number[] {
    return [...Array(max).keys()];
}