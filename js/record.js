/* ═══════════════════════════════════════════════════════
   record.js — Command Center Standard v2
   Premium 360 views with tabbed related objects
   Account 360 + Contact 360 + Lead 360 + Opp 360 + Product 360 + Generic
   ═══════════════════════════════════════════════════════ */

/* ── Router ── */
function renderRecordPage(objKey, recId, headerEl, contentEl) {
  var data = objKey === 'users' ? (typeof UM_USERS !== 'undefined' ? UM_USERS : []) : window.DATA[objKey];
  if (!data) { contentEl.innerHTML = '<div class="placeholder-view">Object not found</div>'; return; }
  var rec = data.find(function(r) { return r.id === recId; });
  if (!rec) { contentEl.innerHTML = '<div class="placeholder-view">Record not found</div>'; return; }

  headerEl.style.display = 'none';

  if (objKey === 'accounts')      { renderAccount360(contentEl, rec); return; }
  if (objKey === 'contacts')      { renderContact360(contentEl, rec); return; }
  if (objKey === 'leads')         { renderLead360(contentEl, rec); return; }
  if (objKey === 'opportunities') { renderOpp360(contentEl, rec); return; }

  if (objKey === 'projects') {
    if (typeof renderProject360 === 'function') { renderProject360(contentEl, rec); }
    else { contentEl.innerHTML = '<div class="placeholder-view">Project 360 module not loaded.</div>'; }
    return;
  }
  if (objKey === 'quotes') {
    var qHtml = renderQuote360(rec);
    contentEl.innerHTML = qHtml;
    bindQuote360Events(contentEl);
    return;
  }
  if (objKey === 'claims') {
    if (typeof renderClaim360 === 'function') { renderClaim360(contentEl, rec); }
    else { contentEl.innerHTML = '<div class="placeholder-view">Claim 360 module not loaded.</div>'; }
    return;
  }
  if (objKey === 'activities') {
    if (typeof renderActivity360 === 'function') { renderActivity360(contentEl, rec); }
    else { contentEl.innerHTML = '<div class="placeholder-view">Activity 360 module not loaded.</div>'; }
    return;
  }
  if (objKey === 'products') { renderProduct360(contentEl, rec); return; }
  if (objKey === 'users') {
    if (typeof renderUser360 === 'function') { renderUser360(contentEl, rec); }
    else { contentEl.innerHTML = '<div class="placeholder-view">User 360 module not loaded.</div>'; }
    return;
  }

  renderGenericRecord(objKey, rec, headerEl, contentEl);
}


/* ═══════════════════════════════════════════════════════
   COMMAND CENTER — Shared Infrastructure
   Premium tab system, KPI boxes, related tables
   ═══════════════════════════════════════════════════════ */

function ccInjectStyles() {
  if (document.getElementById('cc-css')) return;
  var s = document.createElement('style'); s.id = 'cc-css';
  s.textContent = '\
/* Command Center — Shared Styles */\n\
.cc-wrap{max-width:1200px;margin:0 auto;padding:16px 24px 48px}\
.cc-back{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;color:var(--text-muted);cursor:pointer;padding:4px 0;margin-bottom:10px;transition:color .12s}\
.cc-back:hover{color:var(--accent)}\
\
/* Header Card */\
.cc-header{background:var(--card);border-radius:14px;border:1px solid var(--border);box-shadow:0 1px 4px rgba(0,0,0,.04);margin-bottom:14px;padding:24px 28px}\
.cc-header-top{display:flex;gap:18px;align-items:center}\
.cc-avatar{width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;border:1px solid #E6E8EC;box-shadow:0 2px 8px rgba(0,0,0,.06);transition:transform .18s}\
.cc-avatar-initials{background:linear-gradient(135deg,#e0e7ff,#dbeafe);font-size:22px;font-weight:800;color:var(--accent);letter-spacing:-.5px}\
.cc-avatar-img img{width:100%;height:100%;object-fit:cover}\
.cc-photo-wrap{position:relative;cursor:pointer;flex-shrink:0}\
.cc-photo-wrap:hover .cc-avatar{transform:scale(1.05)}\
.cc-photo-overlay{position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s}\
.cc-photo-wrap:hover .cc-photo-overlay{opacity:1}\
.cc-header-info{flex:1;min-width:0}\
.cc-name{font-size:24px;font-weight:700;color:var(--text);letter-spacing:-.4px;margin:0;line-height:1.15}\
.cc-badge{display:inline-block;padding:3px 12px;border-radius:20px;font-size:11px;font-weight:500;border:1px solid #d0d5dd;color:var(--text-muted);margin-left:10px}\
.cc-badge-green{border-color:#a7f3d0;color:#059669;background:#ecfdf5}\
.cc-badge-blue{border-color:#bfdbfe;color:#2563eb;background:#eff6ff}\
.cc-badge-orange{border-color:#fde68a;color:#d97706;background:#fffbeb}\
.cc-badge-red{border-color:#fecaca;color:#dc2626;background:#fef2f2}\
.cc-subtitle{display:flex;gap:14px;font-size:13px;color:var(--text-muted);margin-top:5px;flex-wrap:wrap}\
.cc-subtitle a,.cc-subtitle .cc-link{color:var(--accent);cursor:pointer;font-weight:500}\
.cc-subtitle .cc-link:hover{text-decoration:underline}\
.cc-summary-pills{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}\
.cc-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:8px;background:#f0f4ff;font-size:11.5px;color:#3b5998;font-weight:500}\
.cc-header-actions{display:flex;gap:6px;flex-shrink:0;align-items:center}\
\
/* Outline Button (unified) */\
.cc-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 16px;border-radius:8px;border:1px solid var(--border);background:var(--card);font-size:12px;font-weight:500;color:var(--text-muted);cursor:pointer;font-family:inherit;transition:all .12s}\
.cc-btn:hover{background:#f9fafb;border-color:#c8cad0}\
.cc-btn:active{transform:scale(.97)}\
.cc-btn-sq{width:38px;height:36px;padding:0;justify-content:center}\
.cc-btn-danger{color:#ef4444;border-color:#fecaca}\
.cc-btn-danger:hover{background:#fef2f2;border-color:#ef4444}\
.cc-btn-primary{background:var(--accent);color:#fff;border:none}\
.cc-btn-primary:hover{background:var(--accent-hover)}\
\
/* KPI Object Boxes */\
.cc-kpi-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:14px}\
.cc-kpi-box{background:var(--card);border-radius:12px;border:1px solid var(--border);padding:16px 18px;cursor:pointer;transition:all .15s;box-shadow:0 1px 3px rgba(0,0,0,.03)}\
.cc-kpi-box:hover{box-shadow:0 4px 16px rgba(0,0,0,.06);transform:translateY(-1px);border-color:#c8cad0}\
.cc-kpi-box.cc-kpi-active{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent),0 4px 12px rgba(37,99,235,.08)}\
.cc-kpi-head{display:flex;align-items:center;gap:7px;margin-bottom:10px}\
.cc-kpi-icon{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}\
.cc-kpi-label{font-size:12px;font-weight:500;color:var(--text-muted)}\
.cc-kpi-active .cc-kpi-label{color:var(--accent)}\
.cc-kpi-val{font-size:26px;font-weight:700;color:var(--text);line-height:1;letter-spacing:-.5px}\
.cc-kpi-trend{font-size:11px;font-weight:600;margin-top:5px;display:flex;align-items:center;gap:4px}\
.cc-kpi-sub{font-size:11px;color:var(--text-light);margin-top:4px}\
\
/* Tab Bar */\
.cc-tabs{display:flex;gap:0;border-bottom:2px solid var(--border);padding-left:6px;overflow-x:auto;background:var(--card);border-radius:14px 14px 0 0}\
.cc-tab{padding:12px 20px;font-size:13px;cursor:pointer;white-space:nowrap;font-weight:400;color:var(--text-muted);border-bottom:2.5px solid transparent;margin-bottom:-2px;transition:all .1s;display:flex;align-items:center;gap:7px}\
.cc-tab:hover{color:var(--text)}\
.cc-tab.cc-tab-active{font-weight:600;color:var(--accent);border-bottom-color:var(--accent)}\
.cc-tab-count{font-size:10px;font-weight:500;padding:1px 7px;border-radius:10px;background:#f3f4f6;color:var(--text-light)}\
.cc-tab.cc-tab-active .cc-tab-count{background:#dbeafe;color:var(--accent)}\
.cc-tab-content{background:var(--card);border-radius:0 0 14px 14px;border:1px solid var(--border);border-top:none;padding:24px 28px;min-height:280px}\
.cc-section{display:none}\
.cc-section.cc-visible{display:block}\
\
/* Related Table */\
.cc-rel-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}\
.cc-rel-title{font-size:15px;font-weight:600;color:var(--text)}\
.cc-rel-count{font-weight:400;color:var(--text-light)}\
.cc-rel-th{display:grid;padding:8px 0;border-bottom:2px solid var(--border)}\
.cc-rel-th span{font-size:11px;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.3px}\
.cc-rel-row{display:grid;padding:11px 0;border-bottom:1px solid #f3f4f6;cursor:pointer;transition:background .08s}\
.cc-rel-row:hover{background:#fafbfc}\
.cc-rel-row span{font-size:12.5px;color:var(--text-muted);display:flex;align-items:center}\
.cc-rel-row .cc-rel-primary{font-weight:500;color:var(--text)}\
.cc-rel-row .cc-rel-bold{font-weight:600;color:var(--text)}\
.cc-rel-row .cc-rel-link{color:var(--accent)}\
.cc-rel-badge{display:inline-block;padding:2px 10px;border-radius:6px;font-size:11px;font-weight:500}\
.cc-rel-empty{padding:24px;text-align:center;color:var(--text-light);font-size:12px}\
\
/* Details — 2-col layout */\
.cc-details-grid{display:grid;grid-template-columns:32% 68%;gap:18px;align-items:start}\
.cc-details-card{background:var(--card);border-radius:12px;border:1px solid var(--border);padding:20px 22px;box-shadow:0 1px 3px rgba(0,0,0,.03);transition:box-shadow .15s}\
.cc-details-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.05)}\
.cc-details-card-title{font-size:14px;font-weight:600;color:var(--text);margin-bottom:16px}\
.cc-field{padding:10px 0;border-bottom:1px solid #f3f4f6}\
.cc-field:last-child{border-bottom:none}\
.cc-field-label{font-size:10.5px;font-weight:600;color:var(--text-light);letter-spacing:.6px;text-transform:uppercase;margin-bottom:3px}\
.cc-field-value{font-size:13.5px;color:var(--text)}\
.cc-field-link{color:var(--accent);font-weight:500;cursor:pointer}\
.cc-field-link:hover{text-decoration:underline}\
\
/* Insight cards */\
.cc-insights-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}\
.cc-insight-card{background:var(--card);border-radius:12px;border:1px solid var(--border);padding:20px 22px;box-shadow:0 1px 3px rgba(0,0,0,.03);transition:box-shadow .15s}\
.cc-insight-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.05)}\
.cc-progress{height:7px;background:#e5e7eb;border-radius:4px;overflow:hidden;margin-bottom:8px}\
.cc-progress-fill{height:100%;border-radius:4px;background:var(--accent);transition:width .6s ease}\
.cc-mini-chart{display:flex;align-items:flex-end;gap:3px;height:48px;margin-top:12px}\
.cc-mini-bar{flex:1;border-radius:3px;transition:height .3s}\
\
/* Next Best Action */\
.cc-nba{border-radius:14px;padding:22px 26px;background:linear-gradient(135deg,#f0f4ff 0%,#e8f0fe 100%);border:1px solid #d6e4ff;margin-top:14px;display:flex;align-items:flex-start;gap:20px}\
.cc-nba-body{flex:1}\
.cc-nba-tag{font-size:11px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px}\
.cc-nba-title{font-size:17px;font-weight:700;color:var(--text);line-height:1.3;margin-bottom:4px}\
.cc-nba-desc{font-size:13px;color:var(--text-muted);margin-bottom:14px;line-height:1.5}\
.cc-nba-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0}\
.cc-nba-urgency{font-size:11px;font-weight:500;padding:3px 10px;border-radius:6px;background:#fef2f2;color:#dc2626}\
.cc-nba-due{font-size:12px;color:var(--text-muted)}\
\
/* Owner card */\
.cc-owner-card{background:var(--card);border-radius:12px;border:1px solid var(--border);padding:16px 22px;display:flex;align-items:center;gap:14px;box-shadow:0 1px 3px rgba(0,0,0,.03)}\
.cc-owner-avatar{width:40px;height:40px;border-radius:50%;background:#475467;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:#fff;flex-shrink:0}\
\
/* Activity Timeline */\
.cc-timeline{padding:4px 0}\
.cc-tl-item{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #f3f4f6}\
.cc-tl-item:last-child{border-bottom:none}\
.cc-tl-icon{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}\
.cc-tl-body{flex:1;min-width:0}\
.cc-tl-title{font-size:13px;font-weight:500;color:var(--text)}\
.cc-tl-date{font-size:11px;color:var(--text-light);margin-top:2px}\
.cc-tl-desc{font-size:12px;color:var(--text-muted);margin-top:4px;line-height:1.5}\
\
/* Pipeline/Funnel Bar */\
.cc-funnel{display:flex;gap:3px;margin-top:18px;margin-bottom:4px}\
.cc-funnel-seg{flex:1;height:5px;border-radius:3px;transition:background .3s}\
.cc-funnel-labels{display:flex;margin-top:5px}\
.cc-funnel-labels span{flex:1;font-size:9.5px;text-align:center;color:var(--text-light)}\
.cc-funnel-labels .cc-funnel-current{color:var(--accent);font-weight:700}\
\
/* Contact avatar in tables */\
.cc-contact-av{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#fff;flex-shrink:0}\
\
/* Responsive */\
@media(max-width:1100px){\
  .cc-kpi-grid{grid-template-columns:repeat(3,1fr)}\
  .cc-details-grid{grid-template-columns:1fr}\
  .cc-insights-grid{grid-template-columns:1fr}\
  .cc-header-top{flex-wrap:wrap}\
}\
@media(max-width:768px){\
  .cc-kpi-grid{grid-template-columns:repeat(2,1fr)}\
  .cc-tabs{padding-left:2px}\
  .cc-tab{padding:10px 14px;font-size:12px}\
  .cc-tab-content{padding:16px 14px}\
}\
@media(max-width:640px){\
  .cc-wrap{padding:10px 10px 32px}\
  .cc-header{padding:16px 14px}\
  .cc-name{font-size:18px}\
  .cc-avatar{width:48px;height:48px;font-size:16px}\
  .cc-kpi-val{font-size:20px}\
  .cc-kpi-grid{grid-template-columns:1fr 1fr}\
}\
';
  document.head.appendChild(s);
}


/* ─── Command Center Helpers ─── */

/* KPI Box HTML */
function ccKpiBox(icon, iconBg, label, valueHtml, subHtml, tabId) {
  return '<div class="cc-kpi-box" data-cc-tab="' + tabId + '" onclick="ccSwitchTab(this,\'' + tabId + '\')">' +
    '<div class="cc-kpi-head">' +
    '<div class="cc-kpi-icon" style="background:' + iconBg + '">' + svgIcon(icon, 15, iconBg.replace(/14$/, '').replace('#f0f4ff', '#2563eb').replace('#ecfdf5', '#059669').replace('#fef7ec', '#d97706').replace('#fef3f2', '#dc2626').replace('#f3f0ff', '#7c3aed')) + '</div>' +
    '<span class="cc-kpi-label">' + label + '</span>' +
    '</div>' +
    '<div>' + valueHtml + '</div>' +
    (subHtml ? '<div class="cc-kpi-sub">' + subHtml + '</div>' : '') +
    '</div>';
}

/* Tab HTML */
function ccTab(id, label, icon, count) {
  return '<div class="cc-tab" data-cc-tab="' + id + '" onclick="ccSwitchTab(this,\'' + id + '\')">' +
    svgIcon(icon, 14, 'currentColor') + ' ' + label +
    (count !== undefined && count !== null ? ' <span class="cc-tab-count">' + count + '</span>' : '') +
    '</div>';
}

/* Related Table Header + Rows */
function ccRelatedTable(title, count, newLabel, gridCols, headers, rows) {
  var h = '<div class="cc-rel-header">';
  h += '<span class="cc-rel-title">' + title + ' <span class="cc-rel-count">(' + count + ')</span></span>';
  h += '<button class="cc-btn" onclick="event.stopPropagation()">' + svgIcon('plus', 13, 'var(--text-light)') + ' ' + newLabel + '</button>';
  h += '</div>';
  h += '<div class="cc-rel-th" style="grid-template-columns:' + gridCols + '">';
  headers.forEach(function(hd) {
    h += '<span' + (hd.right ? ' style="text-align:right"' : '') + '>' + hd.label + '</span>';
  });
  h += '</div>';
  rows.forEach(function(row) {
    h += '<div class="cc-rel-row" style="grid-template-columns:' + gridCols + '"' +
      (row._navObj && row._navId ? ' data-nav-obj="' + row._navObj + '" data-nav-id="' + row._navId + '"' : '') + '>';
    row.cells.forEach(function(cell) {
      h += '<span class="' + (cell.cls || '') + '"' + (cell.style ? ' style="' + cell.style + '"' : '') + '>' + cell.html + '</span>';
    });
    h += '</div>';
  });
  if (!rows.length) {
    h += '<div class="cc-rel-empty">No records found</div>';
  }
  return h;
}

