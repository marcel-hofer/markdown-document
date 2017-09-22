import * as path from "path";

import { IOptions, IDocumentInformation } from "../markdown-document";
import fileService from "./file-service";

export class TemplateService {
    public readonly templatePath = path.join(__dirname, '../../templates');

    /**
     * Resolves the path of the given template.
     * This function will try the following locations:
     * - template path itself (if it is an absolute path)
     * - template path relative to the documents location
     * - template path inside the common template directory
     * 
     * @param template The template path or partial path to resolve
     * @param documentPath The path to the current document
     */
    public async resolveTemplatePathAsync(template: string, documentPath: string) {
        if (path.isAbsolute(template)) {
            if (await fileService.existsAsync(template)) {
                return template;
            }

            throw new Error(`Cannot find the template '${template}'.`);
        }

        const templateInDocumentPath = path.join(path.dirname(documentPath), template);
        if (await fileService.existsAsync(templateInDocumentPath)) {
            return templateInDocumentPath;
        }

        const templateInTemplatePath = path.join(this.templatePath, template);
        if (await fileService.existsAsync(templateInTemplatePath)) {
            return templateInTemplatePath;
        }

        throw new Error(`Cannot find the template '${template}'.`);
    }

    public async applyTemplate(templatePath: string, markdown: string, document: IDocumentInformation, additionalData?: any) {
        const data = Object.assign({
            document: document
        }, additionalData);

        const template = await fileService.readFileAsync(templatePath);
        const tempFile = await fileService.createTempFileAsync({ postfix: '.html'});
    }
}

export default new TemplateService();