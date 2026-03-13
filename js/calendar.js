/* ═══════════════════════════════════════════════════════
   calendar.js — Calendar Module (MickaCRM v4)
   Uses: window.DATA.activities, svgIcon(), navigate(), fmtDate()
   Styles injected via injectCalStyles()
   ═══════════════════════════════════════════════════════ */

var calState = { view: 'month', currentDate: new Date(), editingId: null };

/* ── Type colors ── */
var CAL_TYPE_COLORS = {
  'Call':       '#3b82f6',
  'Meeting':    '#8b5cf6',
  'Email':      '#10b981',
  'Site Visit': '#ef4444',
  'Task':       '#f59e0b',
  'Note':       '#64748b'
};
var CAL_TYPE_ICONS = {
  'Call':       'phone',
  'Meeting':    'users',
  'Email':      'mail',
  'Site Visit': 'mapPin',
  'Task':       'activities',
  'Note':       'activities'
};

/* ── Helpers ── */
function calDateStr(d) {
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var dd = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + dd;
}
function calGetWeekStart(d) {
  var day = d.getDay();
  var diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
}
function calGetActivities(ds) {
  return (window.DATA.activities || []).filter(function(a) { return a.date === ds; });
}
function calMonthNames() {
  return ['January','February','March','April','May','June','July','August','September','October','November','December'];
}

/* ═══════════════════════════════════════════════════════
   RENDER CALENDAR — main entry point
   ═══════════════════════════════════════════════════════ */
function renderCalendarPage(headerEl, contentEl) {
  injectCalStyles();
  headerEl.style.display = 'none';

  var d = calState.currentDate;
  var h = '<div class="cal-wrapper">';

  /* ── Toolbar ── */
  h += '<div class="cal-toolbar">';
  h += '<div class="cal-toolbar-left">';
  h += '<button class="cal-nav-btn" id="cal-prev">' + svgIcon('arrowLeft', 14, 'var(--text)') + '</button>';
  h += '<button class="cal-nav-btn" id="cal-next" style="transform:scaleX(-1)">' + svgIcon('arrowLeft', 14, 'var(--text)') + '</button>';
  h += '<button class="cal-today-btn" id="cal-today">Today</button>';
  h += '<span class="cal-title" id="cal-title">' + calGetTitle(d) + '</span>';
  h += '</div>';
  h += '<div class="cal-toolbar-right">';
  h += '<div class="cal-view-toggle">';
  h += '<button class="cal-view-btn' + (calState.view === 'month' ? ' active' : '') + '" data-view="month">Month</button>';
  h += '<button class="cal-view-btn' + (calState.view === 'week' ? ' active' : '') + '" data-view="week">Week</button>';
  h += '</div>';
  h += '<button class="cal-new-btn" id="cal-new-activity">' + svgIcon('plus', 13, '#fff') + '<span>New Activity</span></button>';
  h += '</div>';
  h += '</div>';

  /* ── Calendar Grid ── */
  if (calState.view === 'month') {
    h += calRenderMonth(d);
  } else {
    h += calRenderWeek(d);
  }

  /* ── Legend ── */
  h += '<div class="cal-legend">';
  ['Call','Meeting','Email','Site Visit'].forEach(function(t) {
    h += '<div class="cal-legend-item"><span class="cal-legend-dot" style="background:' + CAL_TYPE_COLORS[t] + '"></span>' + t + '</div>';
  });
  h += '</div>';

  h += '</div>';
  contentEl.innerHTML = h;

  /* ── Bind Events ── */
  document.getElementById('cal-prev').addEventListener('click', function() { calStep(-1); renderCalendarPage(headerEl, contentEl); });
  document.getElementById('cal-next').addEventListener('click', function() { calStep(1); renderCalendarPage(headerEl, contentEl); });
  document.getElementById('cal-today').addEventListener('click', function() { calState.currentDate = new Date(); renderCalendarPage(headerEl, contentEl); });
  document.getElementById('cal-new-activity').addEventListener('click', function() { calOpenModal(null, null, null, headerEl, contentEl); });

  contentEl.querySelectorAll('.cal-view-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      calState.view = btn.getAttribute('data-view');
      renderCalendarPage(headerEl, contentEl);
    });
  });

  /* Click on activity pill → open record */
  contentEl.querySelectorAll('.cal-event').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      var id = el.getAttribute('data-id');
      if (id) navigate('record', 'activities', id);
    });
  });

  /* Click on empty day cell → create */
  contentEl.querySelectorAll('.cal-day[data-date]').forEach(function(cell) {
    cell.addEventListener('click', function(e) {
      if (e.target.closest('.cal-event')) return;
      var ds = cell.getAttribute('data-date');
      calOpenModal(null, ds, null, headerEl, contentEl);
    });
  });

  /* Click on hour slot → create with time */
  contentEl.querySelectorAll('.cal-hour-slot[data-date][data-hour]').forEach(function(slot) {
    slot.addEventListener('click', function(e) {
      if (e.target.closest('.cal-event')) return;
      var ds = slot.getAttribute('data-date');
      var hour = slot.getAttribute('data-hour');
      calOpenModal(null, ds, hour + ':00', headerEl, contentEl);
    });
  });
}

