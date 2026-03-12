// ============================================================
// MICKACRM 360 v3 — CALENDAR.JS — Calendar module
// ============================================================
var calState = { view:"month", currentDate:new Date(), editingActivity:null };

function renderCalendar() {
  var container = document.getElementById("main-content");
  var d = calState.currentDate;
  var html = '<div class="cal-wrapper" style="animation:fadeSlide .2s ease">';

  // ─── Toolbar ─────────────────────────────────
  html += '<div class="cal-toolbar">';
  html += '<div class="cal-toolbar-left">';
  html += '<button class="cal-nav-btn" id="cal-prev">' + renderIcon("chevRight",14,COLORS.text2).replace('d="m9 18 6-6-6-6"','d="m15 18-6-6 6-6"') + '</button>';
  html += '<button class="cal-nav-btn" id="cal-next">' + renderIcon("chevRight",14,COLORS.text2) + '</button>';
  html += '<button class="cal-today-btn" id="cal-today">Today</button>';
  html += '<span class="cal-title" id="cal-title"></span>';
  html += '</div>';
  html += '<div class="cal-toolbar-right">';
  html += '<div class="cal-view-toggle">';
  html += '<button class="cal-view-btn' + (calState.view==="month"?" active":"") + '" data-view="month">Month</button>';
  html += '<button class="cal-view-btn' + (calState.view==="week"?" active":"") + '" data-view="week">Week</button>';
  html += '</div>';
  html += '<button class="btn-primary" id="cal-new-activity" style="font-size:11.5px;padding:7px 14px">' + renderIcon("plus",13,"#fff") + ' New Activity</button>';
  html += '</div>';
  html += '</div>';

  // ─── Calendar Grid ───────────────────────────
  if (calState.view === "month") {
    html += renderMonthView(d);
  } else {
    html += renderWeekView(d);
  }

  html += '</div>';
  container.innerHTML = html;

  // Update title
  updateCalTitle();

  // ─── Event bindings ──────────────────────────
  document.getElementById("cal-prev").onclick = function() { stepCal(-1); };
  document.getElementById("cal-next").onclick = function() { stepCal(1); };
  document.getElementById("cal-today").onclick = function() { calState.currentDate = new Date(); renderCalendar(); };
  document.getElementById("cal-new-activity").onclick = function() { openActivityModal(null, null); };

  container.querySelectorAll(".cal-view-btn").forEach(function(btn) {
    btn.onclick = function() { calState.view = btn.getAttribute("data-view"); renderCalendar(); };
  });

  // Click on activity pill
  container.querySelectorAll(".cal-event").forEach(function(el) {
    el.onclick = function(e) {
      e.stopPropagation();
      var id = el.getAttribute("data-id");
      var act = ACTIVITIES.find(function(a) { return a.id === id; });
      if (act) openActivityModal(act, null);
    };
  });

  // Click on empty day to create
  container.querySelectorAll(".cal-day[data-date]").forEach(function(cell) {
    cell.onclick = function(e) {
      if (e.target.closest(".cal-event")) return;
      var dateStr = cell.getAttribute("data-date");
      openActivityModal(null, dateStr);
    };
  });

  // Click on empty hour slot
  container.querySelectorAll(".cal-hour-slot[data-date][data-hour]").forEach(function(slot) {
    slot.onclick = function(e) {
      if (e.target.closest(".cal-event")) return;
      var dateStr = slot.getAttribute("data-date");
      var hour = slot.getAttribute("data-hour");
      openActivityModal(null, dateStr, hour + ":00");
    };
  });
}

function updateCalTitle() {
  var d = calState.currentDate;
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var el = document.getElementById("cal-title");
  if (!el) return;
  if (calState.view === "month") {
    el.textContent = months[d.getMonth()] + " " + d.getFullYear();
  } else {
    var ws = getWeekStart(d);
    var we = new Date(ws); we.setDate(we.getDate() + 6);
    var fmt = function(dt) { return months[dt.getMonth()].substring(0,3) + " " + dt.getDate(); };
    el.textContent = fmt(ws) + " – " + fmt(we) + ", " + we.getFullYear();
  }
}

function stepCal(dir) {
  var d = calState.currentDate;
  if (calState.view === "month") {
    calState.currentDate = new Date(d.getFullYear(), d.getMonth() + dir, 1);
  } else {
    var nd = new Date(d);
    nd.setDate(nd.getDate() + dir * 7);
    calState.currentDate = nd;
  }
  renderCalendar();
}

