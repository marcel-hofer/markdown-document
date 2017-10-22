import * as process from "process";

import { IRemarkable, IRemarkableOptions, IState, IToken, IRenderer } from "remarkable-types";

export class CaptionPlugin {
    public static readonly IDENTIFIER = 'caption';
    public static readonly REGEX = /^\s*@\(caption \s*([\w\/]+)\s*:\s*(.+?)\s*\)\s*$/;

    constructor(private md: IRemarkable) {
        this.md.meta = this.md.meta || { };
        this.md.meta.captions = this.md.meta.captions || { };
    }

    public parse(state: IState, startLine: number, endLine: number, silent: boolean): boolean {
        const beginPos = state.bMarks[startLine];
        const endPos = state.eMarks[startLine];

        const content = state.src.substring(beginPos, endPos);

        const match = CaptionPlugin.REGEX.exec(content);
        if (!match) {
            return false;
        }

        // don't insert any tokens in silent mode
        if (silent) {
            return true;
        }

        state.line = startLine + 1;
        state.tokens.push({
            type: CaptionPlugin.IDENTIFIER,
            lines: [ startLine ],
            level: state.level,
            meta: {
                match: match
            }
        });

        return true;
    }

    public render(tokens: IToken[], idx: number, options: IRemarkableOptions, env: any, renderer: IRenderer): string {
        const token = tokens[idx];
        const match: RegExpExecArray = token.meta.match;
        
        const type = match[1];
        const title = match[2];

        const meta = this.getCaptionMetadata(type, title);

        return [
            `<a name="${meta.link}"></a>`,
            `<div class="caption caption-${type.toLowerCase()}">${title}</div>`
        ].join('');
    }

    public static register(md: IRemarkable) {
        const plugin = new CaptionPlugin(md);

        md.block.ruler.before('code', CaptionPlugin.IDENTIFIER, plugin.parse.bind(plugin));
        md.renderer.rules[CaptionPlugin.IDENTIFIER] = plugin.render.bind(plugin);

        return plugin;
    }

    private getCaptionMetadata(type: string, title: string) {
        const loweredType = type.toLowerCase();
        this.md.meta.captions[loweredType] = this.md.meta.captions[loweredType] || [];
        
        const captions: ICaptionMeta[] = this.md.meta.captions[loweredType];
        const caption = <ICaptionMeta>{
            index: captions.length + 1,
            link: `${loweredType}-${captions.length + 1}`,
            title: title
        };

        captions.push(caption);
        return caption;
    }
}

export interface ICaptionMeta {
    index: number;
    link: string;
    title: string;
}