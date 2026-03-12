// ============================================================
// MICKACRM 360 v3 — DASHBOARD.JS — Premium SaaS Dashboard
// ============================================================

function renderDashboard() {
  var container = document.getElementById("main-content");
  var totalPipe = OPPORTUNITIES.reduce(function(s,o){return s+o.amountNum;},0);
  var wonDeals = OPPORTUNITIES.filter(function(o){return o.stage==="Contrat signé";});
  var wonAmt = wonDeals.reduce(function(s,o){return s+o.amountNum;},0);
  var newLeads = LEADS.filter(function(l){return l.status==="Nouveau";}).length;
  var sentQuotes = QUOTES.filter(function(q){return q.status==="Envoyé";}).length;
  var dateStr = new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});

  var html = '<div class="dashboard" style="animation:fadeSlide .2s ease">';

  // Greeting
  html += '<div style="padding-top:4px"><h1 style="font-size:20px;font-weight:700;color:var(--text);letter-spacing:-0.4px;margin-bottom:2px">Bonjour, Micka</h1>';
  html += '<p style="font-size:13px;color:var(--muted);margin:0">' + dateStr + '</p></div>';

  // KPI Tiles — clickable navigation
  var kpis = [
    {icon:"briefcase", label:"Opportunités", value:totalPipe+"M€", sub:OPPORTUNITIES.length+" opportunités", obj:"opportunities"},
    {icon:"file",      label:"Devis",         value:String(QUOTES.length), sub:sentQuotes+" envoyés", obj:"quotes"},
    {icon:"layers",    label:"Projets actifs", value:String(PROJECTS.length), sub:"en cours", obj:"projects"},
    {icon:"target",    label:"Leads ouverts",  value:String(LEADS.length), sub:newLeads+" nouveaux", obj:"leads"},
  ];

  html += '<div class="kpi-grid">';
  kpis.forEach(function(kpi) {
    html += '<div class="kpi-tile" onclick="navigate(\'list\',\'' + kpi.obj + '\')">';
    html += '<div class="kpi-header">';
    html += '<div class="kpi-icon-wrap">' + renderIcon(kpi.icon, 20, COLORS.text2) + '</div>';
    html += '<div class="kpi-arrow">' + renderIcon("chevRight", 16, COLORS.primary) + '</div>';
    html += '</div>';
    html += '<div class="kpi-value">' + kpi.value + '</div>';
    html += '<div class="kpi-footer">';
    html += '<span class="kpi-label">' + kpi.label + '</span>';
    html += '<span class="kpi-hint">Voir tout →</span>';
    html += '</div>';
    html += '</div>';
  });
  html += '</div>';

  // Quick Actions
  html += '<div><div class="section-label">Actions rapides</div><div class="quick-actions">';
  [{label:"Compte",obj:"accounts"},{label:"Contact",obj:"contacts"},{label:"Lead",obj:"leads"},{label:"Opportunité",obj:"opportunities"},{label:"Projet",obj:"projects"}].forEach(function(a) {
    html += '<button class="quick-action-btn" onclick="navigate(\'list\',\'' + a.obj + '\')">' + renderObjIcon(a.obj,15,"currentColor") + a.label + '</button>';
  });
  html += '</div></div>';

  // Pipeline Overview
  html += '<div class="card">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">';
  html += '<div style="display:flex;align-items:center;gap:8px">' + renderIcon("kanban",18,COLORS.text2) + '<span class="section-title">Pipeline</span></div>';
  html += '<button class="btn-link" onclick="navigate(\'pipeline\')">Kanban →</button>';
  html += '</div>';
  STAGES.forEach(function(st) {
    var so = OPPORTUNITIES.filter(function(o){return o.stage===st.key;});
    var amt = so.reduce(function(s,o){return s+o.amountNum;},0);
    var pct = totalPipe > 0 ? (amt/totalPipe)*100 : 0;
    html += '<div style="margin-bottom:12px">';
    html += '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px"><span style="font-weight:500;color:var(--text)">' + st.short + '</span><span style="color:var(--muted);font-size:11px">' + so.length + ' · ' + amt + 'M€</span></div>';
    html += '<div class="pipe-track"><div class="pipe-fill" style="width:' + Math.max(pct,2) + '%;background:' + st.color + '"></div></div>';
    html += '</div>';
  });
  html += '<div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border-light);display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--text2)">Total pipeline</span><span style="font-weight:700;color:var(--text)">' + totalPipe + 'M€</span></div>';
  html += '</div>';

  // Timeline + Top Opps
  html += '<div class="grid-2">';
  html += buildTimeline();
  html += buildTopOpps();
  html += '</div>';

  // Tasks + Leads
  html += '<div class="grid-2">';
  html += buildTasks();
  html += buildLeads();
  html += '</div>';

  html += '</div>';
  container.innerHTML = html;
}

