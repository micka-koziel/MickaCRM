/* ═══════════════════════════════════════════════════════
   pipeline.js — Kanban + View Switcher + Object Pages
                 + Filters + Create Modal
   ═══════════════════════════════════════════════════════ */

var viewModes = {};

function getViewMode(objKey) {
  if (!viewModes[objKey]) {
    viewModes[objKey] = (objKey==='opportunities'||objKey==='leads') ? 'kanban' : 'list';
  }
  return viewModes[objKey];
}

/* ─── Object Configs ─────────────────────────────────── */

var OBJ_CONFIG = {
  opportunities: {
    title: 'Opportunities', hasKanban: true,
    stages: function(){ return STAGES.opportunities||[]; },
    getData: function(){ return (window.DATA.opportunities||[]).slice(); },
    columns: [
      {key:'name',label:'Opportunity',isLink:true},
      {key:'account',label:'Account',render:function(it){return getAccountName(it.account);}},
      {key:'stage',label:'Stage',render:function(it){return renderStageBadge(it.stage,'opportunities');}},
      {key:'amount',label:'Amount',render:function(it){return fmtAmount(it.amount||0);}},
      {key:'prob',label:'Prob.',render:function(it){return (it.prob||0)+'%';}},
      {key:'close',label:'Close',render:function(it){return fmtDate(it.close);}}
    ],
    filters: [
      {key:'stage',label:'Stage',type:'select',options:function(){return (STAGES.opportunities||[]).map(function(s){return{value:s.key,label:s.label};});}},
      {key:'account',label:'Account',type:'select',options:function(){return (window.DATA.accounts||[]).map(function(a){return{value:a.id,label:a.name};});}},
      {key:'prob',label:'Prob. ≥',type:'number'}
    ],
    formFields: [
      {key:'name',label:'Opportunity Name',type:'text',required:true},
      {key:'account',label:'Account',type:'select',options:function(){return (window.DATA.accounts||[]).map(function(a){return{value:a.id,label:a.name};});}},
      {key:'stage',label:'Stage',type:'select',options:function(){return (STAGES.opportunities||[]).map(function(s){return{value:s.key,label:s.label};});}},
      {key:'amount',label:'Amount (€)',type:'number'},
      {key:'prob',label:'Probability (%)',type:'number'},
      {key:'close',label:'Close Date',type:'date'}
    ]
  },
  leads: {
    title: 'Leads', hasKanban: true,
    stages: function(){ return STAGES.leads||[]; },
    getData: function(){ return (window.DATA.leads||[]).slice(); },
    columns: [
      {key:'name',label:'Lead',isLink:true},
      {key:'account',label:'Account',render:function(it){return getAccountName(it.account);}},
      {key:'stage',label:'Stage',render:function(it){return renderStageBadge(it.stage,'leads');}},
      {key:'source',label:'Source'},
      {key:'estimatedValue',label:'Est. Value',render:function(it){return it.estimatedValue ? fmtAmount(it.estimatedValue) : '–';}},
      {key:'priority',label:'Priority',render:function(it){
        var colors = {High:'var(--danger)',Medium:'var(--warning)',Low:'var(--text-light)'};
        return it.priority ? '<span class="stage-badge" style="color:'+(colors[it.priority]||'var(--text-muted)')+'"><span class="dot" style="background:'+(colors[it.priority]||'var(--text-muted)')+'"></span>'+it.priority+'</span>' : '–';
      }}
    ],
    filters: [
      {key:'stage',label:'Stage',type:'select',options:function(){return (STAGES.leads||[]).map(function(s){return{value:s.key,label:s.label};});}},
      {key:'account',label:'Account',type:'select',options:function(){return (window.DATA.accounts||[]).map(function(a){return{value:a.id,label:a.name};});}},
      {key:'priority',label:'Priority',type:'select',options:function(){return [{value:'High',label:'High'},{value:'Medium',label:'Medium'},{value:'Low',label:'Low'}];}},
      {key:'source',label:'Source',type:'select',options:function(){var s=[];(window.DATA.leads||[]).forEach(function(l){if(l.source&&s.indexOf(l.source)<0)s.push(l.source);});return s.map(function(v){return{value:v,label:v};});}}
    ],
    formFields: [
      {key:'name',label:'Lead Name',type:'text',required:true},
      {key:'account',label:'Account',type:'select',options:function(){return (window.DATA.accounts||[]).map(function(a){return{value:a.id,label:a.name};});}},
      {key:'stage',label:'Stage',type:'select',options:function(){return (STAGES.leads||[]).map(function(s){return{value:s.key,label:s.label};});}},
      {key:'source',label:'Source',type:'text'},
      {key:'estimatedValue',label:'Estimated Value (€)',type:'number'},
      {key:'priority',label:'Priority',type:'select',options:function(){return [{value:'High',label:'High'},{value:'Medium',label:'Medium'},{value:'Low',label:'Low'}];}}
    ]
  },
  accounts: {
    title: 'Accounts', hasKanban: false,
    getData: function(){ return (window.DATA.accounts||[]).slice(); },
    columns: [
      {key:'name',label:'Account Name',isLink:true},
      {key:'industry',label:'Industry'},
      {key:'city',label:'City'},
      {key:'pipeline',label:'Pipeline',render:function(it){return it.pipeline ? fmtAmount(it.pipeline) : '–';}},
      {key:'opps',label:'Opps',render:function(it){return it.opps||0;}},
      {key:'status',label:'Status',render:function(it){
        var c = it.status==='Active' ? 'var(--success)' : 'var(--text-light)';
        return '<span class="stage-badge" style="color:'+c+'"><span class="dot" style="background:'+c+'"></span>'+it.status+'</span>';
      }}
    ],
    filters: [
      {key:'industry',label:'Industry',type:'select',options:function(){var s=[];(window.DATA.accounts||[]).forEach(function(a){if(a.industry&&s.indexOf(a.industry)<0)s.push(a.industry);});return s.map(function(v){return{value:v,label:v};});}},
      {key:'city',label:'City',type:'select',options:function(){var s=[];(window.DATA.accounts||[]).forEach(function(a){if(a.city&&s.indexOf(a.city)<0)s.push(a.city);});return s.map(function(v){return{value:v,label:v};});}},
      {key:'status',label:'Status',type:'select',options:function(){return [{value:'Active',label:'Active'},{value:'Prospect',label:'Prospect'}];}}
    ],
    formFields: [
      {key:'name',label:'Account Name',type:'text',required:true},
      {key:'industry',label:'Industry',type:'text'},
      {key:'city',label:'City',type:'text'},
      {key:'status',label:'Status',type:'select',options:function(){return [{value:'Active',label:'Active'},{value:'Prospect',label:'Prospect'}];}}
    ]
  },
  contacts: {
    title: 'Contacts', hasKanban: false,
    getData: function(){ return (window.DATA.contacts||[]).slice(); },
    columns: [
      {key:'name',label:'Name',isLink:true},
      {key:'account',label:'Account',render:function(it){return getAccountName(it.account);}},
      {key:'role',label:'Role'},
      {key:'email',label:'Email'},
      {key:'phone',label:'Phone'}
    ],
    filters: [
      {key:'account',label:'Account',type:'select',options:function(){return (window.DATA.accounts||[]).map(function(a){return{value:a.id,label:a.name};});}},
      {key:'role',label:'Role',type:'select',options:function(){var s=[];(window.DATA.contacts||[]).forEach(function(c){if(c.role&&s.indexOf(c.role)<0)s.push(c.role);});return s.map(function(v){return{value:v,label:v};});}}
    ],
    formFields: [
      {key:'name',label:'Full Name',type:'text',required:true},
      {key:'account',label:'Account',type:'select',options:function(){return (window.DATA.accounts||[]).map(function(a){return{value:a.id,label:a.name};});}},
      {key:'role',label:'Role / Title',type:'text'},
      {key:'email',label:'Email',type:'text'},
      {key:'phone',label:'Phone',type:'text'}
    ]
  }
};

