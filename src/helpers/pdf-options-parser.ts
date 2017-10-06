import * as path from "path";
import { IPdfOptions, IPdfHeaderFooterOptions } from "./../services/options-service";

class WkhtmltopdfArguments {
    private args: string[] = [];

    constructor(private layoutPath: string, private options: IPdfOptions) {
        this.parseGlobal();
        this.parseHeader();
        this.parseFooter();
        this.parseCover();
        this.parseToc();
        this.parseContent();
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

    private parseCover() {
        if (this.options.cover == null || this.options.cover.cover == null) {
            return;
        }

        this.addArgument('cover', path.join(this.layoutPath, this.options.cover.cover));
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

    private parseToc() {
        if (this.options.toc == null || this.options.toc.toc != true) {
            return;
        }

        this.args.push('toc');
        
        if (this.options.toc.xslStyleSheet != null) {
            this.addArgument('--xsl-style-sheet', path.join(this.layoutPath, this.options.toc.xslStyleSheet));
        }
    }
    
    private parseContent() {
        if (this.options.content == null || this.options.content.content == null) {
            return;
        }

        this.args.push(path.join(this.layoutPath, this.options.content.content));
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
    if (options.cover != null && options.cover.cover != null) {
        yield options.cover.cover;
    }

    if (options.header != null && options.header.html != null) {
        yield options.header.html;
    }
    
    if (options.footer != null && options.footer.html != null) {
        yield options.footer.html;
    }

    if (options.content != null && options.content.content != null) {
        yield options.content.content;
    }

    if (options.toc != null && options.toc.xslStyleSheet != null) {
        yield options.toc.xslStyleSheet
    }
}