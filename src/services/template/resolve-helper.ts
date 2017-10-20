import * as path from "path";
import * as winston from "winston";

import fileService from "../file-service";
import { IHandlebarHelper } from "../template-service";

export class ResolveHelper implements IHandlebarHelper {
    public name: string = 'resolve';
    
    public onExecute(module: string, options: { hash: any }) {
        let moduleDirectory: string;

        try {
            moduleDirectory = fileService.resolveModuleDirectory(module);
        } catch(ex) {
            winston.warn(`The required module '${module}' used inside the template could not be found.`);
            throw ex;
        }

        const filePath = path.join(moduleDirectory, options.hash.file);
        if (!fileService.exists(filePath)) {
            winston.warn(`The required template file '${options.hash.file}' for module '${module}' could not be found.`);
            winston.warn(`The resolved template file path is '${filePath}'.`)
        }

        return fileService.toAbsoluteFileUrl(filePath);
    }
}