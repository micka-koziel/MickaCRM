/* ═══════════════════════════════════════════════════════
   calendar.js — Calendar Module V2 (MickaCRM v4)
   Layout: [Mini-Cal + Legend] | [Week Grid] | [Event Preview]
   Uses: window.DATA.activities, svgIcon(), navigate(), fmtDate()
   ═══════════════════════════════════════════════════════ */

var calState = { view: 'week', currentDate: new Date(), editingId: null, previewAct: null, miniMonth: null };

/* ── Type colors (saturated, pro) ── */
var CAL_TYPE_COLORS = {
  'Call':       '#2563eb',
  'Meeting':    '#7c3aed',
  'Email':      '#059669',
  'Site Visit': '#dc2626',
  'Task':       '#d97706',
  'Note':       '#475569'
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
  var y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), dd = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + dd;
}
function calGetWeekStart(d) {
  var day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
}
function calGetActivities(ds) {
  return (window.DATA.activities || []).filter(function(a) { return a.date === ds; });
}
function calMonthNames() {
  return ['January','February','March','April','May','June','July','August','September','October','November','December'];
}
function calShortMonths() {
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
}
function calFormatTime(t) {
  if (!t) return '';
  var parts = t.split(':');
  var h = parseInt(parts[0], 10), m = parts[1] || '00';
  var ampm = h >= 12 ? 'PM' : 'AM';
  var h12 = h % 12 || 12;
  return h12 + ':' + m + ' ' + ampm;
}
function calFormatDuration(d) {
  if (!d) return '';
  if (d >= 60) { var hrs = Math.floor(d / 60), mins = d % 60; return hrs + 'h' + (mins ? ' ' + mins + 'min' : ''); }
  return d + ' min';
}

/* ═══════════════════════════════════════════════════════
   RENDER CALENDAR — main entry point
   ═══════════════════════════════════════════════════════ */
function renderCalendarPage(headerEl, contentEl) {
  injectCalStyles();
  headerEl.style.display = 'none';

  if (!calState.miniMonth) {
    calState.miniMonth = new Date(calState.currentDate.getFullYear(), calState.currentDate.getMonth(), 1);
  }

  /* Auto-select next upcoming activity if none selected */
  if (!calState.previewAct) {
    var now = new Date();
    var nowStr = calDateStr(now);
    var nowTime = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    var allActs = (window.DATA.activities || []).filter(function(a) {
      if (!a.date) return false;
      if (a.date > nowStr) return true;
      if (a.date === nowStr && (a.time || '23:59') >= nowTime) return true;
      return false;
    }).sort(function(a, b) {
      var da = a.date + (a.time || '00:00'), db = b.date + (b.time || '00:00');
      return da.localeCompare(db);
    });
    if (allActs.length > 0) calState.previewAct = allActs[0];
  }

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

  /* ── Main body ── */
  if (calState.view === 'week') {
    h += '<div class="cal-body-3col">';
    /* LEFT sidebar */
    h += '<div class="cal-sidebar">';
    h += calRenderMiniCal();
    h += '<div class="cal-sidebar-legend">';
    ['Call','Meeting','Email','Site Visit'].forEach(function(t) {
      h += '<div class="cal-legend-item"><span class="cal-legend-dot" style="background:' + CAL_TYPE_COLORS[t] + '"></span>' + t + '</div>';
    });
    h += '</div>';
    h += calRenderTodayAgenda();
    h += '</div>';
    /* CENTER */
    h += '<div class="cal-center">' + calRenderWeek(d) + '</div>';
    /* RIGHT preview */
    h += '<div class="cal-preview" id="cal-preview">' + calRenderPreview(calState.previewAct) + '</div>';
    h += '</div>';
  } else {
    h += calRenderMonth(d);
    h += '<div class="cal-legend">';
    ['Call','Meeting','Email','Site Visit'].forEach(function(t) {
      h += '<div class="cal-legend-item"><span class="cal-legend-dot" style="background:' + CAL_TYPE_COLORS[t] + '"></span>' + t + '</div>';
    });
    h += '</div>';
  }
  h += '</div>';
  contentEl.innerHTML = h;
  calBindEvents(headerEl, contentEl);
}

function calGetTitle(d) {
  var months = calMonthNames();
  if (calState.view === 'month') return months[d.getMonth()] + ' ' + d.getFullYear();
  var ws = calGetWeekStart(d), we = new Date(ws); we.setDate(we.getDate() + 6);
  var fmt = function(dt) { return calShortMonths()[dt.getMonth()] + ' ' + dt.getDate(); };
  return fmt(ws) + ' \u2013 ' + fmt(we) + ', ' + we.getFullYear();
}

function calStep(dir) {
  var d = calState.currentDate;
  if (calState.view === 'month') {
    calState.currentDate = new Date(d.getFullYear(), d.getMonth() + dir, 1);
  } else {
    var nd = new Date(d); nd.setDate(nd.getDate() + dir * 7);
    calState.currentDate = nd;
    calState.miniMonth = new Date(nd.getFullYear(), nd.getMonth(), 1);
  }
}


/* ═══════════════════════════════════════════════════════
   MINI CALENDAR (left sidebar)
   ═══════════════════════════════════════════════════════ */
