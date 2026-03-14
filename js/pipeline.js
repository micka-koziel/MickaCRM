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
  var isPipelineObj = (objKey === 'opportunities' || objKey === 'leads');

  if (mode==='kanban' && cfg.hasKanban) {
    contentEl.innerHTML = filterHTML;
    /* Pipeline Insight Section for Opps & Leads */
    if (isPipelineObj) {
      injectPipelineInsightStyles();
      var insightDiv = document.createElement('div');
      insightDiv.innerHTML = renderPipelineInsights(objKey, cfg, filtered) + renderLifecycleSummary(objKey, cfg, filtered);
      contentEl.appendChild(insightDiv);
    }
    var kanbanContainer = document.createElement('div');
    contentEl.appendChild(kanbanContainer);
    renderKanban(objKey, cfg, filtered, kanbanContainer);
    bindFilterEvents(objKey, cfg, contentEl);
  }
  else if (mode==='list') {
    contentEl.innerHTML = filterHTML;
    if (isPipelineObj) {
      injectPipelineInsightStyles();
      var insightDiv2 = document.createElement('div');
      insightDiv2.innerHTML = renderPipelineInsights(objKey, cfg, filtered) + renderLifecycleSummary(objKey, cfg, filtered);
      contentEl.appendChild(insightDiv2);
    }
    var listContainer = document.createElement('div');
    contentEl.appendChild(listContainer);
    renderListView(filtered, cfg.columns, listContainer, objKey);
    bindFilterEvents(objKey, cfg, contentEl);
  }
  else if (mode==='analytics' && isPipelineObj) {
    contentEl.innerHTML = filterHTML;
    injectPipelineInsightStyles();
    var analyticsDiv = document.createElement('div');
    analyticsDiv.innerHTML = renderAnalyticsView(objKey, cfg, filtered);
    contentEl.appendChild(analyticsDiv);
    bindFilterEvents(objKey, cfg, contentEl);
  }
  else {
    contentEl.innerHTML = filterHTML + '<div class="placeholder-view">'+svgIcon('chart',18,'var(--text-light)')+' '+mode.charAt(0).toUpperCase()+mode.slice(1)+' view — coming soon</div>';
    bindFilterEvents(objKey, cfg, contentEl);
  }
}

/* ═══════════════════════════════════════════════════════
   PIPELINE INSIGHTS — Analytics Cards + Lifecycle Bar
   ═══════════════════════════════════════════════════════ */

function _piAmt(n) {
  if (typeof fmtAmount === 'function') return fmtAmount(n);
  if (!n || isNaN(n)) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return Math.round(n / 1000) + 'K';
  return n + '';
}

function _piIcon(name, size, color) {
  if (typeof svgIcon === 'function') return svgIcon(name, size, color);
  return '';
}

/* ─── Pipeline Funnel Card ────────────────────────────── */

