var system = require("system");
var fs = require('fs')
var webpage = require("webpage");

declare interface IPhantomJSPrinting {
    header: {
        height: number;
        contents(pageNum: number, numPages: number): string;
    },
    footer: {
        height: number;
        contents(pageNum: number, numPages: number): string;
    }
}
declare var PhantomJSPrinting: IPhantomJSPrinting;

var os = system.os;
var page = webpage.create();

phantom.onError = function(err, stack) {
    phantom.exit(-1);
};

var args = (function() {
    var i = 1;
    return {
        in: <string>system.args[i++],
        out: <string>system.args[i++],
        paperFormat: <string>system.args[i++],
        paperOrientation: <string>system.args[i++],
        margin: {
            top: <string>system.args[i++],
            left: <string>system.args[i++],
            bottom: <string>system.args[i++],
            right: <string>system.args[i++]
        },
        renderDelay: parseInt(system.args[i++], 10),
        loadTimeout: parseInt(system.args[i++], 10),
    };
})();

var html = fs.read(args.in);
page.setContent(html, 'http://localhost');

var paperSize = <any>{
    format: args.paperFormat,
    orientation: args.paperOrientation,
    margin: args.margin,
    header: { },
    footer: { }
};

/* check whether the loaded page overwrites the header/footer setting,
    i.e. whether a PhantomJSPriting object exists. Use that then instead
    of our defaults above.
    example:
    <html>
        <head>
        <script type="text/javascript">
            var PhantomJSPrinting = {
                header: {
                    height: "1cm",
                    contents: function(pageNum, numPages) { return pageNum + "/" + numPages; }
                },
                footer: {
                    height: "1cm",
                    contents: function(pageNum, numPages) { return pageNum + "/" + numPages; }
                }
            };
        </script>
        </head>
        <body><h1>asdfadsf</h1><p>asdfadsfycvx</p></body>
    </html>
*/
if (page.evaluate(function() { return typeof PhantomJSPrinting === "object"; })) {
    paperSize.header.height = page.evaluate(function() {
        return PhantomJSPrinting.header.height;
    });

    paperSize.header.contents = (<any>phantom).callback(function(pageNum: number, numPages: number) {
        return page.evaluate(function(pageNum: number, numPages: number) { return PhantomJSPrinting.header.contents(pageNum, numPages); }, pageNum, numPages);
    });

    paperSize.footer.height = page.evaluate(function() {
        return PhantomJSPrinting.footer.height;
    });

    paperSize.footer.contents = (<any>phantom).callback(function(pageNum: number, numPages: number) {
        return page.evaluate(function(pageNum: number, numPages: number) { return PhantomJSPrinting.footer.contents(pageNum, numPages); }, pageNum, numPages);
    });
}

page.paperSize = paperSize;

if (args.renderDelay) {
    setTimeout(render, args.renderDelay);
} else {
    var loadTimeout = setTimeout(render, args.loadTimeout);
    page.onLoadFinished = function() {
        clearTimeout(loadTimeout);
        render();
    }
}

function render() {
    page.render(args.out);
    page.close();
    phantom.exit(0)
}