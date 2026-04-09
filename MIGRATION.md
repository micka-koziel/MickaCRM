# MIGRATION — Micka CRM vers conventions Dwight

> Document qui explique **ce qui a été migré**, **ce qui reste à faire**, et **comment installer/revenir en arrière** en cas de problème.

---

## TL;DR

Cette livraison est un **kit pilote, 100% additif et backward-compatible**. Il introduit le framework Dwight (namespace `MickaCRM`, core centralisé, modules isolés, CSS séparé du JS) sur le module **Auth** et les fondations communes. **Tous les autres modules continuent à fonctionner sans modification**.

---

## 1. Ce qui est livré

### 1.1. Fondations (core)
| Fichier | Rôle |
|---|---|
| `js/core/namespace.js` | Crée `window.MickaCRM = { core, firebase, modules, state, config }` |
| `js/core/helpers.js` | `fmtAmount`, `fmtDate`, `escapeHTML`, `initials`, `$`, `$$`, `debounce`, `uid`… |
| `js/core/i18n.js` | `t('auth.login')` + dictionnaires FR/EN + `setLocale()` |
| `js/core/errors.js` | `handleError`, `showToast`, `showStatus` (remplace `fbShowStatus`) |
| `js/core/icons.js` | `NAV_ICONS` + `svgIcon()` (extraits de nav.js, centralisés) |

### 1.2. Design system
| Fichier | Rôle |
|---|---|
| `css/tokens.css` | Variables CSS centrales (couleurs, typo, rayons, ombres, espacements) |
| `css/modules/auth.css` | Styles de l'écran d'auth — extraits de l'ancien `injectAuthStyles()` |

### 1.3. Module pilote
| Fichier | Rôle |
|---|---|
| `js/modules/auth/auth.js` | Auth Firebase refactorisée. Expose `MickaCRM.modules.auth.*` ET garde toutes les anciennes globales (`renderAuthScreen`, `authLogout`, etc.) |

### 1.4. Bootstrap et shell
| Fichier | Rôle |
|---|---|
| `index.html` | Ordre de chargement propre ; ai-assistant.js supprimé ; import de tokens.css et auth.css |
| `js/app.js` | Bootstrap nettoyé, utilise `MickaCRM.modules.auth` avec fallbacks |

### 1.5. Documentation
| Fichier | Rôle |
|---|---|
| `CONVENTIONS.md` | Conventions Dwight complètes adaptées au stack vanilla JS |
| `MIGRATION.md` | Ce document |
| `README.md` | Vue d'ensemble du projet |

---

## 2. Ce qui est **backward-compatible**

Tous les noms de fonctions et variables globales historiques sont **toujours exposés**. Exemples :

```js
// Historique — continue à marcher
window.fmtAmount(1500);           // → "1,5k€"
window.svgIcon('dashboard');      // → "<svg…>"
window.renderAuthScreen();        // → affiche l'écran d'auth
window.authLogout();              // → déconnecte
window.NAV_ICONS.dashboard;       // → "M3 13h8V3…"

// Nouveau — Dwight-compliant
MickaCRM.core.fmtAmount(1500);
MickaCRM.core.icons.svgIcon('dashboard');
MickaCRM.modules.auth.renderScreen();
MickaCRM.modules.auth.logout();
```

→ **Aucun autre fichier (nav.js, pipeline.js, dashboard.js, etc.) n'a besoin d'être modifié pour que le site continue à fonctionner.**

---

## 3. Installation

### Étape A — Copier dans le repo
Copier le contenu du dossier `Micka-CRM-Dwight/` à la racine du repo local `C:\Users\micka\Documents\GitHub\Micka CRM`.

Concrètement :
1. `CONVENTIONS.md`, `MIGRATION.md`, `README.md` → à la racine
2. `css/tokens.css` → à placer dans `css/` (à côté de `style.css`)
3. `css/modules/auth.css` → créer le dossier `css/modules/` puis placer le fichier
4. `js/core/*` → créer le dossier `js/core/` puis placer les 5 fichiers
5. `js/modules/auth/auth.js` → créer les dossiers `js/modules/auth/` puis placer le fichier
6. **Remplacer** `index.html` par le nouveau
7. **Remplacer** `js/app.js` par le nouveau
8. **Supprimer** l'ancien `js/auth.js` (remplacé par `js/modules/auth/auth.js`)

