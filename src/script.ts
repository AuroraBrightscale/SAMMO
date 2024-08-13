/**
 * Does an in place shuffle of an array.
 * Gracefully stolen from 
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * @param array The array to shuffle
 */
function shuffle(array: string[]): void {
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
function range(max: number): number[] {
    return [...Array(max).keys()];
}

class Space {
    constructor(
        public name = "",
        public called = false,
    ) { }
}

interface Bingo {
    username: string;
    bingoCount: number;
}

type Bins = [string, string[]][];

const BINGO_CARD_MAX_SPACES = 25;
const FREE_SPACE_POSITION = 12;
const FREE_SPACE = "FREE";
const TRIGGER_BINGO_WON = "Bingo.Won";

class BingoCard {
    //Each inner array is a row (i.e. like a real bingo card)
    spaces =
        [
            [new Space(), new Space(), new Space(), new Space(), new Space()],
            [new Space(), new Space(), new Space(), new Space(), new Space()],
            [new Space(), new Space(), new Space(), new Space(), new Space()],
            [new Space(), new Space(), new Space(), new Space(), new Space()],
            [new Space(), new Space(), new Space(), new Space(), new Space()]
        ];
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

class BingoGame {
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
                }
                newCard.spaces[Math.floor(i / 5)][i % 5] = new Space(spaces[i]);
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
                console.log(this.bins.map(([name, _]) => name.padStart(2)).join(" "));
            } else {
                console.log(" B  I  N  G  O");
            }
            for(let row of card.spaces) {
                console.log(row.map(r => r.called ? "**" : r.name.padStart(2)).join(" "));
            }
        } else {
            console.log(`No card found for ${username}`);
        }
        return card;
    }

    callSpace(space: string): Bingo[] {
        return [...this.cards.values()].map(card => card.call([space])).filter(bingo => !!bingo);
    }
}



function bingoMain() {

    sammiclient.on(COMMAND_START_GAME, payload => {
        startGame(payload.Data.spaces, payload.Data.FromButton, payload.Data.rowBinned);
    });

    sammiclient.on(COMMAND_NEW_CARD, payload => {
        const boardCreated = newCard(payload.Data.username, payload.Data.prefillBoard);
        SAMMI.setVariable(payload.Data.boardCreated, boardCreated, payload.Data.FromButton);
    });

    sammiclient.on(COMMAND_GET_CARD, payload => {
        const card = getCard(payload.Data.username);
        SAMMI.setVariable(payload.Data.cardVar, card, payload.Data.FromButton);
    });

    sammiclient.on(COMMAND_CALL_SPACE, payload => {
        const bingos = getCurrentGame().callSpace(payload.Data.space);
        if (bingos.length > 0) {
            SAMMI.triggerExt(TRIGGER_BINGO_WON, {bingos});
        }
    });

    sammiclient.on(COMMAND_GET_BINGOS, payload => {
        let bingos;
        if (payload.Data.username === "all") {
            bingos = { 
                bingos: [...getCurrentGame().cards.values()]
                        .map(card => card.getBingos())
                        .filter(bingo => bingo.bingoCount > 0),
            };
        } else {
            bingos = getCurrentGame().cards.get(payload.Data.username)?.getBingos()?.bingoCount;
        }
        if (bingos) {
            SAMMI.setVariable(payload.Data.variable, bingos, payload.Data.FromButton);
        }
    })
}

let currentGame: BingoGame | undefined;
function getCurrentGame(): BingoGame {
    if (!currentGame) {
        SAMMI.alert("Bingo error: No game in progress");
        throw new Error("No game in progress");
    }
    return currentGame;
}

function newCard(username: string, prefillBoard: boolean): boolean {
    const game = getCurrentGame();
    if (game.cards.has(username)) {
        return false;
    } else {
        game.addCard(username, prefillBoard);
        return true;
    }
}

async function startGame(spacesVarName: string, buttonName: string, rowBinned: boolean) {
    const allSpaces = (await SAMMI.getVariable(
        spacesVarName,
        buttonName,
    )).value;

    if (rowBinned) {
        //TODO do proper input validation here and not just blindly cast.
        currentGame = new BingoGame(allSpaces as Bins);
    } else {
        currentGame = new BingoGame([["", allSpaces as string[]]]);
    }
}

function getCard(username: string): Space[][] | undefined {
    return getCurrentGame().getCard(username)?.spaces;
}
