/* ═══════════════════════════════════════════════════════
   product-picker.js — E-shop Product Picker & Gallery
   MickaCRM v4 — vanilla JS
   
   Provides:
     openProductPicker(opts)    — modal multi-select picker
     renderProductGallery(container, items)  — e-shop gallery list view
     injectProductPickerStyles()
   ═══════════════════════════════════════════════════════ */

/* ── Category colors & placeholder images ── */
var PP_CAT_COLORS = {
  Glazing:'#3b82f6', Insulation:'#f59e0b', 'Mortars & Concrete':'#8b5cf6',
  Coatings:'#10b981', Structural:'#ef4444'
};

var PP_PLACEHOLDERS = {};
(function() {
  PP_PLACEHOLDERS['Glazing'] = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#dbeafe"/><rect x="40" y="30" width="120" height="140" rx="4" fill="#93c5fd" stroke="#3b82f6" stroke-width="2"/><rect x="55" y="45" width="40" height="50" rx="2" fill="#bfdbfe" stroke="#60a5fa"/><rect x="105" y="45" width="40" height="50" rx="2" fill="#bfdbfe" stroke="#60a5fa"/><rect x="55" y="105" width="40" height="50" rx="2" fill="#bfdbfe" stroke="#60a5fa"/><rect x="105" y="105" width="40" height="50" rx="2" fill="#bfdbfe" stroke="#60a5fa"/></svg>');
  PP_PLACEHOLDERS['Insulation'] = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#fef3c7"/><rect x="30" y="40" width="140" height="120" rx="6" fill="#fde68a"/><path d="M30 70h140M30 100h140M30 130h140" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="8 4"/><rect x="30" y="40" width="140" height="120" rx="6" fill="none" stroke="#f59e0b" stroke-width="2"/></svg>');
  PP_PLACEHOLDERS['Mortars & Concrete'] = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#ede9fe"/><rect x="50" y="50" width="100" height="110" rx="4" fill="#c4b5fd" stroke="#8b5cf6" stroke-width="2"/><ellipse cx="100" cy="50" rx="50" ry="15" fill="#c4b5fd" stroke="#8b5cf6" stroke-width="2"/><ellipse cx="100" cy="160" rx="50" ry="15" fill="#c4b5fd" stroke="#8b5cf6" stroke-width="2"/></svg>');
  PP_PLACEHOLDERS['Coatings'] = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#d1fae5"/><rect x="60" y="30" width="80" height="130" rx="10" fill="#6ee7b7" stroke="#10b981" stroke-width="2"/><rect x="70" y="60" width="60" height="40" rx="4" fill="#a7f3d0"/><circle cx="100" cy="80" r="12" fill="#34d399"/></svg>');
  PP_PLACEHOLDERS['Structural'] = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#fee2e2"/><path d="M60 160L100 40L140 160" fill="none" stroke="#ef4444" stroke-width="3"/><path d="M70 130h60" stroke="#ef4444" stroke-width="2"/><path d="M80 100h40" stroke="#ef4444" stroke-width="2"/><circle cx="100" cy="40" r="6" fill="#fca5a5" stroke="#ef4444" stroke-width="2"/></svg>');
})();

function _ppImg(p) {
  return p.photoURL || p.photo || PP_PLACEHOLDERS[p.category] || PP_PLACEHOLDERS['Glazing'];
}
function _ppCatColor(cat) {
  return PP_CAT_COLORS[cat] || '#94a3b8';
}
function _ppIcon(name, size, color) {
  if (typeof svgIcon === 'function') return svgIcon(name, size || 16, color || 'currentColor');
  return '';
}

/* ═══════════════════════════════════════════════════════
   PRODUCT CARD HTML (shared between Gallery & Picker)
   ═══════════════════════════════════════════════════════ */