function calRenderMiniCal() {
  var mm = calState.miniMonth;
  var year = mm.getFullYear(), month = mm.getMonth();
  var today = calDateStr(new Date());
  var months = calShortMonths();
  var ws = calGetWeekStart(calState.currentDate);
  var we = new Date(ws); we.setDate(we.getDate() + 6);
  var wsStr = calDateStr(ws), weStr = calDateStr(we);
  var firstDay = new Date(year, month, 1);
  var startDow = firstDay.getDay();
  var startOffset = startDow === 0 ? 6 : startDow - 1;
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  var h = '<div class="mc-wrap">';
  h += '<div class="mc-header">';
  h += '<button class="mc-nav" id="mc-prev">' + svgIcon('arrowLeft', 12, 'var(--text-muted)') + '</button>';
  h += '<span class="mc-title">' + months[month] + ' ' + year + '</span>';
  h += '<button class="mc-nav" id="mc-next" style="transform:scaleX(-1)">' + svgIcon('arrowLeft', 12, 'var(--text-muted)') + '</button>';
  h += '</div><div class="mc-grid">';
  ['M','T','W','T','F','S','S'].forEach(function(d) { h += '<div class="mc-dow">' + d + '</div>'; });

  for (var i = 0; i < totalCells; i++) {
    var dayNum = i - startOffset + 1;
    var isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
    var cellDate = new Date(year, month, dayNum);
    var ds = calDateStr(cellDate);
    var isToday = ds === today;
    var inWeek = ds >= wsStr && ds <= weStr;
    var hasActs = isCurrentMonth && calGetActivities(ds).length > 0;
    var cls = 'mc-day';
    if (!isCurrentMonth) cls += ' mc-day-other';
    if (isToday) cls += ' mc-day-today';
    if (inWeek) cls += ' mc-day-inweek';
    h += '<div class="' + cls + '" data-mc-date="' + ds + '"><span>' + cellDate.getDate() + '</span>';
    if (hasActs) h += '<span class="mc-dot"></span>';
    h += '</div>';
  }
  h += '</div></div>';
  return h;
}


/* ═══════════════════════════════════════════════════════
   TODAY'S AGENDA (left sidebar)
   ═══════════════════════════════════════════════════════ */
function calRenderTodayAgenda() {
  var today = calDateStr(new Date());
  var acts = calGetActivities(today).sort(function(a, b) { return (a.time || '').localeCompare(b.time || ''); });
  var h = '<div class="cal-today-agenda"><div class="cal-today-title">Today\'s Agenda</div>';
  if (!acts.length) {
    h += '<div class="cal-today-empty">No activities today</div>';
  } else {
    acts.forEach(function(act) {
      var col = CAL_TYPE_COLORS[act.type] || '#475569';
      h += '<div class="cal-today-item" data-id="' + act.id + '"><div class="cal-today-bar" style="background:' + col + '"></div><div class="cal-today-body">';
      h += '<div class="cal-today-time">' + calFormatTime(act.time) + '</div>';
      h += '<div class="cal-today-subj">' + (act.subject || act.type) + '</div>';
      if (act.contact) h += '<div class="cal-today-meta">' + act.contact + '</div>';
      h += '</div></div>';
    });
  }
  h += '</div>';
  return h;
}


/* ═══════════════════════════════════════════════════════
   EVENT PREVIEW PANEL (right sidebar)
   ═══════════════════════════════════════════════════════ */
function calRenderPreview(act) {
  if (!act) {
    return '<div class="cp-empty">' + svgIcon('activities', 32, 'var(--border)') +
      '<div class="cp-empty-text">Click an activity to preview details</div></div>';
  }
  var col = CAL_TYPE_COLORS[act.type] || '#475569';
  var icon = CAL_TYPE_ICONS[act.type] || 'activities';
  var h = '<div class="cp-card">';
  h += '<div class="cp-header"><div class="cp-type-badge" style="background:' + col + '">' + svgIcon(icon, 13, '#fff') + '<span>' + (act.type || 'Activity') + '</span></div>';
  h += '<button class="cp-close" id="cp-close">\u00D7</button></div>';
  h += '<div class="cp-subject">' + (act.subject || 'Untitled') + '</div>';
  h += '<div class="cp-rows">';

  if (act.date) {
    var dateObj = new Date(act.date + 'T00:00:00');
    var dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    h += '<div class="cp-row">' + svgIcon('calendarView', 14, 'var(--text-light)') + '<span>' + dateStr;
    if (act.time) h += ' at ' + calFormatTime(act.time);
    if (act.duration) h += ' (' + calFormatDuration(act.duration) + ')';
    h += '</span></div>';
  }
  if (act.contact) {
    h += '<div class="cp-row">' + svgIcon('contacts', 14, 'var(--text-light)') + '<span>' + act.contact;
    if (act.contactRole) h += ' <span class="cp-role">' + act.contactRole + '</span>';
    h += '</span></div>';
  }
  if (act.accountName) h += '<div class="cp-row">' + svgIcon('accounts', 14, 'var(--text-light)') + '<span>' + act.accountName + '</span></div>';
  if (act.opportunityName) h += '<div class="cp-row">' + svgIcon('opportunities', 14, 'var(--text-light)') + '<span>' + act.opportunityName + '</span></div>';
  if (act.projectName) h += '<div class="cp-row">' + svgIcon('projects', 14, 'var(--text-light)') + '<span>' + act.projectName + '</span></div>';
  if (act.location) h += '<div class="cp-row">' + svgIcon('mapPin', 14, 'var(--text-light)') + '<span>' + act.location + '</span></div>';
  if (act.owner) h += '<div class="cp-row">' + svgIcon('users', 14, 'var(--text-light)') + '<span>' + act.owner + '</span></div>';
  h += '</div>';

  if (act.purpose) {
    h += '<div class="cp-purpose"><div class="cp-purpose-label">Purpose</div><div class="cp-purpose-text">' + act.purpose + '</div></div>';
  }

  var stCol = act.status === 'Completed' ? '#059669' : act.status === 'In Progress' ? '#d97706' : '#2563eb';
  h += '<div class="cp-status"><span class="cp-status-badge" style="background:' + stCol + '">' + (act.status || 'Planned') + '</span></div>';
  h += '<div class="cp-actions"><button class="cp-btn cp-btn-primary" id="cp-open">Open Record</button>';
  h += '<button class="cp-btn cp-btn-outline" id="cp-edit">Edit</button></div>';
  h += '</div>';
  return h;
}


