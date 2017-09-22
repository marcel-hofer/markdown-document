import { IPdfOptions } from "./options-service";

export class PdfService {
    public async renderPdf(file: string, options: IPdfOptions) {
        // TODO: Call phantomjs
    }
}

export default new PdfService();