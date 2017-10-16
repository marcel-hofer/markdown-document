# Command line usage
The simplest way to use `markdown-document` using command line:
```
yarn markdown-document generate
```

`markdown-document` uses [yargs](https://github.com/yargs/yargs) for it's command line usage. You can show the list of commands using the following command:
```
yarn markdown-document --help
```

For an overview of all options of the `generate` command (including default values):
```
yarn markdown-document generate --help
```

## Development
You can use the current build version as cli like this:
```
yarn run cli -- --in=samples/simple.md --temp=tmp --out=my-dcoument.pdf
```