function calGetTitle(d) {
  var months = calMonthNames();
  if (calState.view === 'month') {
    return months[d.getMonth()] + ' ' + d.getFullYear();
  } else {
    var ws = calGetWeekStart(d);
    var we = new Date(ws); we.setDate(we.getDate() + 6);
    var fmt = function(dt) { return months[dt.getMonth()].substring(0, 3) + ' ' + dt.getDate(); };
    return fmt(ws) + ' \u2013 ' + fmt(we) + ', ' + we.getFullYear();
  }
}

function calStep(dir) {
  var d = calState.currentDate;
  if (calState.view === 'month') {
    calState.currentDate = new Date(d.getFullYear(), d.getMonth() + dir, 1);
  } else {
    var nd = new Date(d);
    nd.setDate(nd.getDate() + dir * 7);
    calState.currentDate = nd;
  }
}


/* ═══════════════════════════════════════════════════════
   MONTH VIEW
   ═══════════════════════════════════════════════════════ */
function calRenderMonth(d) {
  var year = d.getFullYear(), month = d.getMonth();
  var firstDay = new Date(year, month, 1);
  var startDow = firstDay.getDay();
  var startOffset = startDow === 0 ? 6 : startDow - 1;
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var today = calDateStr(new Date());

  var h = '<div class="cal-month">';

  /* Day-of-week header */
  h += '<div class="cal-month-header">';
  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(function(dn) {
    h += '<div class="cal-dow">' + dn + '</div>';
  });
  h += '</div>';

  /* Day cells */
  h += '<div class="cal-month-grid">';
  var totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  for (var i = 0; i < totalCells; i++) {
    var dayNum = i - startOffset + 1;
    var isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
    var cellDate = new Date(year, month, dayNum);
    var ds = calDateStr(cellDate);
    var isToday = ds === today;
    var acts = isCurrentMonth ? calGetActivities(ds) : [];

    h += '<div class="cal-day' + (!isCurrentMonth ? ' cal-day-other' : '') + (isToday ? ' cal-day-today' : '') + '" data-date="' + ds + '">';
    h += '<div class="cal-day-num' + (isToday ? ' cal-day-num-today' : '') + '">' + cellDate.getDate() + '</div>';

    /* Activity pills (max 3) */
    acts.forEach(function(act, idx) {
      if (idx >= 3) return;
      var col = CAL_TYPE_COLORS[act.type] || '#64748b';
      h += '<div class="cal-event" data-id="' + act.id + '" style="--evt-color:' + col + '">';
      h += '<span class="cal-event-dot" style="background:' + col + '"></span>';
      h += '<span class="cal-event-label">' + (act.time ? act.time + ' ' : '') + (act.subject || act.type || 'Activity') + '</span>';
      h += '</div>';
    });
    if (acts.length > 3) {
      h += '<div class="cal-event-more">+' + (acts.length - 3) + ' more</div>';
    }
    h += '</div>';
  }
  h += '</div></div>';
  return h;
}


/* ═══════════════════════════════════════════════════════
   WEEK VIEW
   ═══════════════════════════════════════════════════════ */
