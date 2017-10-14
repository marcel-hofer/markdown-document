import * as path from "path";
import * as winston from "winston";

import { IOptions, IDocumentInformation } from "../markdown-document";
import { default as fileService, TempPath } from "./file-service";
import { TemplateService } from "./template-service";
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
        const templateService = new TemplateService(options);

        for (let file of allPaths(options.pdf)) {
            winston.debug('Applying template to', file);

            const template = await fileService.readFileAsync(path.join(layoutPath, file));
            const targetFile = path.join(tempDirectory.path, path.basename(path.join(layoutPath, file)));
    
            const content = await templateService.applyTemplateAsync(template.toString(), data);
    
            await fileService.writeFileAsync(targetFile, content);
        }

        return tempDirectory;
    }

    private async getTempDirectoryAsync(options: IOptions) {
        if (options.tempPath == null) {
            return await fileService.createTempDirectoryAsync();
        } else {
            await fileService.createDirectoryRecursiveAsync(options.tempPath);
            return new TempPath(options.tempPath)
        }
    }
}

export default new LayoutService();

export { IDocumentInformation } from "../markdown-document";