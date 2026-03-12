// ============================================================
// MICKACRM 360 v3 — APP.JS — Entry point
// ============================================================
function renderApp() {
  updateNavPills();
  renderBreadcrumbs();
  renderPageHeader();
  switch (APP.page) {
    case "home": renderDashboard(); break;
    case "list": renderList(APP.currentObj); break;
    case "record": renderRecord(APP.currentObj, APP.currentRec); break;
    case "pipeline": renderPipeline(); break;
    case "calendar": renderCalendar(); break;
    default: renderDashboard();
  }
}

function renderPageHeader() {
  var header = document.getElementById("page-header");
  if (APP.page === "home") { header.style.display = "none"; return; }
  // Hide page header for account records (Account 360 has its own header)
  if (APP.page === "record" && APP.currentObj === "accounts") { header.style.display = "none"; return; }
  header.style.display = "flex";
  var obj = APP.currentObj ? OBJ[APP.currentObj] : null;
  var iconEl = document.getElementById("page-header-icon");
  var titleEl = document.getElementById("page-header-title");
  var newBtn = document.getElementById("page-header-new-btn");
  if (APP.page === "pipeline") { iconEl.innerHTML = renderIcon("briefcase",20,COLORS.text2); titleEl.textContent = "Opportunities Pipeline"; newBtn.style.display = "none"; }
  else if (APP.page === "calendar") { iconEl.innerHTML = renderIcon("clock",20,COLORS.text2); titleEl.textContent = "Calendar"; newBtn.style.display = "none"; }
  else if (APP.page === "list" && obj) { iconEl.innerHTML = renderObjIcon(APP.currentObj,20,COLORS.text2); titleEl.textContent = obj.label; newBtn.style.display = "flex"; }
  else if (APP.page === "record" && obj) { var lastBc = APP.breadcrumbs[APP.breadcrumbs.length-1]; iconEl.innerHTML = renderObjIcon(APP.currentObj,20,COLORS.text2); titleEl.textContent = lastBc?lastBc.label:""; newBtn.style.display = "none"; }
  else { header.style.display = "none"; }
}

document.addEventListener("DOMContentLoaded", function() { setupTopBar(); renderApp(); });
