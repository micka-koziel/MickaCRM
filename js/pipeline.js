/* ═══════════════════════════════════════════════════════
   pipeline.js — Kanban + View Switcher + Object Pages
   ═══════════════════════════════════════════════════════ */

var viewModes = {};

function getViewMode(objKey) {
  if (!viewModes[objKey]) {
    viewModes[objKey] = (objKey==='opportunities'||objKey==='leads') ? 'kanban' : 'list';
  }
  return viewModes[objKey];
}

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
    ]
  }
};

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

var _searchQ = '';

function renderObjectPage(objKey, headerEl, contentEl) {
  var cfg = OBJ_CONFIG[objKey];
  if (!cfg) return;
  _searchQ = '';
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
  var data = filterObjData(cfg.getData());
  headerEl.innerHTML = '<div class="obj-header"><div class="obj-header-left"><h1>'+cfg.title+'</h1><span class="obj-count">'+data.length+'</span></div>' +
    '<div class="obj-header-right"><div class="obj-search">'+svgIcon('search',14,'var(--text-light)')+
    '<input type="text" placeholder="Search..." id="obj-search-input" value="'+_searchQ+'" /></div>' +
    '<button class="obj-filter-btn">'+svgIcon('filter',13)+' Filters</button>'+vs+
    '<button class="obj-create-btn">'+svgIcon('plus',14,'#fff')+' Create</button></div></div>';

  var si = document.getElementById('obj-search-input');
  if (si) si.addEventListener('input', function(e) {
    _searchQ = e.target.value.toLowerCase();
    renderObjContent(objKey, cfg, getViewMode(objKey), document.getElementById('page-content'));
  });

  headerEl.querySelectorAll('.view-sw-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      viewModes[objKey] = btn.dataset.view;
      renderObjHeader(objKey, cfg, headerEl);
      renderObjContent(objKey, cfg, btn.dataset.view, document.getElementById('page-content'));
    });
  });
}

function filterObjData(data) {
  if (!_searchQ) return data;
  return data.filter(function(d) {
    return Object.values(d).some(function(v){return String(v).toLowerCase().indexOf(_searchQ)>=0;}) ||
      getAccountName(d.account).toLowerCase().indexOf(_searchQ)>=0;
  });
}

function renderObjContent(objKey, cfg, mode, contentEl) {
  var filtered = filterObjData(cfg.getData());
  var ce = document.querySelector('.obj-count');
  if (ce) ce.textContent = filtered.length;

  if (mode==='kanban' && cfg.hasKanban) { renderKanban(objKey, cfg, filtered, contentEl); }
  else if (mode==='list') { renderListView(filtered, cfg.columns, contentEl, objKey); }
  else { contentEl.innerHTML='<div class="placeholder-view">'+svgIcon('chart',18,'var(--text-light)')+' '+mode.charAt(0).toUpperCase()+mode.slice(1)+' view — coming soon</div>'; }
}

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

  // Bind name link clicks → open record detail
  container.querySelectorAll('.record-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var id = link.dataset.id;
      var obj = link.dataset.obj;
      if (id && obj) navigate('record', obj, id);
    });
  });

  // Bind row clicks → open record detail
  container.querySelectorAll('tbody tr[data-id]').forEach(function(tr) {
    tr.addEventListener('click', function() {
      var id = tr.dataset.id;
      var obj = tr.dataset.obj;
      if (id && obj) navigate('record', obj, id);
    });
  });
}
