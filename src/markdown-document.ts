import * as winston from "winston";

import { default as optionsService, IOptions } from "./services/options-service";
import markdownService from "./services/markdown-service";
import layoutService from "./services/layout-service";
import { default as fileService, TempPath } from "./services/file-service";
import pdfService from "./services/pdf-service";
import { default as metadataService, IPdfMetadata } from "./services/metadata-service";

export class MarkdownDocument {
    constructor(private options: IOptions) {
    }

    public async createPdfAsync() {
        let timer = winston.startTimer();
        await optionsService.consolidateAsync(this.options);
        timer.done('Loading options finished');

        timer = winston.startTimer();
        await this.checkPreconditionsAsync();
        timer.done('Checked preconditions');
        
        timer = winston.startTimer();
        const markdownAsHtml = await markdownService.renderFileAsync(this.options.documentPath);
        const markdownMeta = markdownService.getMetadata();
        timer.done('Render markdown to html finished');

        timer = winston.startTimer();
        const tempPath = await layoutService.applyLayoutAsync(this.options.layout, markdownAsHtml, this.options, { meta: markdownMeta });
        timer.done('Applying layout finished');

        timer = winston.startTimer();
        await pdfService.renderPdfAsync(tempPath.path, this.options.outputPath, this.options.pdf);
        timer.done('Rendering pdf finished');

        if (this.options.writeMetadata && this.options.document != null) {
            timer = winston.startTimer();
            await metadataService.setMetadataAsync<IPdfMetadata>(this.options.outputPath, {
                Title: this.options.document.title,
                Subject: this.options.document.subject,
                Author: this.options.document.authors.join(';'),
                Keywords: this.options.document.keywords || []
            });
            timer.done('Setting pdf metadata finished');
        }

        await tempPath.deleteAsync();
    }

    private async checkPreconditionsAsync() {
        if (await fileService.existsAsync(this.options.outputPath)) {
            try {
                await fileService.deleteFileAsync(this.options.outputPath);
            }
            catch {
                throw new Error(`The output file '${this.options.outputPath}' is not writable!`);
            }
        }
    }
}

export { IOptions, IDocumentInformation } from "./services/options-service";