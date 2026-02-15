---
title: "Skolgårdskarta till Talavidskolan"
description: "Processen för hur jag ritade en ny skolgårdskarta till Talavidskolan"
feature_image: "Screenshot_2024-10-09_192711.jpg"
mastodon_id: "113278692878327347"
date: 2024-10-09T19:30:19+0200
id: /2024/10/09/skolgardskarta-till-talavidskolan/
tags:
    - orientering
    - kartor
    - jkpg
---

Orienteringsklubben (IF Hallby SOK) fick en förfrågan från gymnastiklärarna på Talavidskolan om att rita en ny orienteringskarta för deras skolgård. Nyligen byggdes en helt ny skolbyggnad där och runt halva skolgården var helt omgjord, så det behövdes verkligen en ny karta.

Den gamla kartan ritades av Jönköpings orienteringsklubb, och tanken var nog att de skulle rita den nya också; men på grund av O-ringen som kommer till stan nästa år har de fullt upp med att rita kartor för det och frågan gick vidare till vår klubb som inte är lika involverad där.

Jag har redigerat och uppdaterat kartor tidigare men aldrig ritat en från grunden. Jag tänkte att detta skulle vara ett perfekt tillfälle att träna lite på kartritningsprogrammet för orienteringskartor och samtidigt sätta mina GIS-kunskaper på prov.

Ritprogram för orienteringskartor skiljer sig lite från andra kartprogram i att man inte främst jobbar i geografiska mått där allt har en exakt representation i verkligheten (GIS) utan man jobbar direkt i slutmodellen som är gjord för tryck på papper och är i millimeter. När man ritar ut ett staket till exempel så mäts det i millimeter på pappret snarare än hur långt det är i verkligheten. Sen har programmet en inbyggd modell för att också mappa positioner och mått på kartan mot hur de skulle vara i verkligheten, en intressant mix!

## Data, data, data

Steg 1 för att börja rita en karta är att samla in data. Med utgångspunkt från en av våra tidigare kartor på området gjorde jag en snabb karta med tillräckligt mycket landmärken (som byggnader, staket m.m.) för att kunna göra vettiga anteckningar på plats.

På plats gick jag sedan runt och gjorde en nekel skisskarta ovanpå min initiala karta samtidigt som jag dokumenterade med kamera från marken (lärdom till nästa gång: _ta alltid fler bilder och med vidvinkel_).

🍃{.fleuron}

Därefter var det dags för en grej jag experimenterat med på sistone: fotogrammetri.

Med min drönare flyger jag i ett mönster från en specifik höjd med kameran i vinkel rakt ned (nadir) och tar många bilder. Drönaren har inget programmerbart läge (vilket både tidigare och nyare modeller av samma drönare har) utan jag använder mig bara av sekvensbildtagning, oftast 2 eller 3 sekunder och flyger så jämnt jag kan.

Med [OpenDroneMap] kan jag sedan använda mig av fotogrammetri[^1] för att sy ihop bilderna i en mosaik till ett ortofoto[^2] som med lite finjustering ^(georeferering)^ går att göra till ett perfekt bakgrundslager att kartlägga efter. Ofta går det bra att använda sig av Lantmäteriets flygfoton som är av samma typ. Skillnaden är att de tar sina bilder på 2 500–7 400 meters höjd och jag tog mina bilder på 40 meters höjd. Kvalitetsskillnaden på grund av det är betydande.

![Ortofoto över Talavidskolan](2024-09-08_ortofoto_talavidskolan.png "Ortofotot finns publicerad i den öppna datamängden [OpenAerialMap](https://map.openaerialmap.org/#/14.15227621793747,57.78577506174773,18/square/12003212022102000121/66dec62ccd0baa0001b61ffb)"){.-no-shadow}

I vanliga fall när man fotograferar med drönare behöver man få ett [spridningstillstånd från Lantmäteriet] för att få publicera bilderna ^(i\ skrivande\ stund\ är\ det\ en\ handläggningstid\ på\ nästan\ 3\ månader!)^, men det finns vissa undantag, till exempel det för offentliga platser _(skolgårdar utanför skoltid är offentliga platser i Jönköping)_ där man inte behöver detta tillstånd.

