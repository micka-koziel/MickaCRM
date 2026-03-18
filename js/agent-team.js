/* ═══════════════════════════════════════════════════════════════
   agent-team.js — AI Agent Team V2
   Floating multi-agent panel available on ALL pages
   5 agents, 23 commands, professional SVG avatars
   Vanilla JS — MickaCRM v4 design system
   ═══════════════════════════════════════════════════════════════ */

/* ── Agent Definitions ────────────────────────────────────── */
var AT_AGENTS = [
  {
    id:'nora', name:'Nora Leclerc', role:'Data Analyst', title:'Chief Data Officer',
    specialty:'Data Quality', color:'#0ea5e9', accent:'#0284c7',
    greeting:'Hello! I\'m Nora, your Data Quality expert. I keep your CRM clean, complete and reliable. What can I help you with?',
    skills:['Duplicate Detection','Orphan Accounts','Field Completion Audit'],
    keywords:['data','donnée','kpi','qualité','quality','doublon','duplicate','merge','fusionner','champ','vide','missing','incomplet','orphelin','orphan','complétion','completion','non-completed','remplissage'],
    stats:{resolved:847,rating:4.9,avgTime:'2m 14s'}
  },
  {
    id:'hugo', name:'Hugo Martin', role:'Support L1', title:'Customer Success Lead',
    specialty:'Support & Assistance', color:'#8b5cf6', accent:'#7c3aed',
    greeting:'Hey! Hugo here, your L1 support. Describe your request and I\'ll handle it!',
    skills:['User Management','Field Administration','Password Reset'],
    keywords:['aide','help','user','utilisateur','créer','create','désactiv','deactivat','password','mot de passe','reset','role','rôle','champ','field','ajouter','supprimer','delete'],
    stats:{resolved:2341,rating:4.7,avgTime:'45s'}
  },
  {
    id:'karim', name:'Karim Benzarti', role:'Cybersecurity Expert', title:'Security Ops Lead',
    specialty:'Security & Compliance', color:'#ef4444', accent:'#dc2626',
    greeting:'Karim, Security. What\'s your security concern?',
    skills:['Audit Logs','Inactive Users','Login Monitoring','GDPR Compliance'],
    keywords:['sécurité','security','rgpd','gdpr','audit','login','connexion','inactif','inactive','sensible','sensitive','données personnelles','personal data'],
    stats:{resolved:412,rating:4.95,avgTime:'5m 30s'}
  },
  {
    id:'camille', name:'Camille Dubois', role:'Business Strategist', title:'Revenue Ops Lead',
    specialty:'Business Intelligence', color:'#f59e0b', accent:'#d97706',
    greeting:'Camille here. What commercial objective are you targeting?',
    skills:['Deal Risk Analysis','Next Best Action','Win Rate','Conversion Funnel'],
    keywords:['business','commercial','pipeline','opportunit','deal','risk','risque','win','conversion','funnel','entonnoir','action','revenue','chiffre'],
    stats:{resolved:623,rating:4.8,avgTime:'3m 45s'}
  },
  {
    id:'leo', name:'Léo Fournier', role:'CRM Trainer', title:'Learning & Adoption Lead',
    specialty:'Training & Adoption', color:'#10b981', accent:'#059669',
    greeting:'Hi! Léo here, your CRM coach. What would you like to learn today?',
    skills:['Onboarding Tours','Quizzes','Gamification','Tips & Tricks'],
    keywords:['formation','training','apprendre','learn','tuto','quiz','score','challenge','astuce','tip','leaderboard','classement','tour','onboarding','défi'],
    stats:{resolved:1156,rating:4.85,avgTime:'4m 10s'}
  }
];

/* ── State ─────────────────────────────────────────────────── */
var AT_OPEN = false;
var AT_VIEW = 'team';
var AT_ACTIVE_AGENT = null;
var AT_MESSAGES = {};
var AT_LOADING = false;
var AT_UNREAD = 1;

