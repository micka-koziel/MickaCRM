// ============================================================
// MICKACRM 360 v3 — DASHBOARD.JS — Cockpit Opérationnel BTP
// ============================================================

function renderDashboard() {
  var container = document.getElementById("main-content");
  var totalPipe = OPPORTUNITIES.reduce(function(s,o){return s+o.amountNum;},0);
  var wonDeals = OPPORTUNITIES.filter(function(o){return o.stage==="Contrat signé";});
  var wonAmt = wonDeals.reduce(function(s,o){return s+o.amountNum;},0);
  var newLeads = LEADS.filter(function(l){return l.status==="Nouveau";}).length;
  var sentQuotes = QUOTES.filter(function(q){return q.status==="Envoyé";}).length;
  var openCases = typeof CASES !== "undefined" ? CASES.filter(function(c){return c.status!=="Fermé" && c.status!=="Résolu";}).length : 0;
  var dateStr = new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});

  var html = '<div class="dashboard cockpit" style="animation:fadeSlide .25s ease">';

  // ─── HEADER ───
  html += '<div class="cockpit-header">';
  html += '<div><h1 class="cockpit-greeting">Bonjour, Micka</h1>';
  html += '<p class="cockpit-subtitle">Voici l\u2019activité de votre portefeuille aujourd\u2019hui</p></div>';
  html += '<div class="cockpit-date">' + renderIcon("calendar",14,COLORS.text2) + '<span>' + dateStr + '</span></div>';
  html += '</div>';

  // ─── ROW 1 — KPI TILES (with color accents) ───
  var kpis = [
    {icon:"briefcase", label:"Opportunités actives", value:String(OPPORTUNITIES.length), accent:"#2563eb", bg:"#eff6ff", obj:"opportunities"},
    {icon:"file",      label:"Devis en cours",       value:String(QUOTES.length),        accent:"#7c3aed", bg:"#f5f3ff", obj:"quotes"},
    {icon:"layers",    label:"Projets actifs",        value:String(PROJECTS.length),      accent:"#059669", bg:"#ecfdf5", obj:"projects"},
    {icon:"target",    label:"Leads entrants",        value:String(LEADS.length),         accent:"#d97706", bg:"#fffbeb", obj:"leads"},
    {icon:"alert",     label:"Claims ouverts",        value:String(openCases),            accent:"#dc2626", bg:"#fef2f2", obj:"cases"}
  ];

  html += '<div class="kpi-row">';
  kpis.forEach(function(kpi, i) {
    html += '<div class="kpi-card" style="--kpi-accent:' + kpi.accent + ';--kpi-bg:' + kpi.bg + ';animation-delay:' + (i*60) + 'ms" onclick="navigate(\'list\',\'' + kpi.obj + '\')">';
    html += '<div class="kpi-card-icon" style="background:' + kpi.bg + '">' + renderIcon(kpi.icon, 18, kpi.accent) + '</div>';
    html += '<div class="kpi-card-value">' + kpi.value + '</div>';
    html += '<div class="kpi-card-label">' + kpi.label + '</div>';
    html += '<div class="kpi-card-bar" style="background:' + kpi.accent + '"></div>';
    html += '</div>';
  });
  html += '</div>';

  // ─── ROW 2 — PIPELINE FUNNEL ───
  html += '<div class="card cockpit-card">';
  html += '<div class="cockpit-card-head">';
  html += '<div class="cockpit-card-title">' + renderIcon("kanban",18,COLORS.text2) + '<span>Pipeline Opportunités / Projets</span></div>';
  html += '<button class="btn-link" onclick="navigate(\'pipeline\')">Voir le Kanban →</button>';
  html += '</div>';
  html += buildFunnel(totalPipe);
  html += '</div>';

  // ─── ROW 3 — ACTIVITY ANALYTICS ───
  html += '<div class="card cockpit-card">';
  html += '<div class="cockpit-card-head">';
  html += '<div class="cockpit-card-title">' + renderIcon("chart",18,COLORS.text2) + '<span>Activités des 30 derniers jours</span></div>';
  html += '</div>';
  html += buildActivityChart();
  html += '</div>';

  // ─── ROW 4 — PROJECT STATUS ───
  html += '<div class="card cockpit-card">';
  html += '<div class="cockpit-card-head">';
  html += '<div class="cockpit-card-title">' + renderIcon("layers",18,COLORS.text2) + '<span>Projets par phase</span></div>';
  html += '<button class="btn-link" onclick="navigate(\'list\',\'projects\')">Tout voir →</button>';
  html += '</div>';
  html += buildProjectPhaseChart();
  html += '</div>';

  // ─── ROW 5 — PERSONAL WORKSPACE ───
  html += '<div class="grid-2">';
  html += buildMyTasks();
  html += buildUpcomingActivities();
  html += '</div>';

  // ─── ROW 6 — BUSINESS INSIGHTS ───
  html += '<div class="grid-2">';
  html += buildTopOpps();
  html += buildOpenClaims();
  html += '</div>';

  html += '</div>';

  container.innerHTML = html;

  // Inject cockpit-specific styles
  injectCockpitStyles();
}