/* ─── Helpers ────────────────────────────────────────── */

function getAccountName(id) {
  var acc=(window.DATA.accounts||[]).find(function(a){return a.id===id;});
  return acc ? acc.name : (id||'');
}

function fmtDate(d) {
  if(!d) return '';
  return new Date(d).toLocaleDateString('en-US',{month:'short',year:'numeric'});
}

function renderStageBadge(stageKey, objType) {
  var stages=STAGES[objType]||[];
  var s=stages.find(function(st){return st.key===stageKey;});
  if(!s) return stageKey||'';
  return '<span class="stage-badge" style="color:'+s.color+'"><span class="dot" style="background:'+s.color+'"></span>'+s.label+'</span>';
}

/* ─── State ──────────────────────────────────────────── */

var _searchQ = '';
var _activeFilters = {};  // { key: value }
var _filterPanelOpen = false;

/* ─── Page Rendering ─────────────────────────────────── */

function renderObjectPage(objKey, headerEl, contentEl) {
  var cfg = OBJ_CONFIG[objKey];
  if (!cfg) return;
  _searchQ = '';
  _activeFilters = {};
  _filterPanelOpen = false;
  renderObjHeader(objKey, cfg, headerEl);
  renderObjContent(objKey, cfg, getViewMode(objKey), contentEl);
}

