import * as path from "path";
import * as childProcess from "child_process";
import * as q from "q";

import { IPdfOptions } from "./options-service";
import { wkhtmltopdfArguments } from "../helpers/pdf-options-parser";

export class PdfService {
    public renderPdfAsync(layoutPath: string, outputPath: string, options: IPdfOptions) {
        const args = wkhtmltopdfArguments(layoutPath, options);
        args.push(outputPath);

        const defer = q.defer<IRenderPdfResult>();

        childProcess.execFile(options.wkhtmltopdfPath, args, { timeout: options.pdfRenderTimeout }, function(error, stdout, stderr) {
            const data = {
                error: error,
                stdout: stdout,
                stderr: stderr
            };

            if (error) {
                defer.reject(data);
            } else {
                defer.resolve(data);
            }
        });

        return defer.promise;
    }
}

export interface IRenderPdfResult {
    error?: Error;
    stdout: string;
    stderr: string;
}

export default new PdfService();

export { IPdfOptions } from "./options-service";