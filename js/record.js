// ============================================================
// MICKACRM 360 v3 — RECORD.JS — Account 360 + Generic Record
// ============================================================

function renderRecord(objKey, recId) {
  var container = document.getElementById("main-content");
  var obj = OBJ[objKey];
  var rec = findRecord(objKey, recId);
  if (!rec) { container.innerHTML = '<div style="padding:40px;color:var(--muted);text-align:center">Not found</div>'; return; }

  // Account 360 layout
  if (objKey === "accounts") {
    renderAccount360(container, rec);
    return;
  }

  // Generic record layout for all other objects
  renderGenericRecord(container, objKey, recId, obj, rec);
}

// ════════════════════════════════════════════════════════════
// ACCOUNT 360 — Premium Customer 360 View
// ════════════════════════════════════════════════════════════

function renderAccount360(container, rec) {
  injectA360Styles();

  var accName = rec.name;
  var accId = rec.id;
  var initials = accName.split(" ").map(function(w){return w[0];}).join("").substring(0,2).toUpperCase();

  // ─── Gather related data ───
  var contacts = CONTACTS.filter(function(c){ return c.accountId === accId; });
  var opps = OPPORTUNITIES.filter(function(o){ return o.accountId === accId; });
  var quotes = QUOTES.filter(function(q){ return q.accountName === accName; });
  var projects = PROJECTS.filter(function(p){ return p.accountId === accId; });
  var activities = ACTIVITIES.filter(function(a){ return a.accountName === accName; });
  var cases = typeof CASES !== "undefined" ? CASES.filter(function(c){ return c.accountName === accName; }) : [];
  var tasks = TASKS.filter(function(t){ return t.relatedTo === accName; });
  var openCases = cases.filter(function(c){ return c.status !== "Resolved" && c.status !== "Closed"; });

  // ─── Computed metrics ───
  var totalPipe = opps.reduce(function(s,o){ return s + (o.amountNum || 0); }, 0);

  // ─── Build HTML ───
  var h = '<div class="a360" style="animation:fadeSlide .2s ease">';

  // ═══ HEADER CARD ═══
  h += '<div class="a360-header-card">';

  // Row 1: avatar + name + metrics
  h += '<div class="a360-header-top">';
  h += '<div class="a360-avatar">' + initials + '</div>';
  h += '<div class="a360-header-info">';
  h += '<div class="a360-name-row"><h1 class="a360-name">' + accName + '</h1>' + createBadge(rec.status) + '</div>';
  h += '<div class="a360-meta">';
  h += '<span>' + (rec.industry || "—") + '</span><span class="a360-dot">·</span>';
  h += '<span>' + (rec.city || "—") + '</span><span class="a360-dot">·</span>';
  h += '<span>Owned by ' + (rec.owner || "—") + '</span><span class="a360-dot">·</span>';
  h += '<span class="a360-link">' + (rec.website || "—") + '</span>';
  h += '</div></div>';

  // Inline header metrics
  h += '<div class="a360-header-metrics">';
  h += a360HeaderMetric(totalPipe.toFixed(1) + "M€", "Pipeline", "#2563eb");
  h += a360HeaderMetric(projects.length, "Projects", "");
  h += a360HeaderMetric(quotes.length, "Quotes", "");
  h += a360HeaderMetric(openCases.length, "Claims", openCases.length > 0 ? "#c43025" : "");
  h += '</div>';
  h += '</div>'; // end header-top

  // Row 2: quick actions + client since
  h += '<div class="a360-header-actions">';
  h += '<div class="a360-qa-row">';
  h += a360QA("user", "Contact");
  h += a360QA("briefcase", "Opportunity");
  h += a360QA("file", "Quote");
  h += a360QA("clock", "Activity");
  h += a360QA("layers", "Project");
  h += '</div>';
  h += '<span class="a360-since">Client since ' + (rec.created || "—") + '</span>';
  h += '</div>';

  // Row 3: detail fields
  h += '<div class="a360-header-fields">';
  h += a360Field("Phone", rec.phone);
  h += a360Field("Revenue", rec.revenue);
  h += a360Field("Employees", rec.employees ? rec.employees.toLocaleString() : "—");
  h += a360Field("Created", rec.created);
  h += '<div class="a360-field a360-field-wide">' + a360FieldInner("Address", rec.address) + '</div>';
  h += '</div>';

  h += '</div>'; // end header card

  // ═══ KPI CARDS ═══
  h += '<div class="a360-kpi-grid">';
  h += a360Kpi(opps.length, "Open Opportunities", "briefcase", "+1 this month", "positive");
  h += a360Kpi(quotes.length, "Quotes in Progress", "file", quotes.length > 0 ? "1 expiring soon" : "No quotes", quotes.length > 0 ? "warning" : "neutral");
  h += a360Kpi(projects.length, "Active Projects", "layers", projects.length > 0 ? "On track" : "No projects", "neutral");
  h += a360Kpi(openCases.length, "Open Claims", "wrench", openCases.length > 0 ? "Needs attention" : "All clear", openCases.length > 0 ? "warning" : "positive");
  h += a360Kpi(activities.length, "Recent Activities", "clock", activities.length > 0 ? "Last: " + activities[0].date : "No recent activity", "neutral");
  h += '</div>';

  // ═══ 2-COLUMN GRID ═══
  h += '<div class="a360-grid2">';

  // ─── LEFT COLUMN ───
  h += '<div class="a360-col">';

  // Opportunities
  h += a360SectionOpen("Opportunities", "briefcase", opps.length);
  if (opps.length === 0) {
    h += '<div class="a360-empty">No opportunities</div>';
  } else {
    opps.forEach(function(o, i) {
      h += '<div class="a360-row' + (i === opps.length - 1 ? " a360-row-last" : "") + '" data-obj="opportunities" data-id="' + o.id + '">';
      h += '<div class="a360-row-left"><div class="a360-row-title">' + o.name + '</div>';
      h += '<div class="a360-row-sub">Close ' + o.closeDate + ' · Probability ' + o.probability + '%</div></div>';
      h += '<div class="a360-row-right"><div class="a360-row-amount">' + o.amount + '</div>' + createBadge(o.stage) + '</div>';
      h += '</div>';
      // Stage progress dots
      h += a360StageDots(o.stage);
    });
  }
  h += a360SectionClose();

  // Quotes
  h += a360SectionOpen("Quotes", "file", quotes.length);
  if (quotes.length === 0) {
    h += '<div class="a360-empty">No quotes</div>';
  } else {
    quotes.forEach(function(q, i) {
      h += '<div class="a360-row' + (i === quotes.length - 1 ? " a360-row-last" : "") + '" data-obj="quotes" data-id="' + q.id + '">';
      h += '<div class="a360-row-left"><div class="a360-row-title">' + q.name + '</div>';
      h += '<div class="a360-row-sub">Valid until ' + q.validUntil + '</div></div>';
      h += '<div class="a360-row-right"><div class="a360-row-amount">' + q.amount + '</div>' + createBadge(q.status) + '</div>';
      h += '</div>';
    });
  }
  h += a360SectionClose();

  // Projects
  h += a360SectionOpen("Projects", "layers", projects.length);
  if (projects.length === 0) {
    h += '<div class="a360-empty">No projects</div>';
  } else {
    projects.forEach(function(p, i) {
      h += '<div class="a360-row' + (i === projects.length - 1 ? " a360-row-last" : "") + '" data-obj="projects" data-id="' + p.id + '">';
      h += '<div class="a360-row-left"><div class="a360-row-title">' + p.name + '</div>';
      h += '<div class="a360-row-sub">' + (p.phase || "—") + '</div></div>';
      h += '<div class="a360-row-right"><div class="a360-row-amount">' + (p.budget || "—") + '</div>' + createBadge(p.status) + '</div>';
      h += '</div>';
    });
  }
  h += a360SectionClose();

  h += '</div>'; // end left col

  // ─── RIGHT COLUMN ───
  h += '<div class="a360-col">';

  // Key Contacts
  h += a360SectionOpen("Key Contacts", "user", contacts.length);
  if (contacts.length === 0) {
    h += '<div class="a360-empty">No contacts</div>';
  } else {
    contacts.forEach(function(c, i) {
      var ci = (c.firstName ? c.firstName[0] : "") + (c.lastName ? c.lastName[0] : "");
      var cName = (c.firstName || "") + " " + (c.lastName || "");
      h += '<div class="a360-row' + (i === contacts.length - 1 ? " a360-row-last" : "") + '" data-obj="contacts" data-id="' + c.id + '">';
      h += '<div class="a360-contact-avatar">' + ci + '</div>';
      h += '<div class="a360-row-left" style="flex:1;min-width:0"><div class="a360-row-title">' + cName + '</div>';
      h += '<div class="a360-row-sub">' + (c.title || "—") + '</div></div>';
      h += '<div class="a360-contact-actions">';
      h += '<div class="a360-contact-btn" title="Call">' + renderIcon("phone", 12, "#88888d") + '</div>';
      h += '<div class="a360-contact-btn" title="Email">' + renderIcon("mail", 12, "#88888d") + '</div>';
      h += '</div></div>';
    });
  }
  h += a360SectionClose();

  // Recent Activities (timeline)
  h += a360SectionOpen("Recent Activities", "clock", activities.length);
  if (activities.length === 0) {
    h += '<div class="a360-empty">No activities</div>';
  } else {
    h += '<div class="a360-timeline">';
    activities.slice(0, 6).forEach(function(a, i) {
      var isLast = i === Math.min(activities.length, 6) - 1;
      h += '<div class="a360-tl-item">';
      if (!isLast) h += '<div class="a360-tl-line"></div>';
      h += '<div class="a360-tl-dot"></div>';
      h += '<div class="a360-tl-body">';
      h += '<div class="a360-tl-top"><span class="a360-tl-subject">' + a.subject + '</span>';
      h += '<span class="a360-tl-date">' + a.date + '</span></div>';
      h += '<div class="a360-tl-meta"><span class="a360-tl-type">' + a.type + '</span> · ' + (a.contactName || "—") + ' · ' + (a.time || "") + '</div>';
      h += '</div></div>';
    });
    h += '</div>';
  }
  h += a360SectionClose();

  // Open Claims
  h += a360SectionOpen("Open Claims", "wrench", openCases.length);
  if (openCases.length === 0) {
    h += '<div class="a360-empty">No open claims</div>';
  } else {
    openCases.forEach(function(cs, i) {
      h += '<div class="a360-row' + (i === openCases.length - 1 ? " a360-row-last" : "") + '" data-obj="cases" data-id="' + cs.id + '">';
      h += '<div class="a360-row-left"><div class="a360-row-title">' + cs.subject + '</div>';
      h += '<div style="display:flex;gap:4px;margin-top:4px">' + createBadge(cs.type) + createBadge(cs.priority) + '</div></div>';
      h += '<div class="a360-row-right" style="flex-direction:column;align-items:flex-end">' + createBadge(cs.status);
      h += '<div style="font-size:9px;color:#88888d;margin-top:3px">' + (cs.created || "") + '</div></div>';
      h += '</div>';
    });
  }
  h += a360SectionClose();

  // Tasks (if any)
  if (tasks.length > 0) {
    h += a360SectionOpen("Tasks", "check", tasks.length);
    tasks.forEach(function(t, i) {
      h += '<div class="a360-row' + (i === tasks.length - 1 ? " a360-row-last" : "") + '" data-obj="tasks" data-id="' + t.id + '">';
      h += '<div class="a360-row-left"><div class="a360-row-title">' + t.subject + '</div>';
      h += '<div class="a360-row-sub">Due ' + t.dueDate + '</div></div>';
      h += '<div class="a360-row-right">' + createBadge(t.priority) + createBadge(t.status) + '</div>';
      h += '</div>';
    });
    h += a360SectionClose();
  }

  h += '</div>'; // end right col
  h += '</div>'; // end grid2
  h += '</div>'; // end a360

  container.innerHTML = h;

  // ─── Bind click events ───
  container.querySelectorAll(".a360-row[data-id]").forEach(function(el) {
    el.onclick = function() {
      var oK = el.getAttribute("data-obj"), rId = el.getAttribute("data-id");
      if (oK && rId) navigate("record", oK, rId);
    };
  });
  container.querySelectorAll(".a360-section-link").forEach(function(el) {
    el.onclick = function() {
      var oK = el.getAttribute("data-nav");
      if (oK) navigate("list", oK);
    };
  });
  container.querySelectorAll(".a360-kpi-card").forEach(function(el) {
    el.onclick = function() {
      var oK = el.getAttribute("data-nav");
      if (oK) navigate("list", oK);
    };
  });
}

