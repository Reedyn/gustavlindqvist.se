<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom">
    <xsl:output method="html" version="1.0" encoding="utf-8" indent="yes"/>
    <xsl:template match="/">
        <html lang="sv">
        <head>
            <meta http-equiv="x-ua-compatible" content="IE=edge,chrome=1"/>
            <meta charset="utf-8"/>
            <title><xsl:value-of select="atom:feed/atom:title"/></title>
            <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
            <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"/>
            <link rel="stylesheet"
                  href="/assets/css/gustavlindqvist.css"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>

            <link rel="canonical"><xsl:attribute name="href"><xsl:value-of select="atom:link/@href"/></xsl:attribute></link>
        </head>
        <body>
        <header class="site-header hidden@print" aria-label="Sidhuvud">
            <div class="site-header__content">
                <span class="site__title"><a href="https://gustavlindqvist.se"><img src="/assets/images/blog-profilepic.jpg"
                                                                            class="site__image"
                                                                            alt="Selfie på Gustav Lindqvist" width="30"
                                                                            height="30"/>Gustav Lindqvist</a></span>
            </div>
        </header>
        <main class="main" aria-label="Innehåll">
            <article class="page">
                <header id="page-header" class="page-header">
                    <div class="page-metadata">
                        <h1 class="page-title"><xsl:value-of select="atom:feed/atom:title"/></h1>
                    </div>
                </header>
                <section class="feed content">
                    <p>Detta är ett webbflöde som du kan följa genom att klistra in <a><xsl:attribute name="href"><xsl:value-of select="atom:feed/atom:link/@href"/></xsl:attribute>länken</a> i en <a href="https://alternativeto.net/category/books--news/rss-feed-reader/">RSS-läsare</a>.</p>
                    <p><a><xsl:attribute name="href"><xsl:value-of select="atom:feed/atom:link/@href"/></xsl:attribute><xsl:value-of select="atom:feed/atom:link/@href"/></a></p>
                    <p>Du kan även följa något av mina andra flöden om du bara är intresserad av delar av det jag skriver:</p>
                    <ul>

                            <li><a href="/friluftsliv/feed.xml">Flöde för friluftsliv</a></li>

                            <li><a href="/fotografering/feed.xml">Flöde för fotografering</a></li>

                            <li><a href="/cykling/feed.xml">Flöde för cykling</a></li>

                            <li><a href="/lopning/feed.xml">Flöde för löpning</a></li>

                            <li><a href="/olbryggning/feed.xml">Flöde för ölbryggning</a></li>

                            <li><a href="/kartor/feed.xml">Flöde för kartor</a></li>

                            <li><a href="/resor/feed.xml">Flöde för resor</a></li>
                    </ul>
                    <p>Andra flöden:</p>
                    <ul>
                        <li><a href="/lanktips.xml">Flöde för mina länktips</a></li>
                    </ul>
                    <h2>Inlägg i flödet</h2>
                    <ul class="post-list">
                    <xsl:for-each select="atom:feed/atom:entry">
                            <li class="post-list__item">
                                <a class="post-title post-link">
                                    <xsl:attribute name="href">
                                        <xsl:value-of select="atom:link/@href"/>
                                    </xsl:attribute>
                                    <xsl:value-of select="atom:title"/>
                                </a>
                                <p class="post-date">
                                    <time>
                                        <xsl:attribute name="datetime">
                                            <xsl:value-of select="atom:updated"/>
                                        </xsl:attribute>
                                        <xsl:value-of select="atom:updated"/>
                                    </time>
                                </p>
                            </li>
                    </xsl:for-each>

                    </ul>
                </section>
            </article>
        </main>
        </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