/* Stage badge helper */
function ccStageBadge(value) {
  var m = {
    'Active': { bg: '#ecfdf5', c: '#059669' }, 'Customer': { bg: '#ecfdf5', c: '#059669' },
    'Partner': { bg: '#eff6ff', c: '#2563eb' }, 'Prospect': { bg: '#fffbeb', c: '#d97706' },
    'Inactive': { bg: '#f3f4f6', c: '#6b7280' },
    'Closed Won': { bg: '#ecfdf5', c: '#059669' }, 'closed_won': { bg: '#ecfdf5', c: '#059669' },
    'Negotiation': { bg: '#eff6ff', c: '#2563eb' }, 'negotiation': { bg: '#eff6ff', c: '#2563eb' },
    'Proposal': { bg: '#eff6ff', c: '#2563eb' }, 'proposal': { bg: '#eff6ff', c: '#2563eb' },
    'Study': { bg: '#fffbeb', c: '#d97706' }, 'study': { bg: '#fffbeb', c: '#d97706' },
    'Lead': { bg: '#fffbeb', c: '#d97706' }, 'lead': { bg: '#fffbeb', c: '#d97706' },
    'Tender': { bg: '#f3f0ff', c: '#7c3aed' }, 'tender': { bg: '#f3f0ff', c: '#7c3aed' },
    'launched': { bg: '#ecfdf5', c: '#059669' },
    'Sent': { bg: '#ecfdf5', c: '#059669' }, 'Draft': { bg: '#fffbeb', c: '#d97706' },
    'Won': { bg: '#ecfdf5', c: '#059669' }, 'Accepted': { bg: '#ecfdf5', c: '#059669' },
    'Lost': { bg: '#fef2f2', c: '#dc2626' }, 'Expired': { bg: '#f3f4f6', c: '#6b7280' },
    'Open': { bg: '#fef2f2', c: '#dc2626' }, 'In Progress': { bg: '#eff6ff', c: '#2563eb' },
    'Investigation': { bg: '#fffbeb', c: '#d97706' }, 'Resolved': { bg: '#ecfdf5', c: '#059669' },
    'Closed': { bg: '#f3f4f6', c: '#6b7280' },
    'High': { bg: '#fef2f2', c: '#dc2626' }, 'Critical': { bg: '#fef2f2', c: '#dc2626' },
    'Medium': { bg: '#fffbeb', c: '#d97706' }, 'Low': { bg: '#f3f4f6', c: '#6b7280' },
    'new': { bg: '#eff6ff', c: '#2563eb' }, 'contacted': { bg: '#fffbeb', c: '#d97706' },
    'qualified': { bg: '#ecfdf5', c: '#059669' }, 'converted': { bg: '#ecfdf5', c: '#059669' },
    'Healthy': { bg: '#ecfdf5', c: '#059669' }, 'Attention': { bg: '#fffbeb', c: '#d97706' }, 'At Risk': { bg: '#fef2f2', c: '#dc2626' },
  };
  var s = m[value] || { bg: '#f3f4f6', c: '#6b7280' };
  return '<span class="cc-rel-badge" style="background:' + s.bg + ';color:' + s.c + '">' + value + '</span>';
}

/* Timeline item */
function ccTimelineItem(icon, color, title, date, desc) {
  return '<div class="cc-tl-item">' +
    '<div class="cc-tl-icon" style="background:' + color + '14">' + svgIcon(icon, 14, color) + '</div>' +
    '<div class="cc-tl-body">' +
    '<div class="cc-tl-title">' + title + '</div>' +
    '<div class="cc-tl-date">' + date + '</div>' +
    (desc ? '<div class="cc-tl-desc">' + desc + '</div>' : '') +
    '</div></div>';
}

/* Global tab switch — called by inline onclick on KPI boxes and tabs */
function ccSwitchTab(el, tabId) {
  var wrap = el.closest('.cc-wrap');
  if (!wrap) return;
  wrap.querySelectorAll('.cc-section').forEach(function(s) { s.classList.remove('cc-visible'); });
  wrap.querySelectorAll('.cc-tab').forEach(function(t) { t.classList.remove('cc-tab-active'); });
  wrap.querySelectorAll('.cc-kpi-box').forEach(function(k) { k.classList.remove('cc-kpi-active'); });
  /* Find section by suffix — try all prefixes */
  var sec = wrap.querySelector('.cc-section[id$="-sec-' + tabId + '"]');
  if (sec) sec.classList.add('cc-visible');
  wrap.querySelectorAll('.cc-tab[data-cc-tab="' + tabId + '"]').forEach(function(t) { t.classList.add('cc-tab-active'); });
  wrap.querySelectorAll('.cc-kpi-box[data-cc-tab="' + tabId + '"]').forEach(function(k) { k.classList.add('cc-kpi-active'); });
}

/* Bind tab switching + KPI box clicks + row navigation */
function ccBindTabs(container, prefix) {
  var activeTab = 'details';

  function switchTo(tabId) {
    activeTab = tabId;
    container.querySelectorAll('.cc-section').forEach(function(s) { s.classList.remove('cc-visible'); });
    container.querySelectorAll('.cc-tab').forEach(function(t) { t.classList.remove('cc-tab-active'); });
    container.querySelectorAll('.cc-kpi-box').forEach(function(k) { k.classList.remove('cc-kpi-active'); });
    var sec = container.querySelector('#' + prefix + '-sec-' + tabId);
    if (sec) sec.classList.add('cc-visible');
    container.querySelectorAll('.cc-tab[data-cc-tab="' + tabId + '"]').forEach(function(t) { t.classList.add('cc-tab-active'); });
    container.querySelectorAll('.cc-kpi-box[data-cc-tab="' + tabId + '"]').forEach(function(k) { k.classList.add('cc-kpi-active'); });
  }

  container.querySelectorAll('.cc-tab').forEach(function(t) {
    t.addEventListener('click', function() { switchTo(t.getAttribute('data-cc-tab')); });
  });
  container.querySelectorAll('.cc-kpi-box').forEach(function(k) {
    k.addEventListener('click', function() { switchTo(k.getAttribute('data-cc-tab')); });
  });

  /* Set initial active */
  switchTo('details');

  /* Row navigation */
  container.querySelectorAll('.cc-rel-row[data-nav-id]').forEach(function(el) {
    el.addEventListener('click', function() { navigate('record', el.getAttribute('data-nav-obj'), el.getAttribute('data-nav-id')); });
  });
}


/* ════════════════════════════════════════════════════════
   ACCOUNT 360 — Command Center Standard
   ════════════════════════════════════════════════════════ */

function renderAccount360(container, rec) {
  ccInjectStyles();
  var D = window.DATA;
  var accId = rec.id;
  var accName = rec.name;
  var initials = accName.split(' ').map(function(w) { return w[0]; }).join('').substring(0, 2).toUpperCase();

  /* Related data */
  var contacts = (D.contacts || []).filter(function(c) { return c.account === accId; });
  var opps = (D.opportunities || []).filter(function(o) { return o.account === accId; });
  var projects = (D.projects || []).filter(function(p) { return p.account === accId; });
  var quotes = (D.quotes || []).filter(function(q) { return q.account === accId || q.accountId === accId; });
  var claims = (D.claims || []).filter(function(cl) { return cl.account === accId || cl.accountId === accId; });
  var activities = (D.upcoming || []).slice(0, 6);
  var totalPipe = opps.reduce(function(s, o) { return s + (o.amount || 0); }, 0);
  var pipeStr = typeof fmtAmount === 'function' ? fmtAmount(totalPipe) : (totalPipe / 1e6).toFixed(1) + 'M€';
  var accProducts = typeof _a360GetRelatedProducts === 'function' ? _a360GetRelatedProducts(accId) : [];

  /* Status badge class */
  var badgeCls = rec.status === 'Active' ? 'cc-badge-green' : rec.status === 'Prospect' ? 'cc-badge-orange' : '';

  /* Photo */
  var photoUrl = rec.photoURL || rec.photo || '';

  var h = '<div class="cc-wrap">';

  /* Back nav */
  h += '<div class="cc-back" id="cc-back">' + svgIcon('arrowLeft', 14, 'var(--text-muted)') + ' <span>Accounts</span></div>';

  /* ── HEADER ── */
  h += '<div class="cc-header"><div class="cc-header-top">';
  h += '<div class="cc-photo-wrap" id="cc-photo-wrap">';
  if (photoUrl) {
    h += '<div class="cc-avatar cc-avatar-img" id="cc-avatar"><img src="' + photoUrl + '" alt="' + accName + '" /></div>';
  } else {
    h += '<div class="cc-avatar cc-avatar-initials" id="cc-avatar">' + initials + '</div>';
  }
  h += '<div class="cc-photo-overlay">' + svgIcon('plus', 16, '#fff') + '</div>';
  h += '<input type="file" id="cc-photo-input" accept="image/*" style="display:none" />';
  h += '</div>';

  h += '<div class="cc-header-info">';
  h += '<div style="display:flex;align-items:center">';
  h += '<h1 class="cc-name">' + accName + '</h1>';
  h += '<span class="cc-badge ' + badgeCls + '">' + (rec.status || 'Active') + '</span>';
  h += '</div>';
  h += '<div class="cc-subtitle">';
  h += '<span>' + (rec.industry || '—') + '</span>';
  if (rec.city) h += '<span>' + rec.city + '</span>';
  if (rec.website) h += '<span class="cc-link">' + rec.website + '</span>';
  h += '</div>';
  h += '<div class="cc-summary-pills">';
  h += '<span class="cc-pill">Pipeline: <strong>' + pipeStr + '</strong></span>';
  h += '<span class="cc-pill">Contacts: <strong>' + contacts.length + '</strong></span>';
  h += '<span class="cc-pill">Active deals: <strong>' + opps.length + '</strong></span>';
  h += '</div>';
  h += '</div>';

  h += '<div class="cc-header-actions">';
  h += '<button class="cc-btn crm-edit-btn" data-obj="accounts" data-rec="' + accId + '">' + svgIcon('edit', 14, 'var(--text-light)') + ' Edit</button>';
  h += '<button class="cc-btn cc-btn-danger crm-delete-btn" data-obj="accounts" data-rec="' + accId + '">' + svgIcon('trash', 14, '#ef4444') + ' Delete</button>';
  h += '</div>';
  h += '</div></div>';

  /* ── KPI BOXES ── */
  h += '<div class="cc-kpi-grid">';
  h += ccKpiBox('contacts', '#f0f4ff', 'Contacts', '<div class="cc-kpi-val">' + contacts.length + '</div>', contacts.length + ' key contacts', 'contacts');
  h += ccKpiBox('opportunities', '#ecfdf5', 'Opportunities', '<div class="cc-kpi-val">' + pipeStr + '</div><div class="cc-kpi-trend" style="color:#059669">\u2191 ' + opps.length + ' deals</div>', '', 'opportunities');
  h += ccKpiBox('quotes', '#f0f4ff', 'Quotes', '<div class="cc-kpi-val">' + quotes.length + '</div>', quotes.length > 0 ? 'Latest: active' : 'None yet', 'quotes');
  h += ccKpiBox('claims', '#fef3f2', 'Claims', '<div class="cc-kpi-val">' + claims.length + '</div>', claims.length > 0 ? claims.length + ' open' : 'No claims', 'claims');
  h += ccKpiBox('projects', '#f3f0ff', 'Projects', '<div class="cc-kpi-val">' + projects.length + '</div>', projects.length > 0 ? 'On track' : 'No projects', 'projects');
  h += '</div>';

  /* ── TAB BAR ── */
  h += '<div class="cc-tabs">';
  h += ccTab('details', 'Details', 'list', null);
  h += ccTab('contacts', 'Contacts', 'contacts', contacts.length);
  h += ccTab('opportunities', 'Opportunities', 'opportunities', opps.length);
  h += ccTab('quotes', 'Quotes', 'quotes', quotes.length);
  h += ccTab('claims', 'Claims', 'claims', claims.length);
  h += ccTab('projects', 'Projects', 'projects', projects.length);
  h += ccTab('activity', 'Activity', 'activities', activities.length);
  h += '</div>';

  /* ── TAB CONTENT ── */
  h += '<div class="cc-tab-content">';

  /* === DETAILS TAB === */
  h += '<div id="a360-sec-details" class="cc-section cc-visible">';
  h += '<div class="cc-details-grid">';

  /* Left: Account Information */
  h += '<div class="cc-details-card">';
  h += '<div class="cc-details-card-title">Account information</div>';
  var fields = [
    ['Account name', accName], ['Industry', rec.industry || '—'], ['Phone', rec.phone || '—'],
    ['City', rec.city || '—'], ['Website', rec.website || '—', true], ['Address', rec.address || '—'],
    ['Status', rec.status || '—'], ['Pipeline', pipeStr], ['Owner', rec.owner || '—'], ['Created', rec.created || '—']
  ];
  fields.forEach(function(f) {
    h += '<div class="cc-field"><div class="cc-field-label">' + f[0] + '</div>';
    h += '<div class="cc-field-value' + (f[2] ? ' cc-field-link' : '') + '">' + f[1] + '</div></div>';
  });
  h += '</div>';

  /* Right: Insights + NBA */
  h += '<div style="display:flex;flex-direction:column;gap:14px">';

  /* Insight cards row */
  h += '<div class="cc-insights-grid">';

  /* Account Health */
  var healthScore = Math.min(100, 40 + contacts.length * 8 + opps.length * 10 + (rec.status === 'Active' ? 12 : 0));
  h += '<div class="cc-insight-card">';
  h += '<div style="display:flex;justify-content:space-between;margin-bottom:14px">';
  h += '<span class="cc-details-card-title">Account health</span>';
  h += '</div>';
  h += '<div style="display:flex;align-items:baseline;gap:6px;margin-bottom:10px">';
  h += '<span style="font-size:32px;font-weight:700;color:var(--text);letter-spacing:-1px">' + healthScore + '</span>';
  h += '<span style="font-size:14px;color:var(--text-light)">/100</span>';
  h += '</div>';
  h += '<div class="cc-progress"><div class="cc-progress-fill" style="width:' + healthScore + '%"></div></div>';
  h += '<div style="display:flex;justify-content:space-between;font-size:12px">';
  h += '<span style="color:' + (healthScore >= 60 ? '#059669' : healthScore >= 40 ? '#d97706' : '#dc2626') + ';font-weight:600">' + (healthScore >= 60 ? 'Healthy' : healthScore >= 40 ? 'Attention' : 'At Risk') + '</span>';
  h += '<span style="color:var(--text-light)">' + opps.length + ' active deals</span>';
  h += '</div></div>';

  /* Pipeline card */
  h += '<div class="cc-insight-card">';
  h += '<div class="cc-details-card-title">Pipeline</div>';
  h += '<div style="font-size:32px;font-weight:700;color:var(--text);letter-spacing:-1px">' + pipeStr + '</div>';
  h += '<div style="font-size:12px;color:var(--text-light);margin-bottom:4px">' + opps.length + ' active deals</div>';
  h += '<div class="cc-mini-chart">';
  [35, 55, 80, 45, 70, 92, 60].forEach(function(v, i) {
    h += '<div class="cc-mini-bar" style="height:' + v + '%;background:' + (i === 5 ? 'var(--accent)' : 'var(--accent)30') + '"></div>';
  });
  h += '</div></div>';
  h += '</div>'; /* end insights-grid */

  /* Next Best Action */
  var nbaOpp = opps.find(function(o) { return o.stage === 'negotiation' || o.stage === 'proposal'; }) || opps[0];
  var nbaText = nbaOpp ? 'Follow up on ' + (typeof fmtAmount === 'function' ? fmtAmount(nbaOpp.amount || 0) : '') + ' deal' : 'Add opportunities to build pipeline';
  var nbaDesc = nbaOpp ? (nbaOpp.name + ' — ' + (nbaOpp.stage || '') + ' stage. Close: ' + (nbaOpp.close ? fmtDate(nbaOpp.close) : '—')) : 'No active deals in pipeline.';
  h += '<div class="cc-nba"><div class="cc-nba-body">';
  h += '<div class="cc-nba-tag">Next best action</div>';
  h += '<div class="cc-nba-title">' + nbaText + '</div>';
  h += '<div class="cc-nba-desc">' + nbaDesc + '</div>';
  h += '<button class="cc-btn cc-btn-primary">Follow up \u2192</button>';
  h += '</div>';
  if (nbaOpp) {
    h += '<div class="cc-nba-right">';
    h += '<span class="cc-nba-urgency">Priority</span>';
    h += '<span class="cc-nba-due">Close: ' + (nbaOpp.close ? fmtDate(nbaOpp.close) : '—') + '</span>';
    h += '</div>';
  }
  h += '</div>';

  /* Owner + Last Activity row */
  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:0">';
  h += '<div class="cc-owner-card">';
  var ownerInit = (rec.owner || 'MR').split(' ').map(function(w) { return w[0]; }).join('').substring(0, 2).toUpperCase();
  h += '<div class="cc-owner-avatar">' + ownerInit + '</div>';
  h += '<div><div style="font-size:11px;color:var(--text-light)">Owner</div>';
  h += '<div style="font-size:15px;font-weight:600;color:var(--text)">' + (rec.owner || '—') + '</div>';
  h += '<div style="font-size:11px;color:var(--text-light);margin-top:1px">' + (rec.created || '—') + '</div></div></div>';
  h += '<div class="cc-owner-card">';
  h += '<div style="flex:1"><div style="font-size:11px;color:var(--text-light)">Last activity</div>';
  if (activities.length) {
    h += '<div style="font-size:14px;font-weight:600;color:var(--text)">' + (activities[0].name || 'Recent activity') + '</div>';
    h += '<div style="font-size:11px;color:var(--text-light);margin-top:1px">' + (activities[0].date || '') + '</div>';
  } else {
    h += '<div style="font-size:14px;font-weight:600;color:var(--text-light)">No activities</div>';
  }
  h += '</div></div>';
  h += '</div>';

  h += '</div>'; /* end right col */
  h += '</div>'; /* end details-grid */
  h += '</div>'; /* end details section */

  /* === CONTACTS TAB === */
  h += '<div id="a360-sec-contacts" class="cc-section">';
  var contactRows = contacts.map(function(c) {
    var ci = c.name ? c.name.split(' ').map(function(w) { return w[0]; }).join('').substring(0, 2).toUpperCase() : '?';
    return {
      _navObj: 'contacts', _navId: c.id,
      cells: [
        { html: '<span class="cc-contact-av" style="background:#7c3aed">' + ci + '</span> ' + c.name, cls: 'cc-rel-primary' },
        { html: c.role || '—' },
        { html: c.email || '—', cls: 'cc-rel-link' },
        { html: c.phone || '—' },
      ]
    };
  });
  h += ccRelatedTable('Contacts', contacts.length, 'New contact', '2fr 1.2fr 1.5fr 1fr', [
    { label: 'Name' }, { label: 'Role' }, { label: 'Email' }, { label: 'Phone' }
  ], contactRows);
  h += '</div>';

  /* === OPPORTUNITIES TAB === */
  h += '<div id="a360-sec-opportunities" class="cc-section">';
  var oppRows = opps.map(function(o) {
    var st = (STAGES.opportunities || []).find(function(s) { return s.key === o.stage; });
    var amtStr = typeof fmtAmount === 'function' ? fmtAmount(o.amount || 0) : ((o.amount || 0) / 1e6).toFixed(1) + 'M\u20ac';
    return {
      _navObj: 'opportunities', _navId: o.id,
      cells: [
        { html: o.name, cls: 'cc-rel-primary' },
        { html: ccStageBadge(st ? st.label : o.stage || '—') },
        { html: (o.prob || 0) + '%' },
        { html: o.close ? fmtDate(o.close) : '—' },
        { html: amtStr, cls: 'cc-rel-bold', style: 'text-align:right;justify-content:flex-end' },
      ]
    };
  });
  h += ccRelatedTable('Opportunities', opps.length, 'New opportunity', '2.5fr 120px 70px 100px 100px', [
    { label: 'Name' }, { label: 'Stage' }, { label: 'Prob.' }, { label: 'Close' }, { label: 'Amount', right: true }
  ], oppRows);
  h += '</div>';

  /* === QUOTES TAB === */
  h += '<div id="a360-sec-quotes" class="cc-section">';
  var quoteRows = quotes.map(function(q) {
    var qAmt = typeof fmtAmount === 'function' ? fmtAmount(q.value || q.amount || 0) : '—';
    return {
      _navObj: 'quotes', _navId: q.id,
      cells: [
        { html: q.name || 'Quote #' + q.id, cls: 'cc-rel-primary' },
        { html: ccStageBadge(q.stage || q.status || 'Draft') },
        { html: q.validUntil ? fmtDate(q.validUntil) : (q.date || '—') },
        { html: qAmt, cls: 'cc-rel-bold', style: 'text-align:right;justify-content:flex-end' },
      ]
    };
  });
  h += ccRelatedTable('Quotes', quotes.length, 'New quote', '2.5fr 100px 120px 100px', [
    { label: 'Quote' }, { label: 'Status' }, { label: 'Date' }, { label: 'Amount', right: true }
  ], quoteRows);
  h += '</div>';

  /* === CLAIMS TAB === */
  h += '<div id="a360-sec-claims" class="cc-section">';
  var claimRows = claims.map(function(cl) {
    return {
      _navObj: 'claims', _navId: cl.id,
      cells: [
        { html: cl.title || cl.name || cl.subject || 'Claim #' + cl.id, cls: 'cc-rel-primary' },
        { html: ccStageBadge(cl.priority || 'Medium') },
        { html: ccStageBadge(cl.status || 'Open') },
        { html: cl.reportedDate ? fmtDate(cl.reportedDate) : (cl.date || '—') },
      ]
    };
  });
  h += ccRelatedTable('Claims', claims.length, 'New claim', '2.5fr 100px 100px 120px', [
    { label: 'Claim' }, { label: 'Priority' }, { label: 'Status' }, { label: 'Date' }
  ], claimRows);
  h += '</div>';

  /* === PROJECTS TAB === */
  h += '<div id="a360-sec-projects" class="cc-section">';
  var projRows = projects.map(function(p) {
    var ph = (STAGES.projects || []).find(function(s) { return s.key === p.phase; });
    var budStr = typeof fmtAmount === 'function' ? fmtAmount(p.budget || 0) : ((p.budget || 0) / 1e6).toFixed(1) + 'M\u20ac';
    return {
      _navObj: 'projects', _navId: p.id,
      cells: [
        { html: p.name, cls: 'cc-rel-primary' },
        { html: ccStageBadge(ph ? ph.label : p.phase || '—') },
        { html: ccStageBadge(p.health || 'Healthy') },
        { html: budStr, cls: 'cc-rel-bold', style: 'text-align:right;justify-content:flex-end' },
      ]
    };
  });
  h += ccRelatedTable('Projects', projects.length, 'New project', '2.5fr 120px 100px 100px', [
    { label: 'Project' }, { label: 'Phase' }, { label: 'Health' }, { label: 'Budget', right: true }
  ], projRows);
  h += '</div>';

  /* === ACTIVITY TAB === */
  h += '<div id="a360-sec-activity" class="cc-section">';
  h += '<div class="cc-rel-header">';
  h += '<span class="cc-rel-title">Activity <span class="cc-rel-count">(' + activities.length + ')</span></span>';
  h += '<div style="display:flex;gap:6px">';
  h += '<button class="cc-btn">' + svgIcon('phone', 13, 'var(--text-light)') + ' Log call</button>';
  h += '<button class="cc-btn">' + svgIcon('mail', 13, 'var(--text-light)') + ' Log email</button>';
  h += '</div></div>';
  h += '<div class="cc-timeline">';
  var typeColors = { phone: '#3b82f6', users: '#8b5cf6', mail: '#10b981', mapPin: '#ef4444' };
  activities.forEach(function(a) {
    var tc = typeColors[a.icon] || '#6b7280';
    var iconKey = a.icon || 'activities';
    h += ccTimelineItem(iconKey, tc, a.name || 'Activity', (a.date || '') + (a.time ? ' · ' + a.time : ''), a.contact || '');
  });
  if (!activities.length) h += '<div class="cc-rel-empty">No activities recorded</div>';
  h += '</div></div>';

  h += '</div>'; /* end tab-content */
  h += '</div>'; /* end cc-wrap */

  container.innerHTML = h;
  container.scrollTop = 0;

  /* ── Bind Events ── */
  document.getElementById('cc-back').addEventListener('click', function() { navigate('accounts'); });

  /* Photo upload */
  var photoWrap = document.getElementById('cc-photo-wrap');
  var photoInput = document.getElementById('cc-photo-input');
  if (photoWrap && photoInput) {
    var overlay = photoWrap.querySelector('.cc-photo-overlay');
    if (overlay) overlay.addEventListener('click', function(e) { e.stopPropagation(); photoInput.click(); });
    var avatarEl = document.getElementById('cc-avatar');
    if (avatarEl) {
      avatarEl.addEventListener('click', function(e) {
        e.stopPropagation();
        var url = rec.photoURL || rec.photo || '';
        if (url && typeof fbShowPhotoPreview === 'function') { fbShowPhotoPreview(url, accName); }
        else { photoInput.click(); }
      });
    }
    photoInput.addEventListener('change', function(e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var avatar = document.getElementById('cc-avatar');
      if (avatar) { avatar.innerHTML = '<div style="width:22px;height:22px;border:2.5px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .6s linear infinite"></div>'; }
      if (typeof fbCompressAndSavePhoto === 'function') {
        fbCompressAndSavePhoto(file, 'accounts', accId).then(function(url) {
          if (avatar) { avatar.className = 'cc-avatar cc-avatar-img'; avatar.innerHTML = '<img src="' + url + '" alt="' + accName + '" />'; }
          fbShowStatus('Photo uploaded');
        }).catch(function(err) {
          console.error('[A360] Photo error:', err);
          if (avatar) { avatar.className = 'cc-avatar cc-avatar-initials'; avatar.innerHTML = initials; }
          fbShowStatus('Photo upload failed', true);
        });
      }
    });
  }

  /* Tab system */
  ccBindTabs(container, 'a360');

  /* Edit/Delete */
  bindCrmActionButtons(container);
  bindDetailsLinks(container);
}

