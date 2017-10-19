# Writing documents
A document basically consists of a `.md` file containing the document content and optionally a `.json` file with it's properties.

## Properties
The properties used for document generation can be specified in different ways. Properties will be applied in the following order:
1. The [command line](command-line.md) or [library](library.md) arguments
2. The document properties
3. The layout properties
4. Application defaults

### Location
The `.json` file must be in the same directory and use the same name as the document `.md` file. For example if the main `.md` file of the document is called `my-super-awesome-document.md` the properties file must be called `my-super-awesome-document.json`.

### Example properties
```json
{
    // Define the layout to use. Supported are:
    // - Absolute paths to layout folder
    // - Relative path from document location
    // - A document from the built-in documnets
    "layout": "document",
    // Set the language (basically for layout translations)
    // Fallback is EN if no specific translation can be found
    "language": "en",

    // Set this option to true (default) if the "document" properties should be written to the output pdf
    "writeMetadata": true,

    // Set document related properties (will be used inside templates and for pdf metadata)
    "document": {
        "title": "My awesome title",
        "subject": "An awesome subject",
        "date": "2017-09-22",
        "authors": ["John Doe", "David Miller"],
        "keywords": ["markdown", "document", "pdf"],

        // Provide additional data used inside the templates
        "data": {
            ...
        }
    },

    // Overwrite layout settings
    "pdf": {
        ...
    }
}
```

## Markdown
Because the written documents can grow really fast and markdown will soon reach the limits, there are a few extensions built in.

### Include
To split large documents into small parts, you can take advantages of the *Include* plugin.

Given the following two markdown files:

- `main.md`
```markdown
# Title
@(include include.md)
```

```markdown
This is the included content
```

When the document is generated using `main.md` as main entry point, the following markdown will be merged:
```markdown
# Title
This is the included content
```

#### Include paths
The pathds for the include file are relative to the containing markdown file.

### Formulas
Thanks to [bradhowes/remarkable-katex](https://github.com/bradhowes/remarkable-katex) formulas are supported the following way:

```markdown
You can use inline formulas like this $c = \pm\sqrt{a^2 + b^2}$

$$
f(x) = \int_{-\infty}^\infty\hat f(\xi)\,e^{2 \pi i \xi x}\,d\xi
$$
```