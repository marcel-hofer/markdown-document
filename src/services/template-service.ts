import * as path from "path";

import { IOptions } from "../markdown-document";
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
}

export default new TemplateService();