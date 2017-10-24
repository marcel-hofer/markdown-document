import { create as createHandlebarsInstance } from "handlebars";
import { ConcatHelper } from "./template/concat-helper";
import { IsEmptyHelper } from "./template/is-empty-helper";
import { LookupHelper } from "./template/lookup-helper";
import { ResolveHelper } from "./template/resolve-helper";
import { TranslateHelper } from "./template/translate-helper"
import { IOptions } from "./options-service"

import { TranslationService } from "./translation-service";

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

        const translationService = new TranslationService(this.options.layout, this.options.language);
        await translationService.initAsync();

        this.handlebars = createHandlebarsInstance();

        const concatHelper = new ConcatHelper();
        const isEmptyHelper = new IsEmptyHelper();
        const lookupHelper = new LookupHelper();
        const resolveHelper = new ResolveHelper();
        const translateHelper = new TranslateHelper(translationService);
        
        this.registerHelper(concatHelper);
        this.registerHelper(isEmptyHelper);
        this.registerHelper(lookupHelper);
        this.registerHelper(resolveHelper);
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