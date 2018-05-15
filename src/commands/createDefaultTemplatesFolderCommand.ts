import * as fs from "fs-extra";
import * as path from "path";
import { window, workspace } from "vscode";

import configs from "../configs";

export default function createDefaultTemplatesFolder(): void {
    const rootPath = workspace.rootPath;
    const folder = path.join(rootPath, configs.defaultTemplatesFolder);
    if (fs.existsSync(folder)) {
        window.showInformationMessage("The workspace already contains an Code Generator Templates Folder");
        return;
    }
    fs.ensureDirSync(folder);
    window.showInformationMessage(`The ${configs.defaultTemplatesFolder} folder was created successfully!`);
}
