// ============================================================
// MICKACRM 360 — DASHBOARD.JS
// Homepage: KPIs, Quick Actions, Pipeline Overview,
// Timeline, Top Opps, Tasks, Leads
// ============================================================

function renderDashboard() {
  var container = document.getElementById("main-content");
  var totalPipe = OPPORTUNITIES.reduce(function(s, o) { return s + o.amountNum; }, 0);
  var wonDeals = OPPORTUNITIES.filter(function(o) { return o.stage === "Contrat signé"; });
  var wonAmt = wonDeals.reduce(function(s, o) { return s + o.amountNum; }, 0);
  var newLeads = LEADS.filter(function(l) { return l.status === "Nouveau"; }).length;

  var dateStr = new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" });

  var html = '<div class="dashboard anim-fade-slide">';

  // ─── Greeting
  html += '<div class="dashboard-greeting">';
  html += '<h1>Bonjour Micka 👋</h1>';
  html += '<p>Voici votre activité — ' + dateStr + '</p>';
  html += '</div>';

  // ─── KPIs
  html += '<div class="kpi-grid">';
  html += buildKpi("💰", "Pipeline", totalPipe + "M€", OPPORTUNITIES.length + " opportunités", "var(--blu-bg)", "var(--imperial)");
  html += buildKpi("🏆", "Signés", wonAmt + "M€", wonDeals.length + " deals gagnés", "var(--success-bg)", "var(--success)");
  html += buildKpi("🏗️", "Projets", PROJECTS.length, "en cours", "var(--warn-bg)", "var(--orange)");
  html += buildKpi("🎯", "Leads", LEADS.length, newLeads + " nouveaux", "var(--purp-bg)", "var(--purp)");
  html += '</div>';

  // ─── Quick Actions
  html += '<div><div class="section-label">Actions rapides</div>';
  html += '<div class="quick-actions">';
  QUICK_ACTIONS.forEach(function(a) {
    html += '<button class="quick-action-btn" onclick="navigate(\'list\',\'' + a.obj + '\')">';
    html += '<div class="quick-action-circle" style="background:' + a.bg + '">' + a.icon + '</div>';
    html += '<span class="quick-action-label">' + a.label + '</span>';
    html += '</button>';
  });
  html += '</div></div>';

  // ─── Pipeline Overview
  html += '<div class="card">';
  html += '<div class="flex-between" style="margin-bottom:16px">';
  html += '<span class="section-title">📊 Pipeline</span>';
  html += '<button class="btn-link" onclick="navigate(\'pipeline\')">Voir le Kanban →</button>';
  html += '</div>';
  STAGES.forEach(function(st) {
    var so = OPPORTUNITIES.filter(function(o) { return o.stage === st.key; });
    var amt = so.reduce(function(s, o) { return s + o.amountNum; }, 0);
    var pct = totalPipe > 0 ? (amt / totalPipe) * 100 : 0;
    html += '<div style="margin-bottom:10px">';
    html += '<div class="flex-between" style="font-size:11px;margin-bottom:4px">';
    html += '<span style="font-weight:600;color:var(--text)">' + st.short + '</span>';
    html += '<span style="color:var(--text2)">' + so.length + ' · ' + amt + 'M€</span>';
    html += '</div>';
    html += '<div class="pipeline-bar-track"><div class="pipeline-bar-fill" style="width:' + Math.max(pct, 3) + '%;background:' + st.color + '"></div></div>';
    html += '</div>';
  });
  html += '<div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border-light)" class="flex-between" style="font-size:12px">';
  html += '<span style="color:var(--text2);font-size:12px">Total pipeline</span>';
  html += '<span style="font-weight:800;color:var(--imperial);font-size:12px">' + totalPipe + 'M€</span>';
  html += '</div></div>';

  // ─── Timeline + Top Opps
  html += '<div class="grid-2">';
  html += buildTimeline();
  html += buildTopOpps();
  html += '</div>';

  // ─── Tasks + Leads
  html += '<div class="grid-2">';
  html += buildTasks();
  html += buildLeads();
  html += '</div>';

  html += '</div>'; // end dashboard
  container.innerHTML = html;
}

// ─── KPI Card Builder ──────────────────────────────────────────
function buildKpi(icon, label, value, sub, bg, accent) {
  return '<div class="kpi-card" style="background:' + bg + '">' +
    '<div class="kpi-icon">' + icon + '</div>' +
    '<div class="kpi-label" style="color:' + accent + '">' + label + '</div>' +
    '<div class="kpi-value">' + value + '</div>' +
    '<div class="kpi-sub">' + sub + '</div>' +
    '</div>';
}

