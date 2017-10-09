import * as path from "path";
import * as q from "q";

import { createInstance, InitOptions, TranslationFunction } from "i18next";
import * as Backend from "i18next-node-fs-backend";

import { IHandlebarHelper } from "../template-service";

export class TranslateHelper implements IHandlebarHelper {
    public name: string = 'i18n';
    public t: TranslationFunction;

    constructor(private layoutDirectory: string, private language: string) {
    }

    public async init() {
        const defer = q.defer<void>();

        const translationDirectory = path.join(this.layoutDirectory, 'i18n/{{lng}}.json');
        const config = <InitOptions>{
            lng: this.language,
            fallbackLng: 'en',

            backend: <i18nextNodeFsBackEnd.i18nextNodeFsBackEndOptions>{
                loadPath: translationDirectory
            }
        };

        const translator = createInstance();
        translator.use(Backend);

        // translator.loadLanguages(['en', this.language], (error, t)=> {
        // });

        translator.init(config, (error, t) => {
            this.t = t;

            defer.resolve();
        });
        

        // translator.init(config, (error, t) => {
        //     this.t = t;

        //     if (error) {
        //         defer.reject(error);
        //     } else {
        //         defer.resolve();
        //     }
        // });

        return defer.promise;
    }

    public onExecute(key: string, options: { hash: any }) {
        return this.t(key, options.hash);
    }
}