/* ── Get products related to an account (via quotes + claims productId) ── */
function _a360GetRelatedProducts(accId) {
  var products = window.DATA.products || [];
  if (!products.length) return [];
  var pIds = {};
  (window.DATA.quotes || []).forEach(function(q) {
    if (q.account !== accId && q.accountId !== accId) return;
    if (q.productId) pIds[q.productId] = true;
    if (q.productIds && Array.isArray(q.productIds)) q.productIds.forEach(function(pid) { pIds[pid] = true; });
    if (q.lineItems && Array.isArray(q.lineItems)) {
      q.lineItems.forEach(function(li) {
        var found = products.find(function(p) { return p.name === li.product; });
        if (found) pIds[found.id] = true;
      });
    }
  });
  (window.DATA.claims || []).forEach(function(cl) {
    if (cl.account !== accId && cl.accountId !== accId) return;
    if (cl.productId) pIds[cl.productId] = true;
    if (cl.productIds && Array.isArray(cl.productIds)) cl.productIds.forEach(function(pid) { pIds[pid] = true; });
  });
  return products.filter(function(p) { return pIds[p.id]; });
}
/* ════════════════════════════════════════════════════════
   CONTACT 360 — Command Center Standard
   ════════════════════════════════════════════════════════ */

function renderContact360(container, rec) {
  ccInjectStyles();
  var D = window.DATA;
  var contactId = rec.id;
  var contactName = rec.name || 'Unknown';
  var initials = contactName.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase();

  var account = (D.accounts||[]).find(function(a){ return a.id === rec.account; });
  var accountName = account ? account.name : '—';
  var opps = (D.opportunities||[]).filter(function(o){ return o.account === rec.account; });
  var projects = (D.projects||[]).filter(function(p){ return p.account === rec.account; });
  var quotes = (D.quotes||[]).filter(function(q){ return q.contact === contactId || q.account === rec.account; });
  var claims = (D.claims||[]).filter(function(cl){ return cl.contact === contactId || cl.account === rec.account || cl.accountId === rec.account; });
  var activities = (D.activities||[]).filter(function(a){ return a.contact === contactId || a.contactName === contactName; });
  if (!activities.length) {
    activities = (D.upcoming||[]).slice(0,4).map(function(u,i){
      return {id:'act'+i, type:u.icon||'call', subject:u.name, date:u.date, time:u.time, contactName:u.contact, icon:u.icon};
    });
  }
  var notes = (D.notes||[]).filter(function(n){ return n.contact === contactId; });
  if (!notes.length) {
    notes = [
      {id:'n1', date:'2025-03-08', text:'Discussed scope changes for upcoming tender. Very receptive to premium solutions.'},
      {id:'n2', date:'2025-02-22', text:'Met at BTP conference. Strong interest in digital tools for site management.'}
    ];
  }

  var totalPipe = opps.reduce(function(s,o){ return s+(o.amount||0); },0);
  var pipeStr = typeof fmtAmount==='function' ? fmtAmount(totalPipe) : (totalPipe/1e6).toFixed(1)+'M€';
  var photoUrl = rec.photoURL || rec.photo || '';

  var h = '<div class="cc-wrap">';
  h += '<div class="cc-back" id="cc-back">'+svgIcon('arrowLeft',14,'var(--text-muted)')+' <span>Contacts</span></div>';

  /* ── HEADER ── */
  h += '<div class="cc-header"><div class="cc-header-top">';
  h += '<div class="cc-photo-wrap" id="cc-photo-wrap">';
  if (photoUrl) {
    h += '<div class="cc-avatar cc-avatar-img" id="cc-avatar"><img src="'+photoUrl+'" alt="'+contactName+'" /></div>';
  } else {
    h += '<div class="cc-avatar" id="cc-avatar" style="background:linear-gradient(135deg,#ede9fe,#ddd6fe);color:#7c3aed;font-size:22px;font-weight:800;letter-spacing:-.5px">'+initials+'</div>';
  }
  h += '<div class="cc-photo-overlay">'+svgIcon('plus',16,'#fff')+'</div>';
  h += '<input type="file" id="cc-photo-input" accept="image/*" style="display:none" />';
  h += '</div>';

  h += '<div class="cc-header-info">';
  h += '<div style="display:flex;align-items:center"><h1 class="cc-name">'+contactName+'</h1></div>';
  h += '<div class="cc-subtitle">';
  h += '<span>'+(rec.role||'—')+'</span>';
  h += '<span class="cc-link" id="cc-acct-link" data-acct-id="'+(rec.account||'')+'">'+accountName+'</span>';
  if (rec.email) h += '<span>'+rec.email+'</span>';
  if (rec.phone) h += '<span>'+rec.phone+'</span>';
  h += '</div>';
  h += '<div class="cc-summary-pills">';
  h += '<span class="cc-pill">Pipeline: <strong>'+pipeStr+'</strong></span>';
  h += '<span class="cc-pill">Opps: <strong>'+opps.length+'</strong></span>';
  h += '<span class="cc-pill">Quotes: <strong>'+quotes.length+'</strong></span>';
  h += '</div></div>';

  h += '<div class="cc-header-actions">';
  h += '<button class="cc-btn">'+svgIcon('phone',14,'var(--text-light)')+' Call</button>';
  h += '<button class="cc-btn">'+svgIcon('mail',14,'var(--text-light)')+' Email</button>';
  h += '<button class="cc-btn crm-edit-btn" data-obj="contacts" data-rec="'+contactId+'">'+svgIcon('edit',14,'var(--text-light)')+' Edit</button>';
  h += '<button class="cc-btn cc-btn-danger crm-delete-btn" data-obj="contacts" data-rec="'+contactId+'">'+svgIcon('trash',14,'#ef4444')+' Delete</button>';
  h += '</div></div></div>';

  /* ── KPI BOXES ── */
  h += '<div class="cc-kpi-grid" style="grid-template-columns:repeat(4,1fr)">';
  h += ccKpiBox('opportunities','#ecfdf5','Opportunities','<div class="cc-kpi-val">'+opps.length+'</div>',pipeStr+' pipeline','opportunities');
  h += ccKpiBox('quotes','#f0f4ff','Quotes','<div class="cc-kpi-val">'+quotes.length+'</div>',quotes.length>0?'Latest active':'None yet','quotes');
  h += ccKpiBox('claims','#fef3f2','Claims','<div class="cc-kpi-val">'+claims.length+'</div>',claims.length>0?claims.length+' open':'No claims','claims');
  h += ccKpiBox('activities','#fef7ec','Activities','<div class="cc-kpi-val">'+activities.length+'</div>','Last: recently','activity');
  h += '</div>';

  /* ── TAB BAR ── */
  h += '<div class="cc-tabs">';
  h += ccTab('details','Details','list',null);
  h += ccTab('opportunities','Opportunities','opportunities',opps.length);
  h += ccTab('quotes','Quotes','quotes',quotes.length);
  h += ccTab('claims','Claims','claims',claims.length);
  h += ccTab('notes','Notes','edit',notes.length);
  h += ccTab('activity','Activity','activities',activities.length);
  h += '</div>';

  h += '<div class="cc-tab-content">';

  /* === DETAILS === */
  h += '<div id="c360-sec-details" class="cc-section cc-visible">';
  h += '<div class="cc-details-grid">';
  h += '<div class="cc-details-card">';
  h += '<div class="cc-details-card-title">Contact information</div>';
  [['Name',contactName],['Role',rec.role||'—'],['Account',accountName,true],['Email',rec.email||'—'],['Phone',rec.phone||'—'],['City',rec.city||(account?account.city:'')||'—'],['Influence',rec.influence||'—']].forEach(function(f){
    h += '<div class="cc-field"><div class="cc-field-label">'+f[0]+'</div><div class="cc-field-value'+(f[2]?' cc-field-link':'')+'">'+f[1]+'</div></div>';
  });
  h += '</div>';

  h += '<div style="display:flex;flex-direction:column;gap:14px">';
  /* Account card */
  h += '<div class="cc-details-card" style="cursor:pointer" id="cc-acct-card" data-acct-id="'+(rec.account||'')+'">';
  h += '<div class="cc-details-card-title">Account relationship</div>';
  var accInit = accountName.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase();
  h += '<div style="display:flex;align-items:center;gap:12px">';
  h += '<div class="cc-contact-av" style="background:var(--accent);width:36px;height:36px;font-size:13px;border-radius:8px">'+accInit+'</div>';
  h += '<div><div style="font-size:14px;font-weight:600;color:var(--accent)">'+accountName+'</div>';
  h += '<div style="font-size:11px;color:var(--text-light)">'+(account?(account.industry||'')+(account.city?' · '+account.city:''):'')+'</div></div></div>';
  if (account) {
    var accPipe = account.pipeline ? (typeof fmtAmount==='function' ? fmtAmount(account.pipeline) : '') : '—';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px">';
    h += '<div><div class="cc-field-label">Pipeline</div><div class="cc-field-value" style="font-weight:600">'+accPipe+'</div></div>';
    h += '<div><div class="cc-field-label">Status</div><div class="cc-field-value">'+ccStageBadge(account.status||'Active')+'</div></div>';
    h += '</div>';
  }
  h += '</div>';

  /* NBA */
  var nbaOpp = opps.find(function(o){return o.stage==='negotiation'||o.stage==='proposal';}) || opps[0];
  if (nbaOpp) {
    h += '<div class="cc-nba"><div class="cc-nba-body">';
    h += '<div class="cc-nba-tag">Next best action</div>';
    h += '<div class="cc-nba-title">Follow up on '+nbaOpp.name+'</div>';
    h += '<div class="cc-nba-desc">'+(typeof fmtAmount==='function'?fmtAmount(nbaOpp.amount||0):'')+' · '+(nbaOpp.stage||'')+' stage</div>';
    h += '<button class="cc-btn cc-btn-primary">Follow up \u2192</button>';
    h += '</div></div>';
  }
  h += '</div></div></div>';

  /* === OPPORTUNITIES === */
  h += '<div id="c360-sec-opportunities" class="cc-section">';
  var oppRows = opps.map(function(o){
    var st = (STAGES.opportunities||[]).find(function(s){return s.key===o.stage;});
    var amtStr = typeof fmtAmount==='function' ? fmtAmount(o.amount||0) : ((o.amount||0)/1e6).toFixed(1)+'M€';
    return { _navObj:'opportunities', _navId:o.id, cells:[
      {html:o.name,cls:'cc-rel-primary'},{html:ccStageBadge(st?st.label:o.stage||'—')},
      {html:(o.prob||0)+'%'},{html:o.close?fmtDate(o.close):'—'},
      {html:amtStr,cls:'cc-rel-bold',style:'text-align:right;justify-content:flex-end'}
    ]};
  });
  h += ccRelatedTable('Opportunities',opps.length,'New opportunity','2.5fr 120px 70px 100px 100px',[{label:'Name'},{label:'Stage'},{label:'Prob.'},{label:'Close'},{label:'Amount',right:true}],oppRows);
  h += '</div>';

  /* === QUOTES === */
  h += '<div id="c360-sec-quotes" class="cc-section">';
  var qRows = quotes.map(function(q){
    var qAmt = typeof fmtAmount==='function' ? fmtAmount(q.value||q.amount||0) : '—';
    return { _navObj:'quotes', _navId:q.id, cells:[
      {html:q.name||'Quote #'+q.id,cls:'cc-rel-primary'},{html:ccStageBadge(q.stage||q.status||'Draft')},
      {html:q.validUntil?fmtDate(q.validUntil):(q.date||'—')},{html:qAmt,cls:'cc-rel-bold',style:'text-align:right;justify-content:flex-end'}
    ]};
  });
  h += ccRelatedTable('Quotes',quotes.length,'New quote','2.5fr 100px 120px 100px',[{label:'Quote'},{label:'Status'},{label:'Date'},{label:'Amount',right:true}],qRows);
  h += '</div>';

  /* === CLAIMS === */
  h += '<div id="c360-sec-claims" class="cc-section">';
  var clRows = claims.map(function(cl){
    return { _navObj:'claims', _navId:cl.id, cells:[
      {html:cl.title||cl.name||cl.subject||'Claim #'+cl.id,cls:'cc-rel-primary'},
      {html:ccStageBadge(cl.priority||'Medium')},{html:ccStageBadge(cl.status||'Open')},
      {html:cl.reportedDate?fmtDate(cl.reportedDate):(cl.date||'—')}
    ]};
  });
  h += ccRelatedTable('Claims',claims.length,'New claim','2.5fr 100px 100px 120px',[{label:'Claim'},{label:'Priority'},{label:'Status'},{label:'Date'}],clRows);
  h += '</div>';

  /* === NOTES === */
  h += '<div id="c360-sec-notes" class="cc-section">';
  h += '<div class="cc-rel-header"><span class="cc-rel-title">Notes <span class="cc-rel-count">('+notes.length+')</span></span>';
  h += '<button class="cc-btn">'+svgIcon('plus',13,'var(--text-light)')+' New note</button></div>';
  notes.forEach(function(n){
    h += '<div style="padding:14px 0;border-bottom:1px solid #f3f4f6">';
    h += '<div style="font-size:10px;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">'+(n.date||'')+'</div>';
    h += '<div style="font-size:12.5px;color:var(--text);line-height:1.55">'+(n.text||'')+'</div></div>';
  });
  if (!notes.length) h += '<div class="cc-rel-empty">No notes</div>';
  h += '</div>';

  /* === ACTIVITY === */
  h += '<div id="c360-sec-activity" class="cc-section">';
  h += '<div class="cc-rel-header"><span class="cc-rel-title">Activity <span class="cc-rel-count">('+activities.length+')</span></span>';
  h += '<div style="display:flex;gap:6px"><button class="cc-btn">'+svgIcon('phone',13,'var(--text-light)')+' Log call</button>';
  h += '<button class="cc-btn">'+svgIcon('mail',13,'var(--text-light)')+' Log email</button></div></div>';
  h += '<div class="cc-timeline">';
  var typeColors = {call:'#3b82f6',phone:'#3b82f6',meeting:'#8b5cf6',users:'#8b5cf6',email:'#10b981',mail:'#10b981','site visit':'#ef4444',mapPin:'#ef4444'};
  activities.forEach(function(a){
    var tc = typeColors[a.type]||typeColors[a.icon]||'#6b7280';
    var ik = a.icon||(a.type==='call'||a.type==='phone'?'phone':a.type==='meeting'||a.type==='users'?'users':a.type==='email'||a.type==='mail'?'mail':'activities');
    h += ccTimelineItem(ik,tc,a.subject||a.name||'Activity',(a.date||'')+(a.time?' · '+a.time:''),a.contactName||'');
  });
  if (!activities.length) h += '<div class="cc-rel-empty">No activities recorded</div>';
  h += '</div></div>';

  h += '</div></div>';
  container.innerHTML = h;
  container.scrollTop = 0;

  /* Bind */
  document.getElementById('cc-back').addEventListener('click',function(){navigate('contacts');});
  _ccBindPhoto(container, rec, 'contacts', contactId, contactName, initials);
  ccBindTabs(container,'c360');
  bindCrmActionButtons(container);
  bindDetailsLinks(container);

  /* Account links */
  var acctLink = document.getElementById('cc-acct-link');
  if (acctLink && rec.account) acctLink.addEventListener('click',function(){navigate('record','accounts',rec.account);});
  var acctCard = document.getElementById('cc-acct-card');
  if (acctCard && rec.account) acctCard.addEventListener('click',function(){navigate('record','accounts',rec.account);});
}


