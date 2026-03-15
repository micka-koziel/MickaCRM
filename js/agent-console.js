/* ═══════════════════════════════════════════════════════════════
   agent-console.js — Agentic Operations Center V2
   2 tabs: Monitoring (default) · Policy Config
   + Floating L1 Support Chat Bubble (available on all pages)
   Vanilla JS — MickaCRM v4 design system — Accent #7c3aed
   ═══════════════════════════════════════════════════════════════ */

/* ── State ─────────────────────────────────────────────────── */
var AC_TAB = 'dashboard';
var AC_ACTIONS = [];
var AC_NOTIFICATIONS = [
  { id:'n1', text:'GDPR deletion request — Razel-Bec', time:'2 min ago', status:'pending', resolution:'' },
  { id:'n2', text:'Grant admin permissions to C. Martinez', time:'8 min ago', status:'pending', resolution:'' }
];
var AC_CHAT_MESSAGES = [
  { role:'assistant', content:'Bonjour ! Je suis l\'agent de support CRM. Je peux vous aider avec l\'administration du CRM, la qualité des données, la gestion des utilisateurs, ou retrouver des informations. Que puis-je faire pour vous ?' }
];
var AC_CHAT_LOADING = false;
var AC_TOASTS = [];

/* ── Action Catalog ────────────────────────────────────────── */
var AC_CATALOG = [
  {id:'dq1',cat:'Data Quality',label:'Detect & merge duplicate accounts',level:'delegated'},
  {id:'dq2',cat:'Data Quality',label:'Flag records with missing required fields',level:'delegated'},
  {id:'dq3',cat:'Data Quality',label:'Standardize phone numbers & address formats',level:'delegated'},
  {id:'dq4',cat:'Data Quality',label:'Identify orphan records (no parent relationship)',level:'delegated'},
  {id:'dq5',cat:'Data Quality',label:'Auto-enrich company data from public sources',level:'supervised'},
  {id:'dq6',cat:'Data Quality',label:'Mass update / bulk field correction',level:'supervised'},
  {id:'dq7',cat:'Data Quality',label:'Delete or archive obsolete records',level:'escalated'},
  {id:'um1',cat:'User Management',label:'Reset user password',level:'delegated'},
  {id:'um2',cat:'User Management',label:'Unlock locked user account',level:'delegated'},
  {id:'um3',cat:'User Management',label:'Assign or update user profile / role',level:'supervised'},
  {id:'um4',cat:'User Management',label:'Onboard new user (create account + assign permissions)',level:'supervised'},
  {id:'um5',cat:'User Management',label:'Deactivate user account',level:'escalated'},
  {id:'um6',cat:'User Management',label:'Grant admin-level permissions',level:'escalated'},
  {id:'ca1',cat:'CRM Administration',label:'Generate a custom dashboard or report',level:'delegated'},
  {id:'ca2',cat:'CRM Administration',label:'Create or modify a list view / filter',level:'delegated'},
  {id:'ca3',cat:'CRM Administration',label:'Explain a field, object, or CRM concept',level:'delegated'},
  {id:'ca4',cat:'CRM Administration',label:'Audit unused fields & suggest cleanup',level:'delegated'},
  {id:'ca5',cat:'CRM Administration',label:'Add or modify custom fields on an object',level:'supervised'},
  {id:'ca6',cat:'CRM Administration',label:'Configure workflow rules or automation',level:'supervised'},
  {id:'ca7',cat:'CRM Administration',label:'Modify page layouts or record types',level:'escalated'},
  {id:'dr1',cat:'Data Retrieval',label:'Look up a specific account, contact, or opportunity',level:'delegated'},
  {id:'dr2',cat:'Data Retrieval',label:'List records matching criteria (e.g. open opps > 10M€)',level:'delegated'},
  {id:'dr3',cat:'Data Retrieval',label:'Summarize pipeline status or KPIs on demand',level:'delegated'},
  {id:'dr4',cat:'Data Retrieval',label:'Find recent activities for a given account',level:'delegated'},
  {id:'dr5',cat:'Data Retrieval',label:'Export filtered data to CSV',level:'supervised'},
  {id:'dr6',cat:'Data Retrieval',label:'Cross-reference data across multiple objects',level:'supervised'},
  {id:'se1',cat:'Security & Compliance',label:'Audit user login history & anomalies',level:'delegated'},
  {id:'se2',cat:'Security & Compliance',label:'Flag bulk data exports or unusual downloads',level:'delegated'},
  {id:'se3',cat:'Security & Compliance',label:'Detect sharing rule or permission violations',level:'supervised'},
  {id:'se4',cat:'Security & Compliance',label:'Process GDPR data deletion request',level:'escalated'},
  {id:'se5',cat:'Security & Compliance',label:'Revoke API token on suspicious activity',level:'escalated'}
];

var AC_CATS = ['Data Quality','User Management','CRM Administration','Data Retrieval','Security & Compliance'];
var AC_LEVELS = [
  {key:'delegated',label:'Delegated',color:'#10b981',desc:'Agent handles autonomously'},
  {key:'supervised',label:'Supervised',color:'#f59e0b',desc:'Agent acts, human validates'},
  {key:'escalated',label:'Escalated',color:'#ef4444',desc:'Routed to human'}
];
var AC_CAT_ICONS = {
  'Data Quality':'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  'User Management':'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  'CRM Administration':'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  'Data Retrieval':'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  'Security & Compliance':'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
};

var AC_EXPANDED_CATS = {};
AC_CATS.forEach(function(c){ AC_EXPANDED_CATS[c] = true; });

/* ── Simulated task history ─────────────────────────────────── */
var AC_TASKS = [
  {id:'t1',name:'Merged 3 duplicate accounts (Bouygues variants)',cat:'Data Quality',status:'completed',level:'delegated',time:34},
  {id:'t2',name:'Flagged 12 contacts with missing email',cat:'Data Quality',status:'completed',level:'delegated',time:12},
  {id:'t3',name:'Reset password for Sophie Durand',cat:'User Management',status:'completed',level:'delegated',time:8},
  {id:'t4',name:'Generated pipeline dashboard for Q1',cat:'CRM Administration',status:'completed',level:'delegated',time:45},
  {id:'t5',name:'Retrieved open opps > 20M€ for user',cat:'Data Retrieval',status:'completed',level:'delegated',time:6},
  {id:'t6',name:'Audit login anomalies — no issues found',cat:'Security & Compliance',status:'completed',level:'delegated',time:22},
  {id:'t7',name:'Standardized 48 phone number formats',cat:'Data Quality',status:'completed',level:'delegated',time:67},
  {id:'t8',name:'Assigned Sales Rep profile to new user',cat:'User Management',status:'completed',level:'supervised',time:15},
  {id:'t9',name:'Auto-enriched NGE Fondations company data',cat:'Data Quality',status:'completed',level:'supervised',time:89},
  {id:'t10',name:'Created custom field "Site Access Code" on Project',cat:'CRM Administration',status:'completed',level:'supervised',time:38},
  {id:'t11',name:'Exported Q4 opportunities to CSV',cat:'Data Retrieval',status:'completed',level:'supervised',time:11},
  {id:'t12',name:'Detected sharing rule gap on Account object',cat:'Security & Compliance',status:'completed',level:'supervised',time:52},
  {id:'t13',name:'Onboarded new user: Thomas Girard',cat:'User Management',status:'completed',level:'supervised',time:28},
  {id:'t14',name:'Cross-referenced claims vs projects for Eiffage',cat:'Data Retrieval',status:'completed',level:'supervised',time:73},
  {id:'t15',name:'GDPR deletion request — Razel-Bec',cat:'Security & Compliance',status:'escalated',level:'escalated',time:0},
  {id:'t16',name:'Deactivate account: former employee J. Mercier',cat:'User Management',status:'escalated',level:'escalated',time:0},
  {id:'t17',name:'Modify page layout: Opportunity record type',cat:'CRM Administration',status:'pending',level:'escalated',time:0},
  {id:'t18',name:'Grant admin permissions to C. Martinez',cat:'User Management',status:'pending',level:'escalated',time:0},
  {id:'t19',name:'Revoke API token — suspicious bulk export',cat:'Security & Compliance',status:'escalated',level:'escalated',time:0},
  {id:'t20',name:'Delete 200+ archived records from 2019',cat:'Data Quality',status:'pending',level:'escalated',time:0}
];

/* ── Helpers ────────────────────────────────────────────────── */
function _acIcon(name, size, color) { return svgIcon(name, size, color); }
function _acSvg(d, size, color, sw) {
  size = size || 17; color = color || 'currentColor'; sw = sw || 1.8;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="'+color+'" stroke-width="'+sw+'" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="'+d+'"/></svg>';
}

function _acPending() { return AC_NOTIFICATIONS.filter(function(n){return n.status==='pending'}).length; }

/* ── Toast system ──────────────────────────────────────────── */
function acShowToast(title, message, color) {
  var id = 'ac-toast-' + Date.now();
  var el = document.createElement('div');
  el.id = id;
  el.className = 'ac-toast';
  el.style.borderColor = color + '40';
  el.innerHTML =
    '<div class="ac-toast-dot" style="background:'+color+'"></div>' +
    '<div class="ac-toast-body"><div class="ac-toast-title">'+title+'</div><div class="ac-toast-msg">'+message+'</div></div>' +
    '<button class="ac-toast-close" onclick="this.parentElement.remove()">✕</button>';
  var container = document.getElementById('ac-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'ac-toast-container';
    document.body.appendChild(container);
  }
  container.appendChild(el);
  setTimeout(function(){ var t = document.getElementById(id); if(t) t.remove(); }, 4000);
}

/* ── Notification banner ───────────────────────────────────── */
function acRenderBanner() {
  var existing = document.getElementById('ac-banner');
  if (existing) existing.remove();
  var p = _acPending();
  if (p === 0 || (currentPage === 'agentConsole' && AC_TAB === 'dashboard')) return;
  var banner = document.createElement('div');
  banner.id = 'ac-banner';
  banner.className = 'ac-banner';
  banner.innerHTML =
    '<div class="ac-banner-inner">' +
      _acSvg('M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', 14, '#fff', 2) +
      '<span>'+p+' pending escalation'+(p>1?'s':'')+' require your attention</span>' +
      '<div style="flex:1"></div>' +
      '<button class="ac-banner-btn" onclick="AC_TAB=\'dashboard\';renderAgentConsole()">View</button>' +
      '<button class="ac-banner-x" onclick="this.closest(\'.ac-banner\').remove()">✕</button>' +
    '</div>';
  var main = document.getElementById('page-content');
  if (main) main.parentNode.insertBefore(banner, main);
}

/* ═══════════════════════════════════════════════════════════════
   MAIN RENDER
   ═══════════════════════════════════════════════════════════════ */