function renderObjHeader(objKey, cfg, headerEl) {
  var mode = getViewMode(objKey);
  var vs = '';
  if (cfg.hasKanban) {
    var views = [{key:'kanban',icon:'kanban',label:'Kanban'},{key:'list',icon:'list',label:'List'},{key:'calendar',icon:'calendarView',label:'Calendar'},{key:'analytics',icon:'chart',label:'Analytics'}];
    vs = '<div class="view-switcher">' + views.map(function(v){
      return '<button class="view-sw-btn '+(mode===v.key?'active':'')+'" data-view="'+v.key+'">'+svgIcon(v.icon,14)+' <span>'+v.label+'</span></button>';
    }).join('') + '</div>';
  }
  var data = applyAllFilters(cfg.getData(), objKey);
  var activeCount = Object.keys(_activeFilters).length;
  var filterBadge = activeCount > 0 ? '<span class="filter-badge">'+activeCount+'</span>' : '';

  headerEl.innerHTML = '<div class="obj-header"><div class="obj-header-left"><h1>'+cfg.title+'</h1><span class="obj-count">'+data.length+'</span></div>' +
    '<div class="obj-header-right"><div class="obj-search">'+svgIcon('search',14,'var(--text-light)')+
    '<input type="text" placeholder="Search..." id="obj-search-input" value="'+_searchQ+'" /></div>' +
    '<button class="obj-filter-btn'+(_filterPanelOpen?' active':'')+'" id="obj-filter-toggle">'+svgIcon('filter',13)+' Filters'+filterBadge+'</button>'+vs+
    '<button class="obj-create-btn" id="obj-create-btn">'+svgIcon('plus',14,'#fff')+' Create</button></div></div>';

  // Search
  var si = document.getElementById('obj-search-input');
  if (si) si.addEventListener('input', function(e) {
    _searchQ = e.target.value.toLowerCase();
    refreshContent(objKey, cfg);
  });

  // View switcher
  headerEl.querySelectorAll('.view-sw-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      viewModes[objKey] = btn.dataset.view;
      renderObjHeader(objKey, cfg, headerEl);
      renderObjContent(objKey, cfg, btn.dataset.view, document.getElementById('page-content'));
    });
  });

  // Filter toggle
  document.getElementById('obj-filter-toggle').addEventListener('click', function() {
    _filterPanelOpen = !_filterPanelOpen;
    renderObjHeader(objKey, cfg, headerEl);
    refreshContent(objKey, cfg);
  });

  // Create button
  document.getElementById('obj-create-btn').addEventListener('click', function() {
    openCreateModal(objKey, cfg);
  });
}

function refreshContent(objKey, cfg) {
  renderObjContent(objKey, cfg, getViewMode(objKey), document.getElementById('page-content'));
}

/* ─── Filtering ──────────────────────────────────────── */

