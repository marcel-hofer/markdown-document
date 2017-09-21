import * as fs from "fs";
import * as q from "q";

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