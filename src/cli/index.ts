let yargs = require("yargs");

import { Cli } from './cli';

let cli = new Cli();

let argv = yargs
    .command("generate", "Generates an pdf from an markdown file.", (yargs: any) => {
        yargs
            .option('in', {
                default: 'document.md'
            })
            .option('out', {
                default: 'document.pdf'
            })
            .option('layout', {
                default: 'document.html'
            });
    }, (argv: any) => {
        cli.generate(argv);
    })
    .demand(1, "Please provide a valid command.")
    .argv;