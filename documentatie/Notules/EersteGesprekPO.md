# Notules 06/11/2023

## Aanwezigen

> - Robert Boudewijn, r.boudewijn@svextend.nl, PO
> - Jules Koster, groepslid
> - Richard Visser, groepslid
> - Mark Evers, groepslid
> - Matthias Budding, groepslid, Notulist

> groepslid = projectgroep-nyala@hotmail.com

## Algemene informaties

Applicatie, met vanuit QR of link jezelf toevoegen aan media lijst.. Email editor waarmee we emails kunnen opstellen en inplannen om naar een bepaalde media lijst te sturen.. Beetje idee als nieuwsbrief, subsribers moeten worden opgeslagen en kunnen zelf unsubscribe.. Automatisch mail versturen naar subs op basis van kalender via api kopeling. Met een get/post te zeggen stuur nu mail en eventueel online mails kunnen bekijken dmv knop om t online te zien. Ook willen we rapportages zoals welke komen aan en wat wordt meeste bekeken en meeste gebruikt en door wie of wat.. Zodat t duidelijk is wat aanspreekt en wat niet, hiermee kan worden bijgehouden

Een admin die alles kan beheren, admin panel, interface voor editor mails.. Het is te vergelijken met mailchamp

Mailchamp kunnen we zeker gebruiken voor eventuele inspiraties en eventueel wanneer we extra dingen zien de heel zeker delen zodat we eventuel extra kunnen doen.. WIL is niet WET

## Prototype of niet

Hetgene wat we leveren moet bruikbaar zijn maar zolang het niet afhankelijk is van delen die er niet zijn.. Zodat er een eventuele demo gegeven kan worden met de main dingen...

> Prio:
>
> - Mails maken opslaan template
> - Subs, hand of link
> - Versturen en Unsub
> - Automatisch versturen op basis van kalender
> - Api koppeling

Wat betreft admin, authenticatie moet er wel zijn, het wachtwoord moet kunnen worden aangepast. Dit hoeft niet met een mail... Admin is alleen voor PO en dus niet voor de gebruikers beschikbaar, inschrijven moet vanaf buiten kunnen maar niet via admin. wanneer we op de site komen direct op de inlog pagina...

## Technische constrains

Handmatig smtp handler maken, onderzoekje naar dit doen... Na oplevering,met docker compose up alles werkend hebben... Dit hoeft wel alleen wanneer docent akkoord is..

## Nieuwe mail contact

r.boudewijn@svextend.nl

## Bestaande evntuele dingen

Alles is vrij in te vullen zolang t maar mooi is, liever geen jaren 90.. Als het nodig is kunnen we toegang krijgen tot extend brandbook

## Beveiliging

Niks met AVG, heel fijn geen mogelijkheid met toegang tot database buiten de applicatie, via docker is dat te doen met het gebruiken verschillende poorten.. Geen connectie van buitenaf mogelijk

Encryptie met mails heeft minder prioriteit. Dit moet ons proces niet verslomen

## Email serviceses

No budget, als we server nodig hebben dan contact opnemen... smtp gegevens met contact met server vanuit extend

## Visueel

Maak het mooi en profesioneel, voor de rest geen vereisten
Desktop.. Niet naar de tering op telefoon alleen bruikbaar niet gewoon mooi.

## Belangrijk

Websockets zijn belangrijk, dit moet aanwezig zijn