// ─── Account 360 HTML helpers ──────────────────────────────

function a360HeaderMetric(value, label, accent) {
  var colorStyle = accent ? 'color:' + accent : 'color:var(--text)';
  return '<div class="a360-hmetric"><div class="a360-hmetric-val" style="' + colorStyle + '">' + value + '</div><div class="a360-hmetric-label">' + label + '</div></div>';
}

function a360QA(icon, label) {
  return '<button class="a360-qa">' + renderIcon(icon, 12, "#b0b0b5") + '<span>' + label + '</span></button>';
}

function a360Field(label, value) {
  return '<div class="a360-field">' + a360FieldInner(label, value) + '</div>';
}

function a360FieldInner(label, value) {
  return '<div class="a360-field-label">' + label + '</div><div class="a360-field-value">' + (value || "—") + '</div>';
}

function a360Kpi(value, label, icon, insight, insightType) {
  var navMap = { briefcase:"opportunities", file:"quotes", layers:"projects", wrench:"cases", clock:"activities" };
  var navTarget = navMap[icon] || "";
  var insightColor = insightType === "positive" ? "#4ade80" : insightType === "warning" ? "#f87171" : "#64748b";

  var html = '<div class="a360-kpi-card" data-nav="' + navTarget + '">';
  html += '<div class="a360-kpi-top">' + renderIcon(icon, 15, "#64748b") + '<span class="a360-kpi-view">View all</span></div>';
  html += '<div class="a360-kpi-value">' + value + '</div>';
  html += '<div class="a360-kpi-label">' + label + '</div>';
  if (insight) {
    html += '<div class="a360-kpi-insight"><span class="a360-kpi-insight-dot" style="background:' + insightColor + '"></span><span style="color:' + insightColor + '">' + insight + '</span></div>';
  }
  html += '</div>';
  return html;
}