/* ═══════════════════════════════════════════════════════
   MONTH VIEW
   ═══════════════════════════════════════════════════════ */
function calRenderMonth(d) {
  var year = d.getFullYear(), month = d.getMonth();
  var startDow = new Date(year, month, 1).getDay();
  var startOffset = startDow === 0 ? 6 : startDow - 1;
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var today = calDateStr(new Date());
  var h = '<div class="cal-month"><div class="cal-month-header">';
  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(function(dn) { h += '<div class="cal-dow">' + dn + '</div>'; });
  h += '</div><div class="cal-month-grid">';
  var totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  for (var i = 0; i < totalCells; i++) {
    var dayNum = i - startOffset + 1, isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
    var cellDate = new Date(year, month, dayNum), ds = calDateStr(cellDate), isToday = ds === today;
    var acts = isCurrentMonth ? calGetActivities(ds) : [];
    h += '<div class="cal-day' + (!isCurrentMonth ? ' cal-day-other' : '') + (isToday ? ' cal-day-today' : '') + '" data-date="' + ds + '">';
    h += '<div class="cal-day-num' + (isToday ? ' cal-day-num-today' : '') + '">' + cellDate.getDate() + '</div>';
    acts.forEach(function(act, idx) {
      if (idx >= 3) return;
      var col = CAL_TYPE_COLORS[act.type] || '#64748b';
      h += '<div class="cal-event" data-id="' + act.id + '" style="--evt-color:' + col + '"><span class="cal-event-label">' + (act.time ? act.time + ' ' : '') + (act.subject || act.type) + '</span></div>';
    });
    if (acts.length > 3) h += '<div class="cal-event-more">+' + (acts.length - 3) + ' more</div>';
    h += '</div>';
  }
  h += '</div></div>';
  return h;
}


/* ═══════════════════════════════════════════════════════
   WEEK VIEW
   ═══════════════════════════════════════════════════════ */