function renderAgentConsole(container) {
  if (!container) container = document.getElementById('page-content');
  if (AC_ACTIONS.length === 0) {
    AC_ACTIONS = AC_CATALOG.map(function(a){ return {id:a.id,cat:a.cat,label:a.label,level:a.level}; });
  }

  injectACStyles();

  var p = _acPending();
  var tabs = [
    {key:'dashboard',label:'Monitoring',icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'},
    {key:'users',label:'Users',icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'},
    {key:'config',label:'Policy Config',icon:'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'}
  ];

  var tabsHtml = tabs.map(function(t) {
    var active = AC_TAB === t.key;
    var badge = (t.key === 'dashboard' && p > 0) ? '<span class="ac-tab-badge">'+p+'</span>' : '';
    return '<button class="ac-tab'+(active?' active':'')+'" onclick="AC_TAB=\''+t.key+'\';renderAgentConsole()">' +
      _acSvg(t.icon, 15, active ? '#7c3aed' : '#94a3b8') + t.label + badge + '</button>';
  }).join('');

  container.innerHTML =
    '<div class="ac-wrap">' +
      '<div class="ac-header">' +
        '<div class="ac-header-left">' +
          '<div class="ac-logo-icon">' + _acSvg('M13 10V3L4 14h7v7l9-11h-7z', 18, '#fff', 2) + '</div>' +
          '<div><div class="ac-title">Agent Console</div><div class="ac-subtitle">CRM Administration & Support</div></div>' +
        '</div>' +
        '<div class="ac-tabs-wrap">' + tabsHtml + '</div>' +
      '</div>' +
      '<div class="ac-content" id="ac-content"></div>' +
    '</div>';

  acRenderBanner();

  var content = document.getElementById('ac-content');
  switch (AC_TAB) {
    case 'dashboard': acRenderDashboard(content); break;
    case 'users': umRenderTab(content); break;
    case 'config': acRenderConfig(content); break;
  }
}

/* ═══════════════════════════════════════════════════════════════
   TAB 1: POLICY CONFIG
   ═══════════════════════════════════════════════════════════════ */
function acRenderConfig(el) {
  var stats = {delegated:0, supervised:0, escalated:0};
  AC_ACTIONS.forEach(function(a){ stats[a.level]++; });

  var statsHtml = AC_LEVELS.map(function(l) {
    return '<div class="ac-stat-card"><div class="ac-stat-num" style="background:'+l.color+'15;color:'+l.color+'">'+stats[l.key]+'</div>' +
      '<div><div class="ac-stat-label">'+l.label+'</div><div class="ac-stat-desc">'+l.desc+'</div></div></div>';
  }).join('');

  var catsHtml = AC_CATS.map(function(cat) {
    var catActions = AC_ACTIONS.filter(function(a){return a.cat===cat});
    var open = AC_EXPANDED_CATS[cat];
    var actionsHtml = '';
    if (open) {
      actionsHtml = '<div class="ac-cat-body">' + catActions.map(function(a,i) {
        var btns = AC_LEVELS.map(function(l) {
          var on = a.level === l.key;
          return '<button class="ac-lvl-btn'+(on?' active':'')+'" style="'+(on?'background:'+l.color+'18;color:'+l.color+';outline:1.5px solid '+l.color:'outline:1.5px solid transparent;color:#94a3b8')+'" '+
            'onclick="acSetLevel(\''+a.id+'\',\''+l.key+'\')">'+l.label+'</button>';
        }).join('');
        return '<div class="ac-action-row'+(i<catActions.length-1?' bordered':'')+'">' +
          '<span class="ac-action-label">'+a.label+'</span>' +
          '<div class="ac-lvl-group">'+btns+'</div></div>';
      }).join('') + '</div>';
    }

    return '<div class="ac-cat-card">' +
      '<button class="ac-cat-header" onclick="AC_EXPANDED_CATS[\''+cat+'\']=!AC_EXPANDED_CATS[\''+cat+'\'];acRenderConfig(document.getElementById(\'ac-content\'))">' +
        '<div class="ac-cat-icon">' + _acSvg(AC_CAT_ICONS[cat], 16, '#7c3aed') + '</div>' +
        '<span class="ac-cat-title">'+cat+'</span><span class="ac-cat-count">('+catActions.length+')</span>' +
        '<div style="flex:1"></div>' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" style="transform:rotate('+(open?'180':'0')+'deg);transition:transform .2s"><path d="M19 9l-7 7-7-7"/></svg>' +
      '</button>' + actionsHtml + '</div>';
  }).join('');

  el.innerHTML =
    '<div class="ac-config">' +
      '<div class="ac-stats-row">' + statsHtml + '</div>' +
      '<div class="ac-search-wrap"><div class="ac-search-icon">' + _acSvg('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', 15, '#94a3b8') + '</div>' +
        '<input class="ac-search" placeholder="Search actions..." oninput="acFilterConfig(this.value)"></div>' +
      '<div id="ac-cats-list">' + catsHtml + '</div>' +
    '</div>';
}

function acSetLevel(id, level) {
  AC_ACTIONS = AC_ACTIONS.map(function(a){ return a.id===id ? {id:a.id,cat:a.cat,label:a.label,level:level} : a; });
  acRenderConfig(document.getElementById('ac-content'));
}

function acFilterConfig(q) {
  /* Simple: just re-render with filtered display via CSS or re-filter */
  var rows = document.querySelectorAll('.ac-action-row');
  rows.forEach(function(row) {
    var label = row.querySelector('.ac-action-label');
    if (label) {
      row.style.display = label.textContent.toLowerCase().indexOf(q.toLowerCase()) >= 0 ? '' : 'none';
    }
  });
}

/* ═══════════════════════════════════════════════════════════════
   TAB 2: L1 SUPPORT CHAT (Scripted Scenario Engine)
   ═══════════════════════════════════════════════════════════════ */

function acRenderChat(el) {
  if (!el) el = document.getElementById('ac-float-body');
  if (!el) return;

  var suggestions = [
    'Qui sont les contacts chez Bouygues ?',
    'Résume-moi le pipeline et les KPIs',
    'Mon mot de passe ne fonctionne plus',
    'Analyse la qualité des données : champs vides ?',
    'Crée un dashboard du pipeline par stage',
    'Liste-moi les utilisateurs actifs',
    'Désactive le compte d\'Antoine Mercier',
    'Crée un nouvel utilisateur'
  ];

  var msgsHtml = AC_CHAT_MESSAGES.map(function(m) {
    var isUser = m.role === 'user';
    var isEsc = !isUser && m.content.indexOf('[ESCALADE]') >= 0;
    var isAct = !isUser && m.content.indexOf('✅') >= 0;
    var isSup = !isUser && m.content.indexOf('🔄') >= 0;
    var borderColor = isEsc ? 'rgba(239,68,68,0.25)' : isSup ? 'rgba(245,158,11,0.25)' : isAct ? 'rgba(16,185,129,0.25)' : 'var(--border)';
    var avatar = !isUser ? '<div class="ac-chat-avatar">' + _acSvg('M13 10V3L4 14h7v7l9-11h-7z', 14, '#fff', 2) + '</div>' : '';

    var formatted = acFormatMsg(m.content, isUser);

    return '<div class="ac-msg '+(isUser?'user':'agent')+'">' +
      avatar +
      '<div class="ac-bubble '+(isUser?'user':'agent')+'" style="'+(isUser?'':'border-color:'+borderColor)+'">' + formatted + '</div></div>';
  }).join('');

  if (AC_CHAT_LOADING) {
    msgsHtml += '<div class="ac-msg agent"><div class="ac-chat-avatar">' + _acSvg('M13 10V3L4 14h7v7l9-11h-7z', 14, '#fff', 2) + '</div>' +
      '<div class="ac-typing"><span></span><span></span><span></span></div></div>';
  }

  var suggestHtml = '<div class="ac-suggestions" style="padding:6px 12px;margin-bottom:0">' + suggestions.slice(0,4).map(function(s) {
    return '<button class="ac-suggest-btn" style="font-size:11px;padding:5px 10px" onclick="document.getElementById(\'ac-chat-input\').value=this.textContent;document.getElementById(\'ac-chat-input\').focus()">'+s+'</button>';
  }).join('') + '</div>';

  el.innerHTML =
    '<div class="ac-float-messages" id="ac-chat-scroll">' + msgsHtml + '<div id="ac-chat-bottom"></div></div>' +
    suggestHtml +
    '<div class="ac-chat-input-wrap" style="margin:0 10px 10px;border-radius:12px">' +
      '<textarea id="ac-chat-input" class="ac-chat-input" placeholder="Décrivez votre demande…" rows="1"></textarea>' +
      '<button class="ac-send-btn" id="ac-send-btn" onclick="acSendMessage()">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>' +
      '</button>' +
    '</div>';

  var input = document.getElementById('ac-chat-input');
  if (input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); acSendMessage(); }
    });
    input.addEventListener('input', function() {
      var btn = document.getElementById('ac-send-btn');
      btn.classList.toggle('active', input.value.trim().length > 0);
    });
  }

  var scroll = document.getElementById('ac-chat-scroll');
  if (scroll) scroll.scrollTop = scroll.scrollHeight;
}

function acFormatMsg(text, isUser) {
  if (isUser) return '<span>' + text.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</span>';
  /* Support rich HTML blocks delimited by %%HTML%% ... %%/HTML%% */
  var parts = text.split(/(%%HTML%%[\s\S]*?%%\/HTML%%)/);
  return parts.map(function(part) {
    if (part.indexOf('%%HTML%%') === 0) {
      return part.replace('%%HTML%%','').replace('%%/HTML%%','');
    }
    return part.replace(/</g,'&lt;').replace(/>/g,'&gt;').split('\n').map(function(line) {
      if (line.indexOf('✅') === 0) return '<span style="color:#10b981;font-weight:600">' + line + '</span>';
      if (line.indexOf('🔄') === 0) return '<span style="color:#f59e0b;font-weight:600">' + line + '</span>';
      if (line.indexOf('⚠️') >= 0 || line.indexOf('[ESCALADE]') >= 0) return '<span style="color:#ef4444;font-weight:600">' + line + '</span>';
      return '<span>' + line + '</span>';
    }).join('<br>');
  }).join('');
}

