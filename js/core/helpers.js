/* js/core/helpers.js — Helpers utilitaires
 * Dépendances : namespace.js
 * Expose : MickaCRM.core.{$, $$, escapeHTML, fmtAmount, fmtDate, fmtDateTime,
 *                        initials, toISODate, clamp, debounce, uid}
 *
 * Backward-compat : expose aussi en globales (fmtAmount, ...) le temps de la migration.
 */
(function(){
  var core = MickaCRM.core;

  /* ─── DOM ─────────────────────────────────────────────── */
  function $(sel, root){ return (root || document).querySelector(sel); }
  function $$(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ─── Sécurité : échappement HTML ─────────────────────── */
  function escapeHTML(s){
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ─── Formatage montants ──────────────────────────────── */
  function fmtAmount(n, currency){
    if (n == null || isNaN(n)) return '—';
    var cur = currency || '€';
    var num = Number(n);
    if (Math.abs(num) >= 1000000) return (num/1000000).toFixed(1).replace('.0','') + 'M' + cur;
    if (Math.abs(num) >= 1000)    return (num/1000).toFixed(1).replace('.0','') + 'k' + cur;
    return num.toLocaleString('fr-FR') + cur;
  }

  /* ─── Formatage dates ─────────────────────────────────── */
  function fmtDate(d){
    if (!d) return '—';
    var date = (d instanceof Date) ? d : new Date(d);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString(MickaCRM.state.locale === 'en' ? 'en-GB' : 'fr-FR');
  }

  function fmtDateTime(d){
    if (!d) return '—';
    var date = (d instanceof Date) ? d : new Date(d);
    if (isNaN(date.getTime())) return '—';
    var loc = MickaCRM.state.locale === 'en' ? 'en-GB' : 'fr-FR';
    return date.toLocaleDateString(loc) + ' ' + date.toLocaleTimeString(loc, {hour:'2-digit', minute:'2-digit'});
  }

  function toISODate(d){
    var date = (d instanceof Date) ? d : new Date(d);
    if (isNaN(date.getTime())) return '';
    var m = String(date.getMonth()+1).padStart(2,'0');
    var day = String(date.getDate()).padStart(2,'0');
    return date.getFullYear() + '-' + m + '-' + day;
  }

  /* ─── Initiales ───────────────────────────────────────── */
  function initials(name){
    if (!name) return '??';
    var parts = String(name).trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
    return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
  }

  /* ─── Utils ───────────────────────────────────────────── */
  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

  function debounce(fn, delay){
    var timer = null;
    return function(){
      var args = arguments, self = this;
      clearTimeout(timer);
      timer = setTimeout(function(){ fn.apply(self, args); }, delay);
    };
  }

  function uid(prefix){
    return (prefix || 'id') + '-' + Math.random().toString(36).slice(2, 10);
  }

  /* ─── Expose core ─────────────────────────────────────── */
  core.$ = $;
  core.$$ = $$;
  core.escapeHTML = escapeHTML;
  core.fmtAmount = fmtAmount;
  core.fmtDate = fmtDate;
  core.fmtDateTime = fmtDateTime;
  core.toISODate = toISODate;
  core.initials = initials;
  core.clamp = clamp;
  core.debounce = debounce;
  core.uid = uid;

  /* ─── Backward-compat (globals historiques) ───────────── */
  window.fmtAmount = fmtAmount;
  window.escapeHTML = escapeHTML;
})();