// ─── FUNNEL CHART ───
function buildFunnel(totalPipe) {
  var stages = [
    {key:"Lead",          label:"Lead",           color:"#94a3b8"},
    {key:"Étude",         label:"Étude",          color:"#60a5fa"},
    {key:"Appel d'offres",label:"AO",             color:"#818cf8"},
    {key:"Proposition",   label:"Proposition",    color:"#a78bfa"},
    {key:"Négociation",   label:"Négociation",    color:"#f59e0b"},
    {key:"Contrat signé", label:"Signé",          color:"#10b981"},
    {key:"Projet lancé",  label:"Projet lancé",   color:"#059669"}
  ];

  // Map stage keys — some may match STAGES from config, fallback to OPPORTUNITIES stage field
  var maxCount = 1;
  var stageData = stages.map(function(st) {
    var opps = OPPORTUNITIES.filter(function(o) {
      // Match on stage key or partial match
      return o.stage === st.key || o.stage.indexOf(st.key) === 0;
    });
    var count = opps.length;
    var amt = opps.reduce(function(s,o){return s+o.amountNum;},0);
    if (count > maxCount) maxCount = count;
    return {label:st.label, color:st.color, count:count, amt:amt};
  });

  var html = '<div class="funnel-chart">';
  stageData.forEach(function(st, i) {
    var widthPct = maxCount > 0 ? Math.max((st.count / maxCount) * 100, 8) : 8;
    // Funnel narrows: apply tapering
    var taperPct = 100 - (i * (60 / stages.length));
    var finalWidth = Math.min(widthPct, taperPct);
    finalWidth = Math.max(finalWidth, 12);

    html += '<div class="funnel-row">';
    html += '<div class="funnel-label">' + st.label + '</div>';
    html += '<div class="funnel-bar-wrap">';
    html += '<div class="funnel-bar" style="width:' + finalWidth + '%;background:' + st.color + ';animation-delay:' + (i*80) + 'ms">';
    html += '<span class="funnel-bar-text">' + st.count + ' opp. · ' + st.amt + 'M€</span>';
    html += '</div></div>';
    html += '</div>';
  });
  html += '</div>';

  // Pipeline total
  html += '<div class="funnel-total"><span>Total pipeline</span><strong>' + totalPipe + 'M€</strong></div>';
  return html;
}

