declare module "remarkable-types" {
    export interface IRemarkableOptions {
        html?: boolean;
        xhtmlOut?: boolean;
        breaks?: boolean;
        langPrefix?: string;
        linkify?: boolean;
        linkTarget?: string;
        typographer?: boolean;
        quotes?: string;
        highlight?(str: string, lang: string): string;
        maxNesting?: number;
    }

    export interface Remarkable {
        new(options: IRemarkableOptions): IRemarkable;
    }
    
    export interface IRemarkable {
        render(markdown: string, env?: any): string;
        use(plugin: (md: IRemarkable) => any): void;
        inline: IParser<IInlineParserFunc>,
        block: IParser<IBlockParserFunc>,
        core: IParser<IInlineParserFunc>,
        renderer: IRenderer;
    }

    export interface IParser<TParserFunc> {
        ruler: {
            before(beforeName: string, ruleName: string, parse: TParserFunc, options?: any): void;
            after(afterName: string, ruleName: string, parse: TParserFunc, options?: any): void;
            push(ruleName: string, parse: TParserFunc, options?: any): void;
            at(ruleName: string, parse: TParserFunc, options?: any): void;
        }
    }
    
    export interface IBlockParserFunc {
        (state: IState, startLine: number, endLine: number, silent: boolean): boolean;
    }
    
    export interface IInlineParserFunc {
        (state: IState, silent: boolean): boolean;
    }

    export interface IRenderer {
        rules: {
            [name: string]: (tokens: IToken[], idx: number, options: IRemarkableOptions, env: any, renderer: IRenderer) => string;
        }
    }

    export interface IState {
        src: string;
        env: any;
        options: IRemarkableOptions;
        tokens: IToken[];
        pos: number;
        maxPos: number;
        line: number;
        level: number;
        pending: string;
        pendingLevel: number;
        cache: {
            [key: string]: any;
        };
        isInLabel: boolean;
        linkLevel: number;
        linkContent: string;
        labelUnmatchedScopes: number;
        blkIndent: number;
        /// Begin marks
        bMarks: {
            [line: number]: number;
        };
        /// End marks
        eMarks: {
            [line: number]: number;
        };
        tShift: {
            [line: number]: number;
        };

        push(token: IToken);
        getLines(begin: number, end: number, indent: number, keepLastLF: boolean): string;
    }

    export interface IToken {
        type?: string;
        tight?: boolean;
        level?: number;
        lines?: number[];
        children?: any[];
        content?: number;
        meta?: any;
    }
}

declare module "remarkable" {
    import { Remarkable } from "remarkable-types";

    export = Remarkable;
}