function calRenderWeek(d) {
  var ws = calGetWeekStart(d), today = calDateStr(new Date()), now = new Date();
  var nowHour = now.getHours(), nowMin = now.getMinutes();
  var hours = []; for (var hh = 7; hh <= 20; hh++) hours.push(hh);
  var todayCol = -1;
  for (var ti = 0; ti < 7; ti++) { var td = new Date(ws); td.setDate(td.getDate() + ti); if (calDateStr(td) === today) { todayCol = ti; break; } }

  var h = '<div class="cal-week"><div class="cal-week-header"><div class="cal-week-gutter"></div>';
  var dayNames = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
  for (var i = 0; i < 7; i++) {
    var dd = new Date(ws); dd.setDate(dd.getDate() + i); var ds = calDateStr(dd);
    h += '<div class="cal-week-day-hdr' + (ds === today ? ' cal-week-day-hdr-today' : '') + '">';
    h += '<span class="cal-week-day-name">' + dayNames[i] + '</span>';
    h += '<span class="cal-week-day-num' + (ds === today ? ' cal-week-day-num-today' : '') + '">' + dd.getDate() + '</span></div>';
  }
  h += '</div><div class="cal-week-body" id="cal-week-body">';

  hours.forEach(function(hr) {
    var isNowRow = (todayCol >= 0 && hr === nowHour && nowHour >= 7 && nowHour <= 20);
    h += '<div class="cal-week-row' + (isNowRow ? ' cal-week-row-now' : '') + '" ' + (hr === nowHour ? 'id="cal-now-row"' : '') + '>';
    h += '<div class="cal-week-gutter"><span class="cal-week-time">' + String(hr).padStart(2, '0') + ':00</span></div>';
    for (var i = 0; i < 7; i++) {
      var dd = new Date(ws); dd.setDate(dd.getDate() + i); var ds = calDateStr(dd); var isToday = ds === today;
      var cellActs = calGetActivities(ds).filter(function(a) { if (!a.time) return hr === 9; return parseInt(a.time.split(':')[0], 10) === hr; });
      h += '<div class="cal-hour-slot' + (isToday ? ' cal-hour-slot-today' : '') + '" data-date="' + ds + '" data-hour="' + hr + '">';
      if (isToday && hr === nowHour && nowHour >= 7 && nowHour <= 20) {
        h += '<div class="cal-now-line" style="top:' + ((nowMin / 60) * 100) + '%"><span class="cal-now-dot"></span></div>';
      }
      cellActs.forEach(function(act) {
        var col = CAL_TYPE_COLORS[act.type] || '#475569';
        h += '<div class="cal-event cal-event-week" data-id="' + act.id + '" style="--evt-color:' + col + '">';
        h += '<span class="cal-event-label">' + (act.time ? act.time + ' ' : '') + (act.subject || act.type) + '</span>';
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
   EVENT BINDINGS
   ═══════════════════════════════════════════════════════ */
function calBindEvents(headerEl, contentEl) {
  var rerender = function() { renderCalendarPage(headerEl, contentEl); };
  document.getElementById('cal-prev').addEventListener('click', function() { calStep(-1); rerender(); });
  document.getElementById('cal-next').addEventListener('click', function() { calStep(1); rerender(); });
  document.getElementById('cal-today').addEventListener('click', function() { calState.currentDate = new Date(); calState.miniMonth = new Date(calState.currentDate.getFullYear(), calState.currentDate.getMonth(), 1); rerender(); });
  document.getElementById('cal-new-activity').addEventListener('click', function() { calOpenModal(null, null, null, headerEl, contentEl); });

  contentEl.querySelectorAll('.cal-view-btn').forEach(function(btn) { btn.addEventListener('click', function() { calState.view = btn.getAttribute('data-view'); calState.previewAct = null; rerender(); }); });

  /* Mini-cal nav */
  var mcP = document.getElementById('mc-prev'), mcN = document.getElementById('mc-next');
  if (mcP) mcP.addEventListener('click', function() { calState.miniMonth = new Date(calState.miniMonth.getFullYear(), calState.miniMonth.getMonth() - 1, 1); rerender(); });
  if (mcN) mcN.addEventListener('click', function() { calState.miniMonth = new Date(calState.miniMonth.getFullYear(), calState.miniMonth.getMonth() + 1, 1); rerender(); });

  /* Mini-cal day click → jump to that week */
  contentEl.querySelectorAll('[data-mc-date]').forEach(function(el) {
    el.addEventListener('click', function() {
      var ds = el.getAttribute('data-mc-date'), p = ds.split('-');
      calState.currentDate = new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]));
      rerender();
    });
  });

  /* Activity pill click → preview (NOT navigate) */
  contentEl.querySelectorAll('.cal-event').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      var id = el.getAttribute('data-id'); if (!id) return;
      var act = (window.DATA.activities || []).find(function(a) { return a.id === id; });
      if (act) {
        calState.previewAct = act;
        var p = document.getElementById('cal-preview');
        if (p) { p.innerHTML = calRenderPreview(act); calBindPreview(headerEl, contentEl); }
        contentEl.querySelectorAll('.cal-event').forEach(function(e) { e.classList.remove('cal-event-selected'); });
        el.classList.add('cal-event-selected');
      }
    });
  });

  /* Today agenda items → preview */
  contentEl.querySelectorAll('.cal-today-item').forEach(function(el) {
    el.addEventListener('click', function() {
      var id = el.getAttribute('data-id');
      var act = (window.DATA.activities || []).find(function(a) { return a.id === id; });
      if (act) {
        calState.previewAct = act;
        var p = document.getElementById('cal-preview');
        if (p) { p.innerHTML = calRenderPreview(act); calBindPreview(headerEl, contentEl); }
      }
    });
  });

  calBindPreview(headerEl, contentEl);

  /* Empty day click → create (month) */
  contentEl.querySelectorAll('.cal-day[data-date]').forEach(function(cell) {
    cell.addEventListener('click', function(e) { if (e.target.closest('.cal-event')) return; calOpenModal(null, cell.getAttribute('data-date'), null, headerEl, contentEl); });
  });

  /* Hour slot click → create with time */
  contentEl.querySelectorAll('.cal-hour-slot[data-date][data-hour]').forEach(function(slot) {
    slot.addEventListener('click', function(e) { if (e.target.closest('.cal-event')) return; calOpenModal(null, slot.getAttribute('data-date'), slot.getAttribute('data-hour') + ':00', headerEl, contentEl); });
  });

  /* Auto-scroll to now */
  if (calState.view === 'week') {
    var nowRow = document.getElementById('cal-now-row'), wb = document.getElementById('cal-week-body');
    if (nowRow && wb) wb.scrollTop = Math.max(0, nowRow.offsetTop - wb.offsetTop - 80);
  }
}

function calBindPreview(headerEl, contentEl) {
  var c = document.getElementById('cp-close'), o = document.getElementById('cp-open'), e = document.getElementById('cp-edit');
  if (c) c.addEventListener('click', function() { calState.previewAct = null; var p = document.getElementById('cal-preview'); if (p) p.innerHTML = calRenderPreview(null); contentEl.querySelectorAll('.cal-event').forEach(function(e) { e.classList.remove('cal-event-selected'); }); });
  if (o && calState.previewAct) o.addEventListener('click', function() { navigate('record', 'activities', calState.previewAct.id); });
  if (e && calState.previewAct) e.addEventListener('click', function() { calOpenModal(calState.previewAct, null, null, headerEl, contentEl); });
}


/* ═══════════════════════════════════════════════════════
   ACTIVITY MODAL — Create / Edit
   ═══════════════════════════════════════════════════════ */
