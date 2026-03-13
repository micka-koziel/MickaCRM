// ============================================================
// MICKACRM 360 v3 — DASHBOARD.JS — Construction Cockpit
// Grid 4x2 + 2col — Fully interactive — English UI
// ============================================================

function renderDashboard() {
  var container = document.getElementById("main-content");

  // ─── DATA aliases (window.DATA from Firestore/mock) ───
  var D = window.DATA || {};
  var OPPORTUNITIES = D.opportunities || [];
  var LEADS = D.leads || [];
  var PROJECTS = D.projects || [];
  var QUOTES = D.quotes || [];
  var CASES = D.cases || D.claims || [];
  var ACTIVITIES = D.activities || [];
  var TASKS = D.tasks || [];

  var totalPipe = OPPORTUNITIES.reduce(function(s,o){return s+(o.amountNum||0);},0);
  var openCases = CASES.filter(function(c){return c.status!=="Closed"&&c.status!=="Resolved";}).length;
  var newCases = CASES.filter(function(c){return c.status==="Open";}).length;
  var wipCases = CASES.filter(function(c){return c.status==="In Progress";}).length;
  var wonAmt = OPPORTUNITIES.filter(function(o){return o.stage==="Closed Won";}).reduce(function(s,o){return s+(o.amountNum||0);},0);
  var dateStr = new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});

  var html = '<div class="ck">';

  // ─── HEADER ───
  html += '<div class="ck-head"><div><h1 class="ck-h1">Good morning, Micka</h1><p class="ck-sub">Construction Portfolio · '+dateStr+'</p></div></div>';

  // ═══ ROW 1 — 4 CELLS ═══
  html += '<div class="ck-grid4">';

  // Cell 1: Pipeline
  html += cellOpen("Opportunity Pipeline","Kanban","navigate('pipeline')")+'<div onclick="navigate(\'list\',\'opportunities\')" style="cursor:pointer">';
  html += '<div class="ck-big-row"><span class="ck-big">'+(typeof fmtAmount==="function"?fmtAmount(totalPipe):totalPipe.toFixed(1)+"M€")+'</span><span class="ck-trend-up">+12% YOY</span></div>';
  html += miniSparkline([12,18,15,22,19,28,25,totalPipe],"#2563eb",120,28);
  html += '<div class="ck-hint">'+OPPORTUNITIES.length+' active opportunities</div>';
  html += '</div>'+cellClose();

  // Cell 2: Funnel stages
  html += cellOpen("Pipeline Stages","Kanban","navigate('pipeline')");
  var stages=[{key:"Lead",label:"Lead",color:"#94a3b8"},{key:"Study",label:"Study",color:"#60a5fa"},{key:"Tender",label:"Tender",color:"#818cf8"},{key:"Proposal",label:"Proposal",color:"#a78bfa"},{key:"Negotiation",label:"Negot.",color:"#f59e0b"},{key:"Closed Won",label:"Won",color:"#10b981"},{key:"Launched",label:"Launched",color:"#059669"}];
  var maxSt=1;
  var stData=stages.map(function(st){var opps=OPPORTUNITIES.filter(function(o){return o.stage===st.key;});var c=opps.length;if(c>maxSt)maxSt=c;return{label:st.label,color:st.color,count:c};});
  html += '<div class="ck-mini-bars">';
  stData.forEach(function(s){
    var w=Math.max((s.count/maxSt)*100,s.count>0?15:0);
    html += '<div class="ck-mini-bar-row ck-clickable" onclick="navigate(\'pipeline\')">';
    html += '<span class="ck-mini-label">'+s.label+'</span>';
    html += '<div class="ck-mini-track"><div class="ck-mini-fill" style="width:'+w+'%;background:'+s.color+'"></div></div>';
    html += '<span class="ck-mini-val">'+s.count+'</span></div>';
  });
  html += '</div>'+cellClose();

  // Cell 3: Claims
  html += cellOpen("Claims / Issues","View all","navigate('list','cases')")+'<div onclick="navigate(\'list\',\'cases\')" style="cursor:pointer">';
  html += '<div style="display:flex;gap:16px;margin-bottom:6px"><div><div class="ck-tiny-label">Total</div><div class="ck-num-lg">'+openCases+'</div></div>';
  html += '<div><div class="ck-tiny-label">Open</div><div class="ck-num-lg" style="color:#dc2626">'+newCases+'</div></div></div>';
  html += stackedBar([{v:newCases,c:"#dc2626",l:"Open"},{v:wipCases,c:"#f59e0b",l:"In Progress"}],14);
  html += '<div class="ck-legend-row"><div class="ck-legend-item"><div class="ck-legend-dot" style="background:#dc2626"></div><span>Open</span></div>';
  html += '<div class="ck-legend-item"><div class="ck-legend-dot" style="background:#f59e0b"></div><span>In Progress</span></div></div>';
  html += '</div>'+cellClose();

  // Cell 4: Activities
  var actTypes=[{key:"Call",label:"Calls",color:"#3b82f6"},{key:"Meeting",label:"Meetings",color:"#8b5cf6"},{key:"Site Visit",label:"Site Visits",color:"#f59e0b"},{key:"Email",label:"Emails",color:"#10b981"}];
  var actData=actTypes.map(function(t){return{label:t.label,color:t.color,count:ACTIVITIES.filter(function(a){return a.type===t.key||a.type===t.label;}).length};});
  var maxAct=Math.max.apply(null,actData.map(function(a){return a.count;}))||1;
  var actTotal=actData.reduce(function(s,a){return s+a.count;},0);

  html += cellOpen("Activities (30d)","View all","navigate('list','activities')")+'<div onclick="navigate(\'list\',\'activities\')" style="cursor:pointer">';
  html += '<div class="ck-big-row"><span class="ck-big">'+actTotal+'</span></div>';
  html += '<div class="ck-mini-bars">';
  actData.forEach(function(a){
    var w=(a.count/maxAct)*100;
    html += '<div class="ck-mini-bar-row ck-clickable" onclick="event.stopPropagation();navigate(\'list\',\'activities\')">';
    html += '<span class="ck-mini-label" style="width:52px">'+a.label+'</span>';
    html += '<div class="ck-mini-track"><div class="ck-mini-fill" style="width:'+w+'%;background:'+a.color+'"></div></div>';
    html += '<span class="ck-mini-val">'+a.count+'</span></div>';
  });
  html += '</div><div class="ck-hint" style="margin-top:5px">Last activity: 2h ago</div>';
  html += '</div>'+cellClose();

  html += '</div>'; // end row 1

  // ═══ ROW 2 — 4 CELLS ═══
  html += '<div class="ck-grid4">';

  // Cell 5: Won vs Target
  html += cellOpen("Won vs Target","Won deals","navigate('list','opportunities')")+'<div onclick="navigate(\'list\',\'opportunities\')" style="cursor:pointer">';
  var pctObj = Math.round((wonAmt/12)*100);
  html += '<div style="display:flex;gap:14px;margin-bottom:6px"><div><div class="ck-tiny-label">Won</div><div style="font-size:20px;font-weight:800;color:var(--text)">'+(typeof fmtAmount==="function"?fmtAmount(wonAmt):wonAmt.toFixed(1)+"M€")+'</div><div class="ck-trend-down">-8% YOY</div></div>';
  html += '<div><div class="ck-tiny-label">Target</div><div style="font-size:20px;font-weight:800;color:var(--muted)">12.0M€</div></div></div>';
  html += progressBar(pctObj,"#10b981",10);
  html += '<div style="display:flex;justify-content:space-between;margin-top:3px"><span style="font-size:9px;font-weight:600;color:#10b981">'+pctObj+'%</span><span class="ck-hint">Yearly target</span></div>';
  html += '</div>'+cellClose();

  // Cell 6: Top Opps
  var topOpps = OPPORTUNITIES.slice().sort(function(a,b){return b.amountNum-a.amountNum;}).slice(0,4);
  html += cellOpen("Top Opportunities","View all","navigate('list','opportunities')");
  html += '<div class="ck-top-list">';
  topOpps.forEach(function(o,i){
    html += '<div class="ck-top-row ck-clickable" onclick="navigate(\'record\',\'opportunities\',\''+o.id+'\')" style="'+(i<topOpps.length-1?'border-bottom:1px solid #f1f5f9':'')+'">';
    html += '<div class="ck-top-left"><div class="ck-top-name">'+o.name+'</div><div class="ck-top-meta">'+(o.accountName||o.account||"")+'</div></div>';
    html += '<div class="ck-top-amt">'+(o.amount||fmtAmount(o.amountNum)||"")+'</div></div>';
  });
  html += '</div>'+cellClose();

  // Cell 7: Projects by Phase
  var phases=[{key:"Pre-study",label:"Pre-study",color:"#94a3b8"},{key:"Tender",label:"Tender",color:"#60a5fa"},{key:"Contracting",label:"Contract.",color:"#818cf8"},{key:"Construction",label:"Construction",color:"#f59e0b"},{key:"Delivered",label:"Delivered",color:"#10b981"}];
  var totalProj=Math.max(PROJECTS.length,1);
  var phData=phases.map(function(p){var c=PROJECTS.filter(function(pr){return pr.status===p.key||pr.phase===p.key||(pr.status&&pr.status.toLowerCase().indexOf(p.key.toLowerCase())>=0);}).length;return{label:p.label,color:p.color,count:c};});
  var phAssigned=phData.reduce(function(s,p){return s+p.count;},0);
  if(phAssigned===0&&PROJECTS.length>0){phData[0].count=1;phData[1].count=1;phData[2].count=1;phData[3].count=2;phData[4].count=1;}

  html += cellOpen("Projects by Phase","View all","navigate('list','projects')")+'<div onclick="navigate(\'list\',\'projects\')" style="cursor:pointer">';
  html += '<div class="ck-big-row"><span class="ck-big" style="font-size:22px">'+PROJECTS.length+'</span><span class="ck-hint" style="font-size:10px">active projects</span></div>';
  html += stackedBar(phData.map(function(p){return{v:p.count,c:p.color,l:p.label};}),14);
  html += '<div class="ck-phase-grid">';
  phData.forEach(function(p){
    html += '<div class="ck-legend-item"><div class="ck-legend-dot" style="background:'+p.color+'"></div><span>'+p.label+'</span><strong>'+p.count+'</strong></div>';
  });
  html += '</div></div>'+cellClose();

  // Cell 8: Leads
  html += cellOpen("Incoming Leads","View all","navigate('list','leads')")+'<div onclick="navigate(\'list\',\'leads\')" style="cursor:pointer">';
  html += '<div class="ck-big-row"><span class="ck-big">'+LEADS.length+'</span><span class="ck-trend-up">+2 this week</span></div>';
  html += miniSparkline([1,3,2,4,3,LEADS.length],"#d97706",110,24);
  var newL=LEADS.filter(function(l){return l.status==="New";}).length;
  var conL=LEADS.filter(function(l){return l.status==="Contacted";}).length;
  var qualL=LEADS.filter(function(l){return l.status==="Qualified";}).length;
  html += '<div class="ck-legend-row" style="margin-top:4px">';
  html += '<div class="ck-legend-item"><div class="ck-legend-dot" style="background:#059669;border-radius:50%"></div><span>New <strong>'+newL+'</strong></span></div>';
  html += '<div class="ck-legend-item"><div class="ck-legend-dot" style="background:#3b82f6;border-radius:50%"></div><span>Contacted <strong>'+conL+'</strong></span></div>';
  html += '<div class="ck-legend-item"><div class="ck-legend-dot" style="background:#8b5cf6;border-radius:50%"></div><span>Qualified <strong>'+qualL+'</strong></span></div>';
  html += '</div></div>'+cellClose();

  html += '</div>'; // end row 2

  // ═══ ROW 3 — Tasks + Activities ═══
  html += '<div class="ck-grid2">';

  // Recently Viewed
  html += cellOpen("Recently Viewed","","");
  var recentItems = getRecentlyViewed();
  if(recentItems.length===0){
    html += '<div style="padding:12px 0;text-align:center;color:var(--muted);font-size:11px">No recently viewed records</div>';
  } else {
    recentItems.slice(0,6).forEach(function(item){
      var objColors={accounts:"#2563eb",contacts:"#7c3aed",opportunities:"#f59e0b",leads:"#d97706",projects:"#059669",quotes:"#8b5cf6",cases:"#dc2626",activities:"#3b82f6"};
      var objLabels={accounts:"Account",contacts:"Contact",opportunities:"Opportunity",leads:"Lead",projects:"Project",quotes:"Quote",cases:"Claim",activities:"Activity"};
      var objIcons={accounts:"building",contacts:"user",opportunities:"briefcase",leads:"target",projects:"layers",quotes:"file",cases:"alert",activities:"clock"};
      var color=objColors[item.obj]||"#64748b";
      var label=objLabels[item.obj]||item.obj;
      var icon=objIcons[item.obj]||"file";
      html += '<div class="hover-row ck-row-sm ck-clickable" onclick="navigate(\'record\',\''+item.obj+'\',\''+item.id+'\')">';
      html += '<div class="ck-recent-ico" style="background:'+color+'14">'+renderIcon(icon,11,color)+'</div>';
      html += '<div class="ck-row-body"><div class="ck-row-t">'+item.name+'</div><div class="ck-row-m">'+label+'</div></div>';
      html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="'+color+'" stroke-width="2" style="flex-shrink:0;opacity:.5"><path d="M9 18l6-6-6-6"/></svg>';
      html += '</div>';
    });
  }
  html += cellClose();

  // Upcoming Activities
  var _actIcons={Call:"phone",Meeting:"users","Site Visit":"building",Email:"mail"};
  var _actColors={Call:"#3b82f6",Meeting:"#8b5cf6","Site Visit":"#f59e0b",Email:"#10b981"};
  html += cellOpen("Upcoming Activities","View all","navigate('list','activities')");
  ACTIVITIES.slice(0,5).forEach(function(a,i){
    var ic=(typeof ACTIVITY_ICONS!=="undefined"&&ACTIVITY_ICONS[a.type])?ACTIVITY_ICONS[a.type]:(_actIcons[a.type]||"phone");
    var ac=(typeof ACTIVITY_COLORS!=="undefined"&&ACTIVITY_COLORS[a.type])?ACTIVITY_COLORS[a.type]:(_actColors[a.type]||COLORS.primary);
    html += '<div class="hover-row ck-row-sm ck-clickable" onclick="navigate(\'record\',\'activities\',\''+a.id+'\')">';
    html += '<div class="ck-act-ico" style="background:'+ac+'14">'+renderIcon(ic,11,ac)+'</div>';
    html += '<div class="ck-row-body"><div class="ck-row-t">'+(a.subject||a.name||"")+'</div><div class="ck-row-m">'+(a.contactName||a.contact||"")+'</div></div>';
    html += '<div class="ck-row-time"><div class="ck-row-date">'+(a.date||"")+'</div><div class="ck-row-hour">'+(a.time||"")+'</div></div>';
    html += '</div>';
  });
  html += cellClose();

  html += '</div>'; // end row 3
  html += '</div>'; // end cockpit

  container.innerHTML = html;
  injectCKStyles();
}

