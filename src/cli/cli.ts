import { MarkdownDocument, IOptions } from "../markdown-document";
import * as path from "path";

export class Cli {
    public generate(yargs: any): void {
        let options = <IOptions>{
            documentPath: path.resolve(yargs.in),
            outputPath: yargs.out == null ? null : path.join(process.cwd(), yargs.out),
            layout: yargs.layout
        };

        const document = new MarkdownDocument(options);
        document.createPdfAsync()
            .then(() => { 
                console.log('Finished PDF generation');
            })
            .catch(error => {
                console.log('Failed to generate PDF');
                console.error(error);
            });
    }
}