function getWeekStart(d) {
  var day = d.getDay(); // 0=Sun
  var diff = d.getDate() - day + (day === 0 ? -6 : 1); // Mon start
  return new Date(d.getFullYear(), d.getMonth(), diff);
}

function dateStr(d) {
  var y = d.getFullYear();
  var m = String(d.getMonth()+1).padStart(2,"0");
  var dd = String(d.getDate()).padStart(2,"0");
  return y + "-" + m + "-" + dd;
}

function getActivitiesForDate(ds) {
  return ACTIVITIES.filter(function(a) { return a.date === ds; });
}

// ─── Month View ────────────────────────────────
function renderMonthView(d) {
  var year = d.getFullYear(), month = d.getMonth();
  var firstDay = new Date(year, month, 1);
  var startDow = firstDay.getDay(); // 0=Sun
  var startOffset = startDow === 0 ? 6 : startDow - 1; // Mon-based
  var daysInMonth = new Date(year, month+1, 0).getDate();
  var today = dateStr(new Date());

  var html = '<div class="cal-month">';
  // Header row
  html += '<div class="cal-month-header">';
  ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].forEach(function(dn) {
    html += '<div class="cal-dow">' + dn + '</div>';
  });
  html += '</div>';

  // Day cells
  html += '<div class="cal-month-grid">';
  var totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  for (var i = 0; i < totalCells; i++) {
    var dayNum = i - startOffset + 1;
    var isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
    var cellDate = new Date(year, month, dayNum);
    var ds = dateStr(cellDate);
    var isToday = ds === today;
    var acts = isCurrentMonth ? getActivitiesForDate(ds) : [];

    html += '<div class="cal-day' + (!isCurrentMonth?" other-month":"") + (isToday?" today":"") + '" data-date="' + ds + '">';
    html += '<div class="cal-day-num' + (isToday?" today":"") + '">' + cellDate.getDate() + '</div>';
    // Activities
    acts.forEach(function(act, idx) {
      if (idx >= 3) return; // max 3 visible
      var col = ACTIVITY_COLORS[act.type] || COLORS.primary;
      html += '<div class="cal-event" data-id="' + act.id + '" style="--evt-color:' + col + '">';
      html += '<span class="cal-event-dot" style="background:' + col + '"></span>';
      html += '<span class="cal-event-label">' + act.subject + '</span>';
      html += '</div>';
    });
    if (acts.length > 3) {
      html += '<div class="cal-event-more">+' + (acts.length - 3) + ' more</div>';
    }
    html += '</div>';
  }
  html += '</div></div>';
  return html;
}

// ─── Week View ─────────────────────────────────
function renderWeekView(d) {
  var ws = getWeekStart(d);
  var today = dateStr(new Date());
  var hours = [];
  for (var h = 7; h <= 20; h++) hours.push(h);

  var html = '<div class="cal-week">';

  // Header
  html += '<div class="cal-week-header"><div class="cal-week-gutter"></div>';
  for (var i = 0; i < 7; i++) {
    var dd = new Date(ws); dd.setDate(dd.getDate() + i);
    var ds2 = dateStr(dd);
    var dayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    html += '<div class="cal-week-day-header' + (ds2 === today?" today":"") + '">';
    html += '<span class="cal-week-day-name">' + dayNames[i] + '</span>';
    html += '<span class="cal-week-day-num' + (ds2 === today?" today":"") + '">' + dd.getDate() + '</span>';
    html += '</div>';
  }
  html += '</div>';

  // Body
  html += '<div class="cal-week-body">';
  hours.forEach(function(h) {
    html += '<div class="cal-week-row">';
    html += '<div class="cal-week-gutter"><span>' + String(h).padStart(2,"0") + ':00</span></div>';
    for (var i = 0; i < 7; i++) {
      var dd = new Date(ws); dd.setDate(dd.getDate() + i);
      var ds3 = dateStr(dd);
      var acts = getActivitiesForDate(ds3).filter(function(a) {
        if (!a.time) return h === 9; // default
        var hh = parseInt(a.time.split(":")[0], 10);
        return hh === h;
      });
      html += '<div class="cal-hour-slot' + (ds3 === today?" today-col":"") + '" data-date="' + ds3 + '" data-hour="' + h + '">';
      acts.forEach(function(act) {
        var col = ACTIVITY_COLORS[act.type] || COLORS.primary;
        html += '<div class="cal-event week" data-id="' + act.id + '" style="--evt-color:' + col + ';border-left:3px solid ' + col + '">';
        html += '<div class="cal-event-label" style="font-weight:600">' + act.subject + '</div>';
        html += '<div style="font-size:9.5px;color:' + COLORS.muted + ';margin-top:1px">' + (act.time||"") + ' · ' + act.type + '</div>';
        html += '</div>';
      });
      html += '</div>';
    }
    html += '</div>';
  });
  html += '</div></div>';
  return html;
}

