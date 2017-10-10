import * as exiftool from "node-exiftool";
const exiftoolBin: string = require('dist-exiftool');

export class MetadataService {
    public async getMetadataAsync<TMetadata>(file: string) {
        const process = new exiftool.ExiftoolProcess(exiftoolBin);

        try {
            await process.open();
            const result = await process.readMetadata<TMetadata>(file);

            if (result.error) {
                throw result.error;
            }

            if (result.data == null || result.data.length != 1) {
                throw new Error('Unexpected result count recived');
            }

            return result.data[0];
        } 
        finally {
            await process.close();
        }
    }

    public async setMetadataAsync<TMetadata>(file: string, data: TMetadata) {
        const process = new exiftool.ExiftoolProcess(exiftoolBin);

        try {
            await process.open();
            await process.writeMetadata(file, data, ['overwrite_original']);
        } 
        finally {
            await process.close();
        }
    }
}

export interface IPdfMetadata extends exiftool.IDefaultMetadata {
    Title?: string;
    Subject?: string;
    Author?: string;
    Keywords?: string[];
    Language?: string;
}