### Étape B — Tester en local
Ouvre `index.html` dans ton navigateur (ou `netlify dev` si tu veux). L'écran d'auth doit s'afficher comme avant.

### Étape C — Push
Quand tout est OK : commit + push sur GitHub Desktop → Netlify rebuild auto.

---

## 4. Rollback — si ça casse

Comme la livraison est 100% additive, le rollback est simple :

1. **Restaurer `index.html`** : remets l'ancien (qui référence `js/auth.js` directement)
2. **Restaurer `js/auth.js`** : garde-le, ne l'efface pas avant d'avoir validé le nouveau
3. **Restaurer `js/app.js`** : remets l'ancien

Les fichiers `js/core/*`, `css/tokens.css`, `css/modules/auth.css` peuvent rester en place : sans `index.html` pour les charger, ils sont simplement ignorés.

**Conseil** : avant d'écraser, fais un commit "snapshot pré-Dwight" pour pouvoir revenir en arrière en un clic.

---

## 5. Ce qui **reste à migrer**

Cette livraison est un **pilote**. Les modules suivants continuent à utiliser l'ancienne convention (globales, CSS injecté) et devront être migrés dans les vagues suivantes :

| Module | Fichier actuel | Taille | Priorité |
|---|---|---|---|
| **agent-console** | `js/agent-console.js` | **2499 lignes** (!) | 🔴 CRITIQUE — à découper en 6-8 fichiers |
| record | `js/record.js` | 2430 lignes | 🔴 à découper |
| pipeline | `js/pipeline.js` | 1958 lignes | 🟠 à découper |
| calendar | `js/calendar.js` | 772 lignes | 🟠 |
| quote | `js/quote.js` | 661 lignes | 🟠 |
| claim360 | `js/claim360.js` | 635 lignes | 🟠 helpers à centraliser |
| activity360 | `js/activity360.js` | 655 lignes | 🟠 helpers à centraliser |
| project360 | `js/project360.js` | 579 lignes | 🟠 |
| user-management | `js/user-management.js` | 575 lignes | 🟢 |
| list | `js/list.js` | 536 lignes | 🟢 |
| agent-team | `js/agent-team.js` | 495 lignes | 🟢 |
| product-picker | `js/product-picker.js` | 459 lignes | 🟢 |
| user360 | `js/user360.js` | 446 lignes | 🟢 |
| firebase-crud | `js/firebase-crud.js` | 373 lignes | 🟡 à déplacer dans `js/firebase/` |
| dashboard | `js/dashboard.js` | 373 lignes | 🟢 |
| nav | `js/nav.js` | 243 lignes | 🟡 logo "CRM360 SAINT-GOBAIN" à retirer, icônes déjà centralisées dans core |
| data | `js/data.js` | 218 lignes | 🟢 |

### Plan recommandé (vagues suivantes)

- **Vague 2** : découper `agent-console.js` (plus gros risque technique)
- **Vague 3** : centraliser les helpers des 360 (`cl36*`, `at3*`, etc.) dans `core`
- **Vague 4** : migrer `nav.js` (retirer le logo Saint-Gobain, utiliser `core.icons`)
- **Vague 5** : migrer les gros modules métier (pipeline, record, calendar)
- **Vague 6** : nettoyage final, suppression des backward-compat globals

---

## 6. Points d'attention

- **Dossier parasite `{css,js}/`** : vu dans le repo lors de l'audit. À supprimer manuellement depuis l'explorateur Windows ou GitHub Desktop (probablement créé par une mauvaise commande shell).
- **Logo "CRM360 SAINT-GOBAIN"** toujours présent dans `nav.js` → à nettoyer lors de la migration de nav.
- **Référence `ai-assistant.js`** supprimée dans le nouveau `index.html`.
- **Assets** : les photos d'agents restent en place dans `assets/` — pas touché.
- **Firebase config** : inchangée, reste dans `js/firebase-init.js`.

---

*Version 1.0 — 2026-04-09 — Dwight (architecte code)*