function renderFunnelCard(objKey, cfg, items) {
  var stages = cfg.stages();
  var funnelData = stages.map(function(s) {
    var stageItems = items.filter(function(it) { return it.stage === s.key; });
    var total = stageItems.reduce(function(sum, it) { return sum + (it.amount || it.estimatedValue || 0); }, 0);
    return { label: s.label, color: s.color, count: stageItems.length, total: total };
  });
  var grandTotal = funnelData.reduce(function(s, d) { return s + d.total; }, 0);
  var totalDeals = items.length;
  var n = funnelData.length;

  /* ── SVG Funnel — compact trapezoids ── */
  var svgW = 200, rowH = 22, gap = 2;
  var svgH = n * (rowH + gap) - gap;
  var maxWidthPct = 0.96;
  var minWidthPct = 0.24;
  var centerX = svgW / 2;

  var funnelSvg = '<svg viewBox="0 0 ' + svgW + ' ' + svgH + '" width="100%" preserveAspectRatio="xMidYMid meet" class="pi-funnel-svg">';

  funnelData.forEach(function(d, i) {
    var y = i * (rowH + gap);
    var topPct = maxWidthPct - (i / Math.max(n - 1, 1)) * (maxWidthPct - minWidthPct);
    var botPct = (i < n - 1)
      ? maxWidthPct - ((i + 1) / Math.max(n - 1, 1)) * (maxWidthPct - minWidthPct)
      : minWidthPct * 0.75;

    var topHalf = (topPct * svgW) / 2;
    var botHalf = (botPct * svgW) / 2;
    var x1 = centerX - topHalf, x2 = centerX + topHalf;
    var x3 = centerX + botHalf, x4 = centerX - botHalf;
    var points = x1 + ',' + y + ' ' + x2 + ',' + y + ' ' + x3 + ',' + (y + rowH) + ' ' + x4 + ',' + (y + rowH);

    funnelSvg += '<polygon points="' + points + '" fill="' + d.color + '" opacity="0.92" />';

    var textY = y + rowH / 2 + 1;
    var amtText = _piAmt(d.total);
    funnelSvg += '<text x="' + centerX + '" y="' + textY + '" text-anchor="middle" dominant-baseline="central" fill="#fff" font-size="9.5" font-weight="700" font-family="DM Sans,sans-serif" style="text-shadow:0 1px 2px rgba(0,0,0,.2)">' + amtText + '</text>';
  });

  funnelSvg += '</svg>';

  /* ── Build card ── */
  var h = '<div class="pi-card">';
  h += '<div class="pi-card-head"><div class="pi-card-dot" style="background:var(--accent)"></div><span class="pi-card-title">Pipeline Funnel</span></div>';
  h += '<div class="pi-funnel-visual">';
  h += '<div class="pi-funnel-svg-col">' + funnelSvg + '</div>';
  h += '<div class="pi-funnel-labels">';
  funnelData.forEach(function(d, i) {
    h += '<div class="pi-funnel-label-row" style="height:' + rowH + 'px;margin-bottom:' + gap + 'px">';
    h += '<span class="pi-funnel-count">' + d.count + '</span>';
    h += '<span class="pi-funnel-label">' + (d.count === 1 ? 'deal' : 'deals') + '</span>';
    h += '</div>';
  });
  h += '</div></div>';
  h += '<div class="pi-funnel-footer">';
  h += '<span class="pi-funnel-won-badge" style="background:' + (funnelData.length > 0 ? funnelData[funnelData.length - 1].color : 'var(--success)') + '">' + (funnelData.length > 0 ? funnelData[funnelData.length - 1].label : 'Won') + ' ' + (funnelData.length > 0 ? funnelData[funnelData.length - 1].count : 0) + '</span>';
  h += '<span class="pi-funnel-total-icon">&#9660;</span> <strong>' + _piAmt(grandTotal) + '</strong>';
  h += '<span class="pi-funnel-total-deals">' + totalDeals + ' ' + (objKey === 'leads' ? 'leads' : 'deals') + '</span>';
  h += '</div></div>';
  return h;
}

/* ─── Lifecycle Stage Distribution Card ───────────────── */

function renderStageDistCard(objKey, cfg, items) {
  var stages = cfg.stages();
  var stageData = stages.map(function(s) {
    return { label: s.label, color: s.color, count: items.filter(function(it) { return it.stage === s.key; }).length };
  });
  var maxCount = Math.max.apply(null, stageData.map(function(d) { return d.count; })) || 1;
  var grandTotal = items.reduce(function(s, it) { return s + (it.amount || it.estimatedValue || 0); }, 0);

  var h = '<div class="pi-card">';
  h += '<div class="pi-card-head"><span class="pi-card-title">Lifecycle Stage Distribution</span></div>';
  h += '<div class="pi-dist">';
  stageData.forEach(function(d) {
    var pct = Math.max((d.count / maxCount) * 100, d.count > 0 ? 12 : 0);
    h += '<div class="pi-dist-row">';
    h += '<span class="pi-dist-label">' + d.label + '</span>';
    h += '<div class="pi-dist-track"><div class="pi-dist-fill" style="width:' + pct + '%;background:' + d.color + '"></div></div>';
    h += '<span class="pi-dist-count">' + d.count + '</span>';
    h += '</div>';
  });
  h += '</div>';
  h += '<div class="pi-dist-footer"><span class="pi-funnel-total-icon">&#9660;</span> <strong>' + _piAmt(grandTotal) + '</strong></div>';
  h += '</div>';
  return h;
}

