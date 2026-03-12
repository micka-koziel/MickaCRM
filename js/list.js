/* ═══════════════════════════════════════════════════════════
   MickaCRM — list.js (List/Table View)
   ═══════════════════════════════════════════════════════════ */

function renderListView(items, columns) {
  const content = document.getElementById('page-content');

  const headHtml = columns.map(c => `<th>${c.label}</th>`).join('');

  const bodyHtml = items.map(item => {
    const cells = columns.map(c => {
      const val = c.render ? c.render(item) : (item[c.key] || '');
      const cls = c.key === 'name' ? ' class="primary"' : '';
      return `<td${cls}>${val}</td>`;
    }).join('');
    return `<tr data-id="${item.id}">${cells}</tr>`;
  }).join('');

  content.innerHTML = `
    <div class="list-wrap">
      <div class="list-table-container">
        <table class="list-table">
          <thead><tr>${headHtml}</tr></thead>
          <tbody>${bodyHtml}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderPlaceholderView(label) {
  const content = document.getElementById('page-content');
  content.innerHTML = `
    <div class="placeholder-view">
      ${navIcon('chart', 18, 'var(--text-light)')}
      ${label} view — coming soon
    </div>
  `;
}
