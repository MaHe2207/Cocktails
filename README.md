# Cocktails – Android-PWA

**Version 1.1.1 · Firebase-Synchronisierung für cocktails-fd151 (Spark)**

Eigenständige Progressive Web App ohne Build-Schritt und ohne externe JavaScript-Bibliotheken. Das App-Icon zeigt ein Martiniglas mit Olive am Zahnstocher. Die Oberfläche ist auf Android-Smartphones ausgelegt.

## Enthaltene Funktionen

- Dashboard mit Cocktail des Tages, Statistiken und zuletzt angelegten Cocktails
- Cocktails anlegen, bearbeiten, als Favoriten markieren, löschen, suchen, sortieren und filtern
- Sechs Cocktailkategorien, Glasformen, Basisspirituosen, Zubereitungsarten, Zubereitungsschritte, **sechs Geschmackswerte auf einer Skala von 1 bis 5**, Fotos und Notizen
- Lokale Entwürfe, Pflichtfeldprüfung und Speicherstatus
- Zutatenverwaltung mit zehn Kategorien, Bestandsstatus und direkten, gegenseitigen Ersatzverknüpfungen
- Zutaten- und Garniturenauswahl mit Mehrfachvorkommen, Mengen und Einheiten; vertikale Sortierung per Pfeiltasten oder Ziehgriff
- Mixbarkeitsanzeige, Mengenberechnung für 1–10 Portionen und temporäre Ersatzproduktwahl
- Eigene Cocktailkarte für Gäste: Mehrfachauswahl, Reihenfolge und öffentliche Veröffentlichung per Firebase
- Öffentlicher Link und lokal berechneter QR-Code nach Veröffentlichung
- ZIP-Datensicherung und Wiederherstellung einschließlich Fotos
- Installierbare, offlinefähige PWA mit Service Worker und lokaler IndexedDB

**Wichtig:** Ohne Anmeldung funktioniert die App lokal. Nach Einrichtung von Firebase werden private Cocktails, Zutaten, Bilder, Entwürfe und Einstellungen zwischen Geräten mit demselben Firebase-Konto synchronisiert. Die öffentlich veröffentlichte Cocktailkarte enthält weiterhin nur die bewusst ausgewählten Informationen.

## Update auf Version 1.1.0 – Firebase-Speicherung und Synchronisierung

- Private Cloud-Sicherung von Cocktails, Zutaten, Entwürfen, Fotos, Bestandsstatus, Ersatzverknüpfungen und Einstellungen über Cloud Firestore.
- Automatischer Abgleich kurz nach Änderungen, beim Öffnen der App und während die App aktiv ist; zusätzlich „Jetzt synchronisieren“ in den Einstellungen.
- Fotos werden **ohne Firebase Storage** platzsparend als in Blöcke aufgeteilte Firestore-Dokumente gespeichert. Bereits synchronisierte Bilder werden bei normalen Textänderungen nicht erneut hochgeladen.
- **Konfliktschutz:** Falls zwei Geräte unabhängig voneinander widersprüchliche Änderungen vorgenommen haben, fragt die App, ob die lokale oder die Cloud-Version gelten soll. Vor dieser Wahl ein ZIP-Backup erstellen.
- Weiterhin vollständig offlinefähige lokale Datenbank; Cloud-Fehler verändern deine lokalen Daten nicht.
- Öffentliche Cocktailkarte mit bestehendem Link-/QR-Code-System. Die Cocktailkarte wird weiterhin bewusst durch „Cocktailkarte veröffentlichen“ aktualisiert.
- Die bisherigen sechs Geschmacksprofile bleiben auf fünf Stufen; die Gäste-Cocktailkarte bleibt einspaltig.

Für ein vorhandenes GitHub-Pages-Repository **alle Dateien** dieser Version übernehmen (darunter die neue `cloud.js`, aktualisierte `app.js`, `index.html` und `sw.js`). **Keine Website-Daten oder App-Daten löschen.** Unbedingt die neue Datei `firebase.rules` in der Firebase-Console veröffentlichen, sonst wird die private Synchronisierung abgewiesen.

Das Upgrade setzt keinen Firestore-Zugang voraus; ohne Firebase laufen alle bisherigen lokalen Funktionen weiter.

## Update auf Version 1.0.2

Die **Gäste-Cocktailkarte** zeigt alle Cocktails jetzt untereinander in **einer einzigen Spalte**, unabhängig von der Bildschirmbreite. Die Cocktails-Übersicht in der Verwaltungs-App behält ihre bisherige Raster-/Listenansicht. Alle vorhandenen Cocktails, Bilder und gespeicherten Bewertungen bleiben unverändert.

