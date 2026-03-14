/* ═══════════════════════════════════════════════════════
   list.js — V2 Enhanced List Views (Contacts & Accounts)
   Key Relationships section + enriched table rows
   ═══════════════════════════════════════════════════════ */

/* ─── CSS Injection ─────────────────────────────────── */

function injectListV2Styles() {
  if (document.getElementById('list-v2-css')) return;
  var s = document.createElement('style'); s.id = 'list-v2-css';
  s.textContent = '\
/* ═══ V2 Centered Container ════════════════════ */\
.lv2-container{max-width:1400px;margin:0 auto;padding:32px 40px 40px}\
\
/* ═══ Key Relationships Strip ═══════════════════ */\
.lv2-key-section{margin-bottom:32px}\
.lv2-key-title{font-size:12px;font-weight:700;color:var(--text-light);margin-bottom:12px;display:flex;align-items:center;gap:5px;text-transform:uppercase;letter-spacing:.04em}\
.lv2-key-title svg{flex-shrink:0}\
.lv2-key-cards{display:flex;flex-wrap:wrap;justify-content:center;align-items:stretch;gap:20px}\
.lv2-key-card{width:280px;max-width:320px;flex:0 0 280px;background:var(--card);border-radius:11px;padding:14px 16px;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,.04);cursor:pointer;transition:all .15s;display:flex;flex-direction:column}\
.lv2-key-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.08);transform:translateY(-1px)}\
.lv2-key-inner{display:flex;align-items:center;gap:12px;min-width:0}\
.lv2-key-avatar{width:42px;height:42px;border-radius:50%;object-fit:cover;border:1.5px solid var(--border);flex-shrink:0;background:#f8fafc}\
.lv2-key-avatar-placeholder{width:42px;height:42px;border-radius:50%;background:#f1f5f9;border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0}\
.lv2-key-avatar-acct{border-radius:9px}\
.lv2-key-initials{font-size:14px;font-weight:700;color:var(--text-light)}\
.lv2-key-info{flex:1;min-width:0;overflow:hidden}\
.lv2-key-name{font-size:13px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\
.lv2-key-meta{font-size:11.5px;color:var(--text-muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\
.lv2-key-pipeline{font-size:11.5px;margin-top:3px;white-space:nowrap}\
.lv2-key-pipeline-val{font-weight:700;color:var(--accent)}\
.lv2-key-pipeline-lbl{color:var(--text-light);font-size:11px}\
.lv2-key-extra{display:flex;align-items:center;gap:6px;margin-top:auto;padding-top:10px;border-top:1px solid #f1f5f9}\
.lv2-key-extra-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}\
.lv2-key-extra-text{font-size:11px;color:var(--text-muted)}\
.lv2-key-extra-sep{color:#e2e8f0;font-size:11px}\
.lv2-key-add{width:280px;max-width:320px;flex:0 0 280px;background:var(--card);border:1.5px dashed var(--border);border-radius:11px;padding:14px 16px;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:6px;color:var(--text-light);font-size:12.5px;font-weight:600}\
.lv2-key-add:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-light)}\
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
  .lv2-container{padding:24px 20px 32px}\
  .lv2-key-card,.lv2-key-add{width:240px;flex:0 0 240px}\
  .lv2-key-cards{gap:14px}\
  .lv2-table-wrap{overflow-x:auto}\
  .lv2-table{min-width:700px}\
}\
@media(max-width:640px){\
  .lv2-container{padding:16px 12px 24px}\
  .lv2-key-section{margin-bottom:20px}\
  .lv2-key-cards{gap:10px}\
  .lv2-key-card,.lv2-key-add{width:100%;flex:0 0 100%;max-width:100%}\
  .lv2-key-card{padding:12px}\
  .lv2-key-avatar,.lv2-key-avatar-placeholder{width:36px;height:36px}\
  .lv2-table{min-width:550px}\
  .lv2-table th,.lv2-table td{padding:7px 10px;font-size:11px}\
}\
';
  document.head.appendChild(s);
}

/* ─── Activity color helpers ─────────────────────────── */

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

var _lv2StarSvg = '<svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
var _lv2BuildingSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18Z"/><path d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2"/><path d="M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/></svg>';

/* ─── Last activity resolver ─────────────────────────── */