/* ── Professional SVG Avatar Generator ─────────────────────── */
function atMangaAvatar(agentId, size) {
  size = size || 80;
  /* Photo-based avatars from assets/ folder */
  var photos = {
    nora: 'assets/Nora.png',
    hugo: 'assets/Hugo.png',
    karim: 'assets/Karim.png',
    camille: 'assets/Camille.png',
    leo: 'assets/Leo.png'
  };
  var src = photos[agentId];
  if (!src) return '<div style="width:'+size+'px;height:'+size+'px;border-radius:50%;background:#ddd"></div>';
  return '<img src="'+src+'" alt="'+agentId+'" width="'+size+'" height="'+size+'" style="width:'+size+'px;height:'+size+'px;border-radius:50%;object-fit:cover;display:block" />';
}

/* ── Smart Agent Routing ──────────────────────────────────── */
function atDetectBestAgent(msg) {
  var lower = msg.toLowerCase();
  var scores = AT_AGENTS.map(function(a) {
    var score = 0;
    a.keywords.forEach(function(kw) { if (lower.indexOf(kw) >= 0) score++; });
    return { agent:a, score:score };
  });
  scores.sort(function(a,b) { return b.score - a.score; });
  return scores[0].score > 0 ? scores[0].agent : null;
}

/* ── Command-based Suggestions per Agent ──────────────────── */
function atGetSuggestions(agentId) {
  var map = {
    nora: ['Merge duplicates', 'Orphan accounts', 'Non-completed fields'],
    hugo: ['Create a user', 'Deactivate a user', 'Reset password', 'Change role', 'New field creation', 'Delete a field'],
    karim: ['Audit log viewer', 'Inactive users scan', 'Login activity', 'Sensitive data exposure'],
    camille: ['Top deals at risk', 'Next best action', 'Win rate analysis', 'Conversion funnel'],
    leo: ['CRM Tour', 'Quiz me', 'My score', 'Daily challenge', 'Tips & tricks', 'Leaderboard']
  };
  return (map[agentId] || []);
}

/* ── Render: Floating Root ────────────────────────────────── */
function renderAgentTeamFloat() {
  injectATStyles();

  var old = document.getElementById('at-float-root');
  if (old) old.remove();

  var root = document.createElement('div');
  root.id = 'at-float-root';

  root.innerHTML =
    '<button class="at-fab" id="at-fab" title="Agent Team">' +
      '<div class="at-fab-stack">' +
        AT_AGENTS.slice(0,3).map(function(a,i) {
          return '<div class="at-fab-mini" style="z-index:'+(3-i)+';margin-left:'+(i>0?'-8':'0')+'px;border-color:'+a.color+'">' +
            atMangaAvatar(a.id, 28) + '</div>';
        }).join('') +
      '</div>' +
    '</button>' +
    (AT_UNREAD > 0 ? '<div class="at-fab-badge" id="at-fab-badge">'+AT_UNREAD+'</div>' : '') +
    '<div class="at-window'+(AT_OPEN?' open':'')+'" id="at-window">' +
      '<div id="at-window-content" style="flex:1;display:flex;flex-direction:column;overflow:hidden"></div>' +
    '</div>';

  document.body.appendChild(root);

  document.getElementById('at-fab').addEventListener('click', function() {
    AT_OPEN = !AT_OPEN;
    var win = document.getElementById('at-window');
    var badge = document.getElementById('at-fab-badge');
    if (AT_OPEN) {
      win.classList.add('open');
      if (badge) badge.style.display = 'none';
      AT_UNREAD = 0;
      atRenderContent();
    } else {
      win.classList.remove('open');
    }
  });

  if (AT_OPEN) {
    var badge = document.getElementById('at-fab-badge');
    if (badge) badge.style.display = 'none';
    atRenderContent();
  }
}

/* ── Render Content (team list or chat) ───────────────────── */
function atRenderContent() {
  var el = document.getElementById('at-window-content');
  if (!el) return;
  if (AT_VIEW === 'chat' && AT_ACTIVE_AGENT) {
    atRenderChat(el);
  } else {
    atRenderTeam(el);
  }
}

