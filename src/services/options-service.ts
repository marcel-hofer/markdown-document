import * as path from "path";

import fileService from "./file-service";
import layoutService from "./layout-service";

export interface IOptions {
    documentPath?: string;
    outputPath?: string;
    tempPath?: string;
    document?: IDocumentInformation;
    layout?: string;

    pdf?: IPdfOptions;
}

// TODO: Change options schema
export interface IPdfOptions {
    wkhtmltopdfPath?: string;

    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;

    orientation?: 'Landscape' | 'Portrait';
    pageSize?: string;
    pageHeight?: number;
    pageWidth?: number;

    cover?: IPdfCoverOptions;
    toc?: IPdfTocOptions;
    content?: IPdfContentOptions;
    header?: IPdfHeaderFooterOptions;
    footer?: IPdfHeaderFooterOptions;
}

export interface IPdfCoverOptions {
    cover?: string;
}

export interface IPdfTocOptions {
    toc?: boolean;
    xslStyleSheet?: string;
}

export interface IPdfContentOptions {
    content?: string;
}

export interface IPdfHeaderFooterOptions {
    html?: string;
    spacing?: number;
}

export interface IDocumentInformation {
    title?: string;
    subject?: string;
    authors?: string[];
    date?: string;

    data?: any;
}

export class OptionsService {
    private readonly OPTIONS_FILE = 'options.json';
    private readonly OPTIONS_EXT = '.json';

    // TODO: Is there a better naming for fallback & check
    public async consolidateAsync(options: IOptions) {
        await this.fallbackOptionsToDocument(options);

        // Set fallback layout because this is needed for the layout fallback
        options.layout = await this.getAndCheckLayoutExistanceAsync(options);

        await this.fallbackOptionsToLayout(options);
        await this.fallbackOptionsToDefault(options);
    }

    private async fallbackOptionsToDocument(options: IOptions) {
        const documentOptions = await this.loadOptionsByFile(fileService.changeExt(options.documentPath, this.OPTIONS_EXT));
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
        const layoutOptions = await this.loadOptionsByFile(path.join(options.layout, this.OPTIONS_FILE));
        if (layoutOptions != null) {
            this.applyFallbackOptions(options, { pdf: layoutOptions });
        }
    }

    private fallbackOptionsToDefault(options: IOptions) {
        options.outputPath = options.outputPath || fileService.changeExt(options.documentPath, '.pdf');

        this.applyFallbackOptions(options, <IOptions>{
            pdf: {
                wkhtmltopdfPath: require('wkhtmltopdf-installer').path,

                // paperFormat: 'A4',
                // paperOrientation: 'portrait',
                // paperMargin: '2cm'
            }
        });
    }

    private async loadOptionsByFile(file: string) {
        if (!await fileService.existsAsync(file)) {
            return null;
        }

        let content = await fileService.readFileAsync(file);
        return JSON.parse(content.toString());
    }

    private applyFallbackOptions(options: IOptions, fallback: IOptions) {
        options.pdf = options.pdf || { };
        options.pdf.cover = options.pdf.cover || <any>{ };
        options.pdf.toc = options.pdf.toc || <any>{ };
        options.pdf.content = options.pdf.content || <any>{ };
        options.pdf.header = options.pdf.header || <any>{ };
        options.pdf.footer = options.pdf.footer || <any>{ };

        if (fallback.pdf != null) {
            options.pdf.wkhtmltopdfPath = options.pdf.wkhtmltopdfPath || fallback.pdf.wkhtmltopdfPath;

            options.pdf.marginBottom = options.pdf.marginBottom || fallback.pdf.marginBottom;
            options.pdf.marginLeft = options.pdf.marginLeft || fallback.pdf.marginLeft;
            options.pdf.marginRight = options.pdf.marginRight || fallback.pdf.marginRight;
            options.pdf.marginTop = options.pdf.marginTop || fallback.pdf.marginTop;

            options.pdf.orientation = options.pdf.orientation || fallback.pdf.orientation;
            options.pdf.pageSize = options.pdf.pageSize || fallback.pdf.pageSize;
            options.pdf.pageHeight = options.pdf.pageHeight || fallback.pdf.pageHeight;
            options.pdf.pageWidth = options.pdf.pageWidth || fallback.pdf.pageWidth;

            if (fallback.pdf.content != null) {
                options.pdf.cover.cover = options.pdf.cover.cover || fallback.pdf.cover.cover;
            }
            
            if (fallback.pdf.toc != null) {
                options.pdf.toc.toc = options.pdf.toc.toc == null ? fallback.pdf.toc.toc : options.pdf.toc.toc;
                options.pdf.toc.xslStyleSheet = options.pdf.toc.xslStyleSheet || fallback.pdf.toc.xslStyleSheet;
            }

            if (fallback.pdf.content != null) {
                options.pdf.content.content = options.pdf.content.content || fallback.pdf.content.content;
            }
            
            if (fallback.pdf.header != null) {
                options.pdf.header.html = options.pdf.header.html || fallback.pdf.header.html;
                options.pdf.header.spacing = options.pdf.header.spacing || fallback.pdf.header.spacing;
            }
            
            if (fallback.pdf.footer != null) {
                options.pdf.footer.html = options.pdf.footer.html || fallback.pdf.footer.html;
                options.pdf.footer.spacing = options.pdf.footer.spacing || fallback.pdf.footer.spacing;
            }
        }
    }
}

export default new OptionsService();