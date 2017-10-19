# markdown-document
Converts markdown files to PDF documents using HTML templates.

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

## Getting started
1. Install `markdown-document` using the following command:
```
yarn add markdown-document --save
```

2. Create your document
```
echo # My first markdown-document > document.md
```

3. (Optional) configure document properties using `document.json`
4. Build PDF file:
```
yarn markdown-document generate
```

## Documentation
See the [docs](docs) directory for detailed documentation.
- [Command line usage](docs/command-line.md)
- [Library usage](docs/library.md)
- [Writing documents](docs/documents.md)
- [Layouts](docs/layouts.md)

## License
[MIT](https://github.com/marcel-hofer/markdown-document/blob/master/LICENSE)

[npm-image]: https://img.shields.io/npm/v/markdown-document.svg
[npm-url]: https://npmjs.org/package/markdown-document
[downloads-image]: https://img.shields.io/npm/dm/markdown-document.svg
[downloads-url]: https://npmjs.org/package/markdown-document