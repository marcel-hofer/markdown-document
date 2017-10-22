import { IHandlebarHelper } from "../template-service";

export class LookupHelper implements IHandlebarHelper {
    public name: string = 'lookup';
    
    public onExecute(data: any, key: string) {
        return data[key] && data[key];
    }
}