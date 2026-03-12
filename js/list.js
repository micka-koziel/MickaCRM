// ============================================================
// MICKACRM 360 — LIST.JS
// Generic DataTable / List View for all objects
// ============================================================

// ─── State for sorting ─────────────────────────────────────────
var listState = {
  sortCol: null,
  sortDir: "asc",
  filter: "",
};

function renderList(objKey) {
  var container = document.getElementById("main-content");
  var obj = OBJ[objKey];
  if (!obj) { container.innerHTML = ""; return; }

  // Reset sort on object change
  listState.sortCol = null;
  listState.sortDir = "asc";
  listState.filter = "";

  renderListInner(objKey);
}

function renderListInner(objKey) {
  var container = document.getElementById("main-content");
  var obj = OBJ[objKey];
  var data = obj.data.slice();

  // Filter
  if (listState.filter) {
    var q = listState.filter.toLowerCase();
    data = data.filter(function(r) {
      return Object.values(r).some(function(v) {
        return String(v).toLowerCase().includes(q);
      });
    });
  }

  // Sort
  if (listState.sortCol) {
    var dir = listState.sortDir;
    var col = listState.sortCol;
    data.sort(function(a, b) {
      var av = String(a[col] || "").toLowerCase();
      var bv = String(b[col] || "").toLowerCase();
      return dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }

  var html = '<div class="table-container anim-fade-slide">';

  // Toolbar
  html += '<div style="margin-bottom:14px;display:flex;gap:10px;align-items:center">';
  html += '<div class="table-search">';
  html += '<span class="icon">🔍</span>';
  html += '<input id="list-filter" placeholder="Rechercher..." value="' + listState.filter + '">';
  html += '</div>';
  html += '<span class="table-count">' + data.length + ' enregistrement' + (data.length > 1 ? 's' : '') + '</span>';
  html += '</div>';

  // Table
  html += '<div class="data-table"><div style="overflow-x:auto"><table>';

  // Thead
  html += '<thead><tr>';
  obj.cols.forEach(function(col) {
    var arrow = listState.sortCol === col ? (listState.sortDir === "asc" ? " ↑" : " ↓") : "";
    html += '<th data-col="' + col + '">' + obj.colLabels[col] + arrow + '</th>';
  });
  html += '</tr></thead>';

  // Tbody
  html += '<tbody>';
  data.forEach(function(row) {
    html += '<tr data-obj="' + objKey + '" data-id="' + row.id + '">';
    obj.cols.forEach(function(col, j) {
      var val = row[col];
      if (isBadgeField(col) && val) {
        var bc = BADGE_COLORS[val] || COLORS.text2;
        html += '<td><span class="badge badge-sm" style="background:' + bc + '14;color:' + bc + '">' + val + '</span></td>';
      } else {
        var cls = j === 0 ? ' class="primary"' : '';
        html += '<td' + cls + '>' + formatFieldValue(col, val) + '</td>';
      }
    });
    html += '</tr>';
  });
  html += '</tbody></table></div></div></div>';

  container.innerHTML = html;

  // ─── Bind events ───
  // Filter input
  var filterInput = document.getElementById("list-filter");
  if (filterInput) {
    filterInput.oninput = function() {
      listState.filter = filterInput.value;
      renderListInner(objKey);
    };
  }

  // Column sort
  var ths = container.querySelectorAll("th[data-col]");
  ths.forEach(function(th) {
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

  // Row click → record
  var rows = container.querySelectorAll("tbody tr[data-id]");
  rows.forEach(function(tr) {
    tr.onclick = function() {
      var oKey = tr.getAttribute("data-obj");
      var rId = tr.getAttribute("data-id");
      navigate("record", oKey, rId);
    };
  });
}
