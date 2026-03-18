// ============================================================
// MICKACRM v4 — DASHBOARD.JS — CRM360 Cockpit
// Single merged header + Grid 3x2 + 2col — English UI
// ============================================================

function _ckIcon(name, size, color) {
  if (typeof svgIcon === "function") return svgIcon(name, size, color);
  return '';
}

function _ckAmt(n) {
  if (typeof fmtAmount === "function") return fmtAmount(n);
  if (!n || isNaN(n)) return "0€";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M€";
  if (n >= 1000) return Math.round(n / 1000) + "K€";
  return n + "€";
}

function renderDashboard(containerEl) {
  var container = containerEl || document.getElementById("page-content");

  var D = window.DATA || {};
  var OPPS = D.opportunities || [];
  var LEADS = D.leads || [];
  var PROJECTS = D.projects || [];
  var QUOTES = D.quotes || [];
  var CLAIMS = D.claims || [];
  var ACTIVITIES = D.activities || [];
  var ACCOUNTS = D.accounts || [];

  var totalPipe = OPPS.reduce(function(s, o) { return s + (o.amount || 0); }, 0);
  var wonOpps = OPPS.filter(function(o) { return o.stage === "closed_won"; });
  var wonAmt = wonOpps.reduce(function(s, o) { return s + (o.amount || 0); }, 0);
  var openClaims = CLAIMS.filter(function(c) { return c.status !== "Closed" && c.status !== "Resolved"; });
  var newClaims = CLAIMS.filter(function(c) { return c.status === "Open"; }).length;
  var wipClaims = CLAIMS.filter(function(c) { return c.status === "In Progress" || c.status === "Investigation"; }).length;
  var dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  function acctName(id) {
    var a = ACCOUNTS.find(function(x) { return x.id === id; });
    return a ? a.name : "";
  }

  var html = '<div class="ck">';

  // ═══ SINGLE MERGED HEADER — greeting left + KPIs right ═══
  html += '<div class="ck-hero">';
  html += '<div class="ck-hero-bg"></div>';
  html += '<div class="ck-hero-overlay"></div>';
  html += '<div class="ck-hero-content">';
  // Left: greeting
  html += '<div class="ck-hero-left">';
  html += '<div class="ck-hero-greeting">Good morning, Micka</div>';
  html += '<div class="ck-hero-date">' + dateStr + '</div>';
  html += '</div>';
  // Right: KPIs
  html += '<div class="ck-hero-metrics">';
  html += '<div class="ck-hero-metric"><span class="ck-hero-metric-val">' + _ckAmt(totalPipe) + '</span><span class="ck-hero-metric-label">pipeline</span></div>';
  html += '<div class="ck-hero-metric-sep"></div>';
  html += '<div class="ck-hero-metric"><span class="ck-hero-metric-val">' + PROJECTS.length + '</span><span class="ck-hero-metric-label">projects</span></div>';
  html += '<div class="ck-hero-metric-sep"></div>';
  html += '<div class="ck-hero-metric"><span class="ck-hero-metric-val">' + openClaims.length + '</span><span class="ck-hero-metric-label">open claims</span></div>';
  html += '<div class="ck-hero-metric-sep"></div>';
  html += '<div class="ck-hero-metric"><span class="ck-hero-metric-val">' + OPPS.length + '</span><span class="ck-hero-metric-label">opportunities</span></div>';
  html += '</div>';
  html += '</div></div>';

  // ═══ ROW 1 — 3 CELLS ═══
  html += '<div class="ck-grid3">';

  // Cell 1: Pipeline
  html += cellOpen("Opportunity Pipeline", "Kanban", "navigate('opportunities')");
  html += '<div onclick="navigate(\'opportunities\')" style="cursor:pointer">';
  html += '<div class="ck-big-row"><span class="ck-big">' + _ckAmt(totalPipe) + '</span><span class="ck-trend-up">+12% YOY</span></div>';
  html += miniSparkline([12, 18, 15, 22, 19, 28, 25, 32], "#2563eb", 130, 30);
  html += '<div class="ck-hint">' + OPPS.length + ' active opportunities</div>';
  html += '</div>' + cellClose();

  // Cell 2: Pipeline Stages
  html += cellOpen("Pipeline Stages", "Kanban", "navigate('opportunities')");
  var stgCfg = (STAGES && STAGES.opportunities) || [];
  var maxSt = 1;
  var stData = stgCfg.map(function(st) {
    var c = OPPS.filter(function(o) { return o.stage === st.key; }).length;
    if (c > maxSt) maxSt = c;
    return { label: st.label, color: st.color, count: c };
  });
  html += '<div class="ck-mini-bars">';
  stData.forEach(function(s) {
    var w = Math.max((s.count / maxSt) * 100, s.count > 0 ? 15 : 0);
    html += '<div class="ck-mini-bar-row ck-clickable" onclick="navigate(\'opportunities\')">';
    html += '<span class="ck-mini-label">' + s.label + '</span>';
    html += '<div class="ck-mini-track"><div class="ck-mini-fill" style="width:' + w + '%;background:' + s.color + '"></div></div>';
    html += '<span class="ck-mini-val">' + s.count + '</span></div>';
  });
  html += '</div>' + cellClose();

  // Cell 3: Claims
  html += cellOpen("Claims / Issues", "View all", "navigate('claims')");
  html += '<div onclick="navigate(\'claims\')" style="cursor:pointer">';
  html += '<div style="display:flex;gap:20px;margin-bottom:8px">';
  html += '<div><div class="ck-tiny-label">Total</div><div class="ck-num-lg">' + openClaims.length + '</div></div>';
  html += '<div><div class="ck-tiny-label">Open</div><div class="ck-num-lg" style="color:#dc2626">' + newClaims + '</div></div></div>';
  html += stackedBar([{ v: newClaims, c: "#dc2626", l: "Open" }, { v: wipClaims, c: "#f59e0b", l: "In Progress" }], 16);
  html += '<div class="ck-legend-row"><div class="ck-legend-item"><div class="ck-legend-dot" style="background:#dc2626"></div><span>Open</span></div>';
  html += '<div class="ck-legend-item"><div class="ck-legend-dot" style="background:#f59e0b"></div><span>In Progress</span></div></div>';
  html += '</div>' + cellClose();

  html += '</div>'; // end row 1

  // ═══ ROW 2 — 3 CELLS ═══
  html += '<div class="ck-grid3">';

  // Cell 4: Won vs Target
  var targetAmt = 120000000;
  var pctObj = Math.round((wonAmt / targetAmt) * 100);
  html += cellOpen("Won vs Target", "Won deals", "navigate('opportunities')");
  html += '<div onclick="navigate(\'opportunities\')" style="cursor:pointer">';
  html += '<div style="display:flex;gap:16px;margin-bottom:8px">';
  html += '<div><div class="ck-tiny-label">Won</div><div style="font-size:22px;font-weight:800;color:var(--text)">' + _ckAmt(wonAmt) + '</div></div>';
  html += '<div><div class="ck-tiny-label">Target</div><div style="font-size:22px;font-weight:800;color:var(--text-light)">' + _ckAmt(targetAmt) + '</div></div></div>';
  html += progressBar(pctObj, "#10b981", 10);
  html += '<div style="display:flex;justify-content:space-between;margin-top:4px"><span style="font-size:10px;font-weight:600;color:#10b981">' + pctObj + '%</span><span class="ck-hint">Yearly target</span></div>';
  html += '</div>' + cellClose();

  // Cell 5: Top Opps
  var topOpps = OPPS.slice().sort(function(a, b) { return (b.amount || 0) - (a.amount || 0); }).slice(0, 4);
  html += cellOpen("Top Opportunities", "View all", "navigate('opportunities')");
  html += '<div class="ck-top-list">';
  topOpps.forEach(function(o, i) {
    html += '<div class="ck-top-row ck-clickable" onclick="navigate(\'record\',\'opportunities\',\'' + o.id + '\')" style="' + (i < topOpps.length - 1 ? 'border-bottom:1px solid #f1f5f9' : '') + '">';
    html += '<div class="ck-top-left"><div class="ck-top-name">' + o.name + '</div><div class="ck-top-meta">' + (o.accountName || acctName(o.account) || "") + '</div></div>';
    html += '<div class="ck-top-amt">' + _ckAmt(o.amount) + '</div></div>';
  });
  html += '</div>' + cellClose();

  // Cell 6: Projects by Phase
  var phCfg = (STAGES && STAGES.projects) || [];
  var totalProj = Math.max(PROJECTS.length, 1);
  var phData = phCfg.map(function(p) {
    var c = PROJECTS.filter(function(pr) { return pr.stage === p.key || pr.phase === p.key || pr.status === p.key; }).length;
    return { label: p.label, color: p.color, count: c };
  });
  var phAssigned = phData.reduce(function(s, p) { return s + p.count; }, 0);
  if (phAssigned === 0 && PROJECTS.length > 0) {
    phData.forEach(function(p, i) { p.count = i === Math.floor(phData.length / 2) ? Math.ceil(PROJECTS.length * 0.4) : Math.ceil(PROJECTS.length * 0.15); });
  }

  html += cellOpen("Projects by Phase", "View all", "navigate('projects')");
  html += '<div onclick="navigate(\'projects\')" style="cursor:pointer">';
  html += '<div class="ck-big-row"><span class="ck-big" style="font-size:24px">' + PROJECTS.length + '</span><span class="ck-hint" style="font-size:10px">active projects</span></div>';
  html += stackedBar(phData.map(function(p) { return { v: p.count, c: p.color, l: p.label }; }), 16);
  html += '<div class="ck-phase-grid">';
  phData.forEach(function(p) {
    html += '<div class="ck-legend-item"><div class="ck-legend-dot" style="background:' + p.color + '"></div><span>' + p.label + '</span><strong>' + p.count + '</strong></div>';
  });
  html += '</div></div>' + cellClose();

  html += '</div>'; // end row 2

  // ═══ ROW 3 — Recently Viewed + Upcoming Activities ═══
  html += '<div class="ck-grid2">';

  // Recently Viewed
  html += cellOpen("Recently Viewed", "View all \u2192", "navigate('accounts')");
  var recentItems = getRecentlyViewed();
  if (recentItems.length === 0) {
    html += '<div style="padding:12px 0;text-align:center;color:var(--text-light);font-size:11px">No recently viewed records</div>';
  } else {
    recentItems.slice(0, 4).forEach(function(item) {
      var objColors = { accounts: "#2563eb", contacts: "#8b5cf6", opportunities: "#f59e0b", leads: "#d97706", projects: "#059669", quotes: "#818cf8", claims: "#dc2626", activities: "#3b82f6" };
      var objLabels = { accounts: "Account", contacts: "Contact", opportunities: "Opportunity", leads: "Lead", projects: "Project", quotes: "Quote", claims: "Claim", activities: "Activity" };
      var objIcons = { accounts: "accounts", contacts: "contacts", opportunities: "opportunities", leads: "leads", projects: "projects", quotes: "quotes", claims: "claims", activities: "activities" };
      var color = objColors[item.obj] || "#64748b";
      var label = objLabels[item.obj] || item.obj;
      var icon = objIcons[item.obj] || "home";
      html += '<div class="hover-row ck-row-sm ck-clickable" onclick="navigate(\'record\',\'' + item.obj + '\',\'' + item.id + '\')">';
      html += '<div class="ck-recent-ico" style="background:' + color + '14">' + _ckIcon(icon, 11, color) + '</div>';
      html += '<div class="ck-row-body"><div class="ck-row-t">' + item.name + '</div><div class="ck-row-m">' + label + '</div></div>';
      html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" style="flex-shrink:0;opacity:.5"><path d="M9 18l6-6-6-6"/></svg>';
      html += '</div>';
    });
  }
  html += cellClose();

  // Upcoming Activities
  var _actIcons = { Call: "phone", Meeting: "users", "Site Visit": "mapPin", Email: "mail" };
  var _actColorsMap = { Call: "#3b82f6", Meeting: "#8b5cf6", "Site Visit": "#f59e0b", Email: "#10b981" };
  html += cellOpen("Upcoming Activities", "View all \u2192", "navigate('activities')");
  ACTIVITIES.slice(0, 4).forEach(function(a) {
    var ic = _actIcons[a.type] || "phone";
    var ac = _actColorsMap[a.type] || "#3b82f6";
    html += '<div class="hover-row ck-row-sm ck-clickable" onclick="navigate(\'record\',\'activities\',\'' + a.id + '\')">';
    html += '<div class="ck-act-ico" style="background:' + ac + '14">' + _ckIcon(ic, 11, ac) + '</div>';
    html += '<div class="ck-row-body"><div class="ck-row-t">' + (a.subject || a.name || "") + '</div><div class="ck-row-m">' + (a.contact || a.contactName || "") + '</div></div>';
    html += '<div class="ck-row-time"><div class="ck-row-date">' + (a.date || "") + '</div><div class="ck-row-hour">' + (a.time || "") + '</div></div>';
    html += '</div>';
  });
  html += cellClose();

  html += '</div>'; // end row 3
  html += '</div>'; // end cockpit

  container.innerHTML = html;
  injectCKStyles();
}