/* ════════════════════════════════════════════════════════
   LEAD 360 — Command Center Standard + Qualification Funnel
   ════════════════════════════════════════════════════════ */

function renderLead360(container, rec) {
  ccInjectStyles();
  var D = window.DATA;

  var account = (D.accounts||[]).find(function(a){return a.id===rec.account;});
  var accountName = account ? account.name : '—';
  var contact = (D.contacts||[]).find(function(c){return c.account===rec.account;});
  var contactName = contact ? contact.name : rec.name.split(' – ')[0] || rec.name;
  var contactRole = contact ? contact.role : 'Key Contact';
  var contactEmail = contact ? contact.email : '';
  var contactPhone = contact ? contact.phone : '';
  var opps = (D.opportunities||[]).filter(function(o){return o.account===rec.account;});

  var leadScore = rec.leadScore || l360ComputeScore(rec);
  var temperature = l360Temperature(leadScore);
  var engagementLevel = rec.engagement || l360Engagement(rec);
  var activityCount = rec.activityCount || (Math.floor(Math.random()*8)+2);
  var nextAction = l360NextAction(rec);
  var estValStr = rec.estimatedValue ? (typeof fmtAmount==='function' ? fmtAmount(rec.estimatedValue) : (rec.estimatedValue/1e6).toFixed(1)+'M') : '—';

  var activities = (D.upcoming||[]).slice(0,5).map(function(u,i){
    return {id:'la'+i, type:u.icon||'call', subject:u.name, date:u.date, time:u.time, icon:u.icon};
  });
  if (!activities.length) {
    activities = [{id:'la0',type:'phone',subject:'Initial outreach call',date:'2025-03-10',time:'14:30',icon:'phone'}];
  }

  var notes = [
    {id:'ln1',date:'2025-03-09',text:'Strong interest in facade solutions for new campus project. Budget confirmed for Q3.'},
    {id:'ln2',date:'2025-02-28',text:'Met at Batimat. Decision expected within 6 weeks.'}
  ];

  var initials = contactName.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase();
  var photoUrl = rec.photoURL || rec.photo || '';

  var h = '<div class="cc-wrap">';
  h += '<div class="cc-back" id="cc-back">'+svgIcon('arrowLeft',14,'var(--text-muted)')+' <span>Leads</span></div>';

  /* ── HEADER ── */
  h += '<div class="cc-header"><div class="cc-header-top">';
  h += '<div class="cc-photo-wrap" id="cc-photo-wrap">';
  if (photoUrl) {
    h += '<div class="cc-avatar cc-avatar-img" id="cc-avatar"><img src="'+photoUrl+'" alt="'+rec.name+'" /></div>';
  } else {
    h += '<div class="cc-avatar" id="cc-avatar" style="background:linear-gradient(135deg,#fef3c7,#fde68a);color:#92400e;font-size:22px;font-weight:800;letter-spacing:-.5px">'+initials+'</div>';
  }
  h += '<div class="cc-photo-overlay">'+svgIcon('plus',16,'#fff')+'</div>';
  h += '<input type="file" id="cc-photo-input" accept="image/*" style="display:none" />';
  h += '</div>';

  h += '<div class="cc-header-info">';
  h += '<div style="display:flex;align-items:center"><h1 class="cc-name">'+rec.name+'</h1>';
  h += '<span class="cc-badge" style="border-color:'+temperature.color+';color:'+temperature.color+'">'+temperature.label+'</span></div>';
  h += '<div class="cc-subtitle">';
  h += '<span>'+contactRole+'</span>';
  h += '<span class="cc-link" id="cc-acct-link" data-acct-id="'+(rec.account||'')+'">'+accountName+'</span>';
  if (contactEmail) h += '<span>'+contactEmail+'</span>';
  h += '</div>';
  h += '<div class="cc-summary-pills">';
  h += '<span class="cc-pill">Score: <strong>'+leadScore+'</strong></span>';
  h += '<span class="cc-pill">Est. Value: <strong>'+estValStr+'</strong></span>';
  if (rec.source) h += '<span class="cc-pill">Source: <strong>'+rec.source+'</strong></span>';
  h += '</div></div>';

  h += '<div class="cc-header-actions">';
  h += '<button class="cc-btn">'+svgIcon('phone',14,'var(--text-light)')+' Call</button>';
  h += '<button class="cc-btn">'+svgIcon('mail',14,'var(--text-light)')+' Email</button>';
  h += '<button class="cc-btn cc-btn-primary" id="cc-convert">'+svgIcon('opportunities',14,'#fff')+' Convert</button>';
  h += '<button class="cc-btn crm-edit-btn" data-obj="leads" data-rec="'+rec.id+'">'+svgIcon('edit',14,'var(--text-light)')+' Edit</button>';
  h += '<button class="cc-btn cc-btn-danger crm-delete-btn" data-obj="leads" data-rec="'+rec.id+'">'+svgIcon('trash',14,'#ef4444')+'</button>';
  h += '</div></div>';

  /* Qualification Funnel inside header */
  var stages = STAGES.leads || [];
  var currentIdx = stages.findIndex(function(s){return s.key===rec.stage;});
  h += '<div style="padding:0 28px 20px">';
  h += '<div class="cc-funnel">';
  stages.forEach(function(st,i){
    var done = i < currentIdx;
    var current = i === currentIdx;
    h += '<div class="cc-funnel-seg" data-stage="'+st.key+'" style="background:'+(done||current?st.color:'#e5e7eb')+';opacity:'+(current?1:done?(.3+i/(stages.length-1)*.7):1)+';cursor:pointer;border-radius:3px"></div>';
  });
  h += '</div>';
  h += '<div class="cc-funnel-labels">';
  stages.forEach(function(st,i){
    h += '<span class="'+(i===currentIdx?'cc-funnel-current':'')+'">'+st.label+'</span>';
  });
  h += '</div></div>';
  h += '</div>';

  /* ── KPI BOXES ── */
  h += '<div class="cc-kpi-grid" style="grid-template-columns:repeat(4,1fr)">';
  h += ccKpiBox('chart','#fef3f2','Lead Score','<div class="cc-kpi-val" style="color:'+temperature.color+'">'+leadScore+'</div>',temperature.label,'details');
  h += ccKpiBox('activities','#f0f4ff','Engagement','<div class="cc-kpi-val">'+engagementLevel+'</div>',activityCount+' touchpoints','activity');
  h += ccKpiBox('trending','#ecfdf5','Est. Value','<div class="cc-kpi-val">'+estValStr+'</div>','','details');
  h += ccKpiBox('opportunities','#fef7ec','Related Opps','<div class="cc-kpi-val">'+opps.length+'</div>',opps.length>0?'Active pipeline':'None yet','opportunities');
  h += '</div>';

  /* ── TAB BAR ── */
  h += '<div class="cc-tabs">';
  h += ccTab('details','Details','list',null);
  h += ccTab('opportunities','Opportunities','opportunities',opps.length);
  h += ccTab('notes','Notes','edit',notes.length);
  h += ccTab('activity','Activity','activities',activities.length);
  h += '</div>';

  h += '<div class="cc-tab-content">';

  /* === DETAILS === */
  h += '<div id="l360-sec-details" class="cc-section cc-visible">';
  h += '<div class="cc-details-grid">';
  h += '<div class="cc-details-card">';
  h += '<div class="cc-details-card-title">Lead information</div>';
  [['Lead name',rec.name],['Source',rec.source||'—'],['Priority',rec.priority||'—'],['Stage',(function(){var st=stages.find(function(s){return s.key===rec.stage;});return st?st.label:rec.stage||'—';})()],['Est. Value',estValStr],['Owner','Me'],['Created','Feb 2025']].forEach(function(f){
    h += '<div class="cc-field"><div class="cc-field-label">'+f[0]+'</div><div class="cc-field-value">'+f[1]+'</div></div>';
  });
  h += '</div>';

  h += '<div style="display:flex;flex-direction:column;gap:14px">';
  /* Company card */
  if (account) {
    h += '<div class="cc-details-card" style="cursor:pointer" id="cc-acct-card" data-acct-id="'+rec.account+'">';
    h += '<div class="cc-details-card-title">Company</div>';
    var acci = accountName.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase();
    h += '<div style="display:flex;align-items:center;gap:12px">';
    h += '<div class="cc-contact-av" style="background:var(--accent);width:36px;height:36px;font-size:13px;border-radius:8px">'+acci+'</div>';
    h += '<div><div style="font-size:14px;font-weight:600;color:var(--accent)">'+accountName+'</div>';
    h += '<div style="font-size:11px;color:var(--text-light)">'+(account.industry||'')+(account.city?' · '+account.city:'')+'</div></div></div>';
    h += '</div>';
  }

  /* Next Action */
  h += '<div class="cc-nba"><div class="cc-nba-body">';
  h += '<div class="cc-nba-tag">Next recommended action</div>';
  h += '<div class="cc-nba-title">'+nextAction.text+'</div>';
  h += '<button class="cc-btn cc-btn-primary" style="margin-top:8px">Take action \u2192</button>';
  h += '</div></div>';

  /* Insights */
  h += '<div class="cc-insights-grid">';
  h += '<div class="cc-insight-card"><div class="cc-details-card-title">Lead Score</div>';
  h += '<div style="font-size:32px;font-weight:700;color:'+temperature.color+';letter-spacing:-1px">'+leadScore+'<span style="font-size:14px;color:var(--text-light)">/100</span></div>';
  h += '<div class="cc-progress"><div class="cc-progress-fill" style="width:'+leadScore+'%;background:'+temperature.color+'"></div></div></div>';
  h += '<div class="cc-insight-card"><div class="cc-details-card-title">Engagement</div>';
  h += '<div style="font-size:32px;font-weight:700;color:var(--text);letter-spacing:-1px">'+engagementLevel+'</div>';
  h += '<div style="font-size:12px;color:var(--text-light);margin-top:4px">'+activityCount+' touchpoints logged</div></div>';
  h += '</div>';
  h += '</div></div></div>';

  /* === OPPORTUNITIES === */
  h += '<div id="l360-sec-opportunities" class="cc-section">';
  var oppRows = opps.map(function(o){
    var st=(STAGES.opportunities||[]).find(function(s){return s.key===o.stage;});
    var amtStr=typeof fmtAmount==='function'?fmtAmount(o.amount||0):((o.amount||0)/1e6).toFixed(1)+'M€';
    return{_navObj:'opportunities',_navId:o.id,cells:[
      {html:o.name,cls:'cc-rel-primary'},{html:ccStageBadge(st?st.label:o.stage||'—')},
      {html:(o.prob||0)+'%'},{html:amtStr,cls:'cc-rel-bold',style:'text-align:right;justify-content:flex-end'}
    ]};
  });
  h += ccRelatedTable('Opportunities',opps.length,'New opportunity','2.5fr 120px 70px 100px',[{label:'Name'},{label:'Stage'},{label:'Prob.'},{label:'Amount',right:true}],oppRows);
  h += '</div>';

  /* === NOTES === */
  h += '<div id="l360-sec-notes" class="cc-section">';
  h += '<div class="cc-rel-header"><span class="cc-rel-title">Notes <span class="cc-rel-count">('+notes.length+')</span></span></div>';
  notes.forEach(function(n){
    h += '<div style="padding:14px 0;border-bottom:1px solid #f3f4f6">';
    h += '<div style="font-size:10px;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">'+(n.date||'')+'</div>';
    h += '<div style="font-size:12.5px;color:var(--text);line-height:1.55">'+(n.text||'')+'</div></div>';
  });
  h += '</div>';

  /* === ACTIVITY === */
  h += '<div id="l360-sec-activity" class="cc-section">';
  h += '<div class="cc-rel-header"><span class="cc-rel-title">Activity <span class="cc-rel-count">('+activities.length+')</span></span></div>';
  h += '<div class="cc-timeline">';
  activities.forEach(function(a){
    var tc = {phone:'#3b82f6',users:'#8b5cf6',mail:'#10b981',mapPin:'#ef4444'}[a.icon]||'#6b7280';
    h += ccTimelineItem(a.icon||'activities',tc,a.subject||a.name||'Activity',(a.date||'')+(a.time?' · '+a.time:''),'');
  });
  h += '</div></div>';

  h += '</div></div>';
  container.innerHTML = h;
  container.scrollTop = 0;

  /* Bind */
  document.getElementById('cc-back').addEventListener('click',function(){navigate('leads');});
  _ccBindPhoto(container, rec, 'leads', rec.id, rec.name, initials);
  ccBindTabs(container,'l360');
  bindCrmActionButtons(container);

  var acctLink = document.getElementById('cc-acct-link');
  if (acctLink && rec.account) acctLink.addEventListener('click',function(){navigate('record','accounts',rec.account);});
  var acctCard = document.getElementById('cc-acct-card');
  if (acctCard && rec.account) acctCard.addEventListener('click',function(){navigate('record','accounts',rec.account);});

  /* Convert button */
  var convertBtn = document.getElementById('cc-convert');
  if (convertBtn) {
    convertBtn.addEventListener('click',function(){
      rec.stage = 'converted';
      renderLead360(container, rec);
      if (typeof showDragToast === 'function') showDragToast(rec.name,'converted','leads');
    });
  }

  /* Funnel step click */
  container.querySelectorAll('.cc-funnel-seg[data-stage]').forEach(function(seg){
    seg.addEventListener('click',function(){
      var ns = seg.getAttribute('data-stage');
      if (ns && ns !== rec.stage) { rec.stage = ns; renderLead360(container, rec); if(typeof showDragToast==='function') showDragToast(rec.name,ns,'leads'); }
    });
  });
}

/* Lead helpers (preserved) */
function l360ComputeScore(rec){var s=30;if(rec.priority==='High')s+=30;else if(rec.priority==='Medium')s+=15;if(rec.source==='Referral')s+=15;else if(rec.source==='Trade Show')s+=10;else if(rec.source==='Website')s+=5;if(rec.stage==='qualified')s+=12;else if(rec.stage==='contacted')s+=6;else if(rec.stage==='proposal')s+=18;else if(rec.stage==='converted')s+=25;if(rec.estimatedValue&&rec.estimatedValue>=20000000)s+=10;return Math.min(s,100);}
function l360Temperature(score){if(score>=70)return{key:'hot',label:'Hot Lead',icon:'',color:'var(--danger)'};if(score>=40)return{key:'warm',label:'Warm Lead',icon:'',color:'var(--warning)'};return{key:'cold',label:'Cold Lead',icon:'',color:'var(--text-light)'};}
function l360Engagement(rec){if(rec.stage==='qualified'||rec.stage==='proposal'||rec.stage==='converted')return'High';if(rec.stage==='contacted')return'Medium';return'Low';}
function l360NextAction(rec){if(rec.stage==='new')return{icon:'phone',color:'#3b82f6',text:'Schedule an initial discovery call to qualify this lead.'};if(rec.stage==='contacted')return{icon:'users',color:'#8b5cf6',text:'Book a face-to-face meeting to assess project scope and budget.'};if(rec.stage==='qualified')return{icon:'quotes',color:'#f59e0b',text:'Prepare and send a tailored proposal with pricing.'};if(rec.stage==='proposal')return{icon:'opportunities',color:'#10b981',text:'Follow up on proposal and negotiate to close.'};return{icon:'chart',color:'#10b981',text:'Lead converted. Create opportunity and assign project team.'};}


