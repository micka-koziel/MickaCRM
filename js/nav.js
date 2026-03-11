/* ============================================
   MickaCRM — nav.js
   Sidebar navigation rendering
   ============================================ */

MickaCRM.nav = (() => {

  const menuItems = [
    { section: 'Principal', items: [
      { id:'dashboard', label:'Dashboard', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', href:'index.html' },
    ]},
    { section: 'Commercial', items: [
      { id:'accounts', label:'Comptes', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/></svg>', href:'pages/accounts.html', badge:8 },
      { id:'contacts', label:'Contacts', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', href:'pages/contacts.html', badge:12 },
      { id:'leads', label:'Leads', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', href:'pages/leads.html', badge:6 },
      { id:'opportunities', label:'Opportunités', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', href:'pages/opportunities.html', badge:5 },
    ]},
    { section: 'Projets & Ops', items: [
      { id:'projects', label:'Projets', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7-6H4a2 2 0 0 0-2 2Z"/><path d="M14 2v6h6"/></svg>', href:'pages/projects.html', badge:4 },
      { id:'quotes', label:'Devis', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>', href:'pages/quotes.html', badge:5 },
      { id:'orders', label:'Commandes', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>', href:'pages/orders.html', badge:4 },
      { id:'invoices', label:'Factures', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>', href:'pages/invoices.html', badge:5 },
    ]},
    { section: 'Marketing & Support', items: [
      { id:'campaigns', label:'Campagnes', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>', href:'pages/campaigns.html', badge:3 },
      { id:'cases', label:'Tickets', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', href:'pages/cases.html', badge:4 },
      { id:'calendar', label:'Calendrier', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>', href:'pages/calendar.html' },
    ]}
  ];

  function init(activeId) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    // Determine base path (are we in /pages/ or root?)
    const inPages = window.location.pathname.includes('/pages/');
    const prefix = inPages ? '../' : '';

    sidebar.innerHTML = menuItems.map(section => `
      <div class="sidebar-section">
        <div class="sidebar-label">${section.section}</div>
        ${section.items.map(item => `
          <a href="${prefix}${item.href}" class="sidebar-item ${item.id === activeId ? 'active' : ''}">
            ${item.icon}
            ${item.label}
            ${item.badge ? `<span class="sidebar-badge">${item.badge}</span>` : ''}
          </a>
        `).join('')}
      </div>
    `).join('');
  }

  return { init };
})();
