/* ═══════════════════════════════════════════════════════
   auth.js — Firebase Authentication (Email, Google, Magic Link)
   Login screen + auth state + logout
   ═══════════════════════════════════════════════════════ */

var AUTH_USER = null;

/* ── Inject login page styles ── */
function injectAuthStyles() {
  if (document.getElementById('auth-css')) return;
  var s = document.createElement('style');
  s.id = 'auth-css';
  s.textContent = `
    /* ── Auth Screen Overlay ── */
    #auth-screen {
      position: fixed; inset: 0; z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      font-family: 'DM Sans', sans-serif;
      transition: opacity .4s ease, visibility .4s ease;
    }
    #auth-screen.auth-hidden {
      opacity: 0; visibility: hidden; pointer-events: none;
    }

    /* Subtle grid pattern */
    #auth-screen::before {
      content: ''; position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    .auth-card {
      position: relative; z-index: 1;
      width: 100%; max-width: 400px;
      margin: 16px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 25px 60px rgba(0,0,0,.35);
      overflow: hidden;
      animation: authSlideUp .5s ease;
    }
    @keyframes authSlideUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .auth-header {
      padding: 36px 32px 24px;
      text-align: center;
    }
    .auth-brand {
      font-size: 22px; font-weight: 800; color: #0f172a;
      letter-spacing: -.3px;
    }
    .auth-brand .auth-360 {
      font-size: 15px; font-weight: 600; opacity: .3;
    }
    .auth-subtitle {
      margin-top: 6px; font-size: 13px; color: #64748b;
    }

    .auth-body { padding: 0 32px 32px; }

    /* Tabs */
    .auth-tabs {
      display: flex; border-radius: 8px;
      background: #f1f5f9; padding: 3px; margin-bottom: 20px;
    }
    .auth-tab {
      flex: 1; padding: 8px 0; border: none; background: none;
      font-family: inherit; font-size: 12.5px; font-weight: 600;
      color: #64748b; border-radius: 6px; cursor: pointer;
      transition: all .2s;
    }
    .auth-tab.active {
      background: #ffffff; color: #0f172a;
      box-shadow: 0 1px 3px rgba(0,0,0,.1);
    }

    /* Form fields */
    .auth-field { margin-bottom: 14px; }
    .auth-field label {
      display: block; font-size: 11.5px; font-weight: 600;
      color: #475569; margin-bottom: 5px; text-transform: uppercase;
      letter-spacing: .4px;
    }
    .auth-field input {
      width: 100%; padding: 10px 12px;
      border: 1.5px solid #e2e8f0; border-radius: 8px;
      font-family: inherit; font-size: 13.5px; color: #1e293b;
      transition: border-color .2s, box-shadow .2s;
      outline: none; background: #fff;
    }
    .auth-field input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37,99,235,.1);
    }
    .auth-field input::placeholder { color: #94a3b8; }

    /* Primary button */
    .auth-btn-primary {
      width: 100%; padding: 11px 0; border: none; border-radius: 8px;
      font-family: inherit; font-size: 13.5px; font-weight: 600;
      color: #fff; background: #2563eb; cursor: pointer;
      transition: background .2s, transform .1s;
      margin-top: 4px;
    }
    .auth-btn-primary:hover { background: #1d4ed8; }
    .auth-btn-primary:active { transform: scale(.98); }
    .auth-btn-primary:disabled {
      opacity: .5; cursor: not-allowed; transform: none;
    }

    /* Divider */
    .auth-divider {
      display: flex; align-items: center; gap: 12px;
      margin: 18px 0; font-size: 11px; color: #94a3b8;
      text-transform: uppercase; letter-spacing: .5px;
    }
    .auth-divider::before, .auth-divider::after {
      content: ''; flex: 1; height: 1px; background: #e2e8f0;
    }

    /* Google button */
    .auth-btn-google {
      width: 100%; padding: 10px 0; border: 1.5px solid #e2e8f0;
      border-radius: 8px; background: #fff; cursor: pointer;
      font-family: inherit; font-size: 13px; font-weight: 500;
      color: #1e293b; display: flex; align-items: center;
      justify-content: center; gap: 8px;
      transition: background .2s, border-color .2s;
    }
    .auth-btn-google:hover {
      background: #f8fafc; border-color: #cbd5e1;
    }
    .auth-btn-google svg { flex-shrink: 0; }

    /* Magic link section */
    .auth-magic {
      margin-top: 16px; padding-top: 16px;
      border-top: 1px solid #f1f5f9;
      text-align: center;
    }
    .auth-magic-btn {
      background: none; border: none; cursor: pointer;
      font-family: inherit; font-size: 12.5px; font-weight: 500;
      color: #2563eb; transition: color .2s;
    }
    .auth-magic-btn:hover { color: #1d4ed8; }

    /* Magic link panel */
    .auth-magic-panel { display: none; margin-top: 12px; }
    .auth-magic-panel.visible { display: block; }

    /* Messages */
    .auth-msg {
      margin-top: 12px; padding: 10px 12px; border-radius: 8px;
      font-size: 12.5px; line-height: 1.4; text-align: center;
      animation: authFadeIn .3s ease;
    }
    @keyframes authFadeIn { from { opacity: 0; } to { opacity: 1; } }
    .auth-msg.error { background: #fef2f2; color: #dc2626; }
    .auth-msg.success { background: #f0fdf4; color: #16a34a; }
    .auth-msg.info { background: #eff6ff; color: #2563eb; }

    /* Footer */
    .auth-footer {
      padding: 16px 32px; background: #f8fafc;
      text-align: center; font-size: 11px; color: #94a3b8;
    }

    /* Logout button in sidebar */
    .sb-logout {
      display: flex; align-items: center; gap: 8px;
      width: 100%; padding: 7px 14px; border: none;
      background: none; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 12px;
      color: #94a3b8; transition: color .15s;
      margin-bottom: 4px;
    }
    .sb-logout:hover { color: #ef4444; }
    #sidebar.collapsed .sb-logout span { display: none; }
    #sidebar.collapsed .sb-logout { justify-content: center; padding: 7px 0; }

    /* User badge in sidebar footer */
    .sb-user-badge {
      display: flex; align-items: center; gap: 8px;
      padding: 0 14px 8px; overflow: hidden;
    }
    .sb-user-avatar {
      width: 26px; height: 26px; border-radius: 50%;
      background: #2563eb; color: #fff; display: flex;
      align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; flex-shrink: 0;
    }
    .sb-user-name {
      font-size: 11.5px; color: #cbd5e1; font-weight: 500;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    #sidebar.collapsed .sb-user-badge { justify-content: center; padding: 0 0 8px; }
    #sidebar.collapsed .sb-user-name { display: none; }

    /* Responsive */
    @media (max-width: 640px) {
      .auth-card { margin: 12px; }
      .auth-header { padding: 28px 24px 20px; }
      .auth-body { padding: 0 24px 24px; }
      .auth-footer { padding: 14px 24px; }
    }
  `;
  document.head.appendChild(s);
}

