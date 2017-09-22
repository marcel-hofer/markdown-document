/// <reference path="../definitions/remarkable.d.ts" />

import { PathLike } from "fs";
import { Remarkable as RemarkableCtor, IRemarkable } from "remarkable-types";
const Remarkable: RemarkableCtor = require('remarkable');

import { IncludePlugin } from "./markdown/include-plugin";

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

    private createRemarkableInstance() {
        const md = new Remarkable({
            xhtmlOut: true
        });

        md.use(IncludePlugin.register);

        return md;
    }
}

export default new MarkdownService();