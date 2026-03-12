// ============================================================
// MICKACRM 360 v3 — LIST.JS — with contextual filters
// ============================================================
var listState = { sortCol:null, sortDir:"asc", filter:"", filters:{} };

// ─── Filter definitions per object ────────────────────────────
var LIST_FILTERS = {
  accounts: [
    { key:"status", label:"Status", type:"select", options:["Client","Prospect"] },
    { key:"industry", label:"Industry", type:"select", optionsFromData:true },
    { key:"city", label:"City", type:"select", optionsFromData:true }
  ],
  contacts: [
    { key:"accountName", label:"Account", type:"select", optionsFromData:true },
    { key:"title", label:"Title", type:"select", optionsFromData:true }
  ],
  leads: [
    { key:"status", label:"Status", type:"select", options:["New","Contacted","Qualified"] },
    { key:"source", label:"Source", type:"select", optionsFromData:true }
  ],
  opportunities: [
    { key:"stage", label:"Stage", type:"select", options:["Lead","Study","Tender","Proposal","Negotiation","Closed Won"] },
    { key:"accountName", label:"Account", type:"select", optionsFromData:true }
  ],
  projects: [
    { key:"status", label:"Status", type:"select", optionsFromData:true },
    { key:"phase", label:"Phase", type:"select", optionsFromData:true },
    { key:"accountName", label:"Client", type:"select", optionsFromData:true }
  ],
  quotes: [
    { key:"status", label:"Status", type:"select", options:["Draft","Sent","Accepted"] },
    { key:"accountName", label:"Account", type:"select", optionsFromData:true }
  ],
  activities: [
    { key:"type", label:"Type", type:"select", options:["Call","Meeting","Site Visit","Email"] },
    { key:"accountName", label:"Account", type:"select", optionsFromData:true }
  ],
  tasks: [
    { key:"status", label:"Status", type:"select", options:["To Do","In Progress","Completed"] },
    { key:"priority", label:"Priority", type:"select", options:["High","Medium","Low"] }
  ],
  cases: [
    { key:"status", label:"Status", type:"select", options:["Open","In Progress","Resolved"] },
    { key:"priority", label:"Priority", type:"select", options:["Critical","High","Medium","Low"] },
    { key:"type", label:"Type", type:"select", optionsFromData:true }
  ],
  campaigns: [
    { key:"status", label:"Status", type:"select", options:["Planned","Active","Completed"] },
    { key:"type", label:"Type", type:"select", optionsFromData:true }
  ]
};

function getFilterOptions(objKey, fieldKey) {
  var obj = OBJ[objKey];
  if (!obj) return [];
  var vals = {};
  obj.data.forEach(function(r) {
    var v = r[fieldKey];
    if (v !== undefined && v !== null && v !== "") vals[v] = true;
  });
  return Object.keys(vals).sort();
}

function renderList(objKey) {
  listState.sortCol = null;
  listState.sortDir = "asc";
  listState.filter = "";
  listState.filters = {};
  renderListInner(objKey);
}

