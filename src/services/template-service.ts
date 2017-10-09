import { create as createHandlebarsInstance } from "handlebars";
import { TranslateHelper } from "./template/translate-helper"
import { IOptions } from "./options-service"

export class TemplateService {
    private isInitialized: boolean = false;
    private handlebars: typeof Handlebars;

    constructor(private options: IOptions) {
    }

    public async applyTemplateAsync(template: string, data: any) {
        await this.initAsync();

        const compiledTemplate = this.handlebars.compile(template.toString());
        return compiledTemplate(data);
    }

    private async initAsync() {
        if (this.isInitialized) {
            return;
        }

        this.handlebars = createHandlebarsInstance();

        const translateHelper = new TranslateHelper(this.options.layout, this.options.language);
        await translateHelper.init();
        this.registerHelper(translateHelper);
    }

    private registerHelper(helper: IHandlebarHelper) {
        this.handlebars.registerHelper(helper.name, helper.onExecute.bind(helper));
    }
}

export interface IHandlebarHelper {
    name: string;
    onExecute: Function;
}