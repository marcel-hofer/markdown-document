import * as path from "path";

export interface IOptions {
    document: string;
    templateDir?: string;
}

export class MarkdownDocument {
    constructor(private options: IOptions) {
        this.fallbackOptionsToDocument();
        this.fallbackOptionsToTemplate();
        this.fallbackOptionsToDefault();
    }

    public createPdf() {
    }

    private fallbackOptionsToDocument() {
        // TODO
    }

    private fallbackOptionsToTemplate() {
        // TODO
    }

    private fallbackOptionsToDefault() {
        // TODO
    }
}