/* ════════════════════════════════════════════════════════
   OPPORTUNITY 360 — Command Center Standard + Pipeline Stages
   ════════════════════════════════════════════════════════ */

function renderOpp360(container, rec) {
  ccInjectStyles();
  var D = window.DATA;
  var oppId = rec.id;

  var account = (D.accounts||[]).find(function(a){return a.id===rec.account;});
  var accountName = account ? account.name : '—';
  var contacts = (D.contacts||[]).filter(function(c){return c.account===rec.account;});
  var quotes = (D.quotes||[]).filter(function(q){return q.opportunity===oppId || q.account===rec.account;});
  var activities = (D.activities||[]).filter(function(a){return a.opportunity===oppId;});
  if (!activities.length) {
    activities = (D.upcoming||[]).slice(0,4).map(function(u,i){
      return {id:'oa'+i, type:u.icon||'call', subject:u.name, date:u.date, time:u.time, contact:u.contact, icon:u.icon};
    });
  }
  var tasks = (D.tasks||[]).slice(0,3);

  var amtStr = typeof fmtAmount==='function' ? fmtAmount(rec.amount||0) : ((rec.amount||0)/1e6).toFixed(1)+'M€';
  var weighted = (rec.amount||0)*((rec.prob||0)/100);
  var weightedStr = typeof fmtAmount==='function' ? fmtAmount(weighted) : (weighted/1e6).toFixed(1)+'M€';
  var closeStr = rec.close ? fmtDate(rec.close) : '—';
  var stages = STAGES.opportunities||[];
  var currentIdx = stages.map(function(s){return s.key;}).indexOf(rec.stage);
  var stObj = stages[currentIdx] || {};
  var nextAction = o360NextAction(rec);
  var initials = rec.name ? rec.name.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase() : 'OP';
  var photoUrl = rec.photoURL || rec.photo || '';

  var h = '<div class="cc-wrap">';
  h += '<div class="cc-back" id="cc-back">'+svgIcon('arrowLeft',14,'var(--text-muted)')+' <span>Opportunities</span></div>';

  /* ── HEADER ── */
  h += '<div class="cc-header"><div class="cc-header-top">';
  h += '<div class="cc-photo-wrap" id="cc-photo-wrap">';
  if (photoUrl) {
    h += '<div class="cc-avatar cc-avatar-img" id="cc-avatar"><img src="'+photoUrl+'" alt="'+rec.name+'" /></div>';
  } else {
    h += '<div class="cc-avatar" id="cc-avatar" style="background:linear-gradient(135deg,var(--accent),var(--accent-hover));font-size:20px;font-weight:800;color:#fff">'+svgIcon('opportunities',24,'#fff')+'</div>';
  }
  h += '<div class="cc-photo-overlay">'+svgIcon('plus',16,'#fff')+'</div>';
  h += '<input type="file" id="cc-photo-input" accept="image/*" style="display:none" />';
  h += '</div>';

  h += '<div class="cc-header-info">';
  h += '<div style="display:flex;align-items:center"><h1 class="cc-name">'+rec.name+'</h1>';
  h += '<span class="cc-badge" style="border-color:'+(stObj.color||'#d0d5dd')+';color:'+(stObj.color||'var(--text-muted)')+'">'+( stObj.label||rec.stage||'—')+'</span></div>';
  h += '<div class="cc-subtitle">';
  h += '<span class="cc-link" id="cc-acct-link" data-acct-id="'+(rec.account||'')+'">'+accountName+'</span>';
  h += '<span>Close '+closeStr+'</span>';
  h += '<span>Owner: '+(rec.owner||'Me')+'</span>';
  h += '</div>';
  h += '<div class="cc-summary-pills">';
  h += '<span class="cc-pill">Amount: <strong>'+amtStr+'</strong></span>';
  h += '<span class="cc-pill">Prob: <strong>'+(rec.prob||0)+'%</strong></span>';
  h += '<span class="cc-pill">Weighted: <strong>'+weightedStr+'</strong></span>';
  h += '</div></div>';

  h += '<div class="cc-header-actions">';
  h += '<button class="cc-btn crm-edit-btn" data-obj="opportunities" data-rec="'+oppId+'">'+svgIcon('edit',14,'var(--text-light)')+' Edit</button>';
  h += '<button class="cc-btn cc-btn-danger crm-delete-btn" data-obj="opportunities" data-rec="'+oppId+'">'+svgIcon('trash',14,'#ef4444')+' Delete</button>';
  h += '</div></div>';

  /* Pipeline stages inside header */
  h += '<div style="padding:0 28px 20px">';
  h += '<div class="cc-funnel">';
  stages.forEach(function(st,i){
    var done = i<currentIdx; var current = i===currentIdx;
    h += '<div class="cc-funnel-seg" data-stage="'+st.key+'" style="background:'+(done||current?st.color:'#e5e7eb')+';opacity:'+(current?1:done?(.3+i/(stages.length-1)*.7):1)+';cursor:pointer;border-radius:3px"></div>';
  });
  h += '</div>';
  h += '<div class="cc-funnel-labels">';
  stages.forEach(function(st,i){
    h += '<span class="'+(i===currentIdx?'cc-funnel-current':'')+'">'+st.label+'</span>';
  });
  h += '</div></div>';
  h += '</div>';

  /* ── KPI BOXES ── */
  h += '<div class="cc-kpi-grid" style="grid-template-columns:repeat(4,1fr)">';
  h += ccKpiBox('trending','#ecfdf5','Deal Value','<div class="cc-kpi-val">'+amtStr+'</div>','','details');
  h += ccKpiBox('chart','#f0f4ff','Probability','<div class="cc-kpi-val">'+(rec.prob||0)+'%</div>','Weighted: '+weightedStr,'details');
  h += ccKpiBox('contacts','#f3f0ff','Contacts','<div class="cc-kpi-val">'+contacts.length+'</div>','Involved in deal','contacts');
  h += ccKpiBox('quotes','#fef7ec','Quotes','<div class="cc-kpi-val">'+quotes.length+'</div>',quotes.length>0?'Latest active':'None yet','quotes');
  h += '</div>';

  /* ── TAB BAR ── */
  h += '<div class="cc-tabs">';
  h += ccTab('details','Details','list',null);
  h += ccTab('contacts','Contacts','contacts',contacts.length);
  h += ccTab('quotes','Quotes','quotes',quotes.length);
  h += ccTab('activity','Activity','activities',activities.length);
  h += '</div>';

  h += '<div class="cc-tab-content">';

  /* === DETAILS === */
  h += '<div id="o360-sec-details" class="cc-section cc-visible">';
  h += '<div class="cc-details-grid">';
  h += '<div class="cc-details-card">';
  h += '<div class="cc-details-card-title">Opportunity details</div>';
  [['Opportunity',rec.name],['Account',accountName,true],['Stage',stObj.label||rec.stage||'—'],['Amount',amtStr],['Probability',(rec.prob||0)+'%'],['Close date',closeStr],['Owner',rec.owner||'—']].forEach(function(f){
    h += '<div class="cc-field"><div class="cc-field-label">'+f[0]+'</div><div class="cc-field-value'+(f[2]?' cc-field-link':'')+'">'+f[1]+'</div></div>';
  });
  h += '</div>';

  h += '<div style="display:flex;flex-direction:column;gap:14px">';
  /* Insights */
  h += '<div class="cc-insights-grid">';
  h += '<div class="cc-insight-card"><div class="cc-details-card-title">Deal value</div>';
  h += '<div style="font-size:32px;font-weight:700;color:var(--text);letter-spacing:-1px">'+amtStr+'</div>';
  h += '<div style="font-size:12px;color:var(--text-light);margin-top:4px">Weighted: '+weightedStr+'</div></div>';
  h += '<div class="cc-insight-card"><div class="cc-details-card-title">Win probability</div>';
  var probColor = (rec.prob||0)>=60?'#059669':(rec.prob||0)>=30?'#d97706':'#dc2626';
  h += '<div style="font-size:32px;font-weight:700;color:'+probColor+';letter-spacing:-1px">'+(rec.prob||0)+'%</div>';
  h += '<div class="cc-progress" style="margin-top:8px"><div class="cc-progress-fill" style="width:'+(rec.prob||0)+'%;background:'+probColor+'"></div></div></div>';
  h += '</div>';

  /* NBA */
  h += '<div class="cc-nba"><div class="cc-nba-body">';
  h += '<div class="cc-nba-tag">Next recommended action</div>';
  h += '<div class="cc-nba-title">'+nextAction.text+'</div>';
  h += '<button class="cc-btn cc-btn-primary" style="margin-top:8px">Take action \u2192</button>';
  h += '</div>';
  h += '<div class="cc-nba-right"><span class="cc-nba-due">Close: '+closeStr+'</span></div>';
  h += '</div>';

  /* Tasks */
  if (tasks.length) {
    h += '<div class="cc-details-card">';
    h += '<div class="cc-details-card-title">Tasks</div>';
    tasks.forEach(function(t){
      var pc = {High:'#dc2626',Medium:'#d97706',Low:'var(--text-light)'};
      h += '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #f3f4f6">';
      h += '<div style="width:6px;height:6px;border-radius:50%;background:'+(pc[t.priority]||'var(--text-light)')+'"></div>';
      h += '<div style="flex:1"><div style="font-size:12.5px;font-weight:500;color:var(--text)">'+t.name+'</div>';
      h += '<div style="font-size:10px;color:var(--text-light)">'+(t.ref||'')+' · '+(t.status||'')+'</div></div></div>';
    });
    h += '</div>';
  }
  h += '</div></div></div>';

  /* === CONTACTS === */
  h += '<div id="o360-sec-contacts" class="cc-section">';
  var cRows = contacts.map(function(c){
    var ci = c.name?c.name.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase():'?';
    return{_navObj:'contacts',_navId:c.id,cells:[
      {html:'<span class="cc-contact-av" style="background:#7c3aed">'+ci+'</span> '+c.name,cls:'cc-rel-primary'},
      {html:c.role||'—'},{html:c.email||'—',cls:'cc-rel-link'},{html:c.phone||'—'}
    ]};
  });
  h += ccRelatedTable('Contacts',contacts.length,'New contact','2fr 1.2fr 1.5fr 1fr',[{label:'Name'},{label:'Role'},{label:'Email'},{label:'Phone'}],cRows);
  h += '</div>';

  /* === QUOTES === */
  h += '<div id="o360-sec-quotes" class="cc-section">';
  var qRows = quotes.map(function(q){
    var qAmt = typeof fmtAmount==='function'?fmtAmount(q.value||q.amount||0):'—';
    return{_navObj:'quotes',_navId:q.id,cells:[
      {html:q.name||'Quote #'+q.id,cls:'cc-rel-primary'},{html:ccStageBadge(q.stage||q.status||'Draft')},
      {html:q.validUntil?fmtDate(q.validUntil):(q.date||'—')},{html:qAmt,cls:'cc-rel-bold',style:'text-align:right;justify-content:flex-end'}
    ]};
  });
  h += ccRelatedTable('Quotes',quotes.length,'New quote','2.5fr 100px 120px 100px',[{label:'Quote'},{label:'Status'},{label:'Date'},{label:'Amount',right:true}],qRows);
  h += '</div>';

  /* === ACTIVITY === */
  h += '<div id="o360-sec-activity" class="cc-section">';
  h += '<div class="cc-rel-header"><span class="cc-rel-title">Activity <span class="cc-rel-count">('+activities.length+')</span></span></div>';
  h += '<div class="cc-timeline">';
  activities.forEach(function(a){
    var tc = {phone:'#3b82f6',users:'#8b5cf6',mail:'#10b981',mapPin:'#ef4444'}[a.icon||a.type]||'#6b7280';
    var ik = a.icon||(a.type==='call'||a.type==='phone'?'phone':a.type==='meeting'||a.type==='users'?'users':a.type==='email'||a.type==='mail'?'mail':'activities');
    h += ccTimelineItem(ik,tc,a.subject||a.name||'Activity',(a.contact||'')+(a.date?' · '+a.date:''),'');
  });
  if (!activities.length) h += '<div class="cc-rel-empty">No activities recorded</div>';
  h += '</div></div>';

  h += '</div></div>';
  container.innerHTML = h;
  container.scrollTop = 0;

  /* Bind */
  document.getElementById('cc-back').addEventListener('click',function(){navigate('opportunities');});
  _ccBindPhoto(container, rec, 'opportunities', oppId, rec.name, initials);
  ccBindTabs(container,'o360');
  bindCrmActionButtons(container);

  var acctLink = document.getElementById('cc-acct-link');
  if (acctLink && rec.account) acctLink.addEventListener('click',function(){navigate('record','accounts',rec.account);});

  /* Funnel step click */
  container.querySelectorAll('.cc-funnel-seg[data-stage]').forEach(function(seg){
    seg.addEventListener('click',function(){
      var ns = seg.getAttribute('data-stage');
      if (ns && ns !== rec.stage) { rec.stage = ns; renderOpp360(container, rec); if(typeof showDragToast==='function') showDragToast(rec.name,ns,'opportunities'); }
    });
  });
}

function o360NextAction(rec){if(rec.stage==='lead')return{icon:'phone',color:'#3b82f6',text:'Schedule a discovery call to qualify this opportunity.'};if(rec.stage==='study')return{icon:'users',color:'#8b5cf6',text:'Arrange a technical meeting to define project scope.'};if(rec.stage==='tender')return{icon:'quotes',color:'#f59e0b',text:'Prepare and submit tender documentation before deadline.'};if(rec.stage==='proposal')return{icon:'mail',color:'#10b981',text:'Send the commercial proposal and follow up with the decision maker.'};if(rec.stage==='negotiation')return{icon:'phone',color:'#3b82f6',text:'Follow up on revised pricing to close negotiations.'};if(rec.stage==='closed_won')return{icon:'projects',color:'#10b981',text:'Initiate project kickoff and assign delivery team.'};return{icon:'chart',color:'#6366f1',text:'Project launched — monitor delivery and client satisfaction.'};}


/* ═══════════════════════════════════════════
   SHARED PHOTO BIND HELPER
   ═══════════════════════════════════════════ */
function _ccBindPhoto(container, rec, objKey, recId, name, initials) {
  var photoWrap = document.getElementById('cc-photo-wrap');
  var photoInput = document.getElementById('cc-photo-input');
  if (!photoWrap || !photoInput) return;

  var overlay = photoWrap.querySelector('.cc-photo-overlay');
  if (overlay) overlay.addEventListener('click', function(e) { e.stopPropagation(); photoInput.click(); });

  var avatarEl = document.getElementById('cc-avatar');
  if (avatarEl) {
    avatarEl.addEventListener('click', function(e) {
      e.stopPropagation();
      var url = rec.photoURL || rec.photo || '';
      if (url && typeof fbShowPhotoPreview === 'function') { fbShowPhotoPreview(url, name); }
      else { photoInput.click(); }
    });
  }

  photoInput.addEventListener('change', function(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var avatar = document.getElementById('cc-avatar');
    if (avatar) { avatar.innerHTML = '<div style="width:22px;height:22px;border:2.5px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .6s linear infinite"></div>'; }
    if (typeof fbCompressAndSavePhoto === 'function') {
      fbCompressAndSavePhoto(file, objKey, recId).then(function(url) {
        if (avatar) { avatar.className = 'cc-avatar cc-avatar-img'; avatar.innerHTML = '<img src="' + url + '" alt="' + name + '" />'; }
        if (typeof fbShowStatus === 'function') fbShowStatus('Photo uploaded');
      }).catch(function(err) {
        console.error('[360] Photo error:', err);
        if (avatar) { avatar.className = 'cc-avatar cc-avatar-initials'; avatar.innerHTML = initials; }
        if (typeof fbShowStatus === 'function') fbShowStatus('Photo upload failed', true);
      });
    }
  });
}

/* ════════════════════════════════════════════════════════
   PRODUCT 360
   ════════════════════════════════════════════════════════ */

