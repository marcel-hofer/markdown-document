declare module "node-exiftool" {
    import * as q from "q";

    export interface INodeExiftool {
        ExiftoolProcess: ExiftoolProcess;
    }

    export class ExiftoolProcess {
        constructor(binPath: string);

        open(): q.IPromise<number>;
        close(): q.IPromise<void>;

        readMetadata<TMetadata extends IDefaultMetadata>(file: string, arguments?: string[]): q.IPromise<IReadMetadataResult<TMetadata>>;
        writeMetadata(file: string, data: any, args?: string[]): q.IPromise<void>;
    }

    export interface IDefaultMetadata {
        SourceFile?: string;
        ExifToolVersion?: string;
    }

    export interface IReadMetadataResult<TMetadata extends IDefaultMetadata> {
        data: TMetadata[];
        error: any;
    }

    export default INodeExiftool;
}