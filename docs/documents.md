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
    // Define the layout to use
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