/* app.js — Init with Firebase Auth + Firestore */
document.addEventListener('DOMContentLoaded', function() {

  /* ── 1. Hide app shell until authenticated ── */
  document.getElementById('app-shell').style.display = 'none';

  /* ── 2. Check for magic link return ── */
  completeMagicLinkSignIn();

  /* ── 3. Show login screen immediately ── */
  renderAuthScreen();

  /* ── 4. Listen for auth state changes ── */
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      /* ✅ Authenticated */
      AUTH_USER = user;
      console.log('[Auth] Signed in as', user.email);

      /* Hide login, show app */
      hideAuthScreen();
      showAppShell();

      /* Render sidebar (with user badge + logout) */
      renderSidebar();

      /* Show loading while Firestore loads */
      var content = document.getElementById('page-content');
      content.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:60vh;gap:10px;color:var(--text-light);font-size:13px">' +
        '<div style="width:18px;height:18px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .6s linear infinite"></div>' +
        'Loading from Firestore...</div>';

      /* Inject spinner keyframe */
      if (!document.getElementById('fb-spin-css')) {
        var s = document.createElement('style');
        s.id = 'fb-spin-css';
        s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
        document.head.appendChild(s);
      }

      /* Load Firestore data */
      fbLoadAll().then(function(totalDocs) {
        if (totalDocs === 0) {
          console.log('[App] Firestore empty — seeding mock data...');
          fbShowStatus('Seeding Firestore with demo data...');
          return fbSeedIfEmpty().then(function() {
            return fbLoadAll();
          });
        }
        return totalDocs;
      }).then(function() {
        fbShowStatus('Connected to Firestore');
        /* Seed + load users collection for User Management */
        if (typeof umSeedUsers === 'function') {
          return umSeedUsers().then(function(){ return umLoadUsers(); }).then(function(){ return umLoadAudit(); });
        }
      }).then(function() {
        renderCurrentPage();
        renderFloatingChat();
      }).catch(function(err) {
        console.error('[App] Firestore error, using mock data:', err);
        fbShowStatus('Offline — using local data', true);
        renderCurrentPage();
        renderFloatingChat();
      });

    } else {
      /* ❌ Not authenticated */
      AUTH_USER = null;
      document.getElementById('app-shell').style.display = 'none';
      /* If auth screen isn't showing, re-render it */
      if (!document.getElementById('auth-screen')) {
        renderAuthScreen();
      }
    }
  });
});
