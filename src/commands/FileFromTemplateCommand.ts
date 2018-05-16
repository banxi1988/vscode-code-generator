"use strict";

import * as fs from "fs-extra";
import * as moment from "moment";
import * as path from "path";
import {InputBoxOptions, window, workspace } from "vscode";
import { openFolderInExplorer, showEmptyFolderTip } from "../helpers";
import { readContextFromActiveTextEditor} from "../templateContext";
import TemplatesManager from "../TemplatesManager";
import BaseTemplateCommand from "./BaseTemplateCommand";

/**
 * Main command to create a file from a template.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 */
class FileFromTemplateCommand extends BaseTemplateCommand {
    private targetFolder: string = "";

    public async run(args: any) {
        super.run(args);
        const templates = this.manager.getTemplates();

        // gets the target folder. if its invoked from a context menu,
        // we use that reference, otherwise we use the file system path
        const targetFolder = args ? args.fsPath : workspace.rootPath;
        this.targetFolder = targetFolder;

        if (templates.length === 0) {
            showEmptyFolderTip(this.manager.templatesFolder);
            return;
        }

        // show the list of available templates.
        const selection = await window.showQuickPick(templates);
        if (!selection) {
            return;
        }
        // nothing selected. cancel
        // ask for filename
        const inputOptions: InputBoxOptions = {
            prompt: "Please enter the desired file name",
            value: selection,
        };

        const filename = await window.showInputBox(inputOptions);
        if (!filename) {
            return;
        }
        const customContext = await readContextFromActiveTextEditor();
        const templatePath = this.manager.getTemplatePathByName(filename);
        const outputContent = this.manager.renderTemplate(templatePath, customContext);

        const fullname = path.join(targetFolder, filename);

        try {
            await fs.writeFile(path.join(targetFolder, filename), outputContent);
            const doc = await workspace.openTextDocument(fullname);
            const editor = window.activeTextEditor;
            window.showTextDocument(doc, editor.viewColumn);
        } catch (error) {
            window.showErrorMessage(error.message);
        }
    }

}

export default FileFromTemplateCommand;