// ─── ACTIVITY BAR CHART ───
function buildActivityChart() {
  var types = [
    {key:"Appel",        label:"Appels",         color:"#3b82f6", icon:"phone"},
    {key:"Réunion",      label:"Réunions",       color:"#8b5cf6", icon:"users"},
    {key:"Visite",       label:"Visites chantier",color:"#f59e0b", icon:"building"},
    {key:"Email",        label:"Emails",         color:"#10b981", icon:"mail"}
  ];

  var maxVal = 1;
  var chartData = types.map(function(t) {
    var count = ACTIVITIES.filter(function(a) {
      return a.type === t.key || (a.type && a.type.toLowerCase().indexOf(t.key.toLowerCase()) >= 0);
    }).length;
    // Simulate 30-day spread (multiply mock by factor for visual impact)
    var val = Math.max(count, 1);
    if (val > maxVal) maxVal = val;
    return {label:t.label, color:t.color, icon:t.icon, count:val};
  });

  var barMaxH = 140;
  var html = '<div class="bar-chart">';
  html += '<div class="bar-chart-bars">';
  chartData.forEach(function(d, i) {
    var h = Math.max((d.count / maxVal) * barMaxH, 20);
    html += '<div class="bar-col" style="animation-delay:' + (i*100) + 'ms">';
    html += '<div class="bar-value">' + d.count + '</div>';
    html += '<div class="bar-rect" style="height:' + h + 'px;background:' + d.color + '"></div>';
    html += '<div class="bar-label">' + renderIcon(d.icon,13,d.color) + '<span>' + d.label + '</span></div>';
    html += '</div>';
  });
  html += '</div></div>';
  return html;
}

// ─── PROJECT PHASE STACKED BAR ───
function buildProjectPhaseChart() {
  var phases = [
    {key:"Pré-étude",        label:"Pré-étude",        color:"#94a3b8"},
    {key:"Appel d'offres",   label:"Appel d'offres",   color:"#60a5fa"},
    {key:"Contractualisation",label:"Contractualisation",color:"#818cf8"},
    {key:"Construction",     label:"Construction",      color:"#f59e0b"},
    {key:"Livré",            label:"Livré",             color:"#10b981"}
  ];

  var total = Math.max(PROJECTS.length, 1);
  var phaseData = phases.map(function(p) {
    var count = PROJECTS.filter(function(pr) {
      return pr.status === p.key || pr.phase === p.key ||
        (pr.status && pr.status.toLowerCase().indexOf(p.key.toLowerCase()) >= 0);
    }).length;
    return {label:p.label, color:p.color, count:count, pct: (count/total)*100};
  });

  // Assign remaining to first phase if none match
  var assigned = phaseData.reduce(function(s,p){return s+p.count;},0);
  if (assigned === 0 && PROJECTS.length > 0) {
    // Distribute mock across phases
    phaseData[0].count = Math.ceil(PROJECTS.length * 0.1);
    phaseData[1].count = Math.ceil(PROJECTS.length * 0.15);
    phaseData[2].count = Math.ceil(PROJECTS.length * 0.15);
    phaseData[3].count = Math.ceil(PROJECTS.length * 0.4);
    phaseData[4].count = Math.max(PROJECTS.length - phaseData[0].count - phaseData[1].count - phaseData[2].count - phaseData[3].count, 0);
    total = PROJECTS.length;
    phaseData.forEach(function(p){p.pct = (p.count/total)*100;});
  }

  var html = '<div class="stacked-chart">';

  // Stacked bar
  html += '<div class="stacked-bar">';
  phaseData.forEach(function(p, i) {
    if (p.pct > 0) {
      html += '<div class="stacked-segment" style="width:' + Math.max(p.pct, 4) + '%;background:' + p.color + ';animation-delay:' + (i*80) + 'ms" title="' + p.label + ': ' + p.count + '"></div>';
    }
  });
  html += '</div>';

  // Legend
  html += '<div class="stacked-legend">';
  phaseData.forEach(function(p) {
    html += '<div class="stacked-legend-item">';
    html += '<div class="stacked-dot" style="background:' + p.color + '"></div>';
    html += '<span class="stacked-legend-label">' + p.label + '</span>';
    html += '<span class="stacked-legend-val">' + p.count + '</span>';
    html += '</div>';
  });
  html += '</div>';

  html += '</div>';
  return html;
}

