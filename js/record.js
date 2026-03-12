/* ═══════════════════════════════════════════════════════
   record.js — Record Detail Views (Account 360 + Generic)
   ═══════════════════════════════════════════════════════ */

function renderRecordPage(objKey, recId, headerEl, contentEl) {
  var data = window.DATA[objKey];
  if (!data) { contentEl.innerHTML = '<div class="placeholder-view">Object not found</div>'; return; }
  var rec = data.find(function(r) { return r.id === recId; });
  if (!rec) { contentEl.innerHTML = '<div class="placeholder-view">Record not found</div>'; return; }

  if (objKey === 'accounts') {
    headerEl.style.display = 'none';
    renderAccount360(contentEl, rec);
    return;
  }

  renderGenericRecord(objKey, rec, headerEl, contentEl);
}

/* ════════════════════════════════════════════════════════
   ACCOUNT 360
   ════════════════════════════════════════════════════════ */

function renderAccount360(container, rec) {
  injectA360Styles();
  var D = window.DATA;
  var accId = rec.id;
  var accName = rec.name;
  var initials = accName.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase();

  var contacts = (D.contacts||[]).filter(function(c){ return c.account === accId; });
  var opps = (D.opportunities||[]).filter(function(o){ return o.account === accId; });
  var projects = (D.projects||[]).filter(function(p){ return p.account === accId; });
  var upcoming = (D.upcoming||[]).slice(0, 6);

  var totalPipe = opps.reduce(function(s,o){ return s + (o.amount||0); }, 0);
  var pipeStr = typeof fmtAmount === 'function' ? fmtAmount(totalPipe) : (totalPipe/1000000).toFixed(1)+'M€';

  var h = '<div class="a360">';

  // Back nav
  h += '<div class="a360-back" id="a360-back">' + svgIcon('arrowLeft',14,'var(--text-muted)') + '<span>Accounts</span></div>';

  // Header card
  h += '<div class="a360-header-card">';
  h += '<div class="a360-header-top">';
  h += '<div class="a360-avatar">' + initials + '</div>';
  h += '<div class="a360-header-info">';
  h += '<div class="a360-name-row"><h1 class="a360-name">' + accName + '</h1>';
  var sc = rec.status==='Active' ? 'var(--success)' : 'var(--text-light)';
  h += '<span class="stage-badge" style="color:'+sc+'"><span class="dot" style="background:'+sc+'"></span>'+rec.status+'</span>';
  h += '</div>';
  h += '<div class="a360-meta"><span>' + (rec.industry||'—') + '</span><span class="a360-dot">·</span><span>' + (rec.city||'—') + '</span></div>';
  h += '</div>';

  h += '<div class="a360-header-metrics">';
  h += a360HMetric(pipeStr, 'Pipeline', 'var(--accent)');
  h += a360HMetric(projects.length, 'Projects', '');
  h += a360HMetric(opps.length, 'Opps', '');
  h += a360HMetric(contacts.length, 'Contacts', '');
  h += '</div></div>';

  h += '<div class="a360-header-actions"><div class="a360-qa-row">';
  h += a360QA('contacts','Contact') + a360QA('opportunities','Opportunity') + a360QA('quotes','Quote') + a360QA('activities','Activity') + a360QA('projects','Project');
  h += '</div></div></div>';

  // KPIs dark
  h += '<div class="a360-kpi-grid">';
  h += a360Kpi(pipeStr, 'Pipeline Value', 'opportunities', opps.length+' opportunities', 'neutral');
  h += a360Kpi(opps.length, 'Open Opportunities', 'opportunities', '+1 this month', 'positive');
  h += a360Kpi(projects.length, 'Active Projects', 'projects', projects.length>0?'On track':'No projects', 'neutral');
  h += a360Kpi(contacts.length, 'Key Contacts', 'contacts', contacts.length>0?'Updated':'Add contacts', 'neutral');
  h += a360Kpi(upcoming.length, 'Activities', 'activities', upcoming.length>0?'Last: recently':'No activity', upcoming.length>0?'neutral':'warning');
  h += '</div>';

  // 2 columns
  h += '<div class="a360-grid2"><div class="a360-col">';

  // Opps
  h += a360SectionOpen('Opportunities', 'opportunities', opps.length);
  if (!opps.length) h += '<div class="a360-empty">No opportunities</div>';
  else opps.forEach(function(o,i) {
    var st = (STAGES.opportunities||[]).find(function(s){return s.key===o.stage;});
    var amtStr = typeof fmtAmount==='function' ? fmtAmount(o.amount||0) : ((o.amount||0)/1000000).toFixed(1)+'M€';
    h += '<div class="a360-row'+(i===opps.length-1?' a360-row-last':'')+'" data-nav-obj="opportunities" data-nav-id="'+o.id+'">';
    h += '<div class="a360-row-left"><div class="a360-row-title">'+o.name+'</div>';
    h += '<div class="a360-row-sub">Close '+fmtDate(o.close)+' · Prob '+(o.prob||0)+'%</div></div>';
    h += '<div class="a360-row-right"><div class="a360-row-amount">'+amtStr+'</div>';
    if(st) h+='<span class="stage-badge" style="color:'+st.color+'"><span class="dot" style="background:'+st.color+'"></span>'+st.label+'</span>';
    h += '</div></div>';
    h += a360StageDots(o.stage);
  });
  h += '</div>';

  // Projects
  h += a360SectionOpen('Projects', 'projects', projects.length);
  if (!projects.length) h += '<div class="a360-empty">No projects</div>';
  else projects.forEach(function(p,i) {
    var ph = (STAGES.projects||[]).find(function(s){return s.key===p.phase;});
    var budStr = typeof fmtAmount==='function' ? fmtAmount(p.budget||0) : ((p.budget||0)/1000000).toFixed(1)+'M€';
    h += '<div class="a360-row'+(i===projects.length-1?' a360-row-last':'')+'" data-nav-obj="projects" data-nav-id="'+p.id+'">';
    h += '<div class="a360-row-left"><div class="a360-row-title">'+p.name+'</div>';
    h += '<div class="a360-row-sub">'+(ph?ph.label:'—')+'</div></div>';
    h += '<div class="a360-row-right"><div class="a360-row-amount">'+budStr+'</div>';
    if(ph) h+='<span class="stage-badge" style="color:'+ph.color+'"><span class="dot" style="background:'+ph.color+'"></span>'+ph.label+'</span>';
    h += '</div></div>';
  });
  h += '</div>';

  h += '</div><div class="a360-col">';

  // Contacts
  h += a360SectionOpen('Key Contacts', 'contacts', contacts.length);
  if (!contacts.length) h += '<div class="a360-empty">No contacts</div>';
  else contacts.forEach(function(c,i) {
    var ci = c.name?c.name.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase():'?';
    h += '<div class="a360-row'+(i===contacts.length-1?' a360-row-last':'')+'" data-nav-obj="contacts" data-nav-id="'+c.id+'">';
    h += '<div class="a360-contact-avatar">'+ci+'</div>';
    h += '<div class="a360-row-left" style="flex:1;min-width:0"><div class="a360-row-title">'+c.name+'</div>';
    h += '<div class="a360-row-sub">'+(c.role||'—')+'</div></div>';
    h += '<div class="a360-contact-actions">';
    h += '<div class="a360-contact-btn" title="Call">'+svgIcon('phone',12,'var(--text-light)')+'</div>';
    h += '<div class="a360-contact-btn" title="Email">'+svgIcon('mail',12,'var(--text-light)')+'</div>';
    h += '</div></div>';
  });
  h += '</div>';

  // Timeline
  h += a360SectionOpen('Recent Activities', 'activities', upcoming.length);
  if (!upcoming.length) h += '<div class="a360-empty">No activities</div>';
  else {
    h += '<div class="a360-timeline">';
    upcoming.forEach(function(a,i) {
      var isLast = i===upcoming.length-1;
      h += '<div class="a360-tl-item">';
      if(!isLast) h += '<div class="a360-tl-line"></div>';
      h += '<div class="a360-tl-dot"></div><div class="a360-tl-body">';
      h += '<div class="a360-tl-top"><span class="a360-tl-subject">'+a.name+'</span><span class="a360-tl-date">'+(a.date||'')+'</span></div>';
      h += '<div class="a360-tl-meta">'+(a.contact||'')+(a.time?' · '+a.time:'')+'</div>';
      h += '</div></div>';
    });
    h += '</div>';
  }
  h += '</div>';

  h += '</div></div></div>';

  container.innerHTML = h;
  container.scrollTop = 0;

  // Bind events
  document.getElementById('a360-back').addEventListener('click', function(){ navigate('accounts'); });
  container.querySelectorAll('.a360-row[data-nav-id]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate('record', el.getAttribute('data-nav-obj'), el.getAttribute('data-nav-id')); });
  });
  container.querySelectorAll('.a360-section-link[data-nav]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate(el.getAttribute('data-nav')); });
  });
  container.querySelectorAll('.a360-kpi-card[data-nav]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate(el.getAttribute('data-nav')); });
  });
}