function applyAllFilters(data, objKey) {
  // Text search
  var filtered = data;
  if (_searchQ) {
    filtered = filtered.filter(function(d) {
      return Object.values(d).some(function(v){return String(v).toLowerCase().indexOf(_searchQ)>=0;}) ||
        getAccountName(d.account).toLowerCase().indexOf(_searchQ)>=0;
    });
  }
  // Column filters
  Object.keys(_activeFilters).forEach(function(key) {
    var val = _activeFilters[key];
    if (!val && val !== 0) return;
    var cfg = OBJ_CONFIG[objKey];
    var filterDef = cfg && cfg.filters ? cfg.filters.find(function(f){return f.key===key;}) : null;
    if (filterDef && filterDef.type === 'number') {
      filtered = filtered.filter(function(d) { return (d[key]||0) >= Number(val); });
    } else {
      filtered = filtered.filter(function(d) { return String(d[key]) === String(val); });
    }
  });
  return filtered;
}

function renderFilterPanel(objKey, cfg) {
  if (!_filterPanelOpen || !cfg.filters) return '';
  var h = '<div class="filter-panel">';
  h += '<div class="filter-panel-row">';
  cfg.filters.forEach(function(f) {
    var currentVal = _activeFilters[f.key] || '';
    h += '<div class="filter-field">';
    h += '<label class="filter-label">'+f.label+'</label>';
    if (f.type === 'select') {
      var opts = typeof f.options === 'function' ? f.options() : (f.options||[]);
      h += '<select class="filter-select" data-filter-key="'+f.key+'">';
      h += '<option value="">All</option>';
      opts.forEach(function(o) {
        h += '<option value="'+o.value+'"'+(currentVal===String(o.value)?' selected':'')+'>'+o.label+'</option>';
      });
      h += '</select>';
    } else if (f.type === 'number') {
      h += '<input type="number" class="filter-input" data-filter-key="'+f.key+'" value="'+currentVal+'" placeholder="Any" />';
    }
    h += '</div>';
  });
  // Clear button
  var hasFilters = Object.keys(_activeFilters).length > 0;
  if (hasFilters) {
    h += '<div class="filter-field" style="align-self:flex-end"><button class="filter-clear-btn" id="filter-clear">Clear all</button></div>';
  }
  h += '</div></div>';
  return h;
}

function bindFilterEvents(objKey, cfg, container) {
  container.querySelectorAll('.filter-select').forEach(function(sel) {
    sel.addEventListener('change', function() {
      var key = sel.getAttribute('data-filter-key');
      if (sel.value) { _activeFilters[key] = sel.value; }
      else { delete _activeFilters[key]; }
      renderObjHeader(objKey, cfg, document.getElementById('page-header'));
      refreshContent(objKey, cfg);
    });
  });
  container.querySelectorAll('.filter-input').forEach(function(inp) {
    inp.addEventListener('input', function() {
      var key = inp.getAttribute('data-filter-key');
      if (inp.value) { _activeFilters[key] = inp.value; }
      else { delete _activeFilters[key]; }
      renderObjHeader(objKey, cfg, document.getElementById('page-header'));
      refreshContent(objKey, cfg);
    });
  });
  var clearBtn = document.getElementById('filter-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      _activeFilters = {};
      renderObjHeader(objKey, cfg, document.getElementById('page-header'));
      refreshContent(objKey, cfg);
    });
  }
}

/* ─── Content Rendering ──────────────────────────────── */

function renderObjContent(objKey, cfg, mode, contentEl) {
  var filtered = applyAllFilters(cfg.getData(), objKey);
  var ce = document.querySelector('.obj-count');
  if (ce) ce.textContent = filtered.length;

  var filterHTML = renderFilterPanel(objKey, cfg);

  if (mode==='kanban' && cfg.hasKanban) {
    contentEl.innerHTML = filterHTML;
    var kanbanContainer = document.createElement('div');
    contentEl.appendChild(kanbanContainer);
    renderKanban(objKey, cfg, filtered, kanbanContainer);
    bindFilterEvents(objKey, cfg, contentEl);
  }
  else if (mode==='list') {
    contentEl.innerHTML = filterHTML;
    var listContainer = document.createElement('div');
    contentEl.appendChild(listContainer);
    renderListView(filtered, cfg.columns, listContainer, objKey);
    bindFilterEvents(objKey, cfg, contentEl);
  }
  else {
    contentEl.innerHTML = filterHTML + '<div class="placeholder-view">'+svgIcon('chart',18,'var(--text-light)')+' '+mode.charAt(0).toUpperCase()+mode.slice(1)+' view — coming soon</div>';
    bindFilterEvents(objKey, cfg, contentEl);
  }
}

