# Regelrett frontend

Velkommen til Regelrett-prosjektet bygget med React, Vite og TypeScript. Denne README-en vil veilede deg gjennom
oppsett, utvikling og vedlikehold av prosjektet.
Følg stegene nedenfor for å komme i gang og bruk de tilgjengelige skriptene for å administrere prosjektet effektivt.

## Innholdsfortegnelse

- [Forutsetninger](#forutsetninger)
- [Kom i Gang](#kom-i-gang)
- [Linting og Formatering](#linting-og-formatering)
- [Bygge for Produksjon](#bygge-for-produksjon)
- [Forhåndsvisning av Bygget](#forhåndsvisning-av-bygget)
- [Pre-commit Hooks](#pre-commit-hooks)
- [Nettverksforespørsler med TanStack Query](#nettverksforesporsler)

## Forutsetninger

Før du begynner, sørg for at du har følgende installert:

- **[Node.js](https://nodejs.org)** (versjon 14.x eller nyere)
- **[npm](https://www.npmjs.com/get-npm)** eller **yarn**

## Kom i Gang

Følg disse stegene for å sette opp prosjektet lokalt:

1. **Klon repositoriet**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>/frontend/beCompliant
   ```

2. **Installer avhengigheter:**:
    ```bash
   npm install
   ```
   eller
    ```bash
   yarn install
   ```

3. **Forbered Husky (hvis aktuelt):**
    ```bash
   npm run prepare
   ```

4. **Start utviklingsserveren:**
    ```bash
   npm run dev
   ```

Dette vil starte Vite utviklingsserveren, og du kan se appen på http://localhost:3000.

## Linting og Formatering

### Linting

For å sikre kodekvalitet, kjør lint-verktøyet:

```bash
npm run lint
```

For å automatisk fikse lintingproblemer:

```bash
npm run lint-fix
```

`

### Formatering

For å formatere kodebasen med Prettier:

```bash
npm run format
```

Dette vil formatere alle filer i src-mappen

## Bygge for Produksjon

For å lage en produksjonsklar versjon av prosjektet:

```bash
npm run build
```

`
Dette vil kompilere TypeScript-filene og pakke applikasjonen ved hjelp av Vite. Output vil bli plassert i dist-mappen,
klar for utrulling.

## Forhåndsvisning av Bygget

Før du ruller ut, kan du forhåndsvise produksjonsbygget lokalt:

```bash
npm run preview
```

`
Denne kommandoen vil servere produksjonsbygget på en lokal server, slik at du kan verifisere at alt fungerer som
forventet.

## Pre-commit Hooks

Husky er konfigurert til å kjøre visse skript før commits blir fullført. Dette inkluderer linting og TypeScript-sjekker
for å sikre kodekvalitet og konsistens.

For å manuelt utløse disse sjekkene, kan du kjøre:

```bash
npm run pre-commit
```

Dette vil kjøre lint-staged for å sjekke de stage’ede filene og sikre at TypeScript-filene er feilfrie før de blir
committet.

<h2 id="nettverksforesporsler">Nettverksforespørsler med TanStack Query</h2>

Dette prosjektet bruker TanStack Query (tidligere kjent som React Query) for å håndtere nettverksforespørsler og
servertilstand. TanStack Query forenkler datainnhenting, caching, synkronisering og oppdatering av servertilstand i
React-applikasjoner. Ved å bruke dette kraftige biblioteket sikrer prosjektet effektiv og pålitelig datahåndtering,
minimerer unødvendige nettverksforespørsler, og gir en optimal brukeropplevelse med automatiske bakgrunnsoppdateringer
og feilhåndtering.

Se documentationen for Tanstack Query her https://tanstack.com/query/latest

# Bygg og deployment

For mer dokumentation om [Build and deployment](./docs/build-and-deployment.md)