/* ── Scripted Scenario Engine ──────────────────────────────── */
var AC_SCENARIOS = [
  /* ── Data Quality ── */
  { keywords:['doublon','duplicate','doublons','duplicates','merge'],
    actionId:'dq1',
    responses:{
      delegated:'✅ Action réalisée : Analyse des doublons terminée.\n\n3 doublons détectés et fusionnés :\n• "Bouygues Construction" et "Bouygues Constr." → fusionnés (compte principal : a1)\n• "Vinci Immobilier" et "VINCI Immo" → fusionnés (compte principal : a2)\n• "Eiffage GC" et "Eiffage Génie Civil" → fusionnés (compte principal : a3)\n\n7 contacts et 4 opportunités ont été rattachés automatiquement aux comptes principaux.',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\n3 doublons identifiés pour fusion :\n• "Bouygues Construction" / "Bouygues Constr." → fusion proposée vers a1\n• "Vinci Immobilier" / "VINCI Immo" → fusion proposée vers a2\n• "Eiffage GC" / "Eiffage Génie Civil" → fusion proposée vers a3\n\nLa fusion sera exécutée après validation d\'un administrateur.',
      escalated:'⚠️ [ESCALADE] Fusion de doublons comptes\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : La fusion de comptes peut impacter les relations, opportunités et historique. Un administrateur doit valider les correspondances proposées.'}
  },
  { keywords:['champ','vide','vides','missing','incomplet','incomplete','manquant'],
    actionId:'dq2',
    responses:{
      delegated:'✅ Action réalisée : Audit des champs obligatoires terminé.\n\n12 enregistrements avec des champs manquants détectés :\n\nContacts (6) :\n• Claire Rousseau — email manquant\n• Antoine Mercier — téléphone manquant\n• Nathalie Petit — email et téléphone manquants\n• 3 autres contacts — champ "role" vide\n\nComptes (4) :\n• NGE Fondations — secteur d\'activité manquant\n• Razel-Bec — adresse incomplète\n• 2 autres — champ "pipeline" à 0 sans opportunités\n\nOpportunités (2) :\n• Flaubert Bridge Phase 2 — date de clôture dépassée\n• Port de Nice Quai Sud — probabilité non renseignée',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\n12 enregistrements avec champs manquants identifiés (6 contacts, 4 comptes, 2 opportunités). Un rapport détaillé a été généré. L\'envoi des notifications aux propriétaires de fiches sera effectué après validation.',
      escalated:'⚠️ [ESCALADE] Audit champs manquants\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : L\'audit des champs obligatoires peut révéler des problèmes structurels nécessitant une revue admin.'}
  },
  { keywords:['format','adresse','address','telephone','phone','standardis'],
    actionId:'dq3',
    responses:{
      delegated:'✅ Action réalisée : Standardisation des formats terminée.\n\n48 numéros de téléphone reformatés au format international (+33 X XX XX XX XX)\n12 adresses normalisées (capitalisation, code postal vérifié)\n3 emails corrigés (espaces supprimés, domaine vérifié)',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\n48 numéros, 12 adresses et 3 emails identifiés pour standardisation. Aperçu des modifications disponible. Exécution après validation.',
      escalated:'⚠️ [ESCALADE] Standardisation des formats\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : Les modifications en masse de données de contact nécessitent une approbation.'}
  },
  { keywords:['enrichi','enrich','données publiques','public sources'],
    actionId:'dq5',
    responses:{
      delegated:'✅ Action réalisée : Enrichissement de données effectué.\n\nComptes enrichis depuis les sources publiques :\n• NGE Fondations — CA ajouté (420M€), effectif (2,800), SIRET vérifié\n• Razel-Bec — adresse siège mise à jour, secteur NAF corrigé\n• Implenia TP — lien LinkedIn corporate ajouté, dirigeant mis à jour',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\n3 comptes identifiés pour enrichissement (NGE Fondations, Razel-Bec, Implenia TP). Données collectées depuis les registres publics. Application après validation admin.',
      escalated:'⚠️ [ESCALADE] Enrichissement de données depuis sources publiques\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : L\'ajout de données externes nécessite une validation de conformité.'}
  },
  { keywords:['supprimer','archiver','delete','archive','obsolete','anciens','ancien','2019','nettoyer','nettoyage'],
    actionId:'dq7',
    responses:{
      delegated:'✅ Action réalisée : 214 enregistrements archivés datant d\'avant 2020.\n\nDétail : 156 activités, 38 opportunités fermées, 20 leads convertis. Les données restent accessibles dans l\'archive.',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\n214 enregistrements identifiés pour archivage (antérieurs à 2020). Liste exportée pour revue. Archivage après validation.',
      escalated:'⚠️ [ESCALADE] Suppression/archivage d\'enregistrements obsolètes\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : La suppression de données est irréversible et nécessite une validation par un administrateur autorisé.'}
  },
  /* ── User Management ── */
  { keywords:['mot de passe','password','reset','mdp','réinitialiser'],
    actionId:'um1',
    responses:{
      delegated:'✅ Action réalisée : Mot de passe réinitialisé.\n\nUn email de réinitialisation a été envoyé à l\'utilisateur. Le lien est valable 24h.\nSi vous connaissez l\'utilisateur concerné, précisez-moi son nom pour que je confirme l\'envoi.',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\nDemande de réinitialisation de mot de passe enregistrée. L\'email sera envoyé après confirmation d\'un admin.',
      escalated:'⚠️ [ESCALADE] Réinitialisation de mot de passe\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : La politique de sécurité requiert une validation admin pour les resets de mot de passe.'}
  },
  { keywords:['désactiv','deactivat','supprimer compte','supprimer utilisateur','remove user'],
    actionId:'um5',
    responses:{
      delegated:'✅ Action réalisée : Le compte utilisateur a été désactivé. L\'utilisateur ne pourra plus se connecter. Ses données et son historique sont conservés.',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\nDemande de désactivation préparée. Le compte sera désactivé après confirmation admin. Les données seront conservées.',
      escalated:'⚠️ [ESCALADE] Désactivation de compte utilisateur\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : La désactivation d\'un compte utilisateur a un impact sur les accès et les données associées. Un administrateur doit valider cette action.'}
  },
  { keywords:['réactiv','reactiv','activer','activate','rétablir','restore','enable','activer le compte'],
    actionId:'um2',
    responses:{
      delegated:'✅ Action réalisée : Le compte utilisateur a été réactivé. L\'utilisateur peut à nouveau se connecter.',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\nDemande de réactivation préparée. Le compte sera réactivé après confirmation admin.',
      escalated:'⚠️ [ESCALADE] Réactivation de compte utilisateur\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : La réactivation d\'un compte doit être validée par un administrateur.'}
  },
  { keywords:['permission','admin','administrateur','grant','accorder','élever','elevat'],
    actionId:'um6',
    responses:{
      delegated:'✅ Action réalisée : Permissions admin accordées. L\'utilisateur dispose maintenant des droits d\'administration complets.',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\nDemande d\'élévation de permissions préparée. Les droits admin seront accordés après validation d\'un super-admin.',
      escalated:'⚠️ [ESCALADE] Attribution de permissions admin\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : L\'attribution de droits d\'administration est une opération sensible qui requiert l\'approbation d\'un super-administrateur.'}
  },
  { keywords:['onboard','nouveau','nouvel utilisateur','new user','créer compte','créer un compte'],
    actionId:'um4',
    responses:{
      delegated:'✅ Action réalisée : Nouveau compte utilisateur créé.\n\nProfil : Sales Rep\nAccès : Comptes, Contacts, Opportunités, Projets (lecture/écriture)\nUn email d\'activation a été envoyé.',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\nNouveau compte préparé avec profil Sales Rep standard. Activation après validation admin.',
      escalated:'⚠️ [ESCALADE] Création de compte utilisateur\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : La création de comptes nécessite une validation des droits d\'accès.'}
  },
  /* ── CRM Administration ── */
  { keywords:['dashboard','tableau de bord','rapport','report'],
    actionId:'ca1',
    responses:{
      delegated:'✅ Action réalisée : Dashboard "Pipeline par Stage" généré.\n\nVoici la structure créée :\n• KPI 1 : Pipeline total — 249.5M€ (10 opportunités)\n• KPI 2 : Taux de conversion — 20% (2 Closed Won)\n• KPI 3 : Valeur moyenne — 24.9M€ par opportunité\n• Graphique : Répartition par stage\n  - Lead : 1 (22M€)\n  - Study : 1 (8.5M€)\n  - Tender : 2 (50M€)\n  - Proposal : 2 (26M€)\n  - Negotiation : 2 (101M€)\n  - Closed Won : 2 (42M€)\n\nLe dashboard est accessible depuis la section Home.',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\nDashboard "Pipeline par Stage" conçu avec 3 KPIs et un graphique de répartition. Sera publié après validation admin.',
      escalated:'⚠️ [ESCALADE] Génération de dashboard\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : La création de dashboards visibles par tous les utilisateurs requiert une approbation.'}
  },
  { keywords:['expliqu','explain','comment','fonctionn','c\'est quoi','qu\'est-ce'],
    actionId:'ca3',
    responses:{
      delegated:'Bien sûr ! Je suis là pour vous aider à comprendre le CRM.\n\nMickaCRM est organisé autour de ces objets principaux :\n\n• Comptes — les entreprises clientes ou prospects (ex: Bouygues Construction)\n• Contacts — les personnes rattachées à un compte (ex: Jean-Pierre Martin, Dir. Travaux)\n• Opportunités — les affaires commerciales avec montant et probabilité\n• Projets — les chantiers en cours, liés aux opportunités gagnées\n• Leads — les pistes commerciales pas encore qualifiées\n• Claims — les réclamations liées aux projets\n• Activities — les actions planifiées (appels, visites, réunions)\n\nQuel objet ou fonctionnalité souhaitez-vous que je détaille ?',
      supervised:'Bien sûr, je peux vous expliquer le fonctionnement du CRM. MickaCRM est structuré autour de Comptes, Contacts, Opportunités, Projets, Leads, Claims et Activities. Quelle partie souhaitez-vous que je détaille ?',
      escalated:'⚠️ [ESCALADE] Explication CRM\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : Les explications sur la configuration du CRM sont réservées aux administrateurs.'}
  },
  { keywords:['audit','champ','inutilisé','unused','cleanup','orphelin'],
    actionId:'ca4',
    responses:{
      delegated:'✅ Action réalisée : Audit des champs inutilisés terminé.\n\n14 champs identifiés sans aucune donnée :\n\n• Account : "Fax" (0% rempli), "SIC Code" (0%), "Subsidiary_of" (2%)\n• Contact : "Assistant_Name" (0%), "Birthdate" (5%), "Mailing_Country" (8%)\n• Opportunity : "Campaign_Source" (0%), "Lead_Source_Detail" (3%)\n• 6 champs custom legacy préfixés "OLD_" sur Project\n\nRecommandation : archiver les 8 champs à 0% et réviser les 6 champs "OLD_" avec l\'équipe métier.',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\n14 champs inutilisés identifiés sur 4 objets. Rapport détaillé généré avec recommandations de nettoyage. Suppression après validation.',
      escalated:'⚠️ [ESCALADE] Audit des champs inutilisés\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : La suppression de champs impacte la structure de données et requiert une approbation.'}
  },
  { keywords:['champ custom','custom field','ajouter champ','add field','modifier champ','nouveau champ'],
    actionId:'ca5',
    responses:{
      delegated:'✅ Action réalisée : Champ custom ajouté.\n\nObjet : Project\nNom : "Site Access Code"\nType : Texte (50 car.)\nVisibilité : Tous les profils\nLe champ est maintenant disponible sur les fiches Projet.',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\nCréation du champ custom "Site Access Code" (texte, 50 car.) sur l\'objet Project. Le champ sera créé après validation admin.',
      escalated:'⚠️ [ESCALADE] Création de champ custom\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : La modification du schéma de données nécessite une approbation pour assurer la cohérence du modèle.'}
  },
  { keywords:['page layout','layout','mise en page','record type','type enregistrement'],
    actionId:'ca7',
    responses:{
      delegated:'✅ Action réalisée : Page layout modifié avec succès.',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\nModification de page layout préparée. Sera appliquée après validation.',
      escalated:'⚠️ [ESCALADE] Modification de page layout\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : Les modifications de page layout impactent l\'expérience de tous les utilisateurs et nécessitent une validation.'}
  },
  /* ── Data Retrieval ── */
  { keywords:['contact','contacts','chez','qui sont'],
    actionId:'dr1',
    responses:{
      delegated:null, /* dynamic — built at runtime */
      supervised:null,
      escalated:'⚠️ [ESCALADE] Recherche de données\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : L\'accès aux données de contact est restreint.'}
  },
  { keywords:['opportunit','>','supérieur','plus de','pipeline','opp'],
    actionId:'dr2',
    responses:{
      delegated:null,
      supervised:null,
      escalated:'⚠️ [ESCALADE] Recherche d\'opportunités\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : L\'accès aux données commerciales est restreint.'}
  },
  { keywords:['export','csv','télécharger','download','extraire'],
    actionId:'dr5',
    responses:{
      delegated:'✅ Action réalisée : Export CSV généré.\n\nFichier : "Opportunities_Q4_2025.csv"\nContenu : 10 opportunités avec colonnes Nom, Compte, Montant, Stage, Probabilité, Date de clôture\nTaille : 2.4 KB\n\nLe fichier est prêt au téléchargement.',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\nExport CSV préparé (10 opportunités, 6 colonnes). Le téléchargement sera autorisé après validation admin.',
      escalated:'⚠️ [ESCALADE] Export de données CSV\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : Les exports de données sont soumis à validation pour des raisons de sécurité.'}
  },
  /* ── Security & Compliance ── */
  { keywords:['login','connexion','anomalie','audit login','suspect','suspicious'],
    actionId:'se1',
    responses:{
      delegated:'✅ Action réalisée : Audit des connexions terminé (7 derniers jours).\n\n• 847 connexions au total, 10 utilisateurs actifs\n• 0 tentative échouée suspecte\n• Connexion la plus fréquente : Jean-Pierre Martin (127 sessions)\n• 1 alerte mineure : Christophe Martinez s\'est connecté depuis une IP inhabituelle le 12/03 à 23h41 — probablement en déplacement\n\nAucune anomalie critique détectée.',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\nRapport d\'audit des connexions généré. 1 alerte mineure détectée (IP inhabituelle). Rapport en attente de revue admin.',
      escalated:'⚠️ [ESCALADE] Audit des connexions\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : L\'audit de sécurité des connexions requiert une approbation.'}
  },
  { keywords:['rgpd','gdpr','suppression','données personnelles','droit à l\'oubli','data deletion'],
    actionId:'se4',
    responses:{
      delegated:'✅ Action réalisée : Demande RGPD traitée. Les données personnelles ont été supprimées conformément au règlement.',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\nDemande de suppression RGPD identifiée. Les données concernées ont été listées. Suppression effective après validation DPO/admin.',
      escalated:'⚠️ [ESCALADE] Demande de suppression RGPD\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : Les demandes RGPD de suppression de données personnelles doivent être traitées par un administrateur autorisé en coordination avec le DPO.'}
  },
  { keywords:['token','api','révoquer','revoke','bulk export','téléchargement massif'],
    actionId:'se5',
    responses:{
      delegated:'✅ Action réalisée : Token API révoqué. Toutes les sessions associées ont été invalidées.',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\nToken API identifié pour révocation. Invalidation après confirmation admin.',
      escalated:'⚠️ [ESCALADE] Révocation de token API\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : La révocation de tokens API peut interrompre des intégrations critiques. Un administrateur doit valider l\'action.'}
  },
  /* ── Data Retrieval — Pipeline / KPIs ── */
  { keywords:['pipeline','résumé','summary','kpi','kpis','chiffres','combien','stats','statistiques','vue d\'ensemble','overview'],
    actionId:'dr3',
    responses:{
      delegated:null, /* dynamic — built at runtime */
      supervised:null,
      escalated:'⚠️ [ESCALADE] Résumé pipeline / KPIs\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : L\'accès aux KPIs consolidés est restreint aux administrateurs.'}
  },
  /* ── User Management — List users ── */
  { keywords:['utilisateur','utilisateurs','users','user','profil','profils','actif','actifs','liste des','qui utilise','combien d\'utilisateurs'],
    actionId:'um3',
    responses:{
      delegated:null, /* dynamic — built at runtime */
      supervised:null,
      escalated:'⚠️ [ESCALADE] Liste des utilisateurs\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : L\'accès à la liste des utilisateurs et profils est réservé aux administrateurs.'}
  },
  /* ── User Management — Create user (explicit) ── */
  { keywords:['créer un utilisateur','créer utilisateur','créer un user','ajouter un utilisateur','ajouter utilisateur','add user','create user','nouveau compte utilisateur'],
    actionId:'um4',
    responses:{
      delegated:'✅ Action réalisée : Nouveau compte utilisateur créé.\n\nDétails du compte :\n• Profil : Sales Rep (standard)\n• Accès : Comptes, Contacts, Opportunités, Projets, Leads, Activities (lecture/écriture)\n• Restrictions : Pas d\'accès aux paramètres d\'administration, pas d\'export en masse\n• Tableau de bord : Dashboard commercial par défaut assigné\n\nUn email d\'activation a été envoyé. L\'utilisateur devra définir son mot de passe à la première connexion.\n\nSouhaitez-vous modifier le profil ou les permissions ?',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\nNouveau compte utilisateur préparé :\n• Profil proposé : Sales Rep (standard)\n• Accès : Comptes, Contacts, Opportunités, Projets (lecture/écriture)\n\nLe compte sera activé après validation d\'un administrateur. L\'email d\'activation sera envoyé à ce moment-là.',
      escalated:'⚠️ [ESCALADE] Création de compte utilisateur\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : La création de comptes utilisateur nécessite la validation d\'un administrateur pour définir les droits d\'accès appropriés.'}
  },
  /* ── CRM Administration — Add field (explicit phrasing) ── */
  { keywords:['ajouter un champ','ajouter champ','créer un champ','créer champ','add a field','new field','rajouter'],
    actionId:'ca5',
    responses:{
      delegated:'✅ Action réalisée : Nouveau champ ajouté avec succès.\n\nDétails :\n• Objet cible : détecté automatiquement selon votre contexte\n• Type : Texte (modifiable)\n• Visibilité : Tous les profils\n• Position : Ajouté en fin de section "Informations complémentaires"\n\nLe champ est immédiatement disponible sur les fiches. Précisez-moi le nom de l\'objet et du champ si vous souhaitez que j\'ajuste.',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\nDemande de création de champ enregistrée. Merci de préciser :\n• Sur quel objet ? (Account, Contact, Opportunity, Project…)\n• Nom du champ ?\n• Type ? (Texte, Nombre, Date, Liste de choix…)\n\nLe champ sera créé après validation admin.',
      escalated:'⚠️ [ESCALADE] Ajout de champ sur un objet\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : La modification du schéma de données (ajout de champ) impacte tous les utilisateurs et nécessite une validation pour assurer la cohérence du modèle de données.'}
  },
  /* ── CRM Administration — Workflow / automation ── */
  { keywords:['workflow','automation','automatisation','règle','rule','notification auto','alerte auto','trigger','déclencheur'],
    actionId:'ca6',
    responses:{
      delegated:'✅ Action réalisée : Règle d\'automatisation configurée.\n\nDétails :\n• Déclencheur : Mise à jour d\'un enregistrement\n• Condition : Changement de stage sur Opportunity\n• Action : Notification email au propriétaire du compte + mise à jour du champ "Last Stage Change" avec la date du jour\n\nLa règle est active immédiatement. Souhaitez-vous ajouter d\'autres conditions ou actions ?',
      supervised:'🔄 Action préparée — soumise à validation admin :\n\nRègle d\'automatisation préparée. Détails techniques à valider :\n• Déclencheur, conditions et actions définis\n• Impact estimé : s\'appliquera à toutes les opportunités futures\n\nActivation après validation admin.',
      escalated:'⚠️ [ESCALADE] Configuration de workflow / automation\nCette action nécessite une intervention admin. Ticket d\'escalade créé.\nRaison : Les règles d\'automatisation peuvent impacter tous les utilisateurs et les processus existants. Validation admin requise.'}
  }
];