function calRenderWeek(d) {
  var ws = calGetWeekStart(d);
  var today = calDateStr(new Date());
  var hours = [];
  for (var hh = 7; hh <= 20; hh++) hours.push(hh);

  var h = '<div class="cal-week">';

  /* Header row */
  h += '<div class="cal-week-header"><div class="cal-week-gutter"></div>';
  var dayNames = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  for (var i = 0; i < 7; i++) {
    var dd = new Date(ws); dd.setDate(dd.getDate() + i);
    var ds = calDateStr(dd);
    h += '<div class="cal-week-day-hdr' + (ds === today ? ' cal-week-day-hdr-today' : '') + '">';
    h += '<span class="cal-week-day-name">' + dayNames[i] + '</span>';
    h += '<span class="cal-week-day-num' + (ds === today ? ' cal-week-day-num-today' : '') + '">' + dd.getDate() + '</span>';
    h += '</div>';
  }
  h += '</div>';

  /* Body */
  h += '<div class="cal-week-body">';
  hours.forEach(function(hr) {
    h += '<div class="cal-week-row">';
    h += '<div class="cal-week-gutter"><span class="cal-week-time">' + String(hr).padStart(2, '0') + ':00</span></div>';
    for (var i = 0; i < 7; i++) {
      var dd = new Date(ws); dd.setDate(dd.getDate() + i);
      var ds = calDateStr(dd);
      var isToday = ds === today;
      var cellActs = calGetActivities(ds).filter(function(a) {
        if (!a.time) return hr === 9;
        var aHour = parseInt(a.time.split(':')[0], 10);
        return aHour === hr;
      });

      h += '<div class="cal-hour-slot' + (isToday ? ' cal-hour-slot-today' : '') + '" data-date="' + ds + '" data-hour="' + hr + '">';
      cellActs.forEach(function(act) {
        var col = CAL_TYPE_COLORS[act.type] || '#64748b';
        var dur = act.duration || 60;
        var heightPx = Math.max(Math.round(dur / 60 * 48), 24);
        h += '<div class="cal-event cal-event-week" data-id="' + act.id + '" style="--evt-color:' + col + ';height:' + heightPx + 'px">';
        h += '<div class="cal-event-week-top">';
        h += '<span class="cal-event-dot" style="background:' + col + '"></span>';
        h += '<span class="cal-event-label">' + (act.subject || act.type || 'Activity') + '</span>';
        h += '</div>';
        if (dur > 30) {
          h += '<div class="cal-event-week-meta">' + (act.time || '') + (act.contact ? ' \u00B7 ' + act.contact : '') + '</div>';
        }
        h += '</div>';
      });
      h += '</div>';
    }
    h += '</div>';
  });
  h += '</div></div>';
  return h;
}


/* ═══════════════════════════════════════════════════════
   ACTIVITY MODAL — Create / Edit
   ═══════════════════════════════════════════════════════ */
