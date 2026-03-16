/* ═══════════════════════════════════════════════════════════════
   agent-team.js — AI Agent Team with Manga Avatars
   Floating multi-agent panel available on ALL pages
   Replaces single L1 chat bubble with 5-agent team selector
   Vanilla JS — MickaCRM v4 design system
   ═══════════════════════════════════════════════════════════════ */

/* ── Agent Definitions ────────────────────────────────────── */
var AT_AGENTS = [
  {
    id:'nora', name:'Nora Leclerc', role:'Data Analyst', title:'Chief Data Officer',
    specialty:'Data Quality', color:'#0ea5e9', accent:'#0284c7',
    greeting:'Bonjour Mickaël ! Je suis Nora, votre experte Data Quality. Je veille à ce que votre CRM reste propre, complet et fiable. Dites-moi ce dont vous avez besoin !',
    skills:['Duplicate Detection','Missing Fields Audit','Data Cleansing','Integrity Checks'],
    keywords:['data','donnée','kpi','qualité','quality','chiffre','doublon','duplicate','merge','fusionner','champ','vide','missing','incomplet','format','adresse','phone','standardis','enrichi','enrich','supprimer','archiver','delete','obsolete','export','csv','nettoyage','orphelin','périmé','expired','audit','manquant','correction','nettoyer'],
    stats:{resolved:847,rating:4.9,avgTime:'2m 14s'}
  },
  {
    id:'hugo', name:'Hugo Martin', role:'Support L1', title:'Customer Success Lead',
    specialty:'Support & Assistance', color:'#8b5cf6', accent:'#7c3aed',
    greeting:'Hey ! Hugo ici, votre support L1. Decrivez votre probleme et je m\'en occupe !',
    skills:['Troubleshooting','User Guidance','Ticket Routing','Quick Fixes'],
    keywords:['aide','help','problème','problem','bug','erreur','error','bloqué','stuck','comment','how','marche pas','fonctionne pas','comprend pas','expliqu','tutoriel','guide','crm','objet','champ custom','custom field','ajouter champ','workflow','automation','page layout'],
    stats:{resolved:2341,rating:4.7,avgTime:'45s'}
  },
  {
    id:'karim', name:'Karim Benzarti', role:'Cybersecurity Expert', title:'Security Ops Lead',
    specialty:'Cybersecurite', color:'#ef4444', accent:'#dc2626',
    greeting:'Karim, cybersecurite. Quel est le perimetre de votre question securite ?',
    skills:['Access Control','RGPD Compliance','Threat Detection','Audit Logs'],
    keywords:['sécurité','security','rgpd','gdpr','permission','accès','access','audit','login','connexion','anomalie','suspect','token','api','révoquer','revoke','mot de passe','password','reset','mdp','désactiv','deactivat','réactiv','activer','utilisateur','user','profil','onboard','nouveau'],
    stats:{resolved:412,rating:4.95,avgTime:'5m 30s'}
  },
  {
    id:'camille', name:'Camille Dubois', role:'Business Strategist', title:'Revenue Ops Lead',
    specialty:'Business & Strategie', color:'#f59e0b', accent:'#d97706',
    greeting:'Camille, votre partenaire business. Quel objectif commercial visez-vous ?',
    skills:['Sales Strategy','Lead Scoring','Pipeline Optimization','Revenue Forecasting'],
    keywords:['business','commercial','vente','stratégie','opportunit','pipeline','lead','prospect','conversion','revenue','forecast','prévision','client','account','contact','deal','affaire','négociation','won','perdu','objectif','target','croissance','growth'],
    stats:{resolved:623,rating:4.8,avgTime:'3m 45s'}
  },
  {
    id:'leo', name:'Leo Fournier', role:'CRM Trainer', title:'Learning & Adoption Lead',
    specialty:'Formation CRM', color:'#10b981', accent:'#059669',
    greeting:'Salut ! Leo, votre formateur CRM. Quelle fonctionnalite voulez-vous maitriser ?',
    skills:['Onboarding','Feature Tutorials','Best Practices','Adoption Tracking'],
    keywords:['formation','training','apprendre','learn','tuto','tutoriel','comment faire','how to','fonctionnalité','feature','astuce','tip','best practice','onboarding','nouveau','débutant','beginner','utiliser','use','navigation','sidebar','dashboard','calendar'],
    stats:{resolved:1156,rating:4.85,avgTime:'4m 10s'}
  }
];