/* ── Dynamic response builders WITH real CRM mutations ─────── */
/* ── Helper: status dot ── */
function _acStatusDot(color) { return '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:'+color+';margin-right:5px"></span>'; }

/* ═══ MUTATION ENGINE — Real changes to window.DATA ═══ */
function acMutateMergeDuplicates() {
  var D = window.DATA; if(!D||!D.accounts) return {removed:0,before:0,after:0};
  if(!D.accounts.find(function(a){return a.id==='a1_dup'})) {
    D.accounts.push({id:'a1_dup',name:'Bouygues Constr.',industry:'General Contractor',city:'Paris',pipeline:0,opps:0,status:'Active'});
    D.accounts.push({id:'a2_dup',name:'VINCI Immo',industry:'Real Estate Developer',city:'Nanterre',pipeline:0,opps:0,status:'Active'});
  }
  var before=D.accounts.length;
  D.accounts=D.accounts.filter(function(a){return a.id!=='a1_dup'&&a.id!=='a2_dup'});
  return {removed:before-D.accounts.length,before:before,after:D.accounts.length};
}
function acMutateStandardizePhones() {
  var D=window.DATA; if(!D||!D.contacts) return {count:0};
  var count=0;
  D.contacts.forEach(function(c){ if(c.phone){c._standardized=true; count++;} });
  return {count:count};
}
function acMutateCreateUser(name) {
  var D=window.DATA; if(!D) return null;
  name=name||'Lucas Bernard';
  var newId='c'+(D.contacts.length+1);
  var newContact={id:newId,name:name,account:'a1',role:'Sales Representative',
    email:name.toLowerCase().replace(/\s/g,'.').replace(/[éèê]/g,'e').replace(/[àâ]/g,'a')+'@company.com',
    phone:'+33 6 55 44 33 22'};
  D.contacts.push(newContact);
  if(D.activities){D.activities.push({id:'act_ob_'+Date.now(),type:'Email',subject:'User onboarding — '+name,
    date:new Date().toISOString().split('T')[0],time:'09:00',status:'Completed',owner:'System — Agent Console',
    purpose:'Automated onboarding email sent.'});}
  return newContact;
}
function acMutateDeactivateUser(msg) {
  var D=window.DATA; if(!D||!D.contacts) return null;
  var found=null;
  D.contacts.forEach(function(c){
    if(!found && msg.toLowerCase().indexOf(c.name.split(' ').pop().toLowerCase())>=0) found=c;
  });
  if(!found) D.contacts.forEach(function(c){
    if(!found && msg.toLowerCase().indexOf(c.name.split(' ')[0].toLowerCase())>=0) found=c;
  });
  if(found&&!found._deactivated){
    found._deactivated=true;found.role=(found.role||'')+' [DEACTIVATED]';
    if(D.activities){D.activities.push({id:'act_de_'+Date.now(),type:'Email',subject:'Account deactivated — '+found.name,
      date:new Date().toISOString().split('T')[0],time:'09:00',status:'Completed',owner:'System — Agent Console',
      purpose:'User account deactivated by admin.'});}
  }
  return found;
}
function acMutateResetPassword(msg) {
  var D=window.DATA; if(!D) return 'utilisateur';
  var found=null;
  (D.contacts||[]).forEach(function(c){if(msg.toLowerCase().indexOf(c.name.split(' ')[0].toLowerCase())>=0) found=c;});
  var userName=found?found.name:'utilisateur actuel';
  if(D.activities){D.activities.push({id:'act_pw_'+Date.now(),type:'Email',subject:'Password reset — '+userName,
    date:new Date().toISOString().split('T')[0],time:'09:00',status:'Completed',owner:'System — Agent Console',
    purpose:'Password reset email sent automatically.'});}
  return userName;
}

function acBuildContactResponse(msg) {
  var D=window.DATA||{}; var accounts=D.accounts||[]; var contacts=D.contacts||[];
  var matchedAcct=null;
  accounts.forEach(function(a){ var fn=a.name.split(' ')[0].toLowerCase(); if(fn.length>2&&msg.toLowerCase().indexOf(fn)>=0) matchedAcct=a; });

  var targets = matchedAcct ? contacts.filter(function(c){return c.account===matchedAcct.id}) : contacts.slice(0,5);
  if(targets.length===0) return matchedAcct ? 'Aucun contact chez '+matchedAcct.name+'.' : 'Aucun contact trouvé.';

  var tbl='<table style="width:100%;border-collapse:collapse;font-size:11.5px;margin:8px 0;border-radius:8px;overflow:hidden">';
  tbl+='<thead><tr>';
  ['Name','Role','Email','Phone'].forEach(function(h){tbl+='<th style="text-align:left;padding:6px 10px;background:#7c3aed10;color:#7c3aed;font-weight:600;border-bottom:1px solid #e8eaed;font-size:10.5px;text-transform:uppercase;letter-spacing:.3px">'+h+'</th>';});
  tbl+='</tr></thead><tbody>';
  targets.forEach(function(c,i){
    tbl+='<tr style="'+(i%2===1?'background:#f8f9fb':'')+';cursor:pointer" onclick="navigate(\'record\',\'contacts\',\''+c.id+'\')">';
    tbl+='<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5;color:#7c3aed;font-weight:500">'+c.name+'</td>';
    tbl+='<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5;color:#1e293b">'+(c.role||'—')+'</td>';
    tbl+='<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5;color:#64748b;font-size:11px">'+(c.email||'—')+'</td>';
    tbl+='<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5;color:#64748b;font-size:11px">'+(c.phone||'—')+'</td></tr>';
  });
  tbl+='</tbody></table><div style="font-size:10px;color:#94a3b8;margin-top:4px">Click a name to open the record</div>';
  var title = matchedAcct ? targets.length+' contact(s) chez '+matchedAcct.name : 'Top 5 contacts';
  return '✅ Action réalisée : '+title+'\n%%HTML%%'+tbl+'%%/HTML%%';
}