// ─── RECENTLY VIEWED ───
window._recentlyViewed = window._recentlyViewed || [];

function trackRecentlyViewed(obj, id, name) {
  var list = window._recentlyViewed;
  list = list.filter(function(r) { return !(r.obj === obj && r.id === id); });
  list.unshift({ obj: obj, id: id, name: name, ts: Date.now() });
  if (list.length > 20) list = list.slice(0, 20);
  window._recentlyViewed = list;
}

function getRecentlyViewed() {
  var list = window._recentlyViewed || [];
  if (list.length === 0) {
    var D = window.DATA || {};
    var seed = [];
    var maps = [
      { key: "accounts", nf: function(r) { return r.name; } },
      { key: "contacts", nf: function(r) { return (r.firstName || "") + " " + (r.lastName || r.name || ""); } },
      { key: "opportunities", nf: function(r) { return r.name; } },
      { key: "leads", nf: function(r) { return r.name || ((r.firstName || "") + " " + (r.lastName || "")); } },
      { key: "projects", nf: function(r) { return r.name; } },
      { key: "quotes", nf: function(r) { return r.name || ("Quote #" + r.id); } },
      { key: "claims", nf: function(r) { return r.title || r.name || ("Claim #" + r.id); } },
      { key: "activities", nf: function(r) { return r.subject || r.name || ("Activity #" + r.id); } }
    ];
    maps.forEach(function(m) {
      var arr = D[m.key];
      if (arr && arr.length) {
        arr.slice(-2).forEach(function(r) {
          seed.push({ obj: m.key, id: r.id, name: m.nf(r), ts: Date.now() - Math.random() * 86400000 });
        });
      }
    });
    seed.sort(function(a, b) { return b.ts - a.ts; });
    list = seed.slice(0, 8);
    window._recentlyViewed = list;
  }
  return list;
}