/* ── State ─────────────────────────────────────────────────── */
var AT_OPEN = false;
var AT_VIEW = 'team';        /* 'team' | 'chat' */
var AT_ACTIVE_AGENT = null;  /* current agent object */
var AT_MESSAGES = {};         /* per-agent message history keyed by agent.id */
var AT_LOADING = false;
var AT_UNREAD = 1;

/* ── Manga SVG Avatar Generator ───────────────────────────── */
function atMangaAvatar(agentId, size) {
  size = size || 80;
  var s = 100; /* viewBox 0..100 */

  if (agentId === 'nora') {
    return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+s+' '+s+'">' +
      '<circle cx="50" cy="50" r="49" fill="#E8F4FD"/>' +
      '<ellipse cx="50" cy="54" rx="28" ry="32" fill="#FDDCB5"/>' +
      '<path d="M22 42C22 18,78 18,78 42L78 35C78 12,22 12,22 35Z" fill="#1a2744"/>' +
      '<path d="M22 35C22 38,20 50,22 52" stroke="#1a2744" stroke-width="8" fill="none" stroke-linecap="round"/>' +
      '<path d="M78 35C78 38,80 50,78 52" stroke="#1a2744" stroke-width="8" fill="none" stroke-linecap="round"/>' +
      '<path d="M26 36Q24 48,26 55" stroke="#243356" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M74 36Q76 48,74 55" stroke="#243356" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M30 34Q38 28,42 36Q46 26,54 34Q58 26,62 34Q66 28,70 34" fill="#1a2744"/>' +
      '<ellipse cx="38" cy="52" rx="7" ry="8" fill="#fff"/><ellipse cx="62" cy="52" rx="7" ry="8" fill="#fff"/>' +
      '<ellipse cx="39" cy="53" rx="5" ry="5.5" fill="#0284c7"/><ellipse cx="63" cy="53" rx="5" ry="5.5" fill="#0284c7"/>' +
      '<circle cx="39" cy="53" r="3" fill="#064e7a"/><circle cx="63" cy="53" r="3" fill="#064e7a"/>' +
      '<circle cx="41" cy="50" r="1.8" fill="#fff"/><circle cx="65" cy="50" r="1.8" fill="#fff"/>' +
      '<circle cx="37" cy="55" r=".8" fill="#fff"/><circle cx="61" cy="55" r=".8" fill="#fff"/>' +
      '<path d="M30 43Q38 39,46 43" stroke="#1a2744" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      '<path d="M54 43Q62 39,70 43" stroke="#1a2744" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      '<rect x="28" y="44" width="20" height="16" rx="5" fill="none" stroke="#334155" stroke-width="1.8"/>' +
      '<rect x="52" y="44" width="20" height="16" rx="5" fill="none" stroke="#334155" stroke-width="1.8"/>' +
      '<line x1="48" y1="50" x2="52" y2="50" stroke="#334155" stroke-width="1.5"/>' +
      '<line x1="28" y1="50" x2="24" y2="48" stroke="#334155" stroke-width="1.2"/>' +
      '<line x1="72" y1="50" x2="76" y2="48" stroke="#334155" stroke-width="1.2"/>' +
      '<path d="M48 60Q50 64,52 60" stroke="#e5a882" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
      '<path d="M42 70Q50 76,58 70" stroke="#d4756b" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="34" cy="66" rx="5" ry="3" fill="#f8b4b4" opacity=".3"/>' +
      '<ellipse cx="66" cy="66" rx="5" ry="3" fill="#f8b4b4" opacity=".3"/>' +
    '</svg>';
  }

  if (agentId === 'hugo') {
    return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+s+' '+s+'">' +
      '<circle cx="50" cy="50" r="49" fill="#F3EEFF"/>' +
      '<ellipse cx="50" cy="56" rx="26" ry="30" fill="#F5D5A8"/>' +
      '<path d="M24 40C24 15,76 15,76 40L76 32C76 8,24 8,24 32Z" fill="#4c1d95"/>' +
      '<path d="M28 24L22 10L34 22Z" fill="#4c1d95"/><path d="M42 18L38 4L48 16Z" fill="#5b21b6"/>' +
      '<path d="M56 17L58 2L64 16Z" fill="#4c1d95"/><path d="M68 22L76 8L72 24Z" fill="#5b21b6"/>' +
      '<path d="M34 20L30 8L40 18Z" fill="#5b21b6"/>' +
      '<ellipse cx="24" cy="56" rx="5" ry="7" fill="#F5D5A8"/><ellipse cx="76" cy="56" rx="5" ry="7" fill="#F5D5A8"/>' +
      '<ellipse cx="38" cy="52" rx="7.5" ry="8.5" fill="#fff"/><ellipse cx="62" cy="52" rx="7.5" ry="8.5" fill="#fff"/>' +
      '<ellipse cx="39" cy="53" rx="5.5" ry="6" fill="#7c3aed"/><ellipse cx="63" cy="53" rx="5.5" ry="6" fill="#7c3aed"/>' +
      '<circle cx="39" cy="53" r="3.5" fill="#4c1d95"/><circle cx="63" cy="53" r="3.5" fill="#4c1d95"/>' +
      '<circle cx="41" cy="50" r="2" fill="#fff"/><circle cx="65" cy="50" r="2" fill="#fff"/>' +
      '<circle cx="37" cy="55" r="1" fill="#fff"/><circle cx="61" cy="55" r="1" fill="#fff"/>' +
      '<path d="M30 42Q38 37,46 42" stroke="#3b1578" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="M54 42Q62 37,70 42" stroke="#3b1578" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="M48 62Q50 65,52 62" stroke="#dbb68c" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
      '<path d="M38 70Q50 82,62 70" stroke="#c9544d" stroke-width="2" fill="#fff" stroke-linecap="round"/>' +
      '<path d="M40 72Q50 76,60 72" fill="#c9544d"/>' +
      '<path d="M20 48Q20 30,50 28Q80 30,80 48" stroke="#475569" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<rect x="14" y="46" width="10" height="18" rx="4" fill="#475569"/>' +
      '<rect x="76" y="46" width="10" height="18" rx="4" fill="#475569"/>' +
      '<path d="M16 64Q16 78,36 78" stroke="#475569" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="38" cy="78" rx="5" ry="4" fill="#64748b"/>' +
      '<ellipse cx="32" cy="66" rx="5" ry="3" fill="#f8b4b4" opacity=".35"/>' +
      '<ellipse cx="68" cy="66" rx="5" ry="3" fill="#f8b4b4" opacity=".35"/>' +
    '</svg>';
  }

  if (agentId === 'karim') {
    return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+s+' '+s+'">' +
      '<circle cx="50" cy="50" r="49" fill="#FDE8E8"/>' +
      '<ellipse cx="50" cy="55" rx="27" ry="31" fill="#D4A574"/>' +
      '<path d="M23 44C23 18,77 18,77 44L77 36C77 14,23 14,23 36Z" fill="#1c1917"/>' +
      '<path d="M23 36L23 46" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M77 36L77 46" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M28 34Q40 30,50 34Q60 30,72 34L72 28Q60 22,50 28Q40 22,28 28Z" fill="#1c1917"/>' +
      '<ellipse cx="23" cy="55" rx="5" ry="7" fill="#D4A574"/><ellipse cx="77" cy="55" rx="5" ry="7" fill="#D4A574"/>' +
      '<path d="M30 50Q38 46,46 50Q38 56,30 52Z" fill="#fff"/>' +
      '<path d="M54 50Q62 46,70 50Q62 56,54 52Z" fill="#fff"/>' +
      '<circle cx="38" cy="51" r="4.5" fill="#dc2626"/><circle cx="62" cy="51" r="4.5" fill="#dc2626"/>' +
      '<circle cx="38" cy="51" r="2.5" fill="#7f1d1d"/><circle cx="62" cy="51" r="2.5" fill="#7f1d1d"/>' +
      '<circle cx="40" cy="49" r="1.5" fill="#fff"/><circle cx="64" cy="49" r="1.5" fill="#fff"/>' +
      '<path d="M28 44L46 42" stroke="#1c1917" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M72 44L54 42" stroke="#1c1917" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M47 60L50 66L53 60" stroke="#b8894d" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
      '<path d="M42 72L58 72" stroke="#a0685a" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="M28 62L34 58" stroke="#c09970" stroke-width="1" fill="none" stroke-linecap="round" opacity=".6"/>' +
      '<path d="M42 88L50 92L58 88L58 82Q50 86,42 82Z" fill="#dc2626" opacity=".3"/>' +
    '</svg>';
  }

  if (agentId === 'camille') {
    return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+s+' '+s+'">' +
      '<circle cx="50" cy="50" r="49" fill="#FFF8EB"/>' +
      '<path d="M20 40Q14 65,18 90L28 92Q24 65,26 44Z" fill="#b8860b"/>' +
      '<path d="M80 40Q86 65,82 90L72 92Q76 65,74 44Z" fill="#b8860b"/>' +
      '<ellipse cx="50" cy="54" rx="27" ry="32" fill="#FDDCB5"/>' +
      '<path d="M23 42C23 16,77 16,77 42L77 34C77 10,23 10,23 34Z" fill="#d4a017"/>' +
      '<path d="M23 34Q20 50,24 66Q20 70,22 80" stroke="#b8860b" stroke-width="10" fill="none" stroke-linecap="round"/>' +
      '<path d="M77 34Q80 50,76 66Q80 70,78 80" stroke="#b8860b" stroke-width="10" fill="none" stroke-linecap="round"/>' +
      '<path d="M28 36Q26 52,28 68" stroke="#e6bc2f" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"/>' +
      '<path d="M72 36Q74 52,72 68" stroke="#e6bc2f" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"/>' +
      '<path d="M28 34Q35 26,45 34Q50 24,58 32Q64 26,72 34" fill="#d4a017"/>' +
      '<path d="M32 32Q38 24,46 32" fill="#c99a10"/>' +
      '<ellipse cx="38" cy="52" rx="7" ry="8" fill="#fff"/><ellipse cx="62" cy="52" rx="7" ry="8" fill="#fff"/>' +
      '<ellipse cx="39" cy="53" rx="5" ry="5.5" fill="#d97706"/><ellipse cx="63" cy="53" rx="5" ry="5.5" fill="#d97706"/>' +
      '<circle cx="39" cy="53" r="3" fill="#92400e"/><circle cx="63" cy="53" r="3" fill="#92400e"/>' +
      '<circle cx="41" cy="50" r="2" fill="#fff"/><circle cx="65" cy="50" r="2" fill="#fff"/>' +
      '<circle cx="37" cy="55" r=".8" fill="#fff"/><circle cx="61" cy="55" r=".8" fill="#fff"/>' +
      '<path d="M31 48L29 45" stroke="#5c3c10" stroke-width="1" stroke-linecap="round"/>' +
      '<path d="M33 46L32 43" stroke="#5c3c10" stroke-width="1" stroke-linecap="round"/>' +
      '<path d="M69 48L71 45" stroke="#5c3c10" stroke-width="1" stroke-linecap="round"/>' +
      '<path d="M67 46L68 43" stroke="#5c3c10" stroke-width="1" stroke-linecap="round"/>' +
      '<path d="M30 43Q38 38,46 42" stroke="#8b6914" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M54 42Q62 38,70 43" stroke="#8b6914" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M48 60Q50 64,52 60" stroke="#e5a882" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
      '<path d="M42 70Q46 68,50 72Q54 68,58 70" fill="#dc4a5a"/>' +
      '<path d="M42 70Q50 76,58 70" fill="#c93d4c"/>' +
      '<ellipse cx="32" cy="64" rx="6" ry="3" fill="#f8b4b4" opacity=".3"/>' +
      '<ellipse cx="68" cy="64" rx="6" ry="3" fill="#f8b4b4" opacity=".3"/>' +
      '<circle cx="22" cy="62" r="2.5" fill="#d4a017" opacity=".7"/>' +
      '<circle cx="78" cy="62" r="2.5" fill="#d4a017" opacity=".7"/>' +
    '</svg>';
  }

  if (agentId === 'leo') {
    return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+s+' '+s+'">' +
      '<circle cx="50" cy="50" r="49" fill="#ECFDF5"/>' +
      '<ellipse cx="50" cy="56" rx="26" ry="30" fill="#F5D5A8"/>' +
      '<path d="M24 42C24 16,76 16,76 42L76 34C76 10,24 10,24 34Z" fill="#065f46"/>' +
      '<path d="M24 34L24 46" stroke="#065f46" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M76 34L76 46" stroke="#065f46" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M30 26Q36 18,42 24Q46 16,52 22Q56 14,62 22Q66 18,70 26" fill="#047857"/>' +
      '<path d="M34 22Q40 14,46 20" stroke="#059669" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"/>' +
      '<path d="M54 20Q60 12,66 20" stroke="#059669" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"/>' +
      '<ellipse cx="24" cy="56" rx="5" ry="7" fill="#F5D5A8"/><ellipse cx="76" cy="56" rx="5" ry="7" fill="#F5D5A8"/>' +
      '<ellipse cx="38" cy="52" rx="7.5" ry="8.5" fill="#fff"/><ellipse cx="62" cy="52" rx="7.5" ry="8.5" fill="#fff"/>' +
      '<ellipse cx="39" cy="53" rx="5.5" ry="6" fill="#059669"/><ellipse cx="63" cy="53" rx="5.5" ry="6" fill="#059669"/>' +
      '<circle cx="39" cy="53" r="3.5" fill="#065f46"/><circle cx="63" cy="53" r="3.5" fill="#065f46"/>' +
      '<circle cx="41" cy="50" r="2" fill="#fff"/><circle cx="65" cy="50" r="2" fill="#fff"/>' +
      '<circle cx="37" cy="55" r="1" fill="#fff"/><circle cx="61" cy="55" r="1" fill="#fff"/>' +
      '<path d="M30 42Q38 37,46 41" stroke="#065f46" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="M54 41Q62 37,70 42" stroke="#065f46" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="M48 62Q50 65,52 62" stroke="#dbb68c" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
      '<path d="M40 70Q50 80,60 70" stroke="#c9544d" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="M43 72Q50 76,57 72" fill="#fff"/>' +
      '<ellipse cx="32" cy="66" rx="5" ry="3" fill="#f8b4b4" opacity=".35"/>' +
      '<ellipse cx="68" cy="66" rx="5" ry="3" fill="#f8b4b4" opacity=".35"/>' +
      '<path d="M32 16L50 8L68 16L50 22Z" fill="#065f46" opacity=".4"/>' +
      '<rect x="48" y="8" width="4" height="6" fill="#065f46" opacity=".3"/>' +
    '</svg>';
  }

  return '<div style="width:'+size+'px;height:'+size+'px;border-radius:50%;background:#ddd"></div>';
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

/* ── Render: Floating Root ────────────────────────────────── */
function renderAgentTeamFloat() {
  injectATStyles();

  var old = document.getElementById('at-float-root');
  if (old) old.remove();

  var root = document.createElement('div');
  root.id = 'at-float-root';

  /* Main toggle button — stacked mini avatars */
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

  /* FAB click */
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
      '<div class="at-team-header-sub">5 AI experts ready to help</div>' +
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
          '<div class="at-agent-role">'+a.role+'</div>' +
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

  /* Quick ask → auto-route to best agent */
  var quickInput = document.getElementById('at-quick-input');
  var quickSend = document.getElementById('at-quick-send');
  if (quickInput && quickSend) {
    quickSend.addEventListener('click', function() { atQuickAsk(); });
    quickInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); atQuickAsk(); }
    });
  }
}

