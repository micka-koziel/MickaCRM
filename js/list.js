/* ═══════════════════════════════════════════════════════
   list.js — V2 Enhanced List Views (Contacts & Accounts)
   Compact Key Strip + Floating Filters + Enriched Table
   ═══════════════════════════════════════════════════════ */

/* ─── State ─────────────────────────────────────────── */

var _lv2FilterOpen = false;
var _lv2Filters = {};
var _lv2SortCol = null;
var _lv2SortDir = 'asc';

/* ─── CSS Injection ─────────────────────────────────── */

function injectListV2Styles() {
  if (document.getElementById('list-v2-css')) return;
  var s = document.createElement('style'); s.id = 'list-v2-css';
  s.textContent = '\
/* ═══ Key Relationship Strip ════════════════════ */\
.lv2-strip{margin-bottom:16px}\
.lv2-strip-title{font-size:12px;font-weight:700;color:var(--text-light);margin-bottom:8px;display:flex;align-items:center;gap:5px;text-transform:uppercase;letter-spacing:.04em}\
.lv2-strip-title svg{flex-shrink:0}\
.lv2-strip-row{display:flex;gap:10px;overflow-x:auto;padding-bottom:4px}\
.lv2-strip-card{background:var(--card);border-radius:10px;padding:10px 14px;border:1px solid var(--border);box-shadow:0 1px 2px rgba(0,0,0,.03);cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:10px;min-width:200px;max-width:240px;flex-shrink:0}\
.lv2-strip-card:hover{box-shadow:0 3px 12px rgba(0,0,0,.07);border-color:#d0d5dd;transform:translateY(-1px)}\
.lv2-strip-avatar{width:36px;height:36px;border-radius:50%;object-fit:cover;border:1.5px solid var(--border);flex-shrink:0;background:#f8fafc}\
.lv2-strip-avatar-placeholder{width:36px;height:36px;border-radius:50%;background:#f1f5f9;border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0}\
.lv2-strip-avatar-acct{border-radius:8px}\
.lv2-strip-initials{font-size:12px;font-weight:700;color:var(--text-light)}\
.lv2-strip-info{flex:1;min-width:0}\
.lv2-strip-name{font-size:12.5px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\
.lv2-strip-meta{font-size:11px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}\
.lv2-strip-pipeline{font-size:11px;margin-top:2px}\
.lv2-strip-pipeline b{color:var(--accent);font-weight:700}\
.lv2-strip-add{background:var(--card);border:1.5px dashed var(--border);border-radius:10px;padding:10px 18px;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:6px;min-width:110px;flex-shrink:0;color:var(--text-light);font-size:12px;font-weight:600}\
.lv2-strip-add:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-light)}\
\
/* ═══ Floating Filter Panel ═════════════════════ */\
.lv2-filter-overlay{position:fixed;inset:0;z-index:900;background:transparent}\
.lv2-filter-panel{position:absolute;top:100%;right:0;z-index:901;margin-top:6px;background:var(--card);border:1px solid var(--border);border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.12);padding:16px 18px;min-width:320px;max-width:400px;display:flex;flex-direction:column;gap:12px;animation:lv2FadeIn .12s ease}\
@keyframes lv2FadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}\
.lv2-fp-title{font-size:12px;font-weight:700;color:var(--text);text-transform:uppercase;letter-spacing:.04em;display:flex;align-items:center;justify-content:space-between}\
.lv2-fp-clear{font-size:11px;font-weight:600;color:var(--danger);cursor:pointer;background:none;border:none;font-family:inherit;padding:2px 6px;border-radius:4px;transition:background .1s}\
.lv2-fp-clear:hover{background:#fef2f2}\
.lv2-fp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}\
.lv2-fp-field{display:flex;flex-direction:column;gap:3px}\
.lv2-fp-field.lv2-fp-full{grid-column:1/-1}\
.lv2-fp-label{font-size:9.5px;font-weight:700;color:var(--text-light);text-transform:uppercase;letter-spacing:.04em}\
.lv2-fp-select{padding:7px 10px;border:1px solid var(--border);border-radius:8px;font-size:12px;font-family:inherit;color:var(--text);background:var(--card);outline:none;transition:border-color .12s;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center;padding-right:28px}\
.lv2-fp-select:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(37,99,235,.08)}\
.lv2-fp-input{padding:7px 10px;border:1px solid var(--border);border-radius:8px;font-size:12px;font-family:inherit;color:var(--text);background:var(--card);outline:none;transition:border-color .12s}\
.lv2-fp-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(37,99,235,.08)}\
\
/* ═══ Active Filter Chips ═══════════════════════ */\
.lv2-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}\
.lv2-chip{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#eff6ff;border:1px solid #dbeafe;border-radius:16px;font-size:11px;font-weight:600;color:var(--accent)}\
.lv2-chip-x{cursor:pointer;display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:transparent;transition:background .1s;margin-left:2px;border:none;color:var(--accent);font-size:14px;font-family:inherit;line-height:1;padding:0}\
.lv2-chip-x:hover{background:#dbeafe}\
\
/* ═══ Enhanced Table ════════════════════════════ */\
.lv2-table-section{background:var(--card);border-radius:11px;border:1px solid var(--border);overflow:hidden}\
.lv2-table-bar{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #f1f5f9}\
.lv2-table-bar-left{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--text)}\
.lv2-table-bar-count{font-size:12.5px;color:var(--text-light);font-weight:500}\
.lv2-table-wrap{overflow-x:auto}\
.lv2-table{width:100%;border-collapse:collapse}\
.lv2-table th{padding:9px 14px;font-size:10px;font-weight:700;color:var(--text-light);text-align:left;text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid #f1f5f9;white-space:nowrap;cursor:pointer;user-select:none;transition:color .12s}\
.lv2-table th:hover{color:var(--text-muted)}\
.lv2-table th.lv2-th-active{color:var(--accent)}\
.lv2-table td{padding:10px 14px;vertical-align:middle;border-bottom:1px solid #f8fafc;font-size:12.5px;color:var(--text)}\
.lv2-table tbody tr{cursor:pointer;transition:background .1s}\
.lv2-table tbody tr:hover{background:#fafbfc}\
.lv2-table tbody tr:last-child td{border-bottom:none}\
.lv2-table tbody tr.lv2-row-key{background:#fffbeb}\
.lv2-table tbody tr.lv2-row-key:hover{background:#fef9c3}\
\
/* ═══ Row cells ═════════════════════════════════ */\
.lv2-name-cell{display:flex;align-items:center;gap:10px}\
.lv2-row-avatar{width:34px;height:34px;border-radius:50%;object-fit:cover;border:1px solid var(--border);flex-shrink:0;background:#f8fafc}\
.lv2-row-avatar-acct{border-radius:8px;display:flex;align-items:center;justify-content:center;background:#f8fafc;border:1px solid var(--border)}\
.lv2-row-name{font-size:13px;font-weight:600;color:var(--text);display:flex;align-items:center;gap:5px}\
.lv2-row-sub{font-size:11.5px;color:var(--text-muted);margin-top:1px}\
.lv2-row-pipeline{font-size:11px;color:var(--accent);font-weight:600;margin-top:1px}\
.lv2-star{flex-shrink:0;display:inline-flex}\
.lv2-key-badge{font-size:8.5px;font-weight:800;color:#d97706;background:#fef3c7;padding:1px 5px;border-radius:3px;letter-spacing:.04em}\
.lv2-cell-main{font-size:12.5px;color:var(--text)}\
.lv2-cell-sub{font-size:11.5px;color:var(--text-light);margin-top:1px}\
.lv2-pipeline-cell{font-size:13px;font-weight:700;color:var(--accent)}\
.lv2-opp-count{font-size:12px;font-weight:600;color:var(--text);background:#f1f5f9;padding:2px 8px;border-radius:5px;display:inline-block}\
.lv2-status-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:16px;font-size:11.5px;font-weight:600}\
.lv2-status-dot{width:6px;height:6px;border-radius:50%}\
.lv2-activity-badge{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--text-muted)}\
.lv2-activity-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:16px;font-size:11.5px;font-weight:600}\
.lv2-checkbox{width:15px;height:15px;accent-color:var(--accent);cursor:pointer}\
.lv2-sel-info{font-size:11.5px;color:var(--accent);font-weight:600}\
.lv2-sort-arrow{font-size:9px;margin-left:2px}\
\
/* ═══ Responsive ════════════════════════════════ */\
@media(max-width:1024px){\
  .lv2-strip-row{gap:8px}\
  .lv2-strip-card{min-width:170px;max-width:200px;padding:8px 12px}\
  .lv2-table-wrap{overflow-x:auto}\
  .lv2-table{min-width:700px}\
  .lv2-filter-panel{min-width:280px;right:-10px}\
}\
@media(max-width:640px){\
  .lv2-strip-card{min-width:160px;padding:8px 10px}\
  .lv2-strip-avatar,.lv2-strip-avatar-placeholder{width:30px;height:30px}\
  .lv2-table{min-width:550px}\
  .lv2-table th,.lv2-table td{padding:7px 10px;font-size:11px}\
  .lv2-filter-panel{min-width:260px;max-width:92vw;right:0;left:0;margin:6px auto}\
  .lv2-fp-grid{grid-template-columns:1fr}\
}\
';
  document.head.appendChild(s);
}

