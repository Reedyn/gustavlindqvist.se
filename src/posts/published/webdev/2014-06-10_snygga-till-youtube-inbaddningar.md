---
title: "Snygga till YouTube-inbäddningar"
description: "Att bädda in YouTube-filmer i sina bloggar, kampanjer och allt däremellan är något många gör. Det är dock inte många som använder och…"
date: 2014-06-10
tags: webdev
permalink: "/{{ page.date | dateFolder}}/snygga-till-youtube-inbaddningar/index.html"  
---

Att bädda in YouTube-filmer i sina bloggar, kampanjer och allt däremellan är något många gör. Det är dock inte många som använder och förmodligen ännu färre som vet om hur man använder alla inställningar och konfigurationer för att få det till att se så snyggt ut som möjligt.

Jag använder två metoder för att se till att mina inbäddningar ser ut så bra de kan på alla enheter. Den första är YouTubes Embed API som använder en _query string_.

Nedan har jag kod jag fick från YouTube för att bädda in en av mina filmer

```html
<iframe width="640" 
        height="360" 
        src="//www.youtube.com/embed/ta-AhNo470g" 
        frameborder="0" 
        allowfullscreen>
</iframe>
```

Det som vi är intresserade av är `src` värdet. I slutet av URIn ska vi lägga till 4 parametrar som ändrar utseendet.

*   Ta bort kontrollerna när filmen inte spelas upp `controls=2` _(Innan man trycker på filmen kommer endast en stor play-knapp visas)_
*   Ta bort titeln som visas i toppen av klippet `showinfo=0`
*   Ändra till YouTubes ljusa tema `theme=light`
*   Ändra till vit färg på progressionsindikatorn `color=white`

För att börja en _query string_ skriver man `?` följt av sin parameter och eventuellt värde. Mellan parametrar skriver man ett `&`. Slutligen får vi följande kod:

```html
<iframe 
        width="640"
        height="360"
        src="//www.youtube.com/embed/ta-AhNo470g?controls=2&showinfo=0&theme=light&color=white"
        frameborder="0"
        allowfullscreen>
</iframe>
```

Det finns ett problem till som YouTubes inbäddningskod ej klarar av att lösa på egen hand, och det är alla olika skärmstorlekar. Vi vill att filmens storlek anpassas utifrån fönstrets storlek. För att göra detta använder jag ett JavaScript-plugin som heter [FitVids.js](http://fitvidsjs.com/).

Så här blir slutrestultatet. Denna metod fungerar för alla inbäddningar för YouTube (även spellistor och liknande)

<figure class="kg-card kg-embed-card"> <iframe width="612" height="344" src="https://www.youtube.com/embed/ta-AhNo470g?feature=oembed" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</figure>