function _ppCard(p, opts) {
  var selectable = opts && opts.selectable;
  var isSelected = opts && opts.selected;
  var cc = _ppCatColor(p.category);
  var img = _ppImg(p);
  var stockColor = (p.stockLevel > 5000) ? '#10b981' : (p.stockLevel > 1000) ? '#f59e0b' : '#ef4444';
  var borderStyle = isSelected ? '2px solid ' + cc : '1px solid #e8eaed';
  var shadow = isSelected ? '0 0 0 3px ' + cc + '20, 0 4px 20px rgba(0,0,0,.08)' : '0 1px 4px rgba(0,0,0,.04)';

  var h = '<div class="pp-card' + (isSelected ? ' pp-card--sel' : '') + '" data-product-id="' + p.id + '" style="border:' + borderStyle + ';box-shadow:' + shadow + '">';

  /* Checkbox */
  if (selectable) {
    h += '<div class="pp-card-check" style="background:' + (isSelected ? cc : 'rgba(255,255,255,.9)') + ';border:' + (isSelected ? 'none' : '2px solid #d1d5db') + '">';
    if (isSelected) h += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
    h += '</div>';
  }

  /* Image */
  h += '<div class="pp-card-img" style="background:' + cc + '08">';
  h += '<img src="' + img + '" alt="' + (p.name||'') + '" />';
  h += '<span class="pp-card-cat" style="background:' + cc + '18;color:' + cc + '">' + (p.category||'') + '</span>';
  h += '<span class="pp-card-stock" style="background:' + stockColor + ';box-shadow:0 0 0 2px #fff,0 0 6px ' + stockColor + '40"></span>';
  h += '</div>';

  /* Body */
  h += '<div class="pp-card-body">';
  h += '<div class="pp-card-name">' + (p.name||'') + '</div>';
  h += '<div class="pp-card-meta">' + (p.manufacturer||'') + ' · ' + (p.family||'') + '</div>';
  h += '<div class="pp-card-desc">' + (p.description||'').substring(0, 120) + (p.description && p.description.length > 120 ? '...' : '') + '</div>';
  h += '<div class="pp-card-price-row">';
  h += '<div class="pp-card-price"><span class="pp-card-price-val" style="color:' + cc + '">' + (p.unitPrice ? p.unitPrice.toLocaleString('en-US') : '—') + '</span><span class="pp-card-price-unit">€/' + (p.unit||'unit') + '</span></div>';
  h += '<div class="pp-card-stock-text">' + (p.stockLevel ? p.stockLevel.toLocaleString('en-US') : '—') + ' in stock</div>';
  h += '</div>';

  /* Tags */
  var tags = [];
  if (p.certification) tags.push(p.certification);
  if (p.application) tags.push(p.application);
  if (tags.length) {
    h += '<div class="pp-card-tags">';
    tags.forEach(function(t) { h += '<span class="pp-card-tag">' + t + '</span>'; });
    h += '</div>';
  }

  h += '</div></div>';
  return h;
}


/* ═══════════════════════════════════════════════════════
   PRODUCT PICKER MODAL — Multi-select overlay
   openProductPicker({ selected:[], onConfirm: fn([ids]) })
   ═══════════════════════════════════════════════════════ */
