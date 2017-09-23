export class TempFile {
    public readonly path: string;

    constructor(path: string, private cleanupCallback?: () => void) {
        this.path = path;
    }

    public delete() {
        if (this.cleanupCallback) {
            this.cleanupCallback();
        }
    }
}