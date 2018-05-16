import * as fs from "fs-extra";

import * as path from "path";

import { InputBoxOptions, MessageItem, window } from "vscode";
import configs from "../configs";
import { openFolderInExplorer, showEmptyFolderTip } from "../helpers";

import TemplatesManager from "../TemplatesManager";

import { readContextFromActiveTextEditor} from "../templateContext";

/**
 *
 * @param args t {scheme: "file", authority: "", path: "/Users/banxi/Workspace/mpvue-todo/src/pages", …}
 */
export async function genGroupFromLocalTemplates(args: any) {
    const tm = TemplatesManager.local;
    if (!args || !args.fsPath) {
        window.showInformationMessage("This command is intent to create from exploer.");
        return;
    }
    const destFolder = args.fsPath;
    if (!fs.pathExistsSync(destFolder)) {
        return;
    }
    if (!fs.statSync(destFolder).isDirectory()) {
        return;
    }

    const groupNames = tm.getTemplateGroups();
    if (groupNames.length === 0) {
       showEmptyFolderTip(tm.getTemplateGroupsFolder());
       return;
    }

    const selectedGroupName = await window.showQuickPick(groupNames);
    if (!selectedGroupName) {
        return;
    }

    const templateFilenames = tm.getTemplatesByGroup(selectedGroupName);
    if (templateFilenames.length === 0) {
        showEmptyFolderTip(tm.getFolderByGroup(selectedGroupName));
        return;
    }

    const inputOptions: InputBoxOptions = {
        prompt: "Please enter the desired group name",
        value: selectedGroupName,
    };

    const outputGroupName = await window.showInputBox(inputOptions);
    if (!outputGroupName) {
        return;
    }

    const destGroupFolder = path.join(destFolder, outputGroupName);
    fs.ensureDirSync(destGroupFolder);

    const customContext = await readContextFromActiveTextEditor();
    for (const filename of templateFilenames) {
        const fullpath = tm.getGroupTemplatePath(selectedGroupName, filename);
        const renderedContent = tm.renderTemplate(fullpath, customContext);
        const destPath = path.join(destGroupFolder, filename);
        fs.writeFileSync(destPath, renderedContent);
    }

}