// ─── Helpers ───
function a360HMetric(v,l,a){var s=a?'color:'+a:'color:var(--text)';return '<div class="a360-hmetric"><div class="a360-hmetric-val" style="'+s+'">'+v+'</div><div class="a360-hmetric-label">'+l+'</div></div>';}
function a360QA(i,l){return '<button class="a360-qa">'+svgIcon(i,12,'var(--text-light)')+'<span>'+l+'</span></button>';}
function a360Kpi(v,l,n,ins,t){var c=t==='positive'?'#4ade80':t==='warning'?'#f87171':'#64748b';return '<div class="a360-kpi-card" data-nav="'+n+'"><div class="a360-kpi-top">'+svgIcon('chart',15,'#64748b')+'<span class="a360-kpi-view">View all</span></div><div class="a360-kpi-value">'+v+'</div><div class="a360-kpi-label">'+l+'</div>'+(ins?'<div class="a360-kpi-insight"><span class="a360-kpi-insight-dot" style="background:'+c+'"></span><span style="color:'+c+'">'+ins+'</span></div>':'')+'</div>';}
function a360SectionOpen(t,n,c){return '<div class="a360-section"><div class="a360-section-head"><span class="a360-section-title">'+t+'</span>'+(c!==undefined?'<span class="a360-section-count">'+c+'</span>':'')+'<span class="a360-section-link" data-nav="'+n+'">View all</span></div>';}
function a360StageDots(sk){var st=STAGES.opportunities||[];var ks=st.map(function(s){return s.key;});var idx=ks.indexOf(sk);var h='<div class="a360-stage-dots">';ks.forEach(function(k,i){var a=i<=idx;h+='<div class="a360-stage-dot" style="background:'+(a?'var(--accent)':'#e8e8eb')+';opacity:'+(a?(.25+(i/(ks.length-1))*.75):1)+'"></div>';});return h+'</div>';}

