/// <reference path="../definitions/remarkable.d.ts" />

import { PathLike } from "fs";
import { Remarkable as RemarkableCtor, IRemarkable } from "remarkable-types";
const Remarkable: RemarkableCtor = require('remarkable');
const hljs = require('highlight.js');

import { CaptionPlugin } from "./markdown/caption-plugin";
import { IncludePlugin } from "./markdown/include-plugin";
import { LocalToAbsoluteImageSrcPlugin } from "./markdown/local-to-absolute-image-src-plugin";
const RemarkableKatex = require('remarkable-katex');

import fileService from "./file-service";

export class MarkdownService {
    private readonly md: IRemarkable;

    constructor() {
        this.md = this.createRemarkableInstance();
    }

    public async renderFileAsync(path: PathLike) {
        const file = await fileService.readFileAsync(path);
        const renderedMarkdown = this.md.render(file.toString(), { path: path });

        return renderedMarkdown;
    }

    public getMetadata() {
        return this.md.meta;
    }

    private createRemarkableInstance() {
        const md = new Remarkable({
            xhtmlOut: true,
            highlight: this.highlight
        });

        md.use(CaptionPlugin.register);
        md.use(IncludePlugin.register);
        md.use(LocalToAbsoluteImageSrcPlugin.register);
        md.use(RemarkableKatex);

        return md;
    }

    private highlight(str: string, lang: string): string {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (err) { }
        }

        try {
            return hljs.highlightAuto(str).value;
        } catch (err) { }

        return ''; // use external default escaping
    }
}

export default new MarkdownService();