import { default as optionsService, IOptions } from "./services/options-service";
import markdownService from "./services/markdown-service";
import layoutService from "./services/layout-service";
import { default as fileService, TempPath } from "./services/file-service";
import pdfService from "./services/pdf-service";

export class MarkdownDocument {
    constructor(private options: IOptions) {
    }

    public async createPdfAsync() {
        await optionsService.consolidateAsync(this.options);
        
        const markdownAsHtml = await markdownService.renderFileAsync(this.options.documentPath);
        const tempPath = await layoutService.applyLayoutAsync(this.options.layout, markdownAsHtml, this.options, { });

        await pdfService.renderPdfAsync(tempPath.path, this.options.outputPath, this.options.pdf);

        await tempPath.deleteAsync();
    }
}

export { IOptions, IDocumentInformation } from "./services/options-service";