/* ════════════════════════════════════════════════════════
   GENERIC RECORD
   ════════════════════════════════════════════════════════ */

function renderGenericRecord(objKey, rec, headerEl, contentEl) {
  var cfg = OBJ_CONFIG ? OBJ_CONFIG[objKey] : null;
  var title = rec.name || rec.id;
  var parentLabel = cfg ? cfg.title : objKey;

  headerEl.innerHTML = '<div class="obj-header"><div class="obj-header-left">'+
    '<button class="rec-back-btn" id="rec-back">'+svgIcon('arrowLeft',14)+'</button>'+
    '<div><h1 style="font-size:16px">'+title+'</h1>'+
    '<div style="font-size:11px;color:var(--text-light)">'+parentLabel+'</div></div></div></div>';

  document.getElementById('rec-back').addEventListener('click', function(){ navigate(objKey); });

  var fields = Object.keys(rec).filter(function(k){return k!=='id';});
  var html = '<div style="padding:14px 18px;max-width:800px"><div class="rec-detail-card"><div class="rec-fields">';

  fields.forEach(function(k) {
    var v = rec[k];
    var label = k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g,' $1');
    var display = '';

    if (k==='account') { display = getAccountName(v); }
    else if (k==='amount'||k==='pipeline'||k==='budget'||k==='estimatedValue') { display = typeof fmtAmount==='function' ? fmtAmount(v) : String(v); }
    else if (k==='stage'||k==='phase') {
      var arr = STAGES[objKey]||STAGES.projects||[];
      var st = arr.find(function(s){return s.key===v;});
      display = st ? '<span class="stage-badge" style="color:'+st.color+'"><span class="dot" style="background:'+st.color+'"></span>'+st.label+'</span>' : (v||'—');
    } else if (k==='status') {
      var col = v==='Active'?'var(--success)':'var(--text-light)';
      display = '<span class="stage-badge" style="color:'+col+'"><span class="dot" style="background:'+col+'"></span>'+v+'</span>';
    } else if (k==='close'||k==='start'||k==='end') { display = v ? fmtDate(v) : '—'; }
    else { display = v!==undefined&&v!==null&&v!=='' ? String(v) : '—'; }

    html += '<div class="rec-field"><div class="rec-field-label">'+label+'</div><div class="rec-field-value">'+display+'</div></div>';
  });

  html += '</div></div></div>';
  contentEl.innerHTML = html;
}