/* ─── Activities Donut Card ───────────────────────────── */

function renderActivitiesDonut(objKey, items) {
  var ACTIVITIES = window.DATA.activities || [];
  /* Get related account IDs from items */
  var accountIds = {};
  items.forEach(function(it) { if (it.account) accountIds[it.account] = true; });

  var actTypes = [
    { key: 'Meeting', label: 'Meetings', color: '#8b5cf6' },
    { key: 'Call', label: 'Calls', color: '#3b82f6' },
    { key: 'Site Visit', label: 'Site Visits', color: '#10b981' },
    { key: 'Email', label: 'Emails', color: '#f59e0b' }
  ];
  var actData = actTypes.map(function(t) {
    return { label: t.label, color: t.color, count: ACTIVITIES.filter(function(a) { return a.type === t.key; }).length };
  });
  var total = actData.reduce(function(s, a) { return s + a.count; }, 0) || 1;

  /* SVG donut */
  var cx = 50, cy = 50, r = 38, circumference = 2 * Math.PI * r;
  var offset = 0;
  var donutPaths = '';
  actData.forEach(function(a) {
    var pct = a.count / total;
    var dashLen = pct * circumference;
    var dashGap = circumference - dashLen;
    donutPaths += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + a.color + '" stroke-width="10" ' +
      'stroke-dasharray="' + dashLen + ' ' + dashGap + '" stroke-dashoffset="-' + offset + '" ' +
      'style="transition:stroke-dasharray .5s,stroke-dashoffset .5s" />';
    offset += dashLen;
  });

  var h = '<div class="pi-card">';
  h += '<div class="pi-card-head"><span class="pi-card-title">Activities</span><span class="pi-card-sub">(last 30 days)</span></div>';
  h += '<div class="pi-donut-wrap">';
  h += '<div class="pi-donut-chart">';
  h += '<svg viewBox="0 0 100 100" width="92" height="92">';
  h += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#f1f5f9" stroke-width="10" />';
  h += donutPaths;
  h += '</svg>';
  h += '<div class="pi-donut-center"><span class="pi-donut-num">' + total + '</span></div>';
  h += '</div>';
  h += '<div class="pi-donut-legend">';
  actData.forEach(function(a) {
    h += '<div class="pi-donut-legend-row">';
    h += '<span class="pi-donut-dot" style="background:' + a.color + '"></span>';
    h += '<span class="pi-donut-label">' + a.label + '</span>';
    h += '<span class="pi-donut-val">' + a.count + '</span>';
    h += '</div>';
  });
  h += '</div></div>';
  /* Footer summary */
  var summary = actData.map(function(a) {
    return '<span class="pi-act-sum"><span class="pi-act-sum-dot" style="background:' + a.color + '"></span>' + a.count + ' ' + a.label.toLowerCase() + '</span>';
  }).join('');
  h += '<div class="pi-act-footer">' + summary + '</div>';
  h += '</div>';
  return h;
}

/* ─── Pipeline Insights (3 cards row) ─────────────────── */

function renderPipelineInsights(objKey, cfg, items) {
  var h = '<div class="pi-section">';
  h += '<div class="pi-cards-row">';
  h += renderFunnelCard(objKey, cfg, items);
  h += renderStageDistCard(objKey, cfg, items);
  h += renderActivitiesDonut(objKey, items);
  h += '</div></div>';
  return h;
}

/* ─── Lifecycle Summary Bar ───────────────────────────── */

