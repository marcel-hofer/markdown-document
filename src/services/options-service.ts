import * as path from "path";

import fileService from "./file-service";
import templateService from "./template-service";

export interface IOptions {
    documentPath: string;
    document?: IDocumentInformation;
    template?: string;

    paperFormat?: string;
    paperOrientation?: string;
    paperBorder?: string;
}

export interface IDocumentInformation {
    title?: string;
    subject?: string;
    authors?: string[];
    date?: string;

    data?: any;
}

export class OptionsService {
    private readonly OPTIONS_POSTFIX = '-props.json';

    // TODO: Is there a better naming for fallback & check
    public async consolidateAsync(options: IOptions) {
        await this.fallbackOptionsToDocument(options);

        // Set fallback template because this is needed for the template fallback
        options.template = await this.getAndCheckTemplateExistanceAsync(options);

        await this.fallbackOptionsToTemplate(options);
        await this.fallbackOptionsToDefault(options);
    }

    private async fallbackOptionsToDocument(options: IOptions) {
        const documentOptions = await this.loadOptionsByFile(options.documentPath);
        if (documentOptions != null) {
            this.applyFallbackOptions(options, documentOptions);
            options.document = documentOptions.document || { };
        }
    }

    private async getAndCheckTemplateExistanceAsync(options: IOptions) {
        const template = options.template || 'default.html';
        return await templateService.resolveTemplatePathAsync(template, options.documentPath);
    }

    private async fallbackOptionsToTemplate(options: IOptions) {
        const templateOptions = await this.loadOptionsByFile(options.template);
        if (templateOptions != null) {
            this.applyFallbackOptions(options, templateOptions);
        }
    }

    private fallbackOptionsToDefault(options: IOptions) {
        this.applyFallbackOptions(options, <IOptions>{
            paperFormat: 'A4',
            paperOrientation: 'portrait',
            paperBorder: '2cm'
        });
    }

    private async loadOptionsByFile(file: string) {
        const optionsFile = fileService.changeExt(file, this.OPTIONS_POSTFIX);
        if (!await fileService.existsAsync(optionsFile)) {
            return null;
        }

        let content = await fileService.readFileAsync(optionsFile);
        return JSON.parse(content.toString());
    }

    private applyFallbackOptions(options: IOptions, fallback: IOptions) {
        options.paperFormat = options.paperFormat || fallback.paperFormat;
        options.paperOrientation = options.paperOrientation || fallback.paperOrientation;
        options.paperBorder = options.paperBorder || fallback.paperBorder;
    }
}

export default new OptionsService();