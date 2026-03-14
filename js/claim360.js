/* ═══════════════════════════════════════════════════════
   claim360.js — Claim Risk Cockpit
   MickaCRM v4 — vanilla JS, CSS injected via injectCL360Styles()
   Classes prefixed cl36-, follows Lead360 / Project360 layout pattern
   MUST be loaded BEFORE record.js in index.html
   ═══════════════════════════════════════════════════════ */

/* ── Register extra icons ── */
(function() {
  if (typeof NAV_ICONS === 'undefined') return;
  var extra = {
    shield:        'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    alertCircle:   'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    clock:         'M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z',
    target:        'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 100 12 6 6 0 000-12zm0 4a2 2 0 100 4 2 2 0 000-4z',
    userCheck:     'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m12.5-11.5L16 12l4-4M12.5 7a4 4 0 11-8 0 4 4 0 018 0z',
    checkCircle:   'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
    edit:          'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    trash:         'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
  };
  for (var k in extra) {
    if (!NAV_ICONS[k]) NAV_ICONS[k] = extra[k];
  }
})();

/* ── Helpers ── */
function cl36Fmt(n) {
  if (typeof fmtAmount === 'function') return fmtAmount(n);
  if (n >= 1e6) return (n/1e6).toFixed(1).replace(/\.0$/,'') + 'M\u20AC';
  if (n >= 1e3) return Math.round(n/1e3) + 'K\u20AC';
  return n + '\u20AC';
}
function cl36Date(d) {
  if (!d) return '\u2014';
  if (typeof fmtDate === 'function') return fmtDate(d);
  return new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
}
function cl36Initials(name) {
  return (name||'').split(' ').map(function(w){return w[0]||'';}).join('').substring(0,2).toUpperCase();
}
function cl36Icon(name, size, color) {
  if (typeof svgIcon === 'function') return svgIcon(name, size||16, color||'currentColor');
  return '';
}

/* ── Badges ── */
function cl36StatusBadge(s) {
  var m = {Open:'rd','In Progress':'am',Resolved:'gn',Closed:'gy',Reported:'rd',Investigation:'am',Negotiation:'bl'};
  return '<span class="cl36-b cl36-b--'+(m[s]||'gy')+'">'+(s||'\u2014')+'</span>';
}
function cl36PrioBadge(p) {
  var m = {High:'rd',Medium:'am',Low:'gy',Critical:'rd'};
  return '<span class="cl36-b cl36-b--'+(m[p]||'gy')+'">'+(p||'\u2014')+'</span>';
}
function cl36RiskBadge(r) {
  var m = {High:'rd',Medium:'am',Low:'gn'};
  var icons = {High:'alertCircle',Medium:'alertCircle',Low:'checkCircle'};
  return '<span class="cl36-risk cl36-risk--'+(m[r]||'gy')+'">'+cl36Icon(icons[r]||'alertCircle',13)+' '+r+' Risk</span>';
}

/* ── Activity helpers ── */
function cl36ActIcon(t) { return {'Site Visit':'mapPin',Call:'phone',Meeting:'users',Email:'mail','Inspection':'eye','Internal Review':'users','Claim Filed':'alertTriangle'}[t]||'activities'; }
function cl36ActColor(t) { return {'Site Visit':'#f59e0b',Call:'#3b82f6',Meeting:'#8b5cf6',Email:'#10b981','Inspection':'#ef4444','Internal Review':'#6366f1','Claim Filed':'#ef4444'}[t]||'#64748b'; }

/* ── Lifecycle stages ── */
var CL36_STAGES = ['Reported','Investigation','Negotiation','Resolved','Closed'];

/* ── Days between two dates ── */
function cl36DaysBetween(d1, d2) {
  var a = new Date(d1), b = new Date(d2||new Date().toISOString().split('T')[0]);
  return Math.max(0, Math.ceil((b - a) / 86400000));
}


/* ═══════════════════════════════════════════════════════
   MAIN RENDER
   ═══════════════════════════════════════════════════════ */
