# Micka CRM — Kit pilote Dwight

**CRM BTP / Construction** — vanilla HTML/CSS/JS + Firebase + Netlify.
Ce kit applique les conventions Dwight v1.0 adaptées au stack réel (pas de React, pas de bundler).

## Stack
- **Front** : HTML + CSS + JavaScript vanilla (ES5/ES6 compatible)
- **Backend** : Firebase Auth + Firestore + Storage (CDN compat SDK 10.12)
- **Hosting** : Netlify (auto-deploy depuis GitHub Desktop)
- **Typo** : DM Sans
- **Design system** : Primary #2563eb, texte #0f172a, slate-50 à slate-900

## Démarrage rapide
1. Lis [`CONVENTIONS.md`](CONVENTIONS.md) pour comprendre les règles de code
2. Lis [`MIGRATION.md`](MIGRATION.md) pour savoir comment installer ce kit dans ton repo existant
3. Ouvre `index.html` dans un navigateur pour tester

## Architecture
```
js/
├── core/          ← fondations (à charger en premier)
├── firebase/      ← couche Firebase (init + crud)
├── modules/       ← modules métier (un dossier par feature)
└── app.js         ← bootstrap (à charger en dernier)
```

Tout le code applicatif vit sous `window.MickaCRM.*` — plus de pollution du scope global.

## État de la migration
- ✅ Core (namespace, helpers, i18n, errors, icons)
- ✅ Design system (tokens.css)
- ✅ Module Auth (pilote)
- ⏳ Modules métier : voir `MIGRATION.md` pour le plan complet

## Contact
Mickaël — KOZIEL AI — mickael.koziel@gmail.com
