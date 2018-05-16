"use strict";
import child_process = require("child_process");
import { MessageItem, window } from "vscode";

/**
 * Helper funcion for open a folder in Explorer
 * @export
 * @param {string} folder
 */
export function openFolderInExplorer(folder) {
    let command = null;
    switch (process.platform) {
        case "linux":
            command = "xdg-open " + folder;
            break;
        case "darwin":
            command = "open " + folder;
            break;
        case "win32":
            command = "start " + folder;
            break;
    }

    if (command != null) {
        child_process.exec(command);
    }
}

export function showEmptyFolderTip(folder: string) {
    const optionGoToTemplates: MessageItem = {
        title: `you want to open ${folder}`
    };
    window.showInformationMessage(`${folder} was empty`, optionGoToTemplates).then((option) => {
        if (option) {
            openFolderInExplorer(folder);
        }
    });
}
