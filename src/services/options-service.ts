import * as path from "path";

import fileService from "./file-service";
import layoutService from "./layout-service";

export interface IOptions {
    documentPath: string;
    outputPath?: string;
    document?: IDocumentInformation;
    layout?: string;

    pdf?: IPdfOptions;
}

export interface IPdfOptions {
    phantomPath?: string;

    paperFormat?: string;
    paperOrientation?: string;
    paperMargin?: string | IPdfMargin;

    renderDelay?: number;
    loadTimeout?: number;
}

export interface IPdfMargin {
    top: string;
    left: string;
    bottom: string;
    right: string;
}

export interface IDocumentInformation {
    title?: string;
    subject?: string;
    authors?: string[];
    date?: string;

    data?: any;
}

export class OptionsService {
    private readonly OPTIONS_POSTFIX = '.json';

    // TODO: Is there a better naming for fallback & check
    public async consolidateAsync(options: IOptions) {
        await this.fallbackOptionsToDocument(options);

        // Set fallback layout because this is needed for the layout fallback
        options.layout = await this.getAndCheckLayoutExistanceAsync(options);

        await this.fallbackOptionsToLayout(options);
        await this.fallbackOptionsToDefault(options);
    }

    private async fallbackOptionsToDocument(options: IOptions) {
        const documentOptions = await this.loadOptionsByFile(options.documentPath);
        if (documentOptions != null) {
            this.applyFallbackOptions(options, documentOptions);
            options.document = documentOptions.document || { };
        }
    }

    private async getAndCheckLayoutExistanceAsync(options: IOptions) {
        const layout = options.layout || 'default.html';
        return await layoutService.resolveLayoutPathAsync(layout, options.documentPath);
    }

    private async fallbackOptionsToLayout(options: IOptions) {
        const layoutOptions = await this.loadOptionsByFile(options.layout);
        if (layoutOptions != null) {
            this.applyFallbackOptions(options, layoutOptions);
        }
    }

    private fallbackOptionsToDefault(options: IOptions) {
        options.outputPath = options.outputPath || fileService.changeExt(options.documentPath, '.pdf');

        this.applyFallbackOptions(options, <IOptions>{
            pdf: {
                phantomPath: require('phantomjs-prebuilt').path,

                paperFormat: 'A4',
                paperOrientation: 'portrait',
                paperMargin: '2cm',

                renderDelay: 0,
                loadTimeout: 10000
            }
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
        options.pdf = options.pdf || { };

        if (fallback.pdf != null) {
            options.pdf.phantomPath = options.pdf.phantomPath || fallback.pdf.phantomPath;

            options.pdf.paperFormat = options.pdf.paperFormat || fallback.pdf.paperFormat;
            options.pdf.paperOrientation = options.pdf.paperOrientation || fallback.pdf.paperOrientation;
            options.pdf.paperMargin = options.pdf.paperMargin || fallback.pdf.paperMargin;

            options.pdf.renderDelay = options.pdf.renderDelay == null ? fallback.pdf.renderDelay : options.pdf.renderDelay;
            options.pdf.loadTimeout = options.pdf.loadTimeout == null ? fallback.pdf.loadTimeout : options.pdf.loadTimeout;
        }
    }
}

export default new OptionsService();