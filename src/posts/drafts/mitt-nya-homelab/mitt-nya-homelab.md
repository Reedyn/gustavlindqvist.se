---
title: "Homelab 3.0"
description: ""
feature_image: ""
date: 2038-01-19T03:14:07+0000
tags:
  - homelab
---

2013 skaffade jag min första hemmaserver, en DS212j från Synology som jag köpte främst för att ha
ett bra ställe att lagra mina bilder. Ganska snabbt växte jag dock ur den och 2016 valde jag att
uppgradera till DS916+, också från Synology. Den hade plats för fler diskar och betydligt bättre
processor som gjorde det möjligt att drifta lite fler applikationer, särskilt via Docker.

Efter 9 år känner jag att jag vuxit ur den också. Delvis på grund av lagringsutrymmet på 4 diskar
men kanske mest på grund av operativsystemet DiskStation som visserligen är baserat på Linux men som
är ett stängt system och som inte längre får mer än säkerhetsuppdateringar.

![DS916+ i ett litet serverrack inbyggt i en hylla]()

Min nya server blir ett hemmabygge som jag själv kan uppgradera och utöka över tid. Jag kommer att
basera allt på operativsystemet [Unraid](https://unraid.net/) som är perfekt för att successivt
bygga ut lagringen över tid på ett smidigt sätt och det är väldigt enkelt att drifta egna
applikationer (mest via Docker).

Mina behov har *(efter hand som jag lärt mig mer och kanske delvis ändrat min inställning till bland
annat stora techbolag och molntjänster och därför driftar fler tjänster själv)* vuxit rejält.

På grund av det har jag valt att höfta till lite grann i vilka komponenter jag valt, istället för
att köpa något som täcker mina behov idag och sen behöva uppgradera om några år.

## En jämförelse med gamla servern

|             | Garbodor (Unraid NAS)                     | Umbreon (Synology DS916+) |
|-------------|-------------------------------------------|---------------------------|
| *Processor* | Intel Core i3-13100 `4x3,4 GHz (4,5 Ghz)` | Intel Pentium N3710 `4x1,6 GHz (2,56 Ghz)` |
| *Minne*     | 32GB DDR5                                 | 8GB DDR3                  |
| *SSD* cache | 1TB (i RAID)                              | `null`                    |
| *Lagring*   | 8 diskar                                  | 4 diskar                  |
| *Ethernet*  | 2,5GbE                                    | 1 GbE                     | 

*(Ja, jag gillar att döpa alla mina enheter efter Pokémon)*

Jag beräknar att normal filåtkomst blir runt 5 gånger så snabbt eftersom jag kan använda en SSD cache istället för att läsa direkt från arrayen av spinnande metall. Den nya processorn har en högre basklocka än den gamla hade i boost och minnet är 4 gånger högre. Just minnet var nog det som kändes mest onödigt just nu, men om jag ska köra flera virtuella maskiner som jag funderat på så kan det snabbt behövas.

En tanke är att ha en VM som bara är gjord för att köra [OpenDroneMap] och då hade jag egentligen velat ha flera hundra GB i RAM. 

<div class="fleuron">🤷</div>

Det enda som jag är lite osäker på är hur energiförbrukningen blir. Beroende på vilka komponenter man kombinerar kan det vara både lätt och svårt att få ner förbrukningen. Min gamla server hade så klart sina komponenter skräddarsydda och hade därför extremt låg energiförbrukning, oftast runt 3–6 watt.

Jag hoppas att jag ska kunna få ner den så långt som möjligt. Förutsättningarna finns nog där, speciellt eftersom jag kan använda SSD cache för att kunna spinna ner hårddiskarna så ofta som möjligt. Jag kommer på grund av det inte använda mig av ZFS eller någon annan ttyp av filsystem eller RAID som spider ut data över alla diskarna. Unraid lagrar sin data på enbart en disk men har sedan en eller flera paritetsdiskar som står för redundansen i systemet.

*[VM]: virtuell maskin
*[ZFS]: Zettabyte File System, ett modernt filsystem med många nya funktioner
*[RAID]: En metod för att få flera diskar att samarbeta som en enhet för att ge redundans eller för att öka prestanda

[OpenDroneMap]: https://www.opendronemap.org/