function acBuildOppResponse(msg) {
  var D=window.DATA||{}; var opps=D.opportunities||[]; var accounts=D.accounts||[];
  var threshold=0; var m=msg.match(/(\d+)\s*M/i); if(m) threshold=parseInt(m[1])*1000000; if(!threshold) threshold=20000000;
  var filtered=opps.filter(function(o){return o.amount>=threshold}).sort(function(a,b){return b.amount-a.amount});
  if(!filtered.length) return 'Aucune opportunité ≥ '+fmtAmount(threshold)+'.';

  var stageColors={lead:'#94a3b8',study:'#3b82f6',tender:'#f59e0b',proposal:'#ec4899',negotiation:'#f97316',closed_won:'#10b981',launched:'#6366f1'};
  var tbl='<table style="width:100%;border-collapse:collapse;font-size:11.5px;margin:8px 0;border-radius:8px;overflow:hidden">';
  tbl+='<thead><tr>';
  ['Opportunity','Amount','Stage','Prob.','Account'].forEach(function(h){tbl+='<th style="text-align:left;padding:6px 10px;background:#7c3aed10;color:#7c3aed;font-weight:600;border-bottom:1px solid #e8eaed;font-size:10.5px;text-transform:uppercase;letter-spacing:.3px">'+h+'</th>';});
  tbl+='</tr></thead><tbody>';
  filtered.forEach(function(o,i){
    var acct=accounts.find(function(a){return a.id===o.account}); var sc=stageColors[o.stage]||'#94a3b8';
    tbl+='<tr style="'+(i%2===1?'background:#f8f9fb':'')+';cursor:pointer" onclick="navigate(\'record\',\'opportunities\',\''+o.id+'\')">';
    tbl+='<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5;color:#7c3aed;font-weight:500">'+o.name+'</td>';
    tbl+='<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5;font-weight:600;color:#1e293b">'+fmtAmount(o.amount)+'</td>';
    tbl+='<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5"><span style="background:'+sc+'15;color:'+sc+';padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600">'+o.stage+'</span></td>';
    tbl+='<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5;color:#64748b">'+(o.prob||0)+'%</td>';
    tbl+='<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5;color:#64748b">'+(acct?acct.name:'—')+'</td></tr>';
  });
  tbl+='</tbody></table><div style="font-size:10px;color:#94a3b8;margin-top:4px">Click a row to open the opportunity</div>';
  return '✅ Action réalisée : '+filtered.length+' opportunité(s) ≥ '+fmtAmount(threshold)+'\n%%HTML%%'+tbl+'%%/HTML%%';
}

function acBuildPipelineResponse() {
  var D=window.DATA||{}; var opps=D.opportunities||[]; var accounts=D.accounts||[];
  var projects=D.projects||[]; var leads=D.leads||[]; var contacts=D.contacts||[];
  var totalPipe=opps.reduce(function(s,o){return s+(o.amount||0)},0);
  var wonOpps=opps.filter(function(o){return o.stage==='closed_won'});
  var wonAmt=wonOpps.reduce(function(s,o){return s+(o.amount||0)},0);
  var avgProb=Math.round(opps.reduce(function(s,o){return s+(o.prob||0)},0)/(opps.length||1));
  var stages={}; opps.forEach(function(o){if(!stages[o.stage])stages[o.stage]={count:0,amount:0};stages[o.stage].count++;stages[o.stage].amount+=(o.amount||0);});
  var stageColors={lead:'#94a3b8',study:'#3b82f6',tender:'#f59e0b',proposal:'#ec4899',negotiation:'#f97316',closed_won:'#10b981',launched:'#6366f1'};

  var kpiHtml='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0">';
  [{l:'Pipeline Total',v:fmtAmount(totalPipe),c:'#7c3aed'},{l:'Closed Won',v:fmtAmount(wonAmt),c:'#10b981'},{l:'Avg. Probability',v:avgProb+'%',c:'#2563eb'}].forEach(function(k){
    kpiHtml+='<div style="background:'+k.c+'08;border:1px solid '+k.c+'20;border-radius:8px;padding:10px;text-align:center"><div style="font-size:18px;font-weight:700;color:'+k.c+'">'+k.v+'</div><div style="font-size:10px;color:#64748b;margin-top:2px">'+k.l+'</div></div>';
  });
  kpiHtml+='</div>';

  var barHtml='<div style="margin:10px 0">';
  Object.keys(stages).forEach(function(s){
    var pct=Math.round(stages[s].amount/totalPipe*100); var color=stageColors[s]||'#94a3b8';
    barHtml+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">';
    barHtml+='<span style="width:80px;font-size:10.5px;color:#64748b;text-transform:capitalize">'+s.replace('_',' ')+'</span>';
    barHtml+='<div style="flex:1;height:16px;background:#f0f2f5;border-radius:4px;overflow:hidden"><div style="width:'+pct+'%;height:100%;background:'+color+';border-radius:4px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:600">'+(pct>5?pct+'%':'')+'</div></div>';
    barHtml+='<span style="width:55px;text-align:right;font-size:10.5px;font-weight:600;color:#1e293b">'+fmtAmount(stages[s].amount)+'</span></div>';
  });
  barHtml+='</div>';

  var statsHtml='<div style="display:flex;gap:14px;font-size:11px;color:#64748b;margin-top:6px;flex-wrap:wrap">';
  statsHtml+=_acStatusDot('#10b981')+accounts.filter(function(a){return a.status==="Active"}).length+' accounts ';
  statsHtml+=_acStatusDot('#3b82f6')+projects.length+' projects ';
  statsHtml+=_acStatusDot('#f59e0b')+leads.length+' leads ';
  statsHtml+=_acStatusDot('#7c3aed')+contacts.length+' contacts';
  statsHtml+='</div>';

  return '✅ Action réalisée : Pipeline CRM — Vue d\'ensemble\n%%HTML%%'+kpiHtml+barHtml+statsHtml+'%%/HTML%%';
}

function acBuildUsersResponse() {
  var users=[
    {name:'Jean-Pierre Martin',profile:'Admin',status:'Active',lastLogin:'Today, 09:12',sessions:127,cid:'c1'},
    {name:'Sophie Durand',profile:'Sales Rep',status:'Active',lastLogin:'Today, 08:45',sessions:98,cid:'c2'},
    {name:'Marc Lefèvre',profile:'Sales Rep',status:'Active',lastLogin:'Yesterday',sessions:84,cid:'c3'},
    {name:'Isabelle Moreau',profile:'Sales Manager',status:'Active',lastLogin:'Today, 10:05',sessions:72,cid:'c4'},
    {name:'Thomas Girard',profile:'Sales Rep',status:'Active',lastLogin:'Yesterday',sessions:56,cid:'c5'},
    {name:'Claire Rousseau',profile:'Sales Rep',status:'Active',lastLogin:'Mar 12',sessions:43,cid:'c6'},
    {name:'Antoine Mercier',profile:'Field Rep',status:'Active',lastLogin:'Mar 10',sessions:31,cid:'c7'},
    {name:'Nathalie Petit',profile:'Sales Rep',status:'Inactive',lastLogin:'Feb 28',sessions:12,cid:'c8'},
    {name:'Christophe Martinez',profile:'Sales Manager',status:'Active',lastLogin:'Today, 07:58',sessions:91,cid:'c9'},
    {name:'Émilie Faure',profile:'Sales Rep',status:'Active',lastLogin:'Yesterday',sessions:67,cid:'c10'}
  ];
  var active=users.filter(function(u){return u.status==='Active'}).length;

  var tbl='<table style="width:100%;border-collapse:collapse;font-size:11.5px;margin:8px 0;border-radius:8px;overflow:hidden">';
  tbl+='<thead><tr>';
  ['','Name','Profile','Last Login','Sessions'].forEach(function(h){tbl+='<th style="text-align:left;padding:6px '+(h?'10':'4')+'px;background:#7c3aed10;color:#7c3aed;font-weight:600;border-bottom:1px solid #e8eaed;font-size:10.5px;text-transform:uppercase;letter-spacing:.3px">'+h+'</th>';});
  tbl+='</tr></thead><tbody>';
  users.forEach(function(u,i){
    var dc=u.status==='Active'?'#10b981':'#ef4444'; var pc=u.profile==='Admin'?'#7c3aed':u.profile==='Sales Manager'?'#2563eb':u.profile==='Field Rep'?'#f59e0b':'#64748b';
    tbl+='<tr style="'+(i%2===1?'background:#f8f9fb':'')+';cursor:pointer" onclick="navigate(\'record\',\'contacts\',\''+u.cid+'\')">';
    tbl+='<td style="padding:5px 4px;border-bottom:1px solid #f0f2f5;text-align:center">'+_acStatusDot(dc)+'</td>';
    tbl+='<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5;color:#7c3aed;font-weight:500">'+u.name+'</td>';
    tbl+='<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5"><span style="background:'+pc+'12;color:'+pc+';padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600">'+u.profile+'</span></td>';
    tbl+='<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5;color:#64748b;font-size:11px">'+u.lastLogin+'</td>';
    tbl+='<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5;color:#1e293b;font-weight:500">'+u.sessions+'</td></tr>';
  });
  tbl+='</tbody></table>';
  var sum='<div style="display:flex;gap:12px;margin-top:6px;font-size:11px">';
  sum+='<span style="background:#10b98112;color:#10b981;padding:3px 10px;border-radius:8px;font-weight:600">'+active+' Active</span>';
  sum+='<span style="background:#ef444412;color:#ef4444;padding:3px 10px;border-radius:8px;font-weight:600">'+(users.length-active)+' Inactive</span></div>';
  return '✅ Action réalisée : '+users.length+' utilisateurs CRM\n%%HTML%%'+tbl+sum+'%%/HTML%%';
}

/* ── Main send function (scripted, supports async) ─────────────────────────── */
function acSendMessage() {
  var input = document.getElementById('ac-chat-input');
  var msg = input.value.trim();
  if (!msg || AC_CHAT_LOADING) return;

  AC_CHAT_MESSAGES.push({ role:'user', content:msg });
  AC_CHAT_LOADING = true;
  acRenderChat(document.getElementById('ac-float-body'));

  /* Simulate thinking delay */
  var delay = 800 + Math.random() * 1200;
  setTimeout(function() {
    var result = acMatchScenario(msg);

    /* Handle both sync strings and Promises */
    if (result && typeof result.then === 'function') {
      result.then(function(response) {
        acFinishMessage(response, msg);
      }).catch(function(err) {
        console.error('[Agent] Async error:', err);
        acFinishMessage('⚠️ Une erreur est survenue. Veuillez réessayer.', msg);
      });
    } else {
      acFinishMessage(result, msg);
    }
  }, delay);
}

function acFinishMessage(response, msg) {
  AC_CHAT_MESSAGES.push({ role:'assistant', content:response });

  /* Detect escalation */
  if (response.indexOf('[ESCALADE]') >= 0) {
    var match = response.match(/\[ESCALADE\]\s*(.+?)(?:\n|$)/);
    var escText = match ? match[1].trim() : msg.slice(0,60);
    AC_NOTIFICATIONS.unshift({ id:'n'+Date.now(), text:escText, time:'Just now', status:'pending', resolution:'' });
    acShowToast('New Escalation', escText, '#ef4444');
    acRenderBanner();
    var acContent = document.getElementById('ac-content');
    if (acContent && AC_TAB === 'dashboard') acRenderDashboard(acContent);
  }
  AC_CHAT_LOADING = false;
  acRenderChat(document.getElementById('ac-float-body'));
}