/* ─── Create Modal ───────────────────────────────────── */

function openCreateModal(objKey, cfg) {
  if (!cfg.formFields) return;
  injectModalStyles();

  // Remove existing modal
  var old = document.getElementById('crm-modal-overlay');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.id = 'crm-modal-overlay';
  overlay.className = 'crm-modal-overlay';

  var h = '<div class="crm-modal">';
  h += '<div class="crm-modal-header"><h2 class="crm-modal-title">Create '+cfg.title.replace(/s$/,'')+'</h2>';
  h += '<button class="crm-modal-close" id="crm-modal-close">'+svgIcon('plus',14,'var(--text-muted)')+'</button></div>';
  h += '<div class="crm-modal-body">';

  cfg.formFields.forEach(function(f) {
    h += '<div class="crm-form-group">';
    h += '<label class="crm-form-label">'+f.label+(f.required?' <span style="color:var(--danger)">*</span>':'')+'</label>';
    if (f.type === 'select') {
      var opts = typeof f.options === 'function' ? f.options() : (f.options||[]);
      h += '<select class="crm-form-input" data-field="'+f.key+'">';
      h += '<option value="">— Select —</option>';
      opts.forEach(function(o) {
        h += '<option value="'+o.value+'">'+o.label+'</option>';
      });
      h += '</select>';
    } else if (f.type === 'number') {
      h += '<input type="number" class="crm-form-input" data-field="'+f.key+'" placeholder="'+f.label+'" />';
    } else if (f.type === 'date') {
      h += '<input type="date" class="crm-form-input" data-field="'+f.key+'" />';
    } else {
      h += '<input type="text" class="crm-form-input" data-field="'+f.key+'" placeholder="'+f.label+'" '+(f.required?'required':'')+' />';
    }
    h += '</div>';
  });

  h += '</div>';
  h += '<div class="crm-modal-footer">';
  h += '<button class="crm-modal-btn crm-modal-btn-cancel" id="crm-modal-cancel">Cancel</button>';
  h += '<button class="crm-modal-btn crm-modal-btn-save" id="crm-modal-save">'+svgIcon('plus',13,'#fff')+' Create</button>';
  h += '</div></div>';

  overlay.innerHTML = h;
  document.body.appendChild(overlay);

  // Animate in
  requestAnimationFrame(function() { overlay.classList.add('visible'); });

  // Close handlers
  var closeModal = function() {
    overlay.classList.remove('visible');
    setTimeout(function() { overlay.remove(); }, 150);
  };
  document.getElementById('crm-modal-close').addEventListener('click', closeModal);
  document.getElementById('crm-modal-cancel').addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });

  // Save handler
  document.getElementById('crm-modal-save').addEventListener('click', function() {
    var record = {};
    var valid = true;
    cfg.formFields.forEach(function(f) {
      var el = overlay.querySelector('[data-field="'+f.key+'"]');
      var val = el ? el.value.trim() : '';
      if (f.required && !val) { valid = false; el.style.borderColor = 'var(--danger)'; }
      else if (el) { el.style.borderColor = ''; }
      if (f.type === 'number' && val) val = Number(val);
      record[f.key] = val;
    });
    if (!valid) return;

    // Generate ID
    var arr = window.DATA[objKey] || [];
    var prefix = objKey.charAt(0);
    var maxNum = arr.reduce(function(mx, r) {
      var n = parseInt(r.id.replace(/\D/g,''), 10);
      return n > mx ? n : mx;
    }, 0);
    record.id = prefix + (maxNum + 1);

    // Defaults
    if (objKey === 'accounts') {
      record.pipeline = 0;
      record.opps = 0;
    }

    // Push to data
    arr.push(record);
    window.DATA[objKey] = arr;

    closeModal();

    // Refresh page
    renderObjHeader(objKey, cfg, document.getElementById('page-header'));
    refreshContent(objKey, cfg);
  });
}

/* ─── Kanban ─────────────────────────────────────────── */