function a360SectionOpen(title, icon, count) {
  var navMap = { briefcase:"opportunities", file:"quotes", layers:"projects", user:"contacts", clock:"activities", wrench:"cases", check:"tasks" };
  var navTarget = navMap[icon] || "";
  var html = '<div class="a360-section">';
  html += '<div class="a360-section-head">';
  html += renderIcon(icon, 13, "#4a4a4f") + '<span class="a360-section-title">' + title + '</span>';
  if (count !== undefined) html += '<span class="a360-section-count">' + count + '</span>';
  html += '<span class="a360-section-link" data-nav="' + navTarget + '">View all ' + renderIcon("chevRight", 10, "#88888d") + '</span>';
  html += '</div>';
  return html;
}

function a360SectionClose() {
  return '</div>';
}

function a360StageDots(stage) {
  var stages = ["Lead","Study","Tender","Proposal","Negotiation","Closed Won"];
  var idx = stages.indexOf(stage);
  var html = '<div class="a360-stage-dots" style="padding:0 16px 10px">';
  stages.forEach(function(s, i) {
    var active = i <= idx;
    var opacity = active ? (0.25 + (i / (stages.length - 1)) * 0.75) : 1;
    html += '<div class="a360-stage-dot" style="background:' + (active ? "#2563eb" : "#e8e8eb") + ';opacity:' + opacity + '" title="' + s + '"></div>';
  });
  html += '</div>';
  return html;
}

