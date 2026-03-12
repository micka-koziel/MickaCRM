// ============================================================
// MICKACRM 360 v3 — RECORD.JS
// ============================================================
function renderRecord(objKey, recId) {
  var container = document.getElementById("main-content");
  var obj = OBJ[objKey]; var rec = findRecord(objKey, recId);
  if (!rec) { container.innerHTML = '<div style="padding:40px;color:var(--muted);text-align:center">Not found</div>'; return; }
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
  if (related.activities && related.activities.length) { hasRelated=true; html += buildRelCard("Activities","phone",related.activities.map(function(a){return{id:a.id,name:a.subject,sub:a.type+" · "+a.date};})); }
  if (related.tasks && related.tasks.length) { hasRelated=true; html += buildRelCard("Tasks","check",related.tasks.map(function(t){return{id:t.id,name:t.subject,sub:t.priority+" · "+t.status};})); }
  if (!hasRelated) html += '<div class="record-card" style="padding:24px;color:var(--muted);font-size:12px;text-align:center">No related data</div>';
  html += '</div></div>';
  container.innerHTML = html;

  container.querySelectorAll(".rel-card-item.clickable").forEach(function(el) {
    el.onclick = function() { var oK=el.getAttribute("data-obj"),rId=el.getAttribute("data-id"); if(oK&&rId)navigate("record",oK,rId); };
  });

  // New Activity from record
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
