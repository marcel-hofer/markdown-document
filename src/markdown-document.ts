import * as path from "path";

import { default as optionsService, IOptions } from "./services/options-service";

export class MarkdownDocument {
    constructor(private options: IOptions) {
    }

    public async createPdf() {
        await optionsService.consolidateAsync(this.options);
    }
}

export { IOptions, IDocumentInformation } from "./services/options-service";