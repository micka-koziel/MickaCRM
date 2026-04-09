/* js/modules/auth/auth.js — Module Auth (Firebase)
 * Dépendances : core.namespace, core.helpers, core.i18n, core.icons, core.errors, firebase SDK
 * Expose : MickaCRM.modules.auth.{renderScreen, hideScreen, showAppShell, logout, getUser, getDisplayName, getInitials}
 *
 * Backward-compat : expose aussi les anciennes globales
 *   renderAuthScreen, hideAuthScreen, showAppShell, authLogout, authUserDisplayName, authUserInitials, completeMagicLinkSignIn, AUTH_USER
 */
(function(){
  var core = MickaCRM.core;
  var t = core.i18n.t;
  var escapeHTML = core.escapeHTML;

  /* ─── État local ───────────────────────────────────── */
  var mode = 'login'; // 'login' | 'signup'
  var lastError = '';

  /* ─── Rendu de l'écran d'auth ──────────────────────── */
  function renderScreen(){
    // Empêche le double rendu
    if (document.getElementById('auth-screen')) return;

    var shell = document.createElement('div');
    shell.id = 'auth-screen';
    shell.className = 'auth-screen';
    shell.innerHTML = buildHTML();
    document.body.appendChild(shell);

    wireEvents(shell);
  }

  function buildHTML(){
    var isLogin = mode === 'login';
    return ''
      + '<div class="auth-card">'
      +   '<div class="auth-logo">'
      +     '<span>Micka</span><span class="auth-logo-accent">CRM</span>'
      +   '</div>'
      +   '<div class="auth-subtitle">' + escapeHTML(t('auth.subtitle')) + '</div>'
      +   (lastError ? '<div class="auth-error">' + escapeHTML(lastError) + '</div>' : '')
      +   '<div class="auth-field">'
      +     '<label>' + t('auth.email') + '</label>'
      +     '<input type="email" id="auth-email" autocomplete="email" />'
      +   '</div>'
      +   '<div class="auth-field">'
      +     '<label>' + t('auth.password') + '</label>'
      +     '<input type="password" id="auth-password" autocomplete="' + (isLogin ? 'current-password' : 'new-password') + '" />'
      +   '</div>'
      +   '<button class="auth-btn auth-btn-primary" id="auth-submit">'
      +     (isLogin ? t('auth.login') : t('auth.signup'))
      +   '</button>'
      +   '<div class="auth-divider">' + t('auth.or') + '</div>'
      +   '<button class="auth-btn auth-btn-secondary" id="auth-google">' + googleLogo() + t('auth.google') + '</button>'
      +   '<button class="auth-btn auth-btn-secondary" id="auth-magic" style="margin-top:8px">' + t('auth.magic') + '</button>'
      +   '<div class="auth-switch">'
      +     (isLogin ? ('Pas encore de compte ? <a data-action="toggle">' + t('auth.signup') + '</a>') : ('Déjà un compte ? <a data-action="toggle">' + t('auth.login') + '</a>'))
      +   '</div>'
      + '</div>';
  }

  function googleLogo(){
    return '<svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">'
      + '<path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>'
      + '<path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>'
      + '<path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.3 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>'
      + '<path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.2 5.2C41 34.8 44 29.9 44 24c0-1.3-.1-2.3-.4-3.5z"/>'
      + '</svg>';
  }

  /* ─── Wiring événements ────────────────────────────── */
  function wireEvents(root){
    var emailEl = root.querySelector('#auth-email');
    var passEl  = root.querySelector('#auth-password');

    root.querySelector('#auth-submit').addEventListener('click', function(){
      var email = (emailEl.value || '').trim();
      var pwd = passEl.value || '';
      if (!email || !pwd) { setError('Email et mot de passe requis'); return; }
      clearError();

      var auth = firebase.auth();
      var promise = (mode === 'login')
        ? auth.signInWithEmailAndPassword(email, pwd)
        : auth.createUserWithEmailAndPassword(email, pwd);

      promise.catch(function(err){ setError(errorMsg(err)); });
    });

    root.querySelector('#auth-google').addEventListener('click', function(){
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).catch(function(err){ setError(errorMsg(err)); });
    });

    root.querySelector('#auth-magic').addEventListener('click', function(){
      var email = (emailEl.value || '').trim();
      if (!email) { setError('Saisis ton email pour recevoir un lien magique'); return; }
      var settings = {
        url: window.location.href,
        handleCodeInApp: true
      };
      firebase.auth().sendSignInLinkToEmail(email, settings).then(function(){
        window.localStorage.setItem('emailForSignIn', email);
        core.showToast('Lien envoyé. Vérifie ta boîte mail.', 'success', 4000);
      }).catch(function(err){ setError(errorMsg(err)); });
    });

    root.addEventListener('click', function(e){
      var a = e.target.closest('[data-action="toggle"]');
      if (a) {
        e.preventDefault();
        mode = (mode === 'login') ? 'signup' : 'login';
        clearError();
        rerender();
      }
    });
  }

  function rerender(){
    var el = document.getElementById('auth-screen');
    if (!el) return;
    el.innerHTML = buildHTML();
    wireEvents(el);
  }

  function setError(msg){
    lastError = msg;
    rerender();
  }
  function clearError(){ lastError = ''; }

  function errorMsg(err){
    var code = err && err.code;
    var map = {
      'auth/invalid-email':        'Email invalide',
      'auth/user-disabled':        'Compte désactivé',
      'auth/user-not-found':       'Aucun compte avec cet email',
      'auth/wrong-password':       'Mot de passe incorrect',
      'auth/email-already-in-use': 'Cet email est déjà utilisé',
      'auth/weak-password':        'Mot de passe trop faible (6 caractères minimum)',
      'auth/popup-closed-by-user': 'Connexion annulée',
      'auth/network-request-failed': 'Problème réseau'
    };
    return map[code] || (err && err.message) || 'Erreur inconnue';
  }

  /* ─── Magic link retour ────────────────────────────── */
  function completeMagicLinkSignIn(){
    if (!firebase.auth().isSignInWithEmailLink(window.location.href)) return;
    var email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      email = window.prompt('Confirme ton email pour finaliser la connexion :');
    }
    if (!email) return;
    firebase.auth().signInWithEmailLink(email, window.location.href).then(function(){
      window.localStorage.removeItem('emailForSignIn');
      // Nettoie l'URL
      var url = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, url);
    }).catch(core.handleError);
  }

  /* ─── Shell ────────────────────────────────────────── */
  function hideScreen(){
    var el = document.getElementById('auth-screen');
    if (el) el.remove();
  }

  function showAppShell(){
    var shell = document.getElementById('app-shell');
    if (shell) shell.style.display = 'flex';
  }

  /* ─── Logout ───────────────────────────────────────── */
  function logout(){
    firebase.auth().signOut().then(function(){
      window.location.reload();
    }).catch(core.handleError);
  }

  /* ─── Utilitaires utilisateur ──────────────────────── */
  function getUser(){ return MickaCRM.state.authUser; }

  function getDisplayName(){
    var u = MickaCRM.state.authUser;
    if (!u) return '';
    return u.displayName || (u.email ? u.email.split('@')[0] : '');
  }

  function getInitials(){
    return core.initials(getDisplayName() || 'U');
  }

  /* ─── Expose ───────────────────────────────────────── */
  MickaCRM.modules.auth = {
    renderScreen: renderScreen,
    hideScreen: hideScreen,
    showAppShell: showAppShell,
    logout: logout,
    getUser: getUser,
    getDisplayName: getDisplayName,
    getInitials: getInitials,
    completeMagicLinkSignIn: completeMagicLinkSignIn
  };

  /* ─── Backward-compat (globales historiques) ───────── */
  window.renderAuthScreen = renderScreen;
  window.hideAuthScreen = hideScreen;
  window.showAppShell = showAppShell;
  window.authLogout = logout;
  window.authUserDisplayName = getDisplayName;
  window.authUserInitials = getInitials;
  window.completeMagicLinkSignIn = completeMagicLinkSignIn;
  // AUTH_USER sera synchronisé depuis app.js quand onAuthStateChanged fire
})();
