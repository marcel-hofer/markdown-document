/// <reference path="../include.d.ts" />

import * as should from "should";

import { IOptions, MarkdownDocument } from "../../src/markdown-document";
import fileService from "../../src/services/file-service";

export async function testTemplateGenerationAsync(options: IOptions, markdown: string) {
    await fileService.writeFileAsync(options.documentPath, markdown);
    
    const service = new MarkdownDocument(options);

    // Act
    await service.createPdfAsync();

    // Assert
    const fileExists = await fileService.existsAsync(options.outputPath);
    should(fileExists).be.true();
}

export function basicTemplate(imagePath: string = '../') {
    return `
# Heading 1
This is a paragraph!

## Heading 1.1
- Item 1
  1 Item 1.1
  2 Item 1.2
  3 Item 1.3
- Item 2
- Item 3

### Heading 1.1.1
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

### Heading 1.1.2
\`\`\`javascript
var s = "JavaScript syntax highlighting";
alert(s);
\`\`\`

### Heading 1.1.3
[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][Arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].

URLs and URLs in angle brackets will automatically get turned into links. 
http://www.example.com or <http://www.example.com> and sometimes 
example.com (but not on Github, for example).

Some text to show that the reference links can follow later.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com

## Heading 1.2
> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote. 

## Heading 1.3
![pexels-photo-548383](${imagePath}images/pexels-photo-548383.jpeg)

## Formulas

You can use inline formulas like this $c = \\pm\\sqrt{a^2 + b^2}$

$$
f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi
$$`.trim();
}