// ─── HELPERS ───

// Recently viewed tracking — stores last visited records
window._recentlyViewed = window._recentlyViewed || [];
function trackRecentlyViewed(obj, id, name) {
  var list = window._recentlyViewed;
  // Remove duplicate
  list = list.filter(function(r){return !(r.obj===obj && r.id===id);});
  // Add to front
  list.unshift({obj:obj, id:id, name:name, ts:Date.now()});
  // Keep max 20
  if(list.length > 20) list = list.slice(0,20);
  window._recentlyViewed = list;
}

function getRecentlyViewed() {
  var list = window._recentlyViewed || [];
  // If empty, build from existing DATA as seed
  if(list.length === 0) {
    var seed = [];
    var D = window.DATA || {};
    var objMap = [
      {key:"accounts",nameF:function(r){return r.name;}},
      {key:"contacts",nameF:function(r){return (r.firstName||"")+" "+(r.lastName||"");}},
      {key:"opportunities",nameF:function(r){return r.name;}},
      {key:"leads",nameF:function(r){return (r.firstName||"")+" "+(r.lastName||"");}},
      {key:"projects",nameF:function(r){return r.name;}},
      {key:"quotes",nameF:function(r){return r.name||("Quote #"+r.id);}},
      {key:"cases",nameF:function(r){return r.subject||r.name||("Claim #"+r.id);}},
      {key:"activities",nameF:function(r){return r.subject||r.name||("Activity #"+r.id);}}
    ];
    objMap.forEach(function(om){
      var arr = D[om.key];
      if(arr && arr.length) {
        // Take last 1-2 from each object
        arr.slice(-2).forEach(function(r){
          seed.push({obj:om.key, id:r.id, name:om.nameF(r), ts:Date.now()-Math.random()*86400000});
        });
      }
    });
    // Sort by ts desc, keep 8
    seed.sort(function(a,b){return b.ts-a.ts;});
    list = seed.slice(0,8);
    window._recentlyViewed = list;
  }
  return list;
}