function calOpenModal(existingAct, prefillDate, prefillTime, headerEl, contentEl) {
  calCloseModal();

  var isEdit = !!existingAct;
  var act = existingAct || {
    id: '', type: 'Meeting', subject: '', date: prefillDate || calDateStr(new Date()),
    time: prefillTime || '09:00', duration: 60, status: 'Planned',
    accountId: '', contact: '', opportunityId: '', projectId: '',
    location: '', purpose: '', owner: 'Me'
  };

  var D = window.DATA;
  var accounts = D.accounts || [];
  var contacts = D.contacts || [];
  var opps = D.opportunities || [];
  var projects = D.projects || [];

  /* Build modal HTML */
  var overlay = document.createElement('div');
  overlay.className = 'cal-modal-overlay';
  overlay.id = 'cal-modal-overlay';

  var modal = document.createElement('div');
  modal.className = 'cal-modal';
  modal.id = 'cal-modal';

  var mh = '';

  /* Header */
  mh += '<div class="cal-modal-header">';
  mh += '<div style="display:flex;align-items:center;gap:8px">' + svgIcon('activities', 18, 'var(--accent)') + '<span style="font-size:15px;font-weight:700;color:var(--text)">' + (isEdit ? 'Edit Activity' : 'New Activity') + '</span></div>';
  mh += '<button class="cal-modal-close" id="cal-modal-close">\u00D7</button>';
  mh += '</div>';

  /* Body */
  mh += '<div class="cal-modal-body">';

  /* Row: Type + Subject */
  mh += '<div class="cal-modal-row">';
  mh += '<div class="cal-modal-field" style="flex:0 0 140px"><label>Type</label><select id="cal-act-type">';
  ['Call','Meeting','Site Visit','Email'].forEach(function(t) {
    mh += '<option value="' + t + '"' + (act.type === t ? ' selected' : '') + '>' + t + '</option>';
  });
  mh += '</select></div>';
  mh += '<div class="cal-modal-field" style="flex:1"><label>Subject</label><input id="cal-act-subject" value="' + ((act.subject || '').replace(/"/g, '&quot;')) + '" placeholder="Activity subject..."></div>';
  mh += '</div>';

  /* Row: Date + Time + Duration */
  mh += '<div class="cal-modal-row">';
  mh += '<div class="cal-modal-field"><label>Date</label><input type="date" id="cal-act-date" value="' + (act.date || '') + '"></div>';
  mh += '<div class="cal-modal-field"><label>Time</label><input type="time" id="cal-act-time" value="' + (act.time || '') + '"></div>';
  mh += '<div class="cal-modal-field"><label>Duration (min)</label><input type="number" id="cal-act-duration" value="' + (act.duration || 60) + '" min="15" step="15"></div>';
  mh += '</div>';

  /* Row: Status + Owner */
  mh += '<div class="cal-modal-row">';
  mh += '<div class="cal-modal-field"><label>Status</label><select id="cal-act-status">';
  ['Planned','In Progress','Completed'].forEach(function(s) {
    mh += '<option value="' + s + '"' + (act.status === s ? ' selected' : '') + '>' + s + '</option>';
  });
  mh += '</select></div>';
  mh += '<div class="cal-modal-field"><label>Owner</label><input id="cal-act-owner" value="' + ((act.owner || 'Me').replace(/"/g, '&quot;')) + '"></div>';
  mh += '</div>';

  /* Row: Account + Contact */
  mh += '<div class="cal-modal-row">';
  mh += '<div class="cal-modal-field"><label>Account</label><select id="cal-act-account"><option value="">\u2014 None \u2014</option>';
  accounts.forEach(function(a) {
    mh += '<option value="' + a.id + '"' + (act.accountId === a.id ? ' selected' : '') + '>' + a.name + '</option>';
  });
  mh += '</select></div>';
  mh += '<div class="cal-modal-field"><label>Contact</label><select id="cal-act-contact"><option value="">\u2014 None \u2014</option>';
  contacts.forEach(function(c) {
    mh += '<option value="' + c.id + '"' + (act.contactId === c.id ? ' selected' : '') + '>' + c.name + '</option>';
  });
  mh += '</select></div>';
  mh += '</div>';

  /* Row: Opportunity + Project */
  mh += '<div class="cal-modal-row">';
  mh += '<div class="cal-modal-field"><label>Opportunity</label><select id="cal-act-opp"><option value="">\u2014 None \u2014</option>';
  opps.forEach(function(o) {
    mh += '<option value="' + o.id + '"' + (act.opportunityId === o.id ? ' selected' : '') + '>' + o.name + '</option>';
  });
  mh += '</select></div>';
  mh += '<div class="cal-modal-field"><label>Project</label><select id="cal-act-project"><option value="">\u2014 None \u2014</option>';
  projects.forEach(function(p) {
    mh += '<option value="' + p.id + '"' + (act.projectId === p.id ? ' selected' : '') + '>' + p.name + '</option>';
  });
  mh += '</select></div>';
  mh += '</div>';

  /* Location */
  mh += '<div class="cal-modal-field"><label>Location</label><input id="cal-act-location" value="' + ((act.location || '').replace(/"/g, '&quot;')) + '" placeholder="e.g. Client HQ, Microsoft Teams..."></div>';

  /* Purpose */
  mh += '<div class="cal-modal-field" style="margin-top:6px"><label>Purpose / Notes</label><textarea id="cal-act-purpose" rows="3" placeholder="Describe the purpose of this activity...">' + (act.purpose || act.description || '') + '</textarea></div>';

  mh += '</div>'; /* end body */

  /* Footer */
  mh += '<div class="cal-modal-footer">';
  if (isEdit) {
    mh += '<button class="cal-modal-btn cal-modal-btn-danger" id="cal-act-delete">' + svgIcon('claims', 12, '#fff') + ' Delete</button>';
  }
  mh += '<div style="flex:1"></div>';
  mh += '<button class="cal-modal-btn cal-modal-btn-outline" id="cal-act-cancel">Cancel</button>';
  mh += '<button class="cal-modal-btn cal-modal-btn-primary" id="cal-act-save">' + svgIcon(isEdit ? 'check' : 'plus', 12, '#fff') + ' ' + (isEdit ? 'Save Changes' : 'Create Activity') + '</button>';
  mh += '</div>';

  modal.innerHTML = mh;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  requestAnimationFrame(function() { overlay.classList.add('active'); });

  /* ── Bindings ── */
  var close = function() { calCloseModal(); };
  document.getElementById('cal-modal-close').addEventListener('click', close);
  document.getElementById('cal-act-cancel').addEventListener('click', close);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });

  /* Account change → filter contacts */
  document.getElementById('cal-act-account').addEventListener('change', function() {
    var accId = this.value;
    var contactSel = document.getElementById('cal-act-contact');
    var currentVal = contactSel.value;
    contactSel.innerHTML = '<option value="">\u2014 None \u2014</option>';
    var filtered = accId ? contacts.filter(function(c) { return c.account === accId; }) : contacts;
    filtered.forEach(function(c) {
      contactSel.innerHTML += '<option value="' + c.id + '"' + (c.id === currentVal ? ' selected' : '') + '>' + c.name + '</option>';
    });
  });

  /* Save */
  document.getElementById('cal-act-save').addEventListener('click', function() {
    var subject = document.getElementById('cal-act-subject').value.trim();
    if (!subject) {
      document.getElementById('cal-act-subject').style.borderColor = 'var(--danger)';
      document.getElementById('cal-act-subject').focus();
      return;
    }

    var accId = document.getElementById('cal-act-account').value;
    var accObj = accounts.find(function(a) { return a.id === accId; });
    var conId = document.getElementById('cal-act-contact').value;
    var conObj = contacts.find(function(c) { return c.id === conId; });
    var oppId = document.getElementById('cal-act-opp').value;
    var oppObj = opps.find(function(o) { return o.id === oppId; });
    var projId = document.getElementById('cal-act-project').value;
    var projObj = projects.find(function(p) { return p.id === projId; });

    var newAct = {
      id: isEdit ? act.id : 'act' + (Date.now()),
      type: document.getElementById('cal-act-type').value,
      subject: subject,
      date: document.getElementById('cal-act-date').value,
      time: document.getElementById('cal-act-time').value,
      duration: parseInt(document.getElementById('cal-act-duration').value, 10) || 60,
      status: document.getElementById('cal-act-status').value,
      owner: document.getElementById('cal-act-owner').value || 'Me',
      accountId: accId || '',
      accountName: accObj ? accObj.name : '',
      contactId: conId || '',
      contact: conObj ? conObj.name : '',
      contactRole: conObj ? conObj.role : '',
      opportunityId: oppId || '',
      opportunityName: oppObj ? oppObj.name : '',
      projectId: projId || '',
      projectName: projObj ? projObj.name : '',
      location: document.getElementById('cal-act-location').value,
      purpose: document.getElementById('cal-act-purpose').value,
      createdDate: isEdit ? (act.createdDate || act.date) : calDateStr(new Date()),
      participants: isEdit ? (act.participants || []) : [],
      notes: isEdit ? (act.notes || []) : [],
      tasks: isEdit ? (act.tasks || []) : [],
      documents: isEdit ? (act.documents || []) : []
    };

    if (!window.DATA.activities) window.DATA.activities = [];

    if (isEdit) {
      var idx = window.DATA.activities.findIndex(function(a) { return a.id === act.id; });
      if (idx >= 0) window.DATA.activities[idx] = newAct;
      /* ── Persist edit to Firestore ── */
      fbUpdate('activities', newAct.id, newAct);
    } else {
      window.DATA.activities.push(newAct);
      /* ── Persist create to Firestore ── */
      fbCreate('activities', newAct);
    }

    close();
    renderCalendarPage(headerEl, contentEl);
  });

  /* Delete */
  if (isEdit) {
    document.getElementById('cal-act-delete').addEventListener('click', function() {
      var idx = (window.DATA.activities || []).findIndex(function(a) { return a.id === act.id; });
      if (idx >= 0) window.DATA.activities.splice(idx, 1);
      /* ── Persist delete to Firestore ── */
      fbDelete('activities', act.id);
      close();
      renderCalendarPage(headerEl, contentEl);
    });
  }
}

function calCloseModal() {
  var overlay = document.getElementById('cal-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(function() { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 150);
  }
}


/* ═══════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════ */
function injectCalStyles() {
  if (document.getElementById('cal-css')) return;
  var s = document.createElement('style'); s.id = 'cal-css';
  s.textContent = '\
.cal-wrapper{padding:0;height:100%;display:flex;flex-direction:column;overflow:hidden}\
\
.cal-toolbar{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;background:var(--card);border-bottom:1px solid var(--border);flex-shrink:0;gap:10px;flex-wrap:wrap}\
.cal-toolbar-left{display:flex;align-items:center;gap:8px}\
.cal-toolbar-right{display:flex;align-items:center;gap:8px}\
.cal-nav-btn{width:32px;height:32px;border-radius:7px;border:1px solid var(--border);background:var(--card);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .12s}\
.cal-nav-btn:hover{background:#f8f9fb;border-color:#bbb}\
.cal-today-btn{padding:6px 12px;border-radius:7px;border:1px solid var(--border);background:var(--card);font-size:12px;font-weight:600;font-family:inherit;color:var(--text);cursor:pointer;transition:all .12s}\
.cal-today-btn:hover{background:#f0f0f2}\
.cal-title{font-size:16px;font-weight:700;color:var(--text);letter-spacing:-.3px}\
.cal-view-toggle{display:flex;background:#f1f5f9;border-radius:7px;padding:2px;gap:2px}\
.cal-view-btn{padding:5px 12px;border-radius:5px;border:none;cursor:pointer;background:transparent;color:var(--text-muted);font-size:12px;font-weight:500;font-family:inherit;transition:all .12s}\
.cal-view-btn.active{background:var(--card);color:var(--text);font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.07)}\
.cal-new-btn{display:flex;align-items:center;gap:5px;padding:7px 14px;border-radius:7px;border:none;background:var(--accent);color:#fff;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;transition:background .12s}\
.cal-new-btn:hover{background:var(--accent-hover)}\
\
.cal-month{flex:1;display:flex;flex-direction:column;overflow:hidden}\
.cal-month-header{display:grid;grid-template-columns:repeat(7,1fr);border-bottom:1px solid var(--border);background:#f8f9fb}\
.cal-dow{padding:8px;text-align:center;font-size:10px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px}\
.cal-month-grid{display:grid;grid-template-columns:repeat(7,1fr);flex:1;overflow-y:auto}\
.cal-day{min-height:90px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);padding:4px 6px;cursor:pointer;transition:background .08s;display:flex;flex-direction:column;gap:2px}\
.cal-day:nth-child(7n){border-right:none}\
.cal-day:hover{background:#fafbfc}\
.cal-day-other{background:#fafbfc;opacity:.5}\
.cal-day-other:hover{opacity:.7}\
.cal-day-today{background:#eff6ff}\
.cal-day-num{font-size:11px;font-weight:600;color:var(--text-muted);margin-bottom:2px;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:50%}\
.cal-day-num-today{background:var(--accent);color:#fff;font-weight:700}\
\
.cal-event{display:flex;align-items:center;gap:4px;padding:2px 6px;border-radius:4px;cursor:pointer;transition:all .1s;background:color-mix(in srgb,var(--evt-color) 12%,transparent);border-left:2.5px solid var(--evt-color)}\
.cal-event:hover{background:color-mix(in srgb,var(--evt-color) 22%,transparent);transform:translateX(1px)}\
.cal-event-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}\
.cal-event-label{font-size:10px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}\
.cal-event-more{font-size:9px;color:var(--text-light);font-weight:600;padding:1px 6px}\
\
.cal-week{flex:1;display:flex;flex-direction:column;overflow:hidden}\
.cal-week-header{display:flex;border-bottom:1px solid var(--border);background:#f8f9fb;flex-shrink:0}\
.cal-week-gutter{width:56px;flex-shrink:0;display:flex;align-items:center;justify-content:flex-end;padding-right:8px}\
.cal-week-time{font-size:10px;color:var(--text-light);font-weight:500}\
.cal-week-day-hdr{flex:1;text-align:center;padding:8px 4px;display:flex;flex-direction:column;gap:2px;align-items:center}\
.cal-week-day-hdr-today{background:#eff6ff}\
.cal-week-day-name{font-size:10px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.4px}\
.cal-week-day-num{font-size:14px;font-weight:700;color:var(--text);width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%}\
.cal-week-day-num-today{background:var(--accent);color:#fff}\
\
.cal-week-body{flex:1;overflow-y:auto}\
.cal-week-row{display:flex;min-height:48px;border-bottom:1px solid var(--border)}\
.cal-hour-slot{flex:1;border-right:1px solid var(--border);padding:2px 3px;cursor:pointer;position:relative;transition:background .08s;display:flex;flex-direction:column;gap:2px}\
.cal-hour-slot:last-child{border-right:none}\
.cal-hour-slot:hover{background:#fafbfc}\
.cal-hour-slot-today{background:#f8faff}\
\
.cal-event-week{border-radius:5px;padding:3px 6px;overflow:hidden;cursor:pointer;border-left:3px solid var(--evt-color);background:color-mix(in srgb,var(--evt-color) 10%,transparent)}\
.cal-event-week:hover{background:color-mix(in srgb,var(--evt-color) 20%,transparent)}\
.cal-event-week-top{display:flex;align-items:center;gap:3px}\
.cal-event-week-meta{font-size:9px;color:var(--text-light);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\
\
.cal-modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,.4);backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s;pointer-events:none}\
.cal-modal-overlay.active{opacity:1;pointer-events:auto}\
.cal-modal{background:var(--card);border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.15);width:580px;max-width:95vw;max-height:90vh;overflow-y:auto;transform:translateY(10px);transition:transform .2s;display:flex;flex-direction:column}\
.cal-modal-overlay.active .cal-modal{transform:translateY(0)}\
.cal-modal-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border)}\
.cal-modal-close{width:28px;height:28px;border-radius:6px;border:none;background:transparent;font-size:18px;color:var(--text-light);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .12s}\
.cal-modal-close:hover{background:#f1f5f9;color:var(--text)}\
.cal-modal-body{padding:16px 20px;display:flex;flex-direction:column;gap:10px}\
.cal-modal-row{display:flex;gap:10px}\
.cal-modal-field{display:flex;flex-direction:column;gap:3px;flex:1}\
.cal-modal-field label{font-size:10px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.4px}\
.cal-modal-field input,\
.cal-modal-field select,\
.cal-modal-field textarea{padding:8px 10px;border:1px solid var(--border);border-radius:7px;font-size:12.5px;font-family:inherit;color:var(--text);background:var(--card);outline:none;transition:border-color .12s;resize:vertical}\
.cal-modal-field input:focus,\
.cal-modal-field select:focus,\
.cal-modal-field textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(37,99,235,.1)}\
.cal-modal-footer{display:flex;align-items:center;gap:8px;padding:12px 20px;border-top:1px solid var(--border)}\
.cal-modal-btn{display:flex;align-items:center;gap:5px;padding:8px 16px;border-radius:7px;border:none;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .12s}\
.cal-modal-btn-primary{background:var(--accent);color:#fff}\
.cal-modal-btn-primary:hover{background:var(--accent-hover)}\
.cal-modal-btn-outline{background:transparent;border:1px solid var(--border);color:var(--text-muted)}\
.cal-modal-btn-outline:hover{background:#f8f9fb;border-color:#bbb}\
.cal-modal-btn-danger{background:var(--danger);color:#fff}\
.cal-modal-btn-danger:hover{background:#dc2626}\
\
.cal-legend{display:flex;gap:12px;padding:8px 18px;border-top:1px solid var(--border);background:#f8f9fb;flex-shrink:0}\
.cal-legend-item{display:flex;align-items:center;gap:4px;font-size:10px;font-weight:500;color:var(--text-muted)}\
.cal-legend-dot{width:6px;height:6px;border-radius:50%}\
\
@media(max-width:768px){\
  .cal-modal{width:100%;max-width:100%;border-radius:12px 12px 0 0;margin-top:auto}\
  .cal-modal-row{flex-direction:column;gap:8px}\
  .cal-day{min-height:60px}\
}\
';
  document.head.appendChild(s);
}