/* ── Team Selector View ───────────────────────────────────── */
function atRenderTeam(el) {
  var html =
    '<div class="at-team-header">' +
      '<div class="at-team-header-title">Agent Team</div>' +
      '<div class="at-team-header-sub">5 AI experts — 23 commands</div>' +
      '<button class="at-close-btn" onclick="AT_OPEN=false;document.getElementById(\'at-window\').classList.remove(\'open\')">'+svgIcon('x',14)+'</button>' +
    '</div>' +
    '<div class="at-team-list">';

  AT_AGENTS.forEach(function(a) {
    var msgCount = (AT_MESSAGES[a.id] || []).length;
    var hasHistory = msgCount > 0;
    html +=
      '<div class="at-agent-card" onclick="atOpenChat(\''+a.id+'\')">' +
        '<div class="at-agent-avatar" style="border-color:'+a.color+'">' +
          atMangaAvatar(a.id, 48) +
          '<div class="at-agent-dot" style="background:'+a.color+'"></div>' +
        '</div>' +
        '<div class="at-agent-info">' +
          '<div class="at-agent-name">'+a.name+'</div>' +
          '<div class="at-agent-spec" style="color:'+a.color+'">'+a.specialty+'</div>' +
          '<div class="at-agent-role">'+a.cmdsCount()+' commands</div>' +
        '</div>' +
        '<div class="at-agent-meta">' +
          '<div class="at-agent-rating">'+a.stats.rating+'</div>' +
          (hasHistory ? '<div class="at-agent-badge" style="background:'+a.color+'">'+msgCount+'</div>' : '') +
        '</div>' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="'+a.color+'" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>' +
      '</div>';
  });

  html += '</div>';

  /* Quick ask bar at bottom */
  html += '<div class="at-quick-bar">' +
    '<input type="text" id="at-quick-input" class="at-quick-input" placeholder="Ask any agent..." />' +
    '<button class="at-quick-send" id="at-quick-send">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>' +
    '</button>' +
  '</div>';

  el.innerHTML = html;

  var quickInput = document.getElementById('at-quick-input');
  var quickSend = document.getElementById('at-quick-send');
  if (quickInput && quickSend) {
    quickSend.addEventListener('click', function() { atQuickAsk(); });
    quickInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); atQuickAsk(); }
    });
  }
}

/* Helper: count commands per agent */
AT_AGENTS.forEach(function(a) {
  a.cmdsCount = function() {
    return atGetSuggestions(a.id).length;
  };
});

function atQuickAsk() {
  var input = document.getElementById('at-quick-input');
  if (!input) return;
  var msg = input.value.trim();
  if (!msg) return;
  var best = atDetectBestAgent(msg);
  if (!best) best = AT_AGENTS[1]; /* default Hugo */
  atOpenChat(best.id);
  setTimeout(function() {
    var chatInput = document.getElementById('at-chat-input');
    if (chatInput) {
      chatInput.value = msg;
      atSendMessage();
    }
  }, 100);
}

/* ── Open Chat with Agent ─────────────────────────────────── */
function atOpenChat(agentId) {
  AT_ACTIVE_AGENT = AT_AGENTS.find(function(a) { return a.id === agentId; });
  AT_VIEW = 'chat';
  if (!AT_MESSAGES[agentId]) {
    AT_MESSAGES[agentId] = [
      { role:'agent', text: AT_ACTIVE_AGENT.greeting }
    ];
  }
  atRenderContent();
}