function _lv2GetLastActivity(recordId, objKey) {
  var activities = window.DATA.activities || [];
  var matches = [];
  activities.forEach(function(act) {
    if (act.status !== 'Completed') return;
    if (objKey === 'contacts') {
      if (act.contactId === recordId) matches.push(act);
    } else if (objKey === 'accounts') {
      if (act.accountId === recordId) matches.push(act);
    }
  });
  if (matches.length === 0) return null;
  matches.sort(function(a,b) { return new Date(b.date) - new Date(a.date); });
  var last = matches[0];
  var diff = _lv2TimeAgo(last.date);
  return { type: last.type, when: diff };
}

function _lv2TimeAgo(dateStr) {
  if (!dateStr) return '';
  var now = new Date();
  var then = new Date(dateStr);
  var diffMs = now - then;
  var diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return diffH + 'h ago';
  var diffD = Math.floor(diffH / 24);
  if (diffD === 1) return '1 day ago';
  return diffD + ' days ago';
}

/* ─── Compute pipeline for contact ───────────────────── */

function _lv2ContactPipeline(contactRec) {
  /* Sum pipeline from account's opportunities */
  var accId = contactRec.account;
  if (!accId) return 0;
  var opps = window.DATA.opportunities || [];
  var total = 0;
  opps.forEach(function(o) {
    if (o.account === accId) total += (o.amount || 0);
  });
  return total;
}

/* ─── Get city for contact (from linked account) ─────── */

function _lv2ContactCity(contactRec) {
  if (contactRec.city) return contactRec.city;
  var accId = contactRec.account;
  if (!accId) return '';
  var acc = (window.DATA.accounts||[]).find(function(a){return a.id===accId;});
  return acc ? acc.city : '';
}

/* ═══════════════════════════════════════════════════════
   MAIN RENDER — Called from pipeline.js renderObjContent
   ═══════════════════════════════════════════════════════ */

