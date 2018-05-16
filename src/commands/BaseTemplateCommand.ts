import TemplatesManager from "../TemplatesManager";

abstract class BaseTemplateCommand {
    public constructor(
        protected manager: TemplatesManager,
        readonly command: string
    ) {

    }
    /**
     * execute the command
     * @param args the run args,
     * if run from exploer args will the relate resource object.
     * like : {scheme: "file", authority: "", path: "/Users/banxi/Workspace/mpvue-todo/src/pages", …}
     */
    public async  run(args: any) {
        this.manager.ensureTemplatesFolder();
    }
}

export default BaseTemplateCommand;
