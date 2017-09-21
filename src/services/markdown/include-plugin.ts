import * as path from "path";
import { IRemarkable, IRemarkableOptions, IState, IToken } from "remarkable-types";

import fileService from "../file-service";

/**
 * Includes markdown files.
 * 
 * document.md:
 * # title
 * @(include file1.md)
 * 
 * file1.md
 * ## subtitle
 * 
 * will be merged to:
 * # title
 * ## subtitle
 */
export class IncludePlugin {
    public static readonly regex = /^\w*@\(include ([\w\/]+\.md)\)\w*/;
    private fileStack: string[] = [];

    constructor(private md: IRemarkable) {
    }

    public parse(state: IState, startLine: number, endLine: number, silent: boolean): boolean {
        this.rememberFile(state);

        let beginPos = state.bMarks[startLine];
        let endPos = state.eMarks[startLine];

        let content = state.src.substring(beginPos, endPos);

        const match = IncludePlugin.regex.exec(content);
        if (!match) {
            return false;
        }

        // don't insert any tokens in silent mode
        if (silent) {
            return true;
        }

        state.line = startLine + 1;
        state.tokens.push({
            type: 'include',
            lines: [ startLine ],
            level: state.level,
            meta: {
                match: match
            }
        });

        return true;
    }

    public render(tokens: IToken[], idx: number, options: IRemarkableOptions): string {
        const token = tokens[idx];
        const match: RegExpExecArray = token.meta.match;
        const includeFileName = match[1];

        const currentBasePath = path.dirname(this.currentFile());
        const fullIncludeFileName = path.join(currentBasePath, includeFileName);

        // TODO: Fix circular dependency check
        if (this.fileStack.indexOf(fullIncludeFileName) !== -1) {
            throw new Error('Circular dependency of ' + fullIncludeFileName);
        }

        const fileContent = fileService.readFile(fullIncludeFileName);
        const fileRendered = this.md.render(fileContent.toString(), { path: fullIncludeFileName });

        return fileRendered;
    }

    private rememberFile(state: IState) {
        if (state.cache == null) {
            state.cache = [];
        }

        // TODO: Improve states
        if (state.cache['include-process-started']) {
            return;
        }

        if (!state.env.path) {
            throw new Error('No environment variable "path" provided.');
        }

        this.fileStack.push(state.env.path);
        state.cache['include-process-started'] = true;
    }

    private currentFile() {
        return this.fileStack.slice(-1)[0];
    }

    public static register(md: IRemarkable) {
        var plugin = new IncludePlugin(md);

        md.block.ruler.before('paragraph', 'include', plugin.parse.bind(plugin));
        md.renderer.rules.include = plugin.render.bind(plugin);

        return plugin;
    }
}