function acMatchScenario(msg) {
  var lower = msg.toLowerCase();
  var bestMatch = null;
  var bestScore = 0;

  AC_SCENARIOS.forEach(function(sc) {
    var score = 0;
    sc.keywords.forEach(function(kw) {
      if (lower.indexOf(kw.toLowerCase()) >= 0) score++;
    });
    if (score > bestScore) { bestScore = score; bestMatch = sc; }
  });

  if (!bestMatch || bestScore === 0) {
    return 'Je comprends votre demande, mais je n\'ai pas pu identifier une action précise dans mon catalogue.\n\nJe peux vous aider avec :\n• Qualité des données (doublons, champs vides, formats)\n• Gestion utilisateurs (mot de passe, permissions, comptes)\n• Administration CRM (dashboards, rapports, champs custom)\n• Recherche de données (comptes, contacts, opportunités)\n• Sécurité (audit connexions, RGPD, tokens API)\n\nPouvez-vous reformuler votre demande ?';
  }

  var action = AC_ACTIONS.find(function(a){ return a.id === bestMatch.actionId; });
  var level = action ? action.level : 'delegated';
  var _vb = function(label,page,obj,id){
    var oc = obj&&id ? "navigate('record','"+obj+"','"+id+"')" : "navigate('"+page+"')";
    return '<div style="margin-top:10px"><button onclick="'+oc+'" style="background:#7c3aed12;color:#7c3aed;border:1px solid #7c3aed30;padding:6px 14px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit">→ '+label+'</button></div>';
  };

  /* ── MUTATIONS (delegated only) ── */
  if (level === 'delegated') {
    if (bestMatch.actionId === 'dq1') {
      var r=acMutateMergeDuplicates(); acShowToast('Duplicates Merged',r.removed+' accounts merged','#10b981');
      return bestMatch.responses.delegated+'\n%%HTML%%'+_vb('Verify in Accounts','accounts')+'%%/HTML%%';
    }
    if (bestMatch.actionId === 'dq3') {
      var r=acMutateStandardizePhones(); acShowToast('Phones Standardized',r.count+' contacts updated','#10b981');
      return bestMatch.responses.delegated+'\n%%HTML%%'+_vb('Verify in Contacts','contacts')+'%%/HTML%%';
    }
    if (bestMatch.actionId === 'um1') {
      /* Real Firestore: password reset */
      if (typeof umChatResetPwd === 'function' && UM_LOADED) return umChatResetPwd(msg);
      var uname=acMutateResetPassword(msg); acShowToast('Password Reset','Email sent to '+uname,'#10b981');
      return '✅ Action réalisée : Mot de passe de '+uname+' réinitialisé.\n\nUn email de réinitialisation a été envoyé (valable 24h).\nActivité créée dans l\'historique.\n%%HTML%%'+_vb('View in Activities','activities')+'%%/HTML%%';
    }
    if (bestMatch.actionId === 'um4') {
      /* Real Firestore: create user */
      if (typeof umChatCreateUser === 'function' && UM_LOADED) return umChatCreateUser(msg);
      var nu=acMutateCreateUser(); acShowToast('User Created',nu.name+' added to CRM','#10b981');
      var btns='<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">';
      btns+='<button onclick="navigate(\'record\',\'contacts\',\''+nu.id+'\')" style="background:#7c3aed12;color:#7c3aed;border:1px solid #7c3aed30;padding:6px 14px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit">→ Open '+nu.name+'</button>';
      btns+='<button onclick="navigate(\'contacts\')" style="background:#f0f2f5;color:#64748b;border:1px solid #e8eaed;padding:6px 14px;border-radius:8px;font-size:11px;font-weight:500;cursor:pointer;font-family:inherit">View Contacts</button></div>';
      return '✅ Action réalisée : Nouveau compte créé.\n\n• Nom : '+nu.name+'\n• Email : '+nu.email+'\n• Profil : Sales Representative\n• Rattaché à : Bouygues Construction\n\nEmail d\'activation envoyé. Activité d\'onboarding créée.\n%%HTML%%'+btns+'%%/HTML%%';
    }
    if (bestMatch.actionId === 'um5') {
      /* Real Firestore: deactivate user */
      if (typeof umChatDeactivate === 'function' && UM_LOADED) return umChatDeactivate(msg);
      var du=acMutateDeactivateUser(msg);
      if(du){ acShowToast('User Deactivated',du.name+' — account disabled','#ef4444');
        return '✅ Action réalisée : Compte de '+du.name+' désactivé.\n\nL\'utilisateur ne peut plus se connecter. Données conservées.\nActivité de désactivation créée.\n%%HTML%%'+_vb('View Record','contacts',du.id?'contacts':null,du.id)+'%%/HTML%%';
      }
      return '⚠️ Utilisateur non trouvé. Précisez le nom complet.';
    }
    if (bestMatch.actionId === 'um2') {
      /* Real Firestore: activate user */
      if (typeof umChatActivate === 'function' && UM_LOADED) return umChatActivate(msg);
      return '✅ Compte réactivé.';
    }
  }

  /* ── Rich dynamic responses ── */
  if (bestMatch.actionId==='dr1'&&(level==='delegated'||level==='supervised')) {
    if(level==='supervised') return '🔄 Action préparée — soumise à validation admin :\n\nRecherche de contacts effectuée. Résultats en attente de validation.';
    return acBuildContactResponse(msg);
  }
  if (bestMatch.actionId==='dr2'&&(level==='delegated'||level==='supervised')) {
    if(level==='supervised') return '🔄 Action préparée — soumise à validation admin :\n\nRecherche d\'opportunités effectuée. Résultats en attente de validation.';
    return acBuildOppResponse(msg);
  }
  if (bestMatch.actionId==='dr3'&&(level==='delegated'||level==='supervised')) {
    if(level==='supervised') return '🔄 Action préparée — soumise à validation admin :\n\nRésumé pipeline et KPIs générés. En attente de validation.';
    return acBuildPipelineResponse();
  }
  if (bestMatch.actionId==='um3'&&(level==='delegated'||level==='supervised')) {
    if(level==='supervised') return '🔄 Action préparée — soumise à validation admin :\n\nListe des utilisateurs générée. En attente de validation.';
    /* Use real Firestore data if loaded */
    if (typeof umBuildUsersResponseReal === 'function' && UM_LOADED) return umBuildUsersResponseReal();
    return acBuildUsersResponse();
  }

  return bestMatch.responses[level] || 'Je traite votre demande...';
}

