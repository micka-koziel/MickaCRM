// ============================================================
// MICKACRM 360 v3 — UI.JS — Reusable UI components
// ============================================================

function renderIcon(name, size, color) {
  var def = ICON_DATA[name];
  if (!def) return "";
  var s = size || 16;
  var c = color || COLORS.muted;
  var inner = "";
  if (def.paths) def.paths.forEach(function(p) { inner += '<path d="' + p + '"/>'; });
  if (def.circles) def.circles.forEach(function(ci) { inner += '<circle cx="' + ci[0] + '" cy="' + ci[1] + '" r="' + ci[2] + '"/>'; });
  if (def.rects) def.rects.forEach(function(r) { inner += '<rect x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '" rx="' + (r[4]||0) + '"/>'; });
  return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="' + c + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
}

function renderObjIcon(objKey, size, color) {
  return renderIcon(OBJ_ICON_MAP[objKey], size || 16, color || COLORS.muted);
}

function createBadge(text) {
  var c = BADGE_COLORS[text] || COLORS.text2;
  return '<span class="badge" style="background:' + c + '10;color:' + c + '">' + text + '</span>';
}

function isBadgeField(fieldName) {
  return ["status","priority","stage"].indexOf(fieldName) >= 0;
}

function formatFieldValue(key, value) {
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

function getRecordName(record) {
  if (record.name) return record.name;
  if (record.firstName) return (record.firstName + " " + (record.lastName || "")).trim();
  if (record.subject) return record.subject;
  return record.id;
}

function findRecord(objKey, recId) {
  var obj = OBJ[objKey];
  if (!obj) return null;
  return obj.data.find(function(r) { return r.id === recId; }) || null;
}

function getRelatedRecords(objKey, record) {
  var related = {};
  var accountName = record.accountName || record.name;
  if (objKey === "accounts") {
    related.contacts = CONTACTS.filter(function(c) { return c.accountId === record.id; });
    related.opportunities = OPPORTUNITIES.filter(function(o) { return o.accountId === record.id; });
  }
  // Activities: match by accountName OR by direct relatedObjKey/relatedRecId link
  related.activities = ACTIVITIES.filter(function(a) {
    if (a.relatedObjKey === objKey && a.relatedRecId === record.id) return true;
    if (a.accountName === accountName) return true;
    // Also match contacts by name
    if (objKey === "contacts" && record.firstName) {
      var fullName = (record.firstName + " " + (record.lastName || "")).trim();
      if (a.contactName === fullName) return true;
    }
    return false;
  });
  related.tasks = TASKS.filter(function(t) { return t.relatedTo === record.name; });
  related.quotes = QUOTES.filter(function(q) { return q.accountName === accountName; });
  return related;
}

function showToast(message, type) {
  type = type || "info";
  var toast = document.createElement("div");
  var bgMap = { info:COLORS.primary, success:COLORS.success, error:COLORS.red, warn:COLORS.warn };
  toast.style.cssText = "position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;color:#fff;z-index:9999;box-shadow:var(--sh3);animation:fadeSlide .2s ease;font-family:var(--font);background:" + (bgMap[type]||bgMap.info);
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(function() { toast.style.opacity = "0"; toast.style.transition = "opacity .3s"; setTimeout(function() { toast.remove(); }, 300); }, 2500);
}
