export interface IOptions {
    document: string;
}

export class MarkdownDocument {
    constructor(private options: IOptions) {
    }

    public createPdf() {
    }
}