## Framställning av kartan

Med all data insamlad så var det sedan kartläggningen kvar. Men först måste jag sätta upp själva dokumentet. Jag använde mig av OpenOrienteering **Mapper**, som är ett fritt och öppet alternativ till OCAD som annars är branschstandardverktyget.

För dokumentet valde jag inställningarna `SWEREF99 TM` (`EPSG:3006`) för projektion; Det finns egentligen bättre, mer lokala varianter som `SWEREF99 13 30` som är mer korrekt för Jönköpings longituder, men för orienteringskartor behövs inte riktigt den precisionen. Vad jag förstått så använder alla i Sverige samma projektion, och då blir det väldigt enkelt.

Inom orientering så är det magnetiska norr som är intressant och eftersom den flyttar sig får man justera kartan regelbundet. I Jönköping just nu är den runt 5,86°, jag avrundade till 6°.

Det sista att göra innan kartläggningen började var att ladda ner aktuell symboluppsättning. Jag laddade ner senaste sprintnormen från svenska orienteringsförbundet `ISSprOM 2019-2`. I samband med att jag letade rätt på symboluppsättning så stötte jag även på [internationella orienteringsförbundets wiki](https://omapwiki.orienteering.sport/specifications/issprom/) som sedan blev ovärderlig under kartritandet för att kolla upp symboler.

🍃{.fleuron}

Själva ritandet var sen inte så komplicerat. Jag la in ortofotot från tidigare som ett bakgrundslager i programmet och sen kalkerade jag så gott jag kunde med stöd från alla bilder jag tog på marknivå.

![Orienteringssymboler på ett fkygfoto](OOMapper_Editing.jpg){.-wide}

Efter några dagars ritande och även lite dialog med idrottslärarna kring hur deras behov såg ut var jag ganska nöjd. Det som återstod var mest en kontroll på plats och lite finjustering kring detaljer som jag hade dålig dokumentation kring (särskilt träden uppe vid vägen till vänster i bilden eftersom de helt täcks på flygfoton av löven i trädkronorna).

OpenOrienteering Mapper finns som en app för Android som kom väl till pass. Istället för att skriva ut en pappersversion laddade jag upp kartan på surfplattan och tog med mig den när jag gick runt. På det viset kunde jag göra redigeringar direkt på plats också.

![En bild på en surfplatta med en orienteringskarta på och miljön som kartan föreställer i bakgrunden](20240913_190133.jpg)

Sen var kartan färdigritad!

![Hela den färdiga orienteringskartan](karta.png "Den färdiga kartan"){.-wide .-no-shadow}

Helt klar var jag dock inte. I vanliga fall stannar vi här eftersom våra egna klubbkartor alltid öppnas i ett banläggningsprogram där vi kan lägga till teckenförklaring, rubrik m.m. Jag valde istället att göra allt detta direkt i Mapper.

Här är det färdiga dokumentet som vi sen skickade till skolan. Jag la till lite extra information för framtida kartritare som exakt vilken standard den gällde, när den ritades och deklinationen. Den är gjord för att skrivas ut på vanliga A4-ark.

![En skolgårdskartan för orientering över Talavidskolan i A4-format](Talavidskolan_OL_Hallby_2024-09.jpg){.-not-rounded}

*[GIS]: Geografiska informationssystem

[^1]: Fotogrammetri är en process som tar flera bilder från olika perspektiv för att göra en 3D-modell av ett föremål eller en plats (samma process som gör att vi kan ha djupseende med två ögon).

[^2]: Ortofoto är en bild med ortografisk projektion där alla objekt projiceras utifrån en tänkt mittpunkt, rakt uppifrån varje enskilt objekt, liknande hur man skulle rita en karta.

[OpenDroneMap]: https://www.opendronemap.org/
[spridningstillstånd från Lantmäteriet]: https://www.lantmateriet.se/sv/spridningstillstand/
