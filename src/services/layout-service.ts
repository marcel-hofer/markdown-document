import * as path from "path";

import { IOptions, IDocumentInformation } from "../markdown-document";
import { default as fileService, TempFile } from "./file-service";
import templateService from "./template-service";
import { allPaths } from "../helpers/pdf-options-parser";

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

    public async applyLayoutAsync(layoutPath: string, markdownAsHtml: string, options: IOptions, additionalData?: any) {
        const data = Object.assign({
            layoutPath: fileService.toAbsoluteFileUrl(layoutPath) + '/',
            markdown: markdownAsHtml,
            document: options.document
        }, additionalData);

        const tempDirectory = await this.getTempDirectoryAsync(options);

        for (let file of allPaths(options.pdf)) {
            await this.applyLayoutInternalAsync(tempDirectory, path.join(layoutPath, file), data);
        }

        return tempDirectory;
    }

    private async applyLayoutInternalAsync(directory: TempFile, layoutFile: string, data: any) {
        const template = await fileService.readFileAsync(layoutFile);
        const targetFile = path.join(directory.path, path.basename(layoutFile));

        const content = templateService.applyTemplate(template.toString(), data);

        await fileService.writeFileAsync(targetFile, content);
    }

    private async getTempDirectoryAsync(options: IOptions) {
        if (options.tempPath == null) {
            return await fileService.createTempDirectoryAsync();
        } else {
            await fileService.createDirectoryRecursiveAsync(options.tempPath);
            return new TempFile(options.tempPath)
        }
    }
}

export default new LayoutService();

export { IDocumentInformation } from "../markdown-document";