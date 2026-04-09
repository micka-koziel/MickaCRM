# Conventions Dwight — Framework Micka CRM

> Règles de code standardisées pour Micka CRM et toutes les futures applications KOZIEL AI.
> Stack : **Vanilla HTML/CSS/JavaScript + Firebase (compat CDN) + Netlify**.
> Ces conventions ont été adaptées pour du JS vanilla (pas de React, pas de bundler).

---

## 1. Principes fondateurs

1. **Un fichier = une responsabilité.** Si un fichier dépasse ~400 lignes, on le découpe.
2. **Pas de patchs partiels.** Quand on modifie un fichier, on fournit le fichier complet.
3. **Namespace unique.** Tout le code applicatif vit sous `window.MickaCRM.*`, jamais en vrac sur `window`.
4. **Helpers centralisés.** Formatage, i18n, icônes, erreurs : un seul endroit.
5. **CSS séparé du JS.** Plus d'`injectStyles()` à rallonge. Les styles vont dans `css/modules/*.css`.
6. **Design system unique.** Couleurs et typo définies une seule fois dans `css/tokens.css`.
7. **Backward-compatible.** Les refacto se font en additif : on n'efface rien sans avoir remplacé.

---

## 2. Structure des dossiers

```
Micka-CRM-Dwight/
├── index.html                 # Entry point (ordre de chargement strict)
├── css/
│   ├── tokens.css             # Variables design system
│   ├── base.css               # Reset + typographie
│   └── modules/
│       ├── auth.css
│       ├── sidebar.css
│       ├── list.css
│       └── ...
├── js/
│   ├── core/                  # Fondations — chargées en premier
│   │   ├── namespace.js       # window.MickaCRM
│   │   ├── helpers.js         # fmtAmount, fmtDate, escapeHTML, $, ...
│   │   ├── i18n.js            # t() + dictionnaires FR/EN
│   │   ├── icons.js           # NAV_ICONS + svgIcon()
│   │   └── errors.js          # handleError, showToast
│   ├── firebase/              # Couche Firebase isolée
│   │   ├── init.js
│   │   └── crud.js
│   ├── modules/               # Modules métier
│   │   ├── auth/
│   │   │   └── auth.js
│   │   ├── nav/
│   │   │   └── sidebar.js
│   │   ├── dashboard/
│   │   ├── list/
│   │   ├── pipeline/
│   │   ├── calendar/
│   │   ├── record/
│   │   ├── lead360/
│   │   ├── project360/
│   │   ├── claim360/
│   │   ├── activity360/
│   │   ├── user360/
│   │   ├── quote/
│   │   ├── product-picker/
│   │   ├── user-management/
│   │   └── agents/            # agent-console + agent-team découpés
│   │       ├── team.js
│   │       ├── console.js
│   │       ├── catalog.js
│   │       └── chat.js
│   └── app.js                 # Bootstrap final
└── assets/
    ├── agents/
    └── logo/
```

---

## 3. Nommage

- **Fichiers** : kebab-case (`agent-team.js`, `product-picker.js`).
- **Fonctions globales exposées** : camelCase préfixées par module (`authLogout`, `calRenderPage`, `cl36StatusBadge`).
- **Fonctions internes core** : sous `MickaCRM.core.*` (`MickaCRM.core.fmtAmount`).
- **Constantes** : `UPPER_SNAKE_CASE` (`NAV_ICONS`, `AT_AGENTS`).
- **Variables d'état globales** : `MickaCRM.state.*` (`MickaCRM.state.currentPage`).
- **IDs DOM** : kebab-case (`#page-content`, `#sidebar-nav`).
- **Classes CSS** : kebab-case avec préfixe module (`.auth-screen`, `.cl36-badge`).

---

## 4. Conventions JavaScript

### 4.1. Structure d'un module
Chaque fichier module commence par un en-tête et se termine par son exposition au namespace :

```js
/* modules/auth/auth.js — Authentification Firebase
 * Dépendances : core.helpers, core.i18n, firebase.init
 * Expose : MickaCRM.modules.auth.{renderScreen, logout, getUser}
 */
(function(){
  var core = MickaCRM.core;
  var t = core.i18n.t;

  function renderScreen(){ /* ... */ }
  function logout(){ /* ... */ }
  function getUser(){ return MickaCRM.state.authUser; }

  // Expose
  MickaCRM.modules.auth = { renderScreen: renderScreen, logout: logout, getUser: getUser };

  // Backward-compat (à retirer quand tous les modules sont migrés)
  window.renderAuthScreen = renderScreen;
  window.authLogout = logout;
})();
```

### 4.2. Règles de style
- **IIFE** pour chaque fichier → pas de pollution du scope global.
- `var` uniquement (cohérence avec le code existant, compat IE11 si besoin).
- Pas de `innerHTML =` avec des données utilisateur non échappées → toujours passer par `core.escapeHTML`.
- Pas de `document.write`, pas de `eval`.
- Pas de dépendance NPM : tout vient du CDN ou est embarqué.

### 4.3. Gestion d'erreurs
- Jamais de `try/catch` silencieux. Utiliser `MickaCRM.core.handleError(err, context)`.
- Les promesses Firebase se terminent toujours par `.catch(core.handleError)`.

---

## 5. Conventions CSS

- **Variables** dans `css/tokens.css` : `--primary`, `--text`, `--bg`, `--radius`, etc.
- **Pas de styles inline** sauf cas très spécifiques (animations dynamiques).
- **Un fichier CSS par module** dans `css/modules/`.
- **Ordre des propriétés** : layout → box → typo → couleurs → effets.

---

## 6. Ordre de chargement dans index.html

1. Google Fonts + Firebase SDK CDN
2. `css/tokens.css` → `css/base.css` → `css/modules/*.css`
3. `js/core/*.js` (namespace en premier !)
4. `js/firebase/init.js` → `js/firebase/crud.js`
5. `js/modules/**/*.js` (par ordre de dépendance)
6. `js/app.js` (bootstrap, en dernier)

---

## 7. Règles de livraison Dwight

- **Pas de fichier incomplet.** Un fichier livré est prêt à être copié tel quel.
- **Pas de `// ... existing code ...`** dans le code livré.
- **Toujours le chemin relatif complet** en commentaire de tête.
- **Commits atomiques** (un module à la fois).
- **Migration douce** : on garde toujours l'ancien fonctionnel tant que le nouveau n'est pas validé.

---

*Version 1.0 — 2026-04-09 — adapté au stack vanilla JS de Micka CRM.*
