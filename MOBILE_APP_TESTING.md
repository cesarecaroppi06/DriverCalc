# DriveCalc App Privata (Gratis)

Questa guida serve per usare DriveCalc come app personale su Android e iPhone senza pubblicazione su store.

## 1. Prerequisiti

- Node.js 20+ e npm
- Progetto web funzionante
- Per Android: Android Studio + Android SDK
- Per iPhone: macOS + Xcode (Apple ID gratuito)

## 2. Setup Capacitor

```bash
npm install
```

Compila il pacchetto web per mobile:

```bash
npm run mobile:web
```

## 3. Android (gratis, uso personale)

Prima inizializzazione:

```bash
npm run mobile:add:android
```

Dopo modifiche al sito:

```bash
npm run mobile:sync
```

Apri progetto Android:

```bash
npm run mobile:open:android
```

Poi in Android Studio:

- collega il telefono (USB debugging attivo)
- premi Run

Non serve Google Play Console per test privato.

## 4. iPhone (gratis, uso personale)

Prima inizializzazione:

```bash
npm run mobile:add:ios
```

Dopo modifiche al sito:

```bash
npm run mobile:sync
```

Apri progetto iOS:

```bash
npm run mobile:open:ios
```

Poi in Xcode:

- seleziona target `App`
- `Signing & Capabilities` -> scegli il tuo `Personal Team` (Apple ID gratuito)
- collega l'iPhone e premi Run

Note account Apple gratuito:

- app installabile solo sui tuoi dispositivi di test
- provisioning temporaneo (potrebbe richiedere re-build periodico)
- niente pubblicazione App Store

## 5. Workflow consigliato

Ogni volta che cambi frontend:

```bash
npm run mobile:sync
```

Poi rilancia da Android Studio/Xcode.

## 6. PWA in parallelo

La PWA rimane disponibile da browser:

- Android: Chrome -> Installa app
- iPhone: Safari -> Aggiungi a Home

Quindi puoi usare sia PWA sia wrapper nativo Capacitor.