function renderProduct360(container, rec) {
  injectProd360Styles();
  var D = window.DATA;
  var prodId = rec.id;
  var prodName = rec.name || 'Unknown Product';
  var initials = prodName.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase();

  /* Related data */
  var quotes = (D.quotes||[]).filter(function(q){
    if (q.productId === prodId) return true;
    /* Also check lineItems for product name match */
    if (q.lineItems && q.lineItems.length) {
      return q.lineItems.some(function(li){ return li.product === prodName; });
    }
    return false;
  });
  var claims = (D.claims||[]).filter(function(c){ return c.productId === prodId; });
  var activities = (D.activities||[]).filter(function(a){ return a.productId === prodId; }).slice(0,5);

  /* Totals */
  var totalQuoteValue = quotes.reduce(function(s,q){ return s + (q.value||0); }, 0);
  var wonQuotes = quotes.filter(function(q){ return q.stage==='Won'||q.stage==='Accepted'; });
  var wonValue = wonQuotes.reduce(function(s,q){ return s + (q.value||0); }, 0);
  var openClaims = claims.filter(function(c){ return c.status==='Open'||c.status==='In Progress'||c.status==='Investigation'; });

  /* Category color */
  var catColors = {Glazing:'#3b82f6',Insulation:'#f59e0b','Mortars & Concrete':'#8b5cf6',Coatings:'#10b981',Structural:'#ef4444'};
  var catColor = catColors[rec.category] || 'var(--text-muted)';

  var h = '<div class="pd3">';

  /* Back nav */
  h += '<div class="pd3-back" id="pd3-back">' + svgIcon('arrowLeft',14,'var(--text-muted)') + '<span>Products</span></div>';

  /* Header card */
  h += '<div class="pd3-header-card">';
  h += '<div class="pd3-header-top">';

  /* Photo avatar 92px */
  var photoUrl = rec.photoURL || rec.photo || '';
  h += '<div class="pd3-photo-wrap" id="pd3-photo-wrap" title="Click to change photo">';
  if (photoUrl) {
    h += '<div class="pd3-avatar pd3-avatar-img" id="pd3-avatar"><img src="'+photoUrl+'" alt="'+prodName+'" /></div>';
  } else {
    h += '<div class="pd3-avatar pd3-avatar-initials" id="pd3-avatar" style="background:'+catColor+'14;color:'+catColor+';border-color:'+catColor+'40">' + initials + '</div>';
  }
  h += '<div class="pd3-photo-overlay">' + svgIcon('plus',16,'#fff') + '</div>';
  h += '<input type="file" id="pd3-photo-input" accept="image/*" style="display:none" />';
  h += '</div>';

  /* Info */
  h += '<div class="pd3-header-info">';
  h += '<div class="pd3-name-row"><h1 class="pd3-name">' + prodName + '</h1>';
  var sc = rec.status==='Active' ? 'var(--success)' : 'var(--text-light)';
  h += '<span class="stage-badge" style="color:'+sc+'"><span class="dot" style="background:'+sc+'"></span>'+(rec.status||'Active')+'</span>';
  h += '</div>';
  h += '<div class="pd3-subtitle">' + (rec.category||'—') + ' · ' + (rec.family||'—') + '</div>';
  h += '<div class="pd3-detail-chips">';
  if (rec.sku) h += '<span class="pd3-chip">' + svgIcon('quotes',12,'var(--text-light)') + ' SKU: ' + rec.sku + '</span>';
  if (rec.manufacturer) h += '<span class="pd3-chip">' + svgIcon('accounts',12,'var(--text-light)') + ' ' + rec.manufacturer + '</span>';
  if (rec.warehouse) h += '<span class="pd3-chip">' + svgIcon('mapPin',12,'var(--text-light)') + ' ' + rec.warehouse + '</span>';
  if (rec.unitPrice) h += '<span class="pd3-chip" style="color:'+catColor+';font-weight:700">' + rec.unitPrice.toLocaleString('en-US') + '€/' + (rec.unit||'unit') + '</span>';
  h += '</div>';
  h += '</div>';

  /* Header metrics */
  h += '<div class="pd3-header-metrics">';
  h += _pd3HMetric(quotes.length, 'Quotes', 'var(--accent)');
  h += _pd3HMetric(typeof fmtAmount==='function' ? fmtAmount(totalQuoteValue) : Math.round(totalQuoteValue/1000)+'K€', 'Quote Value', '');
  h += _pd3HMetric(openClaims.length, 'Open Claims', openClaims.length>0?'var(--danger)':'var(--success)');
  h += _pd3HMetric(rec.stockLevel ? rec.stockLevel.toLocaleString('en-US') : '—', 'In Stock', '');
  h += '</div></div>';

  /* Actions */
  h += '<div class="pd3-actions">';
  h += crmActionButtons('pd3', 'products', prodId);
  h += '</div>';
  h += '</div>';

  /* KPI row */
  h += '<div class="pd3-kpi-row">';
  h += _pd3Kpi(rec.unitPrice ? rec.unitPrice.toLocaleString('en-US')+'€' : '—', 'Unit Price', catColor);
  h += _pd3Kpi(rec.leadTime ? rec.leadTime+' days' : '—', 'Lead Time', '#3b82f6');
  h += _pd3Kpi(rec.minOrder ? rec.minOrder.toLocaleString('en-US') : '—', 'Min Order', '#8b5cf6');
  h += _pd3Kpi(rec.certification || '—', 'Certification', '#10b981');
  h += '</div>';

  /* 2-col layout */
  h += '<div class="pd3-grid2"><div class="pd3-col">';

  /* Product Specs section */
  h += '<div class="pd3-section"><div class="pd3-section-head">' + svgIcon('quotes',13,'var(--text-light)') + '<span class="pd3-section-title">Product Specifications</span></div>';
  h += '<div class="pd3-specs">';
  var specFields = [
    {l:'Application', v:rec.application},
    {l:'Dimensions', v:rec.dimensions},
    {l:'Weight', v:rec.weight ? rec.weight+' kg' : null},
    {l:'Certification', v:rec.certification},
    {l:'Lead Time', v:rec.leadTime ? rec.leadTime+' days' : null},
    {l:'Min Order', v:rec.minOrder ? rec.minOrder.toLocaleString('en-US')+' '+rec.unit : null},
    {l:'Stock Level', v:rec.stockLevel ? rec.stockLevel.toLocaleString('en-US')+' '+rec.unit : null},
    {l:'Warehouse', v:rec.warehouse}
  ];
  specFields.forEach(function(sf){
    if(!sf.v) return;
    h += '<div class="pd3-spec-row"><span class="pd3-spec-label">'+sf.l+'</span><span class="pd3-spec-value">'+sf.v+'</span></div>';
  });
  h += '</div></div>';

  /* Description */
  if (rec.description) {
    h += '<div class="pd3-section"><div class="pd3-section-head">' + svgIcon('list',13,'var(--text-light)') + '<span class="pd3-section-title">Description</span></div>';
    h += '<div style="padding:14px 16px;font-size:12.5px;color:var(--text);line-height:1.6">' + rec.description + '</div></div>';
  }

  /* Quotes section */
  h += '<div class="pd3-section"><div class="pd3-section-head">' + svgIcon('quotes',13,'var(--text-light)') + '<span class="pd3-section-title">Quotes</span><span class="pd3-section-count">'+quotes.length+'</span><span class="pd3-section-link" data-nav="quotes">View all</span></div>';
  if (!quotes.length) {
    h += '<div class="pd3-empty">No quotes reference this product</div>';
  } else {
    quotes.slice(0,5).forEach(function(q,i){
      var qStageColors = {Draft:'#94a3b8',Sent:'#3b82f6',Negotiation:'#f59e0b',Won:'#10b981',Accepted:'#10b981',Lost:'#ef4444'};
      var qc = qStageColors[q.stage]||'var(--text-muted)';
      h += '<div class="pd3-row'+(i===Math.min(quotes.length,5)-1?' pd3-row-last':'')+'" data-nav-obj="quotes" data-nav-id="'+q.id+'">';
      h += '<div class="pd3-row-left"><div class="pd3-row-title">'+q.name+'</div>';
      h += '<div class="pd3-row-sub">'+(q.accountName||'')+(q.validUntil?' · Valid '+fmtDate(q.validUntil):'')+'</div></div>';
      h += '<div class="pd3-row-right">';
      h += '<div class="pd3-row-amount">'+(typeof fmtAmount==='function'?fmtAmount(q.value||0):'—')+'</div>';
      h += '<span class="stage-badge" style="color:'+qc+'"><span class="dot" style="background:'+qc+'"></span>'+(q.stage||'—')+'</span>';
      h += '</div></div>';
    });
  }
  h += '</div>';

  h += '</div><div class="pd3-col">';

  /* Claims section */
  h += '<div class="pd3-section"><div class="pd3-section-head">' + svgIcon('claims',13,'var(--text-light)') + '<span class="pd3-section-title">Claims</span><span class="pd3-section-count">'+claims.length+'</span><span class="pd3-section-link" data-nav="claims">View all</span></div>';
  if (!claims.length) {
    h += '<div class="pd3-empty">No claims for this product</div>';
  } else {
    claims.slice(0,5).forEach(function(cl,i){
      var clColors = {Open:'#ef4444','In Progress':'#f59e0b',Investigation:'#3b82f6',Resolved:'#10b981',Closed:'#94a3b8'};
      var clc = clColors[cl.status]||'var(--text-muted)';
      h += '<div class="pd3-row'+(i===Math.min(claims.length,5)-1?' pd3-row-last':'')+'" data-nav-obj="claims" data-nav-id="'+cl.id+'">';
      h += '<div class="pd3-row-left"><div class="pd3-row-title">'+(cl.title||cl.name||'—')+'</div>';
      h += '<div class="pd3-row-sub">'+(cl.priority||'')+' · '+(cl.reportedDate?fmtDate(cl.reportedDate):'')+'</div></div>';
      h += '<div class="pd3-row-right">';
      h += '<span class="stage-badge" style="color:'+clc+'"><span class="dot" style="background:'+clc+'"></span>'+(cl.status||'—')+'</span>';
      h += '</div></div>';
    });
  }
  h += '</div>';

  /* Details */
  h += crmDetailsSection('pd3', 'products', rec);

  h += '</div></div></div>';

  container.innerHTML = h;
  container.scrollTop = 0;

  /* ── Bind events ── */
  document.getElementById('pd3-back').addEventListener('click', function(){ navigate('products'); });

  /* Photo upload */
  var pd3PhotoWrap = document.getElementById('pd3-photo-wrap');
  var pd3PhotoInput = document.getElementById('pd3-photo-input');
  if (pd3PhotoWrap && pd3PhotoInput) {
    var pd3Overlay = pd3PhotoWrap.querySelector('.pd3-photo-overlay');
    if (pd3Overlay) {
      pd3Overlay.addEventListener('click', function(e){ e.stopPropagation(); pd3PhotoInput.click(); });
    }
    var pd3AvatarEl = document.getElementById('pd3-avatar');
    if (pd3AvatarEl) {
      pd3AvatarEl.addEventListener('click', function(e){
        e.stopPropagation();
        var currentUrl = rec.photoURL || rec.photo || '';
        if (currentUrl && typeof fbShowPhotoPreview === 'function') {
          fbShowPhotoPreview(currentUrl, prodName);
        } else {
          pd3PhotoInput.click();
        }
      });
    }
    pd3PhotoInput.addEventListener('change', function(e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var avatar = document.getElementById('pd3-avatar');
      if (avatar) { avatar.classList.add('pd3-avatar-loading'); avatar.innerHTML = '<div class="pd3-spinner"></div>'; }
      if (typeof fbCompressAndSavePhoto === 'function') {
        fbCompressAndSavePhoto(file, 'products', prodId).then(function(url) {
          if (avatar) { avatar.classList.remove('pd3-avatar-loading'); avatar.className = 'pd3-avatar pd3-avatar-img'; avatar.innerHTML = '<img src="'+url+'" alt="'+prodName+'" />'; }
          fbShowStatus('Photo uploaded');
        }).catch(function(err) {
          console.error('[PD3] Photo error:', err);
          if (avatar) { avatar.classList.remove('pd3-avatar-loading'); avatar.innerHTML = initials; }
          fbShowStatus('Photo upload failed', true);
        });
      }
    });
  }

  /* Row navigation */
  container.querySelectorAll('.pd3-row[data-nav-id]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate('record', el.getAttribute('data-nav-obj'), el.getAttribute('data-nav-id')); });
  });
  container.querySelectorAll('.pd3-section-link[data-nav]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate(el.getAttribute('data-nav')); });
  });
  bindCrmActionButtons(container);
  bindDetailsLinks(container);
}

/* ── Product 360 Helpers ── */
function _pd3HMetric(v,l,a){var s=a?'color:'+a:'color:var(--text)';return '<div class="pd3-hmetric"><div class="pd3-hmetric-val" style="'+s+'">'+v+'</div><div class="pd3-hmetric-label">'+l+'</div></div>';}
function _pd3Kpi(v,l,c){return '<div class="pd3-kpi"><div class="pd3-kpi-value" style="color:'+c+'">'+v+'</div><div class="pd3-kpi-label">'+l+'</div></div>';}

function injectProd360Styles() {
  if (document.getElementById('pd3-css')) return;
  var s = document.createElement('style'); s.id = 'pd3-css';
  s.textContent = '\
/* ═══ Product 360 — pd3- prefix ════════════════════ */\
.pd3{padding:14px 28px 40px;max-width:1200px;margin:0 auto}\
\
/* Back */\
.pd3-back{display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:12px;padding:4px 0;transition:color .12s}\
.pd3-back:hover{color:var(--accent)}\
\
/* Header Card */\
.pd3-header-card{background:var(--card);border-radius:14px;border:1px solid var(--border);box-shadow:0 1px 4px rgba(0,0,0,.04);margin-bottom:14px;overflow:hidden}\
.pd3-header-top{display:flex;align-items:center;gap:22px;padding:22px 26px 16px}\
\
/* Photo Avatar */\
.pd3-photo-wrap{position:relative;flex-shrink:0;cursor:pointer}\
.pd3-avatar{width:92px;height:92px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;border:1.5px solid var(--border);background:var(--card);box-shadow:0 2px 8px rgba(0,0,0,.06);transition:transform .15s}\
.pd3-avatar:hover{transform:scale(1.04)}\
.pd3-avatar-img{padding:0;overflow:hidden}\
.pd3-avatar-img img{width:100%;height:100%;object-fit:cover;border-radius:13px}\
.pd3-photo-overlay{position:absolute;bottom:0;right:0;width:26px;height:26px;border-radius:8px;background:var(--accent);display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity .15s;box-shadow:0 2px 6px rgba(37,99,235,.3)}\
.pd3-photo-wrap:hover .pd3-photo-overlay{opacity:1}\
.pd3-spinner{width:22px;height:22px;border:2.5px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .6s linear infinite}\
.pd3-avatar-loading{opacity:.5}\
\
/* Header Info */\
.pd3-header-info{flex:1;min-width:0}\
.pd3-name-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}\
.pd3-name{font-size:22px;font-weight:800;color:var(--text);letter-spacing:-.3px;margin:0;line-height:1.2}\
.pd3-subtitle{font-size:13px;color:var(--text-muted);margin-top:4px;font-weight:500}\
.pd3-detail-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}\
.pd3-chip{display:inline-flex;align-items:center;gap:5px;background:#f8f9fb;border:1px solid var(--border);padding:4px 10px;border-radius:7px;font-size:11px;color:var(--text-muted);font-weight:500}\
\
/* Header Metrics */\
.pd3-header-metrics{display:flex;flex-direction:column;gap:12px;flex-shrink:0;align-items:center;padding-left:20px;border-left:1px solid var(--border)}\
.pd3-hmetric{display:flex;flex-direction:column;align-items:center}\
.pd3-hmetric-val{font-size:22px;font-weight:800;letter-spacing:-.5px;line-height:1;font-variant-numeric:tabular-nums}\
.pd3-hmetric-label{font-size:9px;color:var(--text-light);font-weight:500;margin-top:2px;text-transform:uppercase;letter-spacing:.3px}\
\
/* Actions */\
.pd3-actions{display:flex;gap:7px;padding:0 26px 14px;flex-wrap:wrap}\
\
/* KPI Row */\
.pd3-kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}\
.pd3-kpi{background:var(--card);border-radius:10px;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,.04);padding:16px 18px;text-align:center;transition:all .15s}\
.pd3-kpi:hover{box-shadow:0 4px 14px rgba(0,0,0,.08);transform:translateY(-2px)}\
.pd3-kpi-value{font-size:22px;font-weight:800;letter-spacing:-.5px;line-height:1;margin-bottom:3px;font-variant-numeric:tabular-nums}\
.pd3-kpi-label{font-size:10.5px;color:var(--text-muted);font-weight:500;text-transform:uppercase;letter-spacing:.4px}\
\
/* 2-Column Grid */\
.pd3-grid2{display:grid;grid-template-columns:1.12fr 1fr;gap:14px;align-items:start}\
.pd3-col{display:flex;flex-direction:column;gap:12px}\
\
/* Sections */\
.pd3-section{background:var(--card);border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,.04);border:1px solid var(--border);overflow:hidden}\
.pd3-section-head{padding:11px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:7px}\
.pd3-section-title{font-size:11.5px;font-weight:700;color:var(--text);text-transform:uppercase;letter-spacing:.5px}\
.pd3-section-count{font-size:10px;font-weight:700;background:var(--accent-light);color:var(--accent);padding:1px 7px;border-radius:8px;margin-left:4px}\
.pd3-section-link{margin-left:auto;font-size:10px;font-weight:500;color:var(--text-light);cursor:pointer;transition:color .12s}\
.pd3-section-link:hover{color:var(--accent)}\
\
/* Specs */\
.pd3-specs{padding:4px 0}\
.pd3-spec-row{display:flex;justify-content:space-between;align-items:center;padding:9px 16px;border-bottom:1px solid #f8fafc}\
.pd3-spec-row:last-child{border-bottom:none}\
.pd3-spec-label{font-size:11px;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.3px}\
.pd3-spec-value{font-size:12.5px;font-weight:600;color:var(--text)}\
\
/* Rows */\
.pd3-row{padding:10px 16px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .08s;display:flex;align-items:center;gap:10px}\
.pd3-row:hover{background:#fafbfc}\
.pd3-row-last{border-bottom:none}\
.pd3-row-left{flex:1;min-width:0}\
.pd3-row-right{display:flex;align-items:center;gap:8px;flex-shrink:0}\
.pd3-row-title{font-size:12.5px;font-weight:700;color:var(--text);line-height:1.2}\
.pd3-row-sub{font-size:10px;color:var(--text-light);margin-top:2px}\
.pd3-row-amount{font-size:15px;font-weight:800;color:var(--text);font-variant-numeric:tabular-nums;letter-spacing:-.3px;margin-right:4px}\
.pd3-empty{padding:20px 16px;text-align:center;color:var(--text-light);font-size:11px}\
\
/* Responsive */\
@media(max-width:1100px){\
  .pd3-grid2{grid-template-columns:1fr}\
  .pd3-kpi-row{grid-template-columns:repeat(2,1fr)}\
  .pd3-header-top{flex-wrap:wrap}\
  .pd3-header-metrics{border-left:none;padding-left:0;flex-direction:row;gap:20px;margin-top:10px}\
}\
@media(max-width:640px){\
  .pd3{padding:10px 10px 32px}\
  .pd3-header-top{padding:16px 14px 12px;gap:12px}\
  .pd3-avatar{width:64px;height:64px;font-size:20px}\
  .pd3-name{font-size:17px}\
  .pd3-kpi-value{font-size:18px}\
  .pd3-actions{padding:10px 14px}\
}\
';
  document.head.appendChild(s);
}


/* ════════════════════════════════════════════════════════
   GENERIC RECORD
   ════════════════════════════════════════════════════════ */

