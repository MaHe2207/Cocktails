# Cocktails – Firebase-Verbindung für dein Projekt

**Version 1.1.1 – fertig konfiguriert für `cocktails-fd151`**

Deine Firebase-Webkonfiguration ist **bereits in der PWA enthalten**. Du musst keine Datei editieren und weder Projekt-ID noch Web-API-Key eintippen.

## Was du schon erledigt hast

- Firebase-Projekt `cocktails-fd151` angelegt (Spark-Tarif)
- Firebase Authentication mit **E-Mail/Passwort** aktiviert und ein Besitzerkonto erstellt
- Firestore Standard-Datenbank erstellt
- UID-gebundene Sicherheitsregeln veröffentlicht (die zugehörige `firebase.rules` liegt zur Dokumentation im Paket)

## App-Update bei GitHub

1. Vorher in der bisherigen Cocktails-App unter **Einstellungen → Daten & Sicherung** ein ZIP-Backup erstellen.
2. ZIP **`Cocktails-PWA-v1.1.1-Firebase-fertig.zip`** entpacken.
3. **Alle Dateien aus dem Unterordner `cocktails-pwa`** in dasselbe GitHub-Repository und denselben Pages-Ordner hochladen, in dem deine App bereits liegt. Vorhandene Dateien ersetzen, `index.html` muss an der Pages-Adresse erreichbar bleiben.
4. Die GitHub-Pages-Adresse bzw. installierte Android-PWA öffnen. Falls die alte Version noch sichtbar ist, App vollständig schließen und neu starten; **keine Website- oder App-Daten löschen**.

## Einmalig anmelden

1. **Einstellungen → App & Installation** öffnen und den Bereich ausklappen.
2. Zu **Firebase verbinden** scrollen. Dort steht bereits **Firebase-Projekt: cocktails-fd151**.
3. Die E-Mail-Adresse und das Passwort des **bereits in Firebase angelegten Benutzerkontos** eingeben.
4. **Mit vorhandenem Firebase-Konto anmelden** antippen.
5. **Jetzt synchronisieren** drücken oder kurz später den automatischen Abgleich prüfen.

Du musst **kein neues Konto anlegen** und **dein Passwort nicht hier im Chat teilen**. Das Passwort wird nicht in Cocktails gespeichert; ein Firebase-Anmeldetoken verbleibt lokal auf dem Gerät.

Wenn du auf einem zweiten Gerät dieselbe App öffnest, melde dich mit demselben Firebase-Besitzerkonto an. Besteht dort bereits eine abweichende lokale Sammlung, entscheidet die App nicht ungefragt über das Überschreiben. Erstelle vor einer Konfliktentscheidung ein ZIP-Backup.

## Öffentliche Cocktailkarte

1. In **Cocktails → Cocktailkarte** fertige Cocktails auswählen.
2. **Cocktailkarte veröffentlichen** antippen.
3. Unter **Einstellungen → App & Installation → Cocktailkarte** den Link kopieren oder den QR-Code öffnen.
4. Gäste können den Link ohne Anmeldung öffnen. Die Karte ist einspaltig und zeigt keine Zutatenverfügbarkeit und keine Zubereitungsangaben.

**Wichtig:** Private Cloud-Sicherung erfolgt automatisch; die öffentliche Cocktailkarte wird nur nach ausdrücklichem Klick auf „Cocktailkarte veröffentlichen“ aktualisiert.

## Kostenloser Betrieb

Dieses Paket verwendet **Firebase Authentication + Cloud Firestore**, aber **weder Firebase Storage noch Cloud Functions**. Bilder werden in kleineren Firestore-Dokumenten gespeichert. Das funktioniert grundsätzlich mit Spark-Freikontingenten, die jedoch begrenzt sind. Wird das freie Kontingent erreicht, kann Firebase Zugriffe drosseln/stoppen. Kein Upgrade auf Blaze erforderlich; keine Karte hinterlegen.

**Kontrollieren:** Firestore → Nutzung / Usage. Backups auch unabhängig von Firebase regelmäßig lokal exportieren.

## Falls etwas nicht klappt

- `EMAIL_NOT_FOUND`, `INVALID_LOGIN_CREDENTIALS`: E-Mail/Passwort des in Firebase Authentication angelegten Benutzers kontrollieren.
- `PERMISSION_DENIED`: Prüfen, ob die UID-gebundenen Regeln veröffentlicht sind und du mit dem richtigen Besitzerkonto angemeldet bist.
- `API_KEY_INVALID`: Die Projektkonfiguration in dieser Version ist fest hinterlegt; sicherstellen, dass die Web-App aus dem richtigen Firebase-Projekt verwendet wird.
- Cloud-Abgleich meldet einen Konflikt: Vor der Entscheidung ZIP-Sicherung erstellen. Bestehende Daten **nicht unüberlegt überschreiben**.

Eine echte Anmeldung in deinem Firebase-Projekt kann erst **auf deinem Gerät** erfolgen; sie wurde bei der Paketerstellung nicht durchgeführt.
