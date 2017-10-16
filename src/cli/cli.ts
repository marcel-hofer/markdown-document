import * as path from "path";
import * as winston from "winston";

import {MarkdownDocument, IOptions} from "../markdown-document";

export class Cli {
    public generate(yargs: any): void {
        winston.configure({
            level: yargs.logLevel,
            transports: [
                new winston.transports.Console({
                    colorize: true
                })
            ]
        });

        let options = <IOptions>{
            documentPath: path.resolve(yargs.in),
            outputPath: yargs.out == null ? null : path.join(process.cwd(), yargs.out),
            layout: yargs.layout
        };

        if (yargs.temp) {
            options.tempPath = path.join(process.cwd(), yargs.temp)
        }

        const document = new MarkdownDocument(options);
        document.createPdfAsync()
            .then(() => {
                winston.info('Finished PDF generation');
            })
            .catch(error => {
                winston.warn('Failed to generate PDF');
                winston.error(error);
            });
    }
}