function renderGenericRecord(objKey, rec, headerEl, contentEl) {
  var cfg = OBJ_CONFIG ? OBJ_CONFIG[objKey] : null;
  var title = rec.name || rec.id;
  var parentLabel = cfg ? cfg.title : objKey;

  headerEl.innerHTML = '<div class="obj-header"><div class="obj-header-left">'+
    '<button class="rec-back-btn" id="rec-back">'+svgIcon('arrowLeft',14)+'</button>'+
    '<div><h1 style="font-size:16px">'+title+'</h1>'+
    '<div style="font-size:11px;color:var(--text-light)">'+parentLabel+'</div></div></div>'+
    '<div style="display:flex;gap:6px">'+
    '<button class="crm-edit-btn" data-obj="'+objKey+'" data-rec="'+rec.id+'" style="display:inline-flex;align-items:center;gap:5px;padding:6px 14px;border-radius:7px;border:1px solid var(--border);background:#fff;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;color:var(--text-muted);transition:all .12s">'+svgIcon('edit',13,'var(--text-muted)')+' Edit</button>'+
    '<button class="crm-delete-btn" data-obj="'+objKey+'" data-rec="'+rec.id+'" style="display:inline-flex;align-items:center;gap:5px;padding:6px 14px;border-radius:7px;border:1px solid #fecaca;background:#fff;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;color:#ef4444;transition:all .12s">'+svgIcon('trash',13,'#ef4444')+' Delete</button>'+
    '</div></div>';

  document.getElementById('rec-back').addEventListener('click', function(){ navigate(objKey); });

  var fields = Object.keys(rec).filter(function(k){return k!=='id';});
  var html = '<div style="padding:14px 18px;max-width:800px"><div class="rec-detail-card"><div class="rec-fields">';

  fields.forEach(function(k) {
    var v = rec[k];
    var label = k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g,' $1');
    var display = '';

    if (k==='account') { display = getAccountName(v); }
    else if (k==='amount'||k==='pipeline'||k==='budget'||k==='estimatedValue') { display = typeof fmtAmount==='function' ? fmtAmount(v) : String(v); }
    else if (k==='stage'||k==='phase') {
      var arr = STAGES[objKey]||STAGES.projects||[];
      var st = arr.find(function(s){return s.key===v;});
      display = st ? '<span class="stage-badge" style="color:'+st.color+'"><span class="dot" style="background:'+st.color+'"></span>'+st.label+'</span>' : (v||'—');
    } else if (k==='status') {
      var col = v==='Active'?'var(--success)':'var(--text-light)';
      display = '<span class="stage-badge" style="color:'+col+'"><span class="dot" style="background:'+col+'"></span>'+v+'</span>';
    } else if (k==='close'||k==='start'||k==='end') { display = v ? fmtDate(v) : '—'; }
    else { display = v!==undefined&&v!==null&&v!=='' ? String(v) : '—'; }

    html += '<div class="rec-field"><div class="rec-field-label">'+label+'</div><div class="rec-field-value">'+display+'</div></div>';
  });

  html += '</div></div></div>';
  contentEl.innerHTML = html;
  bindCrmActionButtons(headerEl);
}


/* ════════════════════════════════════════════════════════
   EDIT / DELETE — Centralized Modal System
   Shared across ALL 360 layouts
   ════════════════════════════════════════════════════════ */

/* ── Editable fields per object ── */
var EDIT_FIELDS = {
  accounts: [
    {key:'name',      label:'Account Name',  type:'text'},
    {key:'industry',  label:'Industry',      type:'select', options:['General Contractor','Real Estate Developer','Civil Engineering','Road & Rail','Foundations & Piling','Building Materials','Infrastructure','Energy','Other']},
    {key:'city',      label:'City',          type:'text'},
    {key:'phone',     label:'Phone',         type:'text'},
    {key:'website',   label:'Website',       type:'text'},
    {key:'pipeline',  label:'Pipeline Value', type:'number'},
    {key:'opps',      label:'Open Opps',     type:'number'},
    {key:'status',    label:'Status',        type:'select', options:['Active','Prospect','Inactive']}
  ],
  contacts: [
    {key:'name',      label:'Contact Name',  type:'text'},
    {key:'role',      label:'Role / Title',  type:'text'},
    {key:'email',     label:'Email',         type:'text'},
    {key:'phone',     label:'Phone',         type:'text'},
    {key:'city',      label:'City',          type:'text'},
    {key:'account',   label:'Account',       type:'text', ref:'accounts'},
    {key:'influence', label:'Influence',     type:'select', options:['Decision Maker','Influencer','Champion','Technical','Other']}
  ],
  leads: [
    {key:'name',          label:'Lead Name',       type:'text'},
    {key:'account',       label:'Account',         type:'text', ref:'accounts'},
    {key:'source',        label:'Source',           type:'select', options:['Website','Trade Show','Referral','Cold Call','Inbound','Partner']},
    {key:'priority',      label:'Priority',         type:'select', options:['High','Medium','Low']},
    {key:'stage',         label:'Stage',            type:'select', options:['new','contacted','qualified','proposal','converted']},
    {key:'estimatedValue',label:'Estimated Value',  type:'number'}
  ],
  opportunities: [
    {key:'name',    label:'Opportunity Name', type:'text'},
    {key:'productIds', label:'Products',      type:'product-picker'},
    {key:'account', label:'Account',          type:'text', ref:'accounts'},
    {key:'amount',  label:'Amount',           type:'number'},
    {key:'prob',    label:'Probability (%)',   type:'number'},
    {key:'stage',   label:'Stage',            type:'select', options:['lead','study','tender','proposal','negotiation','closed_won','launched']},
    {key:'close',   label:'Close Date',       type:'date'},
    {key:'owner',   label:'Owner',            type:'text'},
    {key:'projectId',label:'Project ID',      type:'text'}
  ],
  projects: [
    {key:'name',              label:'Project Name',       type:'text'},
    {key:'account',           label:'Account',            type:'text', ref:'accounts'},
    {key:'phase',             label:'Phase',              type:'select', options:['prestudy','tender','contracting','construction','delivered']},
    {key:'location',          label:'Location',           type:'text'},
    {key:'budget',            label:'Budget',             type:'number'},
    {key:'value',             label:'Project Value',      type:'number'},
    {key:'owner',             label:'Owner',              type:'text'},
    {key:'commercialLead',    label:'Commercial Lead',    type:'text'},
    {key:'technicalLead',     label:'Technical Lead',     type:'text'},
    {key:'source',            label:'Source',             type:'select', options:['Tender','Referral','Website','Cold Call','Partner']},
    {key:'startDate',         label:'Start Date',         type:'date'},
    {key:'expectedDelivery',  label:'Expected Delivery',  type:'date'},
    {key:'health',            label:'Health',             type:'select', options:['Healthy','Attention','At Risk']},
    {key:'description',       label:'Description',        type:'textarea'}
  ],
  claims: [
    {key:'title',           label:'Claim Title',      type:'text'},
    {key:'status',          label:'Status',           type:'select', options:['Open','In Progress','Investigation','Negotiation','Resolved','Closed']},
    {key:'priority',        label:'Priority',         type:'select', options:['Critical','High','Medium','Low']},
    {key:'risk',            label:'Risk Level',       type:'select', options:['High','Medium','Low']},
    {key:'impact',          label:'Impact Value',     type:'number'},
    {key:'category',        label:'Category',         type:'text'},
    {key:'productIds',      label:'Products',         type:'product-picker'},
    {key:'projectId',       label:'Project',          type:'text', ref:'projects'},
    {key:'accountId',       label:'Account',          type:'text', ref:'accounts'},
    {key:'owner',           label:'Owner',            type:'text'},
    {key:'reportedDate',    label:'Reported Date',    type:'date'},
    {key:'resolvedDate',    label:'Resolved Date',    type:'date'},
    {key:'rootCause',       label:'Root Cause',       type:'textarea'},
    {key:'rootCauseCategory',label:'Root Cause Category',type:'text'},
    {key:'description',     label:'Description',      type:'textarea'}
  ],
  activities: [
    {key:'subject',         label:'Subject',            type:'text'},
    {key:'type',            label:'Type',               type:'select', options:['Call','Meeting','Email','Site Visit']},
    {key:'status',          label:'Status',             type:'select', options:['Planned','In Progress','Completed']},
    {key:'date',            label:'Date',               type:'date'},
    {key:'time',            label:'Time',               type:'text'},
    {key:'duration',        label:'Duration (min)',     type:'number'},
    {key:'location',        label:'Location',           type:'text'},
    {key:'owner',           label:'Owner',              type:'text'},
    {key:'accountId',       label:'Account',            type:'text', ref:'accounts'},
    {key:'contactId',       label:'Contact',            type:'text', ref:'contacts'},
    {key:'opportunityId',   label:'Opportunity',        type:'text', ref:'opportunities'},
    {key:'projectId',       label:'Project',            type:'text', ref:'projects'},
    {key:'purpose',         label:'Purpose / Notes',    type:'textarea'},
    {key:'outcome',         label:'Outcome',            type:'textarea'}
  ],
  quotes: [
    {key:'name',            label:'Quote Name',         type:'text'},
    {key:'stage',           label:'Stage',              type:'select', options:['Draft','Sent','Negotiation','Won','Lost','Expired']},
    {key:'value',           label:'Value',              type:'number'},
    {key:'netValue',        label:'Net Value',          type:'number'},
    {key:'discount',        label:'Discount (%)',       type:'number'},
    {key:'margin',          label:'Margin (%)',         type:'number'},
    {key:'revision',        label:'Revision',           type:'number'},
    {key:'validUntil',      label:'Valid Until',        type:'date'},
    {key:'createdDate',     label:'Created Date',       type:'date'},
    {key:'createdBy',       label:'Created By',         type:'text'},
    {key:'paymentTerms',    label:'Payment Terms',      type:'text'},
    {key:'deliveryTerms',   label:'Delivery Terms',     type:'text'},
    {key:'contact',         label:'Contact',            type:'text'},
    {key:'productIds',      label:'Products',           type:'product-picker'},
    {key:'opportunityId',   label:'Opportunity',        type:'text', ref:'opportunities'},
    {key:'accountId',       label:'Account',            type:'text', ref:'accounts'},
    {key:'winProb',         label:'Win Probability',    type:'text'},
    {key:'competitors',     label:'Competitors',        type:'text'},
    {key:'negoNote',        label:'Negotiation Note',   type:'textarea'}
  ],
  products: [
    {key:'name',            label:'Product Name',       type:'text'},
    {key:'category',        label:'Category',           type:'select', options:['Glazing','Insulation','Mortars & Concrete','Coatings','Structural','Other']},
    {key:'family',          label:'Product Family',     type:'text'},
    {key:'sku',             label:'SKU',                type:'text'},
    {key:'unitPrice',       label:'Unit Price',         type:'number'},
    {key:'unit',            label:'Unit',               type:'select', options:['m²','m³','pcs','kg','L']},
    {key:'manufacturer',    label:'Manufacturer',       type:'text'},
    {key:'application',     label:'Application',        type:'text'},
    {key:'certification',   label:'Certification',      type:'text'},
    {key:'weight',          label:'Weight (kg)',        type:'number'},
    {key:'dimensions',      label:'Dimensions',         type:'text'},
    {key:'leadTime',        label:'Lead Time (days)',   type:'number'},
    {key:'minOrder',        label:'Min Order Qty',      type:'number'},
    {key:'stockLevel',      label:'Stock Level',        type:'number'},
    {key:'warehouse',       label:'Warehouse',          type:'text'},
    {key:'status',          label:'Status',             type:'select', options:['Active','Discontinued']},
    {key:'description',     label:'Description',        type:'textarea'}
  ],
  users: [
    {key:'name',       label:'Full Name',    type:'text'},
    {key:'email',      label:'Email',        type:'text'},
    {key:'phone',      label:'Phone',        type:'text'},
    {key:'title',      label:'Job Title',    type:'text'},
    {key:'department', label:'Department',   type:'select', options:['IT Direction','Sales','Sales Management','Operations','Field Ops','Marketing','Finance','HR']},
    {key:'location',   label:'Location',     type:'text'},
    {key:'role',       label:'Role',         type:'select', options:['admin','user']},
    {key:'status',     label:'Status',       type:'select', options:['active','inactive']}
  ]
};


/* ═══════════════════════════════════════════════════
   DETAILS SECTION — Reusable across all 360 pages
   Renders a structured card showing ALL record fields
   ═══════════════════════════════════════════════════ */

/* Hidden keys — never shown in Details panel */
var DETAILS_HIDDEN_KEYS = ['id','photoURL','photo','keyRelationship','lineItems','revisions','activities','documents','siteVisits','claims','participants','notes','tasks','clientStakeholders'];

function crmDetailsSection(prefix, objKey, rec) {
  injectDetailsStyles();
  var fields = EDIT_FIELDS[objKey] || [];

  /* Also discover fields from rec that aren't in EDIT_FIELDS */
  var knownKeys = {};
  fields.forEach(function(f){ knownKeys[f.key] = true; });
  var extraFields = [];
  Object.keys(rec).forEach(function(k) {
    if (knownKeys[k] || DETAILS_HIDDEN_KEYS.indexOf(k) !== -1) return;
    if (typeof rec[k] === 'object' && rec[k] !== null && !Array.isArray(rec[k])) return; /* skip nested objects */
    if (Array.isArray(rec[k])) return; /* skip arrays */
    extraFields.push({key: k, label: _detailsLabel(k), type: 'text'});
  });

  var allFields = fields.concat(extraFields);

  var h = '<div class="crm-details-section ' + prefix + '-section">';
  h += '<div class="crm-details-head ' + prefix + '-section-head">';
  h += '<span class="crm-details-title ' + prefix + '-section-title">' + svgIcon('list', 14, 'var(--text-light)') + ' Record Details</span>';
  h += '<button class="crm-details-edit-btn crm-edit-btn" data-obj="' + objKey + '" data-rec="' + rec.id + '">' + svgIcon('edit', 12, 'var(--accent)') + ' Edit</button>';
  h += '</div>';
  h += '<div class="crm-details-body">';

  allFields.forEach(function(f) {
    var v = rec[f.key];
    if (v === undefined || v === null || v === '') v = '';
    var display = _detailsFormat(f, v, objKey, rec);
    h += '<div class="crm-details-row">';
    h += '<div class="crm-details-label">' + f.label + '</div>';
    h += '<div class="crm-details-value">' + display + '</div>';
    h += '</div>';
  });

  h += '</div></div>';
  return h;
}

/* Format a field value for display */
function _detailsFormat(f, v, objKey, rec) {
  if (v === '' || v === undefined || v === null) return '<span style="color:var(--text-light)">\u2014</span>';

  /* Account reference — resolve name */
  if (f.ref === 'accounts') {
    var acc = (window.DATA.accounts||[]).find(function(a){ return a.id === v; });
    if (acc) return '<span class="crm-details-link" data-nav-obj="accounts" data-nav-id="'+v+'">' + acc.name + '</span>';
    return String(v);
  }
  if (f.ref === 'contacts') {
    var ct = (window.DATA.contacts||[]).find(function(c){ return c.id === v; });
    if (ct) return '<span class="crm-details-link" data-nav-obj="contacts" data-nav-id="'+v+'">' + ct.name + '</span>';
    return String(v);
  }
  if (f.ref === 'opportunities') {
    var op = (window.DATA.opportunities||[]).find(function(o){ return o.id === v; });
    if (op) return '<span class="crm-details-link" data-nav-obj="opportunities" data-nav-id="'+v+'">' + op.name + '</span>';
    return String(v);
  }
  if (f.ref === 'projects') {
    var pj = (window.DATA.projects||[]).find(function(p){ return p.id === v; });
    if (pj) return '<span class="crm-details-link" data-nav-obj="projects" data-nav-id="'+v+'">' + pj.name + '</span>';
    return String(v);
  }
  if (f.ref === 'products') {
    var pd = (window.DATA.products||[]).find(function(p){ return p.id === v; });
    if (pd) return '<span class="crm-details-link" data-nav-obj="products" data-nav-id="'+v+'">' + pd.name + '</span>';
    return String(v);
  }

  /* Product picker (array of IDs) */
  if (f.type === 'product-picker') {
    var ids = Array.isArray(v) ? v : (typeof v === 'string' && v ? v.split(',').filter(Boolean) : []);
    if (!ids.length) return '<span style="color:var(--text-light)">\u2014</span>';
    var products = window.DATA.products || [];
    return ids.map(function(pid) {
      var pr = products.find(function(p){ return p.id === pid; });
      if (pr) return '<span class="crm-details-link" data-nav-obj="products" data-nav-id="'+pid+'" style="display:inline-block;margin:1px 3px 1px 0;padding:2px 8px;background:#2563eb0a;border:1px solid #2563eb20;border-radius:5px;font-size:11.5px">' + pr.name + '</span>';
      return pid;
    }).join(' ');
  }

  /* Amount fields */
  if (f.type === 'number' && (f.key.match(/amount|value|budget|pipeline|impact|netValue/) || f.key === 'estimatedValue')) {
    return typeof fmtAmount === 'function' ? fmtAmount(Number(v)) : String(v);
  }

  /* Date fields */
  if (f.type === 'date' || f.key.match(/date|Date|close|start|end|validUntil|createdDate/i)) {
    return typeof fmtDate === 'function' ? fmtDate(v) : String(v);
  }

  /* Stage/phase fields */
  if (f.key === 'stage' || f.key === 'phase') {
    var stArr = STAGES[objKey] || STAGES.projects || [];
    var st = stArr.find(function(s){ return s.key === v; });
    if (st) return '<span class="stage-badge" style="color:'+st.color+'"><span class="dot" style="background:'+st.color+'"></span>'+st.label+'</span>';
    return String(v).replace(/_/g,' ').replace(/\b\w/g, function(c){ return c.toUpperCase(); });
  }

  /* Status fields */
  if (f.key === 'status') {
    var col = v==='Active'||v==='active'||v==='Completed'||v==='Resolved'?'var(--success)':v==='Inactive'||v==='inactive'||v==='Closed'?'var(--text-light)':v==='In Progress'||v==='Investigation'||v==='Negotiation'?'var(--warning)':v==='Open'?'var(--danger)':'var(--text-muted)';
    return '<span class="stage-badge" style="color:'+col+'"><span class="dot" style="background:'+col+'"></span>'+v+'</span>';
  }

  /* Priority / risk */
  if (f.key === 'priority' || f.key === 'risk' || f.key === 'riskLevel') {
    var pc = {High:'var(--danger)',Critical:'var(--danger)',Medium:'var(--warning)',Low:'var(--text-light)'};
    var c = pc[v] || 'var(--text-muted)';
    return '<span class="stage-badge" style="color:'+c+'"><span class="dot" style="background:'+c+'"></span>'+v+'</span>';
  }

  /* Health */
  if (f.key === 'health') {
    var hc = v==='Healthy'?'var(--success)':v==='Attention'?'var(--warning)':'var(--danger)';
    return '<span class="stage-badge" style="color:'+hc+'"><span class="dot" style="background:'+hc+'"></span>'+v+'</span>';
  }

  /* Probability */
  if (f.key === 'prob') return v + '%';
  if (f.key === 'discount' || f.key === 'margin') return v + '%';
  if (f.key === 'duration') return v + ' min';

  return String(v);
}

