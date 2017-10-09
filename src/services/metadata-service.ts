import * as exiftool from "node-exiftool";
const exiftoolBin: string = require('dist-exiftool');

export class MetadataService {
    public async getMetadataAsync(file: string) {
        const process = new exiftool.ExiftoolProcess(exiftoolBin);

        try {
            await process.open();
            return await process.readMetadata(file);
        } 
        finally {
            await process.close();
        }
    }

    public setPdfMetadataAsync() {
        // TODO
    }
}