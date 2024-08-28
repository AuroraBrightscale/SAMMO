

/**
 * Enum that denotes the type of a command's input.
 */
enum InputType {
    /**
     * Indicates a resizable white textbox.
     */
    Resizable = 0,
    /**
     * Indicates a two state checkbox (checked, unchecked)
     */
    Checkbox = 2,
    /**
     * Indicates a white textbox (i.e. variables require /$varName$/)
     */
    WhiteTextbox = 14,
    /**
     * Indicates a yellow textbox (More programmatic-like)
     */
    YellowTextbox = 15,
    /**
     * Indicates a select box that has multiple different options
     */
    SelectBox = 18,
}

const DEFAULT_COLOR = 3355443;
const DEFAULT_HEIGHT = 52;

export enum Commands {
    START_GAME = "SAMMO: Start Game",
    START_BINNED = "SAMMO: Start Game (Binned)",
    NEW_CARD = "SAMMO: New Card",
    GET_CARD = "SAMMO: Get Card",
    CALL_SPACE = "SAMMO: Call Space",
    GET_BINGOS = "SAMMO: List Bingos",
    GET_CARD_IMAGE = "SAMMO: Get Card Image",
}

export function setupCommands() {
    SAMMI.extCommand(Commands.START_GAME, DEFAULT_COLOR, DEFAULT_HEIGHT, {
        spaces: ['Bingo Spaces', InputType.YellowTextbox, ""],
        columnNames: ['Column Names', InputType.WhiteTextbox, "BINGO"],
    });
    
    SAMMI.extCommand(Commands.START_BINNED, DEFAULT_COLOR, DEFAULT_HEIGHT, {
        bin1: ['Bin 1', InputType.WhiteTextbox, ""],
        bin2: ['Bin 2', InputType.WhiteTextbox, ""],
        bin3: ['Bin 3', InputType.WhiteTextbox, ""],
        bin4: ['Bin 4', InputType.WhiteTextbox, ""],
        bin5: ['Bin 5', InputType.WhiteTextbox, ""],
        columnNames: ['Column Names', InputType.WhiteTextbox, "BINGO"],
    });
    
    SAMMI.extCommand(Commands.NEW_CARD, DEFAULT_COLOR, DEFAULT_HEIGHT, {
        username: ['Username', InputType.WhiteTextbox, ""],
        prefillBoard: ['Prefill Board', InputType.Checkbox, 1],
        boardCreated: ['Board Created', InputType.WhiteTextbox, ""],
    });
    
    SAMMI.extCommand(Commands.GET_CARD, DEFAULT_COLOR, DEFAULT_HEIGHT, {
        username: ['Username', InputType.WhiteTextbox, ""],
        cardVar: ['Card', InputType.WhiteTextbox, ""],
    });

    SAMMI.extCommand(Commands.GET_CARD_IMAGE, '#420766', DEFAULT_HEIGHT, {
        username: ['Username', InputType.WhiteTextbox, ""],
        cardImageVar: ['Card Image', InputType.WhiteTextbox, ""],
    });
    
    SAMMI.extCommand(Commands.CALL_SPACE, DEFAULT_COLOR, DEFAULT_HEIGHT, {
        space: ['Space', InputType.WhiteTextbox, ""],
    });
    
    SAMMI.extCommand(Commands.GET_BINGOS, DEFAULT_COLOR, DEFAULT_HEIGHT, {
        username: ['Username', InputType.WhiteTextbox, "all"],
        variable: ['Store in variable', InputType.WhiteTextbox, ""],
    });
}