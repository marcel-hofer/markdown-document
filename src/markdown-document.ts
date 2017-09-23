import { default as optionsService, IOptions } from "./services/options-service";
import markdownService from "./services/markdown-service";
import layoutService from "./services/layout-service";
import { default as fileService, TempFile } from "./services/file-service";
import pdfService from "./services/pdf-service";

export class MarkdownDocument {
    constructor(private options: IOptions) {
    }

    public async createPdfAsync() {
        await optionsService.consolidateAsync(this.options);
        
        const markdownAsHtml = await markdownService.renderFileAsync(this.options.documentPath);
        const layout = await layoutService.applyLayoutAsync(this.options.layout, markdownAsHtml, this.options.document, { });

        
        const tempFile = await this.getTempFileAsync();
        await fileService.writeFileAsync(tempFile.path, layout);

        await pdfService.renderPdfAsync(tempFile.path, this.options.outputPath, this.options.pdf);

        tempFile.delete();
    }

    private async getTempFileAsync() {
        if (this.options.tempPath == null) {
            return await fileService.createTempFileAsync({ postfix: '.html' });
        } else {
            return new TempFile(this.options.tempPath)
        }
    }
}

export { IOptions, IDocumentInformation } from "./services/options-service";