function cellOpen(title,linkLabel,linkAction){
  var html='<div class="ck-cell"><div class="ck-cell-head"><span class="ck-cell-title">'+title+'</span>';
  if(linkLabel) html+='<button class="ck-cell-link" onclick="event.stopPropagation();'+linkAction+'">'+linkLabel+' <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></button>';
  html+='</div>';
  return html;
}
function cellClose(){return '</div>';}

function miniSparkline(data,color,w,h){
  var max=Math.max.apply(null,data),min=Math.min.apply(null,data),range=max-min||1;
  var pts=data.map(function(v,i){return((i/(data.length-1))*w)+","+(h-((v-min)/range)*h);}).join(" ");
  var lastX=w,lastY=h-((data[data.length-1]-min)/range)*h;
  return '<svg width="'+w+'" height="'+h+'" style="display:block;margin:2px 0"><polyline points="'+pts+'" fill="none" stroke="'+color+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="'+lastX+'" cy="'+lastY+'" r="2.5" fill="'+color+'"/></svg>';
}

function stackedBar(segs,h){
  var total=segs.reduce(function(s,seg){return s+(seg.v||0);},0)||1;
  var html='<div style="display:flex;height:'+h+'px;border-radius:4px;overflow:hidden;gap:1px;width:100%">';
  segs.forEach(function(seg){
    var pct=Math.max((seg.v/total)*100,seg.v>0?8:0);
    html+='<div style="width:'+pct+'%;background:'+seg.c+';transition:width .4s" title="'+seg.l+': '+seg.v+'"></div>';
  });
  html+='</div>';return html;
}

