"use strict";

import * as fs from "fs-extra";
import * as path from "path";
import {InputBoxOptions, window, workspace} from "vscode";
import TemplatesManager from "../TemplatesManager";
import BaseTemplateCommand from "./BaseTemplateCommand";
/**
 * This command allows the creation of a new template directly from an existing file.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 */
class TemplateFromFileCommand extends BaseTemplateCommand {

    public async run(args: any) {
        super.run(args);
        /**
         * gets the file contents of the current selected file.
         * if this is toggled via context menu, we can get it directly from args,
         * otherwise we will use the current active file in the editor.
         */
        const filePath = args ? args.fsPath : window.activeTextEditor.document.fileName;
        const fileName = path.basename(filePath);

        // ask for filename
        const inputOptions: InputBoxOptions = {
            prompt: "Please enter the desired filename",
            value: fileName
        };

        const filename = await window.showInputBox(inputOptions); //
        if (!filename) {
            return;
        }
        const fileContents = fs.readFileSync(filePath);
        const templateFile = path.join(this.manager.templatesFolder, path.basename(filename));

        try {
            await fs.writeFile(templateFile, fileContents);
            const choice = await window.showQuickPick(["Yes", "No"], { placeHolder: "Edit the new template?" });
            if (choice === "Yes") {
                const doc = await workspace.openTextDocument(templateFile);
                const editor = window.activeTextEditor;
                window.showTextDocument(doc, editor.viewColumn);
            }
        } catch (error) {
            window.showErrorMessage(error.message);
        }
    }

}

export default TemplateFromFileCommand;