function atQuickAsk() {
  var input = document.getElementById('at-quick-input');
  if (!input) return;
  var msg = input.value.trim();
  if (!msg) return;
  /* Auto-route to the best agent */
  var best = atDetectBestAgent(msg);
  if (!best) best = AT_AGENTS[1]; /* default Hugo support */
  atOpenChat(best.id);
  /* Pre-fill and send */
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
  /* Init messages for this agent if empty */
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

  /* Flex wrapper so at-messages gets proper flex:1 height */
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

  /* Suggestions */
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

  html += '</div>'; /* close flex wrapper */

  el.innerHTML = html;

  /* Wire input */
  var input = document.getElementById('at-chat-input');
  if (input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); atSendMessage(); }
    });
  }

  /* Scroll to bottom */
  var scroll = document.getElementById('at-msg-scroll');
  if (scroll) scroll.scrollTop = scroll.scrollHeight;
}

function atFormatMsg(text, isUser) {
  if (isUser) return '<span>' + text.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</span>';
  /* Support %%HTML%% blocks from agent-console */
  var parts = text.split(/(%%HTML%%[\s\S]*?%%\/HTML%%)/);
  return parts.map(function(part) {
    if (part.indexOf('%%HTML%%') === 0) return part.replace('%%HTML%%','').replace('%%/HTML%%','');
    return part.replace(/</g,'&lt;').replace(/>/g,'&gt;').split('\n').map(function(line) {
      if (line.indexOf('OK') === 0) return '<span style="color:#10b981;font-weight:600">' + line + '</span>';
      return '<span>' + line + '</span>';
    }).join('<br>');
  }).join('');
}

