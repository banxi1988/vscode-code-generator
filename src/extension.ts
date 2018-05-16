"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import BaseTemplateCommand from "./commands/BaseTemplateCommand";
import FileFromTemplateCommand from "./commands/fileFromTemplateCommand";
import { genGroupFromLocalTemplates } from "./commands/genGroupFromLocalTemplates";
import TemplateFromFileCommand from "./commands/templateFromFileCommand";
import getGlobalTemplatesDir from "./getGlobalTemplatesDir";
import TemplatesManager from "./TemplatesManager";

/**
 * Main extension entry point.
 * This method is called when the extension is activated (used by the first time)
 * @export
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {

    // Initializes the template manager.
    const globalManager = new TemplatesManager(getGlobalTemplatesDir());
    const localManager = TemplatesManager.local;
    const templateCommands = Array<BaseTemplateCommand>();
    templateCommands.push(
        new FileFromTemplateCommand(globalManager, "gen.fileFromGlobalTemplate"),
        new TemplateFromFileCommand(globalManager, "gen.globalTemplateFromFile"),
        new FileFromTemplateCommand(localManager, "gen.fileFromTemplate"),
        new TemplateFromFileCommand(localManager, "gen.templateFromFile"),
    );
    for (const templateCommand of templateCommands) {
        const commandFunc = templateCommand.run.bind(templateCommand);
        const disposable = vscode.commands.registerCommand(templateCommand.command, commandFunc);
        context.subscriptions.push(disposable);
    }

    context.subscriptions.push(
        vscode.commands.registerCommand("gen.createTemplatesFolder", (args) => {
            localManager.ensureTemplatesFolder(true);
        }),
        vscode.commands.registerCommand("gen.createGroupFromLocalTemplate", genGroupFromLocalTemplates)
    );

}

// this method is called when your extension is deactivated
// tslint:disable-next-line:no-empty
export function deactivate() {
}
