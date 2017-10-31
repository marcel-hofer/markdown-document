import * as path from "path";
import * as q from "q";

import { createInstance, InitOptions, TranslationFunction } from "i18next";
import * as Backend from "i18next-node-fs-backend";

import { IHandlebarHelper } from "../template-service";
import { TranslationService } from "../translation-service";

export class TranslateHelper implements IHandlebarHelper {
    public name: string = 'i18n';

    constructor(private translationService: TranslationService) {
    }

    public onExecute(key: string, options: { hash: any }) {
        return this.translationService.translate(key, options.hash);
    }
}