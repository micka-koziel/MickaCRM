/* ═══════════════════════════════════════════════════════════
   MickaCRM — app.js (Main Router)
   ═══════════════════════════════════════════════════════════ */

if (typeof DATA === 'undefined') {
  var DATA = {
    accounts: [
      { id:'a1',name:'Bouygues Construction' },{ id:'a2',name:'Vinci Immobilier' },
      { id:'a3',name:'Eiffage Génie Civil' },{ id:'a4',name:'Spie Batignolles' },
      { id:'a5',name:'Colas Group' },{ id:'a6',name:'NGE Fondations' },
      { id:'a7',name:'Demathieu Bard' },{ id:'a8',name:'Razel-Bec' },
    ],
    contacts: [
      { id:'c1',name:'Jean-Pierre Martin',account:'a1',role:'Directeur Travaux',email:'jp.martin@bouygues.fr' },
      { id:'c2',name:'Sophie Durand',account:'a2',role:'Chef de Projet',email:'s.durand@vinci.com' },
      { id:'c3',name:'Marc Lefèvre',account:'a3',role:'Responsable Achats',email:'m.lefevre@eiffage.com' },
      { id:'c4',name:'Isabelle Moreau',account:'a4',role:'DG Adjoint',email:'i.moreau@spie.com' },
      { id:'c5',name:'Thomas Girard',account:'a5',role:'Ingénieur Études',email:'t.girard@colas.com' },
    ],
    opportunities: [
      { id:'o1',name:'Grand Paris Express – Lot 7',account:'a1',amount:45000000,prob:70,stage:'negotiation',close:'2026-06-15' },
      { id:'o2',name:'Tour Triangle – Fondations',account:'a2',amount:12000000,prob:45,stage:'proposal',close:'2026-08-01' },
      { id:'o3',name:'A69 Highway – Section 2',account:'a5',amount:32000000,prob:30,stage:'tender',close:'2026-12-01' },
      { id:'o4',name:'Gare du Nord Renovation',account:'a3',amount:23000000,prob:85,stage:'closed_won',close:'2026-03-30' },
      { id:'o5',name:'Centre Aquatique – Extension',account:'a1',amount:8500000,prob:60,stage:'study',close:'2026-09-15' },
      { id:'o6',name:'Flaubert Bridge Phase 2',account:'a7',amount:22000000,prob:25,stage:'lead',close:'2027-01-01' },
      { id:'o7',name:'Data Center Marseille',account:'a1',amount:56000000,prob:55,stage:'negotiation',close:'2026-07-20' },
      { id:'o8',name:'Campus Saclay – Bldg R',account:'a4',amount:19000000,prob:40,stage:'closed_won',close:'2026-11-01' },
    ],
    leads: [
      { id:'l1',name:'Vinci – Warehouse project',account:'a2',stage:'new',source:'Website' },
      { id:'l2',name:'Eiffage – Highway extension',account:'a3',stage:'contacted',source:'Trade Show' },
      { id:'l3',name:'Spie – Underground parking',account:'a4',stage:'qualified',source:'Referral' },
      { id:'l4',name:'Bouygues – Tech campus',account:'a1',stage:'new',source:'Cold Call' },
    ],
    projects: [
      { id:'p1',name:'Gare du Nord',phase:'construction',account:'a3' },
      { id:'p2',name:'Campus Saclay',phase:'construction',account:'a4' },
      { id:'p3',name:'Tour Triangle',phase:'prestudy',account:'a2' },
    ],
    claims: [{ id:'cl1',name:'Delay claim GPE',status:'Open' },{ id:'cl2',name:'Material defect A69',status:'In Progress' }],
    tasks: [],
    activities: [],
  };
}

var STAGES_OPP = [
  {key:'lead',label:'Lead',color:'#94a3b8'},{key:'study',label:'Study',color:'#3b82f6'},
  {key:'tender',label:'Tender',color:'#3b82f6'},{key:'proposal',label:'Proposal',color:'#ec4899'},
  {key:'negotiation',label:'Negot.',color:'#f97316'},{key:'closed_won',label:'Won',color:'#10b981'},
  {key:'launched',label:'Launched',color:'#6366f1'}
];
var STAGES_LEAD = [
  {key:'new',label:'New',color:'#10b981'},{key:'contacted',label:'Contacted',color:'#3b82f6'},
  {key:'qualified',label:'Qualified',color:'#8b5cf6'},{key:'proposal',label:'Proposal',color:'#06b6d4'},
  {key:'converted',label:'Converted',color:'#10b981'}
];
var PROJECT_PHASES = [
  {key:'prestudy',label:'Pre-study',color:'#94a3b8'},{key:'tender',label:'Tender',color:'#f59e0b'},
  {key:'contracting',label:'Contract.',color:'#3b82f6'},{key:'construction',label:'Construction',color:'#f97316'},
  {key:'delivered',label:'Delivered',color:'#10b981'}
];

