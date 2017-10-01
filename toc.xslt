<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:outline="http://wkhtmltopdf.org/outline"
                xmlns="http://www.w3.org/1999/xhtml">
    <xsl:output doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
                doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"
                indent="yes" />
    <xsl:template match="outline:outline">
        <html>
            <head>
                <title>Table of Contents</title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <style>
                    body {
                        font-family: "Arial Narrow";
                    }

                    div.h1 {
                        font-size: 20pt;
                        font-weight: bold;

                        border-bottom: 1px solid #8EA138;
                    }

                    /* HIERARCHY */
                    ul {
                        padding-left: 0em;
                    }

                    li.level-1 div {
                        font-size: 22pt;
                        font-weight: bold;

                        padding-left: 0em;

                        margin-top: 18pt;
                        margin-bottom: 6pt;

                        color: red;
                    }

                    li.level-1 div {
                        line-height: 30pt;
                    }

                    li.level-2 div {
                        font-size: 10pt;

                        padding-left: 0em;

                        margin-top: 0;
                        margin-bottom: 0;

                        color: blue;
                    }

                    li.level-1 div {
                        line-height: normal;
                    }

                    li.level-2 ul {
                        padding-left: 1em;
                    }

                    li.level-3 div {
                        color: green;
                    }

                    li.level-4 div {
                        color: black;
                    }

                    li.level-4 ul {
                        display: none;
                    }

                    li {
                        list-style: none;
                    }

                    /* LINK */
                    a {
                        text-decoration:none; 
                        color: black;
                    }

                    .before {
                        padding-right: 0.33em;
                        background: white;
                    }

                    .before:before{
                        float: left;
                        width: 0;
                        font-size: 6pt;
                        white-space: nowrap;
                        content: ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ";
                    }

                    .after {
                        float:right;
                        padding-left: 0.33em;
                        background: white;
                    }

                    /* NUMBERING */
                    ul#top > li { counter-reset: h2; }
                    ul#top > li > ul > li { counter-reset: h3; }
                    ul#top > li > ul > li > ul > li { counter-reset: h4; }

                    ul#top > li > ul > li > div > a:before { counter-increment: h2; content: counter(h2) ". "; }
                    ul#top > li > ul > li > ul > li > div > a:before { counter-increment: h3; content: counter(h2) "." counter(h3) ". "; }
                    ul#top > li > ul > li > ul > li > ul > li > div > a:before { counter-increment: h4; content: counter(h2) "." counter(h3) "." counter(h4) ". ";
                </style>
            </head>
            <body>
                <div class="h1">Table of Contents</div>
                <ul id="top">
                    <xsl:apply-templates select="outline:item/outline:item" />
                </ul>
            </body>
        </html>
    </xsl:template>
    <xsl:template match="outline:item">
        <li class="level-{count(ancestor::*) - 1}">
            <xsl:if test="@title!=''">
                <div>
                    <span class="before">
                        <a>
                            <xsl:if test="@link">
                                <xsl:attribute name="href"><xsl:value-of select="@link"/></xsl:attribute>
                            </xsl:if>
                            <xsl:if test="@backLink">
                                <xsl:attribute name="name"><xsl:value-of select="@backLink"/></xsl:attribute>
                            </xsl:if>
                            <xsl:value-of select="@title" /> 
                        </a>
                    </span>
                    <span class="after">
                        <xsl:value-of select="@page" />
                    </span>
                </div>
            </xsl:if>
            <ul>
                <xsl:comment>added to prevent self-closing tags in QtXmlPatterns</xsl:comment>
                <xsl:apply-templates select="outline:item" />
            </ul>
        </li>
    </xsl:template>
</xsl:stylesheet>