function openProductPicker(opts) {
  injectProductPickerStyles();
  var onConfirm = opts.onConfirm || function(){};
  var initialSelected = opts.selected || [];
  var selectedSet = {};
  initialSelected.forEach(function(id) { selectedSet[id] = true; });

  var products = window.DATA.products || [];
  var categories = [];
  products.forEach(function(p) {
    if (p.category && categories.indexOf(p.category) < 0) categories.push(p.category);
  });

  var _ppSearch = '';
  var _ppCatFilter = '';

  /* Remove existing */
  var old = document.getElementById('pp-overlay');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.id = 'pp-overlay';
  overlay.className = 'pp-overlay';

  function getFiltered() {
    return products.filter(function(p) {
      if (_ppCatFilter && p.category !== _ppCatFilter) return false;
      if (_ppSearch) {
        var q = _ppSearch.toLowerCase();
        return [p.name, p.category, p.family, p.sku, p.manufacturer, p.description, p.application]
          .some(function(v) { return v && v.toLowerCase().indexOf(q) >= 0; });
      }
      return true;
    });
  }

  function getSelectedNames() {
    var ids = Object.keys(selectedSet).filter(function(k) { return selectedSet[k]; });
    return ids.map(function(id) {
      var p = products.find(function(pr) { return pr.id === id; });
      return p ? p.name : id;
    });
  }

  function getSelectedIds() {
    return Object.keys(selectedSet).filter(function(k) { return selectedSet[k]; });
  }

  function render() {
    var filtered = getFiltered();
    var selIds = getSelectedIds();
    var selNames = getSelectedNames();

    var h = '<div class="pp-modal">';

    /* Header */
    h += '<div class="pp-modal-header">';
    h += '<div class="pp-modal-header-left">';
    h += '<div class="pp-modal-header-icon">' + _ppIcon('products', 18, '#2563eb') + '</div>';
    h += '<div><div class="pp-modal-title">Select Products</div>';
    h += '<div class="pp-modal-sub">' + selIds.length + ' selected · Pick one or more products</div></div>';
    h += '</div>';
    h += '<button class="pp-modal-close" id="pp-close">' + _ppIcon('x', 20, '#64748b') + '</button>';
    h += '</div>';

    /* Search + Filters */
    h += '<div class="pp-modal-filters">';
    h += '<div class="pp-search-wrap">' + _ppIcon('search', 15, '#94a3b8') + '<input id="pp-search" class="pp-search-input" placeholder="Search products by name, category, SKU..." value="' + _ppSearch + '" /></div>';
    h += '<div class="pp-filter-pills">';
    h += '<button class="pp-pill' + (!_ppCatFilter ? ' pp-pill--active' : '') + '" data-pp-cat="">All</button>';
    categories.forEach(function(c) {
      var cc = _ppCatColor(c);
      h += '<button class="pp-pill' + (_ppCatFilter === c ? ' pp-pill--active' : '') + '" data-pp-cat="' + c + '" style="' + (_ppCatFilter === c ? 'background:' + cc + ';border-color:' + cc : '') + '">' + c + '</button>';
    });
    h += '</div></div>';

    /* Selected strip */
    if (selIds.length > 0) {
      h += '<div class="pp-sel-strip">';
      h += '<span class="pp-sel-label">Selected:</span>';
      selIds.forEach(function(id) {
        var p = products.find(function(pr) { return pr.id === id; });
        if (!p) return;
        var cc = _ppCatColor(p.category);
        h += '<span class="pp-sel-chip"><span class="pp-sel-dot" style="background:' + cc + '"></span>' + p.name + '<span class="pp-sel-remove" data-pp-remove="' + id + '">' + _ppIcon('x', 12, '#94a3b8') + '</span></span>';
      });
      h += '</div>';
    }

    /* Grid */
    h += '<div class="pp-modal-grid" id="pp-grid">';
    if (filtered.length === 0) {
      h += '<div class="pp-empty">No products match your search</div>';
    } else {
      filtered.forEach(function(p) {
        h += _ppCard(p, { selectable: true, selected: !!selectedSet[p.id] });
      });
    }
    h += '</div>';

    /* Footer */
    h += '<div class="pp-modal-footer">';
    h += '<div class="pp-modal-footer-count"><strong>' + selIds.length + '</strong> product' + (selIds.length !== 1 ? 's' : '') + ' selected</div>';
    h += '<div class="pp-modal-footer-btns">';
    h += '<button class="pp-btn pp-btn--outline" id="pp-cancel">Cancel</button>';
    h += '<button class="pp-btn pp-btn--primary" id="pp-confirm">Confirm Selection' + (selIds.length > 0 ? ' (' + selIds.length + ')' : '') + '</button>';
    h += '</div></div>';

    h += '</div>';
    overlay.innerHTML = h;
  }

  function bindEvents() {
    /* Close */
    var closeBtn = document.getElementById('pp-close');
    var cancelBtn = document.getElementById('pp-cancel');
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (cancelBtn) cancelBtn.addEventListener('click', close);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });

    /* Search */
    var searchInput = document.getElementById('pp-search');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        _ppSearch = e.target.value;
        render(); bindEvents();
        var si = document.getElementById('pp-search');
        if (si) { si.focus(); si.selectionStart = si.selectionEnd = si.value.length; }
      });
    }

    /* Category pills */
    overlay.querySelectorAll('.pp-pill').forEach(function(pill) {
      pill.addEventListener('click', function() {
        var cat = pill.getAttribute('data-pp-cat');
        _ppCatFilter = (_ppCatFilter === cat) ? '' : cat;
        render(); bindEvents();
      });
    });

    /* Card toggle */
    overlay.querySelectorAll('.pp-card').forEach(function(card) {
      card.addEventListener('click', function() {
        var id = card.getAttribute('data-product-id');
        if (selectedSet[id]) { delete selectedSet[id]; } else { selectedSet[id] = true; }
        render(); bindEvents();
      });
    });

    /* Remove chip */
    overlay.querySelectorAll('.pp-sel-remove').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var id = btn.getAttribute('data-pp-remove');
        delete selectedSet[id];
        render(); bindEvents();
      });
    });

    /* Confirm */
    var confirmBtn = document.getElementById('pp-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', function() {
        onConfirm(getSelectedIds());
        close();
      });
    }
  }

  function close() {
    overlay.classList.remove('pp-visible');
    setTimeout(function() { overlay.remove(); }, 150);
  }

  render();
  document.body.appendChild(overlay);
  requestAnimationFrame(function() { overlay.classList.add('pp-visible'); });
  bindEvents();
}


