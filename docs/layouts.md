# Layouts
`markdown-document` uses layouts for pdf generation. This chapter shows how layouts are used, how they are working and how you can create your own layout.

## Existing layouts
Currently there is only one built-in layout available:
- [document](layouts/document.md): Document with cover page, TOC, document information page, header and footers

## How are documents generated?
During document generation, the following steps are being made:
1. Options are preprocessed (fallbacks applied, checked)
2. Markdown file is rendered as `HTML` using [jonschlinkert/remarkable](https://github.com/jonschlinkert/remarkable)
3. Every layout part is processed using [wycats/handlebars.js](https://github.com/wycats/handlebars.js/)
4. `PDF` document is generated using [wkhtmltopdf](https://wkhtmltopdf.org/)
5. `PDF` metadata is written using [ExifTool](https://www.sno.phy.queensu.ca/~phil/exiftool/)

## Create a custom layout
The best way to create a new layout is when you copy an existing one. All built-in layouts can be found inside `markdown-document/layouts`.

## Parts of the layout
The main configuration file of a layout is the `options.json` file. This file consists of general layout page settings like paper size, orientation, margins and the definition of each part of the layout.

### Part header & footer
With these two parts you can define how the header and footer should appear. The relevant data is passed through `GET` parameters.

The following parameters are available:
- **frompage**
- **topage**
- **page**
- **webpage**
- **section**
- **subsection**
- **subsubsection**

**Configuration**:
```json
"header": {
    "html": "header.html",
    "spacing": 10,
    "data": { ... }
},
"footer": {
    "html": "footer.html",
    "spacing": 10,
    "data": { ... }
}
```

### Part cover
The cover is the first part of the document. It is basically the same as every *content* part.

**Configuration**:
```json
"parts": {
    "cover": {
        "type": "cover",
        "html": "cover.html",
        "data": { ... }
    },
    ...
}
```

### Part toc
The `toc` part is for generating a table of contents. This is done using a `xslt` transformation.

**Configuration**:
```json
"parts": {
    ...,
    "toc": {
        "type": "toc",
        "xslStyleSheet": "toc.xslt",
        "data": { ... }
    },
    ...
}
```

### Part content
A `content` part is the only part you can define multiple times.

**Configuration**:
```json
"parts": {
    ...,
    "info": {
        "type": "content",
        "html": "info.html",
        "data": { ... }
    },
    ...,
    "content": {
        "type": "content",
        "html": "content.html",
        "data": { ... }
    }
    ...
}
```

## Templating engine
Every part of an template (all `html` and `xslt` files) is processed using [wycats/handlebars.js](https://github.com/wycats/handlebars.js/).

The following data object is passed to every part:
```json
{
    "layoutPath": "file:///path/to/layout/",
    // The markdown content as html. Use {{{markdown}}} inside the layout
    "markdown": "<h1>Title</h1>...",
    // The document information defined inside the document options
    "document": { ... },
    "env": {
        "inputFile": "document.md",
        "outputFile": "document.pdf"
    },
    // The data of the current part
    "data": { ... },
    // Metadata provided during markdown processing
    "meta": {
        // Caption data provided by CaptionHelper
        "captions": {
            "table": [
                { "index": 1, "link": "table-1", "title": "Table title" },
                ...
            ],
            ...
        }
    }
}
```

### External files
External files like `CSS` / `JavaScript` / Images must be linked using absolute `file:///` links. You can use the `{{layoutPath}}` templating variable to link to these files.

If you want to use external files from other node packages, you should use the `resolve` helper.

### Resolve helper
The `resolve` helper resolves the path to a file of other node packages.

The following snippet shows how the file `styles/github.css` of the node package `highlight.js` can be resolved:

```html
<link rel="stylesheet" href="{{resolve 'highlight.js' file='styles/github.css'}}" media="all" />
```

### Translations
Templates can be translated using [i18next](https://www.i18next.com/). This can be useful if you want to translate the text 'Page x of y' or 'Table of contents' into different languages.

#### Translation files
Translation files must be placed inside the `i18n` subfolder of the layout. The name pattern for these files are: `$language$.json` (eg. `en.json` for english translations) and the content looks like:
```json
{
    "TOC": "Table of Contents",
    "Copyright": "Copyright",
    ...
}
```

#### Templating syntax
The following syntax can be used:
- `{{i18n 'title'}}` will lookup a translation named `title`
- `{{i18n 'pageOf' current=currentPage max=maxPages}}` replaces the parameters `current` and `max` of the translation `pageOf`. Example translation: `"Page {{current}} of {{max}}"`

Additional features can be found on the [i18next](https://www.i18next.com/) website.

### Concat helper
This helper concats strings (constants or variables):

```html
{{concat 'a' 'b' 'c'}}
```

### IsEmpty helper
Checks if a value is null or empty (including objects and arrays).

Usage:
```html
{{#if (isEmpty data)}}
    Data is null / empty array / empty object
{{/if}}`
```

### LookupHelper
Returns the property of an object by passing it's name (by literal or variable).

#### Example
Using the following data:
```json
{
    "users": ["john", "david"],
    "data": {
        "john": [1, 2, 3],
        "david": [4, 5, 6]
    }
}
```

The helper can be used like this:
```html
{{#each users as |user|}}
    {{user}}:
    {{#each (lookup ../data user) as |number|}}
        {{number}},
    {{/each}}
{{/each}}
```

The result will look something like this (whitespaces ignored):
```
john:1,2,3,
david:4,5,6,
```