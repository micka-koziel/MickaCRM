/* ═══════════════════════════════════════════════════════
   record.js — Record Detail Views (Account 360 + Contact 360 + Generic)
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

  if (objKey === 'contacts') {
    headerEl.style.display = 'none';
    renderContact360(contentEl, rec);
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

// ─── Account 360 Helpers ───
function a360HMetric(v,l,a){var s=a?'color:'+a:'color:var(--text)';return '<div class="a360-hmetric"><div class="a360-hmetric-val" style="'+s+'">'+v+'</div><div class="a360-hmetric-label">'+l+'</div></div>';}
function a360QA(i,l){return '<button class="a360-qa">'+svgIcon(i,12,'var(--text-light)')+'<span>'+l+'</span></button>';}
function a360Kpi(v,l,n,ins,t){var c=t==='positive'?'#4ade80':t==='warning'?'#f87171':'#64748b';return '<div class="a360-kpi-card" data-nav="'+n+'"><div class="a360-kpi-top">'+svgIcon('chart',15,'#64748b')+'<span class="a360-kpi-view">View all</span></div><div class="a360-kpi-value">'+v+'</div><div class="a360-kpi-label">'+l+'</div>'+(ins?'<div class="a360-kpi-insight"><span class="a360-kpi-insight-dot" style="background:'+c+'"></span><span style="color:'+c+'">'+ins+'</span></div>':'')+'</div>';}
function a360SectionOpen(t,n,c){return '<div class="a360-section"><div class="a360-section-head"><span class="a360-section-title">'+t+'</span>'+(c!==undefined?'<span class="a360-section-count">'+c+'</span>':'')+'<span class="a360-section-link" data-nav="'+n+'">View all</span></div>';}
function a360StageDots(sk){var st=STAGES.opportunities||[];var ks=st.map(function(s){return s.key;});var idx=ks.indexOf(sk);var h='<div class="a360-stage-dots">';ks.forEach(function(k,i){var a=i<=idx;h+='<div class="a360-stage-dot" style="background:'+(a?'var(--accent)':'#e8e8eb')+';opacity:'+(a?(.25+(i/(ks.length-1))*.75):1)+'"></div>';});return h+'</div>';}


/* ════════════════════════════════════════════════════════
   CONTACT 360
   ════════════════════════════════════════════════════════ */