// ════════════════════════════════════════════════════════════
// GENERIC RECORD — For all non-account objects
// ════════════════════════════════════════════════════════════

function renderGenericRecord(container, objKey, recId, obj, rec) {
  var fields = Object.entries(rec).filter(function(e){return e[0]!=="id"&&e[0]!=="amountNum";});
  var related = getRelatedRecords(objKey, rec);
  var html = '<div class="record-layout" style="animation:fadeSlide .2s ease">';

  // Left: fields
  html += '<div class="record-card"><div class="record-header">' + renderObjIcon(objKey,22,COLORS.text2) + '<div><div style="font-size:16px;font-weight:700;color:var(--text)">' + getRecordName(rec) + '</div><div style="font-size:11px;color:var(--muted)">' + obj.label + '</div></div></div>';
  html += '<div class="record-fields">';
  fields.forEach(function(f) {
    var k=f[0], v=f[1];
    var isFullWidth = (obj.fullWidthFields && obj.fullWidthFields.indexOf(k)>=0) || k==="notes" || k==="address";
    html += '<div' + (isFullWidth?' class="field-full"':'') + '>';
    html += '<div class="field-label">' + (FIELD_LABELS[k]||k) + '</div>';
    html += '<div class="field-value">' + (isBadgeField(k)&&v ? createBadge(v) : formatFieldValue(k,v)) + '</div></div>';
  });
  html += '</div></div>';

  // Right: related
  html += '<div style="display:flex;flex-direction:column;gap:12px">';

  // New Activity button
  html += '<button class="btn-new-activity-record" id="rec-new-activity">' + renderIcon("clock",14,"#fff") + ' New Activity</button>';

  var hasRelated = false;
  if (related.contacts && related.contacts.length) { hasRelated=true; html += buildRelCard("Contacts","user",related.contacts.map(function(c){return{id:c.id,name:c.firstName+" "+c.lastName,sub:c.title,objKey:"contacts"};})); }
  if (related.opportunities && related.opportunities.length) { hasRelated=true; html += buildRelCard("Opportunities","briefcase",related.opportunities.map(function(o){return{id:o.id,name:o.name,sub:o.amount+" · "+o.stage,objKey:"opportunities"};})); }
  if (related.quotes && related.quotes.length) { hasRelated=true; html += buildRelCard("Quotes","file",related.quotes.map(function(q){return{id:q.id,name:q.name,sub:q.amount+" · "+q.status,objKey:"quotes"};})); }
  if (related.activities && related.activities.length && objKey !== "activities") { hasRelated=true; html += buildRelCard("Activities","phone",related.activities.map(function(a){return{id:a.id,name:a.subject,sub:a.type+" · "+a.date,objKey:"activities"};})); }
  if (related.tasks && related.tasks.length) { hasRelated=true; html += buildRelCard("Tasks","check",related.tasks.map(function(t){return{id:t.id,name:t.subject,sub:t.priority+" · "+t.status,objKey:"tasks"};})); }
  if (!hasRelated) html += '<div class="record-card" style="padding:24px;color:var(--muted);font-size:12px;text-align:center">No related data</div>';
  html += '</div></div>';
  container.innerHTML = html;

  container.querySelectorAll(".rel-card-item.clickable").forEach(function(el) {
    el.onclick = function() { var oK=el.getAttribute("data-obj"),rId=el.getAttribute("data-id"); if(oK&&rId)navigate("record",oK,rId); };
  });

  var newActBtn = document.getElementById("rec-new-activity");
  if (newActBtn) {
    newActBtn.onclick = function() { openActivityFromRecord(objKey, recId); };
  }
}