Für die Aktualisierung eines bestehenden GitHub-Pages-Projekts genügen die Dateien `styles.css`, `sw.js`, `app.js` und `README.md` aus dem Paket. **Bitte keine Website-/App-Daten löschen.** Die neue Service-Worker-Kennung ermöglicht das Einspielen der aktualisierten Styles.

## Vorheriges Update auf Version 1.0.1

Das Geschmacksprofil hat jetzt bei allen sechs Kriterien **fünf statt zehn Bewertungsstufen**. In der Cocktail-Detailansicht, dem Bearbeitungsformular und der Gäste-Cocktailkarte werden fünf Segmente angezeigt. Einzelne Kriterien können weiterhin **„Unbewertet“** sein.

Bereits lokal gespeicherte Bewertungen aus Version 1.0.0 werden beim ersten Öffnen **einmalig** umgerechnet: **1–2 → 1, 3–4 → 2, 5–6 → 3, 7–8 → 4, 9–10 → 5**. Bestehende Cocktaildaten und Fotos bleiben erhalten. Die Umstellung gilt auch beim Import älterer ZIP-Sicherungen. Öffentliche Cocktailkarten zeigen ebenfalls fünf Segmente; bei einer erneut veröffentlichten Karte wird die neue Skala gespeichert.

Für das Update auf GitHub Pages die bestehenden App-Dateien durch die Dateien dieses Pakets ersetzen (insbesondere `app.js`, `guest.js`, `sw.js`), **nicht** den Browser-Speicher löschen. Die neue Service-Worker-Version erkennt das Update.

## Installation über GitHub Pages

1. Das ZIP-Paket entpacken.
2. Den **Inhalt** des Ordners `cocktails-pwa` in das Wurzelverzeichnis eines neuen GitHub-Repositories hochladen (oder in den Ordner, der als Pages-Quelle dient). Die Datei `index.html` muss unter der späteren Pages-Adresse direkt erreichbar sein.
3. In GitHub **Settings → Pages** öffnen und **Deploy from a branch**, Branch `main`, Ordner `/ (root)` einstellen.
4. Die von GitHub angezeigte HTTPS-Adresse im Android-Browser öffnen.
5. In der App **Einstellungen → App & Installation → App installieren** verwenden. Falls kein Installationsdialog verfügbar ist, im Browsermenü **„App installieren“** oder **„Zum Startbildschirm hinzufügen“** wählen.

Für Tests am Computer kann die App über einen lokalen HTTP-Server geöffnet werden, beispielsweise mit `python -m http.server 8000` im App-Ordner. Die PWA-Installation setzt HTTPS oder `localhost` voraus. Die HTML-Datei einfach über `file://` zu öffnen, wird wegen der lokalen Datenbank und des Service Workers **nicht empfohlen**.

**Ein bestehendes GitHub-Projekt nicht ungeprüft überschreiben.** Für Cocktails kann ein eigenes Repository verwendet werden.

## So verwendest du die App

- In **Meine Bar** Zutaten anlegen und deren Bestand umschalten.
- Mit dem Plus-Symbol **Cocktail hinzufügen**, anschließend Zutaten und Zubereitungsschritte eintragen und speichern.
- In **Cocktails** auf **Cocktailkarte** tippen, um mehrere fertige Cocktails auszuwählen.
- Über **Vorschau** die lokale Gästekarte ansehen. Auf ihr stehen weder Bestand, Mixbarkeit, Ersatzprodukte, interne Notizen noch Zubereitungsschritte.
- In **Einstellungen → Daten & Sicherung** regelmäßig die ZIP-Datei exportieren.

## Firebase ist bereits mit deinem Projekt verbunden

Diese Version ist **fest für `cocktails-fd151` konfiguriert**. Du musst in den App-Dateien keinen Firebase-Code bearbeiten. Die mitgelieferte `firebase.rules` enthält bereits die veröffentlichte Besitzer-UID.

**Schritte:**

1. Vor dem GitHub-Update ein ZIP-Backup in der bisherigen Cocktails-App erstellen.
2. Die Dateien dieses Pakets in dasselbe GitHub-Pages-Verzeichnis hochladen und bestehende App-Dateien ersetzen. Website- und App-Daten nicht löschen.
3. In der aktualisierten App **Einstellungen → App & Installation** öffnen.
4. Beim Firebase-Bereich nur noch die **E-Mail und das Passwort deines bereits angelegten Firebase-Benutzers** eingeben, dann **Anmelden** drücken.
5. Die erste Cloud-Synchronisierung kontrollieren. Auf weiteren Geräten dieselbe Anmeldung verwenden.
6. Die Cocktailkarte unter **Cocktails → Cocktailkarte** auswählen und veröffentlichen. Link/QR-Code stehen unter **Einstellungen → App & Installation** bereit.

