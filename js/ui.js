/* ============================================
   MickaCRM — ui.js
   Shared UI utilities: toasts, modals, badges,
   formatters, helpers
   ============================================ */

MickaCRM.ui = (() => {

  // ---- FORMATTERS ----
  function fmt(n) {
    return new Intl.NumberFormat('fr-FR', { style:'currency', currency:'EUR', maximumFractionDigits:0 }).format(n);
  }

  function fmtDate(d) {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('fr-FR');
  }

  function initials(str) {
    return str.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }

  // ---- GRADIENTS ----
  const gradients = [
    'linear-gradient(135deg,#0F5299,#0195D6)',
    'linear-gradient(135deg,#4DB1B3,#0195D6)',
    'linear-gradient(135deg,#E66407,#f59e0b)',
    'linear-gradient(135deg,#C5284C,#E83430)',
    'linear-gradient(135deg,#0195D6,#4DB1B3)',
  ];

  function getGrad(i) {
    return gradients[i % gradients.length];
  }

  // ---- STATUS BADGE ----
  const badgeMap = {
    'Active':'badge-green', 'Inactive':'badge-gray',
    'Nouveau':'badge-blue', 'Contacté':'badge-orange', 'Qualifié':'badge-teal',
    'Prospection':'badge-gray', 'Qualification':'badge-blue', 'Proposition':'badge-orange',
    'Négociation':'badge-teal', 'Gagné':'badge-green', 'Perdu':'badge-red',
    'En cours':'badge-blue', 'Planifié':'badge-orange', 'Terminé':'badge-green',
    'Brouillon':'badge-gray', 'Envoyé':'badge-blue', 'Accepté':'badge-green', 'Refusé':'badge-red',
    'Confirmée':'badge-blue', 'En production':'badge-orange', 'En livraison':'badge-teal', 'Livrée':'badge-green',
    'En attente':'badge-orange', 'Payée':'badge-green', 'En retard':'badge-red',
    'Planifiée':'badge-orange', 'Terminée':'badge-gray',
    'Ouvert':'badge-orange', 'Résolu':'badge-green',
    'Critique':'badge-red', 'Haute':'badge-orange', 'Moyenne':'badge-blue', 'Basse':'badge-gray',
    'Client':'badge-green', 'Prospect':'badge-blue', 'Partenaire':'badge-teal', 'Fournisseur':'badge-orange',
  };

  function badge(status) {
    const cls = badgeMap[status] || 'badge-gray';
    return `<span class="badge ${cls}">${status}</span>`;
  }

  // ---- TOAST ----
  function showToast(msg, type = 'success') {
    const c = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  // ---- MODAL ----
  function openModal(title, bodyHTML, footerHTML) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = bodyHTML;
    document.getElementById('modalFooter').innerHTML = footerHTML || '';
    document.getElementById('modal').classList.add('show');
  }

  function closeModal() {
    document.getElementById('modal').classList.remove('show');
  }

  // ---- TABLE RENDERER ----
  function renderTable(containerId, items, columns, onRowClick) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = items.map((item, i) =>
      `<tr ${onRowClick ? `onclick="${onRowClick(item)}"` : ''}>${
        columns.map(c => `<td>${c.render ? c.render(item, i) : (item[c.key] || '-')}</td>`).join('')
      }</tr>`
    ).join('');
  }

  // ---- AVATAR ----
  function avatar(name, index, size = 32) {
    return `<div style="width:${size}px;height:${size}px;border-radius:${size > 40 ? '12px' : '50%'};background:${getGrad(index)};display:flex;align-items:center;justify-content:center;color:#fff;font-size:${Math.round(size*0.35)}px;font-weight:700;font-family:Outfit;flex-shrink:0">${initials(name)}</div>`;
  }

  // Close modal on overlay click
  document.addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
  });

  // Public API
  return { fmt, fmtDate, initials, getGrad, badge, showToast, openModal, closeModal, renderTable, avatar };
})();
