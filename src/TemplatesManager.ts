"use strict";
import * as fs from "fs-extra";
import * as nunjucks from "nunjucks";
import * as os from "os";
import * as path from "path";
import {window, workspace} from "vscode";
import configs from "./configs";

export default class TemplatesManager {
    public static local = new TemplatesManager(path.join(workspace.rootPath, configs.localTemplatesFolderName));

    constructor(
        public templatesFolder: string
    ) { }

    public ensureTemplatesFolder(showTip: boolean = false) {
        const folder = this.templatesFolder;
        if (fs.existsSync(folder)) {
            if (showTip) {
                window.showInformationMessage("The workspace already contains an Code Generator Templates Folder");
            }
            return;
        }
        fs.ensureDirSync(folder);
        fs.ensureDirSync(this.getTemplateGroupsFolder());
        const dataPath = this.getCommonDataFilePath();
        fs.writeJsonSync(dataPath, {
            author: process.env.USER,
            company: ""
        }, {spaces: 2});
        if (showTip) {
            window.showInformationMessage(`The ${configs.localTemplatesFolderName} folder was created successfully!`);
        }
    }

    /**
     *
     * Returns a list of available file templates by reading the Templates Directory.
     * @returns string[]
     */
    public  getTemplates(): string[] {
        const templateDir: string = this.templatesFolder;
        const templateFiles: string[] = fs.readdirSync(templateDir).map((item) => {
            if (!/^\./.exec(item) && item !== configs.templateCommonDataFileName) {
                return fs.statSync(path.join(templateDir, item)).isFile() ? item : null;
            }
            return null;
        }).filter((filename) => filename !== null);
        return templateFiles;
    }

    public getTemplatePathByName(filename: string): string {
        return path.join(this.templatesFolder, filename);
    }

    /**
     * Read the contents of a templates
     * @param filename The name of the template file.
     * @return Buffer
     */
    public getTemplate(filename: string): string {
        return fs.readFileSync(this.getTemplatePathByName(filename), "utf8");
    }

    /**
     * return the template groups from the groups directory
     */
    public getTemplateGroups(): string[] {
        const templateDir: string = this.getTemplateGroupsFolder();
        const groups: string[] = fs.readdirSync(templateDir).map((item) => {
            if (!/^\./.exec(item)) {
                return fs.statSync(path.join(templateDir, item)).isDirectory() ? item : null;
            }
            return null;
        }).filter((filename) => filename !== null);
        return groups;
    }

    public getFolderByGroup(groupName: string): string {
        return path.join(this.getTemplateGroupsFolder(), groupName);
    }

    public getTemplateGroupsFolder(): string {
        return path.join(this.templatesFolder, configs.templateGroupsFolderName);
    }

    /**
     * return the template names in the group.
     * @param groupName The name of the group
     */
    public getTemplatesByGroup(groupName: string): string[] {
        const templateDir: string = this.getFolderByGroup(groupName);
        const templateFiles: string[] = fs.readdirSync(templateDir).map((item) => {
            if (!/^\./.exec(item)) {
                return fs.statSync(path.join(templateDir, item)).isFile() ? item : null;
            }
            return null;
        }).filter((filename) => filename !== null);
        return templateFiles;
    }

    /**
     * the path of template  in group
     * @param groupName group name
     * @param filename filename
     */
    public  getGroupTemplatePath(groupName: string, filename: string): string {
        return path.join(this.getTemplateGroupsFolder(), groupName, filename);
    }

    public getCommonDataFilePath(): string {
        return path.join(this.templatesFolder, configs.templateCommonDataFileName);
    }

    public loadTemplateCommonData(): object {
        const filepath = this.getCommonDataFilePath();
        if (!fs.existsSync(filepath)) {
            return {};
        }
        return fs.readJSONSync(filepath);
    }

    public renderTemplate(templatePath: string, customContext: object): string {
        const context = this.loadTemplateCommonData();
        Object.assign(context, customContext);
        return nunjucks.render(templatePath, context);
    }
}
