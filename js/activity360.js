/* ═══════════════════════════════════════════════════════
   activity360.js — Activity Detail Cockpit
   MickaCRM v4 — vanilla JS, CSS injected via injectAT360Styles()
   Classes prefixed at3-, follows Lead360 / Claim360 layout pattern
   MUST be loaded BEFORE record.js in index.html
   ═══════════════════════════════════════════════════════ */

/* ── Register extra icons ── */
(function() {
  if (typeof NAV_ICONS === 'undefined') return;
  var extra = {
    clipboardCheck: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    edit:           'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    paperclip:      'M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48',
    messageSquare:  'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
    clock:          'M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z',
    checkCircle:    'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
    fileText:       'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8m8 4H8m2-8H8',
    target:         'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 100 12 6 6 0 000-12zm0 4a2 2 0 100 4 2 2 0 000-4z',
    eye:            'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 100-6 3 3 0 000 6z',
    check:          'M20 6L9 17l-5-5'
  };
  for (var k in extra) {
    if (!NAV_ICONS[k]) NAV_ICONS[k] = extra[k];
  }
})();

/* ── Helpers ── */
function at3Fmt(n) {
  if (typeof fmtAmount === 'function') return fmtAmount(n);
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M\u20AC';
  if (n >= 1e3) return Math.round(n / 1e3) + 'K\u20AC';
  return n + '\u20AC';
}
function at3Date(d) {
  if (!d) return '\u2014';
  if (typeof fmtDate === 'function') return fmtDate(d);
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function at3Initials(name) {
  return (name || '').split(' ').map(function(w) { return w[0] || ''; }).join('').substring(0, 2).toUpperCase();
}
function at3Icon(name, size, color) {
  if (typeof svgIcon === 'function') return svgIcon(name, size || 16, color || 'currentColor');
  return '';
}

/* ── Type config ── */
function at3TypeConfig(type) {
  var map = {
    'Call':       { icon: 'phone',   color: '#3b82f6', bg: '#eff6ff' },
    'Meeting':    { icon: 'users',   color: '#8b5cf6', bg: '#f5f3ff' },
    'Email':      { icon: 'mail',    color: '#10b981', bg: '#ecfdf5' },
    'Site Visit': { icon: 'mapPin',  color: '#ef4444', bg: '#fef2f2' },
    'Task':       { icon: 'clipboardCheck', color: '#f59e0b', bg: '#fffbeb' },
    'Note':       { icon: 'messageSquare',  color: '#64748b', bg: '#f8fafc' }
  };
  return map[type] || { icon: 'activities', color: '#64748b', bg: '#f8fafc' };
}

/* ── Status badge ── */
function at3StatusBadge(s) {
  var m = { 'Planned': 'bl', 'In Progress': 'am', 'Completed': 'gn' };
  return '<span class="at3-b at3-b--' + (m[s] || 'gy') + '">' + (s || '\u2014') + '</span>';
}

/* ── Priority badge ── */
function at3PrioBadge(p) {
  var m = { 'High': 'rd', 'Medium': 'am', 'Low': 'gy' };
  return '<span class="at3-b at3-b--' + (m[p] || 'gy') + '">' + (p || '\u2014') + '</span>';
}

/* ── Duration format ── */
function at3Duration(mins) {
  if (!mins) return '\u2014';
  if (mins < 60) return mins + ' min';
  var h = Math.floor(mins / 60);
  var m = mins % 60;
  return h + 'h' + (m > 0 ? ' ' + m + 'min' : '');
}

/* ── Section open helper ── */
function at3SectionOpen(title, navKey, count) {
  return '<div class="at3-section"><div class="at3-section-head">' +
    '<span class="at3-section-title">' + title + '</span>' +
    (count !== null && count !== undefined ? '<span class="at3-section-count">' + count + '</span>' : '') +
    '<span class="at3-section-link" data-nav="' + navKey + '">View all</span></div>';
}

/* ── KPI Card ── */
function at3KpiCard(value, label, color, insight, insightColor) {
  return '<div class="at3-kpi">' +
    '<div class="at3-kpi-value" style="color:' + color + '">' + value + '</div>' +
    '<div class="at3-kpi-label">' + label + '</div>' +
    (insight ? '<div class="at3-kpi-insight" style="color:' + (insightColor || 'var(--text-muted)') + '">' + insight + '</div>' : '') +
    '</div>';
}


/* ═══════════════════════════════════════════════════════
   RENDER Activity 360
   ═══════════════════════════════════════════════════════ */
function renderActivity360(container, rec) {
  injectAT360Styles();
  var D = window.DATA;

  /* ── Resolve related data ── */
  var account = rec.accountId ? (D.accounts || []).find(function(a) { return a.id === rec.accountId; }) : null;
  var accountName = account ? account.name : (rec.accountName || '\u2014');

  var contact = rec.contactId ? (D.contacts || []).find(function(c) { return c.id === rec.contactId; }) : null;
  var contactName = contact ? contact.name : (rec.contact || '\u2014');
  var contactRole = contact ? contact.role : (rec.contactRole || '');

  var opportunity = rec.opportunityId ? (D.opportunities || []).find(function(o) { return o.id === rec.opportunityId; }) : null;
  var oppName = opportunity ? opportunity.name : (rec.opportunityName || '');

  var project = rec.projectId ? (D.projects || []).find(function(p) { return p.id === rec.projectId; }) : null;
  var projectName = project ? project.name : (rec.projectName || '');

  /* Participants */
  var participants = rec.participants || [];
  if (!participants.length && contact) {
    participants = [{ name: contact.name, company: accountName, role: contactRole }];
  }

  /* Notes */
  var notes = rec.notes || [];

  /* Tasks */
  var tasks = rec.tasks || [];

  /* Attachments */
  var attachments = rec.documents || [];

  /* Related activities (other activities on same opp/project/account) */
  var relatedActivities = [];
  var allActs = D.activities || [];
  allActs.forEach(function(a) {
    if (a.id === rec.id) return;
    if (rec.opportunityId && a.opportunityId === rec.opportunityId) relatedActivities.push(a);
    else if (rec.projectId && a.projectId === rec.projectId) relatedActivities.push(a);
    else if (rec.accountId && a.accountId === rec.accountId) relatedActivities.push(a);
  });
  relatedActivities.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
  relatedActivities = relatedActivities.slice(0, 6);

  /* Type config */
  var tc = at3TypeConfig(rec.type);

  /* Status config */
  var statusStages = ['Planned', 'In Progress', 'Completed'];
  var currentStatusIdx = statusStages.indexOf(rec.status);
  if (currentStatusIdx < 0) currentStatusIdx = 0;

  /* Computed */
  var durationStr = at3Duration(rec.duration);
  var relatedObjLabel = '';
  var relatedObjId = '';
  var relatedObjType = '';
  if (oppName) { relatedObjLabel = oppName; relatedObjId = rec.opportunityId; relatedObjType = 'opportunities'; }
  else if (projectName) { relatedObjLabel = projectName; relatedObjId = rec.projectId; relatedObjType = 'projects'; }

  /* ── BUILD HTML ── */
  var h = '<div class="at3">';

  /* Back nav */
  h += '<div class="at3-back" id="at3-back">' + at3Icon('arrowLeft', 14, 'var(--text-muted)') + '<span>Activities</span></div>';

  /* ── Header Card ── */
  h += '<div class="at3-header-card">';
  h += '<div class="at3-header-top">';

  /* Type Icon Avatar */
  h += '<div class="at3-avatar" style="background:' + tc.bg + ';border-color:' + tc.color + '40">';
  h += at3Icon(tc.icon, 26, tc.color);
  h += '</div>';

  /* Header Info */
  h += '<div class="at3-header-info">';
  h += '<div class="at3-name-row">';
  h += '<h1 class="at3-name">' + (rec.subject || rec.name || 'Activity') + '</h1>';
  h += at3StatusBadge(rec.status);
  h += '</div>';

  /* Type + Date line */
  h += '<div class="at3-type-line">';
  h += '<span class="at3-type-chip" style="background:' + tc.bg + ';color:' + tc.color + ';border-color:' + tc.color + '30">' + at3Icon(tc.icon, 11, tc.color) + ' ' + (rec.type || 'Activity') + '</span>';
  h += '<span class="at3-sep">\u00B7</span>';
  h += '<span class="at3-date-chip">' + at3Icon('clock', 11, 'var(--text-muted)') + ' ' + at3Date(rec.date) + (rec.time ? ' at ' + rec.time : '') + '</span>';
  if (rec.duration) {
    h += '<span class="at3-sep">\u00B7</span>';
    h += '<span class="at3-date-chip">' + durationStr + '</span>';
  }
  h += '</div>';

  /* Related object */
  if (accountName !== '\u2014') {
    h += '<div class="at3-company" id="at3-acct-link" data-acct-id="' + (rec.accountId || '') + '">' + at3Icon('accounts', 13, 'var(--accent)') + '<span>' + accountName + '</span></div>';
  }

  /* Detail chips */
  h += '<div class="at3-details-row">';
  if (contactName !== '\u2014') h += '<div class="at3-detail-chip">' + at3Icon('contacts', 12, 'var(--text-muted)') + '<span>' + contactName + '</span></div>';
  if (relatedObjLabel) h += '<div class="at3-detail-chip at3-detail-chip-link" data-nav-obj="' + relatedObjType + '" data-nav-id="' + relatedObjId + '">' + at3Icon(relatedObjType === 'projects' ? 'projects' : 'opportunities', 12, 'var(--accent)') + '<span style="color:var(--accent)">' + relatedObjLabel + '</span></div>';
  if (rec.location) h += '<div class="at3-detail-chip">' + at3Icon('mapPin', 12, 'var(--text-muted)') + '<span>' + rec.location + '</span></div>';
  h += '</div>';

  /* Meta */
  h += '<div class="at3-meta-row">';
  h += '<div class="at3-meta-tag">Owner: <strong>' + (rec.owner || 'Me') + '</strong></div>';
  if (rec.createdDate) h += '<div class="at3-meta-tag">Created: <strong>' + at3Date(rec.createdDate) + '</strong></div>';
  h += '</div>';

  h += '</div>'; /* header-info */

  /* Header right metrics */
  h += '<div class="at3-header-metrics">';
  h += '<div class="at3-hmetric"><div class="at3-hmetric-val" style="color:' + tc.color + '">' + (rec.type || '\u2014') + '</div><div class="at3-hmetric-label">Type</div></div>';
  h += '<div class="at3-hmetric"><div class="at3-hmetric-val" style="color:' + (rec.status === 'Completed' ? 'var(--success)' : rec.status === 'In Progress' ? 'var(--accent)' : 'var(--text-muted)') + '">' + (rec.status || '\u2014') + '</div><div class="at3-hmetric-label">Status</div></div>';
  h += '</div>';

  h += '</div>'; /* header-top */

  /* Quick Actions */
  h += '<div class="at3-actions">';
  h += '<button class="at3-action-btn at3-action-primary">' + at3Icon('edit', 13, '#fff') + '<span>Edit Activity</span></button>';
  h += '<button class="at3-action-btn at3-action-success" id="at3-complete">' + at3Icon('checkCircle', 13, '#fff') + '<span>Mark Completed</span></button>';
  h += '<button class="at3-action-btn at3-action-outline">' + at3Icon('messageSquare', 13, 'var(--text-muted)') + '<span>Add Note</span></button>';
  h += '<button class="at3-action-btn at3-action-outline">' + at3Icon('paperclip', 13, 'var(--text-muted)') + '<span>Attach Document</span></button>';
  h += '</div>';

  h += '</div>'; /* header-card */

  /* ── 4 KPI Cards ── */
  h += '<div class="at3-kpi-row">';
  h += at3KpiCard(rec.type || '\u2014', 'Activity Type', tc.color, tc.icon === 'phone' ? 'Direct contact' : tc.icon === 'users' ? 'Face to face' : 'Digital', 'var(--text-muted)');
  h += at3KpiCard(durationStr, 'Duration', 'var(--accent)', rec.date ? at3Date(rec.date) : '\u2014', 'var(--text-muted)');
  h += at3KpiCard(participants.length, 'Participants', 'var(--purple)', participants.length > 1 ? 'Multi-party' : 'Direct', 'var(--text-muted)');
  h += at3KpiCard(relatedActivities.length, 'Related Activities', 'var(--warning)', relatedActivities.length > 0 ? 'On same context' : 'First activity', 'var(--text-muted)');
  h += '</div>';

  /* ── Status Progression (stepper) ── */
  h += '<div class="at3-funnel-card">';
  h += '<div class="at3-funnel-title">Activity Lifecycle</div>';
  h += '<div class="at3-funnel">';
  var statusColors = { 'Planned': '#94a3b8', 'In Progress': '#3b82f6', 'Completed': '#10b981' };
  statusStages.forEach(function(st, i) {
    var isCurrent = i === currentStatusIdx;
    var isPast = i < currentStatusIdx;
    var stColor = statusColors[st] || '#94a3b8';
    var cls = isCurrent ? 'at3-funnel-step at3-funnel-current' : (isPast ? 'at3-funnel-step at3-funnel-done' : 'at3-funnel-step');
    h += '<div class="' + cls + '">';
    h += '<div class="at3-funnel-dot" style="background:' + (isCurrent || isPast ? stColor : '#e2e8f0') + '">';
    if (isPast) h += '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>';
    if (isCurrent) h += '<div class="at3-funnel-pulse"></div>';
    h += '</div>';
    h += '<div class="at3-funnel-label">' + st + '</div>';
    if (i < statusStages.length - 1) h += '<div class="at3-funnel-line" style="background:' + (isPast ? stColor : '#e2e8f0') + '"></div>';
    h += '</div>';
  });
  h += '</div></div>';

  /* ── 2-Column Layout ── */
  h += '<div class="at3-grid2">';

  /* ═══ LEFT COLUMN — Context ═══ */
  h += '<div class="at3-col">';

  /* Activity Summary */
  h += '<div class="at3-section"><div class="at3-section-head"><span class="at3-section-title">Activity Summary</span></div>';
  h += '<div class="at3-summary">';
  h += '<div class="at3-summary-row"><span class="at3-summary-label">Type</span><span class="at3-summary-value"><span class="at3-type-chip-sm" style="background:' + tc.bg + ';color:' + tc.color + '">' + at3Icon(tc.icon, 10, tc.color) + ' ' + (rec.type || '\u2014') + '</span></span></div>';
  h += '<div class="at3-summary-row"><span class="at3-summary-label">Date</span><span class="at3-summary-value">' + at3Date(rec.date) + (rec.time ? ' at ' + rec.time : '') + '</span></div>';
  if (rec.location) h += '<div class="at3-summary-row"><span class="at3-summary-label">Location</span><span class="at3-summary-value">' + rec.location + '</span></div>';
  if (rec.duration) h += '<div class="at3-summary-row"><span class="at3-summary-label">Duration</span><span class="at3-summary-value">' + durationStr + '</span></div>';
  h += '<div class="at3-summary-row"><span class="at3-summary-label">Purpose</span><span class="at3-summary-value">' + (rec.purpose || rec.description || '\u2014') + '</span></div>';
  if (relatedObjLabel) {
    var objTypeLabel = relatedObjType === 'projects' ? 'Project' : 'Opportunity';
    h += '<div class="at3-summary-row"><span class="at3-summary-label">' + objTypeLabel + '</span><span class="at3-summary-value at3-link" data-nav-obj="' + relatedObjType + '" data-nav-id="' + relatedObjId + '">' + relatedObjLabel + '</span></div>';
  }
  if (accountName !== '\u2014') h += '<div class="at3-summary-row"><span class="at3-summary-label">Account</span><span class="at3-summary-value at3-link" data-nav-obj="accounts" data-nav-id="' + (rec.accountId || '') + '">' + accountName + '</span></div>';
  h += '<div class="at3-summary-row"><span class="at3-summary-label">Status</span><span class="at3-summary-value">' + at3StatusBadge(rec.status) + '</span></div>';
  if (rec.outcome) h += '<div class="at3-summary-row at3-summary-row-full"><span class="at3-summary-label">Outcome</span><span class="at3-summary-value">' + rec.outcome + '</span></div>';
  h += '</div></div>';

  /* Related Object Info */
  if (opportunity || project) {
    var relObj = opportunity || project;
    var relLabel = opportunity ? 'Opportunity Context' : 'Project Context';
    h += '<div class="at3-section"><div class="at3-section-head"><span class="at3-section-title">' + relLabel + '</span></div>';
    h += '<div class="at3-rel-card">';
    h += '<div class="at3-rel-top">';
    var relIcon = opportunity ? 'opportunities' : 'projects';
    var relColor = opportunity ? 'var(--accent)' : 'var(--warning)';
    h += '<div class="at3-rel-avatar" style="background:' + relColor + '14;border-color:' + relColor + '40">' + at3Icon(relIcon, 16, relColor) + '</div>';
    h += '<div class="at3-rel-info">';
    h += '<div class="at3-rel-name" data-nav-obj="' + (opportunity ? 'opportunities' : 'projects') + '" data-nav-id="' + relObj.id + '">' + (relObj.name || '\u2014') + '</div>';
    h += '<div class="at3-rel-sub">' + accountName + '</div>';
    h += '</div></div>';
    h += '<div class="at3-rel-fields">';
    if (opportunity) {
      h += '<div class="at3-rel-field"><span class="at3-rel-field-label">Amount</span><span class="at3-rel-field-value">' + at3Fmt(opportunity.amount || 0) + '</span></div>';
      h += '<div class="at3-rel-field"><span class="at3-rel-field-label">Stage</span><span class="at3-rel-field-value">' + (opportunity.stage || '\u2014').replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); }) + '</span></div>';
      h += '<div class="at3-rel-field"><span class="at3-rel-field-label">Probability</span><span class="at3-rel-field-value">' + (opportunity.prob || 0) + '%</span></div>';
      h += '<div class="at3-rel-field"><span class="at3-rel-field-label">Close Date</span><span class="at3-rel-field-value">' + at3Date(opportunity.close) + '</span></div>';
    } else {
      h += '<div class="at3-rel-field"><span class="at3-rel-field-label">Value</span><span class="at3-rel-field-value">' + at3Fmt(project.value || 0) + '</span></div>';
      h += '<div class="at3-rel-field"><span class="at3-rel-field-label">Phase</span><span class="at3-rel-field-value">' + (project.phase || '\u2014') + '</span></div>';
      h += '<div class="at3-rel-field"><span class="at3-rel-field-label">Health</span><span class="at3-rel-field-value">' + (project.health || '\u2014') + '</span></div>';
      h += '<div class="at3-rel-field"><span class="at3-rel-field-label">Delivery</span><span class="at3-rel-field-value">' + at3Date(project.expectedDelivery || project.end) + '</span></div>';
    }
    h += '</div></div></div>';
  }

  /* Participants */
  h += at3SectionOpen('Participants', 'contacts', participants.length);
  if (!participants.length) h += '<div class="at3-empty">No participants recorded</div>';
  else {
    participants.forEach(function(p, i) {
      var pi = at3Initials(p.name);
      h += '<div class="at3-row' + (i === participants.length - 1 ? ' at3-row-last' : '') + '"' +
        (p.contactId ? ' data-nav-obj="contacts" data-nav-id="' + p.contactId + '"' : '') + '>';
      h += '<div class="at3-participant-avatar">' + pi + '</div>';
      h += '<div class="at3-row-left"><div class="at3-row-title">' + (p.name || '\u2014') + '</div><div class="at3-row-sub">' + (p.company || '') + (p.company && p.role ? ' \u00B7 ' : '') + (p.role || '') + '</div></div>';
      h += '<div style="display:flex;gap:4px">';
      h += '<div class="at3-contact-btn" title="Call">' + at3Icon('phone', 11, 'var(--text-light)') + '</div>';
      h += '<div class="at3-contact-btn" title="Email">' + at3Icon('mail', 11, 'var(--text-light)') + '</div>';
      h += '</div></div>';
    });
  }
  h += '</div>';

  /* Notes */
  h += at3SectionOpen('Notes', 'activities', notes.length);
  if (!notes.length) h += '<div class="at3-empty">No notes yet</div>';
  else {
    notes.forEach(function(n, i) {
      h += '<div class="at3-note' + (i === notes.length - 1 ? ' at3-row-last' : '') + '">';
      h += '<div class="at3-note-date">' + (n.date || '') + (n.author ? ' \u00B7 ' + n.author : '') + '</div>';
      h += '<div class="at3-note-text">' + (n.text || '') + '</div>';
      h += '</div>';
    });
  }
  h += '</div>';

  h += '</div>'; /* end left col */

  /* ═══ RIGHT COLUMN — History ═══ */
  h += '<div class="at3-col">';

  /* Activity Timeline (related activities) */
  h += at3SectionOpen('Activity Timeline', 'activities', relatedActivities.length);
  if (!relatedActivities.length) h += '<div class="at3-empty">No related activities</div>';
  else {
    h += '<div class="at3-timeline">';
    relatedActivities.forEach(function(a, i) {
      var isLast = i === relatedActivities.length - 1;
      var atc = at3TypeConfig(a.type);
      var typeLabel = a.type || 'Activity';
      h += '<div class="at3-tl-item">';
      if (!isLast) h += '<div class="at3-tl-line"></div>';
      h += '<div class="at3-tl-icon" style="background:' + atc.bg + ';border-color:' + atc.color + '40">' + at3Icon(atc.icon, 11, atc.color) + '</div>';
      h += '<div class="at3-tl-body">';
      h += '<div class="at3-tl-top"><span class="at3-tl-subject">' + (a.subject || a.name || typeLabel) + '</span><span class="at3-tl-type" style="color:' + atc.color + '">' + typeLabel + '</span></div>';
      h += '<div class="at3-tl-meta">' + (a.contact || '') + (a.date ? ' \u00B7 ' + at3Date(a.date) : '') + '</div>';
      if (a.description) h += '<div class="at3-tl-desc">' + a.description + '</div>';
      h += '</div></div>';
    });
    h += '</div>';
  }
  h += '</div>';

  /* Tasks */
  h += at3SectionOpen('Tasks', 'activities', tasks.length);
  if (!tasks.length) h += '<div class="at3-empty">No tasks linked</div>';
  else {
    tasks.forEach(function(t, i) {
      var tColors = { 'Completed': 'var(--success)', 'In Progress': 'var(--accent)', 'To Do': 'var(--text-light)' };
      var tColor = tColors[t.status] || 'var(--text-muted)';
      h += '<div class="at3-row' + (i === tasks.length - 1 ? ' at3-row-last' : '') + '">';
      h += '<div style="display:flex;align-items:flex-start;gap:7px;flex:1;min-width:0">';
      h += '<span class="at3-task-dot" style="background:' + tColor + '"></span>';
      h += '<div style="flex:1;min-width:0"><div class="at3-row-title">' + (t.name || '') + '</div><div class="at3-row-sub">' + (t.assignee || '') + (t.dueDate ? ' \u00B7 Due ' + at3Date(t.dueDate) : '') + '</div></div></div>';
      h += '<span style="font-size:10px;font-weight:500;color:' + tColor + '">' + (t.status || '') + '</span>';
      h += '</div>';
    });
  }
  h += '</div>';

  /* Attachments */
  h += at3SectionOpen('Attachments', 'activities', attachments.length);
  if (!attachments.length) h += '<div class="at3-empty">No attachments</div>';
  else {
    attachments.forEach(function(d, i) {
      h += '<div class="at3-row' + (i === attachments.length - 1 ? ' at3-row-last' : '') + '">';
      h += '<div class="at3-doc-icon">' + at3Icon('fileText', 14, 'var(--accent)') + '</div>';
      h += '<div class="at3-row-left"><div class="at3-row-title">' + (d.name || 'Document') + '</div><div class="at3-row-sub">' + (d.type || '') + (d.size ? ' \u00B7 ' + d.size : '') + (d.date ? ' \u00B7 ' + at3Date(d.date) : '') + '</div></div>';
      h += '</div>';
    });
  }
  h += '</div>';

  h += '</div>'; /* end right col */

  h += '</div>'; /* end grid2 */
  h += '</div>'; /* end at3 */

  container.innerHTML = h;
  container.scrollTop = 0;

  /* ── Bind Events ── */
  var backBtn = document.getElementById('at3-back');
  if (backBtn) backBtn.addEventListener('click', function() { navigate('activities'); });

  /* Account link */
  var acctLink = document.getElementById('at3-acct-link');
  if (acctLink) {
    acctLink.addEventListener('click', function() {
      var aid = acctLink.getAttribute('data-acct-id');
      if (aid) navigate('record', 'accounts', aid);
    });
  }

  /* Mark Completed */
  var completeBtn = document.getElementById('at3-complete');
  if (completeBtn) {
    completeBtn.addEventListener('click', function() {
      rec.status = 'Completed';
      renderActivity360(container, rec);
    });
  }

  /* Navigable rows */
  container.querySelectorAll('[data-nav-obj][data-nav-id]').forEach(function(el) {
    el.style.cursor = 'pointer';
    el.addEventListener('click', function(e) {
      if (e.target.closest('.at3-contact-btn')) return;
      navigate('record', el.getAttribute('data-nav-obj'), el.getAttribute('data-nav-id'));
    });
  });

  /* Links in summary */
  container.querySelectorAll('.at3-link[data-nav-obj]').forEach(function(el) {
    el.addEventListener('click', function() {
      navigate('record', el.getAttribute('data-nav-obj'), el.getAttribute('data-nav-id'));
    });
  });
}


