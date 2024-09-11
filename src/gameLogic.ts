import { range, shuffle } from "./util";

export class Space {
    constructor(
        public name = "",
        public called = false,
    ) { }
}

export interface Bingo {
    username: string;
    bingoCount: number;
}

export type Bins = [string, string[]][];


const FREE_SPACE_POSITION = 12;
const FREE_SPACE = "FREE";

export class BingoCard {
    //Each inner array is a row (i.e. like a real bingo card)
    spaces = range(5).map(_ => range(5).map(_ => new Space()));
    currentBingos = 0;
    
    constructor (public username: string) {}

    /**
     * Marks the space on the bingo card, then checks for bingos.
     * If there are any NEW bingos for this user, then return the
     * count. Otherwise, return null
     * @param toCall 
     * @returns 
     */
    call(toCall: string[]): Bingo | null {
        this.spaces
            .flat()
            .filter(space => toCall.indexOf(space.name) >= 0)
            .forEach(space => space.called = true);
        return this.checkBingos();
    }

    private checkBingos(): Bingo | null {
        //Test for horizontals
        const horizontals = this.spaces.reduce((count, row) => 
            count + (row.some(s => !s.called) ? 0 : 1),
        0);

        //Test for verticals
        const verticals = range(this.spaces[0].length).reduce((count, col) => 
            count + (range(this.spaces.length).some(row => !this.spaces[row][col].called) ? 0 : 1),
        0);

        //Test diagonals
        const diagonalDown = range(this.spaces.length)
            .some(i => !this.spaces[i][i].called) ? 0 : 1;
        const diagonalUp = range(this.spaces.length)
            .some(i => !this.spaces[this.spaces.length - 1 - i][i].called) ? 0 : 1;

        //Test four corn....wait hell no.

        const newCount = horizontals + verticals + diagonalDown + diagonalUp;
        if (newCount > this.currentBingos) {
            this.currentBingos = newCount;
            return {
                username: this.username,
                bingoCount: newCount
            };
        } else {
            return null;
        }
    }

    getBingos(): Bingo {
        return {
            username: this.username,
            bingoCount: this.currentBingos,
        };
    }
}



export class BingoGame {
    cards = new Map<string, BingoCard>();
    called = new Set<string>();

    constructor(private bins: Bins) {
    }

    addCard(username: string, prefillBoard: boolean) {
        const newCard = new BingoCard(username);
        if (this.bins.length === 1) {
            //Not a binned game, shuffle randomly
            const spaces = [...this.bins[0][1]];
            shuffle(spaces);
            for (let i = 0; i < 25; i++) {
                if (i === FREE_SPACE_POSITION) {
                    newCard.spaces[Math.floor(i / 5)][i % 5] = new Space(FREE_SPACE, true);
                } else {
                    newCard.spaces[Math.floor(i / 5)][i % 5] = new Space(spaces[i]);
                }
            }
        } else {
            //Shuffle by bins
            for (let col = 0; col < 5; col++) {
                const spaces = [...this.bins[col][1]];
                shuffle(spaces);
                for (let row = 0; row < 5; row++) {
                    if ((row * 5 + col) === FREE_SPACE_POSITION) {
                        newCard.spaces[row][col] = new Space(FREE_SPACE, true);
                    } else {
                        newCard.spaces[row][col] = new Space(spaces[row]);
                    }
                }
            }
        }

        this.cards.set(username, newCard);
        if (prefillBoard) {
            this.prefillBoard(username);
        }
    }

    prefillBoard(username: string) {
        this.cards.get(username)!.call([...this.called]);
    }

    getCard(username: string): BingoCard | undefined {
        const card = this.cards.get(username);
        if (card) {
            console.log(username);
            if (this.bins.length > 1) {
                console.log(this.bins.map(([name, _]) => name.substring(0, 2).padStart(2)).join(" "));
            } else {
                console.log(" B  I  N  G  O");
            }
            for(let row of card.spaces) {
                console.log(row.map(r => r.called ? "**" : r.name.substring(0, 2).padStart(2)).join(" "));
            }
        } else {
            console.log(`No card found for ${username}`);
        }
        return card;
    }

    callSpace(space: string): Bingo[] {
        this.called.add(space);
        return [...this.cards.values()].map(card => card.call([space])).filter(bingo => !!bingo);
    }
}