function calOpenModal(existingAct, prefillDate, prefillTime, headerEl, contentEl) {
  calCloseModal();
  var isEdit = !!existingAct;
  var act = existingAct || { id:'',type:'Meeting',subject:'',date:prefillDate||calDateStr(new Date()),time:prefillTime||'09:00',duration:60,status:'Planned',accountId:'',contact:'',opportunityId:'',projectId:'',location:'',purpose:'',owner:'Me' };
  var D = window.DATA, accounts = D.accounts||[], contacts = D.contacts||[], opps = D.opportunities||[], projects = D.projects||[];

  var overlay = document.createElement('div'); overlay.className = 'cal-modal-overlay'; overlay.id = 'cal-modal-overlay';
  var modal = document.createElement('div'); modal.className = 'cal-modal'; modal.id = 'cal-modal';
  var mh = '';

  mh += '<div class="cal-modal-header"><div style="display:flex;align-items:center;gap:8px">' + svgIcon('activities', 18, 'var(--accent)') + '<span style="font-size:15px;font-weight:700;color:var(--text)">' + (isEdit ? 'Edit Activity' : 'New Activity') + '</span></div><button class="cal-modal-close" id="cal-modal-close">\u00D7</button></div>';
  mh += '<div class="cal-modal-body">';

  mh += '<div class="cal-modal-row"><div class="cal-modal-field" style="flex:0 0 140px"><label>Type</label><select id="cal-act-type">';
  ['Call','Meeting','Site Visit','Email'].forEach(function(t) { mh += '<option value="'+t+'"'+(act.type===t?' selected':'')+'>'+t+'</option>'; });
  mh += '</select></div><div class="cal-modal-field" style="flex:1"><label>Subject</label><input id="cal-act-subject" value="'+((act.subject||'').replace(/"/g,'&quot;'))+'" placeholder="Activity subject..."></div></div>';

  mh += '<div class="cal-modal-row"><div class="cal-modal-field"><label>Date</label><input type="date" id="cal-act-date" value="'+(act.date||'')+'"></div><div class="cal-modal-field"><label>Time</label><input type="time" id="cal-act-time" value="'+(act.time||'')+'"></div><div class="cal-modal-field"><label>Duration (min)</label><input type="number" id="cal-act-duration" value="'+(act.duration||60)+'" min="15" step="15"></div></div>';

  mh += '<div class="cal-modal-row"><div class="cal-modal-field"><label>Status</label><select id="cal-act-status">';
  ['Planned','In Progress','Completed'].forEach(function(s) { mh += '<option value="'+s+'"'+(act.status===s?' selected':'')+'>'+s+'</option>'; });
  mh += '</select></div><div class="cal-modal-field"><label>Owner</label><input id="cal-act-owner" value="'+((act.owner||'Me').replace(/"/g,'&quot;'))+'"></div></div>';

  mh += '<div class="cal-modal-row"><div class="cal-modal-field"><label>Account</label><select id="cal-act-account"><option value="">\u2014 None \u2014</option>';
  accounts.forEach(function(a) { mh += '<option value="'+a.id+'"'+(act.accountId===a.id?' selected':'')+'>'+a.name+'</option>'; });
  mh += '</select></div><div class="cal-modal-field"><label>Contact</label><select id="cal-act-contact"><option value="">\u2014 None \u2014</option>';
  contacts.forEach(function(c) { mh += '<option value="'+c.id+'"'+(act.contactId===c.id?' selected':'')+'>'+c.name+'</option>'; });
  mh += '</select></div></div>';

  mh += '<div class="cal-modal-row"><div class="cal-modal-field"><label>Opportunity</label><select id="cal-act-opp"><option value="">\u2014 None \u2014</option>';
  opps.forEach(function(o) { mh += '<option value="'+o.id+'"'+(act.opportunityId===o.id?' selected':'')+'>'+o.name+'</option>'; });
  mh += '</select></div><div class="cal-modal-field"><label>Project</label><select id="cal-act-project"><option value="">\u2014 None \u2014</option>';
  projects.forEach(function(p) { mh += '<option value="'+p.id+'"'+(act.projectId===p.id?' selected':'')+'>'+p.name+'</option>'; });
  mh += '</select></div></div>';

  mh += '<div class="cal-modal-field"><label>Location</label><input id="cal-act-location" value="'+((act.location||'').replace(/"/g,'&quot;'))+'" placeholder="e.g. Client HQ, Microsoft Teams..."></div>';
  mh += '<div class="cal-modal-field" style="margin-top:6px"><label>Purpose / Notes</label><textarea id="cal-act-purpose" rows="3" placeholder="Describe the purpose...">'+(act.purpose||act.description||'')+'</textarea></div>';
  mh += '</div>';

  mh += '<div class="cal-modal-footer">';
  if (isEdit) mh += '<button class="cal-modal-btn cal-modal-btn-danger" id="cal-act-delete">'+svgIcon('claims',12,'#fff')+' Delete</button>';
  mh += '<div style="flex:1"></div><button class="cal-modal-btn cal-modal-btn-outline" id="cal-act-cancel">Cancel</button>';
  mh += '<button class="cal-modal-btn cal-modal-btn-primary" id="cal-act-save">'+svgIcon(isEdit?'check':'plus',12,'#fff')+' '+(isEdit?'Save Changes':'Create Activity')+'</button></div>';

  modal.innerHTML = mh; overlay.appendChild(modal); document.body.appendChild(overlay);
  requestAnimationFrame(function() { overlay.classList.add('active'); });

  var close = function() { calCloseModal(); };
  document.getElementById('cal-modal-close').addEventListener('click', close);
  document.getElementById('cal-act-cancel').addEventListener('click', close);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });

  document.getElementById('cal-act-account').addEventListener('change', function() {
    var accId = this.value, sel = document.getElementById('cal-act-contact'), cv = sel.value;
    sel.innerHTML = '<option value="">\u2014 None \u2014</option>';
    (accId ? contacts.filter(function(c){return c.account===accId;}) : contacts).forEach(function(c) { sel.innerHTML += '<option value="'+c.id+'"'+(c.id===cv?' selected':'')+'>'+c.name+'</option>'; });
  });

  document.getElementById('cal-act-save').addEventListener('click', function() {
    var subject = document.getElementById('cal-act-subject').value.trim();
    if (!subject) { document.getElementById('cal-act-subject').style.borderColor='var(--danger)'; document.getElementById('cal-act-subject').focus(); return; }
    var accId=document.getElementById('cal-act-account').value, accObj=accounts.find(function(a){return a.id===accId;});
    var conId=document.getElementById('cal-act-contact').value, conObj=contacts.find(function(c){return c.id===conId;});
    var oppId=document.getElementById('cal-act-opp').value, oppObj=opps.find(function(o){return o.id===oppId;});
    var projId=document.getElementById('cal-act-project').value, projObj=projects.find(function(p){return p.id===projId;});
    var newAct = {
      id:isEdit?act.id:'act'+Date.now(), type:document.getElementById('cal-act-type').value, subject:subject,
      date:document.getElementById('cal-act-date').value, time:document.getElementById('cal-act-time').value,
      duration:parseInt(document.getElementById('cal-act-duration').value,10)||60, status:document.getElementById('cal-act-status').value,
      owner:document.getElementById('cal-act-owner').value||'Me',
      accountId:accId||'', accountName:accObj?accObj.name:'', contactId:conId||'', contact:conObj?conObj.name:'', contactRole:conObj?conObj.role:'',
      opportunityId:oppId||'', opportunityName:oppObj?oppObj.name:'', projectId:projId||'', projectName:projObj?projObj.name:'',
      location:document.getElementById('cal-act-location').value, purpose:document.getElementById('cal-act-purpose').value,
      createdDate:isEdit?(act.createdDate||act.date):calDateStr(new Date()),
      participants:isEdit?(act.participants||[]):[], notes:isEdit?(act.notes||[]):[], tasks:isEdit?(act.tasks||[]):[], documents:isEdit?(act.documents||[]):[]
    };
    if (!window.DATA.activities) window.DATA.activities = [];
    if (isEdit) { var idx = window.DATA.activities.findIndex(function(a){return a.id===act.id;}); if (idx>=0) window.DATA.activities[idx]=newAct; fbUpdate('activities',newAct.id,newAct); }
    else { window.DATA.activities.push(newAct); fbCreate('activities',newAct); }
    close(); calState.previewAct=null; renderCalendarPage(headerEl, contentEl);
  });

  if (isEdit) {
    document.getElementById('cal-act-delete').addEventListener('click', function() {
      var idx = (window.DATA.activities||[]).findIndex(function(a){return a.id===act.id;}); if (idx>=0) window.DATA.activities.splice(idx,1);
      fbDelete('activities',act.id); close(); calState.previewAct=null; renderCalendarPage(headerEl, contentEl);
    });
  }
}

function calCloseModal() {
  var ov = document.getElementById('cal-modal-overlay');
  if (ov) { ov.classList.remove('active'); setTimeout(function(){ if(ov.parentNode) ov.parentNode.removeChild(ov); },150); }
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
.cal-toolbar{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:var(--card);border-bottom:1px solid var(--border);flex-shrink:0;gap:10px;flex-wrap:wrap}\
.cal-toolbar-left{display:flex;align-items:center;gap:8px}\
.cal-toolbar-right{display:flex;align-items:center;gap:8px}\
.cal-nav-btn{width:30px;height:30px;border-radius:6px;border:1px solid var(--border);background:var(--card);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .12s}\
.cal-nav-btn:hover{background:#f1f5f9;border-color:#ccc}\
.cal-today-btn{padding:5px 12px;border-radius:6px;border:1px solid var(--border);background:var(--card);font-size:12px;font-weight:600;font-family:inherit;color:var(--text);cursor:pointer;transition:all .12s}\
.cal-today-btn:hover{background:#f1f5f9}\
.cal-title{font-size:15px;font-weight:700;color:var(--text);letter-spacing:-.2px}\
.cal-view-toggle{display:flex;background:#f1f5f9;border-radius:6px;padding:2px;gap:1px}\
.cal-view-btn{padding:5px 12px;border-radius:5px;border:none;cursor:pointer;background:transparent;color:var(--text-muted);font-size:11.5px;font-weight:500;font-family:inherit;transition:all .12s}\
.cal-view-btn.active{background:var(--card);color:var(--text);font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.07)}\
.cal-new-btn{display:flex;align-items:center;gap:5px;padding:6px 14px;border-radius:6px;border:none;background:var(--accent);color:#fff;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;transition:background .12s}\
.cal-new-btn:hover{background:var(--accent-hover)}\
\
.cal-body-3col{flex:1;display:flex;overflow:hidden}\
.cal-sidebar{width:220px;flex-shrink:0;border-right:1px solid var(--border);background:var(--card);display:flex;flex-direction:column;overflow-y:auto}\
.cal-center{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}\
.cal-preview{width:260px;flex-shrink:0;border-left:1px solid var(--border);background:var(--card);overflow-y:auto}\
\
.mc-wrap{padding:12px 14px 8px}\
.mc-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}\
.mc-title{font-size:12px;font-weight:700;color:var(--text)}\
.mc-nav{width:24px;height:24px;border-radius:5px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .1s}\
.mc-nav:hover{background:#f1f5f9}\
.mc-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:0}\
.mc-dow{text-align:center;font-size:9px;font-weight:700;color:var(--text-light);padding:4px 0}\
.mc-day{text-align:center;padding:3px 0;font-size:11px;font-weight:500;color:var(--text);cursor:pointer;border-radius:4px;position:relative;display:flex;flex-direction:column;align-items:center;gap:1px;transition:background .08s}\
.mc-day:hover{background:#f1f5f9}\
.mc-day-other{color:var(--text-light);opacity:.35}\
.mc-day-today span:first-child{background:var(--accent);color:#fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-weight:700}\
.mc-day-inweek{background:#eef2ff}\
.mc-day-inweek:hover{background:#dbeafe}\
.mc-dot{width:4px;height:4px;border-radius:50%;background:var(--accent)}\
\
.cal-sidebar-legend{padding:10px 14px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:5px}\
.cal-legend-item{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:500;color:var(--text-muted)}\
.cal-legend-dot{width:8px;height:8px;border-radius:3px;flex-shrink:0}\
\
.cal-today-agenda{padding:10px 14px;border-top:1px solid var(--border);flex:1}\
.cal-today-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--text-muted);margin-bottom:8px}\
.cal-today-empty{font-size:11px;color:var(--text-light);padding:8px 0}\
.cal-today-item{display:flex;gap:8px;padding:6px 4px;cursor:pointer;border-radius:5px;transition:background .08s}\
.cal-today-item:hover{background:#f8fafc}\
.cal-today-bar{width:3px;border-radius:2px;flex-shrink:0}\
.cal-today-body{min-width:0}\
.cal-today-time{font-size:10px;font-weight:600;color:var(--text-muted)}\
.cal-today-subj{font-size:11px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\
.cal-today-meta{font-size:10px;color:var(--text-light)}\
\
.cal-legend{display:flex;gap:14px;padding:10px 18px;border-top:1px solid var(--border);background:#fafbfc;flex-shrink:0}\
\
.cal-month{flex:1;display:flex;flex-direction:column;overflow:hidden}\
.cal-month-header{display:grid;grid-template-columns:repeat(7,1fr);border-bottom:1px solid var(--border);background:#f8f9fb}\
.cal-dow{padding:8px;text-align:center;font-size:10px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px}\
.cal-month-grid{display:grid;grid-template-columns:repeat(7,1fr);flex:1;overflow-y:auto}\
.cal-day{min-height:90px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);padding:4px 6px;cursor:pointer;transition:background .08s;display:flex;flex-direction:column;gap:2px}\
.cal-day:nth-child(7n){border-right:none}\
.cal-day:hover{background:#fafbfc}\
.cal-day-other{background:#fafbfc;opacity:.5}\
.cal-day-today{background:#eff6ff}\
.cal-day-num{font-size:11px;font-weight:600;color:var(--text-muted);margin-bottom:2px;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:50%}\
.cal-day-num-today{background:var(--accent);color:#fff;font-weight:700}\
\
.cal-event{display:flex;align-items:center;gap:4px;padding:2px 6px;border-radius:4px;cursor:pointer;transition:all .1s;background:var(--card);border:1px solid var(--border);border-left:3px solid var(--evt-color)}\
.cal-event:hover{background:#f8fafc;transform:translateX(1px)}\
.cal-event-selected{background:#eef2ff;border-color:var(--accent);border-left:3px solid var(--accent)}\
.cal-event-label{font-size:10px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}\
.cal-event-more{font-size:9px;color:var(--text-light);font-weight:600;padding:1px 6px}\
\
.cal-week{flex:1;display:flex;flex-direction:column;overflow:hidden}\
.cal-week-header{display:flex;border-bottom:1px solid var(--border);background:var(--card);flex-shrink:0}\
.cal-week-gutter{width:50px;flex-shrink:0;display:flex;align-items:center;justify-content:flex-end;padding-right:6px}\
.cal-week-time{font-size:10px;color:var(--text-light);font-weight:500;font-variant-numeric:tabular-nums}\
.cal-week-day-hdr{flex:1;text-align:center;padding:6px 4px;display:flex;flex-direction:column;gap:1px;align-items:center;border-bottom:2px solid transparent}\
.cal-week-day-hdr-today{background:#f0f4ff;border-bottom-color:var(--accent)}\
.cal-week-day-name{font-size:9px;font-weight:700;color:var(--text-light);text-transform:uppercase;letter-spacing:.5px}\
.cal-week-day-num{font-size:13px;font-weight:700;color:var(--text);width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:50%}\
.cal-week-day-num-today{background:var(--accent);color:#fff;box-shadow:0 1px 4px rgba(37,99,235,.25)}\
\
.cal-week-body{flex:1;overflow-y:auto}\
.cal-week-row{display:flex;min-height:36px;border-bottom:1px solid #f0f2f5}\
.cal-hour-slot{flex:1;border-right:1px solid #f0f2f5;padding:1px 2px;cursor:pointer;position:relative;transition:background .08s;display:flex;flex-direction:column;gap:1px}\
.cal-hour-slot:last-child{border-right:none}\
.cal-hour-slot:hover{background:#fafbfc}\
.cal-hour-slot-today{background:#f8faff}\
\
.cal-now-line{position:absolute;left:-1px;right:-1px;height:2px;background:#ef4444;z-index:5;pointer-events:none}\
.cal-now-dot{position:absolute;left:-4px;top:-3px;width:8px;height:8px;border-radius:50%;background:#ef4444;box-shadow:0 0 0 2px rgba(239,68,68,.2)}\
\
.cal-event-week{border-radius:4px;padding:2px 6px;overflow:hidden;cursor:pointer;background:var(--card);border:1px solid var(--border);border-left:3px solid var(--evt-color)}\
.cal-event-week:hover{background:#f8fafc;box-shadow:0 1px 2px rgba(0,0,0,.05)}\
.cal-event-week .cal-event-label{color:var(--text);font-size:10px;font-weight:500}\
\
.cp-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:10px;padding:20px}\
.cp-empty-text{font-size:11px;color:var(--text-light);text-align:center}\
.cp-card{padding:16px 14px;display:flex;flex-direction:column;gap:12px}\
.cp-header{display:flex;align-items:center;justify-content:space-between}\
.cp-type-badge{display:flex;align-items:center;gap:5px;padding:4px 10px;border-radius:5px;font-size:11px;font-weight:600;color:#fff}\
.cp-close{width:24px;height:24px;border-radius:5px;border:none;background:transparent;font-size:16px;color:var(--text-light);cursor:pointer;display:flex;align-items:center;justify-content:center}\
.cp-close:hover{background:#f1f5f9;color:var(--text)}\
.cp-subject{font-size:14px;font-weight:700;color:var(--text);line-height:1.3}\
.cp-rows{display:flex;flex-direction:column;gap:6px}\
.cp-row{display:flex;align-items:flex-start;gap:7px;font-size:11.5px;color:var(--text);line-height:1.4}\
.cp-row svg{margin-top:1px;flex-shrink:0}\
.cp-role{color:var(--text-light);font-size:10px}\
.cp-purpose{padding:8px 10px;background:#f8fafc;border-radius:6px;border:1px solid var(--border)}\
.cp-purpose-label{font-size:9px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px}\
.cp-purpose-text{font-size:11px;color:var(--text);line-height:1.5}\
.cp-status{display:flex}\
.cp-status-badge{display:inline-flex;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:600;color:#fff}\
.cp-actions{display:flex;gap:6px}\
.cp-btn{flex:1;padding:7px 0;border-radius:6px;border:none;font-size:11px;font-weight:600;font-family:inherit;cursor:pointer;text-align:center;transition:all .12s}\
.cp-btn-primary{background:var(--accent);color:#fff}\
.cp-btn-primary:hover{background:var(--accent-hover)}\
.cp-btn-outline{background:transparent;border:1px solid var(--border);color:var(--text-muted)}\
.cp-btn-outline:hover{background:#f8f9fb}\
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
.cal-modal-field input,.cal-modal-field select,.cal-modal-field textarea{padding:8px 10px;border:1px solid var(--border);border-radius:7px;font-size:12.5px;font-family:inherit;color:var(--text);background:var(--card);outline:none;transition:border-color .12s;resize:vertical}\
.cal-modal-field input:focus,.cal-modal-field select:focus,.cal-modal-field textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(37,99,235,.1)}\
.cal-modal-footer{display:flex;align-items:center;gap:8px;padding:12px 20px;border-top:1px solid var(--border)}\
.cal-modal-btn{display:flex;align-items:center;gap:5px;padding:8px 16px;border-radius:7px;border:none;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .12s}\
.cal-modal-btn-primary{background:var(--accent);color:#fff}\
.cal-modal-btn-primary:hover{background:var(--accent-hover)}\
.cal-modal-btn-outline{background:transparent;border:1px solid var(--border);color:var(--text-muted)}\
.cal-modal-btn-outline:hover{background:#f8f9fb;border-color:#bbb}\
.cal-modal-btn-danger{background:var(--danger);color:#fff}\
.cal-modal-btn-danger:hover{background:#dc2626}\
\
@media(max-width:1024px){\
  .cal-sidebar{display:none}\
  .cal-preview{display:none}\
}\
@media(max-width:768px){\
  .cal-modal{width:100%;max-width:100%;border-radius:12px 12px 0 0;margin-top:auto}\
  .cal-modal-row{flex-direction:column;gap:8px}\
  .cal-toolbar{flex-direction:column;align-items:stretch;gap:8px;padding:10px 12px}\
  .cal-toolbar-left{justify-content:space-between}\
  .cal-toolbar-right{justify-content:space-between}\
  .cal-title{font-size:13px}\
  .cal-week-gutter{width:38px}\
  .cal-week-time{font-size:9px}\
  .cal-week-day-name{font-size:8px}\
  .cal-week-day-num{font-size:11px;width:22px;height:22px}\
}\
@media(max-width:480px){\
  .cal-view-btn{padding:4px 8px;font-size:11px}\
  .cal-new-btn{padding:5px 10px;font-size:11px}\
  .cal-nav-btn{width:28px;height:28px}\
  .cal-event-week .cal-event-label{font-size:9px}\
}\
';
  document.head.appendChild(s);
}