// ─── MY TASKS ───
function buildMyTasks() {
  var html = '<div class="card cockpit-card">';
  html += '<div class="cockpit-card-head">';
  html += '<div class="cockpit-card-title">' + renderIcon("check",16,COLORS.text2) + '<span>Mes tâches en cours</span></div>';
  html += '</div>';

  var openTasks = TASKS.filter(function(t){return t.status !== "Terminée" && t.status !== "Fermé";});
  if (openTasks.length === 0) openTasks = TASKS.slice(0,5);

  openTasks.forEach(function(t) {
    var pc = t.priority==="Haute"?COLORS.red:t.priority==="Moyenne"?COLORS.warn:COLORS.stageTeal || "#64748b";
    var sc = BADGE_COLORS[t.status] || COLORS.text2;
    html += '<div class="hover-row cockpit-row">';
    html += '<div class="cockpit-row-dot" style="background:' + pc + '"></div>';
    html += '<div class="cockpit-row-body">';
    html += '<div class="cockpit-row-title">' + t.subject + '</div>';
    html += '<div class="cockpit-row-meta">' + t.relatedTo + ' · ' + t.dueDate + '</div>';
    html += '</div>';
    html += '<span class="badge" style="background:' + sc + '10;color:' + sc + '">' + t.status + '</span>';
    html += '</div>';
  });
  html += '</div>';
  return html;
}

// ─── UPCOMING ACTIVITIES ───
function buildUpcomingActivities() {
  var html = '<div class="card cockpit-card">';
  html += '<div class="cockpit-card-head">';
  html += '<div class="cockpit-card-title">' + renderIcon("clock",16,COLORS.text2) + '<span>Prochaines activités</span></div>';
  html += '</div>';

  ACTIVITIES.slice(0,6).forEach(function(a) {
    var ic = ACTIVITY_ICONS ? (ACTIVITY_ICONS[a.type] || "phone") : "phone";
    var ac = ACTIVITY_COLORS ? (ACTIVITY_COLORS[a.type] || COLORS.primary) : COLORS.primary;
    html += '<div class="hover-row cockpit-row">';
    html += '<div class="cockpit-act-icon" style="background:' + ac + '12;color:' + ac + '">' + renderIcon(ic, 14, ac) + '</div>';
    html += '<div class="cockpit-row-body">';
    html += '<div class="cockpit-row-title">' + a.subject + '</div>';
    html += '<div class="cockpit-row-meta">' + a.contactName + ' · ' + a.accountName + '</div>';
    html += '</div>';
    html += '<div class="cockpit-act-time">';
    html += '<div class="cockpit-act-date">' + a.date + '</div>';
    html += '<div class="cockpit-act-hour">' + a.time + '</div>';
    html += '</div>';
    html += '</div>';
  });
  html += '</div>';
  return html;
}

// ─── TOP OPPORTUNITIES ───
function buildTopOpps() {
  var sorted = OPPORTUNITIES.slice().sort(function(a,b){return b.amountNum-a.amountNum;}).slice(0,5);
  var html = '<div class="card cockpit-card">';
  html += '<div class="cockpit-card-head">';
  html += '<div class="cockpit-card-title">' + renderIcon("briefcase",16,COLORS.text2) + '<span>Top Opportunités</span></div>';
  html += '<button class="btn-link sm" onclick="navigate(\'list\',\'opportunities\')">Tout →</button>';
  html += '</div>';

  sorted.forEach(function(o) {
    var bc = BADGE_COLORS[o.stage] || COLORS.text2;
    html += '<div class="hover-row cockpit-row" style="cursor:pointer" onclick="navigate(\'record\',\'opportunities\',\'' + o.id + '\')">';
    html += '<div class="cockpit-row-body" style="flex:1;min-width:0">';
    html += '<div class="cockpit-row-title" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + o.name + '</div>';
    html += '<div class="cockpit-row-meta">' + o.accountName + '</div>';
    html += '</div>';
    html += '<div style="text-align:right;flex-shrink:0;margin-left:12px">';
    html += '<div style="font-size:14px;font-weight:700;color:var(--text)">' + o.amount + '</div>';
    html += '<span class="badge" style="background:' + bc + '10;color:' + bc + ';font-size:10px">' + o.stage + '</span>';
    html += '</div></div>';
  });
  html += '</div>';
  return html;
}

