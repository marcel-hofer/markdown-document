import * as path from "path";
import * as q from "q";

import { createInstance, InitOptions, TranslationFunction, i18n } from "i18next";
import * as Backend from "i18next-node-fs-backend";

export class TranslationService {
    private translator: i18n;
    private t: TranslationFunction;

    constructor(private layoutDirectory: string, private language: string) {
    }

    public async initAsync() {
        const defer = q.defer<void>();

        const translationDirectory = path.join(this.layoutDirectory, 'i18n/{{lng}}.json');
        const config = <InitOptions>{
            lng: this.language,
            fallbackLng: 'en',

            backend: <i18nextNodeFsBackEnd.i18nextNodeFsBackEndOptions>{
                loadPath: translationDirectory
            }
        };

        this.translator = createInstance();
        this.translator.use(Backend);

        this.translator.init(config, (error, t) => {
            this.t = t;

            defer.resolve();
        });

        return defer.promise;
    }

    public overwriteTranslations(translations: any) {
        this.translator.addResourceBundle(this.language, 'translation', translations, true, true);
        this.translator.addResourceBundle('en', 'translation', translations, true, true);
    }

    public get translate() {
        return this.t;
    }
}