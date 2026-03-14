/* ═══════════════════════════════════════════════════════
   project360.js — Project Portfolio Cockpit
   MickaCRM v4 — vanilla JS, CSS injected via injectP360Styles()
   Classes prefixed p3-, follows Lead360 layout pattern
   MUST be loaded BEFORE record.js in index.html
   ═══════════════════════════════════════════════════════ */

/* ── Register extra icons into NAV_ICONS (from nav.js) ── */
(function() {
  if (typeof NAV_ICONS === 'undefined') return;
  var extra = {
    building:       'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    hardHat:        'M2 18a1 1 0 001 1h18a1 1 0 001-1v-2a1 1 0 00-1-1H3a1 1 0 00-1 1v2zM10 15V6m4 9V6M4 15a8 8 0 0116 0',
    trendingUp:     'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
    eye:            'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 100-6 3 3 0 000 6z',
    upload:         'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m14-7l-5-5-5 5m5-5v12',
    refreshCw:      'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15',
    link:           'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
    activity:       'M22 12h-4l-3 9L9 3l-3 9H2',
    fileText:       'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8m8 4H8m2-8H8',
    alertTriangle:  'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01',
    user:           'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8',
    dollarSign:     'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
    check:          'M20 6L9 17l-5-5'
  };
  for (var k in extra) {
    if (!NAV_ICONS[k]) NAV_ICONS[k] = extra[k];
  }
})();

/* ── Helpers ── */
function p3Fmt(n) {
  if (typeof fmtAmount === 'function') return fmtAmount(n);
  if (n >= 1e6) return (n/1e6).toFixed(1).replace(/\.0$/,'') + 'M\u20AC';
  if (n >= 1e3) return Math.round(n/1e3) + 'K\u20AC';
  return n + '\u20AC';
}
function p3FmtShort(n) {
  if (n >= 1e6) return (n/1e6).toFixed(1).replace(/\.0$/,'') + 'M\u20AC';
  if (n >= 1e3) return Math.round(n/1e3) + 'K\u20AC';
  return n + '\u20AC';
}
function p3Date(d) {
  if (!d) return '\u2014';
  if (typeof fmtDate === 'function') return fmtDate(d);
  return new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
}
function p3Initials(name) {
  return (name||'').split(' ').map(function(w){return w[0]||'';}).join('').substring(0,2).toUpperCase();
}
function p3Icon(name, size, color) {
  if (typeof svgIcon === 'function') return svgIcon(name, size||16, color||'currentColor');
  return '';
}

/* ── Badges ── */
function p3StageBadge(s) {
  var m = {'closed_won':'gn','Closed Won':'gn',negotiation:'am',Negotiation:'am',proposal:'bl',Proposal:'bl',tender:'pu',Tender:'pu',lead:'gy',Lead:'gy',study:'bl',Study:'bl'};
  var label = (s||'\u2014').replace(/_/g,' ').replace(/\b\w/g, function(c){return c.toUpperCase();});
  return '<span class="p3-b p3-b--'+(m[s]||'gy')+'">'+label+'</span>';
}
function p3StatusBadge(s) {
  var m = {Signed:'gn',Pending:'am',Draft:'gy',Open:'rd',Resolved:'gn',Completed:'gn',Scheduled:'bl'};
  return '<span class="p3-b p3-b--'+(m[s]||'gy')+'">'+(s||'\u2014')+'</span>';
}
function p3PrioBadge(p) {
  var m = {High:'rd',Medium:'am',Low:'gy'};
  return '<span class="p3-b p3-b--'+(m[p]||'gy')+'">'+(p||'\u2014')+'</span>';
}

/* ── Activity helpers ── */
function p3ActIcon(t) { return {'Site Visit':'mapPin',Call:'phone',Meeting:'users',Email:'mail'}[t]||'activities'; }
function p3ActColor(t) { return {'Site Visit':'#f59e0b',Call:'#3b82f6',Meeting:'#8b5cf6',Email:'#10b981'}[t]||'#64748b'; }

/* ── Phases ── */
var P3_PHASES = ['Pre-study','Tender','Contract','Construction','Delivered'];

/* ═══════════════════════════════════════════════════════
   MAIN RENDER
   ═══════════════════════════════════════════════════════ */
