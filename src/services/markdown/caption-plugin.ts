import { IRemarkable, IRemarkableOptions, IState, IToken, IRenderer } from "remarkable-types";

export class CaptionPlugin {
    public static readonly regex = /^\s*@\(caption \s*([\w\/]+)\s*:\s*(.+?)\s*\)\s*$/;
}