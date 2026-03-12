// ============================================================
// MICKACRM 360 v3 — LIST.JS
// ============================================================
var listState = { sortCol:null, sortDir:"asc", filter:"" };

function renderList(objKey) { listState.sortCol=null; listState.sortDir="asc"; listState.filter=""; renderListInner(objKey); }

function renderListInner(objKey) {
  var container = document.getElementById("main-content");
  var obj = OBJ[objKey]; var data = obj.data.slice();
  if (listState.filter) { var q=listState.filter.toLowerCase(); data=data.filter(function(r){return Object.values(r).some(function(v){return String(v).toLowerCase().indexOf(q)>=0;});}); }
  if (listState.sortCol) { var dir=listState.sortDir,col=listState.sortCol; data.sort(function(a,b){var av=String(a[col]||"").toLowerCase(),bv=String(b[col]||"").toLowerCase();return dir==="asc"?av.localeCompare(bv):bv.localeCompare(av);}); }

  var html = '<div class="table-container" style="animation:fadeSlide .2s ease">';
  html += '<div style="margin-bottom:14px;display:flex;gap:10px;align-items:center"><div style="position:relative;flex:1;max-width:300px"><span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);display:flex">' + renderIcon("search",14,COLORS.muted) + '</span>';
  html += '<input id="list-filter" placeholder="Rechercher..." value="' + listState.filter + '" style="width:100%;padding:9px 12px 9px 32px;border:1px solid var(--border);border-radius:9px;font-size:12px;outline:none;background:var(--white);box-shadow:var(--sh1);font-family:var(--font)"></div>';
  html += '<span style="font-size:11px;color:var(--muted)">' + data.length + ' enregistrement' + (data.length>1?'s':'') + '</span></div>';

  html += '<div class="data-table"><div style="overflow-x:auto"><table><thead><tr>';
  obj.cols.forEach(function(col) { var arrow = listState.sortCol===col?(listState.sortDir==="asc"?" ↑":" ↓"):""; html += '<th data-col="' + col + '">' + obj.colLabels[col] + arrow + '</th>'; });
  html += '</tr></thead><tbody>';
  data.forEach(function(row) {
    html += '<tr data-obj="' + objKey + '" data-id="' + row.id + '">';
    obj.cols.forEach(function(col,j) {
      if (isBadgeField(col) && row[col]) { html += '<td>' + createBadge(row[col]) + '</td>'; }
      else { html += '<td' + (j===0?' class="primary"':'') + '>' + formatFieldValue(col,row[col]) + '</td>'; }
    });
    html += '</tr>';
  });
  html += '</tbody></table></div></div></div>';
  container.innerHTML = html;

  var filterInput = document.getElementById("list-filter");
  if (filterInput) filterInput.oninput = function() { listState.filter=filterInput.value; renderListInner(objKey); };
  container.querySelectorAll("th[data-col]").forEach(function(th) { th.onclick = function() { var col=th.getAttribute("data-col"); if(listState.sortCol===col)listState.sortDir=listState.sortDir==="asc"?"desc":"asc"; else{listState.sortCol=col;listState.sortDir="asc";} renderListInner(objKey); }; });
  container.querySelectorAll("tbody tr[data-id]").forEach(function(tr) { tr.onclick = function() { navigate("record",tr.getAttribute("data-obj"),tr.getAttribute("data-id")); }; });
}