function renderContact360(container, rec) {
  injectC360Styles();
  var D = window.DATA;
  var contactId = rec.id;
  var contactName = rec.name || 'Unknown';
  var initials = contactName.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase();

  // Related data
  var account = (D.accounts||[]).find(function(a){ return a.id === rec.account; });
  var accountName = account ? account.name : '—';
  var opps = (D.opportunities||[]).filter(function(o){ return o.account === rec.account; });
  var projects = (D.projects||[]).filter(function(p){ return p.account === rec.account; });
  var quotes = (D.quotes||[]).filter(function(q){ return q.contact === contactId || q.account === rec.account; });
  var activities = (D.activities||[]).filter(function(a){ return a.contact === contactId || a.contactName === contactName; });
  if (!activities.length) {
    activities = (D.upcoming||[]).slice(0, 4).map(function(u, i) {
      return { id:'act'+i, type:u.icon||'call', subject:u.name, date:u.date, time:u.time, contactName:u.contact };
    });
  }
  var notes = (D.notes||[]).filter(function(n){ return n.contact === contactId; });
  if (!notes.length) {
    notes = [
      {id:'n1', date:'2025-03-08', text:'Discussed scope changes for upcoming tender. Very receptive to premium solutions.'},
      {id:'n2', date:'2025-02-22', text:'Met at BTP conference. Strong interest in digital tools for site management.'},
      {id:'n3', date:'2025-02-10', text:'Follow-up call — confirmed budget allocation for Q3 procurement.'}
    ];
  }
  var claims = (D.claims||[]).filter(function(cl){ return cl.contact === contactId || cl.account === rec.account; });
  if (!claims.length && opps.length > 0) {
    claims = [
      {id:'cl1', subject:'Delivery delay — '+opps[0].name, status:'Open', priority:'High', date:'2025-03-01'}
    ];
  }

  var h = '<div class="c360">';

  // ─── Back nav ───
  h += '<div class="c360-back" id="c360-back">' + svgIcon('arrowLeft',14,'var(--text-muted)') + '<span>Contacts</span></div>';

  // ─── Header card ───
  h += '<div class="c360-header-card">';
  h += '<div class="c360-header-top">';

  // Photo avatar (large circle)
  var photoUrl = rec.photo || '';
  if (photoUrl) {
    h += '<div class="c360-photo"><img src="'+photoUrl+'" alt="'+contactName+'" /></div>';
  } else {
    h += '<div class="c360-photo c360-photo-initials">' + initials + '</div>';
  }

  h += '<div class="c360-header-info">';
  h += '<h1 class="c360-name">' + contactName + '</h1>';
  h += '<div class="c360-role">' + (rec.role || '—') + '</div>';
  h += '<div class="c360-company" id="c360-company-link">' + svgIcon('accounts',13,'var(--accent)') + '<span>' + accountName + '</span></div>';

  // Contact details row
  h += '<div class="c360-details-row">';
  if (rec.email) h += '<div class="c360-detail-chip">' + svgIcon('mail',12,'var(--text-muted)') + '<span>' + rec.email + '</span></div>';
  if (rec.phone) h += '<div class="c360-detail-chip">' + svgIcon('phone',12,'var(--text-muted)') + '<span>' + rec.phone + '</span></div>';
  if (rec.city || (account && account.city)) h += '<div class="c360-detail-chip">' + svgIcon('mapPin',12,'var(--text-muted)') + '<span>' + (rec.city || account.city || '—') + '</span></div>';
  h += '</div>';
  h += '</div>';

  // Quick actions
  h += '<div class="c360-header-actions">';
  h += '<button class="c360-action-btn c360-action-primary">' + svgIcon('phone',13,'#fff') + '<span>Call</span></button>';
  h += '<button class="c360-action-btn c360-action-primary">' + svgIcon('mail',13,'#fff') + '<span>Send Email</span></button>';
  h += '<button class="c360-action-btn c360-action-outline">' + svgIcon('activities',13,'var(--text-muted)') + '<span>Add Activity</span></button>';
  h += '<button class="c360-action-btn c360-action-outline">' + svgIcon('opportunities',13,'var(--text-muted)') + '<span>Create Opportunity</span></button>';
  h += '</div>';

  h += '</div></div>';

  // ─── KPI Snapshot ───
  h += '<div class="c360-kpi-row">';
  h += c360KpiTile(opps.length, 'Opportunities', 'opportunities', 'var(--accent)');
  h += c360KpiTile(projects.length, 'Projects', 'projects', 'var(--purple)');
  h += c360KpiTile(quotes.length, 'Quotes', 'quotes', 'var(--warning)');
  h += c360KpiTile(activities.length, 'Activities', 'activities', 'var(--success)');
  h += '</div>';

  // ─── 2-Column Grid ───
  h += '<div class="c360-grid2">';

  // LEFT COLUMN — Business Context
  h += '<div class="c360-col">';

  // Opportunities
  h += c360SectionOpen('Opportunities', 'opportunities', opps.length);
  if (!opps.length) h += '<div class="c360-empty">No linked opportunities</div>';
  else opps.forEach(function(o,i) {
    var st = (STAGES.opportunities||[]).find(function(s){return s.key===o.stage;});
    var amtStr = typeof fmtAmount==='function' ? fmtAmount(o.amount||0) : ((o.amount||0)/1e6).toFixed(1)+'M€';
    h += '<div class="c360-row'+(i===opps.length-1?' c360-row-last':'')+'" data-nav-obj="opportunities" data-nav-id="'+o.id+'">';
    h += '<div class="c360-row-left"><div class="c360-row-title">'+o.name+'</div>';
    h += '<div class="c360-row-sub">Close '+fmtDate(o.close)+' · Prob '+(o.prob||0)+'%</div></div>';
    h += '<div class="c360-row-right"><div class="c360-row-amount">'+amtStr+'</div>';
    if(st) h += '<span class="stage-badge" style="color:'+st.color+'"><span class="dot" style="background:'+st.color+'"></span>'+st.label+'</span>';
    h += '</div></div>';
  });
  h += '</div>';

  // Projects
  h += c360SectionOpen('Projects', 'projects', projects.length);
  if (!projects.length) h += '<div class="c360-empty">No linked projects</div>';
  else projects.forEach(function(p,i) {
    var ph = (STAGES.projects||[]).find(function(s){return s.key===p.phase;});
    var budStr = typeof fmtAmount==='function' ? fmtAmount(p.budget||0) : ((p.budget||0)/1e6).toFixed(1)+'M€';
    h += '<div class="c360-row'+(i===projects.length-1?' c360-row-last':'')+'" data-nav-obj="projects" data-nav-id="'+p.id+'">';
    h += '<div class="c360-row-left"><div class="c360-row-title">'+p.name+'</div>';
    h += '<div class="c360-row-sub">'+(ph?ph.label:'—')+' · Budget '+budStr+'</div></div>';
    h += '<div class="c360-row-right">';
    if(ph) h += '<span class="stage-badge" style="color:'+ph.color+'"><span class="dot" style="background:'+ph.color+'"></span>'+ph.label+'</span>';
    h += '</div></div>';
  });
  h += '</div>';

  // Quotes
  h += c360SectionOpen('Quotes', 'quotes', quotes.length);
  if (!quotes.length) h += '<div class="c360-empty">No linked quotes</div>';
  else quotes.forEach(function(q,i) {
    h += '<div class="c360-row'+(i===quotes.length-1?' c360-row-last':'')+'">';
    h += '<div class="c360-row-left"><div class="c360-row-title">'+(q.name||q.subject||'Quote #'+q.id)+'</div>';
    h += '<div class="c360-row-sub">'+(q.date||'')+(q.status?' · '+q.status:'')+'</div></div>';
    h += '<div class="c360-row-right">'+(q.amount?'<div class="c360-row-amount">'+fmtAmount(q.amount)+'</div>':'')+'</div>';
    h += '</div>';
  });
  h += '</div>';

  // Account Relationship
  h += c360SectionOpen('Account Relationship', 'accounts', null);
  h += '<div class="c360-account-card">';
  h += '<div class="c360-acct-top">';
  var accInitials = accountName.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase();
  h += '<div class="c360-acct-avatar">' + accInitials + '</div>';
  h += '<div class="c360-acct-info">';
  h += '<div class="c360-acct-name" id="c360-acct-nav" data-acct-id="'+(rec.account||'')+'">' + accountName + '</div>';
  h += '<div class="c360-acct-industry">' + (account ? (account.industry||'') : '') + (account && account.city ? ' · '+account.city : '') + '</div>';
  h += '</div></div>';
  h += '<div class="c360-acct-fields">';
  h += '<div class="c360-acct-field"><span class="c360-acct-field-label">Role</span><span class="c360-acct-field-value">'+(rec.role||'—')+'</span></div>';
  h += '<div class="c360-acct-field"><span class="c360-acct-field-label">Influence</span><span class="c360-acct-field-value">'+(rec.influence||'Decision Maker')+'</span></div>';
  h += '<div class="c360-acct-field"><span class="c360-acct-field-label">Account Status</span><span class="c360-acct-field-value">';
  if (account) {
    var acs = account.status==='Active' ? 'var(--success)' : 'var(--text-light)';
    h += '<span class="stage-badge" style="color:'+acs+'"><span class="dot" style="background:'+acs+'"></span>'+account.status+'</span>';
  } else { h += '—'; }
  h += '</span></div>';
  h += '</div></div></div>';

  h += '</div>';

  // RIGHT COLUMN — Relationship
  h += '<div class="c360-col">';

  // Activity Timeline
  h += c360SectionOpen('Activity Timeline', 'activities', activities.length);
  if (!activities.length) h += '<div class="c360-empty">No activities recorded</div>';
  else {
    h += '<div class="c360-timeline">';
    activities.forEach(function(a,i) {
      var isLast = i===activities.length-1;
      var typeLabel = (a.type||'call').charAt(0).toUpperCase()+(a.type||'call').slice(1);
      var typeColors = {call:'#3b82f6',meeting:'#8b5cf6',email:'#10b981','site visit':'#ef4444',siteVisit:'#ef4444',phone:'#3b82f6',users:'#8b5cf6',mail:'#10b981',mapPin:'#ef4444'};
      var tc = typeColors[a.type] || typeColors[a.icon] || 'var(--text-light)';
      var iconKey = a.icon || (a.type==='call'?'phone':a.type==='meeting'?'users':a.type==='email'?'mail':a.type==='site visit'?'mapPin':'activities');
      h += '<div class="c360-tl-item">';
      if(!isLast) h += '<div class="c360-tl-line"></div>';
      h += '<div class="c360-tl-icon" style="background:'+tc+'14;border-color:'+tc+'40">'+svgIcon(iconKey,11,tc)+'</div>';
      h += '<div class="c360-tl-body">';
      h += '<div class="c360-tl-top"><span class="c360-tl-subject">'+(a.subject||a.name||typeLabel)+'</span><span class="c360-tl-type" style="color:'+tc+'">'+typeLabel+'</span></div>';
      h += '<div class="c360-tl-meta">'+(a.date||'')+((a.time)?' · '+a.time:'')+'</div>';
      h += '</div></div>';
    });
    h += '</div>';
  }
  h += '</div>';

  // Notes
  h += c360SectionOpen('Notes', 'activities', notes.length);
  if (!notes.length) h += '<div class="c360-empty">No notes</div>';
  else {
    notes.forEach(function(n,i) {
      h += '<div class="c360-note'+(i===notes.length-1?' c360-row-last':'')+'">';
      h += '<div class="c360-note-date">'+(n.date||'')+'</div>';
      h += '<div class="c360-note-text">'+(n.text||'')+'</div>';
      h += '</div>';
    });
  }
  h += '</div>';

  // Claims
  h += c360SectionOpen('Claims', 'claims', claims.length);
  if (!claims.length) h += '<div class="c360-empty">No claims linked</div>';
  else {
    claims.forEach(function(cl,i) {
      var priColors = {High:'var(--danger)',Medium:'var(--warning)',Low:'var(--text-light)'};
      var pc = priColors[cl.priority] || 'var(--text-muted)';
      var stColors = {Open:'var(--danger)','In Progress':'var(--warning)',Closed:'var(--success)'};
      var stc = stColors[cl.status] || 'var(--text-muted)';
      h += '<div class="c360-row'+(i===claims.length-1?' c360-row-last':'')+'">';
      h += '<div class="c360-row-left"><div class="c360-row-title">'+cl.subject+'</div>';
      h += '<div class="c360-row-sub">'+(cl.date||'')+'</div></div>';
      h += '<div class="c360-row-right">';
      h += '<span class="stage-badge" style="color:'+stc+'"><span class="dot" style="background:'+stc+'"></span>'+cl.status+'</span>';
      h += '<span class="c360-claim-prio" style="color:'+pc+'">'+cl.priority+'</span>';
      h += '</div></div>';
    });
  }
  h += '</div>';

  h += '</div></div>';
  h += '</div>';

  container.innerHTML = h;
  container.scrollTop = 0;

  // Bind events
  document.getElementById('c360-back').addEventListener('click', function(){ navigate('contacts'); });

  // Company link in header
  var compLink = document.getElementById('c360-company-link');
  if (compLink && rec.account) {
    compLink.addEventListener('click', function(){ navigate('record','accounts',rec.account); });
  }

  // Account nav in relationship card
  var acctNav = document.getElementById('c360-acct-nav');
  if (acctNav) {
    acctNav.addEventListener('click', function(){
      var aid = acctNav.getAttribute('data-acct-id');
      if(aid) navigate('record','accounts',aid);
    });
  }

  // Row nav
  container.querySelectorAll('.c360-row[data-nav-id]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate('record', el.getAttribute('data-nav-obj'), el.getAttribute('data-nav-id')); });
  });
  container.querySelectorAll('.c360-section-link[data-nav]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate(el.getAttribute('data-nav')); });
  });
}

