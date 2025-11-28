<content>
# Node JS Web Server

## Übersicht

Kleines Lernprojekt: einfacher Web-Server mit Nutzer-Kontext, Logging, Passwort-Hashing und CRUD-Funktionalität für Posts.

**Features**

* Nutzer-Authentifizierung (Registration / Login)
* Passwort-Hashing (bcrypt)
* Posts: erstellen, bearbeiten, löschen, abrufen
* Logging (z. B. morgan/winston)
* Datenbank als JSON simuliert 

---

## Voraussetzungen

* Node.js 
* npm
* 
---

## Schnellstart (nach `git clone`)

```bash
# Repository klonen
git clone <REPO_URL>
cd <REPO_FOLDER>

# Node-Modules installieren
npm install

# Beispielumgebung kopieren und anpassen
cp .env.example .env
# .env editieren: PORT, DATABASE_URL, JWT_SECRET, etc.

# Entwicklungsserver starten
# Falls package.json ein "dev"-Script hat:
npm run dev

# Oder Production/Start:
npm start
```

> Hinweis: Manche Repositories benutzen `npm start dev` nicht. Üblich ist `npm run dev` für Entwicklermodus (z. B. nodemon) und `npm start` für Produktion.

---