function renderKanban(objKey, cfg, items, container) {
  var stages = cfg.stages();
  var html = '<div class="kanban-board">';
  stages.forEach(function(stage) {
    var si = items.filter(function(it){return it.stage===stage.key;});
    var total = si.reduce(function(s,it){return s+(it.amount||0);},0);
    html += '<div class="kanban-col" data-stage="'+stage.key+'"><div class="kanban-col-header">' +
      '<div class="kanban-col-title"><div style="display:flex;align-items:center;gap:5px"><span class="stage-dot" style="background:'+stage.color+'"></span><span class="stage-label">'+stage.label+'</span></div>' +
      '<span class="kanban-col-count">'+si.length+'</span></div>' +
      (total>0?'<span class="kanban-col-total">'+fmtAmount(total)+'</span>':'') +
      '</div><div class="kanban-col-cards">' +
      si.map(function(item){return renderKanbanCard(item,objKey);}).join('') +
      '</div></div>';
  });
  html += '</div>';
  container.innerHTML = html;
  bindDragDrop(objKey, cfg, container);
}

function renderKanbanCard(item, objKey) {
  var accName = getAccountName(item.account);
  var metrics = '';
  if (item.amount!=null) {
    var pc = (item.prob||0)>=70?'var(--success)':(item.prob||0)>=40?'var(--warning)':'var(--text-muted)';
    metrics = '<div class="kc-metrics"><span class="kc-amount">'+fmtAmount(item.amount)+'</span>'+
      (item.prob!=null?'<span class="kc-prob" style="color:'+pc+';background:'+pc+'14">Prob: '+item.prob+'%</span>':'')+
      '</div>';
  }
  var close = item.close ? '<div class="kc-close">Close: '+fmtDate(item.close)+'</div>' : '';
  return '<div class="kanban-card" draggable="true" data-id="'+item.id+'"><div class="kc-name">'+item.name+'</div>' +
    '<div class="kc-account"><span class="kc-account-avatar">'+accName.charAt(0)+'</span>'+accName+'</div>' +
    metrics + close + '</div>';
}

function bindDragDrop(objKey, cfg, container) {
  container.querySelectorAll('.kanban-card').forEach(function(card) {
    var wasDragged = false;
    card.addEventListener('dragstart', function(e) {
      wasDragged = true;
      e.dataTransfer.setData('text/plain', card.dataset.id);
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', function() { card.classList.remove('dragging'); });
    card.addEventListener('click', function() {
      if (wasDragged) { wasDragged = false; return; }
      var id = card.dataset.id;
      if (id) navigate('record', objKey, id);
    });
  });
  container.querySelectorAll('.kanban-col').forEach(function(col) {
    col.addEventListener('dragover', function(e) { e.preventDefault(); col.classList.add('drag-over'); });
    col.addEventListener('dragleave', function() { col.classList.remove('drag-over'); });
    col.addEventListener('drop', function(e) {
      e.preventDefault(); col.classList.remove('drag-over');
      var id = e.dataTransfer.getData('text/plain');
      var ns = col.dataset.stage;
      if (!id||!ns) return;
      var arr = window.DATA[objKey];
      if (arr) {
        var item = arr.find(function(it){return it.id===id;});
        if (item) { item.stage = ns; renderObjContent(objKey, cfg, 'kanban', document.getElementById('page-content')); }
      }
    });
  });
}

/* ─── List View ──────────────────────────────────────── */

function renderListView(items, columns, container, objKey) {
  var html = '<div class="list-view"><table><thead><tr>' +
    columns.map(function(c){return '<th>'+c.label+'</th>';}).join('') +
    '</tr></thead><tbody>' +
    items.map(function(item) {
      return '<tr data-id="'+item.id+'" data-obj="'+(objKey||'')+'">' + columns.map(function(c) {
        var val = c.render ? c.render(item) : (item[c.key]||'');
        if (c.isLink) {
          return '<td class="col-name"><a class="record-link" data-id="'+item.id+'" data-obj="'+(objKey||'')+'">'+val+'</a></td>';
        }
        return '<td>'+val+'</td>';
      }).join('') + '</tr>';
    }).join('') +
    '</tbody></table></div>';
  container.innerHTML = html;

  container.querySelectorAll('.record-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var id = link.dataset.id;
      var obj = link.dataset.obj;
      if (id && obj) navigate('record', obj, id);
    });
  });

  container.querySelectorAll('tbody tr[data-id]').forEach(function(tr) {
    tr.addEventListener('click', function() {
      var id = tr.dataset.id;
      var obj = tr.dataset.obj;
      if (id && obj) navigate('record', obj, id);
    });
  });
}

