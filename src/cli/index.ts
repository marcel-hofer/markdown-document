let yargs = require("yargs");

import { Cli } from './cli';

let cli = new Cli();

let argv = yargs
    .command("generate", "Generates an pdf from an markdown file.", (yargs: any) => {
        yargs
            .option('in', {
                describe: 'The input markdown file',
                default: 'document.md'
            })
            .option('out', {
                describe: 'The output path for the PDF (defaults to <input>.pdf)',
                default: null
            })
            .option('layout', {
                describe: 'The layout used for rendering the PDF',
                default: 'document'
            })
            .option('log-level', {
                describe: 'Configures the log level',
                default: 'info'
            })
            .option('temp', {
                describe: 'Set the tempo output path for the generated html files (e.g. for debugging)',
                default: null
            });
    }, (argv: any) => {
        cli.generate(argv);
    })
    .demand(1, "Please provide a valid command.")
    .argv;