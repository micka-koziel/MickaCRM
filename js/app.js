/* app.js — Init with Firebase */
document.addEventListener('DOMContentLoaded', function() {
  renderSidebar();

  /* Show a loading state while Firestore loads */
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

  /* 1. Try loading from Firestore */
  fbLoadAll().then(function(totalDocs) {
    if (totalDocs === 0) {
      /* 2. Firestore is empty → seed from mock data, then reload */
      console.log('[App] Firestore empty — seeding mock data...');
      fbShowStatus('Seeding Firestore with demo data...');
      return fbSeedIfEmpty().then(function() {
        return fbLoadAll();
      });
    }
    return totalDocs;
  }).then(function() {
    /* 3. Render the app */
    fbShowStatus('Connected to Firestore');
    renderCurrentPage();
  }).catch(function(err) {
    /* 4. Fallback: use mock data if Firestore fails */
    console.error('[App] Firestore error, using mock data:', err);
    fbShowStatus('Offline — using local data', true);
    renderCurrentPage();
  });
});
