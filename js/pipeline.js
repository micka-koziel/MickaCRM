/* ═══════════════════════════════════════════════════════
   pipeline.js — Kanban + View Switcher + Object Pages
                 + Filters + Create Modal
                 + Enhanced Drag & Drop
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
      {key:'industry',label:'Industry',type:'select',options:function(){return [
        {value:'General Contractor',label:'General Contractor'},
        {value:'Civil Engineering',label:'Civil Engineering'},
        {value:'Real Estate Developer',label:'Real Estate Developer'},
        {value:'Road & Rail',label:'Road & Rail'},
        {value:'Foundations & Piling',label:'Foundations & Piling'},
        {value:'Electrical & HVAC',label:'Electrical & HVAC'},
        {value:'Building Materials',label:'Building Materials'},
        {value:'Engineering Consultancy',label:'Engineering Consultancy'}
      ];}},
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
      {key:'role',label:'Role / Title',type:'select',options:function(){return [
        {value:'CEO / Managing Director',label:'CEO / Managing Director'},
        {value:'Project Director',label:'Project Director'},
        {value:'Project Manager',label:'Project Manager'},
        {value:'Site Manager',label:'Site Manager'},
        {value:'Procurement Manager',label:'Procurement Manager'},
        {value:'Design Engineer',label:'Design Engineer'},
        {value:'Sales Manager',label:'Sales Manager'},
        {value:'Other',label:'Other'}
      ];}},
      {key:'email',label:'Email',type:'text'},
      {key:'phone',label:'Phone',type:'text'}
    ]
  },
  quotes: {
    title: 'Quotes', hasKanban: false,
    getData: function(){ return (window.DATA.quotes||[]).slice(); },
    columns: [
      {key:'name',label:'Quote Name',isLink:true},
      {key:'accountName',label:'Account',render:function(it){return it.accountName||getAccountName(it.accountId)||'—';}},
      {key:'opportunity',label:'Opportunity'},
      {key:'stage',label:'Stage',render:function(it){
        var colors = {Draft:'#94a3b8','Internal Review':'#8b5cf6',Sent:'#3b82f6',Negotiation:'#f59e0b',Accepted:'#10b981'};
        var c = colors[it.stage]||'var(--text-muted)';
        return '<span class="stage-badge" style="color:'+c+'"><span class="dot" style="background:'+c+'"></span>'+(it.stage||'—')+'</span>';
      }},
      {key:'value',label:'Value',render:function(it){return fmtAmount(it.value||0);}},
      {key:'discount',label:'Discount',render:function(it){return (it.discount||0)+'%';}},
      {key:'validUntil',label:'Valid Until',render:function(it){return fmtDate(it.validUntil);}}
    ],
    filters: [
      {key:'stage',label:'Stage',type:'select',options:function(){return [{value:'Draft',label:'Draft'},{value:'Internal Review',label:'Internal Review'},{value:'Sent',label:'Sent'},{value:'Negotiation',label:'Negotiation'},{value:'Accepted',label:'Accepted'}];}},
      {key:'accountId',label:'Account',type:'select',options:function(){return (window.DATA.accounts||[]).map(function(a){return{value:a.id,label:a.name};});}},
      {key:'value',label:'Value ≥',type:'number'}
    ],
    formFields: [
      {key:'name',label:'Quote Name',type:'text',required:true},
      {key:'accountId',label:'Account',type:'select',options:function(){return (window.DATA.accounts||[]).map(function(a){return{value:a.id,label:a.name};});}},
      {key:'opportunity',label:'Opportunity',type:'text'},
      {key:'stage',label:'Stage',type:'select',options:function(){return [{value:'Draft',label:'Draft'},{value:'Internal Review',label:'Internal Review'},{value:'Sent',label:'Sent'},{value:'Negotiation',label:'Negotiation'},{value:'Accepted',label:'Accepted'}];}},
      {key:'value',label:'Value (€)',type:'number'},
      {key:'discount',label:'Discount (%)',type:'number'},
      {key:'validUntil',label:'Valid Until',type:'date'},
      {key:'contact',label:'Contact Name',type:'text'},
      {key:'paymentTerms',label:'Payment Terms',type:'select',options:function(){return [{value:'Net 30',label:'Net 30'},{value:'Net 45',label:'Net 45'},{value:'Net 60',label:'Net 60'},{value:'Net 90',label:'Net 90'}];}}
    ]
  },
  projects: {
    title: 'Projects', hasKanban: true,
    stages: function(){ return STAGES.projects||[]; },
    getData: function(){ return (window.DATA.projects||[]).slice().map(function(p){
      /* Normalize phase to lowercase key for kanban compat */
      if (p.phase) {
        var phLower = p.phase.toLowerCase().replace(/[^a-z]/g,'');
        var stgs = STAGES.projects||[];
        var match = stgs.find(function(s){ return s.key === phLower || s.label.toLowerCase().replace(/[^a-z]/g,'') === phLower; });
        if (match) p.stage = match.key;
        else p.stage = p.phase;
      }
      return p;
    }); },
    columns: [
      {key:'name',label:'Project Name',isLink:true},
      {key:'account',label:'Account',render:function(it){return getAccountName(it.account);}},
      {key:'phase',label:'Phase',render:function(it){
        var phs = STAGES.projects||[];
        var ph = phs.find(function(s){return s.key===it.stage||s.label===it.phase;});
        if(ph) return '<span class="stage-badge" style="color:'+ph.color+'"><span class="dot" style="background:'+ph.color+'"></span>'+ph.label+'</span>';
        return it.phase||'—';
      }},
      {key:'value',label:'Value',render:function(it){return fmtAmount(it.value||0);}},
      {key:'health',label:'Health',render:function(it){
        var hc = {Healthy:'var(--success)',Attention:'var(--warning)','At Risk':'var(--danger)'};
        var c = hc[it.health]||'var(--text-muted)';
        return '<span class="stage-badge" style="color:'+c+'"><span class="dot" style="background:'+c+'"></span>'+(it.health||'—')+'</span>';
      }},
      {key:'owner',label:'Owner'},
      {key:'expectedDelivery',label:'Delivery',render:function(it){return fmtDate(it.expectedDelivery||it.end);}}
    ],
    filters: [
      {key:'stage',label:'Phase',type:'select',options:function(){return (STAGES.projects||[]).map(function(s){return{value:s.key,label:s.label};});}},
      {key:'account',label:'Account',type:'select',options:function(){return (window.DATA.accounts||[]).map(function(a){return{value:a.id,label:a.name};});}},
      {key:'health',label:'Health',type:'select',options:function(){return [{value:'Healthy',label:'Healthy'},{value:'Attention',label:'Attention'},{value:'At Risk',label:'At Risk'}];}}
    ],
    formFields: [
      {key:'name',label:'Project Name',type:'text',required:true},
      {key:'account',label:'Account',type:'select',options:function(){return (window.DATA.accounts||[]).map(function(a){return{value:a.id,label:a.name};});}},
      {key:'phase',label:'Phase',type:'select',options:function(){return (STAGES.projects||[]).map(function(s){return{value:s.key,label:s.label};});}},
      {key:'value',label:'Value (€)',type:'number'},
      {key:'health',label:'Health',type:'select',options:function(){return [{value:'Healthy',label:'Healthy'},{value:'Attention',label:'Attention'},{value:'At Risk',label:'At Risk'}];}},
      {key:'owner',label:'Owner',type:'text'},
      {key:'start',label:'Start Date',type:'date'},
      {key:'end',label:'Expected Delivery',type:'date'}
    ]
  },
  claims: {
    title: 'Claims', hasKanban: false,
    getData: function(){ return (window.DATA.claims||[]).slice(); },
    columns: [
      {key:'title',label:'Claim',isLink:true,render:function(it){return it.title||it.name||'—';}},
      {key:'projectName',label:'Project',render:function(it){
        if (it.projectName) return it.projectName;
        var p = (window.DATA.projects||[]).find(function(pr){return pr.id===it.projectId;});
        return p ? p.name : '—';
      }},
      {key:'accountName',label:'Account',render:function(it){
        if (it.accountName) return it.accountName;
        return getAccountName(it.accountId)||'—';
      }},
      {key:'status',label:'Status',render:function(it){
        var colors = {Open:'var(--danger)','In Progress':'var(--warning)',Resolved:'var(--success)',Closed:'var(--text-light)',Reported:'var(--danger)',Investigation:'var(--warning)',Negotiation:'#3b82f6'};
        var s = it.status||it.stage||'—';
        var c = colors[s]||'var(--text-muted)';
        return '<span class="stage-badge" style="color:'+c+'"><span class="dot" style="background:'+c+'"></span>'+s+'</span>';
      }},
      {key:'priority',label:'Priority',render:function(it){
        var colors = {High:'var(--danger)',Critical:'var(--danger)',Medium:'var(--warning)',Low:'var(--text-light)'};
        return it.priority ? '<span class="stage-badge" style="color:'+(colors[it.priority]||'var(--text-muted)')+'"><span class="dot" style="background:'+(colors[it.priority]||'var(--text-muted)')+'"></span>'+it.priority+'</span>' : '—';
      }},
      {key:'impactValue',label:'Impact',render:function(it){return it.impactValue ? fmtAmount(it.impactValue) : '—';}},
      {key:'reportedDate',label:'Reported',render:function(it){return fmtDate(it.reportedDate||it.date);}}
    ],
    filters: [
      {key:'status',label:'Status',type:'select',options:function(){return [{value:'Open',label:'Open'},{value:'In Progress',label:'In Progress'},{value:'Investigation',label:'Investigation'},{value:'Negotiation',label:'Negotiation'},{value:'Resolved',label:'Resolved'},{value:'Closed',label:'Closed'}];}},
      {key:'priority',label:'Priority',type:'select',options:function(){return [{value:'High',label:'High'},{value:'Medium',label:'Medium'},{value:'Low',label:'Low'}];}},
      {key:'riskLevel',label:'Risk Level',type:'select',options:function(){return [{value:'High',label:'High'},{value:'Medium',label:'Medium'},{value:'Low',label:'Low'}];}},
      {key:'projectId',label:'Project',type:'select',options:function(){return (window.DATA.projects||[]).map(function(p){return{value:p.id,label:p.name};});}}
    ],
    formFields: [
      {key:'title',label:'Claim Title',type:'text',required:true},
      {key:'projectId',label:'Project',type:'select',options:function(){return (window.DATA.projects||[]).map(function(p){return{value:p.id,label:p.name};});}},
      {key:'accountId',label:'Account',type:'select',options:function(){return (window.DATA.accounts||[]).map(function(a){return{value:a.id,label:a.name};});}},
      {key:'status',label:'Status',type:'select',options:function(){return [{value:'Open',label:'Open'},{value:'Investigation',label:'Investigation'},{value:'Negotiation',label:'Negotiation'},{value:'Resolved',label:'Resolved'},{value:'Closed',label:'Closed'}];}},
      {key:'priority',label:'Priority',type:'select',options:function(){return [{value:'High',label:'High'},{value:'Medium',label:'Medium'},{value:'Low',label:'Low'}];}},
      {key:'riskLevel',label:'Risk Level',type:'select',options:function(){return [{value:'High',label:'High'},{value:'Medium',label:'Medium'},{value:'Low',label:'Low'}];}},
      {key:'impactValue',label:'Impact Value (€)',type:'number'},
      {key:'category',label:'Category',type:'select',options:function(){return [{value:'Supply Chain',label:'Supply Chain'},{value:'Quality',label:'Quality'},{value:'Logistics',label:'Logistics'},{value:'Safety',label:'Safety'},{value:'Contractual',label:'Contractual'},{value:'Other',label:'Other'}];}},
      {key:'owner',label:'Owner',type:'text'},
      {key:'description',label:'Description',type:'text'}
    ]
  },
  activities: {
    title: 'Activities', hasKanban: false,
    getData: function(){ return (window.DATA.activities||[]).slice(); },
    columns: [
      {key:'subject',label:'Subject',isLink:true,render:function(it){return it.subject||it.name||'—';}},
      {key:'type',label:'Type',render:function(it){
        var colors = {Call:'#3b82f6',Meeting:'#8b5cf6',Email:'#10b981','Site Visit':'#ef4444',Task:'#f59e0b',Note:'#64748b'};
        var c = colors[it.type]||'var(--text-muted)';
        return '<span class="stage-badge" style="color:'+c+'"><span class="dot" style="background:'+c+'"></span>'+(it.type||'—')+'</span>';
      }},
      {key:'accountName',label:'Account',render:function(it){return it.accountName||getAccountName(it.accountId)||'—';}},
      {key:'contact',label:'Contact'},
      {key:'status',label:'Status',render:function(it){
        var colors = {Planned:'#94a3b8','In Progress':'#3b82f6',Completed:'#10b981'};
        var c = colors[it.status]||'var(--text-muted)';
        return '<span class="stage-badge" style="color:'+c+'"><span class="dot" style="background:'+c+'"></span>'+(it.status||'—')+'</span>';
      }},
      {key:'date',label:'Date',render:function(it){return fmtDate(it.date);}}
    ],
    filters: [
      {key:'type',label:'Type',type:'select',options:function(){return [{value:'Call',label:'Call'},{value:'Meeting',label:'Meeting'},{value:'Email',label:'Email'},{value:'Site Visit',label:'Site Visit'}];}},
      {key:'status',label:'Status',type:'select',options:function(){return [{value:'Planned',label:'Planned'},{value:'In Progress',label:'In Progress'},{value:'Completed',label:'Completed'}];}},
      {key:'accountId',label:'Account',type:'select',options:function(){return (window.DATA.accounts||[]).map(function(a){return{value:a.id,label:a.name};});}}
    ],
    formFields: [
      {key:'subject',label:'Subject',type:'text',required:true},
      {key:'type',label:'Type',type:'select',options:function(){return [{value:'Call',label:'Call'},{value:'Meeting',label:'Meeting'},{value:'Email',label:'Email'},{value:'Site Visit',label:'Site Visit'}];}},
      {key:'accountId',label:'Account',type:'select',options:function(){return (window.DATA.accounts||[]).map(function(a){return{value:a.id,label:a.name};});}},
      {key:'contact',label:'Contact',type:'text'},
      {key:'status',label:'Status',type:'select',options:function(){return [{value:'Planned',label:'Planned'},{value:'In Progress',label:'In Progress'},{value:'Completed',label:'Completed'}];}},
      {key:'date',label:'Date',type:'date'},
      {key:'time',label:'Time',type:'text'},
      {key:'duration',label:'Duration (min)',type:'number'},
      {key:'location',label:'Location',type:'text'},
      {key:'purpose',label:'Purpose',type:'text'}
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
var _activeFilters = {};
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
  var filtered = data;
  if (_searchQ) {
    filtered = filtered.filter(function(d) {
      return Object.values(d).some(function(v){return String(v).toLowerCase().indexOf(_searchQ)>=0;}) ||
        getAccountName(d.account).toLowerCase().indexOf(_searchQ)>=0;
    });
  }
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

  requestAnimationFrame(function() { overlay.classList.add('visible'); });

  var closeModal = function() {
    overlay.classList.remove('visible');
    setTimeout(function() { overlay.remove(); }, 150);
  };
  document.getElementById('crm-modal-close').addEventListener('click', closeModal);
  document.getElementById('crm-modal-cancel').addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });

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

    var arr = window.DATA[objKey] || [];
    var prefix = objKey.charAt(0);
    var maxNum = arr.reduce(function(mx, r) {
      var n = parseInt(r.id.replace(/\D/g,''), 10);
      return n > mx ? n : mx;
    }, 0);
    record.id = prefix + (maxNum + 1);

    if (objKey === 'accounts') {
      record.pipeline = 0;
      record.opps = 0;
    }

    arr.push(record);
    window.DATA[objKey] = arr;

    /* ── Persist to Firestore ── */
    fbCreate(objKey, record);
    fbShowStatus('Created in Firestore');

    closeModal();

    renderObjHeader(objKey, cfg, document.getElementById('page-header'));
    refreshContent(objKey, cfg);
  });
}

