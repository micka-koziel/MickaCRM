/* js/core/errors.js — Gestion centralisée des erreurs et toasts
 * Dépendances : namespace.js, helpers.js
 * Expose : MickaCRM.core.{handleError, showToast, showStatus}
 */
(function(){
  var core = MickaCRM.core;

  /* ─── Conteneur toasts (créé à la demande) ─────────────── */
  function ensureToastRoot(){
    var root = document.getElementById('mc-toast-root');
    if (root) return root;
    root = document.createElement('div');
    root.id = 'mc-toast-root';
    root.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:8px;pointer-events:none';
    document.body.appendChild(root);
    return root;
  }

  /* ─── Affiche un toast ──────────────────────────────────── */
  function showToast(message, type, duration){
    type = type || 'info'; // info | success | error | warning
    duration = duration || 3000;
    var colors = {
      info:    {bg:'#eff6ff', fg:'#1e40af', bd:'#bfdbfe'},
      success: {bg:'#ecfdf5', fg:'#065f46', bd:'#a7f3d0'},
      error:   {bg:'#fef2f2', fg:'#991b1b', bd:'#fecaca'},
      warning: {bg:'#fffbeb', fg:'#92400e', bd:'#fde68a'}
    };
    var c = colors[type] || colors.info;
    var root = ensureToastRoot();
    var el = document.createElement('div');
    el.style.cssText = 'background:'+c.bg+';color:'+c.fg+';border:1px solid '+c.bd+';padding:10px 14px;border-radius:8px;font-size:13px;font-family:"DM Sans",sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.08);pointer-events:auto;max-width:360px;animation:mcToastIn .2s ease';
    el.textContent = message;
    root.appendChild(el);
    setTimeout(function(){
      el.style.transition = 'opacity .2s, transform .2s';
      el.style.opacity = '0';
      el.style.transform = 'translateX(20px)';
      setTimeout(function(){ el.remove(); }, 220);
    }, duration);

    if (!document.getElementById('mc-toast-css')) {
      var s = document.createElement('style');
      s.id = 'mc-toast-css';
      s.textContent = '@keyframes mcToastIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}';
      document.head.appendChild(s);
    }
  }

  /* ─── handleError : toast + console ─────────────────────── */
  function handleError(err, context){
    var msg = (err && err.message) ? err.message : String(err);
    console.error('[MickaCRM]' + (context ? ' ['+context+']' : ''), err);
    showToast((context ? context + ' : ' : '') + msg, 'error', 5000);
  }

  /* ─── showStatus : bandeau discret en bas d'écran ───────── */
  function showStatus(message, isError){
    var el = document.getElementById('mc-status-bar');
    if (!el) {
      el = document.createElement('div');
      el.id = 'mc-status-bar';
      el.style.cssText = 'position:fixed;bottom:12px;left:50%;transform:translateX(-50%);padding:6px 14px;border-radius:20px;font-size:12px;font-family:"DM Sans",sans-serif;z-index:9998;transition:opacity .3s';
      document.body.appendChild(el);
    }
    el.style.background = isError ? '#fef2f2' : '#f0fdf4';
    el.style.color = isError ? '#991b1b' : '#166534';
    el.style.border = '1px solid ' + (isError ? '#fecaca' : '#bbf7d0');
    el.textContent = message;
    el.style.opacity = '1';
    clearTimeout(el._timer);
    el._timer = setTimeout(function(){ el.style.opacity = '0'; }, 3000);
  }

  core.handleError = handleError;
  core.showToast = showToast;
  core.showStatus = showStatus;

  // Backward-compat
  window.fbShowStatus = showStatus;
})();