// ─── Contact 360 Helpers ───
function c360KpiTile(value, label, navPage, color) {
  return '<div class="c360-kpi" data-nav="'+navPage+'">' +
    '<div class="c360-kpi-value" style="color:'+color+'">'+value+'</div>' +
    '<div class="c360-kpi-label">'+label+'</div></div>';
}

function c360SectionOpen(title, navKey, count) {
  return '<div class="c360-section"><div class="c360-section-head">' +
    '<span class="c360-section-title">'+title+'</span>' +
    (count!==null&&count!==undefined?'<span class="c360-section-count">'+count+'</span>':'') +
    '<span class="c360-section-link" data-nav="'+navKey+'">View all</span></div>';
}


/* ════════════════════════════════════════════════════════
   CONTACT 360 — CSS INJECTION
   ════════════════════════════════════════════════════════ */

function injectC360Styles() {
  if (document.getElementById('c360-css')) return;
  var s = document.createElement('style'); s.id = 'c360-css';
  s.textContent = '\
.c360{max-width:1140px;margin:0 auto;padding:14px 18px 48px}\
.c360-back{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;color:var(--text-muted);cursor:pointer;padding:4px 0;margin-bottom:10px;transition:color .12s}\
.c360-back:hover{color:var(--accent)}\
\
.c360-header-card{background:var(--card);border-radius:10px;box-shadow:0 1px 4px rgba(0,0,0,.06);border:1px solid var(--border);margin-bottom:14px;overflow:hidden}\
.c360-header-top{padding:22px 26px 18px;display:flex;gap:20px;align-items:flex-start}\
\
.c360-photo{width:72px;height:72px;border-radius:50%;flex-shrink:0;overflow:hidden;border:2.5px solid var(--border);box-shadow:0 2px 8px rgba(0,0,0,.08)}\
.c360-photo img{width:100%;height:100%;object-fit:cover}\
.c360-photo.c360-photo-initials{display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#e0e7ff 0%,#dbeafe 100%);font-size:22px;font-weight:800;color:var(--accent);letter-spacing:-.5px}\
\
.c360-header-info{flex:1;min-width:0}\
.c360-name{font-size:24px;font-weight:800;color:var(--text);letter-spacing:-.6px;margin:0 0 2px;line-height:1.1}\
.c360-role{font-size:13px;color:var(--text-muted);font-weight:500;margin-bottom:4px}\
.c360-company{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:var(--accent);cursor:pointer;margin-bottom:10px;transition:opacity .12s}\
.c360-company:hover{opacity:.75}\
\
.c360-details-row{display:flex;flex-wrap:wrap;gap:6px}\
.c360-detail-chip{display:inline-flex;align-items:center;gap:5px;background:#f8f9fb;border:1px solid var(--border);padding:4px 10px;border-radius:6px;font-size:11px;color:var(--text-muted);font-weight:500}\
\
.c360-header-actions{display:flex;gap:7px;padding:12px 26px 14px;border-top:1px solid var(--border)}\
.c360-action-btn{display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:7px;border:none;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;transition:all .12s}\
.c360-action-primary{background:var(--accent);color:#fff}\
.c360-action-primary:hover{background:var(--accent-hover)}\
.c360-action-outline{background:transparent;border:1px solid var(--border);color:var(--text-muted)}\
.c360-action-outline:hover{border-color:#bbb;color:var(--text);background:#f8f9fb}\
\
.c360-kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}\
.c360-kpi{background:var(--card);border-radius:10px;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,.04);padding:16px 18px;cursor:pointer;transition:all .15s;text-align:center}\
.c360-kpi:hover{box-shadow:0 4px 14px rgba(0,0,0,.08);transform:translateY(-2px)}\
.c360-kpi-value{font-size:28px;font-weight:800;letter-spacing:-1px;line-height:1;margin-bottom:3px;font-variant-numeric:tabular-nums}\
.c360-kpi-label{font-size:10.5px;color:var(--text-muted);font-weight:500;text-transform:uppercase;letter-spacing:.4px}\
\
.c360-grid2{display:grid;grid-template-columns:1.12fr 1fr;gap:14px;align-items:start}\
.c360-col{display:flex;flex-direction:column;gap:12px}\
\
.c360-section{background:var(--card);border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,.04);border:1px solid var(--border);overflow:hidden}\
.c360-section-head{padding:11px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:7px}\
.c360-section-title{font-size:11.5px;font-weight:700;color:var(--text);text-transform:uppercase;letter-spacing:.5px}\
.c360-section-count{font-size:9px;color:#fff;font-weight:700;background:var(--dark);border-radius:10px;padding:1px 6px;margin-left:4px}\
.c360-section-link{margin-left:auto;font-size:10px;font-weight:500;color:var(--text-light);cursor:pointer;transition:color .12s}\
.c360-section-link:hover{color:var(--accent)}\
\
.c360-row{padding:10px 16px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .08s;display:flex;align-items:center;gap:10px}\
.c360-row:hover{background:#fafbfc}\
.c360-row-last{border-bottom:none}\
.c360-row-left{flex:1;min-width:0}\
.c360-row-right{display:flex;align-items:center;gap:8px;flex-shrink:0}\
.c360-row-title{font-size:12.5px;font-weight:700;color:var(--text);line-height:1.2}\
.c360-row-sub{font-size:10px;color:var(--text-light);margin-top:2px}\
.c360-row-amount{font-size:15px;font-weight:800;color:var(--text);font-variant-numeric:tabular-nums;letter-spacing:-.3px;margin-right:4px}\
.c360-empty{padding:20px 16px;text-align:center;color:var(--text-light);font-size:11px}\
\
.c360-claim-prio{font-size:10px;font-weight:600;margin-left:4px}\
\
.c360-timeline{padding:12px 16px}\
.c360-tl-item{display:flex;gap:10px;position:relative;padding-bottom:16px}\
.c360-tl-item:last-child{padding-bottom:0}\
.c360-tl-line{position:absolute;left:13px;top:28px;bottom:0;width:1.5px;background:var(--border);border-radius:1px}\
.c360-tl-item:last-child .c360-tl-line{display:none}\
.c360-tl-icon{width:26px;height:26px;border-radius:8px;border:1.5px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0;z-index:1;background:var(--card)}\
.c360-tl-body{flex:1;min-width:0;padding-top:2px}\
.c360-tl-top{display:flex;justify-content:space-between;align-items:baseline}\
.c360-tl-subject{font-size:12px;font-weight:600;color:var(--text);line-height:1.2}\
.c360-tl-type{font-size:10px;font-weight:600;flex-shrink:0;margin-left:8px}\
.c360-tl-meta{font-size:10px;color:var(--text-light);margin-top:2px}\
\
.c360-note{padding:12px 16px;border-bottom:1px solid var(--border)}\
.c360-note:last-child,.c360-note.c360-row-last{border-bottom:none}\
.c360-note-date{font-size:9px;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px}\
.c360-note-text{font-size:12px;color:var(--text);line-height:1.55}\
\
.c360-account-card{padding:16px}\
.c360-acct-top{display:flex;gap:12px;align-items:center;margin-bottom:14px}\
.c360-acct-avatar{width:40px;height:40px;border-radius:8px;background:#f0f0f2;border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:var(--text-muted);flex-shrink:0}\
.c360-acct-info{flex:1;min-width:0}\
.c360-acct-name{font-size:14px;font-weight:700;color:var(--accent);cursor:pointer;transition:opacity .12s}\
.c360-acct-name:hover{opacity:.75}\
.c360-acct-industry{font-size:11px;color:var(--text-light);margin-top:1px}\
.c360-acct-fields{display:flex;flex-direction:column;gap:8px}\
.c360-acct-field{display:flex;justify-content:space-between;align-items:center}\
.c360-acct-field-label{font-size:10px;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.4px}\
.c360-acct-field-value{font-size:12px;font-weight:600;color:var(--text)}\
\
@media(max-width:1100px){\
  .c360-grid2{grid-template-columns:1fr}\
  .c360-kpi-row{grid-template-columns:repeat(2,1fr)}\
  .c360-header-top{flex-wrap:wrap}\
}\
@media(max-width:768px){\
  .c360-kpi-row{grid-template-columns:repeat(2,1fr)}\
  .c360-header-actions{flex-wrap:wrap}\
}\
';
  document.head.appendChild(s);
}


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
   CSS INJECTION — ACCOUNT 360
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