function renderClaim360(container, rec) {
  injectCL360Styles();
  var D = window.DATA;

  /* ── Resolve related data ── */
  var project = (D.projects||[]).find(function(p){ return p.id === rec.projectId; });
  var projectName = project ? project.name : (rec.projectName||'\u2014');
  var account = null;
  if (rec.accountId) account = (D.accounts||[]).find(function(a){ return a.id === rec.accountId; });
  else if (project && project.account) account = (D.accounts||[]).find(function(a){ return a.id === project.account; });
  var accountName = account ? account.name : (rec.accountName||'\u2014');

  var opp = null;
  if (rec.opportunityId) opp = (D.opportunities||[]).find(function(o){ return o.id === rec.opportunityId; });
  else if (project) opp = (D.opportunities||[]).find(function(o){ return o.projectId === (project.id); });

  var quote = null;
  if (rec.quoteId) quote = (D.quotes||[]).find(function(q){ return q.id === rec.quoteId; });
  else if (opp) quote = (D.quotes||[]).find(function(q){ return q.opportunityId === opp.id; });

  /* ── Computed values ── */
  var impactValue = rec.impactValue || rec.estimatedCost || 0;
  var daysOpen = cl36DaysBetween(rec.reportedDate || rec.date || '2025-11-18');
  var riskLevel = rec.riskLevel || (rec.priority === 'High' || rec.priority === 'Critical' ? 'High' : rec.priority === 'Medium' ? 'Medium' : 'Low');
  var activityCount = (rec.activities||[]).length;
  var docCount = (rec.documents||[]).length;

  /* Stage computation */
  var stageLabel = rec.stage || rec.status || 'Reported';
  var stageNorm = stageLabel;
  var stageMap = {reported:'Reported',open:'Reported',investigation:'Investigation','in progress':'Investigation',negotiation:'Negotiation',resolved:'Resolved',closed:'Closed'};
  stageNorm = stageMap[stageLabel.toLowerCase()] || stageLabel;
  var stageIndex = CL36_STAGES.indexOf(stageNorm);
  if (stageIndex === -1) stageIndex = 0;

  /* Activities */
  var activities = rec.activities || [];
  /* Tasks */
  var tasks = rec.tasks || [];
  /* Stakeholders */
  var stakeholders = rec.stakeholders || [];
  if (!stakeholders.length) {
    if (rec.owner) stakeholders.push({name:rec.owner, role:'Claim Owner', color:'#2563eb'});
    if (project && project.owner && project.owner !== rec.owner) stakeholders.push({name:project.owner, role:'Project Owner', color:'#8b5cf6'});
    if (project && project.commercialLead) stakeholders.push({name:project.commercialLead, role:'Commercial Lead', color:'#059669'});
    if (project && project.technicalLead) stakeholders.push({name:project.technicalLead, role:'Technical Lead', color:'#f59e0b'});
  }
  /* Documents */
  var documents = rec.documents || [];

  /* ── BUILD HTML ── */
  var h = '<div class="cl36">';

  /* Back nav */
  h += '<div class="cl36-back" id="cl36-back">' + cl36Icon('arrowLeft',14,'var(--text-muted)') + '<span>Claims</span></div>';

  /* ═══ HEADER ═══ */
  h += '<div class="cl36-header-card">';
  h += '<div class="cl36-header-top">';

  /* Avatar */
  h += '<div class="cl36-avatar cl36-avatar--'+(riskLevel==='High'?'rd':riskLevel==='Medium'?'am':'gn')+'">';
  h += cl36Icon('shield',28,'#fff');
  h += '</div>';

  /* Info */
  h += '<div class="cl36-header-info">';
  h += '<div class="cl36-name-row">';
  h += '<h1 class="cl36-name">' + (rec.title || rec.name || 'Untitled Claim') + '</h1>';
  h += cl36StatusBadge(stageNorm);
  h += '</div>';

  /* Project + Account line */
  h += '<div class="cl36-sub-row">';
  h += '<a class="cl36-link" id="cl36-project-link" data-proj-id="'+(rec.projectId||'')+'">' + cl36Icon('projects',13,'var(--accent)') + ' ' + projectName + '</a>';
  h += '<span class="cl36-sep">\u00B7</span>';
  h += '<a class="cl36-link" id="cl36-acct-link" data-acct-id="'+((account&&account.id)||'')+'">' + cl36Icon('accounts',13,'var(--accent)') + ' ' + accountName + '</a>';
  h += '</div>';

  /* Chips */
  h += '<div class="cl36-chips">';
  if (rec.owner) h += '<span class="cl36-chip">' + cl36Icon('user',12,'var(--text-muted)') + ' ' + rec.owner + '</span>';
  h += '<span class="cl36-chip">' + cl36Icon('activities',12,'var(--text-muted)') + ' Reported ' + cl36Date(rec.reportedDate || rec.date) + '</span>';
  if (rec.category) h += '<span class="cl36-chip">' + cl36Icon('target',12,'var(--text-muted)') + ' ' + rec.category + '</span>';
  h += '</div>';

  h += '</div>'; /* header-info */

  /* Header right: Impact + Priority + Risk */
  h += '<div class="cl36-header-right">';
  h += '<div class="cl36-big-metric"><div class="cl36-bigv" style="color:var(--danger)">' + cl36Fmt(impactValue) + '</div><div class="cl36-bigl">Impact Value</div></div>';
  h += '<div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">';
  h += cl36PrioBadge(rec.priority);
  h += cl36RiskBadge(riskLevel);
  h += '</div>';
  h += '</div>';

  h += '</div>'; /* header-top */

  /* Quick Actions */
  h += '<div class="cl36-actions">';
  h += '<button class="cl36-btn cl36-btn--bl">' + cl36Icon('plus',14,'#fff') + ' Add Activity</button>';
  h += '<button class="cl36-btn cl36-btn--ol">' + cl36Icon('userCheck',14) + ' Assign Owner</button>';
  h += '<button class="cl36-btn cl36-btn--ol">' + cl36Icon('upload',14) + ' Upload Document</button>';
  h += '<button class="cl36-btn cl36-btn--gn">' + cl36Icon('checkCircle',14,'#fff') + ' Resolve Claim</button>';
  h += '<button class="cl36-btn cl36-btn--ol crm-edit-btn" data-obj="claims" data-rec="'+rec.id+'">' + cl36Icon('edit',14) + ' Edit</button>';
  h += '<button class="cl36-btn cl36-btn--ol crm-delete-btn" data-obj="claims" data-rec="'+rec.id+'" style="color:#ef4444;border-color:#fecaca">' + cl36Icon('trash',14,'#ef4444') + ' Delete</button>';
  h += '</div>';

  h += '</div>'; /* header-card */

  /* ═══ KPI TILES ═══ */
  h += '<div class="cl36-krow">';
  h += '<div class="cl36-kpi"><div class="cl36-kv" style="color:var(--danger)">' + cl36Fmt(impactValue) + '</div><div class="cl36-kl">Impact Value</div><div class="cl36-kh" style="color:var(--text-light)">Financial exposure</div></div>';
  h += '<div class="cl36-kpi"><div class="cl36-kv" style="color:'+(daysOpen>30?'var(--danger)':daysOpen>14?'var(--warning)':'var(--accent)')+'">' + daysOpen + '</div><div class="cl36-kl">Days Open</div><div class="cl36-kh" style="color:var(--text-light)">Since ' + cl36Date(rec.reportedDate || rec.date) + '</div></div>';
  h += '<div class="cl36-kpi"><div class="cl36-kv" style="color:var(--accent)">' + activityCount + '</div><div class="cl36-kl">Activities</div><div class="cl36-kh" style="color:var(--text-light)">' + (activityCount > 0 ? 'Last: ' + cl36Date((activities[0]||{}).date) : 'None yet') + '</div></div>';
  h += '<div class="cl36-kpi"><div class="cl36-kv" style="color:var(--purple)">' + docCount + '</div><div class="cl36-kl">Documents</div><div class="cl36-kh" style="color:var(--text-light)">' + (docCount > 0 ? 'Latest attached' : 'None yet') + '</div></div>';
  h += '</div>';

  /* ═══ RISK INDICATOR ═══ */
  h += '<div class="cl36-risk-bar cl36-risk-bar--'+(riskLevel==='High'?'rd':riskLevel==='Medium'?'am':'gn')+'">';
  h += '<div class="cl36-risk-bar-inner">';
  h += '<div class="cl36-risk-bar-icon">' + cl36Icon('shield',20, riskLevel==='High'?'#dc2626':riskLevel==='Medium'?'#d97706':'#059669') + '</div>';
  h += '<div class="cl36-risk-bar-info">';
  h += '<div class="cl36-risk-bar-label">Claim Risk Level</div>';
  h += '<div class="cl36-risk-bar-value">' + riskLevel + ' Risk</div>';
  h += '</div>';
  h += '<div class="cl36-risk-bar-dots">';
  ['Low','Medium','High'].forEach(function(level) {
    var active = level === riskLevel;
    var col = {Low:'#059669',Medium:'#d97706',High:'#dc2626'}[level];
    h += '<div class="cl36-risk-dot'+(active?' cl36-risk-dot--on':'')+'" style="'+(active?'background:'+col+';box-shadow:0 0 0 4px '+col+'20':'background:#e2e8f0')+'"><span>' + level + '</span></div>';
  });
  h += '</div>';
  h += '</div></div>';

  /* ═══ LIFECYCLE STEPPER ═══ */
  h += '<div class="cl36-stepper-card">';
  h += '<div class="cl36-stepper-title">Claim Lifecycle</div>';
  h += '<div class="cl36-stepper">';
  CL36_STAGES.forEach(function(st, i) {
    var done = i < stageIndex, active = i === stageIndex;
    var dc = done ? 'd' : active ? 'a' : 'f';
    var chk = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    h += '<div class="cl36-step" data-stage-idx="'+i+'"><div class="cl36-step-col">';
    h += '<div class="cl36-dot cl36-dot--'+dc+'">'+(done ? chk : (i+1))+'</div>';
    h += '<span class="cl36-step-label cl36-step-label--'+dc+'">'+st+'</span>';
    h += '</div>';
    if (i < CL36_STAGES.length - 1) h += '<div class="cl36-step-line cl36-step-line--'+(i < stageIndex ? 'd' : 'f')+'"></div>';
    h += '</div>';
  });
  h += '</div></div>';

  /* ═══ BODY 2-COL ═══ */
  h += '<div class="cl36-body">';

  /* ── LEFT COLUMN (Context) ── */
  h += '<div class="cl36-col">';

  /* Claim Description */
  h += cl36SectionOpen('Claim Description', 'claims', 'alertTriangle');
  h += '<div class="cl36-section-body cl36-section-body--pad">';
  h += '<div class="cl36-desc">' + (rec.description || 'No description provided for this claim.') + '</div>';
  h += '</div></div>';

  /* Root Cause */
  h += cl36SectionOpen('Root Cause Analysis', 'claims', 'target');
  h += '<div class="cl36-section-body cl36-section-body--pad">';
  h += '<div class="cl36-desc">' + (rec.rootCause || 'Root cause investigation pending.') + '</div>';
  if (rec.rootCauseCategory) {
    h += '<div class="cl36-rc-tag">' + cl36Icon('target',12,'var(--accent)') + ' ' + rec.rootCauseCategory + '</div>';
  }
  h += '</div></div>';

  /* Project Context */
  h += cl36SectionOpen('Project Context', 'projects', 'projects');
  h += '<div class="cl36-section-body">';
  if (project) {
    h += '<div class="cl36-ctx-row cl36-ctx-row--clickable" id="cl36-ctx-project" data-proj-id="'+project.id+'">';
    h += '<div class="cl36-ctx-icon" style="background:#dbeafe">' + cl36Icon('projects',15,'var(--accent)') + '</div>';
    h += '<div class="cl36-ctx-info">';
    h += '<div class="cl36-ctx-name">' + project.name + '</div>';
    h += '<div class="cl36-ctx-sub">' + (project.phase||'') + ' \u00B7 ' + cl36Fmt(project.value||0) + ' \u00B7 ' + (project.health||'') + '</div>';
    h += '</div></div>';
  } else {
    h += '<div class="cl36-empty">No project linked.</div>';
  }
  h += '</div></div>';

  /* Related Opportunity */
  h += cl36SectionOpen('Related Opportunity', 'opportunities', 'opportunities');
  h += '<div class="cl36-section-body">';
  if (opp) {
    h += '<div class="cl36-ctx-row cl36-ctx-row--clickable" data-nav-obj="opportunities" data-nav-id="'+opp.id+'">';
    h += '<div class="cl36-ctx-icon" style="background:#fef3c7">' + cl36Icon('opportunities',15,'#f59e0b') + '</div>';
    h += '<div class="cl36-ctx-info">';
    h += '<div class="cl36-ctx-name">' + opp.name + '</div>';
    h += '<div class="cl36-ctx-sub">' + cl36Fmt(opp.amount||0) + ' \u00B7 ' + (opp.stage||'').replace(/_/g,' ') + ' \u00B7 ' + (opp.prob||0) + '% prob.</div>';
    h += '</div></div>';
  } else {
    h += '<div class="cl36-empty">No opportunity linked.</div>';
  }
  h += '</div></div>';

  /* Related Quote */
  h += cl36SectionOpen('Related Quote', 'quotes', 'quotes');
  h += '<div class="cl36-section-body">';
  if (quote) {
    h += '<div class="cl36-ctx-row cl36-ctx-row--clickable" data-nav-obj="quotes" data-nav-id="'+quote.id+'">';
    h += '<div class="cl36-ctx-icon" style="background:#f0fdf4">' + cl36Icon('quotes',15,'#059669') + '</div>';
    h += '<div class="cl36-ctx-info">';
    h += '<div class="cl36-ctx-name">' + quote.name + '</div>';
    h += '<div class="cl36-ctx-sub">' + cl36Fmt(quote.value||0) + ' \u00B7 ' + (quote.stage||'') + '</div>';
    h += '</div></div>';
  } else {
    h += '<div class="cl36-empty">No quote linked.</div>';
  }
  h += '</div></div>';

  h += '</div>'; /* end left col */

  /* ── RIGHT COLUMN (Action) ── */
  h += '<div class="cl36-col"><div class="cl36-sticky">';

  /* Activity Timeline */
  h += cl36SectionOpen('Activity Timeline', 'activities', 'activities');
  h += '<div class="cl36-section-body">';
  if (!activities.length) {
    h += '<div class="cl36-empty">No activities recorded yet.</div>';
  } else {
    h += '<div class="cl36-timeline">';
    activities.forEach(function(a, i) {
      var isLast = i === activities.length - 1;
      var ic = cl36ActIcon(a.type);
      var col = cl36ActColor(a.type);
      h += '<div class="cl36-tl-item">';
      if (!isLast) h += '<div class="cl36-tl-line"></div>';
      h += '<div class="cl36-tl-icon" style="background:'+col+'14;border-color:'+col+'40">' + cl36Icon(ic,12,col) + '</div>';
      h += '<div class="cl36-tl-body">';
      h += '<div class="cl36-tl-top"><span class="cl36-tl-subject">'+(a.description||a.desc||a.name||'\u2014')+'</span><span class="cl36-tl-type" style="color:'+col+'">'+(a.type||'\u2014')+'</span></div>';
      h += '<div class="cl36-tl-meta">'+(a.contact||'')+' \u00B7 '+cl36Date(a.date)+'</div>';
      h += '</div></div>';
    });
    h += '</div>';
  }
  h += '</div></div>';

  /* Tasks */
  h += cl36SectionOpen('Tasks', 'activities', 'check');
  h += '<div class="cl36-section-body">';
  if (!tasks.length) {
    h += '<div class="cl36-empty">No tasks assigned.</div>';
  } else {
    tasks.forEach(function(t) {
      var sc = t.status === 'Completed' ? 'var(--success)' : t.status === 'In Progress' ? 'var(--accent)' : 'var(--warning)';
      h += '<div class="cl36-task-row">';
      h += '<div class="cl36-task-dot" style="background:'+sc+'"></div>';
      h += '<div class="cl36-task-info"><div class="cl36-task-name">' + (t.name||t.title||'\u2014') + '</div>';
      h += '<div class="cl36-task-sub">' + (t.assignee||'') + (t.dueDate ? ' \u00B7 Due '+cl36Date(t.dueDate) : '') + '</div></div>';
      h += '<span class="cl36-b cl36-b--'+(t.status==='Completed'?'gn':t.status==='In Progress'?'bl':'am')+'">'+(t.status||'To Do')+'</span>';
      h += '</div>';
    });
  }
  h += '</div></div>';

  /* Documents */
  h += cl36SectionOpen('Documents', 'claims', 'fileText');
  h += '<div class="cl36-section-body">';
  if (!documents.length) {
    h += '<div class="cl36-empty">No documents uploaded.</div>';
  } else {
    documents.forEach(function(d) {
      h += '<div class="cl36-doc-row">';
      h += '<div class="cl36-doc-icon">' + cl36Icon('fileText',14,'var(--accent)') + '</div>';
      h += '<div class="cl36-doc-info"><div class="cl36-doc-name">'+(d.name||'\u2014')+'</div></div>';
      h += '<div class="cl36-doc-meta">'+(d.size||'')+'</div>';
      h += '<div class="cl36-doc-meta">'+cl36Date(d.date)+'</div>';
      h += '</div>';
    });
  }
  h += '</div></div>';

  /* Stakeholders */
  h += cl36SectionOpen('Stakeholders', 'contacts', 'users');
  h += '<div class="cl36-section-body">';
  if (!stakeholders.length) {
    h += '<div class="cl36-empty">No stakeholders assigned.</div>';
  } else {
    stakeholders.forEach(function(p) {
      h += '<div class="cl36-person-row">';
      h += '<div class="cl36-person-av" style="background:'+p.color+'">' + cl36Initials(p.name) + '</div>';
      h += '<div><div class="cl36-person-name">' + p.name + '</div>';
      h += '<div class="cl36-person-role">' + p.role + '</div></div>';
      h += '</div>';
    });
  }
  h += '</div></div>';

  h += '</div></div>'; /* end sticky + right col */
  h += '</div>'; /* end body */
  h += '</div>'; /* end cl36 */

  container.innerHTML = h;
  container.scrollTop = 0;

  /* ═══ BIND EVENTS ═══ */

  /* Back */
  var backBtn = document.getElementById('cl36-back');
  if (backBtn) backBtn.addEventListener('click', function(){ navigate('claims'); });

  /* Project link */
  var projLink = document.getElementById('cl36-project-link');
  if (projLink && rec.projectId) {
    projLink.addEventListener('click', function(){ navigate('record','projects',rec.projectId); });
  }
  var ctxProj = document.getElementById('cl36-ctx-project');
  if (ctxProj) {
    ctxProj.addEventListener('click', function(){
      var pid = ctxProj.getAttribute('data-proj-id');
      if (pid) navigate('record','projects',pid);
    });
  }

  /* Account link */
  var acctLink = document.getElementById('cl36-acct-link');
  if (acctLink) {
    acctLink.addEventListener('click', function(){
      var aid = acctLink.getAttribute('data-acct-id');
      if (aid) navigate('record','accounts',aid);
    });
  }

  /* Row navigation (opportunities, quotes) */
  container.querySelectorAll('.cl36-ctx-row--clickable[data-nav-id]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate('record', el.getAttribute('data-nav-obj'), el.getAttribute('data-nav-id')); });
  });

  /* Lifecycle step click */
  container.querySelectorAll('.cl36-step[data-stage-idx]').forEach(function(step) {
    step.style.cursor = 'pointer';
    step.addEventListener('click', function() {
      var idx = parseInt(step.getAttribute('data-stage-idx'));
      if (!isNaN(idx) && CL36_STAGES[idx] && CL36_STAGES[idx] !== stageNorm) {
        rec.stage = CL36_STAGES[idx];
        renderClaim360(container, rec);
        if (typeof showDragToast === 'function') showDragToast(rec.title||rec.name, CL36_STAGES[idx], 'claims');
      }
    });
  });

  /* Section "View all" links */
  container.querySelectorAll('.cl36-section-link[data-nav]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate(el.getAttribute('data-nav')); });
  });
  if (typeof bindCrmActionButtons === 'function') bindCrmActionButtons(container);
}

