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
yarn run cli -- --in=samples/simple.md --temp=tmp --out=my-document.pdf
```

## Adjust log output
The command `generate` has the option `--log-level`, which enables you to adjust the output log level according to your needs. The following log levels are available:
* error
*  warn
*  info 
*  verbose
*  debug
*  silly
> Note: The log level of npm are used. For further information, consult [wintsonjs documentation](https://github.com/winstonjs/winston#logging-levels) (used logging framework).


*Usage:*
```
yarn run markdown-document generate --log-level debug
```

*Usage during development:*
```
yarn run cli generate --log-level debug
```
