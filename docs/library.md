# Library usage
The following snippet shows how you can create documents inside libraries or gulp scripts.

## Sample snippet
```typescript
import { MarkdownDocument, IOptions } from "markdown-document";

const options = <IOptions>{
    documentPath: 'path-to-document.md',

    // Set other properties (all optional)
};

const document = new MarkdownDocument(options);
document.createPdfAsync()
    .then(() => {
        // Document successfully generated
    })
    .catch(error => {
        // Oups... something went wrong -.-
    });
```