function renderListViewV2(items, columns, container, objKey) {
  /* Only V2 for contacts & accounts — fallback to classic for others */
  if (objKey !== 'contacts' && objKey !== 'accounts') {
    renderListView(items, columns, container, objKey);
    return;
  }

  injectListV2Styles();

  var isContacts = (objKey === 'contacts');
  var allItems = (isContacts ? (window.DATA.contacts||[]) : (window.DATA.accounts||[]));

  /* Key records = items with keyRelationship flag, or fallback top 3 by pipeline */
  var keyRecords = allItems.filter(function(r) { return r.keyRelationship; });

  if (keyRecords.length === 0) {
    /* Fallback: top 3 by pipeline value */
    var ranked = allItems.slice();
    if (isContacts) {
      ranked.sort(function(a,b) { return _lv2ContactPipeline(b) - _lv2ContactPipeline(a); });
    } else {
      ranked.sort(function(a,b) { return (b.pipeline||0) - (a.pipeline||0); });
    }
    keyRecords = ranked.slice(0, 3);
  }
  /* Cap at 5 max */
  if (keyRecords.length > 5) keyRecords = keyRecords.slice(0, 5);

  var _starTitleSvg = '<svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

  /* ── Build Key Cards HTML ── */
  var keyHTML = '';
  if (keyRecords.length > 0) {
    keyHTML = '<div class="lv2-key-section">' +
      '<div class="lv2-key-title">' + _starTitleSvg + ' Key Relationships</div>' +
      '<div class="lv2-key-cards">';

    keyRecords.forEach(function(r) {
      var avatarHTML = '';
      if (isContacts) {
        if (r.photoURL) {
          avatarHTML = '<img src="'+r.photoURL+'" alt="" class="lv2-key-avatar"/>';
        } else {
          var initials = r.name.split(' ').map(function(w){return w[0];}).join('').substring(0,2);
          avatarHTML = '<div class="lv2-key-avatar-placeholder"><span class="lv2-key-initials">'+initials+'</span></div>';
        }
      } else {
        if (r.photoURL) {
          avatarHTML = '<img src="'+r.photoURL+'" alt="" class="lv2-key-avatar lv2-key-avatar-acct"/>';
        } else {
          avatarHTML = '<div class="lv2-key-avatar-placeholder lv2-key-avatar-acct">'+_lv2BuildingSvg+'</div>';
        }
      }

      var metaText = '';
      var pipelineVal = 0;
      if (isContacts) {
        var accName = getAccountName(r.account);
        metaText = (r.role || '') + (accName ? ' - ' + accName : '');
        pipelineVal = _lv2ContactPipeline(r);
      } else {
        metaText = r.industry || '';
        pipelineVal = r.pipeline || 0;
      }

      var extraHTML = '';
      if (!isContacts) {
        var sc = LV2_STATUS_COLORS[r.status] || '#94a3b8';
        extraHTML = '<div class="lv2-key-extra">' +
          '<span class="lv2-key-extra-dot" style="background:'+sc+'"></span>' +
          '<span class="lv2-key-extra-text">'+r.status+'</span>' +
          '<span class="lv2-key-extra-sep">|</span>' +
          '<span class="lv2-key-extra-text">'+(r.opps||0)+' opps</span>' +
          '</div>';
      }

      keyHTML += '<div class="lv2-key-card" data-id="'+r.id+'" data-obj="'+objKey+'">' +
        '<div class="lv2-key-inner">' + avatarHTML +
        '<div class="lv2-key-info">' +
          '<div class="lv2-key-name">'+r.name+'</div>' +
          '<div class="lv2-key-meta">'+metaText+'</div>' +
          '<div class="lv2-key-pipeline"><span class="lv2-key-pipeline-val">'+fmtAmount(pipelineVal)+'</span> <span class="lv2-key-pipeline-lbl">pipeline</span></div>' +
        '</div></div>' + extraHTML + '</div>';
    });

    keyHTML += '<div class="lv2-key-add" id="lv2-add-key">' + svgIcon('plus',14,'currentColor') + ' Add Key</div>';
    keyHTML += '</div></div>';
  }

  /* ── Key IDs set for row highlighting ── */
  var keyIds = {};
  keyRecords.forEach(function(r){ keyIds[r.id] = true; });

  /* ── Build Table HTML ── */
  var tableHTML = '<div class="lv2-table-section">' +
    '<div class="lv2-table-bar">' +
      '<div class="lv2-table-bar-left">' +
        svgIcon('list',14,'var(--accent)') +
        ' <span>All ' + (isContacts ? 'Contacts' : 'Accounts') + '</span>' +
        ' <span class="lv2-table-bar-count">(' + items.length + ')</span>' +
      '</div>' +
      '<div id="lv2-sel-info"></div>' +
    '</div>' +
    '<div class="lv2-table-wrap"><table class="lv2-table"><thead><tr>' +
    '<th style="width:36px"><input type="checkbox" class="lv2-checkbox" id="lv2-check-all"/></th>';

  if (isContacts) {
    tableHTML += '<th data-sort="name">CONTACT</th>' +
      '<th data-sort="company">COMPANY</th>' +
      '<th data-sort="role">ROLE</th>' +
      '<th data-sort="city">CITY</th>' +
      '<th>LAST ACTIVITY</th>' +
      '<th>EMAIL</th>';
  } else {
    tableHTML += '<th data-sort="name">ACCOUNT</th>' +
      '<th data-sort="industry">INDUSTRY</th>' +
      '<th data-sort="city">CITY</th>' +
      '<th data-sort="pipeline">PIPELINE</th>' +
      '<th data-sort="opps">OPPORTUNITIES</th>' +
      '<th>STATUS</th>';
  }

  tableHTML += '</tr></thead><tbody>';

  items.forEach(function(item) {
    var isKey = !!keyIds[item.id];
    var rowClass = isKey ? ' class="lv2-row-key"' : '';

    tableHTML += '<tr data-id="'+item.id+'" data-obj="'+objKey+'"'+rowClass+'>';
    tableHTML += '<td><input type="checkbox" class="lv2-checkbox lv2-row-check" data-id="'+item.id+'"/></td>';

    if (isContacts) {
      /* ── Contact row ── */
      var accName = getAccountName(item.account);
      var city = _lv2ContactCity(item);
      var pipeline = _lv2ContactPipeline(item);
      var lastAct = _lv2GetLastActivity(item.id, 'contacts');

      var avatarTd = '';
      if (item.photoURL) {
        avatarTd = '<img src="'+item.photoURL+'" alt="" class="lv2-row-avatar"/>';
      } else {
        var ini = item.name.split(' ').map(function(w){return w[0];}).join('').substring(0,2);
        avatarTd = '<div class="lv2-row-avatar" style="display:flex;align-items:center;justify-content:center;background:#f1f5f9;font-size:11px;font-weight:700;color:var(--text-light)">'+ini+'</div>';
      }

      tableHTML += '<td><div class="lv2-name-cell">' + avatarTd + '<div>' +
        '<div class="lv2-row-name">' +
          (isKey ? '<span class="lv2-star">'+_lv2StarSvg+'</span>' : '') +
          '<a class="record-link" data-id="'+item.id+'" data-obj="contacts">'+item.name+'</a>' +
          (isKey ? ' <span class="lv2-key-badge">KEY</span>' : '') +
        '</div>' +
        '<div class="lv2-row-sub">'+(item.role||'')+(accName?' - '+accName:'')+'</div>' +
        (pipeline > 0 ? '<div class="lv2-row-pipeline">'+fmtAmount(pipeline)+' pipeline</div>' : '') +
        '</div></div></td>';

      tableHTML += '<td><div class="lv2-cell-main">'+accName+'</div>' +
        (city ? '<div class="lv2-cell-sub">'+city+'</div>' : '') + '</td>';

      tableHTML += '<td><span class="lv2-cell-main">'+(item.role||'')+'</span></td>';
      tableHTML += '<td><span class="lv2-cell-main">'+city+'</span></td>';

      /* Last activity */
      if (lastAct) {
        var actColor = LV2_ACT_COLORS[lastAct.type] || '#94a3b8';
        var actIconPath = LV2_ACT_ICONS[lastAct.type] || '';
        tableHTML += '<td><div class="lv2-activity-badge">' +
          (actIconPath ? _lv2Icon(actIconPath, 13, actColor) : '') +
          ' <span>'+lastAct.when+'</span></div></td>';
      } else {
        tableHTML += '<td><span class="lv2-cell-sub">--</span></td>';
      }

      /* Email / last activity pill */
      if (lastAct) {
        var pillColor = LV2_ACT_COLORS[lastAct.type] || '#94a3b8';
        var pillLabel = LV2_ACT_LABELS[lastAct.type] || lastAct.type;
        var pillIconPath = LV2_ACT_ICONS[lastAct.type] || '';
        tableHTML += '<td><span class="lv2-activity-pill" style="background:'+pillColor+'14;color:'+pillColor+'">' +
          (pillIconPath ? _lv2Icon(pillIconPath, 12, pillColor) : '') +
          ' '+pillLabel+'</span></td>';
      } else {
        tableHTML += '<td><span class="lv2-cell-sub">'+(item.email||'')+'</span></td>';
      }

    } else {
      /* ── Account row ── */
      var acctAvatar = '';
      if (item.photoURL) {
        acctAvatar = '<img src="'+item.photoURL+'" alt="" class="lv2-row-avatar" style="border-radius:8px"/>';
      } else {
        acctAvatar = '<div class="lv2-row-avatar-acct" style="width:34px;height:34px">'+
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18Z"/><path d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2"/><path d="M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/></svg>' +
          '</div>';
      }

      tableHTML += '<td><div class="lv2-name-cell">' + acctAvatar + '<div>' +
        '<div class="lv2-row-name">' +
          (isKey ? '<span class="lv2-star">'+_lv2StarSvg+'</span>' : '') +
          '<a class="record-link" data-id="'+item.id+'" data-obj="accounts">'+item.name+'</a>' +
          (isKey ? ' <span class="lv2-key-badge">KEY</span>' : '') +
        '</div></div></div></td>';

      tableHTML += '<td><span class="lv2-cell-main">'+(item.industry||'')+'</span></td>';
      tableHTML += '<td><span class="lv2-cell-main">'+(item.city||'')+'</span></td>';
      tableHTML += '<td><span class="lv2-pipeline-cell">'+fmtAmount(item.pipeline||0)+'</span></td>';
      tableHTML += '<td><span class="lv2-opp-count">'+(item.opps||0)+'</span></td>';

      /* Status pill */
      var stColor = LV2_STATUS_COLORS[item.status] || '#94a3b8';
      tableHTML += '<td><span class="lv2-status-pill" style="background:'+stColor+'14;color:'+stColor+'">' +
        '<span class="lv2-status-dot" style="background:'+stColor+'"></span>' +
        (item.status||'') + '</span></td>';
    }

    tableHTML += '</tr>';
  });

  tableHTML += '</tbody></table></div></div>';

  /* ── Inject into container — centered layout ── */
  container.innerHTML = '<div class="lv2-container">' + keyHTML + tableHTML + '</div>';

  /* ── Wire events ── */

  /* Key card clicks */
  container.querySelectorAll('.lv2-key-card').forEach(function(card) {
    card.addEventListener('click', function() {
      navigate('record', card.dataset.obj, card.dataset.id);
    });
  });

  /* + Add Key button */
  var addKeyBtn = document.getElementById('lv2-add-key');
  if (addKeyBtn) {
    addKeyBtn.addEventListener('click', function() {
      _lv2ShowToast('Mark a ' + (isContacts ? 'contact' : 'account') + ' as Key from its record page');
    });
  }

  /* Record link clicks */
  container.querySelectorAll('.record-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      navigate('record', link.dataset.obj, link.dataset.id);
    });
  });

  /* Row clicks */
  container.querySelectorAll('.lv2-table tbody tr[data-id]').forEach(function(tr) {
    tr.addEventListener('click', function(e) {
      if (e.target.type === 'checkbox' || e.target.closest('.record-link')) return;
      navigate('record', tr.dataset.obj, tr.dataset.id);
    });
  });

  /* Checkbox: select all */
  var checkAll = document.getElementById('lv2-check-all');
  if (checkAll) {
    checkAll.addEventListener('change', function() {
      var boxes = container.querySelectorAll('.lv2-row-check');
      boxes.forEach(function(cb) { cb.checked = checkAll.checked; });
      _lv2UpdateSelInfo(container);
    });
  }

  /* Checkbox: individual */
  container.querySelectorAll('.lv2-row-check').forEach(function(cb) {
    cb.addEventListener('change', function() {
      _lv2UpdateSelInfo(container);
    });
  });

  /* Column sort */
  container.querySelectorAll('.lv2-table th[data-sort]').forEach(function(th) {
    th.addEventListener('click', function() {
      var col = th.dataset.sort;
      _lv2SortAndRerender(col, items, container, objKey);
    });
  });
}

