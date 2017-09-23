import * as path from "path";

import { IDocumentInformation } from "../markdown-document";
import fileService from "./file-service";
import templateService from "./template-service";

export class LayoutService {
    public readonly layoutPath = path.join(__dirname, '../../layouts');

    /**
     * Resolves the path of the given layout.
     * This function will try the following locations:
     * - layout path itself (if it is an absolute path)
     * - layout path relative to the documents location
     * - layout path inside the common layout directory
     * 
     * @param layout The layout path or partial path to resolve
     * @param documentPath The path to the current document
     */
    public async resolveLayoutPathAsync(layout: string, documentPath: string) {
        if (path.isAbsolute(layout)) {
            if (await fileService.existsAsync(layout)) {
                return layout;
            }

            throw new Error(`Cannot find the layout '${layout}'.`);
        }

        const layoutInDocumentPath = path.join(path.dirname(documentPath), layout);
        if (await fileService.existsAsync(layoutInDocumentPath)) {
            return layoutInDocumentPath;
        }

        const layoutInLayoutPath = path.join(this.layoutPath, layout);
        if (await fileService.existsAsync(layoutInLayoutPath)) {
            return layoutInLayoutPath;
        }

        throw new Error(`Cannot find the layout '${layout}'.`);
    }

    public async applyLayoutAsync(layoutPath: string, markdownAsHtml: string, document: IDocumentInformation, additionalData?: any) {
        const data = Object.assign({
            layoutPath: 'file://' + path.dirname(path.resolve(layoutPath)).replace(/\\/g, '/') + '/',
            markdown: markdownAsHtml,
            document: document
        }, additionalData);

        const template = await fileService.readFileAsync(layoutPath);
        const tempFile = await fileService.createTempFileAsync({ postfix: '.html'});

        return await templateService.applyTemplate(template.toString(), data);
    }
}

export default new LayoutService();

export { IDocumentInformation } from "../markdown-document";