/* ─── Constants ──────────────────────────────────────── */

var LV2_ACT_COLORS = {Call:'#3b82f6',Meeting:'#8b5cf6',Email:'#10b981','Site Visit':'#ef4444'};
var LV2_ACT_ICONS = {
  Call:'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  Meeting:'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  Email:'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'Site Visit':'M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z'
};
var LV2_ACT_LABELS = {Call:'Called',Meeting:'Met',Email:'Emailed','Site Visit':'Visited'};
var LV2_STATUS_COLORS = {Active:'#10b981',Prospect:'#f59e0b',Inactive:'#94a3b8'};

function _lv2Icon(pathD, size, color) {
  size = size || 13; color = color || 'currentColor';
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="'+color+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="'+pathD+'"/></svg>';
}

var _lv2StarSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
var _lv2StarSmall = '<svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
var _lv2BuildingSmall = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18Z"/><path d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2"/><path d="M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/></svg>';

/* ─── Last activity resolver ─────────────────────────── */

function _lv2GetLastActivity(recordId, objKey) {
  var activities = window.DATA.activities || [];
  var matches = [];
  activities.forEach(function(act) {
    if (act.status !== 'Completed') return;
    if (objKey === 'contacts' && act.contactId === recordId) matches.push(act);
    else if (objKey === 'accounts' && act.accountId === recordId) matches.push(act);
  });
  if (matches.length === 0) return null;
  matches.sort(function(a,b) { return new Date(b.date) - new Date(a.date); });
  return { type: matches[0].type, when: _lv2TimeAgo(matches[0].date) };
}