var _viewModes = {};
var _searchQueries = {};
function getViewMode(p) { return _viewModes[p] || 'kanban'; }
function getSearchQuery(p) { return _searchQueries[p] || ''; }

function renderCurrentPage() {
  var page = _currentPage;
  switch (page) {
    case 'home': renderDashboard(); break;
    case 'opportunities':
      renderObjectPage('opportunities','Opportunities',DATA.opportunities,STAGES_OPP,true,[
        {key:'name',label:'Opportunity'},
        {key:'account',label:'Account',render:function(it){var a=DATA.accounts.find(function(x){return x.id===it.account;});return a?a.name:'';}},
        {key:'stage',label:'Stage',render:function(it){var s=STAGES_OPP.find(function(x){return x.key===it.stage;});return s?'<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:500;color:'+s.color+'"><span style="width:6px;height:6px;border-radius:50%;background:'+s.color+'"></span>'+s.label+'</span>':'';}},
        {key:'amount',label:'Amount',render:function(it){return formatAmount(it.amount);}},
        {key:'prob',label:'Prob.',render:function(it){return it.prob+'%';}},
        {key:'close',label:'Close',render:function(it){return formatDateShort(it.close);}}
      ]); break;
    case 'leads':
      renderObjectPage('leads','Leads',DATA.leads,STAGES_LEAD,true,[
        {key:'name',label:'Lead'},
        {key:'account',label:'Account',render:function(it){var a=DATA.accounts.find(function(x){return x.id===it.account;});return a?a.name:'';}},
        {key:'stage',label:'Stage',render:function(it){var s=STAGES_LEAD.find(function(x){return x.key===it.stage;});return s?'<span style="font-size:11px;font-weight:500;color:'+s.color+'">'+s.label+'</span>':'';}},
        {key:'source',label:'Source'}
      ]); break;
    case 'accounts':
      renderObjectPage('accounts','Accounts',DATA.accounts,null,false,[
        {key:'name',label:'Account'},{key:'id',label:'ID'}
      ]); break;
    case 'contacts':
      renderObjectPage('contacts','Contacts',DATA.contacts,null,false,[
        {key:'name',label:'Name'},
        {key:'account',label:'Account',render:function(it){var a=DATA.accounts.find(function(x){return x.id===it.account;});return a?a.name:'';}},
        {key:'role',label:'Role'},{key:'email',label:'Email'}
      ]); break;
    default:
      hidePageHeader();
      var ni = NAV_ITEMS.find(function(n){return n.key===page;});
      var lbl = ni ? ni.label : page;
      document.getElementById('page-content').innerHTML =
        '<div style="flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;min-height:400px">' +
          '<div style="opacity:.1">'+navIcon(ni?ni.icon:'home',44)+'</div>' +
          '<span style="font-size:15px;font-weight:600;color:var(--text)">'+lbl+'</span>' +
          '<span style="font-size:12px;color:var(--text-light)">Module under construction</span>' +
        '</div>';
      break;
  }
}

function renderObjectPage(pageKey,title,allItems,stages,hasKanban,listColumns) {
  var viewMode = getViewMode(pageKey);
  var searchQ = getSearchQuery(pageKey);
  var items = allItems;
  if (searchQ) {
    var q = searchQ.toLowerCase();
    items = allItems.filter(function(it){
      return Object.values(it).some(function(v){return String(v).toLowerCase().indexOf(q)!==-1;});
    });
  }
  renderPageHeader({
    title:title, count:items.length, hasKanban:hasKanban, viewMode:viewMode,
    onViewChange:function(nv){_viewModes[pageKey]=nv;renderCurrentPage();},
    onSearch:function(val){_searchQueries[pageKey]=val;renderCurrentPage();}
  });
  var si = document.getElementById('ph-search-input');
  if (si) si.value = searchQ;

  if (hasKanban && viewMode === 'kanban') {
    renderKanbanBoard(items, stages, pageKey, function(id,newStage) {
      var item = allItems.find(function(x){return x.id===id;});
      if (item) { item.stage = newStage; renderCurrentPage(); }
    });
  } else if (viewMode === 'list' || !hasKanban) {
    renderListView(items, listColumns);
  } else if (viewMode === 'calendar') {
    renderPlaceholderView('Calendar');
  } else if (viewMode === 'analytics') {
    renderPlaceholderView('Analytics');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  renderSidebar();
  renderCurrentPage();
});
