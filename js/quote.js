/* ============================================================
   MickaCRM – Quote 360 Record Page
   js/quote.js
   
   Renders the full Quote record detail page ("Quote Business Cockpit").
   CSS injected via injectQ360Styles(), all classes prefixed q360-.
   Uses: svgIcon(), navigate(), fmtAmount(), fmtDate() from other modules.
   ============================================================ */

// ── CSS Injection ──────────────────────────────────────────────
function injectQ360Styles() {
  if (document.getElementById('q360-styles')) return;
  const style = document.createElement('style');
  style.id = 'q360-styles';
  style.textContent = `
    /* ── Layout ── */
    .q360-wrapper { padding: 20px 24px; max-width: 1200px; margin: 0 auto; }

    /* ── Back nav ── */
    .q360-back { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 500; color: #64748b; cursor: pointer; padding: 4px 0; margin-bottom: 10px; transition: color 0.12s; }
    .q360-back:hover { color: #2563eb; }

    /* ── Card ── */
    .q360-card {
      background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;
      padding: 20px; margin-bottom: 0;
    }
    .q360-card-title {
      font-size: 11px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 14px;
    }

    /* ── Buttons ── */
    .q360-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 14px; border-radius: 8px; font-size: 12.5px;
      font-weight: 500; cursor: pointer; border: none;
      transition: all 0.15s ease; font-family: inherit;
    }
    .q360-btn-primary { background: #2563eb; color: #fff; }
    .q360-btn-primary:hover { background: #1d4ed8; }
    .q360-btn-outline { background: #fff; color: #475569; border: 1px solid #e2e8f0; }
    .q360-btn-outline:hover { background: #f8fafc; border-color: #cbd5e1; }

    /* ── Badge ── */
    .q360-badge {
      display: inline-flex; align-items: center;
      padding: 3px 10px; border-radius: 20px;
      font-size: 11px; font-weight: 600;
    }

    /* ── Link ── */
    .q360-link { color: #2563eb; cursor: pointer; text-decoration: none; font-weight: 500; }
    .q360-link:hover { text-decoration: underline; }

    /* ── Divider ── */
    .q360-divider { height: 1px; background: #f1f5f9; margin: 14px 0; }

    /* ── KPI ── */
    .q360-kpi-label {
      font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.4px;
      color: #94a3b8; font-weight: 600; margin-bottom: 4px;
    }
    .q360-kpi-value { font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1.1; }
    .q360-kpi-sub { font-size: 11px; font-weight: 600; margin-top: 2px; }

    /* ── KPI Row ── */
    .q360-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
    .q360-kpi-card { display: flex; align-items: flex-start; gap: 12px; padding: 16px; }
    .q360-kpi-icon {
      width: 36px; height: 36px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }

    /* ── Header ── */
    .q360-header { margin-bottom: 16px; padding: 18px 24px; }
    .q360-header-inner { display: flex; align-items: flex-start; justify-content: space-between; gap: 24; }
    .q360-header-left { display: flex; gap: 16px; align-items: center; }
    .q360-header-avatar {
      width: 56px; height: 56px; border-radius: 14px;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .q360-header-title { font-size: 17px; font-weight: 700; color: #0f172a; line-height: 1.3; }
    .q360-header-meta { font-size: 13px; color: #64748b; margin-top: 3px; display: flex; align-items: center; gap: 12px; }
    .q360-header-meta-item { display: inline-flex; align-items: center; gap: 4px; }
    .q360-header-meta-sep { color: #cbd5e1; }
    .q360-header-sub { font-size: 12px; color: #94a3b8; margin-top: 4px; }
    .q360-header-right { display: flex; align-items: center; gap: 24px; flex-shrink: 0; }
    .q360-header-value { font-size: 22px; font-weight: 700; color: #0f172a; text-align: right; }
    .q360-header-status { display: flex; gap: 8px; margin-top: 5px; justify-content: flex-end; align-items: center; }
    .q360-header-validity { font-size: 11.5px; font-weight: 600; }
    .q360-header-sep { width: 1px; height: 40px; background: #f1f5f9; }
    .q360-header-actions { display: flex; gap: 8px; }

    /* ── Lifecycle ── */
    .q360-lifecycle { margin-bottom: 16px; padding: 16px 24px; }
    .q360-lifecycle-track { display: flex; align-items: center; }
    .q360-lifecycle-stage { display: flex; align-items: center; }
    .q360-lifecycle-stage-grow { flex: 1; }
    .q360-lifecycle-dot {
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s ease;
    }
    .q360-lifecycle-dot-past { background: #2563eb; }
    .q360-lifecycle-dot-current { background: #2563eb; border: 3px solid #bfdbfe; }
    .q360-lifecycle-dot-future { background: #f1f5f9; border: 2px solid #e2e8f0; }
    .q360-lifecycle-dot-inner-current { width: 8px; height: 8px; border-radius: 50%; background: #fff; }
    .q360-lifecycle-dot-inner-future { width: 6px; height: 6px; border-radius: 50%; background: #cbd5e1; }
    .q360-lifecycle-label { font-size: 12px; margin-left: 8px; }
    .q360-lifecycle-label-past { font-weight: 500; color: #0f172a; }
    .q360-lifecycle-label-current { font-weight: 700; color: #2563eb; }
    .q360-lifecycle-label-future { font-weight: 500; color: #94a3b8; }
    .q360-lifecycle-line {
      flex: 1; height: 2px; margin: 0 12px; border-radius: 1px;
    }
    .q360-lifecycle-line-done { background: #2563eb; }
    .q360-lifecycle-line-todo { background: #e2e8f0; }

    /* ── Two-Column Grid ── */
    .q360-grid { display: grid; grid-template-columns: 7fr 5fr; gap: 16px; }
    .q360-col { display: flex; flex-direction: column; gap: 16px; }

    /* ── Summary Fields ── */
    .q360-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .q360-field { padding: 8px 0; border-bottom: 1px solid #f8f9fb; }
    .q360-field-label {
      font-size: 10.5px; color: #94a3b8; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.3px;
    }
    .q360-field-value { font-size: 13px; color: #1e293b; font-weight: 500; margin-top: 2px; }

    /* ── Table ── */
    .q360-table { width: 100%; border-collapse: collapse; }
    .q360-table th {
      font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.4px;
      color: #94a3b8; font-weight: 600; padding: 8px 12px;
      text-align: left; border-bottom: 1px solid #f1f5f9;
    }
    .q360-table td {
      font-size: 13px; padding: 10px 12px;
      border-bottom: 1px solid #f8f9fb; color: #334155;
    }
    .q360-table tr:last-child td { border-bottom: none; }
    .q360-table tr:hover td { background: #fafbfc; }
    .q360-table .q360-right { text-align: right; }
    .q360-table .q360-bold { font-weight: 600; }

    /* ── Pricing Footer ── */
    .q360-pricing-footer { display: flex; justify-content: flex-end; gap: 32px; }
    .q360-pricing-col { text-align: right; }
    .q360-pricing-label { font-size: 11px; font-weight: 600; }
    .q360-pricing-val { font-size: 14px; font-weight: 600; color: #334155; }
    .q360-pricing-net { font-size: 18px; font-weight: 700; color: #2563eb; }

    /* ── Revision Row ── */
    .q360-rev-row {
      display: flex; align-items: center; gap: 14px; padding: 12px 0;
    }
    .q360-rev-row + .q360-rev-row { border-top: 1px solid #f8f9fb; }
    .q360-rev-icon {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .q360-rev-body { flex: 1; min-width: 0; }
    .q360-rev-head { display: flex; align-items: center; gap: 8px; }
    .q360-rev-name { font-size: 13px; font-weight: 600; color: #1e293b; }
    .q360-rev-note { font-size: 12px; color: #94a3b8; margin-top: 2px; }
    .q360-rev-metrics { text-align: right; flex-shrink: 0; }
    .q360-rev-val { font-size: 13px; font-weight: 600; color: #334155; }
    .q360-rev-date { font-size: 11px; color: #94a3b8; }

    /* ── Negotiation ── */
    .q360-nego { border-left: 3px solid #2563eb; }
    .q360-nego-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
    .q360-nego-icon {
      width: 40px; height: 40px; border-radius: 10px; background: #dbeafe;
      display: flex; align-items: center; justify-content: center;
    }
    .q360-nego-title { font-size: 15px; font-weight: 700; color: #0f172a; }
    .q360-nego-sub { font-size: 12px; color: #64748b; }
    .q360-nego-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .q360-nego-cell { background: #f8fafc; border-radius: 8px; padding: 10px; }
    .q360-nego-cell-label { font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
    .q360-nego-cell-value { font-size: 18px; font-weight: 700; margin-top: 2px; }

    /* ── Next Action ── */
    .q360-next-action {
      background: linear-gradient(135deg, #eff6ff, #f0fdf4);
      border-color: #bfdbfe;
    }
    .q360-next-action .q360-card-title { color: #2563eb; }
    .q360-next-body { display: flex; align-items: flex-start; gap: 10px; }
    .q360-next-icon {
      width: 32px; height: 32px; border-radius: 8px; background: #2563eb;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .q360-next-title { font-size: 13.5px; font-weight: 600; color: #0f172a; }
    .q360-next-desc { font-size: 12px; color: #475569; margin-top: 3px; line-height: 1.5; }

    /* ── Activity Timeline ── */
    .q360-timeline { position: relative; }
    .q360-timeline-line {
      position: absolute; left: 15px; top: 16px; bottom: 16px;
      width: 2px; background: #f1f5f9;
    }
    .q360-timeline-item { display: flex; gap: 14px; padding: 10px 0; position: relative; }
    .q360-timeline-dot {
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; z-index: 1;
    }
    .q360-timeline-body { flex: 1; min-width: 0; }
    .q360-timeline-head { display: flex; align-items: center; gap: 8px; }
    .q360-timeline-contact { font-size: 12.5px; font-weight: 500; color: #1e293b; margin-top: 3px; }
    .q360-timeline-desc { font-size: 12px; color: #64748b; margin-top: 1px; line-height: 1.45; }

    /* ── Documents ── */
    .q360-doc-row {
      display: flex; align-items: center; gap: 12px; padding: 10px 0;
    }
    .q360-doc-row + .q360-doc-row { border-top: 1px solid #f8f9fb; }
    .q360-doc-icon {
      width: 32px; height: 32px; border-radius: 8px; background: #fef2f2;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .q360-doc-body { flex: 1; min-width: 0; }
    .q360-doc-name {
      font-size: 12.5px; font-weight: 500; color: #1e293b;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .q360-doc-meta { font-size: 11px; color: #94a3b8; }
    .q360-doc-date { font-size: 11px; color: #94a3b8; flex-shrink: 0; }

    /* ── Summary Text ── */
    .q360-desc { font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 14px; }

    /* ── Responsive ── */
    @media(max-width:1100px) {
      .q360-grid { grid-template-columns: 1fr; }
      .q360-kpi-row { grid-template-columns: repeat(2, 1fr); }
      .q360-header-inner { flex-direction: column; gap: 14px; }
      .q360-header-right { align-items: flex-start; flex-direction: row; gap: 16px; }
    }
    @media(max-width:768px) {
      .q360-wrapper { padding: 12px 14px; }
      .q360-header { padding: 14px 16px; }
      .q360-lifecycle { padding: 12px 16px; }
      .q360-fields { grid-template-columns: 1fr; }
      .q360-nego-grid { grid-template-columns: 1fr; }
      .q360-lifecycle-label { font-size: 10px; margin-left: 4px; }
      .q360-lifecycle-line { margin: 0 6px; }
    }
    @media(max-width:640px) {
      .q360-wrapper { padding: 10px 10px; }
      .q360-kpi-row { grid-template-columns: 1fr 1fr; gap: 8px; }
      .q360-header-title { font-size: 15px; }
      .q360-header-value { font-size: 18px; }
      .q360-header-avatar { width: 44px; height: 44px; }
      .q360-table { font-size: 11px; }
      .q360-table th, .q360-table td { padding: 6px 8px; }
      .q360-pricing-footer { flex-direction: column; gap: 10px; }
      .q360-pricing-col { text-align: left; }
      .q360-lifecycle-track { flex-wrap: wrap; gap: 6px; }
      .q360-lifecycle-line { display: none; }
      .q360-lifecycle-stage { margin-bottom: 4px; }
      .q360-btn { padding: 6px 10px; font-size: 11.5px; }
    }
  `;
  document.head.appendChild(style);
}


