import * as path from "path";

import { default as optionsService, IOptions } from "./services/options-service";
import markdownService from "./services/markdown-service";
import layoutService from "./services/layout-service";
import fileService from "./services/file-service";
import pdfService from "./services/pdf-service";

export class MarkdownDocument {
    constructor(private options: IOptions) {
    }

    public async createPdf() {
        await optionsService.consolidateAsync(this.options);
        
        const markdownAsHtml = await markdownService.renderFileAsync(this.options.documentPath);
        const layout = await layoutService.applyLayoutAsync(this.options.layout, markdownAsHtml, this.options.document, { });

        const tempPath = await fileService.createTempFileAsync({ postfix: '.html' });
        await fileService.writeFileAsync(tempPath.path, layout);

        await pdfService.renderPdfAsync(tempPath.path, this.options.outputPath, this.options.pdf);

        tempPath.delete();
    }
}

export { IOptions, IDocumentInformation } from "./services/options-service";