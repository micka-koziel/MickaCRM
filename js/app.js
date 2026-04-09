/* js/app.js — Bootstrap de Micka CRM
 * Dépendances : ALL (doit être chargé en dernier)
 *
 * Responsabilité : orchestrer le démarrage — auth, chargement Firestore,
 * rendu initial. Ne contient AUCUNE logique métier.
 */
(function(){
  document.addEventListener('DOMContentLoaded', boot);

  function boot(){
    var core = MickaCRM.core;
    var auth = MickaCRM.modules.auth;

    /* 1. Cache l'app shell tant que non authentifié */
    var shell = document.getElementById('app-shell');
    if (shell) shell.style.display = 'none';

    /* 2. Gère un éventuel retour de magic link */
    if (auth && auth.completeMagicLinkSignIn) {
      auth.completeMagicLinkSignIn();
    }

    /* 3. Affiche l'écran de login immédiatement */
    if (auth && auth.renderScreen) {
      auth.renderScreen();
    }

    /* 4. Écoute les changements d'état d'auth */
    firebase.auth().onAuthStateChanged(function(user){
      if (user) {
        onSignedIn(user);
      } else {
        onSignedOut();
      }
    });
  }

  /* ─── Connecté ──────────────────────────────────────────── */
  function onSignedIn(user){
    var core = MickaCRM.core;
    var auth = MickaCRM.modules.auth;

    MickaCRM.state.authUser = user;
    window.AUTH_USER = user; // backward-compat
    console.log('[App] Signed in as', user.email);

    auth.hideScreen();
    auth.showAppShell();

    // Sidebar (module historique)
    if (typeof renderSidebar === 'function') renderSidebar();

    // Spinner pendant chargement Firestore
    showLoadingSpinner();

    // Chargement Firestore
    if (typeof fbLoadAll !== 'function') {
      core.handleError(new Error('fbLoadAll non défini'), 'bootstrap');
      return;
    }

    fbLoadAll()
      .then(function(totalDocs){
        if (totalDocs === 0 && typeof fbShowStatus === 'function') {
          fbShowStatus('Seeding Firestore avec les données de démo…');
        }
        if (typeof fbSeedIfEmpty === 'function') {
          return fbSeedIfEmpty().then(function(){ return fbLoadAll(); });
        }
      })
      .then(function(){
        core.showStatus('Connecté à Firestore');
        if (typeof umSeedUsers === 'function') {
          return umSeedUsers()
            .then(function(){ return umLoadUsers(); })
            .then(function(){ return umLoadAudit(); });
        }
      })
      .then(function(){
        if (typeof renderCurrentPage === 'function') renderCurrentPage();
        if (typeof renderFloatingChat === 'function') renderFloatingChat();
      })
      .catch(function(err){
        console.error('[App] Firestore error, fallback local :', err);
        core.showStatus('Hors ligne — données locales', true);
        if (typeof renderCurrentPage === 'function') renderCurrentPage();
        if (typeof renderFloatingChat === 'function') renderFloatingChat();
      });
  }

  /* ─── Déconnecté ────────────────────────────────────────── */
  function onSignedOut(){
    MickaCRM.state.authUser = null;
    window.AUTH_USER = null;
    var shell = document.getElementById('app-shell');
    if (shell) shell.style.display = 'none';
    if (!document.getElementById('auth-screen') && MickaCRM.modules.auth) {
      MickaCRM.modules.auth.renderScreen();
    }
  }

  /* ─── Spinner de chargement ─────────────────────────────── */
  function showLoadingSpinner(){
    var content = document.getElementById('page-content');
    if (!content) return;
    content.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;height:60vh;gap:10px;color:var(--text-light);font-size:13px">'
      + '<div style="width:18px;height:18px;border:2px solid var(--border);border-top-color:var(--primary);border-radius:50%;animation:spin .6s linear infinite"></div>'
      + 'Chargement depuis Firestore…'
      + '</div>';
    if (!document.getElementById('mc-spin-css')) {
      var s = document.createElement('style');
      s.id = 'mc-spin-css';
      s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
      document.head.appendChild(s);
    }
  }
})();