/* ── Chat View ────────────────────────────────────────────── */
function atRenderChat(el) {
  var a = AT_ACTIVE_AGENT;
  if (!a) return;
  var msgs = AT_MESSAGES[a.id] || [];

  var html = '<div style="display:flex;flex-direction:column;height:100%;overflow:hidden">';

  /* Header */
  html +=
    '<div class="at-chat-header" style="background:linear-gradient(135deg,'+a.color+','+a.accent+')">' +
      '<button class="at-back-btn" onclick="AT_VIEW=\'team\';AT_ACTIVE_AGENT=null;atRenderContent()">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>' +
      '</button>' +
      '<div class="at-chat-avatar">' + atMangaAvatar(a.id, 40) + '</div>' +
      '<div class="at-chat-hinfo">' +
        '<div class="at-chat-hname">'+a.name+'</div>' +
        '<div class="at-chat-hrole">'+a.specialty+' — Online</div>' +
      '</div>' +
      '<button class="at-close-btn" style="color:#fff" onclick="AT_OPEN=false;document.getElementById(\'at-window\').classList.remove(\'open\')">'+svgIcon('x',14,'#fff')+'</button>' +
    '</div>';

  /* Messages */
  html += '<div class="at-messages" id="at-msg-scroll">';
  msgs.forEach(function(m) {
    var isUser = m.role === 'user';
    html += '<div class="at-msg '+(isUser?'at-msg-user':'at-msg-agent')+'">';
    if (!isUser) {
      html += '<div class="at-msg-avi">' + atMangaAvatar(a.id, 28) + '</div>';
    }
    html += '<div class="at-bubble '+(isUser?'at-bubble-user':'at-bubble-agent')+'" style="'+(isUser?'background:'+a.color+';color:#fff':'')+'">' + atFormatMsg(m.text, isUser) + '</div>';
    html += '</div>';
  });
  if (AT_LOADING) {
    html += '<div class="at-msg at-msg-agent"><div class="at-msg-avi">' + atMangaAvatar(a.id, 28) + '</div>' +
      '<div class="at-typing"><span></span><span></span><span></span></div></div>';
  }
  html += '<div id="at-msg-bottom"></div></div>';

  /* Suggestions (command buttons) */
  var suggestions = atGetSuggestions(a.id);
  html += '<div class="at-suggestions">';
  suggestions.forEach(function(s) {
    html += '<button class="at-suggest" onclick="atAutoSend(this.textContent)">'+s+'</button>';
  });
  html += '</div>';

  /* Input */
  html += '<div class="at-input-wrap">' +
    '<textarea id="at-chat-input" class="at-input" placeholder="Ask '+a.name.split(' ')[0]+'..." rows="1"></textarea>' +
    '<button class="at-send" id="at-send-btn" onclick="atSendMessage()">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>' +
    '</button>' +
  '</div>';

  html += '</div>';

  el.innerHTML = html;

  var input = document.getElementById('at-chat-input');
  if (input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); atSendMessage(); }
    });
  }

  var scroll = document.getElementById('at-msg-scroll');
  if (scroll) scroll.scrollTop = scroll.scrollHeight;
}

function atFormatMsg(text, isUser) {
  if (isUser) return '<span>' + text.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</span>';
  var parts = text.split(/(%%HTML%%[\s\S]*?%%\/HTML%%)/);
  return parts.map(function(part) {
    if (part.indexOf('%%HTML%%') === 0) return part.replace('%%HTML%%','').replace('%%/HTML%%','');
    return part.replace(/</g,'&lt;').replace(/>/g,'&gt;').split('\n').map(function(line) {
      if (line.indexOf('OK') === 0) return '<span style="color:#10b981;font-weight:600">' + line + '</span>';
      return '<span>' + line + '</span>';
    }).join('<br>');
  }).join('');
}

/* ── Send Message ─────────────────────────────────────────── */
function atSendMessage() {
  var input = document.getElementById('at-chat-input');
  if (!input) return;
  var msg = input.value.trim();
  if (!msg || AT_LOADING || !AT_ACTIVE_AGENT) return;

  var agentId = AT_ACTIVE_AGENT.id;
  AT_MESSAGES[agentId].push({ role:'user', text:msg });
  AT_LOADING = true;
  atRenderChat(document.getElementById('at-window-content'));

  var delay = 600 + Math.random() * 1000;
  setTimeout(function() {
    var response;
    if (typeof acMatchScenario === 'function') {
      response = acMatchScenario(msg);
    } else {
      response = atLocalResponse(msg, agentId);
    }

    if (response && typeof response.then === 'function') {
      response.then(function(r) { atFinishMessage(r, agentId); })
        .catch(function() { atFinishMessage('An error occurred. Please try again.', agentId); });
    } else {
      atFinishMessage(response, agentId);
    }
  }, delay);
}

function atFinishMessage(response, agentId) {
  AT_MESSAGES[agentId].push({ role:'agent', text:response });

  if (response.indexOf('[ESCALADE]') >= 0 && typeof AC_NOTIFICATIONS !== 'undefined') {
    var match = response.match(/\[ESCALADE\]\s*(.+?)(?:\n|$)/);
    var escText = match ? match[1].trim() : 'Escalation from '+AT_ACTIVE_AGENT.name;
    AC_NOTIFICATIONS.unshift({ id:'n'+Date.now(), text:escText, time:'Just now', status:'pending', resolution:'' });
    if (typeof acShowToast === 'function') acShowToast('Escalation', escText, '#ef4444');
  }

  AT_LOADING = false;
  atRenderChat(document.getElementById('at-window-content'));
}

function atAutoSend(text) {
  if (!text || AT_LOADING || !AT_ACTIVE_AGENT) return;
  var input = document.getElementById('at-chat-input');
  if (input) input.value = text;
  atSendMessage();
}

