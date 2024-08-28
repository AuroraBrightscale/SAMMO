interface SAMMIResponse {
    id: string;
    rq: string;
    status: number;
}

interface ValueResponse<T> extends SAMMIResponse {
    value: T;
}

abstract interface PayloadData {
    FromButton: string; 
    instanceId: number;
}

interface Payload {
    CommandName: string;
    Data: any;
}

type CommandBoxes = {[name: string]: [
    string, //input name
    InputType.SelectBox, //input id
    string | number, //default value
    undefined, //size modifier
    unknown[], //options (for combo box)
] | [
    string, //input name
    InputType.SelectBox, //input id
    string | number, //default value
    number, //size modifier
] | [
    string, //input name
    InputType, //input id
    string | number, //default value
]};

declare namespace SAMMI {
    /**
     * Send a yellow notification message to SAMMI
     * @param {string} msg - message to send
     */
    function alert(msg: string): Promise<SAMMIResponse>;

    /**
     * Get a variable from SAMMI
     * @param {string} name - name of the variable
     * @param {string} buttonId - button ID for local variable, default = global variable
     */
    function getVariable(name = '', buttonId = 'global'): Promise<ValueResponse<unknown>>;

    /**
     * Set a variable in SAMMI
     * @param {string} name - name of the variable
     * @param {(string|number|object|array|null)} value - new value of the variable
     * @param {string} buttonId - button ID for local variable, default = global variable
     */
    function setVariable(name = '', value: string | number | object | array | null = '', buttonId = 'global', instanceId = 0): Promise<SAMMIResponse>;

    /**
     * send extension command to SAMMI
     * @param {string} name - name of the extension command
     * @param {string} color - box color, accepts hex/dec colors (include # for hex), default 3355443
     * @param {string} height - height of the box in pixels, 52 for regular or 80 for resizable box, default 52
     * @param {Object} boxes
     * - one object per box, key = boxVariable, value = array of box params
     * - boxVariable = variable to save the box value under
     * - boxName = name of the box shown in the user interface
     * - boxType = type of the box, 0 = resizable, 2 = checkbox (true/false), 14 = regular box, 15 = variable box, 18 = select box, see extension guide for more
     * - defaultValue = default value of the variable
     * - (optional) sizeModifier = horizontal box size, 1 is normal
     * - (optional) [] selectOptions = array of options for the user to select (when using Select box type)
     * @param {[boxName: string, boxType: number, defaultValue: (string | number), sizeModifier: (number|undefined), selectOptions: Array|undefined]} boxes.boxVariable
     * */
    function extCommand(name: string, color: number | string, height: number, boxes: CommandBoxes, triggerButton = false, hidden = false);

    /**
     * Sends an extension trigger
     * @param {string} trigger - name of the trigger
     * @param {object} data - object containing all trigger pull data
     */
    function triggerExt(trigger = "", data: object = {}): Promise<SAMMIResponse>;
}

declare namespace sammiclient {
    function on(extensionName: string, listener: (payload: Payload) => void): void;
}