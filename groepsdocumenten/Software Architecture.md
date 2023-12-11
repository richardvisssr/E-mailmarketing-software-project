# Software Architecture

Hieronder vind je de software architecture van onze applicatie. De software architecture bestaat uit een component diagram en een container diagram. In het component diagram wordt de structuur van de applicatie weergegeven. In het container diagram wordt de architectuur van de applicatie weergegeven. De componenten en containers worden hieronder uitgelegd.

## Container diagram
<div>
  <img width="388" alt="container diagram" src="https://github.com/HANICA-DWA/project-sep23-nyala/assets/89418218/53616752-6862-450c-8a92-59b1e6e559c4">
  <hr>
  <p>
  Het diagram hierboven toont de aanwezige containers binnen onze applicatie en de aanwezige gebruikers die we voor deze applicatie hebben gevonden. We hebben een gebruiker en subscriber die via HTTP verbinding maken met de webapplicatie die op zijn beurt via HTTP communiceert met de externe email editor die gebruikt wordt. Het process van de webapplicatie wordt hier op het hoogste niveau weergegeven.
  
  <b>Dit diagram bestaat uit drie containers die hier onder uitgelegd worden.</b>
  
  Allereerst heb je de webapplicatie, deze draait met React en Next.js en is verantwoordelijk voor het renderen van de pagina's en het afhandelen van de requests. De webapplicatie communiceert met de email editor via een HTTP verbinding. De email editor is een externe applicatie die gebruikt wordt om de email templates te maken. De email editor wordt op de webpagina geladen d.m.v. een Iframe en communiceerd met de webapplicatie via een HTTP verbinding. De webapplicatie communiceert vervolgens ook met de webserver en stuurt alle gegevens door naar de webserver. 
  
  De webserver is verantwoordelijk voor het opslaan van de gegevens in de database en het ophalen van de gegevens uit de database. De webserver draait op Node.js en Express en communiceert met de MongoDB database via een HTTP verbinding. 

  De MongoDB database is verantwoordelijk voor het opslaan van de gegevens die de webserver doorstuurt. De MongoDB database draait op MongoDB.

  Dit is de basis van onze applicatie. De webapplicatie is verantwoordelijk voor het renderen van de pagina's en het afhandelen van de requests. De webserver is verantwoordelijk voor het opslaan van de gegevens in de database en het ophalen van de gegevens uit de database. De MongoDB database is verantwoordelijk voor het opslaan van de gegevens die de webserver doorstuurt.

  </p>
</div>

## Component diagram

<div>
  <img width="437" alt="component diagram" src="https://github.com/HANICA-DWA/project-sep23-nyala/assets/89418218/3cba54a0-2477-4a0a-b03f-95146605fc2e">
  <hr>

  <p>
  Het diagram hierboven toont alle componenten die aanwezig zijn binnen onze applicatie. De componenten zijn hieronder uitgelegd.

  <b>Dit diagram bestaat uit meerdere componenten die hier onder uitgelegd worden.</b>

  Om te beginnen maken we onderscheid tussen de componenten voor de subscriber en de componenten voor de gebruiker (Xtend). Voor de subscriber bestaat het component Unsubscribe via deze component kan de subscriber zich uitschrijven voor bepaalde emails. 

  De gebruiker (Xtend) heeft meer componenten, om te beginnen bij de Admin Panel. Via de admin panel heeft de gebruiker toegang tot alle andere componenten die nodig zijn om de applicatie te gebruiken. De gebruiker kan naar de Calender gaan om geplande emails in te zien en waar nodig aan te passen. Ook kan hij naar de Subscribers component gaan om een overzicht te zien van alle subscribers en waar nodig aan te passen. De gebruiker kan ook naar de Email component gaan om een overzicht te zien van alle maillijsten en de subscribers die zich hebben aangemeld voor die lijst. 

  Voor de rest hebben we ook de Layout component, deze word hergebruikt voor iedere pagina en is verantwoordelijk voor de header en footer. Ook is er een alert component die gebruikt wordt om de gebruiker te informeren over bepaalde acties. Zodat we niet voor iedere pagina een eigen alert te hoeven maken, op deze manier kunnen we de code schoon houden.
  </p>
</div>
