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
                    ul#top {
                        font-size: 22pt;
                        font-weight: bold;

                        padding-left: 0em;
                    }

                    ul#top ul {
                        font-size: 10pt;
                    }

                    ul#top ul {
                        padding-left: 0em;
                    }

                    ul#top ul ul {
                        padding-left: 1em;
                    }

                    ul#top > li > div {
                        margin-top: 18pt;
                        margin-bottom: 6pt;
                    }

                    ul#top ul ul ul ul {
                        display: none;
                    }

                    li {
                        list-style: none;
                    }

                    /* LINK */
                    div {
                        border-bottom: 1px dashed black;
                    }

                    a {
                        text-decoration:none; 
                        color: black;
                    }

                    span {
                        float: right;
                    }

                    /* NUMBERING */
                    ul#top > li { counter-reset: h2; }
                    ul#top > li > ul > li { counter-reset: h3; }
                    ul#top > li > ul > li > ul > li { counter-reset: h4; }

                    ul#top > li > ul > li > div > a:before { counter-increment: h2; content: counter(h2) ". "; }
                    ul#top > li > ul > li > ul > li > div > a:before { counter-increment: h3; content: counter(h2) "." counter(h3) ". "; }
                    ul#top > li > ul > li > ul > li > ul > li > div > a:before { counter-increment: h4; content: counter(h2) "." counter(h3) "." counter(h4) ". "; }
                </style>
            </head>
            <body>
                <div class="h1">Table of Contents</div>
                <ul id="top"><xsl:apply-templates select="outline:item/outline:item"/></ul>
            </body>
        </html>
    </xsl:template>
    <xsl:template match="outline:item">
        <li>
            <xsl:if test="@title!=''">
                <div>
                    <a>
                        <xsl:if test="@link">
                            <xsl:attribute name="href"><xsl:value-of select="@link"/></xsl:attribute>
                        </xsl:if>
                        <xsl:if test="@backLink">
                            <xsl:attribute name="name"><xsl:value-of select="@backLink"/></xsl:attribute>
                        </xsl:if>
                        <xsl:value-of select="@title" /> 
                    </a>
                    <span> <xsl:value-of select="@page" /> </span>
                </div>
            </xsl:if>
            <ul>
                <xsl:comment>added to prevent self-closing tags in QtXmlPatterns</xsl:comment>
                <xsl:apply-templates select="outline:item"/>
            </ul>
        </li>
    </xsl:template>
</xsl:stylesheet>