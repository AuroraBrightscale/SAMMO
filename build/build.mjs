// For now, this will stay as JS because it's the only file being run in Node
// rather than in browser.

import fs from "node:fs";
import os from "node:os";

const INSERT_SCRIPT = "js/script.js";
const INSERT_COMMAND = "js/command.js";
const INSERT_EXTERNAL = "html/tab.html";
const EXTENSION_JSON = "extension.json";
const OUT_DIR = "sef/";
const EXTENSION_NAME = "extension.sef";
const extensionJson = JSON.parse(fs.readFileSync(EXTENSION_JSON))

const sef = {
    extension_name: extensionJson.name,
    extension_version: extensionJson.version,
    extension_info: extensionJson.info,
    insert_external: fs.readFileSync(INSERT_EXTERNAL),
    insert_command: fs.readFileSync(INSERT_COMMAND),
    insert_hook: "",
    insert_script: fs.readFileSync(INSERT_SCRIPT),
    insert_over: ""
};

const outputSef = Object.keys(sef)
    .reduce((fileText, section) => fileText += `[${section}]\n${sef[section]}\n`, "");

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR);
}
fs.writeFileSync(`${OUT_DIR}${EXTENSION_NAME}`, outputSef.replace(/\n/g, os.EOL));