function _lv2TimeAgo(dateStr) {
  if (!dateStr) return '';
  var diffH = Math.floor((new Date() - new Date(dateStr)) / 3600000);
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return diffH + 'h ago';
  var d = Math.floor(diffH / 24);
  return d === 1 ? '1 day ago' : d + ' days ago';
}

function _lv2ContactPipeline(c) {
  if (!c.account) return 0;
  var t = 0;
  (window.DATA.opportunities||[]).forEach(function(o){ if (o.account === c.account) t += (o.amount||0); });
  return t;
}

function _lv2ContactCity(c) {
  if (c.city) return c.city;
  if (!c.account) return '';
  var a = (window.DATA.accounts||[]).find(function(x){return x.id===c.account;});
  return a ? a.city : '';
}

/* ═══════════════════════════════════════════════════════
   FILTER DEFINITIONS
   ═══════════════════════════════════════════════════════ */

function _lv2GetFilterDefs(objKey) {
  if (objKey === 'contacts') return [
    {key:'account',label:'Account',type:'select',options:function(){return (window.DATA.accounts||[]).map(function(a){return{value:a.id,label:a.name};});}},
    {key:'role',label:'Role',type:'select',options:function(){var r=[];(window.DATA.contacts||[]).forEach(function(c){if(c.role&&r.indexOf(c.role)<0)r.push(c.role);});return r.sort().map(function(v){return{value:v,label:v};});}},
    {key:'city',label:'City',type:'select',options:function(){var s={};(window.DATA.contacts||[]).forEach(function(c){var city=_lv2ContactCity(c);if(city)s[city]=1;});return Object.keys(s).sort().map(function(v){return{value:v,label:v};});}},
    {key:'activityType',label:'Last Activity',type:'select',options:function(){return [{value:'Call',label:'Call'},{value:'Meeting',label:'Meeting'},{value:'Email',label:'Email'},{value:'Site Visit',label:'Site Visit'}];}}
  ];
  if (objKey === 'accounts') return [
    {key:'industry',label:'Industry',type:'select',options:function(){var s=[];(window.DATA.accounts||[]).forEach(function(a){if(a.industry&&s.indexOf(a.industry)<0)s.push(a.industry);});return s.sort().map(function(v){return{value:v,label:v};});}},
    {key:'city',label:'City',type:'select',options:function(){var s=[];(window.DATA.accounts||[]).forEach(function(a){if(a.city&&s.indexOf(a.city)<0)s.push(a.city);});return s.sort().map(function(v){return{value:v,label:v};});}},
    {key:'status',label:'Status',type:'select',options:function(){return [{value:'Active',label:'Active'},{value:'Prospect',label:'Prospect'}];}},
    {key:'pipelineMin',label:'Pipeline Min',type:'number'}
  ];
  return [];
}

