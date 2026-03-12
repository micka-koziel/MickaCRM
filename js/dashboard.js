/* dashboard.js — Cockpit Dashboard */

function ckHeader(title, linkText, linkPage) {
  return '<div style="display:flex;justify-content:space-between;align-items:center"><span class="ck-title">'+title+'</span><a class="ck-link" onclick="navigate(\''+linkPage+'\')">'+linkText+' '+svgIcon('arrowUp',11,'var(--accent)')+'</a></div>';
}
function ckSparkline(data, color, w, h) {
  color=color||'var(--accent)'; w=w||110; h=h||28;
  var mx=Math.max.apply(null,data), mn=Math.min.apply(null,data), r=mx-mn||1;
  var pts=data.map(function(v,i){return (i/(data.length-1))*w+','+(h-((v-mn)/r)*(h-4)-2);}).join(' ');
  return '<svg width="'+w+'" height="'+h+'"><polyline points="'+pts+'" fill="none" stroke="'+color+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
function ckHBar(label, value, max, color, count) {
  var pct=max>0?(value/max)*100:0;
  return '<div class="ck-hbar"><span class="ck-hbar-label">'+label+'</span><div class="ck-hbar-track"><div class="ck-hbar-fill" style="width:'+Math.max(pct,2)+'%;background:'+color+'"></div></div><span class="ck-hbar-count">'+count+'</span></div>';
}
function ckStackedBar(segs) {
  var t=segs.reduce(function(s,g){return s+g.value;},0);
  return '<div class="ck-sbar">'+segs.filter(function(g){return g.value>0;}).map(function(g){return '<div class="ck-sbar-seg" style="width:'+(g.value/t*100)+'%;background:'+g.color+'" title="'+g.label+': '+g.value+'"></div>';}).join('')+'</div>';
}
function ckProgressBar(pct,color) {
  return '<div class="ck-pbar"><div class="ck-pbar-fill" style="width:'+Math.min(pct,100)+'%;background:'+(color||'var(--success)')+'"></div></div>';
}
function ckLegend(items,round) {
  return '<div class="ck-legend">'+items.map(function(it){return '<span class="ck-legend-item"><span class="ck-legend-dot '+(round?'round':'')+'" style="background:'+it.color+'"></span>'+it.label+(it.value!=null?' '+it.value:'')+'</span>';}).join('')+'</div>';
}
function fmtAmount(n) { if(n>=1e6) return (n/1e6).toFixed(1)+'M€'; if(n>=1e3) return (n/1e3).toFixed(0)+'K€'; return n+'€'; }

function renderDashboard(container) {
  var opps=window.DATA.opportunities||[], leads=window.DATA.leads||[], projects=window.DATA.projects||[], tasks=window.DATA.tasks||[], upcoming=window.DATA.upcoming||[];
  var totalP=opps.reduce(function(s,o){return s+(o.amount||0);},0);
  var wonAmt=opps.filter(function(o){return o.stage==='closed_won';}).reduce(function(s,o){return s+(o.amount||0);},0);
  var stgs=STAGES.opportunities||[];
  var sc=stgs.map(function(st){return{key:st.key,label:st.label,color:st.color,count:opps.filter(function(o){return o.stage===st.key;}).length};});
  var mxSC=Math.max.apply(null,sc.map(function(s){return s.count;}).concat([1]));
  var top3=opps.slice().sort(function(a,b){return(b.amount||0)-(a.amount||0);}).slice(0,3);
  var phs=(STAGES.projects||[]).map(function(p){return{key:p.key,label:p.label,color:p.color,value:projects.filter(function(pr){return pr.phase===p.key;}).length};});
  var lN=leads.filter(function(l){return l.stage==='new';}).length;
  var lC=leads.filter(function(l){return l.stage==='contacted';}).length;
  var lQ=leads.filter(function(l){return l.stage==='qualified';}).length;

  container.innerHTML='<div class="ck-dashboard">'+
  '<div class="ck-row r4">'+
    '<div class="ck-card" style="gap:6px">'+ckHeader('Opportunity Pipeline','Kanban','opportunities')+'<div style="display:flex;align-items:baseline;gap:8px"><span style="font-size:26px;font-weight:700;letter-spacing:-.03em">'+fmtAmount(totalP)+'</span><span style="font-size:12px;font-weight:600;color:var(--success)">+12% YOY</span></div>'+ckSparkline([120,140,135,155,165,170,180,200],'var(--accent)',110,28)+'<span class="ck-hint">'+opps.length+' active opportunities</span></div>'+
    '<div class="ck-card" style="gap:5px"><div style="margin-bottom:2px">'+ckHeader('Pipeline Stages','Kanban','opportunities')+'</div>'+sc.map(function(s){return ckHBar(s.label,s.count,mxSC,s.color,s.count);}).join('')+'</div>'+
    '<div class="ck-card" style="gap:7px">'+ckHeader('Claims / Issues','View all','claims')+'<div style="display:flex;gap:14px;align-items:baseline"><div><span style="font-size:9px;color:var(--text-light);display:block">Total</span><span style="font-size:26px;font-weight:700">2</span></div><div><span style="font-size:9px;color:var(--text-light);display:block">Open</span><span style="font-size:26px;font-weight:700;color:var(--warning)">1</span></div></div>'+ckStackedBar([{value:1,color:'var(--danger)',label:'Open'},{value:1,color:'var(--warning)',label:'In Progress'}])+ckLegend([{color:'var(--danger)',label:'Open'},{color:'var(--warning)',label:'In Progress'}])+'</div>'+
    '<div class="ck-card" style="gap:5px">'+ckHeader('Activities (30D)','View all','activities')+'<span style="font-size:26px;font-weight:700">10</span>'+ckHBar('Calls',2,4,'#3b82f6',2)+ckHBar('Meetings',4,4,'var(--purple)',4)+ckHBar('Site Visits',2,4,'var(--success)',2)+ckHBar('Emails',2,4,'#10b981',2)+'<span class="ck-hint">Last activity: 2h ago</span></div>'+
  '</div>'+
  '<div class="ck-row r4">'+
    '<div class="ck-card" style="gap:5px">'+ckHeader('Won vs Target','Won deals','opportunities')+'<div style="display:flex;gap:14px;align-items:baseline"><div><span style="font-size:9px;color:var(--text-light);display:block">Won</span><span style="font-size:20px;font-weight:700">'+fmtAmount(wonAmt)+'</span></div><div><span style="font-size:9px;color:var(--text-light);display:block">Target</span><span style="font-size:20px;font-weight:700">12.0M€</span></div></div><span style="font-size:11px;font-weight:600;color:var(--danger)">-8% YOY</span>'+ckProgressBar(100,'var(--success)')+'<div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text-light)"><span>317%</span><span>Yearly target</span></div></div>'+
    '<div class="ck-card no-pad"><div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px 8px"><span class="ck-title">Top Opportunities</span><a class="ck-link" onclick="navigate(\'opportunities\')">View all '+svgIcon('arrowUp',11,'var(--accent)')+'</a></div>'+top3.map(function(o){var a=(window.DATA.accounts||[]).find(function(x){return x.id===o.account;});return'<div class="ck-list-row"><div style="min-width:0;flex:1;margin-right:8px"><div class="row-name">'+o.name+'</div><div class="row-sub">'+(a?a.name:'')+'</div></div><span class="row-value">'+fmtAmount(o.amount||0)+'</span></div>';}).join('')+'</div>'+
    '<div class="ck-card" style="gap:5px">'+ckHeader('Projects by Phase','View all','projects')+'<div style="display:flex;align-items:baseline;gap:6px"><span class="ck-big">'+projects.length+'</span><span style="font-size:11px;color:var(--text-muted)">active projects</span></div>'+ckStackedBar(phs)+ckLegend(phs.map(function(p){return{color:p.color,label:p.label,value:p.value};}))+'</div>'+
    '<div class="ck-card" style="gap:5px">'+ckHeader('Incoming Leads','View all','leads')+'<div style="display:flex;align-items:baseline;gap:8px"><span class="ck-big">'+leads.length+'</span><span style="font-size:12px;font-weight:600;color:var(--success)">+2 this week</span></div>'+ckSparkline([1,2,1,3,2,leads.length],'var(--success)',100,22)+ckLegend([{color:'var(--success)',label:'New',value:lN},{color:'#3b82f6',label:'Contacted',value:lC},{color:'var(--purple)',label:'Qualified',value:lQ}],true)+'</div>'+
  '</div>'+
  '<div class="ck-row r2">'+
    '<div class="ck-card no-pad"><div style="display:flex;justify-content:space-between;align-items:center;padding:11px 14px 9px"><span class="ck-title">My Open Tasks</span><a class="ck-link">View all '+svgIcon('arrowUp',11,'var(--accent)')+'</a></div>'+tasks.map(function(t){return'<div class="ck-task-row"><div style="display:flex;align-items:flex-start;gap:8px"><span class="ck-task-dot" style="background:'+t.color+'"></span><div><div class="ck-task-name">'+t.name+'</div><div class="ck-task-ref">'+t.ref+'</div></div></div><span class="ck-task-status" style="color:'+(t.status==='In Progress'?'var(--accent)':'var(--text-muted)')+'">'+t.status+'</span></div>';}).join('')+'</div>'+
    '<div class="ck-card no-pad"><div style="display:flex;justify-content:space-between;align-items:center;padding:11px 14px 9px"><span class="ck-title">Upcoming Activities</span><a class="ck-link">View all '+svgIcon('arrowUp',11,'var(--accent)')+'</a></div>'+upcoming.map(function(u){return'<div class="ck-act-row"><div style="display:flex;align-items:center;gap:9px"><div class="ck-act-icon" style="background:'+u.color+'14">'+svgIcon(u.icon,13,u.color)+'</div><div><div class="ck-act-name">'+u.name+'</div><div class="ck-act-contact">'+u.contact+'</div></div></div><div style="text-align:right"><div class="ck-act-date">'+u.date+'</div><div class="ck-act-time">'+u.time+'</div></div></div>';}).join('')+'</div>'+
  '</div></div>';
}
