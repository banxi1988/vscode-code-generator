"use strict";
import * as fs from "fs-extra";
import * as os from "os";
import * as path from "path";
import { workspace } from "vscode";

/**
 * Returns the templates directory location.
 * If no user configuration is found, the extension will look for
 * templates in USER_DATA_DIR/Code/FileTemplates.
 * Otherwise it will look for the path defined in the extension configuration.
 * @return {string}
 */
export default function(): string {
    const config = workspace.getConfiguration("code-generator");
    return config.get("globalTemplatesFolder", getDefaultTemplatesDir());
}

/**
 * Returns the default templates location based on the user OS.
 * @returns {string}
 */
function getDefaultTemplatesDir(): string {
    let userDataDir = null;

    switch (process.platform) {
        case "linux":
            userDataDir = path.join(os.homedir(), ".config");
            break;
        case "darwin":
            userDataDir = path.join(os.homedir(), "Library", "Application Support");
            break;
        case "win32":
            userDataDir = process.env.APPDATA;
            break;
        default:
            throw Error("Unrecognizable operative system");
    }

    return path.join(userDataDir, "Code", "User", "CodeGeneratorTemplates");
}