function atGetSuggestions(agentId) {
  var map = {
    nora: ['Fusionner les doublons comptes', 'Comptes sans contact ?'],
    hugo: ['How do I use the CRM?', 'Explain opportunities', 'Navigate to calendar', 'Create a custom field'],
    karim: ['Audit login history', 'RGPD deletion request', 'Check user permissions', 'Revoke API token'],
    camille: ['Top opportunities by amount', 'Pipeline by stage', 'Contacts at Bouygues', 'Lead conversion rate'],
    leo: ['Getting started tutorial', 'How to create a lead', 'Best practices for pipeline', 'Dashboard walkthrough']
  };
  return (map[agentId] || []).slice(0, 4);
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
    /* Route through existing acMatchScenario if available */
    var response;
    if (typeof acMatchScenario === 'function') {
      response = acMatchScenario(msg);
    } else {
      response = atLocalResponse(msg, agentId);
    }

    /* Handle promises */
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

  /* Detect escalation — forward to agent-console if present */
  if (response.indexOf('[ESCALADE]') >= 0 && typeof AC_NOTIFICATIONS !== 'undefined') {
    var match = response.match(/\[ESCALADE\]\s*(.+?)(?:\n|$)/);
    var escText = match ? match[1].trim() : 'Escalation from '+AT_ACTIVE_AGENT.name;
    AC_NOTIFICATIONS.unshift({ id:'n'+Date.now(), text:escText, time:'Just now', status:'pending', resolution:'' });
    if (typeof acShowToast === 'function') acShowToast('Escalation', escText, '#ef4444');
  }

  AT_LOADING = false;
  atRenderChat(document.getElementById('at-window-content'));
}

/* ── Auto-send: suggestion click sends immediately ────── */
function atAutoSend(text) {
  if (!text || AT_LOADING || !AT_ACTIVE_AGENT) return;
  var input = document.getElementById('at-chat-input');
  if (input) input.value = text;
  atSendMessage();
}

/* Fallback local response if agent-console not loaded */
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
/* This replaces the old single-agent chat bubble from agent-console.js */
var _origRenderFloatingChat = typeof renderFloatingChat === 'function' ? renderFloatingChat : null;

function renderFloatingChat() {
  /* Remove old float if any */
  var oldFloat = document.getElementById('ac-float-root');
  if (oldFloat) oldFloat.remove();
  /* Render new Agent Team */
  renderAgentTeamFloat();
}