function buildTimeline() {
  var html = '<div class="card">';
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:18px">' + renderIcon("clock",16,COLORS.text2) + '<span class="section-title">Activités récentes</span></div>';
  html += '<div class="timeline"><div class="timeline-line"></div>';
  ACTIVITIES.forEach(function(a,i) {
    var ic = ACTIVITY_ICONS[a.type] || "phone";
    var ac = ACTIVITY_COLORS[a.type] || COLORS.primary;
    html += '<div class="timeline-item" style="padding-bottom:' + (i<ACTIVITIES.length-1?20:0) + 'px">';
    html += '<div class="timeline-dot" style="background:' + ac + '0d;box-shadow:0 0 0 2.5px var(--white)">' + renderIcon(ic,9,ac) + '</div>';
    html += '<div><div style="display:flex;justify-content:space-between;gap:8px"><span style="font-size:12.5px;font-weight:600;color:var(--text);line-height:1.4">' + a.subject + '</span><span style="font-size:10px;color:var(--muted);white-space:nowrap;font-weight:500">' + a.time + '</span></div>';
    html += '<div style="font-size:11.5px;color:var(--text2);margin-top:2px">' + a.contactName + ' <span style="color:var(--muted)">· ' + a.accountName + '</span></div>';
    html += '<div style="font-size:10.5px;color:var(--subtle);margin-top:2px">' + a.date + '</div></div></div>';
  });
  html += '</div></div>';
  return html;
}

function buildTopOpps() {
  var sorted = OPPORTUNITIES.slice().sort(function(a,b){return b.amountNum-a.amountNum;}).slice(0,5);
  var html = '<div class="card">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px"><div style="display:flex;align-items:center;gap:8px">' + renderIcon("briefcase",16,COLORS.text2) + '<span class="section-title">Top Opportunités</span></div>';
  html += '<button class="btn-link sm" onclick="navigate(\'list\',\'opportunities\')">Tout →</button></div>';
  sorted.forEach(function(o) {
    var bc = BADGE_COLORS[o.stage] || COLORS.text2;
    html += '<div class="hover-row" style="padding:12px 14px;cursor:pointer;display:flex;justify-content:space-between;align-items:center" onclick="navigate(\'record\',\'opportunities\',\'' + o.id + '\')">';
    html += '<div style="min-width:0;flex:1"><div style="font-size:12.5px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + o.name + '</div><div style="font-size:11px;color:var(--muted);margin-top:1px">' + o.accountName + '</div></div>';
    html += '<div style="text-align:right;flex-shrink:0;margin-left:12px"><div style="font-size:14px;font-weight:700;color:var(--text)">' + o.amount + '</div><span class="badge" style="background:' + bc + '10;color:' + bc + '">' + o.stage + '</span></div></div>';
  });
  html += '</div>';
  return html;
}

function buildTasks() {
  var html = '<div class="card">';
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">' + renderIcon("check",16,COLORS.text2) + '<span class="section-title">Mes tâches</span></div>';
  TASKS.forEach(function(t) {
    var pc = t.priority==="Haute"?COLORS.red:t.priority==="Moyenne"?COLORS.warn:COLORS.stageTeal;
    var sc = BADGE_COLORS[t.status] || COLORS.text2;
    html += '<div class="hover-row" style="display:flex;align-items:center;gap:12px;padding:10px 12px">';
    html += '<div style="width:8px;height:8px;border-radius:50%;background:' + pc + ';flex-shrink:0"></div>';
    html += '<div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:500;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + t.subject + '</div><div style="font-size:10.5px;color:var(--muted);margin-top:1px">' + t.relatedTo + ' · ' + t.dueDate + '</div></div>';
    html += '<span class="badge" style="background:' + sc + '10;color:' + sc + '">' + t.status + '</span></div>';
  });
  html += '</div>';
  return html;
}

function buildLeads() {
  var html = '<div class="card">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><div style="display:flex;align-items:center;gap:8px">' + renderIcon("target",16,COLORS.text2) + '<span class="section-title">Leads récents</span></div>';
  html += '<button class="btn-link sm" onclick="navigate(\'list\',\'leads\')">Tout →</button></div>';
  LEADS.forEach(function(l) {
    var sc = BADGE_COLORS[l.status] || COLORS.text2;
    html += '<div class="hover-row" style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;cursor:pointer" onclick="navigate(\'record\',\'leads\',\'' + l.id + '\')">';
    html += '<div style="display:flex;align-items:center;gap:10px"><div class="lead-avatar">' + l.firstName[0] + l.lastName[0] + '</div><div><div style="font-size:12.5px;font-weight:500;color:var(--text)">' + l.firstName + ' ' + l.lastName + '</div><div style="font-size:10.5px;color:var(--muted)">' + l.company + ' · ' + l.source + '</div></div></div>';
    html += '<span class="badge" style="background:' + sc + '10;color:' + sc + '">' + l.status + '</span></div>';
  });
  html += '</div>';
  return html;
}