function buildRelCard(title, iconName, items) {
  var html = '<div class="rel-card"><div class="rel-card-header">' + renderIcon(iconName,14,COLORS.text2) + title + '<span style="margin-left:auto;font-size:10px;color:var(--muted);font-weight:400">' + items.length + '</span></div>';
  items.forEach(function(it,i) {
    var clickable = it.objKey ? ' clickable" data-obj="' + it.objKey + '" data-id="' + it.id : '';
    html += '<div class="rel-card-item' + clickable + '">';
    html += '<div style="font-size:12px;font-weight:600;color:var(--primary)">' + it.name + '</div>';
    html += '<div style="font-size:10.5px;color:var(--muted);margin-top:1px">' + it.sub + '</div></div>';
  });
  html += '</div>';
  return html;
}

// ════════════════════════════════════════════════════════════
// ACCOUNT 360 CSS — Injected once
// ════════════════════════════════════════════════════════════

function injectA360Styles() {
  if (document.getElementById("a360-css")) return;
  var s = document.createElement("style");
  s.id = "a360-css";
  s.textContent = '\
.a360{max-width:1140px;margin:0 auto}\
\
.a360-header-card{background:var(--white);border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 0 0 1px rgba(0,0,0,.03);border:1px solid #e0e0e3;margin-bottom:14px;overflow:hidden}\
.a360-header-top{padding:18px 22px;display:flex;gap:16px;align-items:center}\
.a360-avatar{width:52px;height:52px;border-radius:10px;background:#f0f0f2;border:1.5px solid #e0e0e3;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:17px;font-weight:800;color:#4a4a4f;letter-spacing:-.5px}\
.a360-header-info{flex:1;min-width:0}\
.a360-name-row{display:flex;align-items:center;gap:10px;margin-bottom:5px}\
.a360-name{font-size:24px;font-weight:800;color:#111;letter-spacing:-.6px;margin:0;line-height:1}\
.a360-meta{display:flex;gap:14px;font-size:11.5px;color:#4a4a4f;flex-wrap:wrap}\
.a360-dot{color:#b0b0b5}\
.a360-link{color:#2563eb;font-weight:500}\
\
.a360-header-metrics{display:flex;align-items:center;flex-shrink:0}\
.a360-hmetric{display:flex;flex-direction:column;align-items:center;padding:0 16px;border-left:1px solid #eaeaed}\
.a360-hmetric-val{font-size:18px;font-weight:800;letter-spacing:-.5px;line-height:1;font-variant-numeric:tabular-nums}\
.a360-hmetric-label{font-size:9px;color:#88888d;font-weight:500;margin-top:2px;text-transform:uppercase;letter-spacing:.3px}\
\
.a360-header-actions{padding:10px 22px;border-top:1px solid #eaeaed;display:flex;justify-content:space-between;align-items:center}\
.a360-qa-row{display:flex;gap:6px}\
.a360-qa{display:flex;align-items:center;gap:5px;background:transparent;border:1px solid #e0e0e3;padding:5px 11px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:500;color:#4a4a4f;font-family:var(--font);transition:all .12s}\
.a360-qa:hover{background:#f0f0f2;border-color:#ccc;color:#111}\
.a360-qa:hover svg{stroke:#111}\
.a360-since{font-size:10px;color:#88888d}\
\
.a360-header-fields{padding:10px 22px;border-top:1px solid #eaeaed;display:grid;grid-template-columns:1fr 1fr 1fr 1fr 2fr;gap:14px;background:#fafafa}\
.a360-field{}\
.a360-field-wide{grid-column:span 2}\
.a360-field-label{font-size:8.5px;font-weight:700;color:#b0b0b5;text-transform:uppercase;letter-spacing:.7px;margin-bottom:2px}\
.a360-field-value{font-size:12px;color:#111;font-weight:500}\
\
.a360-kpi-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:16px}\
.a360-kpi-card{background:#0f172a;border-radius:10px;padding:18px 20px 16px;border:1px solid #1e293b;box-shadow:0 2px 8px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.08);cursor:pointer;transition:all .2s}\
.a360-kpi-card:hover{box-shadow:0 6px 20px rgba(0,0,0,.25);transform:translateY(-2px);border-color:#334155}\
.a360-kpi-card:hover .a360-kpi-view{opacity:1}\
.a360-kpi-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}\
.a360-kpi-top svg{stroke:#64748b}\
.a360-kpi-view{font-size:9px;font-weight:500;color:#64748b;opacity:0;transition:opacity .15s;letter-spacing:.2px}\
.a360-kpi-value{font-size:30px;font-weight:800;color:#f8fafc;letter-spacing:-1.2px;line-height:1;margin-bottom:4px;font-variant-numeric:tabular-nums}\
.a360-kpi-label{font-size:10.5px;color:#94a3b8;font-weight:500}\
.a360-kpi-insight{display:flex;align-items:center;gap:5px;padding-top:9px;margin-top:9px;border-top:1px solid #1e293b;font-size:9.5px;font-weight:600}\
.a360-kpi-insight-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}\
\
.a360-grid2{display:grid;grid-template-columns:1.12fr 1fr;gap:14px;align-items:start}\
.a360-col{display:flex;flex-direction:column;gap:12px}\
\
.a360-section{background:var(--white);border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 0 0 1px rgba(0,0,0,.03);border:1px solid #e0e0e3;overflow:hidden}\
.a360-section-head{padding:10px 16px;border-bottom:1px solid #e0e0e3;display:flex;align-items:center;gap:7px}\
.a360-section-title{font-size:11.5px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:.5px}\
.a360-section-count{font-size:9px;color:#fff;font-weight:700;background:#111;border-radius:10px;padding:1px 6px;margin-left:4px}\
.a360-section-link{margin-left:auto;font-size:10px;font-weight:500;color:#88888d;cursor:pointer;display:flex;align-items:center;gap:2px;transition:color .12s}\
.a360-section-link:hover{color:#2563eb}\
\
.a360-row{padding:10px 16px;border-bottom:1px solid #eaeaed;cursor:pointer;transition:background .08s;display:flex;align-items:center;gap:10px}\
.a360-row:hover{background:#f8f8fa}\
.a360-row-last{border-bottom:none}\
.a360-row-left{flex:1;min-width:0}\
.a360-row-right{display:flex;align-items:center;gap:8px;flex-shrink:0}\
.a360-row-title{font-size:12.5px;font-weight:700;color:#111;line-height:1.2}\
.a360-row-sub{font-size:10px;color:#88888d;margin-top:2px}\
.a360-row-amount{font-size:15px;font-weight:800;color:#111;font-variant-numeric:tabular-nums;letter-spacing:-.3px;margin-right:4px}\
\
.a360-empty{padding:20px 16px;text-align:center;color:#b0b0b5;font-size:11px}\
\
.a360-stage-dots{display:flex;gap:2px}\
.a360-stage-dot{flex:1;height:3px;border-radius:2px}\
\
.a360-contact-avatar{width:34px;height:34px;border-radius:50%;background:#f0f0f2;border:1.5px solid #e0e0e3;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#4a4a4f;flex-shrink:0}\
.a360-contact-actions{display:flex;gap:4px;flex-shrink:0}\
.a360-contact-btn{width:28px;height:28px;border-radius:6px;border:1px solid #eaeaed;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:border-color .12s}\
.a360-contact-btn:hover{border-color:#ccc}\
\
.a360-timeline{padding:12px 16px}\
.a360-tl-item{display:flex;gap:10px;position:relative;padding-bottom:14px}\
.a360-tl-item:last-child{padding-bottom:0}\
.a360-tl-line{position:absolute;left:5.25px;top:15px;bottom:0;width:1.5px;background:#eaeaed;border-radius:1px}\
.a360-tl-item:last-child .a360-tl-line{display:none}\
.a360-tl-dot{width:12px;height:12px;border-radius:50%;border:2px solid #b0b0b5;flex-shrink:0;margin-top:2px;background:var(--white);z-index:1}\
.a360-tl-body{flex:1;min-width:0}\
.a360-tl-top{display:flex;justify-content:space-between;align-items:baseline}\
.a360-tl-subject{font-size:11.5px;font-weight:600;color:#111;line-height:1.2}\
.a360-tl-date{font-size:9.5px;color:#88888d;flex-shrink:0;margin-left:8px}\
.a360-tl-meta{font-size:10px;color:#88888d;margin-top:2px}\
.a360-tl-type{font-weight:600;color:#4a4a4f}\
\
@media(max-width:1100px){.a360-grid2{grid-template-columns:1fr}.a360-kpi-grid{grid-template-columns:repeat(3,1fr)}.a360-header-top{flex-wrap:wrap}.a360-header-metrics{margin-top:10px}}\
@media(max-width:768px){.a360-kpi-grid{grid-template-columns:repeat(2,1fr)}.a360-header-fields{grid-template-columns:1fr 1fr}.a360-field-wide{grid-column:span 2}}\
';
  document.head.appendChild(s);
}
