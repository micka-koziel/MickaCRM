/* ═══════════════════════════════════════════════════════
   nav.js — Sidebar Navigation + SVG Icons + Routing
   ═══════════════════════════════════════════════════════ */

const NAV_ICONS = {
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1',
  accounts: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  contacts: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  leads: 'M13 10V3L4 14h7v7l9-11h-7z',
  opportunities: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  quotes: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  projects: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  claims: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',
  activities: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  calendar: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  plus: 'M12 4v16m8-8H4',
  kanban: 'M9 4H5a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V5a1 1 0 00-1-1zm0 8H5a1 1 0 00-1 1v6a1 1 0 001 1h4a1 1 0 001-1v-6a1 1 0 00-1-1zm10-8h-4a1 1 0 00-1 1v6a1 1 0 001 1h4a1 1 0 001-1V5a1 1 0 00-1-1zm0 10h-4a1 1 0 00-1 1v2a1 1 0 001 1h4a1 1 0 001-1v-2a1 1 0 00-1-1z',
  list: 'M4 6h16M4 10h16M4 14h16M4 18h16',
  chart: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  calendarView: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  filter: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z',
  collapse: 'M11 19l-7-7 7-7m8 14l-7-7 7-7',
  expand: 'M13 5l7 7-7 7M5 5l7 7-7 7',
  arrowUp: 'M7 17l9.2-9.2M17 17V8h-9',
  arrowLeft: 'M19 12H5m7-7l-7 7 7 7',
  phone: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  mapPin: 'M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
  mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
};

function svgIcon(name, size, color) {
  size = size || 17; color = color || 'currentColor';
  var p = NAV_ICONS[name] || '';
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="'+color+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">'+(p ? '<path d="'+p+'"/>' : '')+'</svg>';
}

var NAV_ITEMS = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'accounts', label: 'Accounts', icon: 'accounts' },
  { key: 'contacts', label: 'Contacts', icon: 'contacts' },
  { key: 'leads', label: 'Leads', icon: 'leads' },
  { key: 'opportunities', label: 'Opportunities', icon: 'opportunities' },
  { key: 'quotes', label: 'Quotes', icon: 'quotes' },
  { key: 'projects', label: 'Projects', icon: 'projects' },
  { key: 'claims', label: 'Claims', icon: 'claims' },
  { key: 'activities', label: 'Activities', icon: 'activities' },
  { key: 'calendar', label: 'Calendar', icon: 'calendar' },
];

var sidebarCollapsed = false;
var currentPage = 'home';
var currentRecordObj = null;
var currentRecordId = null;

function renderSidebar() {
  var sb = document.getElementById('sidebar');
  sb.className = sidebarCollapsed ? 'collapsed' : '';
  var items = NAV_ITEMS.map(function(item) {
    var isActive = (currentPage === item.key) || (currentPage === 'record' && currentRecordObj === item.key);
    return '<button class="sb-item '+(isActive ? 'active' : '')+'" data-page="'+item.key+'" title="'+(sidebarCollapsed ? item.label : '')+'">' +
      svgIcon(item.icon) + '<span>'+item.label+'</span></button>';
  }).join('');

  sb.innerHTML =
    '<div class="sb-logo">' +
      '<img src="assets/LogoSG.png" alt="Logo" class="sb-logo-icon" />' +
      (sidebarCollapsed ? '' : '<span class="sb-logo-text">MickaCRM<span class="sb-logo-360">360</span></span>') +
    '</div>' +
    '<div class="sb-nav">' + items + '</div>' +
    '<div class="sb-footer"><button class="sb-collapse-btn" id="sb-toggle">' +
    svgIcon(sidebarCollapsed ? 'expand' : 'collapse', 15) + '<span>Collapse</span></button></div>';

  sb.querySelectorAll('.sb-item').forEach(function(btn) {
    btn.addEventListener('click', function() { navigate(btn.dataset.page); });
  });
  document.getElementById('sb-toggle').addEventListener('click', function() {
    sidebarCollapsed = !sidebarCollapsed;
    renderSidebar();
  });
}

function navigate(page, recObj, recId) {
  // Record detail view
  if (page === 'record' && recObj && recId) {
    currentPage = 'record';
    currentRecordObj = recObj;
    currentRecordId = recId;
  } else {
    currentPage = page;
    currentRecordObj = null;
    currentRecordId = null;
  }
  renderSidebar();
  renderCurrentPage();
}

function renderCurrentPage() {
  var header = document.getElementById('page-header');
  var content = document.getElementById('page-content');
  header.innerHTML = '';
  content.innerHTML = '';

  switch (currentPage) {
    case 'home':
      header.style.display = 'none';
      renderDashboard(content);
      break;
    case 'record':
      header.style.display = '';
      renderRecordPage(currentRecordObj, currentRecordId, header, content);
      break;
    case 'opportunities':
    case 'leads':
    case 'accounts':
    case 'contacts':
    case 'quotes':
    case 'projects':
    case 'claims':
      header.style.display = '';
      renderObjectPage(currentPage, header, content);
      break;
    default:
      header.style.display = 'none';
      var navItem = NAV_ITEMS.find(function(n) { return n.key === currentPage; });
      content.innerHTML = '<div class="placeholder-view">' +
        svgIcon(navItem ? navItem.icon : 'home', 44, 'var(--text-light)') +
        '<div style="text-align:center"><div style="font-size:15px;font-weight:600;color:var(--text)">' +
        (navItem ? navItem.label : currentPage) + '</div>' +
        '<div style="font-size:12px;color:var(--text-light);margin-top:4px">Module under construction</div></div></div>';
      break;
  }
}
