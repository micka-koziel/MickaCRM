// ============================================================
// MICKACRM 360 — UI.JS
// Reusable UI components
// Badge, Card, KPI, RelCard, Toast, helpers
// ============================================================

// ─── Badge Generator ───────────────────────────────────────────
function createBadge(text, size) {
  size = size || "sm";
  const color = BADGE_COLORS[text] || COLORS.text2;
  const span = document.createElement("span");
  span.className = "badge badge-" + size;
  span.textContent = text;
  span.style.background = color + "14";
  span.style.color = color;
  return span;
}

// ─── Check if field should be a badge ──────────────────────────
function isBadgeField(fieldName) {
  return ["status", "priority", "stage"].includes(fieldName);
}

// ─── Format field value ────────────────────────────────────────
function formatFieldValue(key, value) {
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

// ─── Get record display name ───────────────────────────────────
function getRecordName(record) {
  if (record.name) return record.name;
  if (record.firstName || record.lastName) {
    return ((record.firstName || "") + " " + (record.lastName || "")).trim();
  }
  if (record.subject) return record.subject;
  return record.id;
}

// ─── Find record by ID in an object ────────────────────────────
function findRecord(objKey, recId) {
  const obj = OBJ[objKey];
  if (!obj) return null;
  return obj.data.find(function(r) { return r.id === recId; }) || null;
}

// ─── Get related records for a given record ────────────────────
function getRelatedRecords(objKey, record) {
  var related = {};
  var accountName = record.accountName || record.name;

  if (objKey === "accounts") {
    related.contacts = CONTACTS.filter(function(c) { return c.accountId === record.id; });
    related.opportunities = OPPORTUNITIES.filter(function(o) { return o.accountId === record.id; });
  }
  related.activities = ACTIVITIES.filter(function(a) { return a.accountName === accountName; });
  related.tasks = TASKS.filter(function(t) { return t.relatedTo === record.name; });
  related.quotes = QUOTES.filter(function(q) { return q.accountName === accountName; });

  return related;
}

// ─── Simple Toast ──────────────────────────────────────────────
function showToast(message, type) {
  type = type || "info";
  var toast = document.createElement("div");
  toast.style.cssText = "position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;color:#fff;z-index:9999;box-shadow:var(--sh3);animation:fadeSlide .2s ease;font-family:var(--font-display);";

  var bgMap = { info: COLORS.blu, success: COLORS.success, error: COLORS.red, warn: COLORS.warn };
  toast.style.background = bgMap[type] || bgMap.info;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(function() {
    toast.style.opacity = "0";
    toast.style.transition = "opacity .3s";
    setTimeout(function() { toast.remove(); }, 300);
  }, 2500);
}
