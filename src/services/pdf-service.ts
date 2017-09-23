import * as path from "path";
import * as childProcess from "child_process";
import * as q from "q";

import { IPdfOptions, IPdfMargin } from "./options-service";

export class PdfService {
    public renderPdfAsync(input: string, output: string, options: IPdfOptions) {
        let getMargin = (getter: (margin: IPdfMargin) => string) => {
            if (typeof options.paperMargin === 'object') {
                return getter(options.paperMargin);
            } else {
                return options.paperMargin;
            }
        }

        const args: string[] = [
            path.join(__dirname, 'phantom/render.js'),
            input,
            output,
            options.cwd,
            options.paperFormat,
            options.paperOrientation,
            getMargin(margin => margin.top),
            getMargin(margin => margin.left),
            getMargin(margin => margin.bottom),
            getMargin(margin => margin.right)
        ];

        const defer = q.defer<IRenderPdfResult>();

        childProcess.execFile(options.phantomPath, args, { timeout: 15000 }, function(error, stdout, stderr) {
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