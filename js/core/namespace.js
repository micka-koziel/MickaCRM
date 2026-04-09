/* js/core/namespace.js — Namespace global Micka CRM
 * Doit être chargé EN PREMIER, avant tout autre script applicatif.
 * Expose : window.MickaCRM = { core, firebase, modules, state, config }
 */
(function(){
  if (window.MickaCRM) return; // idempotent

  window.MickaCRM = {
    version: '1.0.0',
    core: {},         // helpers, i18n, icons, errors
    firebase: {},     // init + crud
    modules: {},      // auth, nav, dashboard, list, etc.
    state: {          // état global applicatif
      authUser: null,
      currentPage: 'dashboard',
      currentRecordObj: null,
      currentRecordId: null,
      locale: 'fr',
      sidebarCollapsed: false
    },
    config: {
      appName: 'Micka CRM',
      defaultLocale: 'fr',
      supportedLocales: ['fr', 'en']
    }
  };

  // Raccourci dev : accessible en console
  console.log('[MickaCRM] namespace ready — v' + window.MickaCRM.version);
})();
