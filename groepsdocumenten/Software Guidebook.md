# Termen en karakterisering

| Term              | Uitleg                                                                           |
|-------------------|----------------------------------------------------------------------------------|
| Mail Editor       | Het gedeelte van de applicatie waar gebruikers e-mailsjablonen kunnen maken en opslaan.|
| Mail Lijsten      | Verzamelingen van e-mailadressen die geabonneerd zijn op specifieke onderwerpen of categorieën.|
| Templates         | Opgeslagen e-mailsjablonen die worden opgelsagen met een titel en kunnen worden bewerkt.|
| Geplande Emails   | E-mails die door de gebruiker zijn ingepland om op een later tijdstip te worden verstuurd.|
| Gebruiker         | Xtend beheerder die de applicatie gebruiken en beheren, inclusief het maken en versturen van e-mails.|
| Subscribers       | Personen die geabonneerd zijn op maillijsten, zich hebben aangemeld en e-mails ontvangen die door de gebruiker zijn verstuurd.|


# Context


Deze softwareopdracht betreft de ontwikkeling van een mailservice waarmee e-mailtemplates kunnen worden gemaakt en opgeslagen. Het hoofddoel is het versturen van deze templates naar subscribers die zich hebben ingeschreven voor specifieke maillijsten. De maillijsten moeten worden gekoppeld aan de subscribers, zodat automatisch de juiste e-mails naar de relevante doelgroep worden verzonden.

Gebruikers van dit product moeten in staat zijn eenvoudig e-mailtemplates te maken en op te slaan met behulp van een geïntegreerde e-maileditor. Bovendien moeten ze de mogelijkheid hebben om e-mails vooruit te plannen, zodat campagnes op een gepland tijdstip kunnen worden gelanceerd. Het overzicht van alle subscribers en maillijsten is cruciaal, aangezien gebruikers individuele aanpassingen willen maken en handmatig subscribers willen toevoegen.

Daarnaast is er behoefte aan een analysepaneel waarmee gebruikers de prestaties van hun e-mailcampagnes kunnen evalueren en verbeteringen kunnen identificeren. Deze analysetool moet inzichten bieden in zaken als open rates, klikfrequenties en andere relevante statistieken.

Tot slot moeten subscribers in staat zijn zich aan of af te melden voor maillijsten via een specifieke link, waardoor het beheer van de subscribers gestroomlijnd wordt.

Deze software zal worden gebruikt door Xtend gebruikers die verantwoordelijk zijn voor het opzetten en beheren van e-mailcampagnes binnen hun organisaties. Het is een vernieuwd marketingproces en systeem voor een efficiëntere uitvoering van e-mailmarketingactiviteiten.

## context diagram

<img width="424" alt="image" src="https://github.com/HANICA-DWA/project-sep23-nyala/assets/93944422/d6049e6e-a241-443f-8c4f-500627934420">
</br>
</br>
Een contextdiagram biedt in één oogopslag een overzicht van hoe de applicatie wordt gebruikt en door welke personen. 

Hier wordt duidelijk dat er twee belanghebbenden zijn in de applicatie. De gebruiker fungeert als beheerder en heeft de bevoegdheid voor CRUD-acties. Aan de andere kant maakt de subscriber beperkt gebruik van de applicatie, alleen wanneer hij zich wil aan- of afmelden. Onze applicatie maakt gebruik van een extern systeem voor het bewerken van e-mails.




