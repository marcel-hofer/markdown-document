let yargs = require("yargs");

import {Cli} from './cli';

let cli = new Cli();

/**
 * CLI Commands.
 */
let argv = yargs//.usage("$0 command")
    .command("generate", "Generates an pdf from an markdown file.", (yargs: any) => {
        yargs
            .option('in', {
                default: 'document.md'
            })
            .option('out', {
                default: 'output.pdf'
            });
    }, (argv: any) => {
        cli.generate(argv);
    })
    .demand(1, "Please provide a valid command.")
    .argv;