function renderListInner(objKey) {
  var container = document.getElementById("main-content");
  var obj = OBJ[objKey];
  var data = obj.data.slice();

  // Apply text search filter
  if (listState.filter) {
    var q = listState.filter.toLowerCase();
    data = data.filter(function(r) {
      return Object.values(r).some(function(v) {
        return String(v).toLowerCase().indexOf(q) >= 0;
      });
    });
  }

  // Apply dropdown filters
  var activeFilters = listState.filters;
  Object.keys(activeFilters).forEach(function(fk) {
    if (activeFilters[fk]) {
      data = data.filter(function(r) {
        return r[fk] === activeFilters[fk];
      });
    }
  });

  // Sort
  if (listState.sortCol) {
    var dir = listState.sortDir, col = listState.sortCol;
    data.sort(function(a, b) {
      var av = String(a[col] || "").toLowerCase();
      var bv = String(b[col] || "").toLowerCase();
      return dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }

  // Count active filters
  var activeCount = 0;
  Object.keys(activeFilters).forEach(function(k) { if (activeFilters[k]) activeCount++; });

  var filters = LIST_FILTERS[objKey] || [];

  var html = '<div class="table-container" style="animation:fadeSlide .2s ease">';

  // ─── Search bar row ──────────────────────────
  html += '<div style="margin-bottom:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">';
  html += '<div style="position:relative;flex:1;max-width:300px">';
  html += '<span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);display:flex">' + renderIcon("search", 14, COLORS.muted) + '</span>';
  html += '<input id="list-filter" placeholder="Search..." value="' + listState.filter + '" style="width:100%;padding:9px 12px 9px 32px;border:1px solid var(--border);border-radius:9px;font-size:12px;outline:none;background:var(--white);box-shadow:var(--sh1);font-family:var(--font)">';
  html += '</div>';
  html += '<span style="font-size:11px;color:var(--muted)">' + data.length + ' record' + (data.length > 1 ? 's' : '') + '</span>';
  if (activeCount > 0) {
    html += '<button id="clear-all-filters" style="font-size:11px;color:var(--primary);background:none;border:none;cursor:pointer;font-family:var(--font);font-weight:500">Clear filters</button>';
  }
  html += '</div>';

  // ─── Filter bar ──────────────────────────────
  if (filters.length) {
    html += '<div class="list-filter-bar">';
    filters.forEach(function(f) {
      var val = activeFilters[f.key] || "";
      var opts = f.options ? f.options : (f.optionsFromData ? getFilterOptions(objKey, f.key) : []);
      var isActive = val !== "";
      html += '<div class="list-filter-chip' + (isActive ? ' active' : '') + '">';
      html += '<select class="list-filter-select" data-filter-key="' + f.key + '">';
      html += '<option value="">' + f.label + '</option>';
      opts.forEach(function(o) {
        html += '<option value="' + o + '"' + (val === o ? ' selected' : '') + '>' + o + '</option>';
      });
      html += '</select>';
      if (isActive) {
        html += '<span class="list-filter-clear" data-filter-key="' + f.key + '">&times;</span>';
      }
      html += '</div>';
    });
    html += '</div>';
  }

  // ─── Table ───────────────────────────────────
  html += '<div class="data-table"><div style="overflow-x:auto"><table><thead><tr>';
  obj.cols.forEach(function(col) {
    var arrow = listState.sortCol === col ? (listState.sortDir === "asc" ? " \u2191" : " \u2193") : "";
    html += '<th data-col="' + col + '">' + obj.colLabels[col] + arrow + '</th>';
  });
  html += '</tr></thead><tbody>';

  if (data.length === 0) {
    html += '<tr><td colspan="' + obj.cols.length + '" style="text-align:center;padding:32px 14px;color:var(--muted);font-size:12px">No records match your filters</td></tr>';
  } else {
    data.forEach(function(row) {
      html += '<tr data-obj="' + objKey + '" data-id="' + row.id + '">';
      obj.cols.forEach(function(col, j) {
        if (isBadgeField(col) && row[col]) {
          html += '<td>' + createBadge(row[col]) + '</td>';
        } else {
          html += '<td' + (j === 0 ? ' class="primary"' : '') + '>' + formatFieldValue(col, row[col]) + '</td>';
        }
      });
      html += '</tr>';
    });
  }
  html += '</tbody></table></div></div></div>';

  container.innerHTML = html;

  // ─── Event bindings ──────────────────────────

  // Search input
  var filterInput = document.getElementById("list-filter");
  if (filterInput) {
    filterInput.oninput = function() {
      listState.filter = filterInput.value;
      renderListInner(objKey);
    };
  }

  // Clear all filters
  var clearBtn = document.getElementById("clear-all-filters");
  if (clearBtn) {
    clearBtn.onclick = function() {
      listState.filters = {};
      renderListInner(objKey);
    };
  }

  // Filter selects
  container.querySelectorAll(".list-filter-select").forEach(function(sel) {
    sel.onchange = function() {
      var key = sel.getAttribute("data-filter-key");
      listState.filters[key] = sel.value;
      renderListInner(objKey);
    };
  });

  // Filter clear X buttons
  container.querySelectorAll(".list-filter-clear").forEach(function(btn) {
    btn.onclick = function(e) {
      e.stopPropagation();
      var key = btn.getAttribute("data-filter-key");
      listState.filters[key] = "";
      renderListInner(objKey);
    };
  });

  // Column sort
  container.querySelectorAll("th[data-col]").forEach(function(th) {
    th.onclick = function() {
      var col = th.getAttribute("data-col");
      if (listState.sortCol === col) {
        listState.sortDir = listState.sortDir === "asc" ? "desc" : "asc";
      } else {
        listState.sortCol = col;
        listState.sortDir = "asc";
      }
      renderListInner(objKey);
    };
  });

  // Row clicks
  container.querySelectorAll("tbody tr[data-id]").forEach(function(tr) {
    tr.onclick = function() {
      navigate("record", tr.getAttribute("data-obj"), tr.getAttribute("data-id"));
    };
  });
}