function _lv2ApplyFilters(items, objKey) {
  var f = _lv2Filters;
  return items.filter(function(item) {
    if (objKey === 'contacts') {
      if (f.account && item.account !== f.account) return false;
      if (f.role && item.role !== f.role) return false;
      if (f.city && _lv2ContactCity(item) !== f.city) return false;
      if (f.activityType) { var a = _lv2GetLastActivity(item.id,'contacts'); if (!a || a.type !== f.activityType) return false; }
    }
    if (objKey === 'accounts') {
      if (f.industry && item.industry !== f.industry) return false;
      if (f.city && item.city !== f.city) return false;
      if (f.status && item.status !== f.status) return false;
      if (f.pipelineMin && (item.pipeline||0) < Number(f.pipelineMin)) return false;
    }
    return true;
  });
}

function _lv2FilterLabel(key, val) {
  if (key === 'account') { var a = (window.DATA.accounts||[]).find(function(x){return x.id===val;}); return a ? a.name : val; }
  if (key === 'pipelineMin') return fmtAmount(Number(val)) + '+';
  return val;
}

/* ═══════════════════════════════════════════════════════
   FLOATING FILTER PANEL
   ═══════════════════════════════════════════════════════ */

function _lv2BuildFilterPanel(objKey) {
  var defs = _lv2GetFilterDefs(objKey);
  var hasActive = Object.keys(_lv2Filters).length > 0;
  var h = '<div class="lv2-fp-title"><span>Filters</span>'+(hasActive?'<button class="lv2-fp-clear" id="lv2-fp-clear-all">Clear all</button>':'')+'</div><div class="lv2-fp-grid">';
  defs.forEach(function(fd) {
    var cur = _lv2Filters[fd.key] || '';
    h += '<div class="lv2-fp-field"><label class="lv2-fp-label">'+fd.label+'</label>';
    if (fd.type === 'select') {
      var opts = typeof fd.options === 'function' ? fd.options() : [];
      h += '<select class="lv2-fp-select" data-fk="'+fd.key+'"><option value="">All</option>';
      opts.forEach(function(o){ h += '<option value="'+o.value+'"'+(cur===String(o.value)?' selected':'')+'>'+o.label+'</option>'; });
      h += '</select>';
    } else if (fd.type === 'number') {
      h += '<input type="number" class="lv2-fp-input" data-fk="'+fd.key+'" value="'+cur+'" placeholder="Any"/>';
    }
    h += '</div>';
  });
  h += '</div>';
  return h;
}