Private Daten bleiben lokal offline nutzbar. Synchronisierung kann bei Änderungen von zwei Geräten einen Konfliktdialog anzeigen. Ein Cloud-Download ersetzt lokal gespeicherte Daten nur nach bewusster Entscheidung. Erstelle daher regelmäßig ZIP-Backups.

**Spark:** Nur Firebase Authentication und Cloud Firestore werden verwendet. Kein Firebase Storage, keine Cloud Functions, kein Blaze-Upgrade erforderlich. Firestore-Lese-/Schreibvorgänge und Speicher sind begrenzt; bei Erreichen des Gratis-Kontingents kann die Cloud-Funktion aussetzen.

Weitere Anweisungen: **`FIREBASE-EINRICHTUNG.md`**.

### Cloud-Fotos

Lokale Bilder bleiben in ihrer vorhandenen Auflösung erhalten. Beim ersten Cloud-Upload werden ihre Daten in kleinere, geschützte Firestore-Dokumente zerlegt und später identisch wieder zusammengesetzt. So bleibt die App ohne Firebase Cloud Storage im Spark-Tarif nutzbar. Auch hier gelten das Firestore-Speicher- und das tägliche Zugriffskontingent.

### Größenhinweis für Fotos

Fotos werden in der lokalen App auf maximal 1024 × 1024 Pixel in WebP verarbeitet. Bei Veröffentlichung werden sie separat als kleinere JPEGs eingebettet, um die Firestore-Dokumentgrößen zu begrenzen. Bei ungewöhnlich vielen oder großen Einträgen kann eine Veröffentlichung an Firestores Dokumentgrößenlimit scheitern; eine getrennte Cloud-Bildablage wäre dann eine Erweiterung für eine spätere Version.

## Sicherheit und Datensicherung

- Lokale Daten liegen im Speicherbereich des Browsers. Browserdaten löschen, App-Daten zurücksetzen oder Gerätewechsel kann diese Daten entfernen.
- Der ZIP-Export enthält Bilder als separate Dateien und alle nötigen Datensätze. Der Import prüft Format, Prüfsummen und Referenzen und ersetzt anschließend nach ausdrücklicher Bestätigung die lokale Sammlung.
- ZIP-Dateien werden aus Kompatibilitätsgründen **ohne ZIP-Komprimierung** erzeugt. Beim Import werden von Cocktails erzeugte ZIP-Backups unterstützt; beliebige fremdkomprimierte ZIP-Dateien sind nicht vorgesehen.
- Nach 30 Tagen ohne Sicherung zeigt das Dashboard eine Erinnerung. Sie lässt sich sieben Tage aufschieben.
- Reguläre PWA-Updates sollen die lokale Sammlung nicht überschreiben. Eine zusätzliche ZIP-Sicherung vor größeren Versionswechseln ist empfehlenswert.

## Technische Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Private PWA |
| `app.js` | Cocktails, Zutaten, Filter, Editor, Firebase-Veröffentlichung |
| `styles.css` | Dark-Bar-Design, responsive Layouts |
| `karte.html` + `guest.js` | Öffentliche Gästeansicht und lokale Vorschau |
| `qr.js` | QR-Code-Erzeugung ohne externe Dienste |
| `cloud.js` | Private Cloud-Snapshots, Foto-Blöcke und Konfliktprüfung über Firestore REST |
| `zip.js` | ZIP-Export und -Import ohne externe Bibliotheken |
| `manifest.webmanifest`, `sw.js` | PWA-Installation und Offline-Caching |
| `icon.svg`, `icon-192.png`, `icon-512.png` | Logo und Android-App-Icons |
| `firebase.rules` | Besitzergebundene Sicherheitsregeln für private Cloud und öffentliche Karte |

## Stand und Hinweise

Die App ist fertig für die Firebase-Einrichtung, aber noch **nicht mit deinem persönlichen Firebase-Projekt verbunden**. Die Cloud-Anmeldung und der öffentliche Link werden erst nach Einrichtung im eigenen Firebase-Projekt verfügbar. Die neue Cloud-Synchronisierung konnte gegen eine simulierte Firestore-Datenbank getestet werden, nicht gegen deinen realen Firebase-Zugang.
