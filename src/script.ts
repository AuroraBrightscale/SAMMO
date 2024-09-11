import html2canvas from "html2canvas";
import { CardRenderer } from "./cardRenderer";
import { Commands, setupCommands } from "./command";
import { BingoGame, Bins } from "./gameLogic";
import { range } from "./util";


const cardRenderer = new CardRenderer($, html2canvas);
const TRIGGER_BINGO_WON = "SAMMO.Won";
let currentGame: BingoGame | undefined;

setupCommands();

function getCurrentGame(): BingoGame {
    if (!currentGame) {
        SAMMI.alert("Bingo error: No game in progress");
        throw new Error("No game in progress");
    }
    return currentGame;
}

sammiclient.on(Commands.START_GAME, payload => {
    startGame(payload, false);
});

sammiclient.on(Commands.START_BINNED, payload => {
    //TODO Make it easier to load bins through yellow boxes/not through variable names.
    startGame(payload, true);
});

sammiclient.on(Commands.NEW_CARD, payload => {
    const boardCreated = newCard(payload.Data.username, payload.Data.prefillBoard);
    SAMMI.setVariable(payload.Data.boardCreated, boardCreated, payload.Data.FromButton);
});

sammiclient.on(Commands.GET_CARD, payload => {
    const card = getCurrentGame().getCard(payload.Data.username);
    SAMMI.setVariable(payload.Data.cardVar, card?.spaces, payload.Data.FromButton);
});

sammiclient.on(Commands.GET_CARD_IMAGE, async payload => {
    const card = getCurrentGame().getCard(payload.Data.username);
    if (card) {
        const cardData = await cardRenderer.render(
            card,
            payload.Data.displayName,
            payload.Data.pictureUrl,
            payload.Data.color,
        );
        SAMMI.setVariable(payload.Data.cardImageVar, cardData, payload.Data.FromButton);
    }
});

sammiclient.on(Commands.CALL_SPACE, payload => {
    const bingos = getCurrentGame().callSpace(payload.Data.space);
    if (bingos.length > 0) {
        SAMMI.triggerExt(TRIGGER_BINGO_WON, { bingos });
    }
});

sammiclient.on(Commands.GET_BINGOS, payload => {
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
});



function newCard(username: string, prefillBoard: boolean): boolean {
    const game = getCurrentGame();
    if (game.cards.has(username)) {
        return false;
    } else {
        game.addCard(username, prefillBoard);
        return true;
    }
}

async function startGame(payload: Payload, binned: boolean) {
    const columnNames: string = payload.Data.columnNames;
    let bins: Bins
    if (binned) {
        const binData = (await SAMMI.getVariable(payload.Data.bin1, payload.Data.FromButton)).value;
        if (binData instanceof Array) {
            bins = range(5).map(i => [columnNames[i], binData[i]]);
        } else {
            SAMMI.alert("SAMMO: Cannot create game: Invalid bin data");
            throw new Error("SAMMO: Cannot create game: Invalid bin data");
        }
    } else {
        const spaces = (await SAMMI.getVariable(payload.Data.spaces, payload.Data.FromButton)).value;
        if (spaces instanceof Array) {
            bins = [["", spaces]];
        } else {
            SAMMI.alert("SAMMO: Cannot create game: Invalid bingo spaces");
            throw new Error("SAMMO: Cannot create game: Invalid bingo spaces");
        }
    }
    currentGame = new BingoGame(bins);
}