function atLocalResponse(msg, agentId) {
  var a = AT_AGENTS.find(function(ag) { return ag.id === agentId; });
  return 'Thank you for your question! As ' + a.name + ' (' + a.specialty + '), I\'m analyzing your request. ' +
    'In the full version, I would provide a detailed response based on your CRM data.\n\n' +
    'My expertise covers: ' + a.skills.join(', ') + '.';
}

/* ── Context-Aware Auto-Suggest ───────────────────────────── */
function atSuggestAgentForPage(page) {
  var map = {
    home: 'nora',
    opportunities: 'camille',
    leads: 'camille',
    accounts: 'camille',
    contacts: 'camille',
    projects: 'hugo',
    claims: 'karim',
    activities: 'leo',
    calendar: 'leo',
    quotes: 'camille',
    agentConsole: 'karim'
  };
  return map[page] || 'hugo';
}

/* ── Styles ───────────────────────────────────────────────── */
function injectATStyles() {
  if (document.getElementById('at-float-styles')) return;
  var s = document.createElement('style');
  s.id = 'at-float-styles';
  s.textContent = '\
#at-float-root{position:fixed;bottom:20px;right:20px;z-index:9990;font-family:"DM Sans",sans-serif}\
.at-fab{width:60px;height:60px;border-radius:50%;border:none;background:linear-gradient(135deg,#0f172a,#1e293b);cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(0,0,0,.25),0 0 0 3px rgba(255,255,255,.1);transition:all .3s cubic-bezier(.34,1.56,.64,1);position:relative;z-index:2;padding:0}\
.at-fab:hover{transform:scale(1.08);box-shadow:0 6px 32px rgba(0,0,0,.35),0 0 0 3px rgba(255,255,255,.15)}\
.at-fab-stack{display:flex;align-items:center;justify-content:center}\
.at-fab-mini{width:28px;height:28px;border-radius:50%;overflow:hidden;border:2px solid;flex-shrink:0}\
.at-fab-badge{position:absolute;bottom:46px;right:-2px;z-index:3;min-width:18px;height:18px;border-radius:9px;background:#ef4444;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(239,68,68,.4);animation:atPulse 2s infinite;padding:0 4px}\
@keyframes atPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}\
.at-window{position:absolute;bottom:72px;right:0;width:420px;height:580px;border-radius:20px;background:#fff;box-shadow:0 25px 60px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.04);display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(20px) scale(.95);pointer-events:none;transition:all .3s cubic-bezier(.34,1.56,.64,1)}\
.at-window.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}\
\
.at-team-header{background:linear-gradient(135deg,#0f172a,#1e293b);padding:20px 20px 16px;position:relative}\
.at-team-header-title{color:#fff;font-size:17px;font-weight:700;letter-spacing:-.3px}\
.at-team-header-sub{color:#94a3b8;font-size:12px;margin-top:2px}\
.at-close-btn{position:absolute;top:16px;right:16px;background:rgba(255,255,255,.1);border:none;color:#94a3b8;cursor:pointer;border-radius:8px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;transition:background .15s}\
.at-close-btn:hover{background:rgba(255,255,255,.2)}\
\
.at-team-list{flex:1;overflow-y:auto;padding:8px 12px}\
.at-agent-card{display:flex;align-items:center;gap:12px;padding:12px;border-radius:14px;cursor:pointer;transition:all .2s;border:1px solid transparent;margin-bottom:4px}\
.at-agent-card:hover{background:#f8fafc;border-color:#e2e8f0;transform:translateX(2px)}\
.at-agent-avatar{position:relative;width:48px;height:48px;border-radius:50%;overflow:hidden;border:2px solid;flex-shrink:0}\
.at-agent-dot{position:absolute;bottom:1px;right:1px;width:10px;height:10px;border-radius:50%;border:2px solid #fff}\
.at-agent-info{flex:1;min-width:0}\
.at-agent-name{font-weight:700;font-size:13.5px;color:#0f172a}\
.at-agent-spec{font-size:11px;font-weight:600}\
.at-agent-role{font-size:11px;color:#94a3b8}\
.at-agent-meta{text-align:right;flex-shrink:0}\
.at-agent-rating{font-size:11px;color:#f59e0b;font-weight:600}\
.at-agent-rating::before{content:"\\2605 "}\
.at-agent-badge{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;border-radius:9px;color:#fff;font-size:10px;font-weight:700;margin-top:4px;padding:0 5px}\
\
.at-quick-bar{display:flex;gap:8px;padding:10px 14px;border-top:1px solid #e8eaed;background:#f8fafc}\
.at-quick-input{flex:1;border:1px solid #e2e8f0;border-radius:12px;padding:9px 14px;font-size:12.5px;outline:none;font-family:inherit;transition:border-color .2s;background:#fff}\
.at-quick-input:focus{border-color:#2563eb}\
.at-quick-send{width:36px;height:36px;border-radius:10px;border:none;background:#0f172a;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s;flex-shrink:0}\
.at-quick-send:hover{background:#1e293b}\
\
.at-chat-header{padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0}\
.at-back-btn{background:rgba(255,255,255,.15);border:none;cursor:pointer;border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;transition:background .15s;flex-shrink:0}\
.at-back-btn:hover{background:rgba(255,255,255,.25)}\
.at-chat-avatar{width:40px;height:40px;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,.3);flex-shrink:0}\
.at-chat-hinfo{flex:1}\
.at-chat-hname{color:#fff;font-weight:700;font-size:14px}\
.at-chat-hrole{color:rgba(255,255,255,.7);font-size:11px}\
\
.at-messages{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px 14px;display:flex;flex-direction:column;gap:8px;background:#f8fafc}\
.at-msg{display:flex;gap:8px;align-items:flex-start}\
.at-msg-user{justify-content:flex-end}\
.at-msg-agent{justify-content:flex-start;max-width:100%}\
.at-msg-avi{width:28px;height:28px;border-radius:50%;overflow:hidden;flex-shrink:0;margin-top:4px}\
.at-bubble{max-width:82%;padding:10px 14px;font-size:12.5px;line-height:1.55;border-radius:16px;word-wrap:break-word;overflow-wrap:break-word}\
.at-bubble-agent{background:#fff;color:#1e293b;border-radius:16px 16px 16px 4px;box-shadow:0 1px 3px rgba(0,0,0,.04);border:1px solid #e8eaed;max-width:92%}\
.at-bubble-user{border-radius:16px 16px 4px 16px}\
.at-typing{display:flex;gap:4px;padding:10px 14px;background:#fff;border-radius:16px;border:1px solid #e8eaed}\
.at-typing span{width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:atBounce 1.2s infinite}\
.at-typing span:nth-child(2){animation-delay:.2s}\
.at-typing span:nth-child(3){animation-delay:.4s}\
@keyframes atBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}\
\
.at-suggestions{display:flex;flex-wrap:wrap;gap:6px;padding:8px 14px;border-top:1px solid #f0f2f5;background:#fff;flex-shrink:0}\
.at-suggest{background:#f0f2f5;border:1px solid #e8eaed;color:#475569;padding:5px 11px;border-radius:20px;font-size:11px;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap}\
.at-suggest:hover{background:#e2e8f0;border-color:#cbd5e1}\
\
.at-input-wrap{display:flex;gap:8px;padding:10px 14px;border-top:1px solid #e8eaed;background:#fff;align-items:flex-end;flex-shrink:0}\
.at-input{flex:1;border:1px solid #e2e8f0;border-radius:14px;padding:9px 14px;font-size:12.5px;outline:none;font-family:inherit;resize:none;max-height:80px;line-height:1.4;transition:border-color .2s}\
.at-input:focus{border-color:#2563eb}\
.at-send{width:36px;height:36px;border-radius:10px;border:none;background:#0f172a;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}\
.at-send:hover{background:#1e293b}\
\
@media(max-width:640px){\
  #at-float-root{bottom:12px;right:12px}\
  .at-window{width:calc(100vw - 24px);height:calc(100vh - 100px);right:-4px;bottom:68px;border-radius:16px}\
}\
';
  document.head.appendChild(s);
}

/* ── Override renderFloatingChat ──────────────────────────── */
var _origRenderFloatingChat = typeof renderFloatingChat === 'function' ? renderFloatingChat : null;

function renderFloatingChat() {
  var oldFloat = document.getElementById('ac-float-root');
  if (oldFloat) oldFloat.remove();
  renderAgentTeamFloat();
}
