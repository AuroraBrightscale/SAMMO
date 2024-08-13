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
declare const COMMAND_START_GAME: string;
SAMMI.extCommand(COMMAND_START_GAME, 3355443, 52, {
    spaces: ['Bingo Spaces', InputType.WhiteTextbox, ""],
    rowBinned: ['Row Binned?', InputType.Checkbox, 1],
});

declare const COMMAND_NEW_CARD: string;
SAMMI.extCommand(COMMAND_NEW_CARD, 3355443, 52, {
    username: ['Username', InputType.WhiteTextbox, ""],
    prefillBoard: ['Prefill Board', InputType.Checkbox, 1],
    boardCreated: ['Board Created', InputType.WhiteTextbox, ""],
});

declare const COMMAND_GET_CARD: string;
SAMMI.extCommand(COMMAND_GET_CARD, 3355443, 52, {
    username: ['Username', InputType.WhiteTextbox, ""],
    cardVar: ['Card', InputType.WhiteTextbox, ""],
});

declare const COMMAND_CALL_SPACE: string;
SAMMI.extCommand(COMMAND_CALL_SPACE, 3355443, 52, {
    space: ['Space', InputType.WhiteTextbox, ""],
});

declare const COMMAND_GET_BINGOS: string;
SAMMI.extCommand(COMMAND_GET_BINGOS, 3355443, 52, {
    username: ['Username', InputType.WhiteTextbox, "all"],
    variable: ['Store in variable', InputType.WhiteTextbox, ""],
})

bingoMain();