/* ═══════════════════════════════════════════════════════
   KANBAN — Rendering + Enhanced Drag & Drop
   ═══════════════════════════════════════════════════════ */

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
  injectDragDropStyles();
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
  /* Priority badge for leads */
  var prioHtml = '';
  if (item.priority) {
    var prioColors = {High:'#ef4444',Medium:'#f59e0b',Low:'#94a3b8'};
    var prioBg    = {High:'#fef2f2',Medium:'#fffbeb',Low:'#f8fafc'};
    prioHtml = '<span class="kc-priority" style="color:'+
      (prioColors[item.priority]||'#94a3b8')+';background:'+
      (prioBg[item.priority]||'#f8fafc')+'">'+item.priority+'</span>';
  }
  /* Estimated value for leads */
  var estVal = '';
  if (item.estimatedValue) {
    estVal = '<div class="kc-metrics"><span class="kc-amount">'+fmtAmount(item.estimatedValue)+'</span>'+prioHtml+'</div>';
  } else if (prioHtml) {
    estVal = '<div class="kc-metrics">'+prioHtml+'</div>';
  }

  return '<div class="kanban-card" draggable="true" data-id="'+item.id+'">' +
    '<div class="kc-name">'+item.name+'</div>' +
    '<div class="kc-account"><span class="kc-account-avatar">'+accName.charAt(0)+'</span>'+accName+'</div>' +
    metrics + estVal + close + '</div>';
}

