/* ============================================
   MickaCRM — dashboard.js
   Dashboard page logic
   ============================================ */

MickaCRM.dashboard = (() => {
  const { fmt, fmtDate, badge } = MickaCRM.ui;
  const D = MickaCRM.data;

  function init() {
    renderKpis();
    renderOpps();
    renderCases();
    renderProjects();
    renderInvoices();
  }

  function renderKpis() {
    const totalPipeline = D.opportunities.reduce((s, o) => s + o.amount, 0);
    const wonRevenue = D.opportunities.filter(o => o.stage === 'Gagné').reduce((s, o) => s + o.amount, 0);
    const invoiceDue = D.invoices.filter(i => i.status !== 'Payée').reduce((s, i) => s + i.amount, 0);
    const openCases = D.cases.filter(c => c.status !== 'Résolu').length;

    document.getElementById('dashKpis').innerHTML = `
      <div class="kpi-card blue fade-in fade-in-delay-1"><div class="kpi-label">Pipeline Total</div><div class="kpi-value">${fmt(totalPipeline)}</div><div class="kpi-sub">${D.opportunities.length} opportunités</div></div>
      <div class="kpi-card teal fade-in fade-in-delay-2"><div class="kpi-label">Affaires Gagnées</div><div class="kpi-value">${fmt(wonRevenue)}</div><div class="kpi-sub">${D.opportunities.filter(o => o.stage === 'Gagné').length} contrats signés</div></div>
      <div class="kpi-card orange fade-in fade-in-delay-3"><div class="kpi-label">Factures en cours</div><div class="kpi-value">${fmt(invoiceDue)}</div><div class="kpi-sub">${D.invoices.filter(i => i.status !== 'Payée').length} factures ouvertes</div></div>
      <div class="kpi-card red fade-in fade-in-delay-4"><div class="kpi-label">Tickets ouverts</div><div class="kpi-value">${openCases}</div><div class="kpi-sub">${D.cases.filter(c => c.priority === 'Critique').length} critique(s)</div></div>
    `;
  }

  function renderOpps() {
    MickaCRM.ui.renderTable('dashOpps', D.opportunities.slice(0, 5), [
      { render: o => `<span style="font-weight:600">${o.name.length > 35 ? o.name.substring(0, 35) + '…' : o.name}</span>` },
      { render: o => `<span style="font-family:Outfit;font-weight:600">${fmt(o.amount)}</span>` },
      { render: o => badge(o.stage) },
    ], o => `window.location.href='pages/opportunities.html'`);
  }

  function renderCases() {
    MickaCRM.ui.renderTable('dashCases', D.cases, [
      { render: c => `<span style="font-weight:500">${c.subject.length > 40 ? c.subject.substring(0, 40) + '…' : c.subject}</span>` },
      { render: c => badge(c.priority) },
      { render: c => badge(c.status) },
    ], c => `window.location.href='pages/cases.html'`);
  }

  function renderProjects() {
    MickaCRM.ui.renderTable('dashProjects', D.projects, [
      { render: p => `<span style="font-weight:600">${p.name}</span>` },
      { key: 'account' },
      { render: p => `<div style="display:flex;align-items:center;gap:8px"><div class="progress-bar" style="flex:1"><div class="progress-bar-fill" style="width:${p.progress}%"></div></div><span style="font-size:12px;font-weight:600">${p.progress}%</span></div>` },
    ], p => `window.location.href='pages/projects.html'`);
  }

  function renderInvoices() {
    MickaCRM.ui.renderTable('dashInvoices', D.invoices.filter(i => i.status !== 'Payée'), [
      { render: i => `<span style="font-weight:600;color:var(--blue-imperial)">${i.number}</span>` },
      { key: 'account' },
      { render: i => `<span style="font-family:Outfit;font-weight:600">${fmt(i.amount)}</span>` },
      { render: i => badge(i.status) },
    ], i => `window.location.href='pages/invoices.html'`);
  }

  return { init };
})();