function _lv2BindFilterPanel(panelEl, objKey, onApply) {
  panelEl.querySelectorAll('.lv2-fp-select').forEach(function(sel) {
    sel.addEventListener('change', function() {
      var k = sel.getAttribute('data-fk');
      if (sel.value) _lv2Filters[k] = sel.value; else delete _lv2Filters[k];
      onApply();
    });
  });
  panelEl.querySelectorAll('.lv2-fp-input').forEach(function(inp) {
    inp.addEventListener('input', function() {
      var k = inp.getAttribute('data-fk');
      if (inp.value) _lv2Filters[k] = inp.value; else delete _lv2Filters[k];
      onApply();
    });
  });
  var cb = document.getElementById('lv2-fp-clear-all');
  if (cb) cb.addEventListener('click', function() { _lv2Filters = {}; onApply(); });
}

/* Public: toggle filter panel from header button */
function lv2ToggleFilterPanel(objKey, anchorEl) {
  var existing = document.getElementById('lv2-fp-wrap');
  if (existing) { existing.remove(); _lv2FilterOpen = false; return; }
  _lv2FilterOpen = true;
  injectListV2Styles();

  var wrap = document.createElement('div');
  wrap.id = 'lv2-fp-wrap';

  var overlay = document.createElement('div');
  overlay.className = 'lv2-filter-overlay';
  overlay.addEventListener('click', function() { wrap.remove(); _lv2FilterOpen = false; });

  var panel = document.createElement('div');
  panel.className = 'lv2-filter-panel';
  panel.innerHTML = _lv2BuildFilterPanel(objKey);
  panel.addEventListener('click', function(e) { e.stopPropagation(); });

  var anchor = anchorEl.closest('.obj-header-right') || anchorEl.parentElement;
  anchor.style.position = 'relative';
  anchor.appendChild(wrap);
  wrap.appendChild(overlay);
  wrap.appendChild(panel);

  _lv2BindFilterPanel(panel, objKey, function() {
    wrap.remove(); _lv2FilterOpen = false;
    /* Trigger full re-render via pipeline.js */
    var cfg = OBJ_CONFIG[objKey];
    if (cfg) { renderObjHeader(objKey, cfg, document.getElementById('page-header')); refreshContent(objKey, cfg); }
  });
}

/* ═══════════════════════════════════════════════════════
   ACTIVE FILTER CHIPS
   ═══════════════════════════════════════════════════════ */

function _lv2BuildChips(objKey) {
  var keys = Object.keys(_lv2Filters);
  if (!keys.length) return '';
  var defs = _lv2GetFilterDefs(objKey);
  var h = '<div class="lv2-chips">';
  keys.forEach(function(k) {
    var fd = defs.find(function(d){return d.key===k;});
    h += '<span class="lv2-chip">'+(fd?fd.label:k)+': '+_lv2FilterLabel(k,_lv2Filters[k])+' <button class="lv2-chip-x" data-fk="'+k+'">&times;</button></span>';
  });
  return h + '</div>';
}

function _lv2BindChips(container, objKey) {
  container.querySelectorAll('.lv2-chip-x').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      delete _lv2Filters[btn.getAttribute('data-fk')];
      var cfg = OBJ_CONFIG[objKey];
      if (cfg) { renderObjHeader(objKey, cfg, document.getElementById('page-header')); refreshContent(objKey, cfg); }
    });
  });
}

/* ═══════════════════════════════════════════════════════
   MAIN RENDER
   ═══════════════════════════════════════════════════════ */