// ─── Timeline Builder ──────────────────────────────────────────
function buildTimeline() {
  var html = '<div class="card">';
  html += '<span class="section-title">⏱️ Activités récentes</span>';
  html += '<div class="timeline">';
  html += '<div class="timeline-line"></div>';

  ACTIVITIES.forEach(function(a, i) {
    var ic = ACTIVITY_ICONS[a.type] || "●";
    var ac = ACTIVITY_COLORS[a.type] || COLORS.blu;
    html += '<div class="timeline-item" style="padding-bottom:' + (i < ACTIVITIES.length - 1 ? 22 : 0) + 'px">';
    html += '<div class="timeline-dot" style="background:' + ac + '18;box-shadow:0 0 0 3px var(--white)">' + ic + '</div>';
    html += '<div>';
    html += '<div class="flex-between" style="gap:6px">';
    html += '<span class="timeline-subject">' + a.subject + '</span>';
    html += '<span class="timeline-time">' + a.time + '</span>';
    html += '</div>';
    html += '<div class="timeline-meta">' + a.contactName + ' · <span style="color:var(--muted)">' + a.accountName + '</span></div>';
    html += '<div class="timeline-date">' + a.date + '</div>';
    html += '</div></div>';
  });

  html += '</div></div>';
  return html;
}

// ─── Top Opportunities Builder ─────────────────────────────────
function buildTopOpps() {
  var sorted = OPPORTUNITIES.slice().sort(function(a, b) { return b.amountNum - a.amountNum; }).slice(0, 5);

  var html = '<div class="card">';
  html += '<div class="flex-between" style="margin-bottom:14px">';
  html += '<span class="section-title">💰 Top Opportunités</span>';
  html += '<button class="btn-link sm" onclick="navigate(\'list\',\'opportunities\')">Tout →</button>';
  html += '</div>';

  sorted.forEach(function(o) {
    var bc = BADGE_COLORS[o.stage] || COLORS.text2;
    html += '<div class="hover-item" style="padding:12px 14px;margin-bottom:10px;background:var(--white);cursor:pointer" onclick="navigate(\'record\',\'opportunities\',\'' + o.id + '\')">';
    html += '<div class="flex-between" style="align-items:flex-start">';
    html += '<div style="min-width:0;flex:1">';
    html += '<div style="font-size:12px;font-weight:700;color:var(--text)" class="text-ellipsis">' + o.name + '</div>';
    html += '<div style="font-size:10px;color:var(--muted);margin-top:2px">' + o.accountName + '</div>';
    html += '</div>';
    html += '<div style="text-align:right;flex-shrink:0;margin-left:8px">';
    html += '<div style="font-size:15px;font-weight:800;color:var(--imperial)">' + o.amount + '</div>';
    html += '<span class="badge badge-sm" style="background:' + bc + '14;color:' + bc + '">' + o.stage + '</span>';
    html += '</div></div></div>';
  });

  html += '</div>';
  return html;
}

// ─── Tasks Builder ─────────────────────────────────────────────
function buildTasks() {
  var html = '<div class="card">';
  html += '<span class="section-title">✅ Mes tâches</span>';
  html += '<div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">';

  TASKS.forEach(function(t) {
    var pc = t.priority === "Haute" ? COLORS.red : t.priority === "Moyenne" ? COLORS.orange : COLORS.teal;
    var sc = BADGE_COLORS[t.status] || COLORS.text2;
    html += '<div class="hover-item-soft" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;border:1px solid var(--border)">';
    html += '<div class="priority-dot" style="background:' + pc + ';box-shadow:0 0 0 3px ' + pc + '18"></div>';
    html += '<div style="flex:1;min-width:0">';
    html += '<div style="font-size:12px;font-weight:600;color:var(--text)" class="text-ellipsis">' + t.subject + '</div>';
    html += '<div style="font-size:10px;color:var(--muted);margin-top:1px">' + t.relatedTo + ' · ' + t.dueDate + '</div>';
    html += '</div>';
    html += '<span class="badge badge-sm" style="background:' + sc + '14;color:' + sc + '">' + t.status + '</span>';
    html += '</div>';
  });

  html += '</div></div>';
  return html;
}

// ─── Leads Builder ─────────────────────────────────────────────
function buildLeads() {
  var html = '<div class="card">';
  html += '<div class="flex-between" style="margin-bottom:14px">';
  html += '<span class="section-title">🎯 Leads récents</span>';
  html += '<button class="btn-link sm" onclick="navigate(\'list\',\'leads\')">Tout →</button>';
  html += '</div>';

  LEADS.forEach(function(l) {
    var sc = BADGE_COLORS[l.status] || COLORS.text2;
    html += '<div class="hover-item-soft" style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;margin-bottom:8px;border-radius:12px;border:1px solid var(--border);cursor:pointer" onclick="navigate(\'record\',\'leads\',\'' + l.id + '\')">';
    html += '<div style="display:flex;align-items:center;gap:10px">';
    html += '<div class="lead-avatar">' + l.firstName[0] + l.lastName[0] + '</div>';
    html += '<div>';
    html += '<div style="font-size:12px;font-weight:600;color:var(--text)">' + l.firstName + ' ' + l.lastName + '</div>';
    html += '<div style="font-size:10px;color:var(--muted)">' + l.company + ' · ' + l.source + '</div>';
    html += '</div></div>';
    html += '<span class="badge badge-sm" style="background:' + sc + '14;color:' + sc + '">' + l.status + '</span>';
    html += '</div>';
  });

  html += '</div>';
  return html;
}
