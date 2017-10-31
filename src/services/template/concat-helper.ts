import { IHandlebarHelper } from "../template-service";

export class ConcatHelper implements IHandlebarHelper {
    public name: string = 'concat';
    
    public onExecute(...parts: string[]) {
        return parts.slice(0, parts.length -1).join('');
    }
}