/* ── Google SVG logo ── */
var GOOGLE_LOGO_SVG = '<svg width="18" height="18" viewBox="0 0 24 24">' +
  '<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>' +
  '<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>' +
  '<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>' +
  '<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>' +
  '</svg>';

/* ── Render login screen ── */
function renderAuthScreen() {
  injectAuthStyles();

  var screen = document.getElementById('auth-screen');
  if (!screen) {
    screen = document.createElement('div');
    screen.id = 'auth-screen';
    document.body.appendChild(screen);
  }

  screen.innerHTML =
    '<div class="auth-card">' +
      '<div class="auth-header">' +
        '<div class="auth-brand">MickaCRM<span class="auth-360">360</span></div>' +
        '<div class="auth-subtitle">Construction CRM Platform</div>' +
      '</div>' +
      '<div class="auth-body">' +
        /* Tabs */
        '<div class="auth-tabs">' +
          '<button class="auth-tab active" data-tab="login">Sign In</button>' +
          '<button class="auth-tab" data-tab="signup">Create Account</button>' +
        '</div>' +
        /* Login form */
        '<div id="auth-form-login">' +
          '<div class="auth-field"><label>Email</label>' +
            '<input type="email" id="auth-email" placeholder="you@company.com" autocomplete="email" /></div>' +
          '<div class="auth-field"><label>Password</label>' +
            '<input type="password" id="auth-password" placeholder="Enter your password" autocomplete="current-password" /></div>' +
          '<button class="auth-btn-primary" id="auth-btn-login">Sign In</button>' +
          '<div style="text-align:right;margin-top:8px">' +
            '<button class="auth-magic-btn" id="auth-forgot-btn" style="font-size:11.5px;color:#64748b">Forgot password?</button>' +
          '</div>' +
        '</div>' +
        /* Signup form (hidden) */
        '<div id="auth-form-signup" style="display:none">' +
          '<div class="auth-field"><label>Full Name</label>' +
            '<input type="text" id="auth-name" placeholder="John Doe" autocomplete="name" /></div>' +
          '<div class="auth-field"><label>Email</label>' +
            '<input type="email" id="auth-signup-email" placeholder="you@company.com" autocomplete="email" /></div>' +
          '<div class="auth-field"><label>Password</label>' +
            '<input type="password" id="auth-signup-password" placeholder="Min. 6 characters" autocomplete="new-password" /></div>' +
          '<button class="auth-btn-primary" id="auth-btn-signup">Create Account</button>' +
        '</div>' +
        /* Divider */
        '<div class="auth-divider">or</div>' +
        /* Google */
        '<button class="auth-btn-google" id="auth-btn-google">' + GOOGLE_LOGO_SVG + ' Continue with Google</button>' +
        /* Magic Link */
        '<div class="auth-magic">' +
          '<button class="auth-magic-btn" id="auth-magic-toggle">Sign in with Magic Link</button>' +
          '<div class="auth-magic-panel" id="auth-magic-panel">' +
            '<div class="auth-field" style="margin-top:10px"><label>Email</label>' +
              '<input type="email" id="auth-magic-email" placeholder="you@company.com" /></div>' +
            '<button class="auth-btn-primary" id="auth-btn-magic" style="background:#7c3aed">Send Magic Link</button>' +
          '</div>' +
        '</div>' +
        /* Message area */
        '<div id="auth-msg"></div>' +
      '</div>' +
      '<div class="auth-footer">Powered by Firebase Authentication</div>' +
    '</div>';

  /* ── Wire tabs ── */
  screen.querySelectorAll('.auth-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      screen.querySelectorAll('.auth-tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var isLogin = tab.dataset.tab === 'login';
      document.getElementById('auth-form-login').style.display = isLogin ? 'block' : 'none';
      document.getElementById('auth-form-signup').style.display = isLogin ? 'none' : 'block';
      clearAuthMsg();
    });
  });

  /* ── Wire magic link toggle ── */
  document.getElementById('auth-magic-toggle').addEventListener('click', function() {
    var panel = document.getElementById('auth-magic-panel');
    panel.classList.toggle('visible');
    this.textContent = panel.classList.contains('visible') ? 'Hide Magic Link' : 'Sign in with Magic Link';
  });

  /* ── Wire login ── */
  document.getElementById('auth-btn-login').addEventListener('click', function() {
    var email = document.getElementById('auth-email').value.trim();
    var pwd = document.getElementById('auth-password').value;
    if (!email || !pwd) return showAuthMsg('Please fill in all fields', 'error');
    setAuthLoading(this, true);
    firebase.auth().signInWithEmailAndPassword(email, pwd)
      .then(function() { /* onAuthStateChanged handles it */ })
      .catch(function(err) { showAuthMsg(authErrorMsg(err.code), 'error'); setAuthLoading(document.getElementById('auth-btn-login'), false); });
  });

  /* ── Wire signup ── */
  document.getElementById('auth-btn-signup').addEventListener('click', function() {
    var name = document.getElementById('auth-name').value.trim();
    var email = document.getElementById('auth-signup-email').value.trim();
    var pwd = document.getElementById('auth-signup-password').value;
    if (!name || !email || !pwd) return showAuthMsg('Please fill in all fields', 'error');
    if (pwd.length < 6) return showAuthMsg('Password must be at least 6 characters', 'error');
    setAuthLoading(this, true);
    firebase.auth().createUserWithEmailAndPassword(email, pwd)
      .then(function(cred) {
        return cred.user.updateProfile({ displayName: name });
      })
      .then(function() { /* onAuthStateChanged handles it */ })
      .catch(function(err) { showAuthMsg(authErrorMsg(err.code), 'error'); setAuthLoading(document.getElementById('auth-btn-signup'), false); });
  });

  /* ── Wire Google Sign-In ── */
  document.getElementById('auth-btn-google').addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(function() { /* onAuthStateChanged handles it */ })
      .catch(function(err) {
        if (err.code !== 'auth/popup-closed-by-user') {
          showAuthMsg(authErrorMsg(err.code), 'error');
        }
      });
  });

  /* ── Wire Magic Link ── */
  document.getElementById('auth-btn-magic').addEventListener('click', function() {
    var email = document.getElementById('auth-magic-email').value.trim();
    if (!email) return showAuthMsg('Please enter your email', 'error');
    setAuthLoading(this, true);
    var actionCodeSettings = {
      url: window.location.origin + window.location.pathname,
      handleCodeInApp: true
    };
    firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
      .then(function() {
        window.localStorage.setItem('authMagicEmail', email);
        showAuthMsg('Magic link sent! Check your inbox.', 'success');
        setAuthLoading(document.getElementById('auth-btn-magic'), false);
      })
      .catch(function(err) { showAuthMsg(authErrorMsg(err.code), 'error'); setAuthLoading(document.getElementById('auth-btn-magic'), false); });
  });

  /* ── Wire Forgot Password ── */
  document.getElementById('auth-forgot-btn').addEventListener('click', function() {
    var email = document.getElementById('auth-email').value.trim();
    if (!email) return showAuthMsg('Enter your email first, then click Forgot Password', 'info');
    firebase.auth().sendPasswordResetEmail(email)
      .then(function() { showAuthMsg('Password reset email sent!', 'success'); })
      .catch(function(err) { showAuthMsg(authErrorMsg(err.code), 'error'); });
  });

  /* ── Enter key on password → login ── */
  document.getElementById('auth-password').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') document.getElementById('auth-btn-login').click();
  });
  document.getElementById('auth-signup-password').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') document.getElementById('auth-btn-signup').click();
  });
}