// ─── OPEN CLAIMS ───
function buildOpenClaims() {
  var html = '<div class="card cockpit-card">';
  html += '<div class="cockpit-card-head">';
  html += '<div class="cockpit-card-title">' + renderIcon("alert",16,"#dc2626") + '<span>Claims ouverts</span></div>';
  html += '<button class="btn-link sm" onclick="navigate(\'list\',\'cases\')">Tout →</button>';
  html += '</div>';

  var cases = typeof CASES !== "undefined" ? CASES.filter(function(c){return c.status!=="Fermé" && c.status!=="Résolu";}) : [];
  if (cases.length === 0 && typeof CASES !== "undefined") cases = CASES.slice(0,5);

  if (cases.length === 0) {
    html += '<div style="padding:24px 16px;text-align:center;color:var(--muted);font-size:13px">Aucun claim ouvert</div>';
  } else {
    cases.slice(0,5).forEach(function(c) {
      var sc = BADGE_COLORS[c.status] || COLORS.text2;
      var pc = c.priority === "Haute" || c.priority === "Urgent" ? "#dc2626" : c.priority === "Moyenne" ? "#f59e0b" : "#64748b";
      html += '<div class="hover-row cockpit-row" style="cursor:pointer" onclick="navigate(\'record\',\'cases\',\'' + c.id + '\')">';
      html += '<div class="cockpit-row-dot" style="background:' + pc + '"></div>';
      html += '<div class="cockpit-row-body">';
      html += '<div class="cockpit-row-title">' + (c.subject || c.name || "Claim #" + c.id) + '</div>';
      html += '<div class="cockpit-row-meta">' + (c.accountName || c.account || "") + ' · ' + (c.type || "") + '</div>';
      html += '</div>';
      html += '<span class="badge" style="background:' + sc + '10;color:' + sc + '">' + c.status + '</span>';
      html += '</div>';
    });
  }
  html += '</div>';
  return html;
}