function renderListViewV2(items, columns, container, objKey) {
  if (objKey !== 'contacts' && objKey !== 'accounts') {
    renderListView(items, columns, container, objKey);
    return;
  }
  injectListV2Styles();

  var isContacts = (objKey === 'contacts');
  var allItems = isContacts ? (window.DATA.contacts||[]) : (window.DATA.accounts||[]);

  /* Apply V2 filters on top of pipeline.js search */
  var displayed = _lv2ApplyFilters(items, objKey);

  /* Key records */
  var keyRecords = allItems.filter(function(r){ return r.keyRelationship; });
  if (keyRecords.length === 0) {
    var ranked = allItems.slice();
    if (isContacts) ranked.sort(function(a,b){ return _lv2ContactPipeline(b) - _lv2ContactPipeline(a); });
    else ranked.sort(function(a,b){ return (b.pipeline||0) - (a.pipeline||0); });
    keyRecords = ranked.slice(0, 3);
  }

  /* ═══ 1. Compact Key Strip ═══ */
  var html = '<div class="lv2-strip"><div class="lv2-strip-title">'+_lv2StarSmall+' Key Relationships</div><div class="lv2-strip-row">';

  keyRecords.forEach(function(r) {
    var av = '';
    if (isContacts) {
      if (r.photoURL) av = '<img src="'+r.photoURL+'" alt="" class="lv2-strip-avatar"/>';
      else { var i = r.name.split(' ').map(function(w){return w[0];}).join('').substring(0,2); av = '<div class="lv2-strip-avatar-placeholder"><span class="lv2-strip-initials">'+i+'</span></div>'; }
    } else {
      if (r.photoURL) av = '<img src="'+r.photoURL+'" alt="" class="lv2-strip-avatar lv2-strip-avatar-acct"/>';
      else av = '<div class="lv2-strip-avatar-placeholder lv2-strip-avatar-acct">'+_lv2BuildingSmall+'</div>';
    }
    var meta = isContacts ? getAccountName(r.account) : (r.industry||'');
    var pv = isContacts ? _lv2ContactPipeline(r) : (r.pipeline||0);
    html += '<div class="lv2-strip-card" data-id="'+r.id+'" data-obj="'+objKey+'">'+av+
      '<div class="lv2-strip-info"><div class="lv2-strip-name">'+r.name+'</div><div class="lv2-strip-meta">'+meta+'</div><div class="lv2-strip-pipeline"><b>'+fmtAmount(pv)+'</b> pipeline</div></div></div>';
  });
  html += '<div class="lv2-strip-add" id="lv2-add-key">'+svgIcon('plus',13,'currentColor')+' Add Key</div></div></div>';

  /* ═══ 2. Filter Chips ═══ */
  html += _lv2BuildChips(objKey);

  /* ═══ 3. Table ═══ */
  var keyIds = {};
  keyRecords.forEach(function(r){ keyIds[r.id] = true; });

  html += '<div class="lv2-table-section"><div class="lv2-table-bar"><div class="lv2-table-bar-left">'+
    svgIcon('list',14,'var(--accent)')+' <span>All '+(isContacts?'Contacts':'Accounts')+'</span> <span class="lv2-table-bar-count">('+displayed.length+')</span></div><div id="lv2-sel-info"></div></div>'+
    '<div class="lv2-table-wrap"><table class="lv2-table"><thead><tr><th style="width:36px"><input type="checkbox" class="lv2-checkbox" id="lv2-check-all"/></th>';

  if (isContacts) html += '<th data-sort="name">CONTACT</th><th data-sort="company">COMPANY</th><th data-sort="role">ROLE</th><th data-sort="city">CITY</th><th>LAST ACTIVITY</th><th>EMAIL</th>';
  else html += '<th data-sort="name">ACCOUNT</th><th data-sort="industry">INDUSTRY</th><th data-sort="city">CITY</th><th data-sort="pipeline">PIPELINE</th><th data-sort="opps">OPPORTUNITIES</th><th>STATUS</th>';
  html += '</tr></thead><tbody>';

  displayed.forEach(function(item) {
    var isKey = !!keyIds[item.id];
    html += '<tr data-id="'+item.id+'" data-obj="'+objKey+'"'+(isKey?' class="lv2-row-key"':'')+'>';
    html += '<td><input type="checkbox" class="lv2-checkbox lv2-row-check" data-id="'+item.id+'"/></td>';

    if (isContacts) {
      var accName = getAccountName(item.account);
      var city = _lv2ContactCity(item);
      var pipe = _lv2ContactPipeline(item);
      var la = _lv2GetLastActivity(item.id,'contacts');
      var av2 = item.photoURL ? '<img src="'+item.photoURL+'" alt="" class="lv2-row-avatar"/>' :
        '<div class="lv2-row-avatar" style="display:flex;align-items:center;justify-content:center;background:#f1f5f9;font-size:11px;font-weight:700;color:var(--text-light)">'+item.name.split(' ').map(function(w){return w[0];}).join('').substring(0,2)+'</div>';

      html += '<td><div class="lv2-name-cell">'+av2+'<div><div class="lv2-row-name">'+
        (isKey?'<span class="lv2-star">'+_lv2StarSvg+'</span>':'')+
        '<a class="record-link" data-id="'+item.id+'" data-obj="contacts">'+item.name+'</a>'+
        (isKey?' <span class="lv2-key-badge">KEY</span>':'')+
        '</div><div class="lv2-row-sub">'+(item.role||'')+(accName?' - '+accName:'')+'</div>'+
        (pipe>0?'<div class="lv2-row-pipeline">'+fmtAmount(pipe)+' pipeline</div>':'')+
        '</div></div></td>';
      html += '<td><div class="lv2-cell-main">'+accName+'</div>'+(city?'<div class="lv2-cell-sub">'+city+'</div>':'')+'</td>';
      html += '<td><span class="lv2-cell-main">'+(item.role||'')+'</span></td>';
      html += '<td><span class="lv2-cell-main">'+city+'</span></td>';

      if (la) {
        var ac=LV2_ACT_COLORS[la.type]||'#94a3b8', ap=LV2_ACT_ICONS[la.type]||'';
        html += '<td><div class="lv2-activity-badge">'+(ap?_lv2Icon(ap,13,ac):'')+' <span>'+la.when+'</span></div></td>';
        var pl2=LV2_ACT_LABELS[la.type]||la.type;
        html += '<td><span class="lv2-activity-pill" style="background:'+ac+'14;color:'+ac+'">'+(ap?_lv2Icon(ap,12,ac):'')+' '+pl2+'</span></td>';
      } else {
        html += '<td><span class="lv2-cell-sub">--</span></td><td><span class="lv2-cell-sub">'+(item.email||'')+'</span></td>';
      }
    } else {
      var aav = item.photoURL ? '<img src="'+item.photoURL+'" alt="" class="lv2-row-avatar" style="border-radius:8px"/>' :
        '<div class="lv2-row-avatar-acct" style="width:34px;height:34px">'+_lv2BuildingSmall+'</div>';
      html += '<td><div class="lv2-name-cell">'+aav+'<div><div class="lv2-row-name">'+
        (isKey?'<span class="lv2-star">'+_lv2StarSvg+'</span>':'')+
        '<a class="record-link" data-id="'+item.id+'" data-obj="accounts">'+item.name+'</a>'+
        (isKey?' <span class="lv2-key-badge">KEY</span>':'')+
        '</div></div></div></td>';
      html += '<td><span class="lv2-cell-main">'+(item.industry||'')+'</span></td>';
      html += '<td><span class="lv2-cell-main">'+(item.city||'')+'</span></td>';
      html += '<td><span class="lv2-pipeline-cell">'+fmtAmount(item.pipeline||0)+'</span></td>';
      html += '<td><span class="lv2-opp-count">'+(item.opps||0)+'</span></td>';
      var sc=LV2_STATUS_COLORS[item.status]||'#94a3b8';
      html += '<td><span class="lv2-status-pill" style="background:'+sc+'14;color:'+sc+'"><span class="lv2-status-dot" style="background:'+sc+'"></span>'+(item.status||'')+'</span></td>';
    }
    html += '</tr>';
  });
  html += '</tbody></table></div></div>';

  container.innerHTML = html;

  /* ═══ Wire events ═══ */
  container.querySelectorAll('.lv2-strip-card').forEach(function(c){ c.addEventListener('click', function(){ navigate('record',c.dataset.obj,c.dataset.id); }); });
  var ak = document.getElementById('lv2-add-key');
  if (ak) ak.addEventListener('click', function(){ _lv2ShowToast('Mark a '+(isContacts?'contact':'account')+' as Key from its record page'); });
  container.querySelectorAll('.record-link').forEach(function(l){ l.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); navigate('record',l.dataset.obj,l.dataset.id); }); });
  container.querySelectorAll('.lv2-table tbody tr[data-id]').forEach(function(tr){ tr.addEventListener('click', function(e){ if(e.target.type==='checkbox'||e.target.closest('.record-link'))return; navigate('record',tr.dataset.obj,tr.dataset.id); }); });
  var ca = document.getElementById('lv2-check-all');
  if (ca) ca.addEventListener('change', function(){ container.querySelectorAll('.lv2-row-check').forEach(function(cb){ cb.checked=ca.checked; }); _lv2UpdateSelInfo(container); });
  container.querySelectorAll('.lv2-row-check').forEach(function(cb){ cb.addEventListener('change', function(){ _lv2UpdateSelInfo(container); }); });
  container.querySelectorAll('.lv2-table th[data-sort]').forEach(function(th){ th.addEventListener('click', function(){ _lv2SortAndRerender(th.dataset.sort,items,container,objKey); }); });
  _lv2BindChips(container, objKey);
}