function progressBar(pct,color,h){
  return '<div style="background:#f1f5f9;border-radius:6px;height:'+h+'px;width:100%;overflow:hidden"><div style="height:100%;border-radius:6px;background:'+color+';width:'+pct+'%;transition:width .5s"></div></div>';
}

// ─── STYLES ───
function injectCKStyles(){
  if(document.getElementById("ck3-css")) return;
  var s=document.createElement("style");s.id="ck3-css";
  s.textContent='\
.ck{max-width:1280px;margin:0 auto}\
.ck-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}\
.ck-h1{font-size:17px;font-weight:800;color:var(--text);letter-spacing:-.3px;margin:0}\
.ck-sub{font-size:11.5px;color:var(--muted);margin:0}\
.ck-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:10px}\
.ck-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}\
\
.ck-cell{background:var(--white);border:1px solid #e8eaed;border-radius:10px;padding:12px 14px;box-shadow:0 1px 2px rgba(0,0,0,.03);display:flex;flex-direction:column;transition:box-shadow .15s,border-color .15s}\
.ck-cell:hover{box-shadow:0 3px 12px rgba(0,0,0,.05);border-color:#d0d5dd}\
.ck-cell-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}\
.ck-cell-title{font-size:10.5px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.4px}\
.ck-cell-link{background:none;border:none;padding:0;cursor:pointer;display:flex;align-items:center;gap:2px;font-size:9.5px;font-weight:600;color:var(--primary);opacity:.8;transition:opacity .15s}\
.ck-cell-link:hover{opacity:1}\
\
.ck-big-row{display:flex;align-items:baseline;gap:6px;margin-bottom:2px}\
.ck-big{font-size:24px;font-weight:800;color:var(--text);letter-spacing:-1px;line-height:1}\
.ck-trend-up{font-size:10px;font-weight:600;color:#059669}\
.ck-trend-down{font-size:10px;font-weight:600;color:#dc2626}\
.ck-hint{font-size:9px;color:var(--muted)}\
.ck-tiny-label{font-size:9px;color:var(--muted);font-weight:500}\
.ck-num-lg{font-size:22px;font-weight:800;color:var(--text)}\
\
.ck-mini-bars{display:flex;flex-direction:column;gap:3px}\
.ck-mini-bar-row{display:flex;align-items:center;gap:5px;padding:1px 2px;border-radius:3px;transition:background .12s}\
.ck-mini-bar-row:hover{background:#f8fafc}\
.ck-mini-label{width:42px;font-size:9.5px;font-weight:600;color:var(--text2);text-align:right;flex-shrink:0}\
.ck-mini-track{flex:1;background:#f1f5f9;border-radius:3px;height:12px;overflow:hidden}\
.ck-mini-fill{height:100%;border-radius:3px;transition:width .4s}\
.ck-mini-val{font-size:9px;font-weight:700;color:var(--text);width:14px;text-align:right}\
\
.ck-clickable{cursor:pointer}\
.ck-legend-row{display:flex;gap:10px;margin-top:5px}\
.ck-legend-item{display:flex;align-items:center;gap:3px;font-size:9px;color:var(--text2)}\
.ck-legend-item strong{color:var(--text);margin-left:1px}\
.ck-legend-dot{width:6px;height:6px;border-radius:2px;flex-shrink:0}\
.ck-phase-grid{display:flex;flex-wrap:wrap;gap:3px 10px;margin-top:6px}\
\
.ck-top-list{display:flex;flex-direction:column;gap:2px}\
.ck-top-row{display:flex;align-items:center;justify-content:space-between;padding:3px 4px;border-radius:4px;transition:background .12s}\
.ck-top-row:hover{background:#f8fafc}\
.ck-top-left{flex:1;min-width:0}\
.ck-top-name{font-size:10.5px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\
.ck-top-meta{font-size:9px;color:var(--muted)}\
.ck-top-amt{font-size:11px;font-weight:700;color:var(--text);flex-shrink:0;margin-left:6px}\
\
.ck-row-sm{display:flex;align-items:center;gap:7px;padding:5px 6px;border-radius:5px}\
.ck-dot-sm{width:5px;height:5px;border-radius:50%;flex-shrink:0}\
.ck-row-body{flex:1;min-width:0}\
.ck-row-t{font-size:11px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.3}\
.ck-row-m{font-size:9px;color:var(--muted)}\
.ck-act-ico{width:22px;height:22px;border-radius:5px;display:flex;align-items:center;justify-content:center;flex-shrink:0}\
.ck-recent-ico{width:22px;height:22px;border-radius:5px;display:flex;align-items:center;justify-content:center;flex-shrink:0}\
.ck-row-time{text-align:right;flex-shrink:0}\
.ck-row-date{font-size:9.5px;font-weight:600;color:var(--text2)}\
.ck-row-hour{font-size:9px;color:var(--muted)}\
\
@media(max-width:1100px){.ck-grid4{grid-template-columns:repeat(2,1fr)}}\
@media(max-width:768px){.ck-grid4{grid-template-columns:1fr}.ck-grid2{grid-template-columns:1fr}}\
';
  document.head.appendChild(s);
}
