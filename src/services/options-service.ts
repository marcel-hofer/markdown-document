import * as path from "path";

import fileService from "./file-service";
import layoutService from "./layout-service";

export interface IOptions {
    documentPath?: string;
    outputPath?: string;
    tempPath?: string;
    document?: IDocumentInformation;
    layout?: string;

    language?: string;

    pdf?: IPdfOptions;
}

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

    header?: IPdfHeaderFooterOptions;
    footer?: IPdfHeaderFooterOptions;

    parts?: {
        [key: string]: IPdfPart;
    };
}

export interface IPdfHeaderFooterOptions {
    html?: string;
    spacing?: number;
}

export interface IPdfPart {
    type?: 'cover' | 'toc' | 'content';
    html?: string;
}

export interface IPdfCoverPart extends IPdfPart {
}

export interface IPdfTocPart extends IPdfPart {
    xslStyleSheet?: string;
}

export interface IPdfContentPart extends IPdfPart {
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
        const layout = options.layout || 'document';
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

                pageSize: 'A4',
                orientation: 'Portrait'
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
        options.language = options.language || fallback.language;

        options.pdf = options.pdf || { };
        options.pdf.header = options.pdf.header || <any>{ };
        options.pdf.footer = options.pdf.footer || <any>{ };
        options.pdf.parts = options.pdf.parts || { };

        if (fallback.pdf == null) {
            return;
        }

        options.pdf.wkhtmltopdfPath = options.pdf.wkhtmltopdfPath || fallback.pdf.wkhtmltopdfPath;
        
        options.pdf.marginBottom = options.pdf.marginBottom || fallback.pdf.marginBottom;
        options.pdf.marginLeft = options.pdf.marginLeft || fallback.pdf.marginLeft;
        options.pdf.marginRight = options.pdf.marginRight || fallback.pdf.marginRight;
        options.pdf.marginTop = options.pdf.marginTop || fallback.pdf.marginTop;

        options.pdf.orientation = options.pdf.orientation || fallback.pdf.orientation;
        options.pdf.pageSize = options.pdf.pageSize || fallback.pdf.pageSize;
        options.pdf.pageHeight = options.pdf.pageHeight || fallback.pdf.pageHeight;
        options.pdf.pageWidth = options.pdf.pageWidth || fallback.pdf.pageWidth;
        
        if (fallback.pdf.header != null) {
            options.pdf.header.html = options.pdf.header.html || fallback.pdf.header.html;
            options.pdf.header.spacing = options.pdf.header.spacing || fallback.pdf.header.spacing;
        }
        
        if (fallback.pdf.footer != null) {
            options.pdf.footer.html = options.pdf.footer.html || fallback.pdf.footer.html;
            options.pdf.footer.spacing = options.pdf.footer.spacing || fallback.pdf.footer.spacing;
        }

        if (fallback.pdf.parts == null) {
            return;
        }

        for (let key in fallback.pdf.parts) {
            if (fallback.pdf.parts[key] === false) {
                delete options.pdf.parts[key];
                continue;
            }

            if (options.pdf.parts[key] == null) {
                options.pdf.parts[key] = fallback.pdf.parts[key];
                continue;
            }

            options.pdf.parts[key].type = options.pdf.parts[key].type || fallback.pdf.parts[key].type;
            options.pdf.parts[key].html = options.pdf.parts[key].html || fallback.pdf.parts[key].html;
            switch (options.pdf.parts[key].type) {
                case 'toc':
                    const optionsToc = <IPdfTocPart>options.pdf.parts[key];
                    const fallbackToc = <IPdfTocPart>fallback.pdf.parts[key];

                    optionsToc.xslStyleSheet = optionsToc.xslStyleSheet || fallbackToc.xslStyleSheet;
                    break;
            }
        }
    }
}

export default new OptionsService();