function renderProject360(container, rec) {
  injectP360Styles();
  var D = window.DATA;

  /* ── Resolve related data ── */
  var account = (D.accounts||[]).find(function(a){ return a.id === rec.account; });
  var accountName = account ? account.name : (rec.account||'\u2014');

  var opps = (D.opportunities||[]).filter(function(o){
    if (o.projectId === rec.id) return true;
    return false;
  });
  var quotes = (D.quotes||[]).filter(function(q){ return q.projectId === rec.id; });
  var activities = rec.activities || (D.upcoming||[]).slice(0,6).map(function(u,i){
    return {id:'pa'+i, type: u.icon==='phone'?'Call':u.icon==='users'?'Meeting':u.icon==='mail'?'Email':'Site Visit', description:u.name, date:u.date, contact:u.contact};
  });

  /* ── Computed values ── */
  var projValue = rec.value || rec.budget || 0;
  var totalOpp = opps.reduce(function(s,o){ return s+(o.amount||0); },0);
  var totalQt = quotes.reduce(function(s,q){ return s+(q.amount||q.value||0); },0);
  var signed = quotes.filter(function(q){ return q.stage==='Accepted'||q.status==='Signed'; }).reduce(function(s,q){ return s+(q.amount||q.value||0); },0);
  var coverage = projValue > 0 ? Math.round(signed/projValue*100) : 0;

  var phaseLabel = rec.phase || 'Pre-study';
  var phaseMap = {prestudy:'Pre-study','pre-study':'Pre-study',tender:'Tender',contract:'Contract',contracting:'Contract',construction:'Construction',delivered:'Delivered'};
  var phaseNorm = phaseMap[phaseLabel.toLowerCase()] || phaseLabel;
  var phaseIndex = P3_PHASES.indexOf(phaseNorm);
  if (phaseIndex === -1) phaseIndex = 0;

  var healthLabel = rec.health || 'Healthy';
  var hCls = {Healthy:'h',Attention:'a','At risk':'r','At Risk':'r'}[healthLabel] || 'h';
  var hDot = {h:'#059669',a:'#d97706',r:'#dc2626'}[hCls];

  var siteVisits = rec.siteVisits || activities.filter(function(a){return a.type==='Site Visit';});
  var claims = rec.claims || [];
  var documents = rec.documents || [];
  var openClaims = claims.filter(function(c){return c.status==='Open';}).length;

  /* Participants */
  var parts = [];
  if (rec.owner) parts.push({name:rec.owner, role:'Project Owner', color:'#2563eb'});
  if (rec.commercialLead) parts.push({name:rec.commercialLead, role:'Commercial Lead', color:'#8b5cf6'});
  if (rec.technicalLead) parts.push({name:rec.technicalLead, role:'Technical Lead', color:'#059669'});
  if (rec.clientStakeholders) rec.clientStakeholders.forEach(function(n){ parts.push({name:n, role:'Client Stakeholder', color:'#f59e0b'}); });

  /* Next action */
  var nextAction = 'Schedule a follow-up activity for this project.';
  if (openClaims > 0) nextAction = 'Resolve '+openClaims+' open claim(s) before next milestone.';
  else if (opps.some(function(o){return o.stage==='negotiation';})) nextAction = 'Close pending negotiations to improve signed coverage.';

  /* ── Build HTML ── */
  var h = '<div class="p3">';

  /* Back nav */
  h += '<div class="p3-back" id="p3-back">' + p3Icon('arrowLeft',14,'var(--text-muted)') + '<span>Projects</span></div>';

  /* ═══ HEADER ═══ */
  h += '<div class="p3-hdr"><div class="p3-hdr-row">';
  var p3PhotoUrl = rec.photoURL || rec.photo || '';
  h += '<div class="p3-av-wrap" id="p3-photo-wrap" title="Click to change photo">';
  if (p3PhotoUrl) {
    h += '<div class="p3-av p3-av-img" id="p3-avatar"><img src="'+p3PhotoUrl+'" alt="'+(rec.name||'')+'" /></div>';
  } else {
    h += '<div class="p3-av" id="p3-avatar">' + p3Icon('building',30,'#fff') + '</div>';
  }
  h += '<div class="p3-av-overlay">' + p3Icon('plus',16,'#fff') + '</div>';
  h += '<input type="file" id="p3-photo-input" accept="image/*" style="display:none" />';
  h += '</div>';
  h += '<div class="p3-hc">';
  h += '<div class="p3-name">' + (rec.name||'Untitled Project');
  h += ' <span class="p3-chip-phase">' + p3Icon('hardHat',13,'var(--accent)') + ' ' + phaseNorm + '</span></div>';
  h += '<div class="p3-role"><a class="p3-acct" id="p3-acct-link" data-acct-id="'+rec.account+'">' + p3Icon('accounts',13,'var(--accent)') + ' ' + accountName + '</a></div>';
  h += '<div class="p3-chips">';
  if (rec.location) h += '<span class="p3-chip">' + p3Icon('mapPin',13,'var(--text-light)') + ' ' + rec.location + '</span>';
  h += '<span class="p3-chip">' + p3Icon('activities',13,'var(--text-light)') + ' ' + p3Date(rec.startDate||rec.start) + ' \u2014 ' + p3Date(rec.expectedDelivery||rec.end) + '</span>';
  if (rec.owner) h += '<span class="p3-chip">' + p3Icon('user',13,'var(--text-light)') + ' ' + rec.owner + '</span>';
  h += '</div>';
  h += '<div class="p3-meta">';
  if (rec.source) h += 'Source: <strong>'+rec.source+'</strong> ';
  h += '<span>Owner: <strong>'+(rec.owner||'\u2014')+'</strong></span> ';
  h += '<span>Created: <strong>'+(rec.createdDate ? p3Date(rec.createdDate) : '\u2014')+'</strong></span>';
  h += '</div></div>';

  /* Header right */
  h += '<div class="p3-hr">';
  h += '<div class="p3-bigv">'+p3FmtShort(projValue)+'</div>';
  h += '<div class="p3-bigl">Project Value</div>';
  h += '<div class="p3-hp p3-hp--'+hCls+'"><span style="width:7px;height:7px;border-radius:50%;background:'+hDot+';display:inline-block"></span> '+healthLabel+'</div>';
  h += '</div></div></div>';

  /* ═══ ACTIONS ═══ */
  h += '<div class="p3-acts">';
  h += '<button class="p3-btn p3-btn--gn">'+p3Icon('mapPin',14,'#fff')+' Schedule Site Visit</button>';
  h += '<button class="p3-btn p3-btn--bl">'+p3Icon('plus',14,'#fff')+' Add Activity</button>';
  h += '<button class="p3-btn p3-btn--ol">'+p3Icon('upload',14)+' Upload Document</button>';
  h += '<button class="p3-btn p3-btn--am">'+p3Icon('refreshCw',14,'#fff')+' Update Phase</button>';
  h += '</div>';

  /* ═══ KPI TILES ═══ */
  h += '<div class="p3-krow">';
  h += '<div class="p3-kpi"><div class="p3-kv" style="color:var(--accent)">'+p3FmtShort(projValue)+'</div><div class="p3-kl">Project Value</div><div class="p3-kh" style="color:#059669">Phase '+(phaseIndex+1)+' of '+P3_PHASES.length+'</div></div>';
  h += '<div class="p3-kpi"><div class="p3-kv" style="color:var(--text)">'+opps.length+'</div><div class="p3-kl">Opportunities</div><div class="p3-kh" style="color:var(--text-light)">'+p3Fmt(totalOpp)+'</div></div>';
  h += '<div class="p3-kpi"><div class="p3-kv" style="color:var(--purple)">'+quotes.length+'</div><div class="p3-kl">Quotes</div><div class="p3-kh" style="color:var(--text-light)">'+p3Fmt(totalQt)+'</div></div>';
  h += '<div class="p3-kpi"><div class="p3-kv" style="color:#059669">'+coverage+'%</div><div class="p3-kl">Signed Coverage</div><div class="p3-kh" style="color:#059669">'+p3Fmt(signed)+'</div></div>';
  h += '</div>';

  /* ═══ PHASE STEPPER ═══ */
  h += '<div class="p3-sw"><div class="p3-st">Project Lifecycle</div><div class="p3-stp">';
  P3_PHASES.forEach(function(ph, i) {
    var done = i < phaseIndex, active = i === phaseIndex;
    var dc = done ? 'd' : active ? 'a' : 'f';
    var chk = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    h += '<div class="p3-step" data-phase-idx="'+i+'"><div class="p3-sc">';
    h += '<div class="p3-dot p3-dot--'+dc+'">'+(done ? chk : (i+1))+'</div>';
    h += '<span class="p3-slb p3-slb--'+dc+'">'+ph+'</span>';
    h += '</div>';
    if (i < P3_PHASES.length - 1) h += '<div class="p3-sl p3-sl--'+(i < phaseIndex ? 'd' : 'f')+'"></div>';
    h += '</div>';
  });
  h += '</div></div>';

  /* ═══ CLOSE THE LOOP ═══ */
  h += '<div class="p3-loop"><div class="p3-lh">';
  h += '<span class="p3-lt">'+p3Icon('link',14,'var(--text-light)')+' Close the Loop \u2014 Commercial Lifecycle</span>';
  h += '<span class="p3-clk" data-nav="opportunities">View all</span></div>';
  h += '<div class="p3-lg">';
  h += '<div class="p3-lc"><div class="p3-ln" style="color:var(--accent)">'+opps.length+'</div><div class="p3-ll">Opportunities</div><div class="p3-ls" style="color:var(--accent)">'+p3Fmt(totalOpp)+'</div></div>';
  h += '<div class="p3-lc"><div class="p3-ln" style="color:var(--purple)">'+quotes.length+'</div><div class="p3-ll">Quotes</div><div class="p3-ls" style="color:var(--purple)">'+p3Fmt(totalQt)+'</div></div>';
  h += '<div class="p3-lc"><div class="p3-ln" style="color:#059669">'+p3Fmt(signed)+'</div><div class="p3-ll">Signed Value</div></div>';
  h += '<div class="p3-lc"><div class="p3-ln" style="color:#f59e0b">'+coverage+'%</div><div class="p3-ll">Coverage</div></div>';
  h += '</div>';
  h += '<div class="p3-lb"><div class="p3-lai">'+p3Icon('activity',18,'var(--accent)')+'</div>';
  h += '<div><div class="p3-lat">Next Recommended Action</div><div class="p3-lax">'+nextAction+'</div></div></div>';
  h += '</div>';

  /* ═══ BODY 2-COL ═══ */
  h += '<div class="p3-body">';

  /* ── LEFT ── */
  h += '<div>';

  /* Overview */
  h += '<div class="p3-card"><div class="p3-ch"><span class="p3-ct">'+p3Icon('eye',15,'var(--text-light)')+' Project Overview</span></div>';
  h += '<div class="p3-cb p3-cb--p"><div class="p3-ovt">'+(rec.description||'No description.')+'</div>';
  h += '<div class="p3-ovg">';
  h += '<div class="p3-ovi"><label>Account</label><span>'+accountName+'</span></div>';
  h += '<div class="p3-ovi"><label>Location</label><span>'+(rec.location||'\u2014')+'</span></div>';
  h += '<div class="p3-ovi"><label>Phase</label><span>'+phaseNorm+'</span></div>';
  h += '<div class="p3-ovi"><label>Project ID</label><span>'+rec.id+'</span></div>';
  h += '</div></div></div>';

  /* Opportunities */
  h += '<div class="p3-card"><div class="p3-ch">';
  h += '<span class="p3-ct">'+p3Icon('trendingUp',15,'var(--accent)')+' Opportunities <span class="p3-cc">'+opps.length+'</span></span>';
  h += '<span style="font-size:12px;font-weight:600;color:var(--text-light)">'+p3Fmt(totalOpp)+'</span></div>';
  h += '<div class="p3-cb">';
  if (!opps.length) h += '<div class="p3-empty">No opportunities linked to this project.</div>';
  opps.forEach(function(o) {
    h += '<div class="p3-row" data-nav-obj="opportunities" data-nav-id="'+o.id+'">';
    h += '<div style="flex:1"><div class="p3-rn">'+(o.name||'\u2014')+'</div><div class="p3-rs">'+o.id+'</div></div>';
    h += p3StageBadge(o.stage);
    h += '<div class="p3-ra">'+p3Fmt(o.amount||0)+'</div>';
    h += '<div class="p3-rd">'+p3Date(o.close)+'</div></div>';
  });
  h += '</div></div>';

  /* Quotes */
  h += '<div class="p3-card"><div class="p3-ch">';
  h += '<span class="p3-ct">'+p3Icon('fileText',15,'var(--purple)')+' Quotes <span class="p3-cc">'+quotes.length+'</span></span>';
  h += '<span style="font-size:12px;font-weight:600;color:var(--text-light)">'+p3Fmt(totalQt)+'</span></div>';
  h += '<div class="p3-cb">';
  if (!quotes.length) h += '<div class="p3-empty">No quotes linked to this project.</div>';
  quotes.forEach(function(q) {
    h += '<div class="p3-row" data-nav-obj="quotes" data-nav-id="'+q.id+'">';
    h += '<div style="flex:1"><div class="p3-rn">'+(q.name||'\u2014')+'</div><div class="p3-rs">'+q.id+'</div></div>';
    h += p3StatusBadge(q.stage||q.status);
    h += '<div class="p3-ra">'+p3Fmt(q.amount||q.value||0)+'</div>';
    h += '<div class="p3-rd">'+p3Date(q.createdDate||q.date)+'</div></div>';
  });
  h += '</div></div>';

  /* Participants */
  h += '<div class="p3-card"><div class="p3-ch"><span class="p3-ct">'+p3Icon('users',15,'var(--text-light)')+' Project Participants <span class="p3-cc">'+parts.length+'</span></span></div>';
  h += '<div class="p3-cb">';
  if (!parts.length) h += '<div class="p3-empty">No participants assigned.</div>';
  parts.forEach(function(p) {
    h += '<div class="p3-pt"><div class="p3-pa" style="background:'+p.color+'">'+p3Initials(p.name)+'</div>';
    h += '<div><div class="p3-pn">'+p.name+'</div><div class="p3-pr">'+p.role+'</div></div></div>';
  });
  h += '</div></div>';
  h += '</div>'; /* end left */

  /* ── RIGHT ── */
  h += '<div><div class="p3-card p3-sticky">';

  /* Tabs */
  var clBadge = openClaims > 0 ? '<span class="p3-claim-badge">'+openClaims+'</span>' : '';
  h += '<div class="p3-tabs">';
  h += '<button class="p3-tab p3-tab--on" data-tab="timeline">Activity</button>';
  h += '<button class="p3-tab" data-tab="visits">Site Visits</button>';
  h += '<button class="p3-tab" data-tab="claims">Claims '+clBadge+'</button>';
  h += '<button class="p3-tab" data-tab="docs">Documents</button>';
  h += '</div>';

  /* Panel: Timeline */
  h += '<div class="p3-panel" data-panel="timeline">';
  if (!activities.length) h += '<div class="p3-empty">No activities yet.</div>';
  activities.forEach(function(a) {
    var ic = p3ActIcon(a.type);
    var col = p3ActColor(a.type);
    h += '<div class="p3-tl"><div class="p3-ti" style="background:'+col+'14">'+p3Icon(ic,16,col)+'</div>';
    h += '<div class="p3-tb"><div class="p3-td">'+(a.description||a.desc||a.name||'\u2014')+'</div>';
    h += '<div class="p3-tm">'+(a.type||'\u2014')+' \u2014 '+(a.contact||'\u2014')+' \u2014 '+p3Date(a.date)+'</div></div></div>';
  });
  h += '</div>';

  /* Panel: Site Visits */
  h += '<div class="p3-panel" data-panel="visits" style="display:none">';
  if (!siteVisits.length) h += '<div class="p3-empty">No site visits recorded.</div>';
  siteVisits.forEach(function(v) {
    h += '<div class="p3-vis"><div class="p3-vh"><span class="p3-vd">'+p3Icon('mapPin',13,'#f59e0b')+' '+p3Date(v.date)+'</span>'+p3StatusBadge(v.status||'Scheduled')+'</div>';
    h += '<div class="p3-vn">'+(v.inspector||v.contact||'\u2014')+' \u2014 '+(v.notes||v.description||'\u2014')+'</div></div>';
  });
  h += '</div>';

  /* Panel: Claims */
  h += '<div class="p3-panel" data-panel="claims" style="display:none">';
  if (!claims.length) h += '<div class="p3-empty">No claims.</div>';
  claims.forEach(function(c) {
    var tc = c.status==='Open' ? 'var(--danger)' : 'var(--text-light)';
    h += '<div class="p3-cl">'+p3Icon('alertTriangle',15,tc);
    h += '<div class="p3-clt"><div class="p3-cln">'+(c.title||c.name||'\u2014')+'</div><div class="p3-cls">'+(c.id||'')+' \u2014 '+p3Date(c.date)+'</div></div>';
    h += p3StatusBadge(c.status)+p3PrioBadge(c.priority)+'</div>';
  });
  h += '</div>';

  /* Panel: Documents */
  h += '<div class="p3-panel" data-panel="docs" style="display:none">';
  if (!documents.length) h += '<div class="p3-empty">No documents uploaded.</div>';
  documents.forEach(function(d) {
    h += '<div class="p3-doc"><div class="p3-di">'+p3Icon('fileText',15,'var(--accent)')+'</div>';
    h += '<div class="p3-dn">'+(d.name||'\u2014')+'</div>';
    h += '<div class="p3-dm">'+(d.size||'')+'</div>';
    h += '<div class="p3-dm">'+p3Date(d.date)+'</div></div>';
  });
  h += '</div>';

  h += '</div></div>'; /* end card + right */
  h += '</div>'; /* end body */
  h += '</div>'; /* end p3 */

  container.innerHTML = h;
  container.scrollTop = 0;

  /* ═══ BIND EVENTS ═══ */

  /* Back */
  var backBtn = document.getElementById('p3-back');
  if (backBtn) backBtn.addEventListener('click', function(){ navigate('projects'); });

  /* Account link */
  var acctLink = document.getElementById('p3-acct-link');
  if (acctLink && rec.account) {
    acctLink.addEventListener('click', function(){ navigate('record','accounts',rec.account); });
  }

  /* Photo: overlay click = upload, avatar click = preview */
  var p3PhotoWrap = document.getElementById('p3-photo-wrap');
  var p3PhotoInput = document.getElementById('p3-photo-input');
  if (p3PhotoWrap && p3PhotoInput) {
    var p3Overlay = p3PhotoWrap.querySelector('.p3-av-overlay');
    if (p3Overlay) {
      p3Overlay.addEventListener('click', function(e){ e.stopPropagation(); p3PhotoInput.click(); });
    }
    var p3AvatarEl = document.getElementById('p3-avatar');
    if (p3AvatarEl) {
      p3AvatarEl.addEventListener('click', function(e){
        e.stopPropagation();
        var currentUrl = rec.photoURL || rec.photo || '';
        if (currentUrl && typeof fbShowPhotoPreview === 'function') {
          fbShowPhotoPreview(currentUrl, rec.name||'Project');
        } else {
          p3PhotoInput.click();
        }
      });
    }
    p3PhotoInput.addEventListener('change', function(e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var avatar = document.getElementById('p3-avatar');
      if (avatar) {
        avatar.classList.add('p3-av-loading');
        avatar.innerHTML = '<div class="p3-spinner"></div>';
      }
      if (typeof fbCompressAndSavePhoto === 'function') {
        fbCompressAndSavePhoto(file, 'projects', rec.id).then(function(url) {
          if (avatar) {
            avatar.classList.remove('p3-av-loading');
            avatar.className = 'p3-av p3-av-img';
            avatar.innerHTML = '<img src="'+url+'" alt="'+(rec.name||'')+'" />';
          }
          fbShowStatus('Photo uploaded');
        }).catch(function(err) {
          console.error('[P360] Photo error:', err);
          if (avatar) {
            avatar.classList.remove('p3-av-loading');
            avatar.innerHTML = p3Icon('building',30,'#fff');
          }
          fbShowStatus('Photo upload failed', true);
        });
      } else {
        var reader = new FileReader();
        reader.onload = function(ev) {
          rec.photo = ev.target.result;
          if (avatar) { avatar.className = 'p3-av p3-av-img'; avatar.innerHTML = '<img src="'+ev.target.result+'" alt="'+(rec.name||'')+'" />'; }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  /* Tab switching */
  container.querySelectorAll('.p3-tab').forEach(function(btn) {
    btn.addEventListener('click', function() {
      container.querySelectorAll('.p3-tab').forEach(function(t){ t.classList.remove('p3-tab--on'); });
      btn.classList.add('p3-tab--on');
      container.querySelectorAll('.p3-panel').forEach(function(p){ p.style.display = 'none'; });
      var panel = container.querySelector('.p3-panel[data-panel="'+btn.getAttribute('data-tab')+'"]');
      if (panel) panel.style.display = '';
    });
  });

  /* Row navigation */
  container.querySelectorAll('.p3-row[data-nav-id]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate('record', el.getAttribute('data-nav-obj'), el.getAttribute('data-nav-id')); });
  });

  /* View all links */
  container.querySelectorAll('.p3-clk[data-nav]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate(el.getAttribute('data-nav')); });
  });

  /* Phase step click */
  container.querySelectorAll('.p3-step[data-phase-idx]').forEach(function(step) {
    step.style.cursor = 'pointer';
    step.addEventListener('click', function() {
      var idx = parseInt(step.getAttribute('data-phase-idx'));
      if (!isNaN(idx) && P3_PHASES[idx] && P3_PHASES[idx] !== phaseNorm) {
        rec.phase = P3_PHASES[idx];
        renderProject360(container, rec);
        if (typeof showDragToast === 'function') showDragToast(rec.name, P3_PHASES[idx], 'projects');
      }
    });
  });
}


/* ═══════════════════════════════════════════════════════
   CSS INJECTION
   ═══════════════════════════════════════════════════════ */
function injectP360Styles() {
  if (document.getElementById('p360-css')) return;
  var s = document.createElement('style');
  s.id = 'p360-css';
  s.textContent = [
'.p3-back{display:flex;align-items:center;gap:6px;padding:10px 32px;font-size:12.5px;color:var(--text-muted);cursor:pointer;background:#fff;border-bottom:1px solid var(--border)}',
'.p3-back:hover{color:var(--accent)}',
'.p3-hdr{background:#fff;border-bottom:1px solid var(--border);padding:24px 32px 20px}',
'.p3-hdr-row{display:flex;align-items:flex-start;gap:18px}',
'.p3-av{width:92px;height:92px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,var(--accent),#1e40af);display:flex;align-items:center;justify-content:center;color:#fff;border:1px solid #E6E8EC;box-shadow:0 2px 8px rgba(0,0,0,.06);overflow:hidden;transition:transform .18s ease,box-shadow .18s ease}',
'.p3-av-img img{width:100%;height:100%;object-fit:cover}',
'.p3-av-wrap{position:relative;cursor:pointer;flex-shrink:0}',
'.p3-av-wrap:hover .p3-av{transform:scale(1.05);box-shadow:0 6px 20px rgba(0,0,0,.12)}',
'.p3-av-overlay{position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s}',
'.p3-av-wrap:hover .p3-av-overlay{opacity:1}',
'.p3-av-loading{background:linear-gradient(135deg,var(--accent),#1e40af)}',
'.p3-spinner{width:22px;height:22px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:p3spin .6s linear infinite}',
'@keyframes p3spin{to{transform:rotate(360deg)}}',
'.p3-hc{flex:1;min-width:0}',
'.p3-name{font-size:22px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:10px;flex-wrap:wrap}',
'.p3-chip-phase{display:inline-flex;align-items:center;gap:5px;background:#dbeafe;color:var(--accent);font-size:12px;font-weight:600;padding:3px 12px;border-radius:20px}',
'.p3-role{font-size:13.5px;color:var(--text-muted);margin-top:1px}',
'.p3-acct{color:var(--accent);text-decoration:none;font-weight:500;display:inline-flex;align-items:center;gap:4px;cursor:pointer}',
'.p3-acct:hover{text-decoration:underline}',
'.p3-chips{display:flex;align-items:center;gap:10px;margin-top:8px;flex-wrap:wrap}',
'.p3-chip{display:inline-flex;align-items:center;gap:5px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:5px 12px;font-size:12px;color:#475569}',
'.p3-meta{font-size:12px;color:var(--text-light);margin-top:8px;display:flex;gap:16px;flex-wrap:wrap}',
'.p3-meta strong{color:var(--text-muted);font-weight:600}',
'.p3-hr{text-align:right;flex-shrink:0;padding-top:4px}',
'.p3-bigv{font-size:32px;font-weight:800;color:var(--accent);line-height:1}',
'.p3-bigl{font-size:10.5px;color:var(--text-light);text-transform:uppercase;letter-spacing:.5px;font-weight:600;margin-top:2px}',
'.p3-hp{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;margin-top:8px}',
'.p3-hp--h{background:#ecfdf5;color:#059669}',
'.p3-hp--a{background:#fffbeb;color:#d97706}',
'.p3-hp--r{background:#fef2f2;color:#dc2626}',
'.p3-acts{display:flex;gap:8px;padding:14px 32px;background:#fff;border-bottom:1px solid var(--border);flex-wrap:wrap}',
'.p3-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:8px;font-size:12.5px;font-weight:600;font-family:inherit;cursor:pointer;border:none;transition:all .15s}',
'.p3-btn--bl{background:var(--accent);color:#fff}','.p3-btn--bl:hover{background:#1d4ed8}',
'.p3-btn--gn{background:#059669;color:#fff}','.p3-btn--gn:hover{background:#047857}',
'.p3-btn--am{background:#f59e0b;color:#fff}','.p3-btn--am:hover{background:#d97706}',
'.p3-btn--ol{background:#fff;color:var(--text-muted);border:1px solid var(--border)}','.p3-btn--ol:hover{background:var(--bg)}',
'.p3-krow{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:18px 32px}',
'.p3-kpi{background:#fff;border:1px solid var(--border);border-radius:12px;padding:18px 14px;text-align:center}',
'.p3-kv{font-size:28px;font-weight:800;line-height:1.1}',
'.p3-kl{font-size:10.5px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;font-weight:600;margin-top:4px}',
'.p3-kh{font-size:11px;margin-top:6px}',
'.p3-sw{background:#fff;border:1px solid var(--border);border-radius:12px;margin:0 32px;padding:18px 24px 22px}',
'.p3-st{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text-muted);margin-bottom:16px}',
'.p3-stp{display:flex;align-items:center}',
'.p3-step{display:flex;align-items:center;flex:1}','.p3-step:last-child{flex:0 0 auto}',
'.p3-dot{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;transition:all .2s}',
'.p3-dot--d{background:var(--accent);color:#fff}',
'.p3-dot--a{background:var(--accent);color:#fff;box-shadow:0 0 0 5px rgba(37,99,235,.18)}',
'.p3-dot--f{background:#e8eaed;color:#b0b5bd}',
'.p3-sl{flex:1;height:3px;margin:0 4px;border-radius:2px}',
'.p3-sl--d{background:var(--accent)}','.p3-sl--f{background:#e8eaed}',
'.p3-sc{display:flex;flex-direction:column;align-items:center;gap:6px}',
'.p3-slb{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.3px}',
'.p3-slb--d{color:var(--accent)}','.p3-slb--a{color:var(--accent)}','.p3-slb--f{color:#b0b5bd}',
'.p3-loop{background:#fff;border:1px solid var(--border);border-radius:12px;margin:16px 32px 0;overflow:hidden}',
'.p3-lh{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-bottom:1px solid #f1f5f9}',
'.p3-lt{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text-muted);display:flex;align-items:center;gap:7px}',
'.p3-lg{display:grid;grid-template-columns:repeat(4,1fr)}',
'.p3-lc{padding:16px 14px;text-align:center;border-right:1px solid #f1f5f9}','.p3-lc:last-child{border-right:none}',
'.p3-ln{font-size:22px;font-weight:800}',
'.p3-ll{font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.4px;font-weight:600;margin-top:2px}',
'.p3-ls{font-size:11.5px;font-weight:600;margin-top:4px}',
'.p3-lb{display:flex;align-items:center;gap:12px;padding:12px 18px;background:var(--bg);border-top:1px solid #f1f5f9}',
'.p3-lai{width:36px;height:36px;border-radius:50%;background:#dbeafe;display:flex;align-items:center;justify-content:center;flex-shrink:0}',
'.p3-lat{font-size:10.5px;color:var(--text-light);text-transform:uppercase;letter-spacing:.4px;font-weight:600}',
'.p3-lax{font-size:13px;color:var(--text);font-weight:500}',
'.p3-clk{font-size:12px;color:var(--text-light);cursor:pointer;font-weight:500}','.p3-clk:hover{color:var(--accent)}',
'.p3-body{display:grid;grid-template-columns:1fr 380px;gap:16px;padding:18px 32px 32px}',
'.p3-card{background:#fff;border:1px solid var(--border);border-radius:12px;margin-bottom:16px;overflow:hidden}','.p3-card:last-child{margin-bottom:0}',
'.p3-ch{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-bottom:1px solid #f1f5f9}',
'.p3-ct{font-size:13px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:7px}',
'.p3-cc{background:#dbeafe;color:var(--accent);font-size:11px;font-weight:700;padding:1px 8px;border-radius:10px}',
'.p3-cb{padding:0}','.p3-cb--p{padding:14px 18px}',
'.p3-sticky{position:sticky;top:16px}',
'.p3-empty{padding:18px;text-align:center;color:var(--text-light);font-size:12.5px}',
'.p3-row{display:flex;align-items:center;padding:10px 18px;border-bottom:1px solid #f1f5f9;gap:12px;transition:background .1s;cursor:pointer}',
'.p3-row:last-child{border-bottom:none}','.p3-row:hover{background:var(--bg)}',
'.p3-rn{font-weight:500;color:var(--text);font-size:12.5px}',
'.p3-rs{font-size:11px;color:var(--text-light)}',
'.p3-ra{font-weight:600;color:var(--text);font-size:12.5px;white-space:nowrap}',
'.p3-rd{font-size:11px;color:var(--text-light);white-space:nowrap}',
'.p3-b{display:inline-flex;align-items:center;padding:2px 9px;border-radius:6px;font-size:10.5px;font-weight:600;white-space:nowrap}',
'.p3-b--bl{background:#dbeafe;color:#2563eb}',
'.p3-b--gn{background:#ecfdf5;color:#059669}',
'.p3-b--am{background:#fffbeb;color:#d97706}',
'.p3-b--rd{background:#fef2f2;color:#dc2626}',
'.p3-b--gy{background:#f1f5f9;color:#64748b}',
'.p3-b--pu{background:#f5f3ff;color:#7c3aed}',
'.p3-tabs{display:flex;gap:0;border-bottom:1px solid var(--border);padding:0 18px}',
'.p3-tab{padding:10px 16px;font-size:12px;font-weight:500;color:var(--text-muted);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;background:none;border-top:none;border-left:none;border-right:none;font-family:inherit}',
'.p3-tab:hover{color:var(--text)}',
'.p3-tab--on{color:var(--accent);border-bottom-color:var(--accent);font-weight:600}',
'.p3-claim-badge{margin-left:4px;background:#fef2f2;color:#dc2626;border-radius:8px;padding:0 5px;font-size:10px;font-weight:700}',
'.p3-tl{display:flex;gap:12px;padding:10px 18px;border-bottom:1px solid #f1f5f9}','.p3-tl:last-child{border-bottom:none}',
'.p3-ti{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}',
'.p3-tb{flex:1;min-width:0}',
'.p3-td{font-size:12.5px;font-weight:500;color:var(--text)}',
'.p3-tm{font-size:11px;color:var(--text-light);margin-top:1px}',
'.p3-pt{display:flex;align-items:center;gap:10px;padding:9px 18px;border-bottom:1px solid #f1f5f9}','.p3-pt:last-child{border-bottom:none}',
'.p3-pa{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0}',
'.p3-pn{font-size:12.5px;font-weight:500;color:var(--text)}',
'.p3-pr{font-size:11px;color:var(--text-light)}',
'.p3-ovt{font-size:12.5px;color:#475569;line-height:1.65}',
'.p3-ovg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}',
'.p3-ovi label{display:block;font-size:10.5px;color:var(--text-light);text-transform:uppercase;letter-spacing:.3px;margin-bottom:2px}',
'.p3-ovi span{font-size:12.5px;color:var(--text);font-weight:500}',
'.p3-vis{padding:10px 18px;border-bottom:1px solid #f1f5f9}','.p3-vis:last-child{border-bottom:none}',
'.p3-vh{display:flex;align-items:center;justify-content:space-between;margin-bottom:3px}',
'.p3-vd{font-size:12px;font-weight:600;color:var(--text);display:flex;align-items:center;gap:5px}',
'.p3-vn{font-size:11.5px;color:var(--text-muted)}',
'.p3-cl{display:flex;align-items:center;gap:10px;padding:10px 18px;border-bottom:1px solid #f1f5f9}','.p3-cl:last-child{border-bottom:none}',
'.p3-clt{flex:1}',
'.p3-cln{font-size:12.5px;font-weight:500;color:var(--text)}',
'.p3-cls{font-size:11px;color:var(--text-light)}',
'.p3-doc{display:flex;align-items:center;gap:10px;padding:9px 18px;border-bottom:1px solid #f1f5f9;cursor:pointer;transition:background .1s}',
'.p3-doc:last-child{border-bottom:none}','.p3-doc:hover{background:var(--bg)}',
'.p3-di{width:30px;height:30px;border-radius:6px;background:#dbeafe;display:flex;align-items:center;justify-content:center;flex-shrink:0}',
'.p3-dn{flex:1;font-size:12.5px;font-weight:500;color:var(--text)}',
'.p3-dm{font-size:10.5px;color:var(--text-light)}',
'@media(max-width:1100px){.p3-body{grid-template-columns:1fr}.p3-krow{grid-template-columns:repeat(2,1fr)}.p3-lg{grid-template-columns:repeat(2,1fr)}.p3-hdr-row{flex-wrap:wrap}.p3-hr{text-align:left;margin-top:10px}}',
'@media(max-width:768px){.p3-krow{padding:14px 16px;gap:10px}.p3-hdr{padding:16px}.p3-acts{padding:10px 16px}.p3-sw{margin:0 16px;padding:14px 16px}.p3-loop{margin:12px 16px 0}.p3-body{padding:12px 16px 24px;gap:12px}}',
'@media(max-width:640px){.p3-krow{grid-template-columns:1fr}.p3-lg{grid-template-columns:1fr}.p3-name{font-size:18px}.p3-av{width:64px;height:64px}.p3-bigv{font-size:24px}.p3-ovg{grid-template-columns:1fr}.p3-btn{padding:6px 12px;font-size:11.5px}.p3-hdr{padding:14px 12px}.p3-acts{padding:8px 12px}.p3-sw{margin:0 10px;padding:12px}.p3-loop{margin:10px 10px 0}.p3-body{padding:10px 10px 20px}}'
  ].join('\n');
  document.head.appendChild(s);
}