/* ═══════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════ */
function injectAT360Styles() {
  if (document.getElementById('at360-css')) return;
  var s = document.createElement('style'); s.id = 'at360-css';
  s.textContent = '\
.at3{max-width:1140px;margin:0 auto;padding:14px 18px 48px}\
.at3-back{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;color:var(--text-muted);cursor:pointer;padding:4px 0;margin-bottom:10px;transition:color .12s}\
.at3-back:hover{color:var(--accent)}\
\
/* Header Card */\
.at3-header-card{background:var(--card);border-radius:10px;box-shadow:0 1px 4px rgba(0,0,0,.06);border:1px solid var(--border);margin-bottom:14px;overflow:hidden}\
.at3-header-top{padding:22px 26px 18px;display:flex;gap:20px;align-items:flex-start}\
.at3-avatar{width:64px;height:64px;border-radius:14px;flex-shrink:0;border:2px solid;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.06)}\
.at3-header-info{flex:1;min-width:0}\
.at3-name-row{display:flex;align-items:center;gap:10px;margin-bottom:4px;flex-wrap:wrap}\
.at3-name{font-size:22px;font-weight:800;color:var(--text);letter-spacing:-.5px;margin:0;line-height:1.1}\
\
/* Type line */\
.at3-type-line{display:flex;align-items:center;gap:6px;margin-bottom:6px;flex-wrap:wrap}\
.at3-type-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;border:1px solid}\
.at3-type-chip-sm{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:5px;font-size:10px;font-weight:600}\
.at3-date-chip{display:inline-flex;align-items:center;gap:4px;font-size:11px;color:var(--text-muted);font-weight:500}\
.at3-sep{color:var(--text-light);font-size:14px}\
\
/* Company */\
.at3-company{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:var(--accent);cursor:pointer;margin-bottom:8px;transition:opacity .12s}\
.at3-company:hover{opacity:.75}\
\
/* Detail chips */\
.at3-details-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}\
.at3-detail-chip{display:inline-flex;align-items:center;gap:5px;background:#f8f9fb;border:1px solid var(--border);padding:4px 10px;border-radius:6px;font-size:11px;color:var(--text-muted);font-weight:500}\
.at3-detail-chip-link{cursor:pointer;transition:border-color .12s}\
.at3-detail-chip-link:hover{border-color:var(--accent)}\
\
/* Meta */\
.at3-meta-row{display:flex;flex-wrap:wrap;gap:8px}\
.at3-meta-tag{font-size:10px;color:var(--text-light);font-weight:500}\
.at3-meta-tag strong{color:var(--text-muted);font-weight:600}\
\
/* Header metrics */\
.at3-header-metrics{display:flex;flex-direction:column;gap:12px;flex-shrink:0;align-items:center;padding-left:20px;border-left:1px solid var(--border)}\
.at3-hmetric{display:flex;flex-direction:column;align-items:center}\
.at3-hmetric-val{font-size:18px;font-weight:800;letter-spacing:-.3px;line-height:1;white-space:nowrap}\
.at3-hmetric-label{font-size:9px;color:var(--text-light);font-weight:500;margin-top:2px;text-transform:uppercase;letter-spacing:.3px}\
\
/* Badges */\
.at3-b{font-size:10.5px;font-weight:600;padding:2px 9px;border-radius:6px;display:inline-flex;align-items:center;gap:3px;white-space:nowrap}\
.at3-b--bl{background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe}\
.at3-b--gn{background:#ecfdf5;color:#059669;border:1px solid #a7f3d0}\
.at3-b--am{background:#fffbeb;color:#d97706;border:1px solid #fde68a}\
.at3-b--rd{background:#fef2f2;color:#dc2626;border:1px solid #fecaca}\
.at3-b--gy{background:#f8fafc;color:#64748b;border:1px solid #e2e8f0}\
\
/* Actions */\
.at3-actions{display:flex;gap:7px;padding:12px 26px 14px;border-top:1px solid var(--border);flex-wrap:wrap}\
.at3-action-btn{display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:7px;border:none;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;transition:all .12s}\
.at3-action-primary{background:var(--accent);color:#fff}\
.at3-action-primary:hover{background:var(--accent-hover)}\
.at3-action-success{background:var(--success);color:#fff}\
.at3-action-success:hover{background:#059669}\
.at3-action-outline{background:transparent;border:1px solid var(--border);color:var(--text-muted)}\
.at3-action-outline:hover{border-color:#bbb;color:var(--text);background:#f8f9fb}\
\
/* KPI Row */\
.at3-kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}\
.at3-kpi{background:var(--card);border-radius:10px;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,.04);padding:16px 18px;text-align:center;transition:all .15s}\
.at3-kpi:hover{box-shadow:0 4px 14px rgba(0,0,0,.08);transform:translateY(-2px)}\
.at3-kpi-value{font-size:28px;font-weight:800;letter-spacing:-1px;line-height:1;margin-bottom:3px;font-variant-numeric:tabular-nums}\
.at3-kpi-label{font-size:10.5px;color:var(--text-muted);font-weight:500;text-transform:uppercase;letter-spacing:.4px}\
.at3-kpi-insight{font-size:9.5px;font-weight:600;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)}\
\
/* Funnel / Stepper */\
.at3-funnel-card{background:var(--card);border-radius:10px;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,.04);padding:18px 24px;margin-bottom:14px}\
.at3-funnel-title{font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:16px}\
.at3-funnel{display:flex;align-items:center;gap:0;width:100%;padding-bottom:38px}\
.at3-funnel-step{display:flex;align-items:center;flex:1;position:relative}\
.at3-funnel-step:last-child{flex:0 0 auto}\
.at3-funnel-dot{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;z-index:1;transition:all .2s}\
.at3-funnel-current .at3-funnel-dot{box-shadow:0 0 0 4px rgba(37,99,235,.15)}\
.at3-funnel-pulse{width:10px;height:10px;border-radius:50%;background:#fff;animation:at3pulse 1.5s ease-in-out infinite}\
@keyframes at3pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.7)}}\
.at3-funnel-label{position:absolute;top:48px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:600;color:var(--text-muted);white-space:nowrap;text-transform:uppercase;letter-spacing:.3px}\
.at3-funnel-current .at3-funnel-label{color:var(--accent);font-weight:700}\
.at3-funnel-done .at3-funnel-label{color:var(--success)}\
.at3-funnel-line{flex:1;height:3px;border-radius:2px;margin:0 6px;transition:background .2s}\
\
/* 2-Column Grid */\
.at3-grid2{display:grid;grid-template-columns:1.12fr 1fr;gap:14px;align-items:start}\
.at3-col{display:flex;flex-direction:column;gap:12px}\
\
/* Sections */\
.at3-section{background:var(--card);border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,.04);border:1px solid var(--border);overflow:hidden}\
.at3-section-head{padding:11px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:7px}\
.at3-section-title{font-size:11.5px;font-weight:700;color:var(--text);text-transform:uppercase;letter-spacing:.5px}\
.at3-section-count{font-size:10px;font-weight:600;color:var(--accent);background:var(--accent-light);padding:1px 7px;border-radius:8px}\
.at3-section-link{margin-left:auto;font-size:10px;font-weight:500;color:var(--text-light);cursor:pointer;transition:color .12s}\
.at3-section-link:hover{color:var(--accent)}\
\
/* Rows */\
.at3-row{padding:10px 16px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .08s;display:flex;align-items:center;gap:10px}\
.at3-row:hover{background:#fafbfc}\
.at3-row-last{border-bottom:none}\
.at3-row-left{flex:1;min-width:0}\
.at3-row-title{font-size:12.5px;font-weight:700;color:var(--text);line-height:1.2}\
.at3-row-sub{font-size:10px;color:var(--text-light);margin-top:2px}\
.at3-empty{padding:20px 16px;text-align:center;color:var(--text-light);font-size:11px}\
\
/* Summary */\
.at3-summary{padding:4px 0}\
.at3-summary-row{display:flex;justify-content:space-between;align-items:flex-start;padding:9px 16px;border-bottom:1px solid var(--border)}\
.at3-summary-row:last-child{border-bottom:none}\
.at3-summary-row-full{flex-direction:column;gap:4px}\
.at3-summary-label{font-size:11px;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.3px;flex-shrink:0}\
.at3-summary-value{font-size:12.5px;font-weight:600;color:var(--text);text-align:right;max-width:60%}\
.at3-summary-row-full .at3-summary-value{text-align:left;max-width:100%;line-height:1.5}\
\
/* Related Object Card */\
.at3-rel-card{padding:16px}\
.at3-rel-top{display:flex;gap:12px;align-items:center;margin-bottom:14px}\
.at3-rel-avatar{width:40px;height:40px;border-radius:10px;border:1.5px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0}\
.at3-rel-info{flex:1;min-width:0}\
.at3-rel-name{font-size:14px;font-weight:700;color:var(--accent);cursor:pointer;transition:opacity .12s}\
.at3-rel-name:hover{opacity:.75}\
.at3-rel-sub{font-size:11px;color:var(--text-light);margin-top:1px}\
.at3-rel-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px}\
.at3-rel-field{display:flex;flex-direction:column;gap:2px}\
.at3-rel-field-label{font-size:9px;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.4px}\
.at3-rel-field-value{font-size:12.5px;font-weight:700;color:var(--text)}\
\
/* Participant avatar */\
.at3-participant-avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--accent);flex-shrink:0}\
.at3-contact-btn{width:26px;height:26px;border-radius:6px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .12s}\
.at3-contact-btn:hover{background:#f0f0f2;border-color:#bbb}\
\
/* Notes */\
.at3-note{padding:12px 16px;border-bottom:1px solid var(--border)}\
.at3-note:last-child,.at3-note.at3-row-last{border-bottom:none}\
.at3-note-date{font-size:9px;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px}\
.at3-note-text{font-size:12px;color:var(--text);line-height:1.55}\
\
/* Task dot */\
.at3-task-dot{width:7px;height:7px;border-radius:50%;margin-top:5px;flex-shrink:0}\
\
/* Document icon */\
.at3-doc-icon{width:32px;height:32px;border-radius:8px;background:var(--accent-light);display:flex;align-items:center;justify-content:center;flex-shrink:0}\
\
/* Timeline */\
.at3-timeline{padding:12px 16px}\
.at3-tl-item{display:flex;gap:10px;position:relative;padding-bottom:16px}\
.at3-tl-item:last-child{padding-bottom:0}\
.at3-tl-line{position:absolute;left:13px;top:28px;bottom:0;width:1.5px;background:var(--border);border-radius:1px}\
.at3-tl-item:last-child .at3-tl-line{display:none}\
.at3-tl-icon{width:26px;height:26px;border-radius:8px;border:1.5px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0;z-index:1;background:var(--card)}\
.at3-tl-body{flex:1;min-width:0;padding-top:2px}\
.at3-tl-top{display:flex;justify-content:space-between;align-items:baseline}\
.at3-tl-subject{font-size:12px;font-weight:600;color:var(--text);line-height:1.2}\
.at3-tl-type{font-size:10px;font-weight:600;flex-shrink:0;margin-left:8px}\
.at3-tl-meta{font-size:10px;color:var(--text-light);margin-top:2px}\
.at3-tl-desc{font-size:10.5px;color:var(--text-muted);margin-top:3px;line-height:1.4}\
\
/* Links */\
.at3-link{color:var(--accent);cursor:pointer;transition:opacity .12s}\
.at3-link:hover{opacity:.75}\
\
/* Responsive */\
@media(max-width:1100px){\
  .at3-grid2{grid-template-columns:1fr}\
  .at3-kpi-row{grid-template-columns:repeat(2,1fr)}\
  .at3-header-top{flex-wrap:wrap}\
  .at3-header-metrics{border-left:none;padding-left:0;flex-direction:row;gap:20px;margin-top:10px}\
}\
@media(max-width:768px){\
  .at3-kpi-row{grid-template-columns:repeat(2,1fr)}\
  .at3-actions{flex-wrap:wrap}\
  .at3-funnel{flex-wrap:wrap;gap:8px}\
  .at3-funnel-line{display:none}\
  .at3-funnel-label{position:static;transform:none;margin-top:4px}\
  .at3-funnel-step{flex-direction:column;align-items:center;flex:0 0 auto}\
  .at3-rel-fields{grid-template-columns:1fr}\
}\
';
  document.head.appendChild(s);
}