/* ═══════════════════════════════════════════════════════════════
   TAB 3: MONITORING DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
function acRenderDashboard(el) {
  var comp = AC_TASKS.filter(function(t){return t.status==='completed'}).length;
  var pend = AC_TASKS.filter(function(t){return t.status==='pending'}).length;
  var esc = AC_TASKS.filter(function(t){return t.status==='escalated'}).length;
  var tot = AC_TASKS.length;
  var avgTime = Math.round(AC_TASKS.filter(function(t){return t.status==='completed'}).reduce(function(s,t){return s+t.time},0) / (comp||1));
  var autoRate = Math.round(comp/tot*100);

  /* KPIs */
  var kpis = [
    {label:'Tasks Processed',value:tot,sub:comp+' completed',color:'#7c3aed',icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'},
    {label:'Avg. Resolution',value:avgTime+'s',sub:'per task',color:'#2563eb',icon:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'},
    {label:'Automation Rate',value:autoRate+'%',sub:comp+'/'+tot+' auto-resolved',color:'#10b981',icon:'M13 10V3L4 14h7v7l9-11h-7z'},
    {label:'Pending Escalations',value:esc+pend,sub:_acPending()+' awaiting review',color:'#ef4444',icon:'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z'}
  ];
  var kpiHtml = kpis.map(function(k) {
    return '<div class="ac-kpi"><div class="ac-kpi-icon" style="background:'+k.color+'12">' + _acSvg(k.icon,20,k.color) + '</div>' +
      '<div><div class="ac-kpi-val">'+k.value+'</div><div class="ac-kpi-label">'+k.label+'</div><div class="ac-kpi-sub">'+k.sub+'</div></div></div>';
  }).join('');

  /* Delegation mix bar */
  var mixHtml = AC_LEVELS.map(function(l) {
    var c = AC_TASKS.filter(function(t){return t.level===l.key}).length;
    var p = Math.round(c/tot*100);
    return p > 0 ? '<div style="width:'+p+'%;background:'+l.color+'" class="ac-mix-seg">'+p+'%</div>' : '';
  }).join('');
  var mixLegend = AC_LEVELS.map(function(l) {
    return '<div class="ac-mix-legend"><div class="ac-mix-dot" style="background:'+l.color+'"></div>'+l.label+': '+AC_TASKS.filter(function(t){return t.level===l.key}).length+'</div>';
  }).join('');

  /* By category */
  var byCat = AC_CATS.map(function(cat) {
    var t = AC_TASKS.filter(function(x){return x.cat===cat}).length;
    var c = AC_TASKS.filter(function(x){return x.cat===cat&&x.status==='completed'}).length;
    var pct = t > 0 ? Math.round(c/t*100) : 0;
    return '<div class="ac-cat-bar-row">' +
      '<div class="ac-cat-bar-icon">' + _acSvg(AC_CAT_ICONS[cat],14,'#7c3aed') + '</div>' +
      '<span class="ac-cat-bar-name">'+cat+'</span>' +
      '<div class="ac-cat-bar-track"><div class="ac-cat-bar-fill" style="width:'+pct+'%"></div></div>' +
      '<span class="ac-cat-bar-count">'+c+'/'+t+'</span></div>';
  }).join('');

  /* Recent tasks */
  var tasksHtml = AC_TASKS.slice(0,10).map(function(t,i) {
    var dotColor = t.status==='completed'?'#10b981':t.status==='pending'?'#f59e0b':'#ef4444';
    return '<div class="ac-task-row'+(i<9?' bordered':'')+'">' +
      '<div class="ac-task-dot" style="background:'+dotColor+'"></div>' +
      '<span class="ac-task-name">'+t.name+'</span>' +
      '<span class="ac-task-cat">'+t.cat+'</span>' +
      (t.time > 0 ? '<span class="ac-task-time">'+t.time+'s</span>' : '<span class="ac-task-time">—</span>') +
      '</div>';
  }).join('');

  /* Escalation queue */
  var notifsHtml = AC_NOTIFICATIONS.map(function(n) { return acEscCard(n); }).join('');
  var activeBadge = _acPending() > 0 ? '<span class="ac-esc-badge">'+_acPending()+'</span>' : '';

  /* Agent health */
  var healthItems = [
    {l:'Uptime',v:'99.7%',c:'#10b981'},{l:'Avg. Response',v:'1.2s',c:'#2563eb'},
    {l:'Error Rate',v:'0.3%',c:'#10b981'},{l:'Queue Depth',v:''+pend,c:pend>3?'#f59e0b':'#10b981'}
  ];
  var healthHtml = healthItems.map(function(h) {
    return '<div class="ac-health-row"><span>'+h.l+'</span><span style="color:'+h.c+';font-weight:600">'+h.v+'</span></div>';
  }).join('');

  el.innerHTML =
    '<div class="ac-dash">' +
      '<div class="ac-kpi-row">' + kpiHtml + '</div>' +
      '<div class="ac-dash-grid">' +
        '<div class="ac-dash-left">' +
          '<div class="ac-card"><div class="ac-card-title">Delegation Mix</div>' +
            '<div class="ac-mix-bar">' + mixHtml + '</div>' +
            '<div class="ac-mix-legends">' + mixLegend + '</div></div>' +
          '<div class="ac-card"><div class="ac-card-title">Resolution by Category</div>' + byCat + '</div>' +
          '<div class="ac-card"><div class="ac-card-title">Recent Tasks</div>' + tasksHtml + '</div>' +
        '</div>' +
        '<div class="ac-dash-right">' +
          '<div class="ac-card"><div class="ac-card-title" style="display:flex;align-items:center;gap:8px">' +
            _acSvg('M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',16,'#ef4444') +
            'Escalation Queue ' + activeBadge + '</div><div id="ac-esc-list">' + notifsHtml + '</div></div>' +
          '<div class="ac-card"><div class="ac-card-title">Agent Health</div>' + healthHtml + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
}

/* ── Escalation card HTML ──────────────────────────────────── */
function acEscCard(n) {
  var isPending = n.status === 'pending';
  var badges = {
    accepted:{label:'Delegated to Agent',color:'#10b981'},
    declined:{label:'Declined — Not Authorized',color:'#ef4444'},
    handled:{label:'Handled by Admin',color:'#2563eb'}
  };
  var b = badges[n.status];
  var borderColor = isPending ? 'rgba(239,68,68,0.15)' : (b ? b.color+'20' : '#e8eaed');
  var bgColor = isPending ? 'rgba(239,68,68,0.03)' : (b ? b.color+'06' : '#f8f9fb');

  var html = '<div class="ac-esc-card" style="background:'+bgColor+';border-color:'+borderColor+'">' +
    '<div class="ac-esc-header">' +
      '<div class="ac-esc-dot" style="background:'+(isPending?'#ef4444':(b?b.color:'#94a3b8'))+'"></div>' +
      '<div class="ac-esc-info"><div class="ac-esc-text">'+n.text+'</div><div class="ac-esc-time">'+n.time+'</div></div></div>';

  if (!isPending && b) {
    html += '<div class="ac-esc-resolved" style="background:'+b.color+'12;color:'+b.color+'">'+b.label+'</div>';
  }
  if (n.status === 'handled' && n.resolution) {
    html += '<div class="ac-esc-note">"'+n.resolution+'"</div>';
  }
  if (isPending) {
    html += '<div class="ac-esc-actions">' +
      '<button class="ac-esc-btn" style="background:#10b98115;color:#10b981" onclick="acAcceptEsc(\''+n.id+'\')">' + _acSvg('M9 12l2 2 4-4',12,'#10b981',2.2) + ' Accept</button>' +
      '<button class="ac-esc-btn" style="background:#ef444412;color:#ef4444" onclick="acDeclineEsc(\''+n.id+'\')">' + _acSvg('M6 18L18 6M6 6l12 12',12,'#ef4444',2.2) + ' Decline</button>' +
      '<button class="ac-esc-btn wider" style="background:#2563eb12;color:#2563eb" onclick="acShowHandleForm(\''+n.id+'\')">' + _acSvg('M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',12,'#2563eb',2) + ' I\'ll handle it</button>' +
    '</div>';
  }
  html += '</div>';
  return html;
}

function acAcceptEsc(id) {
  AC_NOTIFICATIONS = AC_NOTIFICATIONS.map(function(n){return n.id===id?{id:n.id,text:n.text,time:n.time,status:'accepted',resolution:''}:n});
  acShowToast('Delegated to Agent', 'Agent will execute the task', '#10b981');
  acRenderDashboard(document.getElementById('ac-content'));
  acRenderBanner();
}

function acDeclineEsc(id) {
  AC_NOTIFICATIONS = AC_NOTIFICATIONS.map(function(n){return n.id===id?{id:n.id,text:n.text,time:n.time,status:'declined',resolution:''}:n});
  acShowToast('Action Declined', 'Not authorized — user will be notified', '#ef4444');
  acRenderDashboard(document.getElementById('ac-content'));
  acRenderBanner();
}

function acShowHandleForm(id) {
  var card = document.querySelector('.ac-esc-card [onclick*="'+id+'"]');
  if (!card) return;
  var actionsDiv = card.closest('.ac-esc-card').querySelector('.ac-esc-actions');
  if (!actionsDiv) return;
  actionsDiv.innerHTML =
    '<textarea class="ac-handle-textarea" id="ac-handle-text-'+id+'" placeholder="Describe what you did to resolve this…" rows="3"></textarea>' +
    '<div class="ac-handle-btns">' +
      '<button class="ac-handle-confirm" onclick="acConfirmHandle(\''+id+'\')">Confirm Resolution</button>' +
      '<button class="ac-handle-cancel" onclick="acRenderDashboard(document.getElementById(\'ac-content\'))">Cancel</button>' +
    '</div>';
  document.getElementById('ac-handle-text-'+id).focus();
}

function acConfirmHandle(id) {
  var text = document.getElementById('ac-handle-text-'+id);
  var res = text ? text.value.trim() : '';
  if (!res) return;
  AC_NOTIFICATIONS = AC_NOTIFICATIONS.map(function(n){return n.id===id?{id:n.id,text:n.text,time:n.time,status:'handled',resolution:res}:n});
  acShowToast('Handled Personally', 'Escalation resolved by admin', '#2563eb');
  acRenderDashboard(document.getElementById('ac-content'));
  acRenderBanner();
}

/* ═══════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════ */
function injectACStyles() {
  if (document.getElementById('ac-styles')) return;
  var s = document.createElement('style');
  s.id = 'ac-styles';
  s.textContent = '\
/* Agent Console */\
.ac-wrap { animation: acFadeIn .3s ease; }\
@keyframes acFadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }\
@keyframes acTyping { 0%{opacity:.3} 50%{opacity:1} 100%{opacity:.3} }\
@keyframes acToastIn { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }\
@keyframes acSlideDown { from{transform:translateY(-100%);opacity:0} to{transform:translateY(0);opacity:1} }\
@keyframes acPulse { 0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0.3)} 50%{box-shadow:0 0 0 6px rgba(124,58,237,0)} }\
\
.ac-header { background:var(--card); border-bottom:1px solid var(--border); padding:16px 28px; display:flex; align-items:center; gap:16px; flex-wrap:wrap }\
.ac-header-left { display:flex; align-items:center; gap:10px }\
.ac-logo-icon { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,#7c3aed,#6d28d9); display:flex; align-items:center; justify-content:center }\
.ac-title { font-size:16px; font-weight:700; color:var(--text) }\
.ac-subtitle { font-size:11px; color:var(--text-muted); margin-top:-1px }\
.ac-tabs-wrap { margin-left:auto; display:flex; gap:2px; background:var(--bg); border-radius:10px; padding:3px }\
.ac-tab { display:flex; align-items:center; gap:6px; padding:7px 16px; border-radius:8px; border:none; background:transparent; color:var(--text-muted); font-weight:500; font-size:12.5px; cursor:pointer; font-family:inherit; transition:all .15s ease; position:relative }\
.ac-tab.active { background:var(--card); color:#7c3aed; font-weight:600; box-shadow:0 1px 3px rgba(0,0,0,0.08) }\
.ac-tab-badge { position:absolute; top:2px; right:4px; width:16px; height:16px; border-radius:50%; background:#ef4444; color:#fff; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center }\
.ac-content { padding:24px; overflow:auto; flex:1 }\
\
/* Banner */\
.ac-banner { background:linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%); color:#fff; animation:acSlideDown .3s ease }\
.ac-banner-inner { display:flex; align-items:center; gap:10px; padding:10px 20px; font-size:13px; font-weight:500 }\
.ac-banner-btn { background:rgba(255,255,255,0.2); border:none; color:#fff; padding:4px 12px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit }\
.ac-banner-x { background:none; border:none; color:rgba(255,255,255,0.7); cursor:pointer; padding:2px; font-size:14px }\
\
/* Toast */\
#ac-toast-container { position:fixed; top:16px; right:16px; z-index:9999; display:flex; flex-direction:column; gap:8px; pointer-events:none }\
.ac-toast { pointer-events:auto; display:flex; align-items:center; gap:10px; padding:12px 16px; border-radius:12px; background:var(--card); border:1px solid; box-shadow:0 8px 24px rgba(0,0,0,0.08); animation:acToastIn .3s ease; min-width:280px; max-width:400px }\
.ac-toast-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0 }\
.ac-toast-body { flex:1 }\
.ac-toast-title { font-size:12px; font-weight:600; color:var(--text) }\
.ac-toast-msg { font-size:11px; color:var(--text-muted); margin-top:1px }\
.ac-toast-close { background:none; border:none; color:var(--text-light); cursor:pointer; font-size:13px; flex-shrink:0 }\
\
/* Config */\
.ac-config { max-width:960px; margin:0 auto }\
.ac-stats-row { display:flex; gap:12px; margin-bottom:20px }\
.ac-stat-card { flex:1; background:var(--card); border-radius:12px; padding:14px 18px; border:1px solid var(--border); display:flex; align-items:center; gap:12px }\
.ac-stat-num { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:700 }\
.ac-stat-label { font-size:13px; font-weight:600; color:var(--text) }\
.ac-stat-desc { font-size:11px; color:var(--text-muted) }\
.ac-search-wrap { position:relative; margin-bottom:16px }\
.ac-search-icon { position:absolute; left:12px; top:13px; pointer-events:none }\
.ac-search { width:100%; height:42px; padding-left:36px; border-radius:10px; border:1px solid var(--border); font-size:13px; font-family:inherit; outline:none; background:var(--card); color:var(--text) }\
.ac-cat-card { margin-bottom:12px; background:var(--card); border-radius:12px; border:1px solid var(--border); overflow:hidden }\
.ac-cat-header { width:100%; display:flex; align-items:center; gap:10px; padding:14px 18px; border:none; background:transparent; cursor:pointer; font-family:inherit }\
.ac-cat-icon { width:32px; height:32px; border-radius:8px; background:rgba(124,58,237,0.06); display:flex; align-items:center; justify-content:center }\
.ac-cat-title { font-size:13.5px; font-weight:600; color:var(--text) }\
.ac-cat-count { font-size:11px; color:var(--text-muted); margin-left:4px }\
.ac-cat-body { border-top:1px solid var(--border) }\
.ac-action-row { display:flex; align-items:center; padding:11px 18px; gap:12px }\
.ac-action-row.bordered { border-bottom:1px solid var(--bg) }\
.ac-action-label { flex:1; font-size:12.5px; color:var(--text); font-weight:500 }\
.ac-lvl-group { display:flex; gap:3px; background:var(--bg); border-radius:8px; padding:3px }\
.ac-lvl-btn { padding:4px 11px; border-radius:6px; border:none; font-size:11px; font-weight:500; cursor:pointer; font-family:inherit; transition:all .15s ease }\
.ac-lvl-btn.active { font-weight:600 }\
\
/* Chat */\
.ac-chat-wrap { max-width:720px; margin:0 auto; height:calc(100vh - 200px); display:flex; flex-direction:column }\
.ac-chat-messages { flex:1; overflow:auto; display:flex; flex-direction:column; gap:8px; padding-bottom:12px }\
.ac-msg { display:flex; gap:8px; animation:acFadeIn .25s ease }\
.ac-msg.user { justify-content:flex-end }\
.ac-msg.agent { justify-content:flex-start }\
.ac-chat-avatar { width:30px; height:30px; border-radius:50%; background:linear-gradient(135deg,#7c3aed,#6d28d9); display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:4px }\
.ac-bubble { max-width:75%; padding:11px 16px; font-size:13px; line-height:1.6; white-space:pre-wrap }\
.ac-bubble.user { border-radius:16px 16px 4px 16px; background:linear-gradient(135deg,#7c3aed,#6d28d9); color:#fff; box-shadow:0 2px 8px rgba(124,58,237,0.2) }\
.ac-bubble.agent { border-radius:16px 16px 16px 4px; background:var(--card); color:var(--text); border:1px solid var(--border); box-shadow:0 1px 4px rgba(0,0,0,0.04) }\
.ac-typing { display:flex; gap:4px; padding:12px 0 }\
.ac-typing span { width:7px; height:7px; border-radius:50%; background:#7c3aed; display:inline-block }\
.ac-typing span:nth-child(1) { animation:acTyping 1s ease 0s infinite }\
.ac-typing span:nth-child(2) { animation:acTyping 1s ease .2s infinite }\
.ac-typing span:nth-child(3) { animation:acTyping 1s ease .4s infinite }\
.ac-suggestions { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px }\
.ac-suggest-btn { padding:8px 14px; border-radius:20px; border:1px solid var(--border); background:var(--card); color:var(--text-muted); font-size:12px; cursor:pointer; font-family:inherit; transition:all .15s ease }\
.ac-suggest-btn:hover { border-color:#7c3aed; color:#7c3aed }\
.ac-chat-input-wrap { display:flex; gap:10px; align-items:flex-end; background:var(--card); border-radius:14px; border:1px solid var(--border); padding:8px; box-shadow:0 2px 12px rgba(0,0,0,0.04) }\
.ac-chat-input { flex:1; border:none; outline:none; resize:none; font-size:13px; font-family:inherit; padding:8px 10px; color:var(--text); background:transparent; line-height:1.5 }\
.ac-send-btn { width:38px; height:38px; border-radius:10px; border:none; background:var(--bg); color:var(--text-light); cursor:default; display:flex; align-items:center; justify-content:center; transition:all .15s ease; flex-shrink:0 }\
.ac-send-btn.active { background:linear-gradient(135deg,#7c3aed,#6d28d9); color:#fff; cursor:pointer }\
\
/* Dashboard */\
.ac-dash { max-width:1040px; margin:0 auto }\
.ac-kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px }\
.ac-kpi { background:var(--card); border-radius:12px; border:1px solid var(--border); padding:16px 18px; display:flex; align-items:center; gap:14px }\
.ac-kpi-icon { width:42px; height:42px; border-radius:11px; display:flex; align-items:center; justify-content:center }\
.ac-kpi-val { font-size:22px; font-weight:700; color:var(--text); line-height:1 }\
.ac-kpi-label { font-size:11px; color:var(--text-muted); margin-top:3px }\
.ac-kpi-sub { font-size:10px; color:var(--text-light) }\
.ac-dash-grid { display:grid; grid-template-columns:1fr 380px; gap:16px }\
.ac-dash-left, .ac-dash-right { display:flex; flex-direction:column; gap:16px }\
.ac-card { background:var(--card); border-radius:12px; border:1px solid var(--border); padding:20px }\
.ac-card-title { font-size:13px; font-weight:600; color:var(--text); margin-bottom:14px }\
.ac-mix-bar { display:flex; gap:2px; border-radius:8px; overflow:hidden; height:32px; margin-bottom:12px }\
.ac-mix-seg { display:flex; align-items:center; justify-content:center; color:#fff; font-size:11px; font-weight:600 }\
.ac-mix-legends { display:flex; gap:20px }\
.ac-mix-legend { display:flex; align-items:center; gap:6px; font-size:11.5px; color:var(--text-muted) }\
.ac-mix-dot { width:8px; height:8px; border-radius:50% }\
.ac-cat-bar-row { display:flex; align-items:center; gap:12px; margin-bottom:10px }\
.ac-cat-bar-icon { width:28px; height:28px; border-radius:7px; background:rgba(124,58,237,0.06); display:flex; align-items:center; justify-content:center }\
.ac-cat-bar-name { width:130px; font-size:12px; font-weight:500; color:var(--text) }\
.ac-cat-bar-track { flex:1; height:8px; background:var(--bg); border-radius:4px; overflow:hidden }\
.ac-cat-bar-fill { height:100%; background:linear-gradient(90deg,#7c3aed,#6d28d9); border-radius:4px; transition:width .5s ease }\
.ac-cat-bar-count { font-size:11px; color:var(--text-muted); min-width:40px; text-align:right }\
.ac-task-row { display:flex; align-items:center; gap:10px; padding:9px 0 }\
.ac-task-row.bordered { border-bottom:1px solid var(--bg) }\
.ac-task-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0 }\
.ac-task-name { flex:1; font-size:12px; color:var(--text); font-weight:500 }\
.ac-task-cat { font-size:10px; color:var(--text-muted); padding:2px 8px; background:var(--bg); border-radius:6px }\
.ac-task-time { font-size:11px; color:var(--text-light); min-width:36px; text-align:right }\
\
/* Escalation cards */\
.ac-esc-card { padding:14px 16px; border-radius:12px; border:1px solid; margin-bottom:10px; transition:all .25s ease }\
.ac-esc-header { display:flex; align-items:start; gap:8px; margin-bottom:10px }\
.ac-esc-dot { width:8px; height:8px; border-radius:50%; margin-top:5px; flex-shrink:0 }\
.ac-esc-info { flex:1 }\
.ac-esc-text { font-size:12.5px; color:var(--text); font-weight:500; line-height:1.4 }\
.ac-esc-time { font-size:11px; color:var(--text-muted); margin-top:3px }\
.ac-esc-resolved { display:flex; align-items:center; gap:6px; padding:8px 10px; border-radius:8px; font-size:11.5px; font-weight:600; margin-top:4px; animation:acFadeIn .3s ease }\
.ac-esc-note { margin-top:8px; padding:8px 10px; border-radius:8px; background:var(--bg); font-size:11.5px; color:var(--text-muted); font-style:italic; line-height:1.4 }\
.ac-esc-actions { display:flex; gap:6px }\
.ac-esc-btn { flex:1; padding:8px 0; border-radius:8px; border:none; font-size:11.5px; font-weight:600; cursor:pointer; font-family:inherit; display:flex; align-items:center; justify-content:center; gap:5px; transition:all .15s ease }\
.ac-esc-btn.wider { flex:1.3 }\
.ac-esc-btn:hover { filter:brightness(0.95) }\
.ac-esc-badge { background:#ef4444; color:#fff; font-size:10px; font-weight:700; padding:2px 7px; border-radius:10px }\
.ac-handle-textarea { width:100%; border:1px solid var(--border); border-radius:8px; padding:8px 10px; font-size:12px; font-family:inherit; outline:none; resize:none; color:var(--text); margin-bottom:8px; line-height:1.5 }\
.ac-handle-btns { display:flex; gap:8px }\
.ac-handle-confirm { flex:1; padding:7px 0; border-radius:8px; border:none; font-size:11.5px; font-weight:600; background:#2563eb; color:#fff; cursor:pointer; font-family:inherit }\
.ac-handle-cancel { padding:7px 14px; border-radius:8px; border:1px solid var(--border); background:var(--card); font-size:11.5px; font-weight:500; color:var(--text-muted); cursor:pointer; font-family:inherit }\
\
/* Responsive */\
@media(max-width:1024px) {\
  .ac-kpi-row { grid-template-columns:repeat(2,1fr) }\
  .ac-dash-grid { grid-template-columns:1fr }\
  .ac-stats-row { flex-wrap:wrap }\
  .ac-stat-card { min-width:calc(50% - 6px) }\
}\
@media(max-width:640px) {\
  .ac-header { padding:12px 16px; flex-direction:column; align-items:stretch }\
  .ac-tabs-wrap { margin-left:0 }\
  .ac-kpi-row { grid-template-columns:1fr 1fr }\
  .ac-content { padding:16px }\
  .ac-chat-wrap { height:calc(100vh - 260px) }\
  .ac-esc-actions { flex-wrap:wrap }\
  .ac-esc-btn { min-width:calc(50% - 3px) }\
}\
';
  document.head.appendChild(s);
}

/* ═══════════════════════════════════════════════════════════════
   FLOATING CHAT BUBBLE — L1 Support (available on all pages)
   ═══════════════════════════════════════════════════════════════ */
var AC_FLOAT_OPEN = false;

function renderFloatingChat() {
  injectACStyles();
  injectFloatStyles();
  /* Remove previous if any */
  var old = document.getElementById('ac-float-root');
  if (old) old.remove();

  var root = document.createElement('div');
  root.id = 'ac-float-root';

  root.innerHTML =
    '<button class="ac-float-btn" id="ac-float-toggle" title="L1 Support Agent">' +
      _acSvg('M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', 22, '#fff', 1.8) +
    '</button>' +
    '<div class="ac-float-badge" id="ac-float-badge">1</div>' +
    '<div class="ac-float-window' + (AC_FLOAT_OPEN ? ' open' : '') + '" id="ac-float-window">' +
      '<div class="ac-float-header">' +
        '<div class="ac-float-header-icon">' + _acSvg('M13 10V3L4 14h7v7l9-11h-7z', 16, '#fff', 2) + '</div>' +
        '<div class="ac-float-header-info"><div class="ac-float-header-title">L1 Support Agent</div>' +
        '<div class="ac-float-header-status"><span class="ac-float-status-dot"></span>Online — Policy-aware</div></div>' +
        '<button class="ac-float-minimize" id="ac-float-close">' + _acSvg('M5 12h14', 14, '#fff', 2) + '</button>' +
      '</div>' +
      '<div class="ac-float-body" id="ac-float-body"></div>' +
    '</div>';

  document.body.appendChild(root);

  document.getElementById('ac-float-toggle').addEventListener('click', function() {
    AC_FLOAT_OPEN = !AC_FLOAT_OPEN;
    var win = document.getElementById('ac-float-window');
    var badge = document.getElementById('ac-float-badge');
    if (AC_FLOAT_OPEN) {
      win.classList.add('open');
      if (badge) badge.style.display = 'none';
      acRenderChat(document.getElementById('ac-float-body'));
    } else {
      win.classList.remove('open');
    }
  });
  document.getElementById('ac-float-close').addEventListener('click', function() {
    AC_FLOAT_OPEN = false;
    document.getElementById('ac-float-window').classList.remove('open');
  });

  if (AC_FLOAT_OPEN) {
    document.getElementById('ac-float-badge').style.display = 'none';
    acRenderChat(document.getElementById('ac-float-body'));
  }
}

function injectFloatStyles() {
  if (document.getElementById('ac-float-styles')) return;
  var s = document.createElement('style');
  s.id = 'ac-float-styles';
  s.textContent = '\
#ac-float-root { position:fixed; bottom:20px; right:20px; z-index:9990 }\
.ac-float-btn { width:54px; height:54px; border-radius:50%; border:none; background:linear-gradient(135deg,#7c3aed,#6d28d9); color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(124,58,237,0.4),0 2px 8px rgba(0,0,0,0.15); transition:all .3s cubic-bezier(.34,1.56,.64,1); position:relative; z-index:2 }\
.ac-float-btn:hover { transform:scale(1.08); box-shadow:0 6px 28px rgba(124,58,237,0.5),0 3px 10px rgba(0,0,0,0.18) }\
.ac-float-badge { position:absolute; bottom:44px; right:-2px; z-index:3; width:18px; height:18px; border-radius:50%; background:#ef4444; color:#fff; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(239,68,68,0.4); animation:acPulseBadge 2s infinite }\
@keyframes acPulseBadge { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }\
.ac-float-window { position:absolute; bottom:66px; right:0; width:400px; height:540px; border-radius:16px; background:var(--card,#fff); box-shadow:0 20px 60px rgba(0,0,0,0.15),0 4px 20px rgba(124,58,237,0.1); display:flex; flex-direction:column; overflow:hidden; opacity:0; transform:translateY(20px) scale(.95); pointer-events:none; transition:all .3s cubic-bezier(.34,1.56,.64,1); border:1px solid rgba(124,58,237,0.1) }\
.ac-float-window.open { opacity:1; transform:translateY(0) scale(1); pointer-events:auto }\
.ac-float-header { background:linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%); padding:12px 14px; color:#fff; display:flex; align-items:center; gap:10px; flex-shrink:0 }\
.ac-float-header-icon { width:32px; height:32px; border-radius:9px; background:rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; flex-shrink:0 }\
.ac-float-header-info { flex:1 }\
.ac-float-header-title { font-weight:700; font-size:13.5px; letter-spacing:-0.2px }\
.ac-float-header-status { font-size:10.5px; opacity:0.8; display:flex; align-items:center; gap:4px }\
.ac-float-status-dot { width:6px; height:6px; border-radius:50%; background:#4ade80; display:inline-block }\
.ac-float-minimize { background:rgba(255,255,255,0.15); border:none; color:#fff; cursor:pointer; border-radius:7px; width:28px; height:28px; display:flex; align-items:center; justify-content:center; transition:background .15s }\
.ac-float-minimize:hover { background:rgba(255,255,255,0.25) }\
.ac-float-body { flex:1; display:flex; flex-direction:column; overflow:hidden; background:var(--bg,#f0f2f5) }\
.ac-float-messages { flex:1; overflow-y:auto; padding:12px 14px; display:flex; flex-direction:column; gap:8px }\
.ac-float-body .ac-bubble { max-width:85%; font-size:12.5px; padding:9px 13px }\
.ac-float-body .ac-suggestions { padding:6px 12px; gap:6px; margin-bottom:0; border-top:1px solid var(--border,#e8eaed); background:var(--bg,#f0f2f5) }\
.ac-float-body .ac-suggest-btn { font-size:11px; padding:5px 10px }\
.ac-float-body .ac-chat-input-wrap { margin:0 10px 10px; border-radius:12px }\
@media(max-width:640px) {\
  #ac-float-root { bottom:12px; right:12px }\
  .ac-float-window { width:calc(100vw - 24px); height:calc(100vh - 120px); right:-4px; bottom:62px; border-radius:14px }\
}\
';
  document.head.appendChild(s);
}
