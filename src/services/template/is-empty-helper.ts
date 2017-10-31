import { IHandlebarHelper } from "../template-service";

export class IsEmptyHelper implements IHandlebarHelper {
    public name: string = 'isEmpty';
    
    public onExecute(data: any) {
        if (data == null) {
            return true;
        }

        if (Array.isArray(data)) {
            return data.length == 0;
        }

        if (typeof data !== 'object') {
            return false;
        }

        for (let key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                return false;
            }
        }

        return true;
    }
}