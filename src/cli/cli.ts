/**
 * Markdown Document generator
 */
import {MarkdownDocument} from "../markdown-document";
import * as path from "path";

export class Cli {
    public generate(yargs: any): void {
        let inFilename: string = yargs.in;
        let outFilename: string = yargs.out;

        let options = {
            documentPath: path.join(process.cwd(), inFilename),
            outputPath: path.join(process.cwd(), outFilename),
            tempPath: path.join(process.cwd(), 'document.html'),
            layout: 'document.html',
        };

        const document = new MarkdownDocument(options);
        document.createPdfAsync().then(() => { });
    }
}