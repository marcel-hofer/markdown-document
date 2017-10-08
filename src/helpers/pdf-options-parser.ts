import * as path from "path";
import { IPdfOptions, IPdfHeaderFooterOptions, IPdfCoverPart, IPdfTocPart, IPdfContentPart } from "./../services/options-service";

class WkhtmltopdfArguments {
    private args: string[] = [];

    constructor(private layoutPath: string, private options: IPdfOptions) {
        this.parseGlobal();
        this.parseHeader();
        this.parseFooter();
        this.parseParts();
    }

    public get arguments() {
        return this.args;
    }

    private parseGlobal() {
        this.addArgument('--margin-bottom', this.options.marginBottom);
        this.addArgument('--margin-left', this.options.marginLeft);
        this.addArgument('--margin-right', this.options.marginRight);
        this.addArgument('--margin-top', this.options.marginTop);
        this.addArgument('--orientation', this.options.orientation);
        this.addArgument('--page-size', this.options.pageSize);
        this.addArgument('--page-height', this.options.pageHeight);
        this.addArgument('--page-width', this.options.pageWidth);
    }
    
    private parseHeader() {
        this.parseHeaderFooter('header', this.options.header);
    }

    private parseFooter() {
        this.parseHeaderFooter('footer', this.options.footer);
    }

    private parseHeaderFooter(prefix: string, options: IPdfHeaderFooterOptions) {
        if (options == null || options.html == null) {
            return;
        }

        this.addArgument(`--${prefix}-html`, path.join(this.layoutPath, options.html));
        this.addArgument(`--${prefix}-spacing`, options.spacing);
    }

    private parseParts() {
        for (let key in this.options.parts) {
            const part = this.options.parts[key];

            if (part == null) {
                continue;
            }

            switch (part.type) {
                case 'cover':
                    this.parseCover(part);
                    break;
                case 'toc':
                    this.parseToc(part);
                    break;
                case 'content':
                    this.parseContent(part);
                    break;
                default:
                    throw new Error(`Unsupported part type '${part.type}' for part '${key}'!`);
                    break;
            }
        }
    }

    private parseCover(part: IPdfCoverPart) {
        this.addArgument('cover', path.join(this.layoutPath, part.html));
    }

    private parseToc(part: IPdfTocPart) {
        this.args.push('toc');
        
        if (part.xslStyleSheet != null) {
            this.addArgument('--xsl-style-sheet', path.join(this.layoutPath, part.xslStyleSheet));
        }
    }
    
    private parseContent(part: IPdfContentPart) {
        this.args.push(path.join(this.layoutPath, part.html));
    }

    private addArgument(name: string, value: any) {
        if (value === undefined || value === null) {
            return;
        }

        this.args.push(name);
        this.args.push(value);
    }
}

export function wkhtmltopdfArguments(layoutPath: string, options: IPdfOptions) {
    return new WkhtmltopdfArguments(layoutPath, options).arguments;
}

export function* allPaths(options: IPdfOptions) {
    if (options.header != null && options.header.html != null) {
        yield options.header.html;
    }
    
    if (options.footer != null && options.footer.html != null) {
        yield options.footer.html;
    }

    for (let key in options.parts) {
        const part = options.parts[key];

        if (part.html != null) {
            yield part.html;
        }
    }
}