/* ════════════════════════════════════════════════════════
   CSS INJECTION
   ════════════════════════════════════════════════════════ */

function injectA360Styles() {
  if (document.getElementById('a360-css')) return;
  var s = document.createElement('style'); s.id = 'a360-css';
  s.textContent = '\
.a360{max-width:1140px;margin:0 auto;padding:14px 18px 48px}\
.a360-back{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;color:var(--text-muted);cursor:pointer;padding:4px 0;margin-bottom:10px;transition:color .12s}\
.a360-back:hover{color:var(--accent)}\
.a360-header-card{background:var(--card);border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.05);border:1px solid var(--border);margin-bottom:14px;overflow:hidden}\
.a360-header-top{padding:18px 22px;display:flex;gap:16px;align-items:center}\
.a360-avatar{width:52px;height:52px;border-radius:10px;background:#f0f0f2;border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:17px;font-weight:800;color:var(--text-muted);letter-spacing:-.5px}\
.a360-header-info{flex:1;min-width:0}\
.a360-name-row{display:flex;align-items:center;gap:10px;margin-bottom:5px}\
.a360-name{font-size:24px;font-weight:800;color:var(--text);letter-spacing:-.6px;margin:0;line-height:1}\
.a360-meta{display:flex;gap:14px;font-size:11.5px;color:var(--text-muted);flex-wrap:wrap}\
.a360-dot{color:var(--text-light)}\
.a360-header-metrics{display:flex;align-items:center;flex-shrink:0}\
.a360-hmetric{display:flex;flex-direction:column;align-items:center;padding:0 16px;border-left:1px solid var(--border)}\
.a360-hmetric-val{font-size:18px;font-weight:800;letter-spacing:-.5px;line-height:1;font-variant-numeric:tabular-nums}\
.a360-hmetric-label{font-size:9px;color:var(--text-light);font-weight:500;margin-top:2px;text-transform:uppercase;letter-spacing:.3px}\
.a360-header-actions{padding:10px 22px;border-top:1px solid var(--border);display:flex;align-items:center}\
.a360-qa-row{display:flex;gap:6px}\
.a360-qa{display:flex;align-items:center;gap:5px;background:transparent;border:1px solid var(--border);padding:5px 11px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:500;color:var(--text-muted);font-family:inherit;transition:all .12s}\
.a360-qa:hover{background:#f0f0f2;border-color:#ccc;color:var(--text)}\
.a360-kpi-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:16px}\
.a360-kpi-card{background:var(--dark);border-radius:10px;padding:18px 20px 16px;border:1px solid #1e293b;box-shadow:0 2px 8px rgba(0,0,0,.18);cursor:pointer;transition:all .2s}\
.a360-kpi-card:hover{box-shadow:0 6px 20px rgba(0,0,0,.25);transform:translateY(-2px);border-color:#334155}\
.a360-kpi-card:hover .a360-kpi-view{opacity:1}\
.a360-kpi-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}\
.a360-kpi-view{font-size:9px;font-weight:500;color:#64748b;opacity:0;transition:opacity .15s}\
.a360-kpi-value{font-size:28px;font-weight:800;color:#f8fafc;letter-spacing:-1.2px;line-height:1;margin-bottom:4px;font-variant-numeric:tabular-nums}\
.a360-kpi-label{font-size:10.5px;color:#94a3b8;font-weight:500}\
.a360-kpi-insight{display:flex;align-items:center;gap:5px;padding-top:9px;margin-top:9px;border-top:1px solid #1e293b;font-size:9.5px;font-weight:600}\
.a360-kpi-insight-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}\
.a360-grid2{display:grid;grid-template-columns:1.12fr 1fr;gap:14px;align-items:start}\
.a360-col{display:flex;flex-direction:column;gap:12px}\
.a360-section{background:var(--card);border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.05);border:1px solid var(--border);overflow:hidden}\
.a360-section-head{padding:10px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:7px}\
.a360-section-title{font-size:11.5px;font-weight:700;color:var(--text);text-transform:uppercase;letter-spacing:.5px}\
.a360-section-count{font-size:9px;color:#fff;font-weight:700;background:var(--dark);border-radius:10px;padding:1px 6px;margin-left:4px}\
.a360-section-link{margin-left:auto;font-size:10px;font-weight:500;color:var(--text-light);cursor:pointer;transition:color .12s}\
.a360-section-link:hover{color:var(--accent)}\
.a360-row{padding:10px 16px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .08s;display:flex;align-items:center;gap:10px}\
.a360-row:hover{background:#fafbfc}\
.a360-row-last{border-bottom:none}\
.a360-row-left{flex:1;min-width:0}\
.a360-row-right{display:flex;align-items:center;gap:8px;flex-shrink:0}\
.a360-row-title{font-size:12.5px;font-weight:700;color:var(--text);line-height:1.2}\
.a360-row-sub{font-size:10px;color:var(--text-light);margin-top:2px}\
.a360-row-amount{font-size:15px;font-weight:800;color:var(--text);font-variant-numeric:tabular-nums;letter-spacing:-.3px;margin-right:4px}\
.a360-empty{padding:20px 16px;text-align:center;color:var(--text-light);font-size:11px}\
.a360-stage-dots{display:flex;gap:2px;padding:0 16px 10px}\
.a360-stage-dot{flex:1;height:3px;border-radius:2px}\
.a360-contact-avatar{width:34px;height:34px;border-radius:50%;background:#f0f0f2;border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--text-muted);flex-shrink:0}\
.a360-contact-actions{display:flex;gap:4px;flex-shrink:0}\
.a360-contact-btn{width:28px;height:28px;border-radius:6px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:border-color .12s}\
.a360-contact-btn:hover{border-color:#ccc}\
.a360-timeline{padding:12px 16px}\
.a360-tl-item{display:flex;gap:10px;position:relative;padding-bottom:14px}\
.a360-tl-item:last-child{padding-bottom:0}\
.a360-tl-line{position:absolute;left:5.25px;top:15px;bottom:0;width:1.5px;background:var(--border);border-radius:1px}\
.a360-tl-item:last-child .a360-tl-line{display:none}\
.a360-tl-dot{width:12px;height:12px;border-radius:50%;border:2px solid var(--text-light);flex-shrink:0;margin-top:2px;background:var(--card);z-index:1}\
.a360-tl-body{flex:1;min-width:0}\
.a360-tl-top{display:flex;justify-content:space-between;align-items:baseline}\
.a360-tl-subject{font-size:11.5px;font-weight:600;color:var(--text);line-height:1.2}\
.a360-tl-date{font-size:9.5px;color:var(--text-light);flex-shrink:0;margin-left:8px}\
.a360-tl-meta{font-size:10px;color:var(--text-light);margin-top:2px}\
.rec-back-btn{background:none;border:none;cursor:pointer;color:var(--text-muted);padding:4px;border-radius:6px;display:flex;align-items:center;transition:all .12s}\
.rec-back-btn:hover{background:var(--accent-light);color:var(--accent)}\
.rec-detail-card{background:var(--card);border-radius:8px;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,.05);overflow:hidden}\
.rec-fields{display:grid;grid-template-columns:1fr 1fr;gap:0}\
.rec-field{padding:12px 16px;border-bottom:1px solid var(--border)}\
.rec-field:nth-child(odd){border-right:1px solid var(--border)}\
.rec-field-label{font-size:9px;font-weight:700;color:var(--text-light);text-transform:uppercase;letter-spacing:.6px;margin-bottom:3px}\
.rec-field-value{font-size:13px;color:var(--text);font-weight:500}\
@media(max-width:1100px){.a360-grid2{grid-template-columns:1fr}.a360-kpi-grid{grid-template-columns:repeat(3,1fr)}.a360-header-top{flex-wrap:wrap}.a360-header-metrics{margin-top:10px}}\
@media(max-width:768px){.a360-kpi-grid{grid-template-columns:repeat(2,1fr)}}\
';
  document.head.appendChild(s);
}