function renderLifecycleSummary(objKey, cfg, items) {
  var stages = cfg.stages();
  var stageData = stages.map(function(s) {
    var stageItems = items.filter(function(it) { return it.stage === s.key; });
    var total = stageItems.reduce(function(sum, it) { return sum + (it.amount || it.estimatedValue || 0); }, 0);
    return { key: s.key, label: s.label, color: s.color, count: stageItems.length, total: total };
  });
  var grandTotal = stageData.reduce(function(s, d) { return s + d.total; }, 0) || 1;

  var h = '<div class="pi-lifecycle">';
  h += '<div class="pi-lifecycle-bar">';
  stageData.forEach(function(d, i) {
    /* Equal width columns — bar inside shows proportional fill */
    var fillPct = Math.max((d.total / grandTotal) * 100, d.count > 0 ? 12 : 0);
    h += '<div class="pi-lc-col">';
    h += '<div class="pi-lc-head">';
    h += '<span class="pi-lc-dot" style="background:' + d.color + '"></span>';
    h += '<span class="pi-lc-stage">' + d.label.toUpperCase() + '</span>';
    h += '</div>';
    h += '<div class="pi-lc-vals">';
    h += '<span class="pi-lc-amount">' + _piAmt(d.total) + '</span>';
    h += '<span class="pi-lc-count">' + d.count + ' ' + (d.count === 1 ? 'deal' : 'deals') + '</span>';
    h += '</div>';
    h += '<div class="pi-lc-bar-track"><div class="pi-lc-bar-fill" style="width:' + fillPct + '%;background:' + d.color + '"></div></div>';
    h += '</div>';
  });
  h += '</div></div>';
  return h;
}

/* ─── Full Analytics View ─────────────────────────────── */

function renderAnalyticsView(objKey, cfg, items) {
  var h = '<div class="pi-analytics-full">';
  h += renderPipelineInsights(objKey, cfg, items);
  h += renderLifecycleSummary(objKey, cfg, items);

  /* Extra analytics: Top deals + Stage conversion */
  var stages = cfg.stages();
  var sorted = items.slice().sort(function(a, b) { return (b.amount || b.estimatedValue || 0) - (a.amount || a.estimatedValue || 0); });
  var top5 = sorted.slice(0, 6);

  h += '<div class="pi-section"><div class="pi-cards-row pi-cards-row-2">';

  /* Top Deals */
  h += '<div class="pi-card">';
  h += '<div class="pi-card-head"><span class="pi-card-title">Top ' + (objKey === 'leads' ? 'Leads' : 'Opportunities') + '</span></div>';
  h += '<div class="pi-top-list">';
  top5.forEach(function(item, i) {
    var accName = getAccountName(item.account);
    var val = item.amount || item.estimatedValue || 0;
    h += '<div class="pi-top-row">';
    h += '<span class="pi-top-rank">#' + (i + 1) + '</span>';
    h += '<div class="pi-top-info"><span class="pi-top-name">' + item.name + '</span><span class="pi-top-account">' + accName + '</span></div>';
    h += '<span class="pi-top-val">' + _piAmt(val) + '</span>';
    h += '</div>';
  });
  h += '</div></div>';

  /* Stage Breakdown */
  h += '<div class="pi-card">';
  h += '<div class="pi-card-head"><span class="pi-card-title">Pipeline by Stage</span></div>';
  var stageBreak = stages.map(function(s) {
    var stageItems = items.filter(function(it) { return it.stage === s.key; });
    var total = stageItems.reduce(function(sum, it) { return sum + (it.amount || it.estimatedValue || 0); }, 0);
    return { label: s.label, color: s.color, count: stageItems.length, total: total };
  });
  var maxBreak = Math.max.apply(null, stageBreak.map(function(d) { return d.total; })) || 1;
  h += '<div class="pi-breakdown">';
  stageBreak.forEach(function(d) {
    var pct = Math.max((d.total / maxBreak) * 100, d.count > 0 ? 8 : 0);
    h += '<div class="pi-break-row">';
    h += '<div class="pi-break-label"><span class="pi-lc-dot" style="background:' + d.color + '"></span>' + d.label + '</div>';
    h += '<div class="pi-break-bar-track"><div class="pi-break-bar-fill" style="width:' + pct + '%;background:' + d.color + '"></div></div>';
    h += '<div class="pi-break-meta"><span class="pi-break-amt">' + _piAmt(d.total) + '</span><span class="pi-break-cnt">' + d.count + ' deals</span></div>';
    h += '</div>';
  });
  h += '</div></div>';

  h += '</div></div>';
  h += '</div>';
  return h;
}

/* ─── Pipeline Insight Styles ─────────────────────────── */