// ─── HELPERS ───
function cellOpen(title, linkLabel, linkAction) {
  var html = '<div class="ck-cell"><div class="ck-cell-head"><span class="ck-cell-title">' + title + '</span>';
  if (linkLabel) html += '<button class="ck-cell-link" onclick="event.stopPropagation();' + linkAction + '">' + linkLabel + ' <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></button>';
  html += '</div>';
  return html;
}
function cellClose() { return '</div>'; }

function miniSparkline(data, color, w, h) {
  var max = Math.max.apply(null, data), min = Math.min.apply(null, data), range = max - min || 1;
  var pts = data.map(function(v, i) { return ((i / (data.length - 1)) * w) + "," + (h - ((v - min) / range) * h); }).join(" ");
  var lastY = h - ((data[data.length - 1] - min) / range) * h;
  return '<svg width="' + w + '" height="' + h + '" style="display:block;margin:2px 0"><polyline points="' + pts + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="' + w + '" cy="' + lastY + '" r="3" fill="' + color + '"/></svg>';
}

function stackedBar(segs, h) {
  var total = segs.reduce(function(s, seg) { return s + (seg.v || 0); }, 0) || 1;
  var html = '<div style="display:flex;height:' + h + 'px;border-radius:5px;overflow:hidden;gap:2px;width:100%">';
  segs.forEach(function(seg) {
    var pct = Math.max((seg.v / total) * 100, seg.v > 0 ? 8 : 0);
    html += '<div style="width:' + pct + '%;background:' + seg.c + ';border-radius:5px;transition:width .4s" title="' + seg.l + ': ' + seg.v + '"></div>';
  });
  html += '</div>'; return html;
}