/* ═══════════════════════════════════════════════════════
   PRODUCT GALLERY — E-shop list view for Products page
   renderProductGallery(container, items)
   ═══════════════════════════════════════════════════════ */
function renderProductGallery(container, items) {
  injectProductPickerStyles();
  var h = '<div class="pp-gallery">';
  h += '<div class="pp-gallery-grid">';
  if (!items || !items.length) {
    h += '<div class="pp-empty" style="grid-column:1/-1">No products found</div>';
  } else {
    items.forEach(function(p) {
      h += _ppCard(p, { selectable: false, selected: false });
    });
  }
  h += '</div></div>';
  container.innerHTML = h;

  /* Bind clicks → navigate to Product 360 */
  container.querySelectorAll('.pp-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var id = card.getAttribute('data-product-id');
      if (id && typeof navigate === 'function') navigate('record', 'products', id);
    });
  });
}


/* ═══════════════════════════════════════════════════════
   PRODUCT PICKER BUTTON — For use in Create/Edit modals
   Returns HTML + provides bind function
   ═══════════════════════════════════════════════════════ */
function ppFieldButton(fieldKey, currentIds) {
  var ids = currentIds || [];
  var products = window.DATA.products || [];
  var selProducts = products.filter(function(p) { return ids.indexOf(p.id) >= 0; });

  var h = '<div class="pp-field-btn" id="pp-field-' + fieldKey + '" data-pp-field="' + fieldKey + '">';
  if (selProducts.length === 0) {
    h += '<div class="pp-field-empty">';
    h += _ppIcon('products', 18, '#94a3b8');
    h += '<span>Browse & Select Products</span>';
    h += '</div>';
  } else {
    h += '<div class="pp-field-sel-count">' + selProducts.length + ' product' + (selProducts.length > 1 ? 's' : '') + ' selected</div>';
    h += '<div class="pp-field-sel-chips">';
    selProducts.forEach(function(p) {
      var cc = _ppCatColor(p.category);
      h += '<span class="pp-field-chip" style="background:' + cc + '14;color:' + cc + ';border-color:' + cc + '30">' + p.name + '</span>';
    });
    h += '</div>';
    h += '<div class="pp-field-hint">Click to modify selection</div>';
  }
  h += '</div>';
  return h;
}

/* Hidden input to store the selected IDs (comma-separated) */
function ppHiddenInput(fieldKey, currentIds) {
  return '<input type="hidden" data-field="' + fieldKey + '" id="pp-hidden-' + fieldKey + '" value="' + (currentIds || []).join(',') + '" />';
}


/* ═══════════════════════════════════════════════════════
   CSS INJECTION
   ═══════════════════════════════════════════════════════ */
