import { PathLike } from "fs";
const Remarkable: IRemarkableCtor = require('remarkable');

import fileService from "./file-service";

interface IRemarkableCtor {
    new (options: {
        xhtmlOut?: boolean
    }): IRemarkable;
}

interface IRemarkable {
    render(markdown: string): string;
}

export class MarkdownService {
    private md: IRemarkable;

    constructor() {
        this.md = new Remarkable({
            xhtmlOut: true
        });
    }

    public async renderFileAsync(path: PathLike) {
        const file = await fileService.readFileAsync(path);
        const renderedMarkdown = this.md.render(file.toString());

        return renderedMarkdown;
    }
}

export default new MarkdownService();