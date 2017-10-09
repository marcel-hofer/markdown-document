import * as path from "path";

import fileService from "../file-service";

import { IRemarkable, IRemarkableOptions, IState, IToken, IRenderer, IRendererFunc } from "remarkable-types";

export class LocalToAbsoluteImageSrcPlugin {
    constructor(private md: IRemarkable, private originalRenderer: IRendererFunc) {
    }

    public render(tokens: IToken[], idx: number, options: IRemarkableOptions, env: any, renderer: IRenderer): string {
        const token = <IImageToken>tokens[idx];

        if (this.shouldTranslate(token.src)) {
            const documentFolder = path.dirname(this.currentFile(env));
            const fullImageSource = path.join(documentFolder, token.src);
            const src = fileService.toAbsoluteFileUrl(fullImageSource);

            token.src = src;
        }

        return this.originalRenderer.apply(null, arguments);
    }

    private shouldTranslate(src: string) {
        if (src == null) {
            return false;
        }

        if (src.startsWith('http')) {
            return false;
        }

        return true;
    }

    private currentFile(env: any): string {
        if (!env.path) {
            throw new Error('No environment variable "path" provided.');
        }

        return env.path;
    }

    public static register(md: IRemarkable) {
        var plugin = new LocalToAbsoluteImageSrcPlugin(md, md.renderer.rules['image']);

        md.renderer.rules['image'] = plugin.render.bind(plugin);

        return plugin;
    }
}

interface IImageToken extends IToken {
    src: string;
}