// ============================================================
// ACTIVITY MODAL — Create / Edit / Link to objects
// ============================================================
function openActivityModal(existingAct, prefillDate, prefillTime) {
  closeActivityModal();

  var isEdit = !!existingAct;
  var act = existingAct || {
    id: "", type: "Call", subject: "", date: prefillDate || dateStr(new Date()),
    time: prefillTime || "09:00", accountName: "", contactName: "",
    relatedObjKey: "", relatedRecId: "", notes: ""
  };

  // Build object options for linking
  var linkableObjects = ["accounts","contacts","opportunities","projects","leads","quotes","cases","campaigns","tasks"];

  var overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "activity-modal-overlay";

  var modal = document.createElement("div");
  modal.className = "modal-box";
  modal.id = "activity-modal";

  var html = '<div class="modal-header">';
  html += '<div style="display:flex;align-items:center;gap:8px">' + renderIcon("clock",18,COLORS.primary) + '<span style="font-size:15px;font-weight:700;color:var(--text)">' + (isEdit ? "Edit Activity" : "New Activity") + '</span></div>';
  html += '<button class="modal-close" id="modal-close-btn">&times;</button>';
  html += '</div>';

  html += '<div class="modal-body">';

  // Row 1: Type + Subject
  html += '<div class="modal-row">';
  html += '<div class="modal-field" style="flex:0 0 130px"><label>Type</label><select id="act-type">';
  ["Call","Meeting","Site Visit","Email"].forEach(function(t) {
    html += '<option value="' + t + '"' + (act.type === t ? " selected" : "") + '>' + t + '</option>';
  });
  html += '</select></div>';
  html += '<div class="modal-field" style="flex:1"><label>Subject</label><input id="act-subject" value="' + (act.subject||"") + '" placeholder="Activity subject..."></div>';
  html += '</div>';

  // Row 2: Date + Time
  html += '<div class="modal-row">';
  html += '<div class="modal-field"><label>Date</label><input type="date" id="act-date" value="' + (act.date||"") + '"></div>';
  html += '<div class="modal-field"><label>Time</label><input type="time" id="act-time" value="' + (act.time||"") + '"></div>';
  html += '</div>';

  // Row 3: Account + Contact
  html += '<div class="modal-row">';
  html += '<div class="modal-field"><label>Account</label><select id="act-account"><option value="">— None —</option>';
  ACCOUNTS.forEach(function(a) {
    html += '<option value="' + a.name + '"' + (act.accountName === a.name ? " selected" : "") + '>' + a.name + '</option>';
  });
  html += '</select></div>';
  html += '<div class="modal-field"><label>Contact</label><select id="act-contact"><option value="">— None —</option>';
  CONTACTS.forEach(function(c) {
    var name = c.firstName + " " + c.lastName;
    html += '<option value="' + name + '"' + (act.contactName === name ? " selected" : "") + '>' + name + '</option>';
  });
  html += '</select></div>';
  html += '</div>';

  // Row 4: Related Object
  html += '<div class="modal-row">';
  html += '<div class="modal-field"><label>Related Object</label><select id="act-rel-obj"><option value="">— None —</option>';
  linkableObjects.forEach(function(key) {
    html += '<option value="' + key + '"' + (act.relatedObjKey === key ? " selected" : "") + '>' + OBJ[key].label + '</option>';
  });
  html += '</select></div>';
  html += '<div class="modal-field"><label>Related Record</label><select id="act-rel-rec" ' + (!act.relatedObjKey ? 'disabled' : '') + '><option value="">— Select object first —</option>';
  if (act.relatedObjKey && OBJ[act.relatedObjKey]) {
    OBJ[act.relatedObjKey].data.forEach(function(r) {
      var name = getRecordName(r);
      html += '<option value="' + r.id + '"' + (act.relatedRecId === r.id ? " selected" : "") + '>' + name + '</option>';
    });
  }
  html += '</select></div>';
  html += '</div>';

  // Row 5: Notes
  html += '<div class="modal-field" style="margin-top:4px"><label>Notes</label><textarea id="act-notes" rows="3" placeholder="Optional notes...">' + (act.notes||"") + '</textarea></div>';

  html += '</div>'; // end modal-body

  // Footer
  html += '<div class="modal-footer">';
  if (isEdit) {
    html += '<button class="modal-btn danger" id="act-delete">Delete</button>';
  }
  html += '<div style="flex:1"></div>';
  html += '<button class="modal-btn secondary" id="act-cancel">Cancel</button>';
  html += '<button class="modal-btn primary" id="act-save">' + (isEdit ? "Save Changes" : "Create Activity") + '</button>';
  html += '</div>';

  modal.innerHTML = html;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Animate in
  requestAnimationFrame(function() { overlay.classList.add("active"); });

  // ─── Modal bindings ──────────────────────────
  var closeModal = function() { closeActivityModal(); };
  document.getElementById("modal-close-btn").onclick = closeModal;
  document.getElementById("act-cancel").onclick = closeModal;
  overlay.onclick = function(e) { if (e.target === overlay) closeModal(); };

  // Related object cascade
  document.getElementById("act-rel-obj").onchange = function() {
    var objKey = this.value;
    var recSel = document.getElementById("act-rel-rec");
    recSel.innerHTML = '<option value="">— Select record —</option>';
    if (objKey && OBJ[objKey]) {
      recSel.disabled = false;
      OBJ[objKey].data.forEach(function(r) {
        var opt = document.createElement("option");
        opt.value = r.id;
        opt.textContent = getRecordName(r);
        recSel.appendChild(opt);
      });
    } else {
      recSel.disabled = true;
      recSel.innerHTML = '<option value="">— Select object first —</option>';
    }
  };

  // Save
  document.getElementById("act-save").onclick = function() {
    var subject = document.getElementById("act-subject").value.trim();
    if (!subject) { showToast("Subject is required","warn"); return; }
    var newAct = {
      id: isEdit ? act.id : "ac" + (ACTIVITIES.length + 1) + "_" + Date.now(),
      type: document.getElementById("act-type").value,
      subject: subject,
      date: document.getElementById("act-date").value,
      time: document.getElementById("act-time").value,
      accountName: document.getElementById("act-account").value,
      contactName: document.getElementById("act-contact").value,
      relatedObjKey: document.getElementById("act-rel-obj").value,
      relatedRecId: document.getElementById("act-rel-rec").value,
      notes: document.getElementById("act-notes").value
    };

    if (isEdit) {
      var idx = ACTIVITIES.findIndex(function(a) { return a.id === act.id; });
      if (idx >= 0) ACTIVITIES[idx] = newAct;
      showToast("Activity updated","success");
    } else {
      ACTIVITIES.push(newAct);
      showToast("Activity created","success");
    }
    closeModal();
    if (APP.page === "calendar") renderCalendar();
    else renderApp();
  };

  // Delete
  if (isEdit) {
    document.getElementById("act-delete").onclick = function() {
      var idx = ACTIVITIES.findIndex(function(a) { return a.id === act.id; });
      if (idx >= 0) ACTIVITIES.splice(idx, 1);
      showToast("Activity deleted","info");
      closeModal();
      if (APP.page === "calendar") renderCalendar();
      else renderApp();
    };
  }
}

function closeActivityModal() {
  var overlay = document.getElementById("activity-modal-overlay");
  if (overlay) {
    overlay.classList.remove("active");
    setTimeout(function() { overlay.remove(); }, 150);
  }
}

// ─── Create activity from a record page ────────
function openActivityFromRecord(objKey, recId) {
  var rec = findRecord(objKey, recId);
  if (!rec) return;
  var prefillAct = {
    id: "", type: "Meeting", subject: "",
    date: dateStr(new Date()), time: "09:00",
    accountName: rec.accountName || (objKey === "accounts" ? rec.name : ""),
    contactName: rec.contactName || (objKey === "contacts" ? (rec.firstName + " " + rec.lastName) : ""),
    relatedObjKey: objKey,
    relatedRecId: recId,
    notes: ""
  };
  openActivityModal(prefillAct, null);
}
