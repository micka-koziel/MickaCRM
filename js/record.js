// ============================================================
// MICKACRM 360 — RECORD.JS
// Record Detail View (fiche détail)
// 2-column layout: fields + related objects
// ============================================================

function renderRecord(objKey, recId) {
  var container = document.getElementById("main-content");
  var obj = OBJ[objKey];
  var rec = findRecord(objKey, recId);

  if (!rec) {
    container.innerHTML = '<div style="padding:40px;color:var(--muted);text-align:center">Enregistrement introuvable</div>';
    return;
  }

  var fields = Object.entries(rec).filter(function(e) {
    return e[0] !== "id" && e[0] !== "amountNum";
  });

  var related = getRelatedRecords(objKey, rec);

  var html = '<div class="record-layout anim-fade-slide">';

  // ─── Left: Fields Card
  html += '<div class="record-card">';

  // Header
  html += '<div class="record-header">';
  html += '<span class="rec-icon">' + obj.icon + '</span>';
  html += '<div><div class="rec-name">' + getRecordName(rec) + '</div>';
  html += '<div class="rec-type">' + obj.label + '</div></div>';
  html += '</div>';

  // Fields grid
  html += '<div class="record-fields">';
  fields.forEach(function(f) {
    var key = f[0], val = f[1];
    var isFullWidth = (obj.fullWidthFields && obj.fullWidthFields.includes(key)) || key === "notes" || key === "address";
    html += '<div' + (isFullWidth ? ' class="field-full"' : '') + '>';
    html += '<div class="field-label">' + (FIELD_LABELS[key] || key) + '</div>';

    if (isBadgeField(key) && val) {
      var bc = BADGE_COLORS[val] || COLORS.text2;
      html += '<div class="field-value"><span class="badge badge-sm" style="background:' + bc + '14;color:' + bc + '">' + val + '</span></div>';
    } else {
      html += '<div class="field-value">' + formatFieldValue(key, val) + '</div>';
    }

    html += '</div>';
  });
  html += '</div></div>';

  // ─── Right: Related Cards
  html += '<div style="display:flex;flex-direction:column;gap:14px">';

  var hasRelated = false;

  if (related.contacts && related.contacts.length > 0) {
    hasRelated = true;
    html += buildRelCard("Contacts", "👤", related.contacts.map(function(c) {
      return { id: c.id, name: c.firstName + " " + c.lastName, sub: c.title, objKey: "contacts" };
    }));
  }

  if (related.opportunities && related.opportunities.length > 0) {
    hasRelated = true;
    html += buildRelCard("Opportunités", "💰", related.opportunities.map(function(o) {
      return { id: o.id, name: o.name, sub: o.amount + " · " + o.stage, objKey: "opportunities" };
    }));
  }

  if (related.quotes && related.quotes.length > 0) {
    hasRelated = true;
    html += buildRelCard("Devis", "📄", related.quotes.map(function(q) {
      return { id: q.id, name: q.name, sub: q.amount + " · " + q.status, objKey: "quotes" };
    }));
  }

  if (related.activities && related.activities.length > 0) {
    hasRelated = true;
    html += buildRelCard("Activités", "📞", related.activities.map(function(a) {
      return { id: a.id, name: a.subject, sub: a.type + " · " + a.date, objKey: null };
    }));
  }

  if (related.tasks && related.tasks.length > 0) {
    hasRelated = true;
    html += buildRelCard("Tâches", "✅", related.tasks.map(function(t) {
      return { id: t.id, name: t.subject, sub: t.priority + " · " + t.status, objKey: null };
    }));
  }

  if (!hasRelated) {
    html += '<div class="record-card" style="padding:24px;color:var(--muted);font-size:12px;text-align:center">Aucune donnée liée</div>';
  }

  html += '</div>'; // end right col
  html += '</div>'; // end record-layout

  container.innerHTML = html;

  // Bind click on related items
  container.querySelectorAll(".rel-card-item.clickable").forEach(function(el) {
    el.onclick = function() {
      var oKey = el.getAttribute("data-obj");
      var rId = el.getAttribute("data-id");
      if (oKey && rId) navigate("record", oKey, rId);
    };
  });
}

// ─── Related Card Builder ──────────────────────────────────────
function buildRelCard(title, icon, items) {
  var html = '<div class="rel-card">';
  html += '<div class="rel-card-header"><span>' + icon + '</span> ' + title + ' <span class="count">' + items.length + '</span></div>';

  items.forEach(function(it, i) {
    var clickable = it.objKey ? ' clickable" data-obj="' + it.objKey + '" data-id="' + it.id : '';
    html += '<div class="rel-card-item' + clickable + '">';
    html += '<div class="item-name">' + it.name + '</div>';
    html += '<div class="item-sub">' + it.sub + '</div>';
    html += '</div>';
  });

  html += '</div>';
  return html;
}
