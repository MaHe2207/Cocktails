# Cocktails – Android-PWA

**Version 1.0.1 · Geschmacksprofil mit fünf Stufen**

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

**Wichtig:** Alle privaten Rezepte, Zutaten und Bestandsinformationen liegen zunächst nur lokal auf dem jeweiligen Gerät. Es gibt keine automatische Synchronisierung privater Daten zwischen Geräten. Die öffentliche Cocktailkarte veröffentlicht ausschließlich die dafür ausgewählten Rezeptangaben.

## Update auf Version 1.0.1

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

## Öffentliche Cocktailkarte: einmalige Firebase-Einrichtung

Ein öffentlich erreichbarer Link und QR-Code benötigen einen gemeinsam zugänglichen Onlinespeicher. Eine Gäste-App kann nicht auf die IndexedDB eines anderen Smartphones zugreifen. Die App unterstützt dafür optional **Firebase Authentication + Cloud Firestore**, ohne dass die private Cocktailverwaltung davon abhängig wird.

1. In der Firebase Console ein Projekt erstellen.
2. **Authentication → Sign-in method → E-Mail/Passwort** aktivieren.
3. **Firestore Database** für das Projekt einrichten.
4. Im Firestore-Reiter **Rules** den vollständigen Inhalt der beigefügten Datei `firebase.rules` einfügen und veröffentlichen. Diese Regeln gestatten Gästen nur das Lesen veröffentlichter Karten, während Änderungen eine Anmeldung als Karteninhaber erfordern. Andere Dokumentpfade sind gesperrt.
5. Unter **Projekteinstellungen → Allgemein → Web-App** eine Firebase-Web-App registrieren (falls noch nicht geschehen) und die Werte `projectId` und `apiKey` aus der Web-Konfiguration ablesen.
6. In **Cocktails → Einstellungen → App & Installation** Projekt-ID, Web-API-Key, E-Mail und Passwort eingeben. Über **Konto erstellen** ein eigenes Firebase-Konto registrieren oder über **Anmelden** ein vorhandenes Konto nutzen.
7. Unter **Cocktails → Cocktailkarte** die gewünschten Cocktails auswählen und **Cocktailkarte veröffentlichen** antippen. Ein Internetzugang ist hierfür nötig.
8. Danach in **Einstellungen → App & Installation → Cocktailkarte** den öffentlichen Link kopieren oder den QR-Code öffnen.

**Bei Änderungen an der Cocktailkarte erneut „Cocktailkarte veröffentlichen“ antippen.** Durch die lokale Speicherung werden Änderungen nicht automatisch online hochgeladen. Gäste benötigen keine Anmeldung.

Der API-Key einer Firebase-Web-App ist kein geheimes Serverpasswort. **Die Firestore-Sicherheitsregeln sind dennoch zwingend nötig.** Das Firebase-Anmeldepasswort wird nicht in der App-Datenbank gespeichert. Ein Authentifizierungs-Refresh-Token wird lokal gespeichert, damit du nicht bei jedem Aufruf erneut das Passwort eingeben musst; dieses Token wird aus ZIP-Backups ausgeschlossen.

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
| `zip.js` | ZIP-Export und -Import ohne externe Bibliotheken |
| `manifest.webmanifest`, `sw.js` | PWA-Installation und Offline-Caching |
| `icon.svg`, `icon-192.png`, `icon-512.png` | Logo und Android-App-Icons |
| `firebase.rules` | Sicherheitsregeln für die veröffentlichte Karte |

## Stand und Hinweise

Dies ist eine erste funktionsfähige Version, kein bereits eingerichteter Onlinedienst. Die lokale App ist ohne Firebase einsatzbereit, aber ein **öffentlicher Link kann erst nach GitHub-Pages-Veröffentlichung und Firebase-Einrichtung** funktionieren. Die Firebase-Veröffentlichung kann in dieser Entwicklungsumgebung ohne deine Projektkonfiguration nicht gegen ein echtes Firebase-Projekt getestet werden.
