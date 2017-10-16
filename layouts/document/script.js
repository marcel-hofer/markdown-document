/* HEADER / FOOTER */
function applyVariables() {
    var vars = loadVariables();

    var x = ['frompage', 'topage', 'page', 'webpage', 'section', 'subsection', 'subsubsection'];
    
    for (var i in x) {
        var y = document.getElementsByClassName(x[i]);
        for (var j = 0; j < y.length; ++j) {
            y[j].textContent = vars[x[i]];
        };
    }
}

function hideIfFirstPage(className) {
    var vars = loadVariables();

    if (vars.page == '1') {
        var element = document.getElementsByClassName(className);
        element[0].style.display = 'none';
        return;
    }
}

function loadVariables() {
    var vars = { };
    var x = window.location.search.substring(1).split('&');
    for (var i in x) {
        var z = x[i].split('=',2);
        vars[z[0]] = unescape(z[1]);
    }

    return vars;
}

/* CONTENT */
function contentLoad() {
    adjustParagraphsAfterFirstHeadings();
    addHighlightJsToCodeElements();
}

// Add class names to h1 and comment for the part headings (does not work with pure CSS)
function adjustParagraphsAfterFirstHeadings() {
    $('h1').each(function() {
        var element = $(this);
        var firstP = element.next();
        
        if (firstP.length > 0 && firstP.prop('tagName') == 'P') {
            firstP.addClass('h1-comment');
        } else {
            element.addClass('no-comment');
        }
    });
}

function addHighlightJsToCodeElements() {
    $('code').addClass('hljs');
}