function injectPipelineInsightStyles() {
  if (document.getElementById('pi-css')) return;
  var s = document.createElement('style'); s.id = 'pi-css';
  s.textContent = '\
/* ═══ Pipeline Insight Section ═══ */\
.pi-section{padding:12px 14px 0}\
.pi-cards-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;align-items:stretch}\
.pi-cards-row-2{grid-template-columns:1fr 1fr}\
\
/* Card */\
.pi-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 16px;\
  display:flex;flex-direction:column;box-shadow:0 1px 2px rgba(0,0,0,.03);\
  transition:box-shadow .15s,border-color .15s;overflow:hidden}\
.pi-card:hover{box-shadow:0 3px 12px rgba(0,0,0,.05);border-color:#d0d5dd}\
.pi-card-head{display:flex;align-items:center;gap:6px;margin-bottom:8px;flex-shrink:0}\
.pi-card-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}\
.pi-card-title{font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.04em}\
.pi-card-sub{font-size:9.5px;color:var(--text-light);font-weight:500}\
\
/* Funnel */\
.pi-funnel-visual{display:flex;align-items:flex-start;gap:10px;flex:1;min-height:0}\
.pi-funnel-svg-col{flex:1;min-width:0;max-height:180px}\
.pi-funnel-svg{display:block;max-height:180px}\
.pi-funnel-labels{display:flex;flex-direction:column;flex-shrink:0}\
.pi-funnel-label-row{display:flex;align-items:center;gap:3px}\
.pi-funnel-count{font-size:11px;font-weight:700;color:var(--text)}\
.pi-funnel-label{font-size:9px;color:var(--text-light);font-weight:500}\
.pi-funnel-footer{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text-muted);\
  padding-top:6px;border-top:1px solid var(--border);margin-top:auto;flex-shrink:0}\
.pi-funnel-footer strong{font-size:13px;color:var(--text)}\
.pi-funnel-total-icon{font-size:8px;color:var(--text-light)}\
.pi-funnel-total-deals{font-size:10px;color:var(--text-light);margin-left:auto}\
.pi-funnel-won-badge{font-size:9px;font-weight:700;color:#fff;padding:2px 8px;border-radius:5px;letter-spacing:.02em}\
\
/* Stage Distribution */\
.pi-dist{display:flex;flex-direction:column;gap:5px;flex:1}\
.pi-dist-row{display:flex;align-items:center;gap:8px}\
.pi-dist-label{width:72px;font-size:10.5px;font-weight:600;color:var(--text-muted);text-align:right;flex-shrink:0}\
.pi-dist-track{flex:1;height:14px;background:#f1f5f9;border-radius:4px;overflow:hidden}\
.pi-dist-fill{height:100%;border-radius:4px;transition:width .4s}\
.pi-dist-count{width:20px;font-size:11px;font-weight:700;color:var(--text);text-align:right}\
.pi-dist-footer{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text-muted);\
  padding-top:6px;border-top:1px solid var(--border);margin-top:auto;flex-shrink:0}\
.pi-dist-footer strong{font-size:13px;color:var(--text)}\
\
/* Donut */\
.pi-donut-wrap{display:flex;align-items:center;gap:16px;flex:1}\
.pi-donut-chart{position:relative;flex-shrink:0}\
.pi-donut-center{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}\
.pi-donut-num{font-size:20px;font-weight:800;color:var(--text);letter-spacing:-.5px}\
.pi-donut-legend{display:flex;flex-direction:column;gap:6px;flex:1}\
.pi-donut-legend-row{display:flex;align-items:center;gap:6px}\
.pi-donut-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}\
.pi-donut-label{font-size:11px;font-weight:500;color:var(--text-muted);flex:1}\
.pi-donut-val{font-size:12px;font-weight:700;color:var(--text)}\
.pi-act-footer{display:flex;flex-wrap:wrap;gap:6px 12px;padding-top:8px;border-top:1px solid var(--border);margin-top:auto;flex-shrink:0}\
.pi-act-sum{display:flex;align-items:center;gap:3px;font-size:9px;color:var(--text-muted);font-weight:500}\
.pi-act-sum-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}\
\
/* Lifecycle Summary */\
.pi-lifecycle{padding:8px 14px 4px}\
.pi-lifecycle-bar{display:flex;gap:6px}\
.pi-lc-col{flex:1;display:flex;flex-direction:column;gap:4px;min-width:0;\
  background:var(--card);border:1px solid var(--border);border-radius:8px;padding:8px 10px;\
  transition:box-shadow .15s}\
.pi-lc-col:hover{box-shadow:0 2px 8px rgba(0,0,0,.04)}\
.pi-lc-head{display:flex;align-items:center;gap:4px}\
.pi-lc-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}\
.pi-lc-stage{font-size:9px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\
.pi-lc-vals{display:flex;flex-direction:column;gap:1px}\
.pi-lc-amount{font-size:15px;font-weight:800;color:var(--text);letter-spacing:-.3px;line-height:1.1}\
.pi-lc-count{font-size:9px;color:var(--text-light);font-weight:500}\
.pi-lc-bar-track{height:4px;border-radius:2px;background:#f1f5f9;overflow:hidden;width:100%}\
.pi-lc-bar-fill{height:100%;border-radius:2px;transition:width .4s}\
\
/* Analytics Full View */\
.pi-analytics-full{padding-bottom:20px}\
\
/* Top Deals */\
.pi-top-list{display:flex;flex-direction:column;gap:2px}\
.pi-top-row{display:flex;align-items:center;gap:8px;padding:6px 4px;border-radius:5px;transition:background .12s}\
.pi-top-row:hover{background:#f8f9fb}\
.pi-top-rank{font-size:10px;font-weight:700;color:var(--text-light);width:22px;flex-shrink:0;text-align:center}\
.pi-top-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}\
.pi-top-name{font-size:11px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\
.pi-top-account{font-size:9px;color:var(--text-light)}\
.pi-top-val{font-size:12px;font-weight:700;color:var(--text);flex-shrink:0}\
\
/* Breakdown */\
.pi-breakdown{display:flex;flex-direction:column;gap:6px}\
.pi-break-row{display:flex;align-items:center;gap:8px}\
.pi-break-label{display:flex;align-items:center;gap:4px;width:80px;flex-shrink:0;font-size:10px;font-weight:600;color:var(--text-muted)}\
.pi-break-bar-track{flex:1;height:12px;background:#f1f5f9;border-radius:4px;overflow:hidden}\
.pi-break-bar-fill{height:100%;border-radius:4px;transition:width .4s}\
.pi-break-meta{display:flex;flex-direction:column;align-items:flex-end;width:55px;flex-shrink:0}\
.pi-break-amt{font-size:10px;font-weight:700;color:var(--text)}\
.pi-break-cnt{font-size:8px;color:var(--text-light)}\
\
/* ═══ Responsive ═══ */\
@media(max-width:1024px){\
  .pi-cards-row{grid-template-columns:1fr 1fr}\
  .pi-cards-row-2{grid-template-columns:1fr}\
  .pi-lifecycle-bar{flex-wrap:wrap}\
  .pi-lc-col{flex:1 0 calc(33% - 2px);min-width:100px}\
}\
@media(max-width:640px){\
  .pi-cards-row{grid-template-columns:1fr}\
  .pi-cards-row-2{grid-template-columns:1fr}\
  .pi-section{padding:8px 10px 0}\
  .pi-lifecycle{padding:6px 10px 2px}\
  .pi-lc-col{flex:1 0 calc(50% - 2px)}\
  .pi-donut-wrap{flex-direction:column;align-items:flex-start}\
  .pi-dist-label{width:56px;font-size:9px}\
}\
';
  document.head.appendChild(s);
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
\
/* Responsive modal */\
@media(max-width:640px){\
  .crm-modal{width:100%;max-width:100%;border-radius:12px 12px 0 0;max-height:90vh}\
  .crm-modal-header{padding:14px 16px 10px}\
  .crm-modal-body{padding:14px 16px}\
  .crm-modal-footer{padding:10px 16px 14px}\
  .filter-panel-row{flex-direction:column}\
  .filter-field{min-width:unset;width:100%}\
}\
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
