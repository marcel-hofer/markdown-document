import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import * as tmp from "tmp";
import * as q from "q";

import { TempPath } from "../helpers/temp-path";

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

    public readDirectoryAsync(directory: string) {
        return q.nfcall<string[]>(fs.readdir, directory);
    }

    public async isDirectoryAsync(directory: string) {
        const stat = await q.nfcall<fs.Stats>(fs.lstat, directory);
        return stat.isDirectory();
    }

    public async deleteDirectoryRecursiveAsync(directory: string) {
        if (!await this.existsAsync(directory)) {
            return;
        }

        const content = await this.readDirectoryAsync(directory);
        for (let fileOrFolder of content) {
            const fullPath = path.join(directory, fileOrFolder);

            if (await this.isDirectoryAsync(fullPath)) {
                await this.deleteDirectoryRecursiveAsync(fullPath);
            } else {
                await this.deleteFileAsync(fullPath);
            }
        }

        await this.deleteDirectoryAsync(directory);
    }

    public async deleteDirectoryAsync(directory: string) {
        return q.nfcall<void>(fs.rmdir, directory);
    }

    public async deleteFileAsync(file: string) {
        return q.nfcall<void>(fs.unlink, file);
    }

    public async createDirectoryRecursiveAsync(directory: string) {
        const normalizedDirectory = directory.replace(/[\\\/]/g, path.sep);

        let parentDir = path.isAbsolute(normalizedDirectory) ? path.sep : '';
        const dirs = normalizedDirectory.split(path.sep);
        
        for (let childDir of dirs) {
            parentDir = path.resolve(parentDir, childDir);

            if (!await this.existsAsync(parentDir)) {
                await this.createDirectoryAsync(parentDir);
            }
        }
    }

    public async createDirectoryAsync(directory: fs.PathLike) {
        return q.nfcall<void>(fs.mkdir, directory);
    }

    public createTempFileAsync(options: tmp.Options) {
        const defer = q.defer<TempPath>();

        tmp.file(options, (err, path, fd, cleanupCallback) => {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(new TempPath(path, () => this.deleteFileAsync(path)));
            }
        });

        return defer.promise;
    }

    public createTempDirectoryAsync() {
        const defer = q.defer<TempPath>();
        
        tmp.dir((err, path, cleanupCallback) => {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(new TempPath(path, () => this.deleteDirectoryRecursiveAsync(path)));
            }
        });

        return defer.promise;
    }
    
    public changeExt(file: string, ext: string = '') {
        return file.replace(/\.[^/.]+$/, '') + ext;
    }

    public toAbsoluteFileUrl(url: string) {
        const absoluteUrl = path.resolve(url).replace(/\\/g, '/');
        const protocol = os.platform() === 'win32'  ? 'file:///' : 'file://';

        return protocol + absoluteUrl;
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

export { TempPath } from "../helpers/temp-path";