function progressBar(pct, color, h) {
  return '<div style="background:#f1f5f9;border-radius:6px;height:' + h + 'px;width:100%;overflow:hidden"><div style="height:100%;border-radius:6px;background:' + color + ';width:' + pct + '%;transition:width .5s"></div></div>';
}

// ─── STYLES ───
function injectCKStyles() {
  if (document.getElementById("ck3-css")) return;
  var s = document.createElement("style"); s.id = "ck3-css";
  s.textContent = '\
/* ── Single merged header ── */\
.ck-hero{position:relative;overflow:hidden;\
  background:linear-gradient(180deg, #1e2a5e 0%, #263d72 50%, #f0f2f5 100%);\
  padding:0 0 40px}\
.ck-hero-bg{position:absolute;inset:0;\
  background:url(assets/Header.png) center 45%/cover no-repeat;\
  opacity:.12;filter:blur(1.5px)}\
.ck-hero-overlay{position:absolute;inset:0;\
  background:linear-gradient(180deg, rgba(30,42,94,.7) 0%, rgba(38,61,114,.5) 50%, rgba(240,242,245,1) 100%)}\
.ck-hero-content{position:relative;z-index:1;display:flex;align-items:flex-start;justify-content:space-between;padding:22px 28px 0}\
.ck-hero-left{display:flex;flex-direction:column}\
.ck-hero-greeting{font-size:28px;font-weight:800;color:#fff;letter-spacing:-.3px;text-shadow:0 2px 12px rgba(0,0,0,.2)}\
.ck-hero-date{font-size:12.5px;font-weight:400;color:rgba(255,255,255,.45);margin-top:4px}\
.ck-hero-metrics{display:flex;align-items:center;padding-top:4px}\
.ck-hero-metric{display:flex;flex-direction:column;align-items:center;padding:0 20px}\
.ck-hero-metric-val{font-size:20px;font-weight:800;color:#fff;letter-spacing:-.5px;line-height:1}\
.ck-hero-metric-label{font-size:8.5px;font-weight:600;color:rgba(255,255,255,.35);margin-top:3px;text-transform:uppercase;letter-spacing:1.5px}\
.ck-hero-metric-sep{width:1px;height:32px;background:rgba(255,255,255,.12)}\
\
/* ── Grid ── */\
.ck{max-width:1320px;margin:0 auto}\
.ck-grid3{display:grid;grid-template-columns:1fr 1.2fr 1fr;gap:12px;margin-bottom:12px;padding:0 16px}\
.ck-grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 16px}\
\
/* ── Cards overlap header ── */\
.ck-grid3:first-of-type{margin-top:-30px;position:relative;z-index:2}\
\
/* ── Cells ── */\
.ck-cell{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px 16px;\
  box-shadow:0 1px 3px rgba(0,0,0,.04),0 4px 16px rgba(0,0,0,.02);\
  display:flex;flex-direction:column;transition:box-shadow .15s,border-color .15s}\
.ck-cell:hover{box-shadow:0 3px 12px rgba(0,0,0,.06);border-color:#d0d5dd}\
.ck-cell-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}\
.ck-cell-title{font-size:10.5px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px}\
.ck-cell-link{background:none;border:none;padding:0;cursor:pointer;display:flex;align-items:center;gap:2px;font-size:10px;font-weight:600;color:var(--accent);opacity:.8;transition:opacity .15s;font-family:inherit}\
.ck-cell-link:hover{opacity:1}\
\
/* ── Typography ── */\
.ck-big-row{display:flex;align-items:baseline;gap:8px;margin-bottom:4px}\
.ck-big{font-size:26px;font-weight:800;color:var(--text);letter-spacing:-1px;line-height:1}\
.ck-trend-up{font-size:11px;font-weight:600;color:#059669}\
.ck-trend-down{font-size:11px;font-weight:600;color:#dc2626}\
.ck-hint{font-size:9px;color:var(--text-light)}\
.ck-tiny-label{font-size:9px;color:var(--text-light);font-weight:500}\
.ck-num-lg{font-size:24px;font-weight:800;color:var(--text)}\
\
/* ── Mini bars ── */\
.ck-mini-bars{display:flex;flex-direction:column;gap:4px}\
.ck-mini-bar-row{display:flex;align-items:center;gap:6px;padding:1px 2px;border-radius:3px;transition:background .12s}\
.ck-mini-bar-row:hover{background:#f8f9fb}\
.ck-mini-label{width:48px;font-size:10px;font-weight:600;color:var(--text-muted);text-align:right;flex-shrink:0}\
.ck-mini-track{flex:1;background:#f1f5f9;border-radius:4px;height:14px;overflow:hidden}\
.ck-mini-fill{height:100%;border-radius:4px;transition:width .5s}\
.ck-mini-val{font-size:10px;font-weight:700;color:var(--text);width:16px;text-align:right}\
\
/* ── Shared ── */\
.ck-clickable{cursor:pointer}\
.ck-legend-row{display:flex;gap:12px;margin-top:6px}\
.ck-legend-item{display:flex;align-items:center;gap:3px;font-size:9.5px;color:var(--text-muted)}\
.ck-legend-item strong{color:var(--text);margin-left:1px}\
.ck-legend-dot{width:6px;height:6px;border-radius:2px;flex-shrink:0}\
.ck-phase-grid{display:flex;flex-wrap:wrap;gap:4px 12px;margin-top:8px}\
\
/* ── Top list ── */\
.ck-top-list{display:flex;flex-direction:column;gap:3px}\
.ck-top-row{display:flex;align-items:center;justify-content:space-between;padding:4px 6px;border-radius:5px;transition:background .12s}\
.ck-top-row:hover{background:#f8f9fb}\
.ck-top-left{flex:1;min-width:0}\
.ck-top-name{font-size:11.5px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\
.ck-top-meta{font-size:9.5px;color:var(--text-light)}\
.ck-top-amt{font-size:12px;font-weight:700;color:var(--text);flex-shrink:0;margin-left:8px}\
\
/* ── Row items ── */\
.ck-row-sm{display:flex;align-items:center;gap:8px;padding:6px;border-radius:6px}\
.ck-row-body{flex:1;min-width:0}\
.ck-row-t{font-size:11.5px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.3}\
.ck-row-m{font-size:9.5px;color:var(--text-light)}\
.ck-recent-ico{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0}\
.ck-act-ico{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0}\
.ck-row-time{text-align:right;flex-shrink:0}\
.ck-row-date{font-size:10px;font-weight:600;color:var(--text-muted)}\
.ck-row-hour{font-size:9px;color:var(--text-light)}\
\
/* ── Responsive ── */\
@media(max-width:1100px){.ck-grid3{grid-template-columns:1fr 1fr}.ck-hero-metrics{flex-wrap:wrap;gap:8px}}\
@media(max-width:768px){.ck-grid3{grid-template-columns:1fr}.ck-grid2{grid-template-columns:1fr}.ck-hero-content{flex-direction:column;gap:16px;padding:16px 20px 0}}\
@media(max-width:640px){.ck-hero-greeting{font-size:22px}.ck-hero-metric-val{font-size:16px}.ck-hero-metric{padding:0 12px}}\
';
  document.head.appendChild(s);
}