// ─── INJECT COCKPIT STYLES ───
function injectCockpitStyles() {
  if (document.getElementById("cockpit-css")) return;
  var style = document.createElement("style");
  style.id = "cockpit-css";
  style.textContent = '\
/* ── Cockpit Header ── */\
.cockpit-header{display:flex;justify-content:space-between;align-items:flex-end;padding:4px 0 8px;gap:16px;flex-wrap:wrap}\
.cockpit-greeting{font-size:22px;font-weight:800;color:var(--text);letter-spacing:-0.5px;margin:0;line-height:1.3}\
.cockpit-subtitle{font-size:13.5px;color:var(--text2);margin:2px 0 0;font-weight:400}\
.cockpit-date{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--muted);font-weight:500;white-space:nowrap}\
\
/* ── KPI Row ── */\
.kpi-row{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin:6px 0 2px}\
.kpi-card{background:var(--white);border:1px solid var(--border-light);border-radius:14px;padding:18px 16px 14px;\
  cursor:pointer;position:relative;overflow:hidden;transition:all .2s ease;\
  animation:kpiFadeIn .35s ease both}\
.kpi-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.06);border-color:var(--kpi-accent)}\
.kpi-card-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:12px}\
.kpi-card-value{font-size:28px;font-weight:800;color:var(--text);letter-spacing:-1px;line-height:1}\
.kpi-card-label{font-size:12px;color:var(--text2);margin-top:6px;font-weight:500}\
.kpi-card-bar{position:absolute;bottom:0;left:0;right:0;height:3px;border-radius:0 0 14px 14px;opacity:.7}\
@keyframes kpiFadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}\
\
/* ── Cockpit Cards ── */\
.cockpit-card{padding:22px 24px !important}\
.cockpit-card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}\
.cockpit-card-title{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:700;color:var(--text)}\
\
/* ── Funnel ── */\
.funnel-chart{display:flex;flex-direction:column;gap:8px}\
.funnel-row{display:flex;align-items:center;gap:12px}\
.funnel-label{width:90px;font-size:12px;font-weight:600;color:var(--text2);text-align:right;flex-shrink:0}\
.funnel-bar-wrap{flex:1;background:var(--bg);border-radius:8px;overflow:hidden;height:32px;display:flex;align-items:center}\
.funnel-bar{height:100%;border-radius:8px;display:flex;align-items:center;padding:0 12px;min-width:60px;\
  transition:width .6s cubic-bezier(.4,0,.2,1);animation:funnelGrow .5s ease both}\
.funnel-bar-text{font-size:11px;font-weight:600;color:#fff;white-space:nowrap;text-shadow:0 1px 2px rgba(0,0,0,.15)}\
.funnel-total{margin-top:16px;padding-top:14px;border-top:1px solid var(--border-light);display:flex;justify-content:space-between;font-size:13px;color:var(--text2)}\
.funnel-total strong{color:var(--text);font-size:15px}\
@keyframes funnelGrow{from{width:0;opacity:0}to{opacity:1}}\
\
/* ── Bar Chart ── */\
.bar-chart{padding:8px 0}\
.bar-chart-bars{display:flex;align-items:flex-end;justify-content:center;gap:32px;height:180px;padding-bottom:8px}\
.bar-col{display:flex;flex-direction:column;align-items:center;gap:8px;animation:barUp .4s ease both}\
.bar-value{font-size:18px;font-weight:800;color:var(--text);letter-spacing:-0.5px}\
.bar-rect{width:56px;border-radius:8px 8px 4px 4px;transition:height .5s ease}\
.bar-label{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11px;font-weight:500;color:var(--text2)}\
@keyframes barUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}\
\
/* ── Stacked Bar ── */\
.stacked-chart{padding:4px 0}\
.stacked-bar{display:flex;height:36px;border-radius:10px;overflow:hidden;gap:2px;margin-bottom:18px}\
.stacked-segment{transition:width .5s ease;animation:stackGrow .4s ease both}\
.stacked-legend{display:flex;flex-wrap:wrap;gap:8px 20px}\
.stacked-legend-item{display:flex;align-items:center;gap:6px}\
.stacked-dot{width:10px;height:10px;border-radius:3px;flex-shrink:0}\
.stacked-legend-label{font-size:12px;color:var(--text2);font-weight:500}\
.stacked-legend-val{font-size:12px;font-weight:700;color:var(--text);margin-left:2px}\
@keyframes stackGrow{from{width:0}}\
\
/* ── Cockpit Rows (tasks/activities/claims) ── */\
.cockpit-row{display:flex;align-items:center;gap:12px;padding:11px 14px}\
.cockpit-row-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}\
.cockpit-row-body{flex:1;min-width:0}\
.cockpit-row-title{font-size:12.5px;font-weight:600;color:var(--text);line-height:1.4}\
.cockpit-row-meta{font-size:10.5px;color:var(--muted);margin-top:1px}\
.cockpit-act-icon{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}\
.cockpit-act-time{text-align:right;flex-shrink:0}\
.cockpit-act-date{font-size:11px;font-weight:600;color:var(--text2)}\
.cockpit-act-hour{font-size:10px;color:var(--muted);margin-top:1px}\
\
/* ── Responsive ── */\
@media(max-width:1100px){.kpi-row{grid-template-columns:repeat(3,1fr)}}\
@media(max-width:768px){.kpi-row{grid-template-columns:repeat(2,1fr)}.cockpit-header{flex-direction:column;align-items:flex-start}\
  .bar-chart-bars{gap:16px}.bar-rect{width:40px}}\
@media(max-width:480px){.kpi-row{grid-template-columns:1fr}.funnel-label{width:60px;font-size:11px}}\
';
  document.head.appendChild(style);
}
