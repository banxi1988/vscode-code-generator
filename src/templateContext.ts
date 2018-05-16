"use strict";

import { InputBoxOptions, MessageItem, window } from "vscode";

export async function readContextFromActiveTextEditor(): Promise<object> {
    let text = await readContextConfigFromActiveTextEditor();
    if (!text || text.length < 2) {
        return {};
    }
    text = text.trim();
    if (!text.startsWith("{")) {
        text = "{" + text;
    }
    if (!text.endsWith("}")) {
        text = text + "}";
    }
    try {
        return JSON.parse(text);
    } catch (error) {
        window.showErrorMessage("JSON.parse error:", error);
        throw error;
    }
}

export async function readContextConfigFromActiveTextEditor(): Promise<string> {
    const editor = window.activeTextEditor;
    if (!editor) {
        return "";
    }
    const selection = editor.selection;
    let text = editor.document.getText(selection).trim();
    if (text.length > 10) {
        return text;
    }
    enum Options {
        Yes = "Yes",
        No = "No",
        Input = "Show me input box"
    }
    const choice = await window.showQuickPick([Options.Yes, Options.No, Options.Input], {
        placeHolder: "Read custom template data from current active file?"
    });
    switch (choice) {
        case Options.Yes:
            text = editor.document.getText().trim();
            break;
        case Options.Input:
            const inputOptions: InputBoxOptions = {
                prompt: "Please input template data",
                value: ""
            };
            const templateData = await window.showInputBox(inputOptions);
            text = templateData;
            break;
        default:
            text = "";
            break;
    }

    return "";
}