/* ── Helpers ── */
function showAuthMsg(text, type) {
  var el = document.getElementById('auth-msg');
  if (el) { el.className = 'auth-msg ' + (type || 'info'); el.textContent = text; }
}
function clearAuthMsg() {
  var el = document.getElementById('auth-msg');
  if (el) { el.className = ''; el.textContent = ''; }
}
function setAuthLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  btn.dataset.origText = btn.dataset.origText || btn.textContent;
  btn.textContent = loading ? 'Please wait…' : btn.dataset.origText;
}

function authErrorMsg(code) {
  var map = {
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-credential': 'Invalid email or password',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/popup-blocked': 'Popup blocked. Allow popups and try again.'
  };
  return map[code] || 'Authentication error. Please try again.';
}

/* ── Complete Magic Link sign-in (if returning from email link) ── */
function completeMagicLinkSignIn() {
  if (!firebase.auth().isSignInWithEmailLink(window.location.href)) return;
  var email = window.localStorage.getItem('authMagicEmail');
  if (!email) {
    email = window.prompt('Please confirm your email for sign-in:');
  }
  if (!email) return;
  firebase.auth().signInWithEmailLink(email, window.location.href)
    .then(function() {
      window.localStorage.removeItem('authMagicEmail');
      /* Clean URL */
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    })
    .catch(function(err) {
      console.error('[Auth] Magic link error:', err);
    });
}

/* ── Hide login screen with animation ── */
function hideAuthScreen() {
  var screen = document.getElementById('auth-screen');
  if (screen) {
    screen.classList.add('auth-hidden');
    setTimeout(function() { screen.remove(); }, 500);
  }
}

/* ── Show app shell ── */
function showAppShell() {
  document.getElementById('app-shell').style.display = 'flex';
}

/* ── Logout ── */
function authLogout() {
  firebase.auth().signOut().then(function() {
    /* Reset app state */
    AUTH_USER = null;
    currentPage = 'home';
    currentRecordObj = null;
    currentRecordId = null;
    document.getElementById('app-shell').style.display = 'none';
    renderAuthScreen();
  });
}

/* ── Get user initials ── */
function authUserInitials() {
  if (!AUTH_USER) return '?';
  var name = AUTH_USER.displayName || AUTH_USER.email || '';
  var parts = name.split(/[\s@]+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (name[0] || '?').toUpperCase();
}

function authUserDisplayName() {
  if (!AUTH_USER) return 'User';
  return AUTH_USER.displayName || AUTH_USER.email.split('@')[0] || 'User';
}
