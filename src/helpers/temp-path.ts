import * as q from "q";

export class TempPath {
    public readonly path: string;

    constructor(path: string, private cleanupCallback?: () => q.IPromise<void> | any) {
        this.path = path;
    }

    public async deleteAsync() {
        if (this.cleanupCallback) {
            await this.cleanupCallback();
        }
    }
}