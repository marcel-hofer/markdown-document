import * as fs from "fs";
import * as tmp from "tmp";
import * as q from "q";

import { TempFile } from "../helpers/temp-file";

export class FileService {
    public existsAsync(path: fs.PathLike) {
        return this.nfCallNoError<boolean>(fs.exists, path);
    }

    public readFile(path: fs.PathLike) {
        return fs.readFileSync(path);
    }

    public readFileAsync(path: fs.PathLike) {
        return q.nfcall<Buffer>(fs.readFile, path);
    }

    public writeFileAsync(path: fs.PathLike, content: any) {
        return q.nfcall<void>(fs.writeFile, path, content);
    }

    public createTempFileAsync(options: tmp.Options) {
        const defer = q.defer<TempFile>();

        tmp.file(options, (err, path, fd, cleanupCallback) => {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(new TempFile(path, cleanupCallback));
            }
        });

        return defer.promise;
    }
    
    public changeExt(file: string, ext: string = '') {
        return file.replace(/\.[^/.]+$/, '') + ext;
    }

    private nfCallNoError<TValue>(nodeFunction: (...args: any[]) => any, ...args: any[]) {
        const defer = q.defer<TValue>();

        try {
            nodeFunction(...args, function(result: TValue) {
                defer.resolve(result);
            });
        } catch (ex) {
            defer.reject(ex);
        }

        return defer.promise;
    }
}

export default new FileService();

export { TempFile } from "../helpers/temp-file";