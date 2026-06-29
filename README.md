# Budget Book

ADWEB eindopdracht: een realtime huishoudboekje gebouwd met Next.js 16, React 19, Firebase Auth, Firestore, Recharts en DnD Kit.

## Run

Installeer dependencies indien nodig:

```bash
npm install
```

Start daarna de development server:

```bash
npm run dev
```

Open de app bij voorkeur via [http://localhost:3000](http://localhost:3000).

## Belangrijkste features

- Registreren en inloggen via Firebase Authentication
- Meerdere huishoudboekjes aanmaken, bewerken, archiveren en herstellen
- Boekjes delen met andere gebruikers
- Transacties toevoegen, bewerken, verwijderen en filteren op maand, type en categorie
- Categorieen met budget, einddatum en visuele budgetstatus
- Drag-and-drop om transacties direct aan een categorie te koppelen
- Realtime inzichten via Firestore listeners en grafieken per boekje

## Firebase configuratie

De app verwacht een `.env.local` met deze variabelen:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Zorg er ook voor dat in Firebase Authentication de provider `Email/Password` aan staat.

## Firestore rules

Er staat een basisconfiguratie in [firestore.rules](./firestore.rules) waarmee:

- gebruikers alleen hun eigen profiel kunnen lezen/schrijven
- alleen eigenaren en deelnemers een boekje kunnen lezen
- alleen de eigenaar een boekje kan aanpassen, archiveren, herstellen of delen
- deelnemers wel transacties en categorieen binnen toegankelijke boekjes kunnen beheren

Deploy de rules met de Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

## Tests

Run unit tests:

```bash
npm test -- --runInBand
```

Run coverage:

```bash
npm run test:coverage -- --runInBand
```

Run lint:

```bash
npm run lint
```
