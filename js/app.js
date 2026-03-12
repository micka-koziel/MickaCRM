// ============================================================
// MICKACRM 360 — APP.JS
// Main entry point: renderApp router + init
// ============================================================

// ─── Main Render Router ────────────────────────────────────────
function renderApp() {
  // Update nav pills active state
  updateNavPills();

  // Render breadcrumbs
  renderBreadcrumbs();

  // Render page header
  renderPageHeader();

  // Route to correct page
  switch (APP.page) {
    case "home":
      renderDashboard();
      break;
    case "list":
      renderList(APP.currentObj);
      break;
    case "record":
      renderRecord(APP.currentObj, APP.currentRec);
      break;
    case "pipeline":
      renderPipeline();
      break;
    default:
      renderDashboard();
  }
}

// ─── Page Header (shown on non-home pages) ─────────────────────
function renderPageHeader() {
  var header = document.getElementById("page-header");
  if (APP.page === "home") {
    header.style.display = "none";
    return;
  }

  header.style.display = "flex";
  var obj = APP.currentObj ? OBJ[APP.currentObj] : null;
  var iconEl = document.getElementById("page-header-icon");
  var titleEl = document.getElementById("page-header-title");
  var newBtn = document.getElementById("page-header-new-btn");

  if (APP.page === "pipeline") {
    iconEl.textContent = "💰";
    titleEl.textContent = "Pipeline Opportunités";
    newBtn.style.display = "none";
  } else if (APP.page === "list" && obj) {
    iconEl.textContent = obj.icon;
    titleEl.textContent = obj.label;
    newBtn.style.display = "inline-block";
  } else if (APP.page === "record" && obj) {
    var lastBc = APP.breadcrumbs[APP.breadcrumbs.length - 1];
    iconEl.textContent = obj.icon;
    titleEl.textContent = lastBc ? lastBc.label : "";
    newBtn.style.display = "none";
  } else {
    header.style.display = "none";
  }
}

// ─── Init on DOM Ready ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function() {
  setupTopBar();
  renderApp();
});