/* ─── Selection count ─────────────────────────────────── */

function _lv2UpdateSelInfo(container) {
  var checked = container.querySelectorAll('.lv2-row-check:checked');
  var info = document.getElementById('lv2-sel-info');
  if (info) {
    info.innerHTML = checked.length > 0
      ? '<span class="lv2-sel-info">'+checked.length+' selected</span>'
      : '';
  }
}

/* ─── Sort state ──────────────────────────────────────── */

var _lv2SortCol = null;
var _lv2SortDir = 'asc';

function _lv2SortAndRerender(col, items, container, objKey) {
  if (_lv2SortCol === col) {
    _lv2SortDir = (_lv2SortDir === 'asc') ? 'desc' : 'asc';
  } else {
    _lv2SortCol = col;
    _lv2SortDir = 'asc';
  }

  /* Sort for contacts: resolve computed fields */
  var sorted = items.slice();
  sorted.sort(function(a,b) {
    var va, vb;

    if (col === 'company' && objKey === 'contacts') {
      va = getAccountName(a.account).toLowerCase();
      vb = getAccountName(b.account).toLowerCase();
    } else if (col === 'city' && objKey === 'contacts') {
      va = _lv2ContactCity(a).toLowerCase();
      vb = _lv2ContactCity(b).toLowerCase();
    } else {
      va = a[col]; vb = b[col];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
    }

    if (va == null) va = '';
    if (vb == null) vb = '';
    if (va < vb) return _lv2SortDir === 'asc' ? -1 : 1;
    if (va > vb) return _lv2SortDir === 'asc' ? 1 : -1;
    return 0;
  });

  renderListViewV2(sorted, null, container, objKey);

  /* Highlight active sort header */
  container.querySelectorAll('.lv2-table th[data-sort]').forEach(function(th) {
    if (th.dataset.sort === _lv2SortCol) {
      th.classList.add('lv2-th-active');
      th.innerHTML = th.textContent.replace(/[▲▼]/g,'').trim() +
        ' <span class="lv2-sort-arrow">' + (_lv2SortDir==='asc' ? '&#x25B2;' : '&#x25BC;') + '</span>';
    }
  });
}

/* ─── Toast helper ────────────────────────────────────── */

function _lv2ShowToast(msg) {
  var old = document.getElementById('lv2-toast');
  if (old) old.remove();
  var t = document.createElement('div');
  t.id = 'lv2-toast';
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(12px);opacity:0;z-index:9999;background:#0f172a;color:#fff;padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;font-family:inherit;box-shadow:0 8px 32px rgba(0,0,0,.18);pointer-events:none;transition:all .25s;white-space:nowrap';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(function() { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; });
  setTimeout(function() { t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(12px)'; setTimeout(function() { t.remove(); }, 250); }, 2400);
}