// ── Activity helpers ───────────────────────────────────────────
const Q360_ACT_ICONS = { Call: 'phone', Meeting: 'users', Email: 'mail', 'Site Visit': 'map-pin' };
const Q360_ACT_COLORS = { Call: '#2563eb', Meeting: '#7c3aed', Email: '#059669', 'Site Visit': '#d97706' };

const QUOTE_STAGES = ['Draft', 'Internal Review', 'Sent', 'Negotiation', 'Accepted'];


// ── Helpers (fall back to local if pipeline.js not loaded) ─────
function q360fmtAmount(v) {
  if (typeof fmtAmount === 'function') return fmtAmount(v);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
}
function q360fmtDate(d) {
  if (typeof fmtDate === 'function') return fmtDate(d);
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function q360daysUntil(d) {
  return Math.ceil((new Date(d) - new Date()) / 86400000);
}
function q360icon(name, size, color, sw) {
  if (typeof svgIcon === 'function') return svgIcon(name, size, color, sw);
  if (typeof renderIcon === 'function') return renderIcon(name, size, color, sw);
  return '';
}


// ── Main Render ────────────────────────────────────────────────
function renderQuote360(rec) {
  injectQ360Styles();

  const q = rec;
  const currentIdx = QUOTE_STAGES.indexOf(q.stage || 'Draft');
  const validity = q.validUntil ? q360daysUntil(q.validUntil) : 0;
  const validityColor = validity > 15 ? '#059669' : validity > 0 ? '#d97706' : '#dc2626';
  const validityText = validity > 0 ? validity + 'd remaining' : 'Expired';

  // Line items (from rec or empty)
  const lineItems = q.lineItems || [];
  const subtotal = q.value || lineItems.reduce(function(s, li) { return s + (li.total || 0); }, 0);
  const discount = q.discount || 0;
  const netValue = q.netValue || Math.round(subtotal * (1 - discount / 100));

  // Revisions
  const revisions = q.revisions || [];

  // Activities
  const activities = q.activities || [];

  // Documents
  const documents = q.documents || [];

  // Account / Opportunity names
  const accountName = q.accountName || (typeof getAccountName === 'function' ? getAccountName(q.accountId) : q.accountId || '—');
  const oppName = q.opportunityName || q.opportunity || '—';

  // ── Build HTML ──
  let html = '<div class="q360-wrapper">';

  // Back nav
  html += '<div class="q360-back" id="q360-back">' + q360icon('arrowLeft', 14, '#64748b') + '<span>Quotes</span></div>';

  // ============ HEADER ============
  html += '<div class="q360-card q360-header">';
  html += '<div class="q360-header-inner">';

  // Left
  html += '<div class="q360-header-left">';
  html += '<div class="q360-header-avatar">' + q360icon('file-text', 26, '#fff', 1.6) + '</div>';
  html += '<div>';
  html += '<div class="q360-header-title">' + esc(q.name || q.Name || 'Untitled Quote') + '</div>';
  html += '<div class="q360-header-meta">';
  html += '<span class="q360-header-meta-item">' + q360icon('target', 13, '#64748b') + ' <span class="q360-link" data-nav="opportunity" data-id="' + esc(q.opportunityId || '') + '">' + esc(oppName) + '</span></span>';
  html += '<span class="q360-header-meta-sep">|</span>';
  html += '<span class="q360-header-meta-item">' + q360icon('building', 13, '#64748b') + ' <span class="q360-link" data-nav="account" data-id="' + esc(q.accountId || '') + '">' + esc(accountName) + '</span></span>';
  html += '</div>';
  html += '<div class="q360-header-sub">' + esc(q.id || '') + ' &middot; Created ' + q360fmtDate(q.createdDate || q.CreatedDate || new Date()) + (q.createdBy ? ' by ' + esc(q.createdBy) : '') + '</div>';
  html += '</div>';
  html += '</div>';

  // Right
  html += '<div class="q360-header-right">';
  html += '<div>';
  html += '<div class="q360-header-value">' + q360fmtAmount(subtotal) + '</div>';
  html += '<div class="q360-header-status">';
  html += '<span class="q360-badge" style="background:#dbeafe;color:#1d4ed8;">' + esc(q.stage || 'Draft') + '</span>';
  html += '<span class="q360-header-validity" style="color:' + validityColor + ';">' + validityText + '</span>';
  html += '</div>';
  html += '</div>';
  html += '<div class="q360-header-sep"></div>';
  html += '<div class="q360-header-actions">';
  html += '<button class="q360-btn q360-btn-primary crm-edit-btn" data-obj="quotes" data-rec="' + rec.id + '">' + q360icon('edit', 14, '#fff') + ' Edit</button>';
  html += '<button class="q360-btn q360-btn-outline" data-action="send">' + q360icon('send', 14, '#475569') + ' Send</button>';
  html += '<button class="q360-btn q360-btn-outline" data-action="revise">' + q360icon('copy', 14, '#475569') + ' Revise</button>';
  html += '<button class="q360-btn q360-btn-outline" data-action="pdf">' + q360icon('download', 14, '#475569') + ' PDF</button>';
  html += '<button class="q360-btn q360-btn-outline crm-delete-btn" data-obj="quotes" data-rec="' + rec.id + '" style="color:#ef4444;border-color:#fecaca">' + q360icon('trash', 14, '#ef4444') + ' Delete</button>';
  html += '</div>';
  html += '</div>';

  html += '</div>'; // header-inner
  html += '</div>'; // header

  // ============ LIFECYCLE ============
  html += '<div class="q360-card q360-lifecycle">';
  html += '<div class="q360-lifecycle-track">';
  QUOTE_STAGES.forEach(function(stage, i) {
    var isCurrent = i === currentIdx;
    var isPast = i < currentIdx;
    var isLast = i === QUOTE_STAGES.length - 1;

    html += '<div class="q360-lifecycle-stage' + (isLast ? '' : ' q360-lifecycle-stage-grow') + '">';
    html += '<div class="q360-lifecycle-dot ' + (isCurrent ? 'q360-lifecycle-dot-current' : isPast ? 'q360-lifecycle-dot-past' : 'q360-lifecycle-dot-future') + '">';
    if (isPast) {
      html += q360icon('check', 14, '#fff', 2.5);
    } else if (isCurrent) {
      html += '<div class="q360-lifecycle-dot-inner-current"></div>';
    } else {
      html += '<div class="q360-lifecycle-dot-inner-future"></div>';
    }
    html += '</div>';
    html += '<span class="q360-lifecycle-label ' + (isCurrent ? 'q360-lifecycle-label-current' : isPast ? 'q360-lifecycle-label-past' : 'q360-lifecycle-label-future') + '">' + stage + '</span>';

    if (!isLast) {
      html += '<div class="q360-lifecycle-line ' + (isPast ? 'q360-lifecycle-line-done' : 'q360-lifecycle-line-todo') + '"></div>';
    }
    html += '</div>';
  });
  html += '</div>'; // track
  html += '</div>'; // lifecycle

  // ============ KPI ROW ============
  var kpis = [
    { label: 'Quote Value', value: q360fmtAmount(subtotal), sub: 'Net: ' + q360fmtAmount(netValue), accent: '#2563eb', icon: 'dollar-sign' },
    { label: 'Discount', value: discount + '%', sub: 'Saved ' + q360fmtAmount(subtotal - netValue), accent: '#d97706', icon: 'trending-up' },
    { label: 'Revision', value: 'v' + (q.revision || 1), sub: (revisions.length || 1) + ' total', accent: '#7c3aed', icon: 'refresh-cw' },
    { label: 'Valid Until', value: q.validUntil ? q360fmtDate(q.validUntil) : '—', sub: validityText, accent: validityColor, icon: 'calendar' }
  ];

  html += '<div class="q360-kpi-row">';
  kpis.forEach(function(kpi) {
    html += '<div class="q360-card q360-kpi-card">';
    html += '<div class="q360-kpi-icon" style="background:' + kpi.accent + '12;">' + q360icon(kpi.icon, 18, kpi.accent) + '</div>';
    html += '<div>';
    html += '<div class="q360-kpi-label">' + kpi.label + '</div>';
    html += '<div class="q360-kpi-value">' + kpi.value + '</div>';
    html += '<div class="q360-kpi-sub" style="color:' + kpi.accent + ';">' + kpi.sub + '</div>';
    html += '</div>';
    html += '</div>';
  });
  html += '</div>';

  // ============ TWO-COLUMN GRID ============
  html += '<div class="q360-grid">';

  // ──── LEFT COLUMN ────
  html += '<div class="q360-col">';

  // -- Quote Summary --
  html += '<div class="q360-card">';
  html += '<div class="q360-card-title">Quote Summary</div>';
  if (q.description) {
    html += '<p class="q360-desc">' + esc(q.description) + '</p>';
  }
  var fields = [
    { l: 'Contact', v: q.contact || '—' },
    { l: 'Role', v: q.contactRole || '—' },
    { l: 'Payment Terms', v: q.paymentTerms || '—' },
    { l: 'Delivery Terms', v: q.deliveryTerms || '—' },
    { l: 'Margin', v: (q.margin || 0) + '%' },
    { l: 'Last Modified', v: q.lastModified ? q360fmtDate(q.lastModified) : '—' }
  ];
  html += '<div class="q360-fields">';
  fields.forEach(function(f) {
    html += '<div class="q360-field">';
    html += '<div class="q360-field-label">' + f.l + '</div>';
    html += '<div class="q360-field-value">' + esc(f.v) + '</div>';
    html += '</div>';
  });
  html += '</div>'; // fields
  html += '</div>'; // card

  // -- Pricing Overview --
  if (lineItems.length > 0) {
    html += '<div class="q360-card">';
    html += '<div class="q360-card-title">Pricing Overview</div>';
    html += '<table class="q360-table">';
    html += '<thead><tr><th>Product</th><th class="q360-right">Qty</th><th class="q360-right">Unit Price</th><th class="q360-right">Total</th></tr></thead>';
    html += '<tbody>';
    lineItems.forEach(function(li) {
      html += '<tr>';
      html += '<td class="q360-bold">' + esc(li.product || li.name || '') + '</td>';
      html += '<td class="q360-right">' + (li.qty || li.quantity || 0) + ' ' + esc(li.unit || '') + '</td>';
      html += '<td class="q360-right">' + q360fmtAmount(li.unitPrice || 0) + '</td>';
      html += '<td class="q360-right q360-bold">' + q360fmtAmount(li.total || 0) + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    html += '<div class="q360-divider"></div>';
    html += '<div class="q360-pricing-footer">';
    html += '<div class="q360-pricing-col"><div class="q360-pricing-label" style="color:#94a3b8;">SUBTOTAL</div><div class="q360-pricing-val">' + q360fmtAmount(subtotal) + '</div></div>';
    if (discount > 0) {
      html += '<div class="q360-pricing-col"><div class="q360-pricing-label" style="color:#d97706;">DISCOUNT (' + discount + '%)</div><div class="q360-pricing-val" style="color:#d97706;">-' + q360fmtAmount(subtotal - netValue) + '</div></div>';
    }
    html += '<div class="q360-pricing-col"><div class="q360-pricing-label" style="color:#2563eb;">NET TOTAL</div><div class="q360-pricing-net">' + q360fmtAmount(netValue) + '</div></div>';
    html += '</div>'; // pricing-footer
    html += '</div>'; // card
  }

  // -- Revision History --
  if (revisions.length > 0) {
    html += '<div class="q360-card">';
    html += '<div class="q360-card-title">Revision History</div>';
    revisions.forEach(function(rev) {
      var isCurrent = (rev.status === 'Current');
      html += '<div class="q360-rev-row">';
      html += '<div class="q360-rev-icon" style="background:' + (isCurrent ? '#dbeafe' : '#f8f9fb') + ';">' + q360icon(isCurrent ? 'check-circle' : 'file', 16, isCurrent ? '#2563eb' : '#94a3b8') + '</div>';
      html += '<div class="q360-rev-body">';
      html += '<div class="q360-rev-head">';
      html += '<span class="q360-rev-name">' + esc(rev.name) + '</span>';
      html += '<span class="q360-badge" style="background:' + (isCurrent ? '#dbeafe' : '#f1f5f9') + ';color:' + (isCurrent ? '#1d4ed8' : '#64748b') + ';font-size:10px;">' + esc(rev.status) + '</span>';
      html += '</div>';
      if (rev.note) html += '<div class="q360-rev-note">' + esc(rev.note) + '</div>';
      html += '</div>';
      html += '<div class="q360-rev-metrics">';
      html += '<div class="q360-rev-val">' + q360fmtAmount(rev.value || 0) + '</div>';
      html += '<div class="q360-rev-date">' + q360fmtDate(rev.date) + '</div>';
      html += '</div>';
      html += '</div>'; // rev-row
    });
    html += '</div>'; // card
  }

  html += '</div>'; // left col

  // ──── RIGHT COLUMN ────
  html += '<div class="q360-col">';

  // -- Negotiation Status --
  html += '<div class="q360-card q360-nego">';
  html += '<div class="q360-card-title">Negotiation Status</div>';
  html += '<div class="q360-nego-header">';
  html += '<div class="q360-nego-icon">' + q360icon('zap', 20, '#2563eb') + '</div>';
  html += '<div>';
  html += '<div class="q360-nego-title">' + esc(q.stage === 'Accepted' ? 'Quote Accepted' : q.stage === 'Sent' ? 'Quote Sent' : q.stage === 'Negotiation' ? 'In Negotiation' : q.stage || 'Draft') + '</div>';
  html += '<div class="q360-nego-sub">' + (q.negoNote || 'Awaiting client response since ' + (q.lastModified ? q360fmtDate(q.lastModified) : '—')) + '</div>';
  html += '</div>';
  html += '</div>';
  html += '<div class="q360-nego-grid">';
  html += '<div class="q360-nego-cell"><div class="q360-nego-cell-label">Win Probability</div><div class="q360-nego-cell-value" style="color:#059669;">' + (q.winProb || '—') + '</div></div>';
  html += '<div class="q360-nego-cell"><div class="q360-nego-cell-label">Competitors</div><div class="q360-nego-cell-value" style="color:#dc2626;">' + (q.competitors || '—') + '</div></div>';
  html += '</div>';
  html += '</div>'; // nego card

  // -- Next Recommended Action --
  html += '<div class="q360-card q360-next-action">';
  html += '<div class="q360-card-title">Next Recommended Action</div>';
  html += '<div class="q360-next-body">';
  html += '<div class="q360-next-icon">' + q360icon('phone', 16, '#fff') + '</div>';
  html += '<div>';
  html += '<div class="q360-next-title">' + esc(q.nextAction || 'Follow up with ' + (q.contact || 'client')) + '</div>';
  html += '<div class="q360-next-desc">' + esc(q.nextActionDesc || 'Schedule a follow-up call to discuss pricing and address any open questions before the quote expires.') + '</div>';
  html += '<button class="q360-btn q360-btn-primary" style="margin-top:10px;font-size:12px;" data-action="schedule-call">' + q360icon('phone', 13, '#fff') + ' Schedule Call</button>';
  html += '</div>';
  html += '</div>';
  html += '</div>'; // next-action

  // -- Activity Timeline --
  if (activities.length > 0) {
    html += '<div class="q360-card">';
    html += '<div class="q360-card-title">Activity Timeline</div>';
    html += '<div class="q360-timeline">';
    html += '<div class="q360-timeline-line"></div>';
    activities.forEach(function(act) {
      var actColor = Q360_ACT_COLORS[act.type] || '#64748b';
      var actIcon = Q360_ACT_ICONS[act.type] || 'clock';
      html += '<div class="q360-timeline-item">';
      html += '<div class="q360-timeline-dot" style="background:' + actColor + '14;">' + q360icon(actIcon, 15, actColor) + '</div>';
      html += '<div class="q360-timeline-body">';
      html += '<div class="q360-timeline-head">';
      html += '<span class="q360-badge" style="background:' + actColor + '14;color:' + actColor + ';font-size:10px;">' + esc(act.type) + '</span>';
      html += '<span style="font-size:11px;color:#94a3b8;">' + q360fmtDate(act.date) + '</span>';
      html += '</div>';
      html += '<div class="q360-timeline-contact">' + esc(act.contact || '') + '</div>';
      html += '<div class="q360-timeline-desc">' + esc(act.desc || act.description || '') + '</div>';
      html += '</div>';
      html += '</div>';
    });
    html += '</div>'; // timeline
    html += '</div>'; // card
  }

  // -- Documents --
  if (documents.length > 0) {
    html += '<div class="q360-card">';
    html += '<div class="q360-card-title">Documents</div>';
    documents.forEach(function(doc) {
      html += '<div class="q360-doc-row">';
      html += '<div class="q360-doc-icon">' + q360icon('file-text', 16, '#dc2626') + '</div>';
      html += '<div class="q360-doc-body">';
      html += '<div class="q360-doc-name">' + esc(doc.name) + '</div>';
      html += '<div class="q360-doc-meta">' + esc(doc.type || '') + (doc.size ? ' &middot; ' + esc(doc.size) : '') + '</div>';
      html += '</div>';
      html += '<div class="q360-doc-date">' + q360fmtDate(doc.date) + '</div>';
      html += '</div>';
    });
    html += '</div>'; // card
  }

  html += '</div>'; // right col
  html += '</div>'; // grid
  html += '</div>'; // wrapper

  return html;
}


// ── Event Delegation (for navigate links & action buttons) ─────
function bindQuote360Events(container) {
  if (!container) return;

  // Back button
  var backBtn = document.getElementById('q360-back');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      if (typeof navigate === 'function') navigate('quotes');
    });
  }

  container.addEventListener('click', function(e) {
    var el = e.target.nodeType === 3 ? e.target.parentElement : e.target;

    // Navigate links (Account, Opportunity)
    var link = el.closest('[data-nav]');
    if (link) {
      var page = link.getAttribute('data-nav');
      var id = link.getAttribute('data-id');
      if (typeof navigate === 'function' && page && id) {
        navigate(page, null, id);
      }
      return;
    }

    // Action buttons
    var btn = el.closest('[data-action]');
    if (btn) {
      var action = btn.getAttribute('data-action');
      console.log('[Quote360] Action:', action);
      // TODO: wire to modals / Firebase
    }
  });

  if (typeof bindCrmActionButtons === 'function') bindCrmActionButtons(container);
}


// ── Escape helper ──────────────────────────────────────────────
function esc(str) {
  if (!str) return '';
  var d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str)));
  return d.innerHTML;
}


// ── Public API ─────────────────────────────────────────────────
// Called from record.js or nav.js:
//   document.getElementById('main').innerHTML = renderQuote360(recObj);
//   bindQuote360Events(document.getElementById('main'));
window.renderQuote360 = renderQuote360;
window.bindQuote360Events = bindQuote360Events;