/* Label formatter for auto-detected fields */
function _detailsLabel(k) {
  return k.replace(/([A-Z])/g, ' $1').replace(/^./, function(c){ return c.toUpperCase(); }).replace(/Id$/, '').replace(/  +/g, ' ').trim();
}

/* Bind clickable links in Details section */
function bindDetailsLinks(container) {
  container.querySelectorAll('.crm-details-link[data-nav-id]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      navigate('record', el.getAttribute('data-nav-obj'), el.getAttribute('data-nav-id'));
    });
  });
}

/* ── Inject Details styles (once) ── */
function injectDetailsStyles() {
  if (document.getElementById('crm-details-css')) return;
  var s = document.createElement('style'); s.id = 'crm-details-css';
  s.textContent = '\
.crm-details-section{background:var(--card);border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,.04);border:1px solid var(--border);overflow:hidden}\
.crm-details-head{padding:11px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:7px}\
.crm-details-title{font-size:11.5px;font-weight:700;color:var(--text);text-transform:uppercase;letter-spacing:.5px;display:flex;align-items:center;gap:6px}\
.crm-details-edit-btn{margin-left:auto;display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:6px;border:1px solid var(--border);background:#fff;cursor:pointer;font-size:11px;font-weight:600;font-family:inherit;color:var(--accent);transition:all .12s}\
.crm-details-edit-btn:hover{background:var(--accent-light);border-color:var(--accent)}\
.crm-details-body{padding:4px 0}\
.crm-details-row{display:flex;align-items:flex-start;padding:9px 16px;border-bottom:1px solid #f3f4f6}\
.crm-details-row:last-child{border-bottom:none}\
.crm-details-label{width:140px;flex-shrink:0;font-size:11px;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.3px;padding-top:1px}\
.crm-details-value{flex:1;font-size:12.5px;font-weight:500;color:var(--text);line-height:1.4;word-break:break-word}\
.crm-details-link{color:var(--accent);cursor:pointer;font-weight:600;transition:opacity .12s}\
.crm-details-link:hover{opacity:.7;text-decoration:underline}\
\
@media(max-width:640px){\
  .crm-details-row{flex-direction:column;gap:2px}\
  .crm-details-label{width:auto}\
}\
';
  document.head.appendChild(s);
}

/* ── Inject modal styles (once) ── */
function injectEditModalStyles() {
  /* Record edit/delete modal CSS (crm-modal-backdrop) */
  if (document.getElementById('crm-edit-modal-css')) return;
  var s = document.createElement('style'); s.id = 'crm-edit-modal-css';
  s.textContent = '\
.crm-modal-backdrop{position:fixed;inset:0;z-index:10000;background:rgba(15,23,42,.45);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s ease}\
.crm-modal-backdrop.crm-modal-show{opacity:1}\
.crm-modal{background:#fff;border-radius:14px;box-shadow:0 24px 64px rgba(0,0,0,.18);width:min(520px,92vw);max-height:85vh;display:flex;flex-direction:column;transform:translateY(12px) scale(.97);transition:transform .25s ease}\
.crm-modal-backdrop.crm-modal-show .crm-modal{transform:translateY(0) scale(1)}\
.crm-modal-header{display:flex;align-items:center;justify-content:space-between;padding:18px 22px 14px;border-bottom:1px solid #e8eaed}\
.crm-modal-title{font-size:15px;font-weight:700;color:#0f172a;letter-spacing:-.2px}\
.crm-modal-close{width:30px;height:30px;border-radius:8px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#94a3b8;transition:all .12s}\
.crm-modal-close:hover{background:#f0f2f5;color:#1e293b}\
.crm-modal-body{padding:18px 22px;overflow-y:auto;flex:1}\
.crm-modal-footer{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:14px 22px;border-top:1px solid #e8eaed}\
.crm-modal-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;border:none;font-family:inherit;transition:all .12s}\
.crm-modal-btn-cancel{background:#f0f2f5;color:#475569}\
.crm-modal-btn-cancel:hover{background:#e2e5e9}\
.crm-modal-btn-save{background:#2563eb;color:#fff}\
.crm-modal-btn-save:hover{background:#1d4ed8}\
.crm-modal-btn-delete{background:#ef4444;color:#fff}\
.crm-modal-btn-delete:hover{background:#dc2626}\
.crm-modal-btn[disabled]{opacity:.5;pointer-events:none}\
\
.crm-field-group{margin-bottom:14px}\
.crm-field-label{display:block;font-size:10.5px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px}\
.crm-field-input{width:100%;padding:9px 12px;border:1.5px solid #e2e5e9;border-radius:8px;font-size:13px;font-family:inherit;color:#1e293b;background:#fff;transition:border-color .15s,box-shadow .15s;box-sizing:border-box}\
.crm-field-input:focus{outline:none;border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}\
select.crm-field-input{appearance:auto;cursor:pointer}\
\
.crm-delete-icon{width:52px;height:52px;border-radius:50%;background:#fef2f2;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}\
.crm-delete-title{font-size:16px;font-weight:700;color:#0f172a;text-align:center;margin-bottom:6px}\
.crm-delete-msg{font-size:13px;color:#64748b;text-align:center;line-height:1.5;margin-bottom:4px}\
.crm-delete-name{font-weight:700;color:#1e293b}\
\
@media(max-width:640px){\
  .crm-modal{width:96vw;max-height:90vh;border-radius:12px}\
  .crm-modal-header{padding:14px 16px 12px}\
  .crm-modal-body{padding:14px 16px}\
  .crm-modal-footer{padding:12px 16px}\
}\
';
  document.head.appendChild(s);
}


/* ── Open Edit Modal ──
   Usage: openEditModal('accounts', 'a1')
   Finds the record in window.DATA, builds form,
   saves via fbUpdate + updates DATA + re-renders page
   ─────────────────────────────────────────────────── */
function openEditModal(objKey, recId) {
  injectEditModalStyles();
  var records = objKey === 'users' ? (typeof UM_USERS !== 'undefined' ? UM_USERS : []) : (window.DATA[objKey] || []);
  var rec = records.find(function(r) { return r.id === recId; });
  if (!rec) { console.error('[Edit] Record not found:', objKey, recId); return; }

  var fields = EDIT_FIELDS[objKey];
  if (!fields) {
    /* Fallback: auto-detect fields from record */
    fields = Object.keys(rec).filter(function(k) {
      return k !== 'id' && k !== 'photoURL' && k !== 'photo' && k !== 'keyRelationship';
    }).map(function(k) {
      return {key: k, label: k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g,' $1'), type: 'text'};
    });
  }

  var recName = rec.name || rec.title || rec.subject || rec.id;
  var objLabel = objKey.charAt(0).toUpperCase() + objKey.slice(1);

  /* Build form fields */
  var formHtml = '';
  fields.forEach(function(f) {
    var val = rec[f.key];
    if (val === undefined || val === null) val = '';
    formHtml += '<div class="crm-field-group">';
    formHtml += '<label class="crm-field-label">' + f.label + '</label>';
    if (f.type === 'product-picker') {
      /* Resolve current IDs from rec — support both array and single string */
      var currentPIds = [];
      if (Array.isArray(val)) currentPIds = val;
      else if (typeof val === 'string' && val) currentPIds = val.split(',').filter(Boolean);
      /* Also check legacy productId */
      if (!currentPIds.length && rec.productId) currentPIds = [rec.productId];
      formHtml += (typeof ppFieldButton === 'function' ? ppFieldButton(f.key, currentPIds) : '<input type="text" class="crm-field-input" data-field="' + f.key + '" value="' + currentPIds.join(',') + '" />');
      formHtml += (typeof ppHiddenInput === 'function' ? ppHiddenInput(f.key, currentPIds) : '');
    } else if (f.type === 'select' && f.options) {
      formHtml += '<select class="crm-field-input" data-field="' + f.key + '">';
      formHtml += '<option value="">— Select —</option>';
      f.options.forEach(function(opt) {
        formHtml += '<option value="' + opt + '"' + (String(val) === opt ? ' selected' : '') + '>' + opt + '</option>';
      });
      formHtml += '</select>';
    } else if (f.type === 'textarea') {
      formHtml += '<textarea class="crm-field-input" data-field="' + f.key + '" rows="3" style="resize:vertical;min-height:60px;line-height:1.5">' + String(val).replace(/</g, '&lt;') + '</textarea>';
    } else if (f.type === 'date') {
      formHtml += '<input class="crm-field-input" type="date" data-field="' + f.key + '" value="' + (val || '') + '" />';
    } else if (f.type === 'number') {
      formHtml += '<input class="crm-field-input" type="number" data-field="' + f.key + '" value="' + (val || '') + '" step="any" />';
    } else {
      formHtml += '<input class="crm-field-input" type="text" data-field="' + f.key + '" value="' + String(val).replace(/"/g, '&quot;') + '" />';
    }
    formHtml += '</div>';
  });

  /* Build modal */
  var backdrop = document.createElement('div');
  backdrop.className = 'crm-modal-backdrop';
  backdrop.innerHTML = '\
<div class="crm-modal">\
  <div class="crm-modal-header">\
    <div class="crm-modal-title">' + svgIcon('edit', 15, 'var(--accent)') + ' Edit ' + objLabel.replace(/s$/, '') + '</div>\
    <button class="crm-modal-close" id="crm-edit-close">' + svgIcon('x', 16) + '</button>\
  </div>\
  <div class="crm-modal-body">' + formHtml + '</div>\
  <div class="crm-modal-footer">\
    <button class="crm-modal-btn crm-modal-btn-cancel" id="crm-edit-cancel">Cancel</button>\
    <button class="crm-modal-btn crm-modal-btn-save" id="crm-edit-save">' + svgIcon('save', 14, '#fff') + ' Save Changes</button>\
  </div>\
</div>';
  document.body.appendChild(backdrop);
  requestAnimationFrame(function() { backdrop.classList.add('crm-modal-show'); });

  /* Close */
  function closeEdit() {
    backdrop.classList.remove('crm-modal-show');
    setTimeout(function() { backdrop.remove(); }, 220);
  }

  backdrop.querySelector('#crm-edit-close').addEventListener('click', closeEdit);
  backdrop.querySelector('#crm-edit-cancel').addEventListener('click', closeEdit);
  backdrop.addEventListener('click', function(e) { if (e.target === backdrop) closeEdit(); });

  /* ── Product picker field binding in edit modal ── */
  backdrop.querySelectorAll('.pp-field-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var fieldKey = btn.getAttribute('data-pp-field');
      var hiddenEl = document.getElementById('pp-hidden-' + fieldKey);
      var currentIds = hiddenEl && hiddenEl.value ? hiddenEl.value.split(',').filter(Boolean) : [];
      if (typeof openProductPicker === 'function') {
        openProductPicker({
          selected: currentIds,
          onConfirm: function(ids) {
            if (hiddenEl) hiddenEl.value = ids.join(',');
            var container = btn.parentElement;
            var newBtnHtml = ppFieldButton(fieldKey, ids);
            btn.outerHTML = newBtnHtml;
            var newHidden = document.getElementById('pp-hidden-' + fieldKey);
            if (newHidden) newHidden.value = ids.join(',');
            /* Re-bind new button */
            var freshBtn = backdrop.querySelector('.pp-field-btn[data-pp-field="' + fieldKey + '"]');
            if (freshBtn) freshBtn.addEventListener('click', function() { btn.click(); });
          }
        });
      }
    });
  });

  /* Save */
  backdrop.querySelector('#crm-edit-save').addEventListener('click', function() {
    var saveBtn = backdrop.querySelector('#crm-edit-save');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<div style="width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite"></div> Saving...';

    var updates = {};
    backdrop.querySelectorAll('[data-field]').forEach(function(input) {
      var fieldKey = input.getAttribute('data-field');
      var fieldDef = fields.find(function(f) { return f.key === fieldKey; });
      var newVal = input.value;
      if (fieldDef && fieldDef.type === 'product-picker') {
        newVal = newVal ? newVal.split(',').filter(Boolean) : [];
      } else if (fieldDef && fieldDef.type === 'number' && newVal !== '') {
        newVal = parseFloat(newVal);
        if (isNaN(newVal)) newVal = 0;
      }
      updates[fieldKey] = newVal;
    });

    /* Update in-memory */
    Object.keys(updates).forEach(function(k) { rec[k] = updates[k]; });

    /* Update Firestore */
    var savePromise;
    if (objKey === 'users' && typeof umUpdateUser === 'function') {
      savePromise = umUpdateUser(recId, updates);
    } else if (typeof fbUpdate === 'function') {
      savePromise = fbUpdate(objKey, recId, updates);
    } else {
      savePromise = Promise.resolve();
    }

    savePromise.then(function() {
        if (typeof fbShowStatus === 'function') fbShowStatus('Record updated');
        closeEdit();
        renderCurrentPage();
      }).catch(function(err) {
        console.error('[Edit] Save error:', err);
        if (typeof fbShowStatus === 'function') fbShowStatus('Save failed — local changes kept', true);
        closeEdit();
        renderCurrentPage();
      });
  });
}


/* ── Open Delete Modal ──
   Usage: openDeleteModal('accounts', 'a1')
   Confirms, then removes from Firestore + DATA + navigates to list
   ─────────────────────────────────────────────────── */
function openDeleteModal(objKey, recId) {
  injectEditModalStyles();
  var records = objKey === 'users' ? (typeof UM_USERS !== 'undefined' ? UM_USERS : []) : (window.DATA[objKey] || []);
  var rec = records.find(function(r) { return r.id === recId; });
  if (!rec) { console.error('[Delete] Record not found:', objKey, recId); return; }

  var recName = rec.name || rec.title || rec.subject || rec.id;
  var objLabel = objKey.charAt(0).toUpperCase() + objKey.slice(1).replace(/s$/, '');

  var backdrop = document.createElement('div');
  backdrop.className = 'crm-modal-backdrop';
  backdrop.innerHTML = '\
<div class="crm-modal" style="max-width:400px">\
  <div class="crm-modal-header">\
    <div class="crm-modal-title">Delete ' + objLabel + '</div>\
    <button class="crm-modal-close" id="crm-del-close">' + svgIcon('x', 16) + '</button>\
  </div>\
  <div class="crm-modal-body" style="text-align:center;padding:24px 22px">\
    <div class="crm-delete-icon">' + svgIcon('trash', 24, '#ef4444') + '</div>\
    <div class="crm-delete-title">Delete this ' + objLabel.toLowerCase() + '?</div>\
    <div class="crm-delete-msg">You are about to permanently delete<br/><span class="crm-delete-name">' + recName + '</span></div>\
    <div class="crm-delete-msg" style="font-size:11.5px;color:#94a3b8;margin-top:6px">This action cannot be undone.</div>\
  </div>\
  <div class="crm-modal-footer" style="justify-content:center;gap:10px">\
    <button class="crm-modal-btn crm-modal-btn-cancel" id="crm-del-cancel">Cancel</button>\
    <button class="crm-modal-btn crm-modal-btn-delete" id="crm-del-confirm">' + svgIcon('trash', 14, '#fff') + ' Delete</button>\
  </div>\
</div>';
  document.body.appendChild(backdrop);
  requestAnimationFrame(function() { backdrop.classList.add('crm-modal-show'); });

  function closeDel() {
    backdrop.classList.remove('crm-modal-show');
    setTimeout(function() { backdrop.remove(); }, 220);
  }

  backdrop.querySelector('#crm-del-close').addEventListener('click', closeDel);
  backdrop.querySelector('#crm-del-cancel').addEventListener('click', closeDel);
  backdrop.addEventListener('click', function(e) { if (e.target === backdrop) closeDel(); });

  backdrop.querySelector('#crm-del-confirm').addEventListener('click', function() {
    var delBtn = backdrop.querySelector('#crm-del-confirm');
    delBtn.disabled = true;
    delBtn.innerHTML = '<div style="width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite"></div> Deleting...';

    /* Remove from in-memory array */
    var idx = records.findIndex(function(r) { return r.id === recId; });
    if (idx !== -1) records.splice(idx, 1);

    /* Remove from Firestore */
    var delPromise;
    if (objKey === 'users') {
      delPromise = fbDB.collection('users').doc(recId).delete();
    } else if (typeof fbDelete === 'function') {
      delPromise = fbDelete(objKey, recId);
    } else {
      delPromise = Promise.resolve();
    }

    var navTarget = objKey === 'users' ? 'agentConsole' : objKey;
    if (objKey === 'users') AC_TAB = 'users';

    delPromise.then(function() {
      if (typeof fbShowStatus === 'function') fbShowStatus('Record deleted');
      closeDel();
      navigate(navTarget);
    }).catch(function(err) {
      console.error('[Delete] Error:', err);
      if (typeof fbShowStatus === 'function') fbShowStatus('Delete failed', true);
      closeDel();
      navigate(navTarget);
    });
  });
}


/* ── Helper: Generate Edit + Delete buttons HTML ──
   Returns HTML string for 2 buttons with consistent style
   prefix = CSS class prefix (e.g. 'a360', 'c360', 'o360')
   objKey = 'accounts', 'contacts', etc.
   recId  = record ID
   ─────────────────────────────────────────────────── */
function crmActionButtons(prefix, objKey, recId) {
  return '<button class="' + prefix + '-action-btn ' + prefix + '-action-outline crm-edit-btn" data-obj="' + objKey + '" data-rec="' + recId + '">' +
    svgIcon('edit', 13, 'var(--text-muted)') + '<span>Edit</span></button>' +
    '<button class="' + prefix + '-action-btn ' + prefix + '-action-outline crm-delete-btn" data-obj="' + objKey + '" data-rec="' + recId + '" style="color:#ef4444;border-color:#fecaca">' +
    svgIcon('trash', 13, '#ef4444') + '<span>Delete</span></button>';
}


/* ── Bind Edit/Delete buttons (call after container.innerHTML is set) ── */
function bindCrmActionButtons(container) {
  container.querySelectorAll('.crm-edit-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      openEditModal(btn.getAttribute('data-obj'), btn.getAttribute('data-rec'));
    });
  });
  container.querySelectorAll('.crm-delete-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      openDeleteModal(btn.getAttribute('data-obj'), btn.getAttribute('data-rec'));
    });
  });
}