/* ── Section card helper ── */
function cl36SectionOpen(title, navKey, iconName) {
  return '<div class="cl36-section"><div class="cl36-section-head">' +
    '<span class="cl36-section-title">' + (iconName ? cl36Icon(iconName,14,'var(--text-light)') + ' ' : '') + title + '</span>' +
    '<span class="cl36-section-link" data-nav="' + navKey + '">View all</span></div>';
}


/* ═══════════════════════════════════════════════════════
   CSS INJECTION
   ═══════════════════════════════════════════════════════ */
function injectCL360Styles() {
  if (document.getElementById('cl360-css')) return;
  var s = document.createElement('style');
  s.id = 'cl360-css';
  s.textContent = [
/* Root */
'.cl36{background:var(--bg);min-height:100%}',

/* Back nav */
'.cl36-back{display:flex;align-items:center;gap:6px;padding:10px 32px;font-size:12.5px;color:var(--text-muted);cursor:pointer;background:#fff;border-bottom:1px solid var(--border)}',
'.cl36-back:hover{color:var(--accent)}',

/* Header card */
'.cl36-header-card{background:#fff;border-bottom:1px solid var(--border);padding:0}',
'.cl36-header-top{display:flex;align-items:flex-start;gap:18px;padding:24px 32px 18px}',

/* Avatar */
'.cl36-avatar{width:64px;height:64px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff}',
'.cl36-avatar--rd{background:linear-gradient(135deg,#ef4444,#dc2626);box-shadow:0 0 0 4px rgba(239,68,68,.12)}',
'.cl36-avatar--am{background:linear-gradient(135deg,#f59e0b,#d97706);box-shadow:0 0 0 4px rgba(245,158,11,.12)}',
'.cl36-avatar--gn{background:linear-gradient(135deg,#10b981,#059669);box-shadow:0 0 0 4px rgba(16,185,129,.12)}',

/* Header info */
'.cl36-header-info{flex:1;min-width:0}',
'.cl36-name-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}',
'.cl36-name{font-size:22px;font-weight:700;color:var(--text);margin:0}',
'.cl36-sub-row{display:flex;align-items:center;gap:8px;margin-top:4px;flex-wrap:wrap}',
'.cl36-link{color:var(--accent);text-decoration:none;font-size:13px;font-weight:500;display:inline-flex;align-items:center;gap:4px;cursor:pointer}',
'.cl36-link:hover{text-decoration:underline}',
'.cl36-sep{color:var(--text-light);font-size:13px}',
'.cl36-chips{display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap}',
'.cl36-chip{display:inline-flex;align-items:center;gap:5px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:4px 12px;font-size:12px;color:#475569}',

/* Header right */
'.cl36-header-right{flex-shrink:0;text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:10px;padding-top:2px}',
'.cl36-big-metric{text-align:right}',
'.cl36-bigv{font-size:30px;font-weight:800;line-height:1}',
'.cl36-bigl{font-size:10.5px;color:var(--text-light);text-transform:uppercase;letter-spacing:.5px;font-weight:600;margin-top:2px}',

/* Badges */
'.cl36-b{display:inline-flex;align-items:center;padding:2px 9px;border-radius:6px;font-size:10.5px;font-weight:600;white-space:nowrap}',
'.cl36-b--bl{background:#dbeafe;color:#2563eb}',
'.cl36-b--gn{background:#ecfdf5;color:#059669}',
'.cl36-b--am{background:#fffbeb;color:#d97706}',
'.cl36-b--rd{background:#fef2f2;color:#dc2626}',
'.cl36-b--gy{background:#f1f5f9;color:#64748b}',
'.cl36-b--pu{background:#f5f3ff;color:#7c3aed}',

/* Risk badge */
'.cl36-risk{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600}',
'.cl36-risk--rd{background:#fef2f2;color:#dc2626}',
'.cl36-risk--am{background:#fffbeb;color:#d97706}',
'.cl36-risk--gn{background:#ecfdf5;color:#059669}',
'.cl36-risk--gy{background:#f1f5f9;color:#64748b}',

/* Actions */
'.cl36-actions{display:flex;gap:8px;padding:14px 32px;background:#fff;border-bottom:1px solid var(--border);flex-wrap:wrap}',
'.cl36-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:8px;font-size:12.5px;font-weight:600;font-family:inherit;cursor:pointer;border:none;transition:all .15s}',
'.cl36-btn--bl{background:var(--accent);color:#fff}','.cl36-btn--bl:hover{background:#1d4ed8}',
'.cl36-btn--gn{background:#059669;color:#fff}','.cl36-btn--gn:hover{background:#047857}',
'.cl36-btn--ol{background:#fff;color:var(--text-muted);border:1px solid var(--border)}','.cl36-btn--ol:hover{background:var(--bg)}',

/* KPI Row */
'.cl36-krow{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:18px 32px}',
'.cl36-kpi{background:#fff;border:1px solid var(--border);border-radius:12px;padding:18px 14px;text-align:center}',
'.cl36-kv{font-size:28px;font-weight:800;line-height:1.1}',
'.cl36-kl{font-size:10.5px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;font-weight:600;margin-top:4px}',
'.cl36-kh{font-size:11px;margin-top:6px}',

/* Risk Indicator Bar */
'.cl36-risk-bar{border-radius:12px;margin:0 32px;overflow:hidden;border:1px solid var(--border)}',
'.cl36-risk-bar--rd{background:linear-gradient(90deg,#fff9f9,#fef2f2)}',
'.cl36-risk-bar--am{background:linear-gradient(90deg,#fffef7,#fffbeb)}',
'.cl36-risk-bar--gn{background:linear-gradient(90deg,#f7fdfb,#ecfdf5)}',
'.cl36-risk-bar-inner{display:flex;align-items:center;gap:16px;padding:16px 24px}',
'.cl36-risk-bar-icon{width:44px;height:44px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid var(--border)}',
'.cl36-risk-bar-info{flex:1}',
'.cl36-risk-bar-label{font-size:10.5px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;font-weight:600}',
'.cl36-risk-bar-value{font-size:18px;font-weight:800;color:var(--text);margin-top:1px}',
'.cl36-risk-bar-dots{display:flex;align-items:center;gap:12px}',
'.cl36-risk-dot{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-direction:column;transition:all .2s}',
'.cl36-risk-dot span{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;color:#fff}',
'.cl36-risk-dot--on span{color:#fff}',
'.cl36-risk-dot:not(.cl36-risk-dot--on) span{color:var(--text-light)}',

/* Lifecycle Stepper */
'.cl36-stepper-card{background:#fff;border:1px solid var(--border);border-radius:12px;margin:16px 32px 0;padding:18px 24px 22px}',
'.cl36-stepper-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text-muted);margin-bottom:16px}',
'.cl36-stepper{display:flex;align-items:center}',
'.cl36-step{display:flex;align-items:center;flex:1}','.cl36-step:last-child{flex:0 0 auto}',
'.cl36-step-col{display:flex;flex-direction:column;align-items:center;gap:6px}',
'.cl36-dot{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;transition:all .2s}',
'.cl36-dot--d{background:var(--accent);color:#fff}',
'.cl36-dot--a{background:var(--accent);color:#fff;box-shadow:0 0 0 5px rgba(37,99,235,.18)}',
'.cl36-dot--f{background:#e8eaed;color:#b0b5bd}',
'.cl36-step-line{flex:1;height:3px;margin:0 4px;border-radius:2px;margin-bottom:24px}',
'.cl36-step-line--d{background:var(--accent)}','.cl36-step-line--f{background:#e8eaed}',
'.cl36-step-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.3px}',
'.cl36-step-label--d{color:var(--accent)}','.cl36-step-label--a{color:var(--accent)}','.cl36-step-label--f{color:#b0b5bd}',

/* Body 2-col */
'.cl36-body{display:grid;grid-template-columns:1fr 380px;gap:16px;padding:18px 32px 32px}',
'.cl36-col{}',
'.cl36-sticky{position:sticky;top:16px}',

/* Section cards */
'.cl36-section{background:#fff;border:1px solid var(--border);border-radius:12px;margin-bottom:16px;overflow:hidden}',
'.cl36-section:last-child{margin-bottom:0}',
'.cl36-section-head{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-bottom:1px solid #f1f5f9}',
'.cl36-section-title{font-size:13px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:7px}',
'.cl36-section-link{font-size:12px;color:var(--text-light);cursor:pointer;font-weight:500}','.cl36-section-link:hover{color:var(--accent)}',
'.cl36-section-body{padding:0}',
'.cl36-section-body--pad{padding:14px 18px}',
'.cl36-empty{padding:18px;text-align:center;color:var(--text-light);font-size:12.5px}',

/* Description */
'.cl36-desc{font-size:12.5px;color:#475569;line-height:1.65}',
'.cl36-rc-tag{display:inline-flex;align-items:center;gap:5px;margin-top:10px;background:#dbeafe;color:var(--accent);padding:4px 12px;border-radius:8px;font-size:11.5px;font-weight:600}',

/* Context rows (project, opp, quote) */
'.cl36-ctx-row{display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid #f1f5f9;transition:background .1s}',
'.cl36-ctx-row:last-child{border-bottom:none}',
'.cl36-ctx-row--clickable{cursor:pointer}','.cl36-ctx-row--clickable:hover{background:var(--bg)}',
'.cl36-ctx-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}',
'.cl36-ctx-info{flex:1;min-width:0}',
'.cl36-ctx-name{font-size:12.5px;font-weight:600;color:var(--text)}',
'.cl36-ctx-sub{font-size:11px;color:var(--text-light);margin-top:1px}',

/* Activity timeline */
'.cl36-timeline{padding:4px 0}',
'.cl36-tl-item{display:flex;gap:10px;padding:8px 18px;position:relative}',
'.cl36-tl-line{position:absolute;left:31px;top:32px;bottom:-8px;width:2px;background:#e8eaed}',
'.cl36-tl-icon{width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1.5px solid;z-index:1}',
'.cl36-tl-body{flex:1;min-width:0;padding-bottom:6px}',
'.cl36-tl-top{display:flex;align-items:center;justify-content:space-between;gap:8px}',
'.cl36-tl-subject{font-size:12px;font-weight:600;color:var(--text)}',
'.cl36-tl-type{font-size:10.5px;font-weight:600;white-space:nowrap}',
'.cl36-tl-meta{font-size:11px;color:var(--text-light);margin-top:1px}',

/* Tasks */
'.cl36-task-row{display:flex;align-items:center;gap:10px;padding:10px 18px;border-bottom:1px solid #f1f5f9}',
'.cl36-task-row:last-child{border-bottom:none}',
'.cl36-task-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}',
'.cl36-task-info{flex:1;min-width:0}',
'.cl36-task-name{font-size:12.5px;font-weight:600;color:var(--text)}',
'.cl36-task-sub{font-size:11px;color:var(--text-light);margin-top:1px}',

/* Documents */
'.cl36-doc-row{display:flex;align-items:center;gap:10px;padding:9px 18px;border-bottom:1px solid #f1f5f9;cursor:pointer;transition:background .1s}',
'.cl36-doc-row:last-child{border-bottom:none}','.cl36-doc-row:hover{background:var(--bg)}',
'.cl36-doc-icon{width:30px;height:30px;border-radius:6px;background:#dbeafe;display:flex;align-items:center;justify-content:center;flex-shrink:0}',
'.cl36-doc-info{flex:1;min-width:0}',
'.cl36-doc-name{font-size:12.5px;font-weight:500;color:var(--text)}',
'.cl36-doc-meta{font-size:10.5px;color:var(--text-light);white-space:nowrap}',

/* Stakeholders */
'.cl36-person-row{display:flex;align-items:center;gap:10px;padding:9px 18px;border-bottom:1px solid #f1f5f9}',
'.cl36-person-row:last-child{border-bottom:none}',
'.cl36-person-av{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0}',
'.cl36-person-name{font-size:12.5px;font-weight:500;color:var(--text)}',
'.cl36-person-role{font-size:11px;color:var(--text-light)}',
'@media(max-width:1100px){.cl36-body{grid-template-columns:1fr}.cl36-krow{grid-template-columns:repeat(2,1fr)}.cl36-header-top{flex-wrap:wrap}.cl36-header-right{align-items:flex-start;flex-direction:row;gap:16px}}',
'@media(max-width:768px){.cl36-krow{padding:14px 16px;gap:10px}.cl36-header-top{padding:16px}.cl36-acts{padding:10px 16px}.cl36-stepper-card{margin:12px 16px 0}.cl36-risk-bar{margin:0 16px}.cl36-body{padding:12px 16px 24px;gap:12px}}',
'@media(max-width:640px){.cl36-krow{grid-template-columns:1fr}.cl36-name{font-size:18px}.cl36-avatar{width:48px;height:48px}.cl36-bigv{font-size:24px}.cl36-btn{padding:6px 12px;font-size:11.5px}.cl36-header-top{padding:14px 12px}.cl36-acts{padding:8px 12px}.cl36-stepper-card{margin:10px 10px 0;padding:14px 12px}.cl36-risk-bar{margin:0 10px}.cl36-body{padding:10px 10px 20px}.cl36-stepper{flex-wrap:wrap;gap:6px}.cl36-step-line{display:none}.cl36-step{flex-direction:column;align-items:center;flex:0 0 auto}.cl36-step-col{gap:4px}.cl36-dot{width:28px;height:28px;font-size:11px}}'
  ].join('\n');
  document.head.appendChild(s);
}
