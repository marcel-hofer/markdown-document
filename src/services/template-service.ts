import * as handlebars from "handlebars";

export class TemplateService {
    public applyTemplate(template: string, data: any) {
        const compiledTemplate = handlebars.compile(template.toString());
        return compiledTemplate(data);
    }
}

export default new TemplateService();