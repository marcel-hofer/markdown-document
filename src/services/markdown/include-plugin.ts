import * as path from "path";
import * as winston from "winston";

import { IRemarkable, IRemarkableOptions, IState, IToken, IRenderer } from "remarkable-types";

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
    public static readonly IDENTIFIER = 'include';
    public static readonly REGEX = /^\s*@\(include \s*([\w\/]+\.md)\s*\)\s*$/;

    private readonly dependencyManager = new DependencyManager();

    constructor(private md: IRemarkable) {
    }

    public parse(state: IState, startLine: number, endLine: number, silent: boolean): boolean {
        const beginPos = state.bMarks[startLine];
        const endPos = state.eMarks[startLine];

        const content = state.src.substring(beginPos, endPos);

        const match = IncludePlugin.REGEX.exec(content);
        if (!match) {
            return false;
        }

        // don't insert any tokens in silent mode
        if (silent) {
            return true;
        }

        state.line = startLine + 1;
        state.tokens.push({
            type: IncludePlugin.IDENTIFIER,
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
        const includeFileName = match[1];

        const currentFile = this.currentFile(env);
        const currentBasePath = path.dirname(currentFile);
        const fullIncludeFileName = path.join(currentBasePath, includeFileName);

        winston.debug('Include markdown file %s relative to %s', includeFileName, currentBasePath);

        this.dependencyManager.with(currentFile);
        this.dependencyManager.check(fullIncludeFileName);
        
        const fileContent = fileService.readFile(fullIncludeFileName);
        const fileRendered = this.md.render(fileContent.toString(), { path: fullIncludeFileName });

        this.dependencyManager.end();

        return fileRendered;
    }

    private currentFile(env: any): string {
        if (!env.path) {
            throw new Error('No environment variable "path" provided.');
        }

        return env.path;
    }

    public static register(md: IRemarkable) {
        const plugin = new IncludePlugin(md);

        md.block.ruler.before('code', IncludePlugin.IDENTIFIER, plugin.parse.bind(plugin));
        md.renderer.rules[IncludePlugin.IDENTIFIER] = plugin.render.bind(plugin);

        return plugin;
    }
}

class DependencyManager {
    private files: string[] = [];

    public with(file: string) {
        this.files.push(file);
    }

    public check(file: string) {
        if (this.files.indexOf(file) === -1) {
            return;
        }

        const path = this.files.join(' -> ') + ' -> ' + file;
        throw new Error(`There is a recursive loop in the path ${path}.`);
    }

    public end() {
        this.files.splice(-1);
    }
}