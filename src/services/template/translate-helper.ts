import * as path from "path";
import * as q from "q";

import { createInstance, InitOptions, TranslationFunction } from "i18next";
import * as Backend from "i18next-node-fs-backend";

import * as handlebars from "handlebars";

export class TranslateHelper {
    public t: TranslationFunction;

    constructor(private layoutDirectory: string) {
    }

    public async init() {
        const defer = q.defer<void>();

        const translationDirectory = path.join(this.layoutDirectory, 'i18n/{{lng}}.json');
        const config = <InitOptions>{
            fallbackLng: 'en',
            backend: {
                loadPath: translationDirectory
            }
        };

        const translator = createInstance();
        translator.use(Backend);

        translator.init(config, (error, t) => {
            this.t = t;

            if (error) {
                defer.reject(error);
            } else {
                defer.resolve();
            }
        });

        return defer.promise;
    }

    public register() {
        const that = this;
        handlebars.registerHelper('i18n', function(key: string, options: { hash: any }) {
            return that.t(key, options.hash);
        });
    }
}