/* ─── Enhanced Drag & Drop ──────────────────────────── */

var _dragState = {
  dragId: null,
  sourceStage: null,
  placeholder: null
};

function bindDragDrop(objKey, cfg, container) {

  /* — Card events — */
  container.querySelectorAll('.kanban-card').forEach(function(card) {
    var didDrag = false;

    card.addEventListener('dragstart', function(e) {
      didDrag = true;
      _dragState.dragId = card.dataset.id;
      /* Find source stage */
      var col = card.closest('.kanban-col');
      _dragState.sourceStage = col ? col.dataset.stage : null;

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.dataset.id);

      /* Delay adding class so browser captures clean drag image */
      requestAnimationFrame(function() {
        card.classList.add('kd-dragging');
      });
    });

    card.addEventListener('dragend', function() {
      card.classList.remove('kd-dragging');
      removePlaceholder();
      removeAllDragOver();
      _dragState.dragId = null;
      _dragState.sourceStage = null;
    });

    card.addEventListener('click', function() {
      if (didDrag) { didDrag = false; return; }
      var id = card.dataset.id;
      if (id) navigate('record', objKey, id);
    });
  });

  /* — Column events — */
  container.querySelectorAll('.kanban-col').forEach(function(col) {

    col.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (!_dragState.dragId) return;

      col.classList.add('kd-drag-over');

      /* Position placeholder among cards */
      var cardsContainer = col.querySelector('.kanban-col-cards');
      if (!cardsContainer) return;

      var cards = Array.from(cardsContainer.querySelectorAll('.kanban-card:not(.kd-dragging)'));
      var afterCard = null;

      for (var i = 0; i < cards.length; i++) {
        var rect = cards[i].getBoundingClientRect();
        var midY = rect.top + rect.height / 2;
        if (e.clientY < midY) {
          afterCard = cards[i];
          break;
        }
      }

      ensurePlaceholder();
      if (afterCard) {
        cardsContainer.insertBefore(_dragState.placeholder, afterCard);
      } else {
        cardsContainer.appendChild(_dragState.placeholder);
      }
    });

    col.addEventListener('dragleave', function(e) {
      /* Only remove if truly leaving the column */
      var related = e.relatedTarget;
      if (related && col.contains(related)) return;
      col.classList.remove('kd-drag-over');
    });

    col.addEventListener('drop', function(e) {
      e.preventDefault();
      col.classList.remove('kd-drag-over');
      removePlaceholder();

      var id = e.dataTransfer.getData('text/plain');
      var newStage = col.dataset.stage;
      if (!id || !newStage) return;

      var arr = window.DATA[objKey];
      if (!arr) return;

      var item = arr.find(function(it) { return it.id === id; });
      if (!item) return;

      var oldStage = item.stage;
      item.stage = newStage;

      /* ── Persist stage change to Firestore ── */
      if (oldStage !== newStage) {
        fbSaveField(objKey, id, 'stage', newStage);
      }

      /* Re-render kanban */
      renderObjContent(objKey, cfg, 'kanban', document.getElementById('page-content'));

      /* Flash the moved card + toast */
      if (oldStage !== newStage) {
        flashCard(id);
        showDragToast(item.name, newStage, objKey);
      }
    });
  });
}