/* ─── Helpers ─────────────────────────────────────────── */

function _lv2UpdateSelInfo(container) {
  var n = container.querySelectorAll('.lv2-row-check:checked').length;
  var el = document.getElementById('lv2-sel-info');
  if (el) el.innerHTML = n > 0 ? '<span class="lv2-sel-info">'+n+' selected</span>' : '';
}

function _lv2SortAndRerender(col, items, container, objKey) {
  if (_lv2SortCol === col) _lv2SortDir = _lv2SortDir === 'asc' ? 'desc' : 'asc';
  else { _lv2SortCol = col; _lv2SortDir = 'asc'; }
  var sorted = items.slice().sort(function(a,b) {
    var va, vb;
    if (col==='company'&&objKey==='contacts'){va=getAccountName(a.account).toLowerCase();vb=getAccountName(b.account).toLowerCase();}
    else if(col==='city'&&objKey==='contacts'){va=_lv2ContactCity(a).toLowerCase();vb=_lv2ContactCity(b).toLowerCase();}
    else{va=a[col];vb=b[col];if(typeof va==='string')va=va.toLowerCase();if(typeof vb==='string')vb=vb.toLowerCase();}
    if(va==null)va='';if(vb==null)vb='';
    return va<vb?(_lv2SortDir==='asc'?-1:1):va>vb?(_lv2SortDir==='asc'?1:-1):0;
  });
  renderListViewV2(sorted, null, container, objKey);
  container.querySelectorAll('.lv2-table th[data-sort]').forEach(function(th){
    if(th.dataset.sort===_lv2SortCol){th.classList.add('lv2-th-active');th.innerHTML=th.textContent.replace(/[\u25B2\u25BC]/g,'').trim()+' <span class="lv2-sort-arrow">'+(_lv2SortDir==='asc'?'&#x25B2;':'&#x25BC;')+'</span>';}
  });
}

function _lv2ShowToast(msg) {
  var old = document.getElementById('lv2-toast'); if (old) old.remove();
  var t = document.createElement('div'); t.id = 'lv2-toast';
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(12px);opacity:0;z-index:9999;background:#0f172a;color:#fff;padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;font-family:inherit;box-shadow:0 8px 32px rgba(0,0,0,.18);pointer-events:none;transition:all .25s;white-space:nowrap';
  t.textContent = msg; document.body.appendChild(t);
  requestAnimationFrame(function(){ t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)'; });
  setTimeout(function(){ t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(12px)'; setTimeout(function(){ t.remove(); },250); },2400);
}
