# Layout "document"
This layout consists of the following parts:
- Cover page
- TOC
- Document information page (see below)
- Header and footers
- Different listings (tables, images, formulas, ...)

## Document information
The following information is used by the layout:

```json
{
    ...,
    "document": {
        "title": "My awesome title",
        "subject": "An awesome subject",
        "date": "2017-09-22",
        "authors": ["John Doe", "David Miller"],
        "keywords": ["markdown", "document", "pdf"],
        "data": {
            "location": "Current Location",

            "version": "1.2",
            "classification": "Not Classified",
            "state": "Final",
            "distribution": ["Project Members", "John Doe", "someone@example.com"],

            // Changelog of the document (optional)
            "history": [
                { "version": "0.1", "date": "2017-01-01", "author": "John Doe", "comment": "Document created" },
                { "version": "1.0", "date": "2017-03-15", "author": "John Doe", "comment": "Finished document" },
                { "version": "1.1", "date": "2017-09-22", "author": "James Smith", "comment": "Added section 2" },
            ],

            // References to other documents / pages (optional)
            "references": [
                { "title": "Requirements v2.pdf", "date": "2016-10-30", "author": "Jane Smith" }
            ],

            // Used abbreviations (optional)
            "abbreviations": [
                { "abbreviation": "HTML", "meaning": "Hypertext Markup Language" },
                { "abbreviation": "MD", "meaning": "Shorthand for Markdown" }
            ]
        }
    }
}
```