/* ═══════════════════════════════════════════════════════
   CSS INJECTION — Filter Panel + Create Modal
   ═══════════════════════════════════════════════════════ */

function injectModalStyles() {
  if (document.getElementById('crm-modal-css')) return;
  var s = document.createElement('style'); s.id = 'crm-modal-css';
  s.textContent = '\
/* ── Filter Panel ───────────────────────────────── */\
.filter-panel{padding:10px 14px;background:var(--card);border-bottom:1px solid var(--border)}\
.filter-panel-row{display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap}\
.filter-field{display:flex;flex-direction:column;gap:3px;min-width:140px}\
.filter-label{font-size:9px;font-weight:700;color:var(--text-light);text-transform:uppercase;letter-spacing:.5px}\
.filter-select,.filter-input{padding:6px 10px;border:1px solid var(--border);border-radius:7px;font-size:12px;font-family:inherit;color:var(--text);background:var(--card);outline:none;transition:border-color .12s}\
.filter-select:focus,.filter-input:focus{border-color:var(--accent)}\
.filter-clear-btn{padding:7px 12px;border:1px solid var(--border);border-radius:7px;background:transparent;color:var(--text-muted);font-size:11px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .12s}\
.filter-clear-btn:hover{border-color:var(--danger);color:var(--danger)}\
.filter-badge{display:inline-flex;align-items:center;justify-content:center;min-width:16px;height:16px;padding:0 4px;border-radius:8px;background:var(--accent);color:#fff;font-size:9px;font-weight:700;margin-left:5px}\
.obj-filter-btn.active{border-color:var(--accent);color:var(--accent);background:var(--accent-light)}\
\
/* ── Modal Overlay ──────────────────────────────── */\
.crm-modal-overlay{position:fixed;inset:0;z-index:1000;background:rgba(15,23,42,.4);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s}\
.crm-modal-overlay.visible{opacity:1}\
\
.crm-modal{background:var(--card);border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.15);border:1px solid var(--border);width:480px;max-width:92vw;max-height:85vh;display:flex;flex-direction:column;transform:translateY(8px);transition:transform .15s}\
.crm-modal-overlay.visible .crm-modal{transform:translateY(0)}\
\
.crm-modal-header{display:flex;align-items:center;justify-content:space-between;padding:18px 22px 14px;border-bottom:1px solid var(--border)}\
.crm-modal-title{font-size:17px;font-weight:700;color:var(--text);margin:0}\
.crm-modal-close{width:30px;height:30px;border-radius:7px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transform:rotate(45deg);transition:background .12s}\
.crm-modal-close:hover{background:#f1f5f9}\
\
.crm-modal-body{padding:18px 22px;overflow-y:auto;display:flex;flex-direction:column;gap:14px}\
\
.crm-form-group{display:flex;flex-direction:column;gap:4px}\
.crm-form-label{font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px}\
.crm-form-input{padding:8px 12px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;color:var(--text);background:var(--card);outline:none;transition:border-color .12s}\
.crm-form-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(37,99,235,.08)}\
\
.crm-modal-footer{display:flex;justify-content:flex-end;gap:8px;padding:14px 22px 18px;border-top:1px solid var(--border)}\
.crm-modal-btn{display:flex;align-items:center;gap:5px;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .12s}\
.crm-modal-btn-cancel{background:transparent;border:1px solid var(--border);color:var(--text-muted)}\
.crm-modal-btn-cancel:hover{border-color:#bbb;color:var(--text)}\
.crm-modal-btn-save{background:var(--accent);border:none;color:#fff}\
.crm-modal-btn-save:hover{background:var(--accent-hover)}\
';
  document.head.appendChild(s);
}
