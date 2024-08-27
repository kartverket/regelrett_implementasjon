# README for GitHub Actions Workflow

Dette er en beskrivelse av GitHub Actions workflow-filen som brukes for å bygge, teste og deployere
frontend-applikasjonen til SKIP. Workflowen er konfigurert til å kjøre på visse hendelser, som push og pull request, og
inneholder flere jobber som utføres sekvensielt. Her er en gjennomgang av de ulike delene av workflow-filen:

## Workflow Navn

Workflow-filen har navnet "Build and deploy frontend to SKIP". Dette navnet vises i GitHub Actions-grensesnittet og gir
en indikasjon på hva workflowen gjør.

## Triggere

Workflowen trigges av følgende hendelser:

- workflow_dispatch: Manuell utløsing av workflow.
- pull_request: Workflowen kjører på pull requests til main-grenen, med unntak av filer i backend, .sikkerhet,
  compose.yaml, og README.
- push: Workflowen kjører på push til main-grenen, med samme unntak som for pull requests.

## Miljøvariabler (env)

Miljøvariabler som brukes i workflowen:

- REGISTRY: Settes til ghcr.io (GitHub Container Registry).
- ARGO_VERSION_FILE: Filen som inneholder versjonsinformasjon for deployering.
- IMAGE_NAME: Navnet på Docker-bildet, basert på GitHub-repositoriet.

## Jobber

### Build

Denne jobben bygger og pusher Docker-bildet for frontend-applikasjonen.

Steg i jobben:

- Checkout: Henter koden fra repositoriet.
- Use Node.js: Konfigurerer Node.js versjon 22.x og cacher npm-avhengigheter basert på package-lock.json.
- Run npm install and build: Kjører npm ci for å installere avhengigheter og npm run build for å bygge prosjektet.
- Set tag: Bestemmer Docker-tag basert på branch (hovedgren får latest-tag, andre grener får prebuild-temp-tag).
- Login to Github Container Registry: Logger inn i GitHub Container Registry.
- Docker meta: Genererer metadata for Docker-bildet, inkludert tags og labels.
- Build docker and push: Bygger og pusher Docker-bildet til GitHub Container Registry.
- Set output with build values: Setter output-verdier (bilde-URL) for senere jobber.

### Pharos

Pharos er en workflow fra kartverket som kjører to scannere. Den ene scanneren, som de fleste bruker, er en
image-scanner som scanner docker-imaget etter sårbarheter i pakkeavhengigheter. Den andre scanneren er en scanner som
scanner terraform-kode.

Denne jobben kjører Pharos-verktøyet på Docker-bildet for å sjekke sikkerheten.

Steg i jobben:

- Run Pharos: Kjører Pharos på Docker-bildet som ble bygget i forrige jobb.

### Deploy

Denne jobben deployer frontend-applikasjonen til SKIP, men kun hvis det er en push til main-grenen.

SKIP er hosting-plattformen til Kartverket

Steg i jobben:

- Checkout apps-repo: Henter koden fra skvis-apps-repositoriet.
- Update version: Oppdaterer versjonsfilen med den nye Docker-bilde-URL-en og pusher endringen.

## Oppsummering

Denne workflowen er designet for å automatisere bygging, testing, og deployering av frontend-applikasjonen til SKIP. Den
håndterer bygging av Docker-bildet, sikkerhetssjekk med Pharos, og deployering til produksjonsmiljøet. Workflowen sørger
for at kun endringer i main-grenen som består alle trinnene, blir deployert. Eventuelle feilsteg underveis vil forhindre
at nye versjoner blir tatt i bruk.

### Kontakt

Hvis noe er oklart spør noen på teamet eller ta kontakt med:

- Lars Sørensen