function injectProductPickerStyles() {
  if (document.getElementById('pp-css')) return;
  var s = document.createElement('style'); s.id = 'pp-css';
  s.textContent = '\
/* ═══ Product Picker Overlay ═════════════════ */\
.pp-overlay{position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,.5);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .15s}\
.pp-overlay.pp-visible{opacity:1}\
\
/* ═══ Modal ══════════════════════════════════ */\
.pp-modal{background:#f8fafc;border-radius:18px;width:min(1100px,95vw);max-height:88vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.2);transform:translateY(12px);transition:transform .2s}\
.pp-visible .pp-modal{transform:none}\
\
.pp-modal-header{padding:18px 24px;border-bottom:1px solid #e8eaed;background:#fff;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}\
.pp-modal-header-left{display:flex;align-items:center;gap:10px}\
.pp-modal-header-icon{width:36px;height:36px;border-radius:10px;background:#2563eb10;display:flex;align-items:center;justify-content:center}\
.pp-modal-title{font-size:16px;font-weight:700;color:#1e293b}\
.pp-modal-sub{font-size:12px;color:#64748b}\
.pp-modal-close{background:none;border:none;cursor:pointer;padding:6px;border-radius:8px;display:flex;transition:background .12s}\
.pp-modal-close:hover{background:#f1f5f9}\
\
/* Filters */\
.pp-modal-filters{padding:14px 24px;border-bottom:1px solid #f1f5f9;background:#fff;display:flex;gap:10px;align-items:center;flex-shrink:0;flex-wrap:wrap}\
.pp-search-wrap{position:relative;flex:1;min-width:200px;display:flex;align-items:center}\
.pp-search-wrap svg{position:absolute;left:12px;pointer-events:none}\
.pp-search-input{width:100%;padding:10px 12px 10px 36px;border:1.5px solid #e8eaed;border-radius:10px;font-size:13px;font-family:inherit;background:#f8fafc;color:#1e293b;outline:none;transition:border-color .12s}\
.pp-search-input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.08)}\
.pp-filter-pills{display:flex;gap:6px;flex-wrap:wrap}\
.pp-pill{padding:6px 14px;border-radius:20px;border:1px solid #e8eaed;background:#fff;color:#64748b;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .12s;white-space:nowrap}\
.pp-pill:hover{border-color:#bbb}\
.pp-pill--active{background:#2563eb;color:#fff;border-color:#2563eb}\
\
/* Selected strip */\
.pp-sel-strip{padding:10px 24px;background:#eff6ff;border-bottom:1px solid #dbeafe;display:flex;gap:8px;align-items:center;flex-shrink:0;overflow-x:auto}\
.pp-sel-label{font-size:11px;font-weight:700;color:#2563eb;white-space:nowrap;text-transform:uppercase;letter-spacing:.4px}\
.pp-sel-chip{display:inline-flex;align-items:center;gap:5px;background:#fff;border:1px solid #bfdbfe;border-radius:8px;padding:4px 10px 4px 8px;font-size:12px;font-weight:600;color:#1e293b;white-space:nowrap}\
.pp-sel-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}\
.pp-sel-remove{cursor:pointer;margin-left:2px;display:flex;opacity:.5;transition:opacity .12s}\
.pp-sel-remove:hover{opacity:1}\
\
/* Grid */\
.pp-modal-grid{flex:1;overflow-y:auto;padding:20px 24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;align-content:start}\
.pp-empty{grid-column:1/-1;text-align:center;padding:40px 0;color:#94a3b8;font-size:13px}\
\
/* Footer */\
.pp-modal-footer{padding:14px 24px;border-top:1px solid #e8eaed;background:#fff;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}\
.pp-modal-footer-count{font-size:13px;color:#64748b}\
.pp-modal-footer-count strong{color:#1e293b}\
.pp-modal-footer-btns{display:flex;gap:8px}\
.pp-btn{padding:9px 18px;border-radius:9px;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .12s}\
.pp-btn--outline{border:1px solid #e8eaed;background:#fff;color:#64748b}\
.pp-btn--outline:hover{border-color:#bbb;color:#1e293b}\
.pp-btn--primary{border:none;background:#2563eb;color:#fff;box-shadow:0 2px 8px rgba(37,99,235,.3)}\
.pp-btn--primary:hover{background:#1d4ed8}\
\
/* ═══ Product Card ═══════════════════════════ */\
.pp-card{background:#fff;border-radius:14px;overflow:hidden;cursor:pointer;transition:all .2s;position:relative}\
.pp-card:hover{box-shadow:0 8px 24px rgba(0,0,0,.1)!important;transform:translateY(-3px)}\
.pp-card--sel{transform:translateY(-2px)}\
\
.pp-card-check{position:absolute;top:12px;right:12px;z-index:2;width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;transition:all .15s;box-shadow:0 2px 6px rgba(0,0,0,.1)}\
\
.pp-card-img{height:240px;display:flex;align-items:center;justify-content:center;border-bottom:1px solid #f1f5f9;overflow:hidden;position:relative}\
.pp-card-img img{max-height:100%;max-width:100%;object-fit:contain;padding:16px 24px}\
.pp-card-cat{position:absolute;bottom:8px;left:8px;font-size:10px;font-weight:700;padding:3px 8px;border-radius:6px;text-transform:uppercase;letter-spacing:.3px}\
.pp-card-stock{position:absolute;top:10px;left:10px;width:8px;height:8px;border-radius:50%}\
\
.pp-card-body{padding:10px 12px 14px}\
.pp-card-name{font-size:13px;font-weight:700;color:#1e293b;line-height:1.3;margin-bottom:3px}\
.pp-card-meta{font-size:10.5px;color:#64748b;margin-bottom:6px}\
.pp-card-desc{font-size:10.5px;color:#94a3b8;line-height:1.45;margin-bottom:10px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}\
\
.pp-card-price-row{display:flex;align-items:baseline;justify-content:space-between}\
.pp-card-price-val{font-size:17px;font-weight:800;letter-spacing:-.5px}\
.pp-card-price-unit{font-size:12px;color:#94a3b8;font-weight:500}\
.pp-card-stock-text{font-size:10px;color:#94a3b8;font-weight:500}\
\
.pp-card-tags{display:flex;gap:4px;margin-top:10px;flex-wrap:wrap}\
.pp-card-tag{font-size:9.5px;font-weight:600;color:#64748b;background:#f1f5f9;padding:2px 7px;border-radius:4px;white-space:nowrap}\
\
/* ═══ Gallery View ══════════════════════════ */\
.pp-gallery{max-width:1280px;margin:0 auto;padding:8px 28px 40px}\
.pp-gallery-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}\
\
/* ═══ Field Button (inside modals) ══════════ */\
.pp-field-btn{width:100%;padding:14px;border-radius:10px;border:1.5px dashed #d1d5db;background:#fafbfc;cursor:pointer;font-family:inherit;text-align:left;transition:all .15s;box-sizing:border-box}\
.pp-field-btn:hover{border-color:#2563eb;background:#eff6ff}\
.pp-field-empty{display:flex;align-items:center;gap:8px;justify-content:center;color:#94a3b8;padding:14px 0}\
.pp-field-empty span{font-size:13px;font-weight:500}\
.pp-field-sel-count{font-size:11px;font-weight:600;color:#2563eb;margin-bottom:6px}\
.pp-field-sel-chips{display:flex;flex-wrap:wrap;gap:4px}\
.pp-field-chip{font-size:11px;font-weight:600;padding:3px 9px;border-radius:6px;border:1px solid;white-space:nowrap}\
.pp-field-hint{font-size:10px;color:#94a3b8;font-weight:500;margin-top:6px}\
\
/* ═══ Responsive ════════════════════════════ */\
@media(max-width:768px){\
  .pp-modal{width:100%;max-height:95vh;border-radius:14px}\
  .pp-modal-grid{grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;padding:14px}\
  .pp-modal-header,.pp-modal-filters,.pp-modal-footer{padding-left:16px;padding-right:16px}\
  .pp-card-img{height:180px}\
  .pp-card-body{padding:10px 12px 14px}\
  .pp-gallery-grid{grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px}\
  .pp-gallery{padding:8px 14px 32px}\
}\
@media(max-width:480px){\
  .pp-modal-grid{grid-template-columns:1fr 1fr;gap:10px}\
  .pp-gallery-grid{grid-template-columns:1fr 1fr;gap:10px}\
  .pp-card-name{font-size:12px}\
  .pp-card-price-val{font-size:16px}\
}\
';
  document.head.appendChild(s);
}

/* ── Expose globally ── */
window.openProductPicker = openProductPicker;
window.renderProductGallery = renderProductGallery;
window.ppFieldButton = ppFieldButton;
window.ppHiddenInput = ppHiddenInput;
window.injectProductPickerStyles = injectProductPickerStyles;
