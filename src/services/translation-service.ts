import * as path from "path";
import * as q from "q";

import i18next from "i18next";
import * as Backend from "i18next-node-fs-backend";

export class TranslationService {
    private translator: i18next.i18n;
    private t: i18next.TFunction;

    constructor(private layoutDirectory: string, private language: string) {
    }

    public async initAsync() {
        const defer = q.defer<void>();

        const translationDirectory = path.join(this.layoutDirectory, 'i18n/{{lng}}.json');
        const config = <i18next.InitOptions>{
            lng: this.language,
            fallbackLng: 'en',

            backend: <i18nextNodeFsBackEnd.i18nextNodeFsBackEndOptions>{
                loadPath: translationDirectory
            }
        };

        this.translator = i18next.createInstance();
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