/* ─── Placeholder ─────────────────────────────────────── */

function ensurePlaceholder() {
  if (!_dragState.placeholder) {
    var ph = document.createElement('div');
    ph.className = 'kd-placeholder';
    _dragState.placeholder = ph;
  }
}

function removePlaceholder() {
  if (_dragState.placeholder && _dragState.placeholder.parentNode) {
    _dragState.placeholder.parentNode.removeChild(_dragState.placeholder);
  }
  _dragState.placeholder = null;
}

function removeAllDragOver() {
  document.querySelectorAll('.kd-drag-over').forEach(function(el) {
    el.classList.remove('kd-drag-over');
  });
}

/* ─── Flash Card After Drop ──────────────────────────── */

function flashCard(id) {
  setTimeout(function() {
    var card = document.querySelector('.kanban-card[data-id="'+id+'"]');
    if (card) {
      card.classList.add('kd-just-dropped');
      setTimeout(function() { card.classList.remove('kd-just-dropped'); }, 700);
    }
  }, 50);
}

/* ─── Toast Notification ─────────────────────────────── */

function showDragToast(itemName, newStage, objKey) {
  /* Find stage label */
  var cfg = OBJ_CONFIG[objKey];
  var stages = cfg && cfg.stages ? cfg.stages() : [];
  var stageObj = stages.find(function(s) { return s.key === newStage; });
  var stageLabel = stageObj ? stageObj.label : newStage;
  var shortName = itemName.split(' – ')[0] || itemName;

  /* Remove existing toast */
  var old = document.getElementById('kd-toast');
  if (old) old.remove();

  var toast = document.createElement('div');
  toast.id = 'kd-toast';
  toast.className = 'kd-toast';
  toast.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>' +
    '<span>' + shortName + ' moved to <strong>' + stageLabel + '</strong></span>';
  document.body.appendChild(toast);

  /* Animate in */
  requestAnimationFrame(function() {
    toast.classList.add('kd-toast-visible');
  });

  /* Auto-remove */
  setTimeout(function() {
    toast.classList.remove('kd-toast-visible');
    setTimeout(function() { toast.remove(); }, 300);
  }, 2400);
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
   CSS INJECTION — Filter Panel + Create Modal + Drag&Drop
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

/* ── Drag & Drop Styles ─────────────────────────────── */

function injectDragDropStyles() {
  if (document.getElementById('kd-css')) return;
  var s = document.createElement('style'); s.id = 'kd-css';
  s.textContent = '\
/* Card being dragged */\
.kanban-card{cursor:grab;transition:box-shadow .2s,transform .2s,opacity .2s}\
.kanban-card:active{cursor:grabbing}\
.kd-dragging{opacity:.35!important;transform:scale(.96);box-shadow:none!important}\
\
/* Column receiving a drop */\
.kd-drag-over{background:var(--accent-light,#eff6ff)!important;border:2px dashed var(--accent,#2563eb)!important;border-radius:12px;transform:scale(1.008);transition:all .2s cubic-bezier(.4,0,.2,1)}\
.kanban-col{border:2px solid transparent;transition:all .2s cubic-bezier(.4,0,.2,1)}\
\
/* Drop placeholder bar */\
.kd-placeholder{height:4px;border-radius:2px;background:var(--accent,#2563eb);margin:4px 6px;box-shadow:0 0 10px rgba(37,99,235,.3);transition:all .15s;animation:kd-ph-pulse .8s ease-in-out infinite alternate}\
@keyframes kd-ph-pulse{0%{opacity:.6;transform:scaleX(.96)}100%{opacity:1;transform:scaleX(1)}}\
\
/* Flash after drop */\
.kd-just-dropped{animation:kd-flash .7s ease-out}\
@keyframes kd-flash{0%{box-shadow:0 0 0 3px var(--accent,#2563eb),0 4px 20px rgba(37,99,235,.2);transform:scale(1.03)}100%{box-shadow:0 1px 3px rgba(0,0,0,.06);transform:scale(1)}}\
\
/* Priority badge in kanban card */\
.kc-priority{font-size:9px;font-weight:700;text-transform:uppercase;padding:2px 7px;border-radius:6px;letter-spacing:.3px}\
\
/* Toast notification */\
.kd-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(16px);opacity:0;z-index:9999;\
  background:#0f172a;color:#fff;padding:10px 20px;border-radius:10px;\
  font-size:13px;font-weight:600;font-family:inherit;\
  box-shadow:0 8px 32px rgba(0,0,0,.18);\
  display:flex;align-items:center;gap:8px;\
  pointer-events:none;transition:all .3s cubic-bezier(.4,0,.2,1);white-space:nowrap}\
.kd-toast-visible{opacity:1;transform:translateX(-50%) translateY(0)}\
.kd-toast strong{color:#60a5fa}\
.kd-toast svg{flex-shrink:0}\
';
  document.head.appendChild(s);
}
