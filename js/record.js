/* ═══════════════════════════════════════════════════════
   record.js — Record Detail Views
   Account 360 + Contact 360 + Lead 360 + Generic
   ═══════════════════════════════════════════════════════ */

function renderRecordPage(objKey, recId, headerEl, contentEl) {
  var data = objKey === 'users' ? (typeof UM_USERS !== 'undefined' ? UM_USERS : []) : window.DATA[objKey];
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

  if (objKey === 'leads') {
    headerEl.style.display = 'none';
    renderLead360(contentEl, rec);
    return;
  }

  if (objKey === 'opportunities') {
    headerEl.style.display = 'none';
    renderOpp360(contentEl, rec);
    return;
  }

  if (objKey === 'projects') {
    headerEl.style.display = 'none';
    if (typeof renderProject360 === 'function') {
      renderProject360(contentEl, rec);
    } else {
      contentEl.innerHTML = '<div class="placeholder-view">Project 360 module not loaded. Check script order in index.html.</div>';
    }
    return;
  }

  if (objKey === 'quotes') {
    headerEl.style.display = 'none';
    var qHtml = renderQuote360(rec);
    contentEl.innerHTML = qHtml;
    bindQuote360Events(contentEl);
    return;
  }

  if (objKey === 'claims') {
    headerEl.style.display = 'none';
    if (typeof renderClaim360 === 'function') {
      renderClaim360(contentEl, rec);
    } else {
      contentEl.innerHTML = '<div class="placeholder-view">Claim 360 module not loaded. Check script order in index.html.</div>';
    }
    return;
  }

  if (objKey === 'activities') {
    headerEl.style.display = 'none';
    if (typeof renderActivity360 === 'function') {
      renderActivity360(contentEl, rec);
    } else {
      contentEl.innerHTML = '<div class="placeholder-view">Activity 360 module not loaded. Check script order in index.html.</div>';
    }
    return;
  }

  if (objKey === 'users') {
    headerEl.style.display = 'none';
    if (typeof renderUser360 === 'function') {
      renderUser360(contentEl, rec);
    } else {
      contentEl.innerHTML = '<div class="placeholder-view">User 360 module not loaded. Check script order in index.html.</div>';
    }
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
  // Photo avatar 92px (click to upload, click to preview)
  var accPhotoUrl = rec.photoURL || rec.photo || '';
  h += '<div class="a360-photo-wrap" id="a360-photo-wrap" title="Click to change photo">';
  if (accPhotoUrl) {
    h += '<div class="a360-avatar a360-avatar-img" id="a360-avatar"><img src="'+accPhotoUrl+'" alt="'+accName+'" /></div>';
  } else {
    h += '<div class="a360-avatar a360-avatar-initials" id="a360-avatar">' + initials + '</div>';
  }
  h += '<div class="a360-photo-overlay">' + svgIcon('plus',16,'#fff') + '</div>';
  h += '<input type="file" id="a360-photo-input" accept="image/*" style="display:none" />';
  h += '</div>';
  h += '<div class="a360-header-info">';
  h += '<div class="a360-name-row"><h1 class="a360-name">' + accName + '</h1>';
  var sc = rec.status==='Active' ? 'var(--success)' : 'var(--text-light)';
  h += '<span class="stage-badge" style="color:'+sc+'"><span class="dot" style="background:'+sc+'"></span>'+rec.status+'</span>';
  h += '</div>';
  h += '<div class="a360-subtitle">' + (rec.industry||'—') + '</div>';
  h += '<div class="a360-detail-chips">';
  if (rec.city) h += '<span class="a360-chip">' + svgIcon('mapPin',12,'var(--text-light)') + ' ' + rec.city + '</span>';
  if (rec.phone) h += '<span class="a360-chip">' + svgIcon('phone',12,'var(--text-light)') + ' ' + rec.phone + '</span>';
  if (rec.website) h += '<span class="a360-chip">' + svgIcon('link',12,'var(--text-light)') + ' ' + rec.website + '</span>';
  h += '</div>';
  h += '</div>';

  h += '<div class="a360-header-metrics">';
  h += a360HMetric(pipeStr, 'Pipeline', 'var(--accent)');
  h += a360HMetric(projects.length, 'Projects', '');
  h += a360HMetric(opps.length, 'Opps', '');
  h += a360HMetric(contacts.length, 'Contacts', '');
  h += '</div></div>';

  h += '<div class="a360-header-actions"><div class="a360-qa-row">';
  h += a360QA('contacts','Contact',true) + a360QA('opportunities','Opportunity',true) + a360QA('quotes','Quote') + a360QA('activities','Activity') + a360QA('projects','Project');
  h += '</div></div>';
  /* Edit / Delete */
  h += '<div class="a360-header-actions" style="display:flex;gap:7px;padding:0 26px 14px;flex-wrap:wrap">';
  h += crmActionButtons('a360', 'accounts', accId);
  h += '</div>';
  h += '</div>';

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

  // Details
  h += crmDetailsSection('a360', 'accounts', rec);

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
      var typeColors = {phone:'#3b82f6',users:'#8b5cf6',mail:'#10b981',mapPin:'#ef4444'};
      var tc = typeColors[a.icon] || 'var(--text-light)';
      var iconKey = a.icon || 'activities';
      h += '<div class="a360-tl-item">';
      if(!isLast) h += '<div class="a360-tl-line"></div>';
      h += '<div class="a360-tl-icon" style="background:'+tc+'14;border-color:'+tc+'40">'+svgIcon(iconKey,11,tc)+'</div>';
      h += '<div class="a360-tl-body">';
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

  // Photo: overlay click = upload, avatar click = preview
  var a360PhotoWrap = document.getElementById('a360-photo-wrap');
  var a360PhotoInput = document.getElementById('a360-photo-input');
  if (a360PhotoWrap && a360PhotoInput) {
    // Overlay "+" triggers file picker
    var a360Overlay = a360PhotoWrap.querySelector('.a360-photo-overlay');
    if (a360Overlay) {
      a360Overlay.addEventListener('click', function(e){ e.stopPropagation(); a360PhotoInput.click(); });
    }
    // Avatar click = preview if photo exists, else upload
    var a360AvatarEl = document.getElementById('a360-avatar');
    if (a360AvatarEl) {
      a360AvatarEl.addEventListener('click', function(e){
        e.stopPropagation();
        var currentUrl = rec.photoURL || rec.photo || '';
        if (currentUrl && typeof fbShowPhotoPreview === 'function') {
          fbShowPhotoPreview(currentUrl, accName);
        } else {
          a360PhotoInput.click();
        }
      });
    }
    a360PhotoInput.addEventListener('change', function(e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var avatar = document.getElementById('a360-avatar');
      if (avatar) {
        avatar.classList.add('a360-avatar-loading');
        avatar.innerHTML = '<div class="a360-spinner"></div>';
      }
      if (typeof fbCompressAndSavePhoto === 'function') {
        fbCompressAndSavePhoto(file, 'accounts', accId).then(function(url) {
          if (avatar) {
            avatar.classList.remove('a360-avatar-loading');
            avatar.className = 'a360-avatar a360-avatar-img';
            avatar.innerHTML = '<img src="'+url+'" alt="'+accName+'" />';
          }
          fbShowStatus('Photo uploaded');
        }).catch(function(err) {
          console.error('[A360] Photo error:', err);
          if (avatar) {
            avatar.classList.remove('a360-avatar-loading');
            avatar.innerHTML = initials;
          }
          fbShowStatus('Photo upload failed', true);
        });
      } else {
        var reader = new FileReader();
        reader.onload = function(ev) {
          rec.photo = ev.target.result;
          if (avatar) { avatar.className = 'a360-avatar a360-avatar-img'; avatar.innerHTML = '<img src="'+ev.target.result+'" alt="'+accName+'" />'; }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  container.querySelectorAll('.a360-row[data-nav-id]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate('record', el.getAttribute('data-nav-obj'), el.getAttribute('data-nav-id')); });
  });
  container.querySelectorAll('.a360-section-link[data-nav]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate(el.getAttribute('data-nav')); });
  });
  container.querySelectorAll('.a360-kpi-card[data-nav]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate(el.getAttribute('data-nav')); });
  });
  bindCrmActionButtons(container);
  bindDetailsLinks(container);
}

// ─── Account 360 Helpers ───
function a360HMetric(v,l,a){var s=a?'color:'+a:'color:var(--text)';return '<div class="a360-hmetric"><div class="a360-hmetric-val" style="'+s+'">'+v+'</div><div class="a360-hmetric-label">'+l+'</div></div>';}
function a360QA(i,l,primary){var cls=primary?'a360-qa a360-qa-primary':'a360-qa a360-qa-outline';var ic=primary?'#fff':'var(--text-muted)';return '<button class="'+cls+'">'+svgIcon(i,13,ic)+'<span>'+l+'</span></button>';}
function a360Kpi(v,l,n,ins,t){var c=t==='positive'?'#4ade80':t==='warning'?'#f87171':'#64748b';var vc=n==='opportunities'?'var(--accent)':n==='projects'?'var(--purple)':n==='contacts'?'var(--success)':n==='activities'?'var(--warning)':'var(--text)';return '<div class="a360-kpi-card" data-nav="'+n+'"><div class="a360-kpi-top">'+svgIcon('chart',15,'var(--text-light)')+'<span class="a360-kpi-view">View all</span></div><div class="a360-kpi-value" style="color:'+vc+'">'+v+'</div><div class="a360-kpi-label">'+l+'</div>'+(ins?'<div class="a360-kpi-insight"><span class="a360-kpi-insight-dot" style="background:'+c+'"></span><span style="color:'+c+'">'+ins+'</span></div>':'')+'</div>';}
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

  // Photo avatar
  var photoUrl = rec.photoURL || rec.photo || '';
  h += '<div class="c360-photo-wrap" id="c360-photo-wrap" title="Click to change photo">';
  if (photoUrl) {
    h += '<div class="c360-photo" id="c360-avatar"><img src="'+photoUrl+'" alt="'+contactName+'" /></div>';
  } else {
    h += '<div class="c360-photo c360-photo-initials" id="c360-avatar">' + initials + '</div>';
  }
  h += '<div class="c360-photo-overlay">' + svgIcon('plus',16,'#fff') + '</div>';
  h += '<input type="file" id="c360-photo-input" accept="image/*" style="display:none" />';
  h += '</div>';

  h += '<div class="c360-header-info">';
  h += '<h1 class="c360-name">' + contactName + '</h1>';
  h += '<div class="c360-role">' + (rec.role || '—') + '</div>';
  h += '<div class="c360-company" id="c360-company-link">' + svgIcon('accounts',13,'var(--accent)') + '<span>' + accountName + '</span></div>';

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
  h += crmActionButtons('c360', 'contacts', contactId);
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

  // LEFT COLUMN
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

  // Details
  h += crmDetailsSection('c360', 'contacts', rec);

  h += '</div>';

  // RIGHT COLUMN
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

  // Photo: overlay click = upload, avatar click = preview
  var photoWrap = document.getElementById('c360-photo-wrap');
  var photoInput = document.getElementById('c360-photo-input');
  if (photoWrap && photoInput) {
    var c360Overlay = photoWrap.querySelector('.c360-photo-overlay');
    if (c360Overlay) {
      c360Overlay.addEventListener('click', function(e){ e.stopPropagation(); photoInput.click(); });
    }
    var c360AvatarEl = document.getElementById('c360-avatar');
    if (c360AvatarEl) {
      c360AvatarEl.addEventListener('click', function(e){
        e.stopPropagation();
        var currentUrl = rec.photoURL || rec.photo || '';
        if (currentUrl && typeof fbShowPhotoPreview === 'function') {
          fbShowPhotoPreview(currentUrl, contactName);
        } else {
          photoInput.click();
        }
      });
    }
    photoInput.addEventListener('change', function(e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var avatar = document.getElementById('c360-avatar');
      if (avatar) {
        avatar.className = 'c360-photo c360-photo-loading';
        avatar.innerHTML = '<div class="c360-spinner"></div>';
      }
      if (typeof fbCompressAndSavePhoto === 'function') {
        fbCompressAndSavePhoto(file, 'contacts', contactId).then(function(url) {
          if (avatar) { avatar.className = 'c360-photo'; avatar.innerHTML = '<img src="'+url+'" alt="'+contactName+'" />'; }
          fbShowStatus('Photo uploaded');
        }).catch(function(err) {
          console.error('[C360] Photo error:', err);
          if (avatar) { avatar.className = 'c360-photo c360-photo-initials'; avatar.innerHTML = initials; }
          fbShowStatus('Photo upload failed', true);
        });
      } else {
        var reader = new FileReader();
        reader.onload = function(ev) {
          rec.photo = ev.target.result;
          if (avatar) { avatar.className = 'c360-photo'; avatar.innerHTML = '<img src="'+ev.target.result+'" alt="'+contactName+'" />'; }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  var compLink = document.getElementById('c360-company-link');
  if (compLink && rec.account) {
    compLink.addEventListener('click', function(){ navigate('record','accounts',rec.account); });
  }

  var acctNav = document.getElementById('c360-acct-nav');
  if (acctNav) {
    acctNav.addEventListener('click', function(){
      var aid = acctNav.getAttribute('data-acct-id');
      if(aid) navigate('record','accounts',aid);
    });
  }

  container.querySelectorAll('.c360-row[data-nav-id]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate('record', el.getAttribute('data-nav-obj'), el.getAttribute('data-nav-id')); });
  });
  container.querySelectorAll('.c360-section-link[data-nav]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate(el.getAttribute('data-nav')); });
  });
  bindCrmActionButtons(container);
  bindDetailsLinks(container);
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
   LEAD 360 — Qualification Cockpit
   ════════════════════════════════════════════════════════ */

function renderLead360(container, rec) {
  injectL360Styles();
  var D = window.DATA;

  /* ── Resolve related data ── */
  var account = (D.accounts||[]).find(function(a){ return a.id === rec.account; });
  var accountName = account ? account.name : '—';
  var accInitials = accountName.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase();

  /* Contact linked to same account */
  var contact = (D.contacts||[]).find(function(c){ return c.account === rec.account; });
  var contactName = contact ? contact.name : rec.name.split(' – ')[0] || rec.name;
  var contactRole = contact ? contact.role : 'Key Contact';
  var contactEmail = contact ? contact.email : '';
  var contactPhone = contact ? contact.phone : '';
  var contactCity = (contact && contact.city) || (account ? account.city : '');

  var opps = (D.opportunities||[]).filter(function(o){ return o.account === rec.account; });

  /* ── Lead Intelligence (computed/mock) ── */
  var leadScore = rec.leadScore || l360ComputeScore(rec);
  var temperature = l360Temperature(leadScore);
  var engagementLevel = rec.engagement || l360Engagement(rec);
  var activityCount = rec.activityCount || (Math.floor(Math.random()*8)+2);
  var quotesSent = rec.quotesSent || (rec.stage==='proposal'||rec.stage==='converted' ? 1 : 0);

  /* Activities mock */
  var activities = [];
  var upcoming = (D.upcoming||[]).slice(0,5);
  if (upcoming.length) {
    activities = upcoming.map(function(u,i){
      return {id:'la'+i, type:u.icon||'call', subject:u.name, date:u.date, time:u.time, contactName:u.contact};
    });
  } else {
    activities = [
      {id:'la0', type:'phone', subject:'Initial outreach call', date:'2025-03-10', time:'14:30'},
      {id:'la1', type:'mail', subject:'Sent product brochure', date:'2025-03-08', time:'09:15'},
      {id:'la2', type:'users', subject:'Discovery meeting', date:'2025-03-05', time:'11:00'}
    ];
  }

  /* Notes mock */
  var notes = [
    {id:'ln1', date:'2025-03-09', text:'Strong interest in facade solutions for new campus project. Budget confirmed for Q3.'},
    {id:'ln2', date:'2025-02-28', text:'Met at Batimat. Decision expected within 6 weeks. Competing with LafargeHolcim.'}
  ];

  /* Next action */
  var nextAction = l360NextAction(rec);

  /* Estimated value */
  var estValStr = rec.estimatedValue ? (typeof fmtAmount==='function' ? fmtAmount(rec.estimatedValue) : (rec.estimatedValue/1e6).toFixed(1)+'M') : '—';

  /* ── BUILD HTML ── */
  var h = '<div class="l360">';

  /* Back nav */
  h += '<div class="l360-back" id="l360-back">' + svgIcon('arrowLeft',14,'var(--text-muted)') + '<span>Leads</span></div>';

  /* ── Header Card ── */
  h += '<div class="l360-header-card">';
  h += '<div class="l360-header-top">';

  /* Avatar with photo upload */
  var initials = contactName.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase();
  var l360Photo = rec.photoURL || rec.photo || '';
  h += '<div class="l360-photo-wrap" id="l360-photo-wrap" title="Click to change photo">';
  if (l360Photo) {
    h += '<div class="l360-photo" id="l360-avatar"><img src="'+l360Photo+'" alt="'+rec.name+'" /></div>';
  } else {
    h += '<div class="l360-photo l360-photo-initials" id="l360-avatar">' + initials + '</div>';
  }
  h += '<div class="l360-photo-overlay">' + svgIcon('plus',16,'#fff') + '</div>';
  h += '<input type="file" id="l360-photo-input" accept="image/*" style="display:none" />';
  h += '</div>';

  h += '<div class="l360-header-info">';
  h += '<div class="l360-name-row">';
  h += '<h1 class="l360-name">' + rec.name + '</h1>';
  /* Temperature badge */
  h += '<span class="l360-temp-badge l360-temp-'+temperature.key+'">' + temperature.icon + ' ' + temperature.label + '</span>';
  h += '</div>';
  h += '<div class="l360-role">' + contactRole + '</div>';
  h += '<div class="l360-company" id="l360-company-link">' + svgIcon('accounts',13,'var(--accent)') + '<span>' + accountName + '</span></div>';

  /* Contact chips */
  h += '<div class="l360-details-row">';
  if (contactEmail) h += '<div class="l360-detail-chip">' + svgIcon('mail',12,'var(--text-muted)') + '<span>' + contactEmail + '</span></div>';
  if (contactPhone) h += '<div class="l360-detail-chip">' + svgIcon('phone',12,'var(--text-muted)') + '<span>' + contactPhone + '</span></div>';
  if (contactCity) h += '<div class="l360-detail-chip">' + svgIcon('mapPin',12,'var(--text-muted)') + '<span>' + contactCity + '</span></div>';
  h += '</div>';

  /* Metadata row */
  h += '<div class="l360-meta-row">';
  if (rec.source) h += '<div class="l360-meta-tag">Source: <strong>' + rec.source + '</strong></div>';
  h += '<div class="l360-meta-tag">Owner: <strong>Me</strong></div>';
  h += '<div class="l360-meta-tag">Created: <strong>Feb 2025</strong></div>';
  h += '</div>';

  h += '</div>'; /* header-info */

  /* Header right metrics */
  h += '<div class="l360-header-metrics">';
  h += '<div class="l360-hmetric"><div class="l360-hmetric-val" style="color:var(--accent)">' + estValStr + '</div><div class="l360-hmetric-label">Est. Value</div></div>';
  h += '<div class="l360-hmetric"><div class="l360-hmetric-val" style="color:'+temperature.color+'">' + leadScore + '</div><div class="l360-hmetric-label">Lead Score</div></div>';
  h += '</div>';

  h += '</div>'; /* header-top */

  /* Quick Actions */
  h += '<div class="l360-actions">';
  h += '<button class="l360-action-btn l360-action-primary">' + svgIcon('phone',13,'#fff') + '<span>Call</span></button>';
  h += '<button class="l360-action-btn l360-action-primary">' + svgIcon('mail',13,'#fff') + '<span>Send Email</span></button>';
  h += '<button class="l360-action-btn l360-action-outline">' + svgIcon('activities',13,'var(--text-muted)') + '<span>Add Activity</span></button>';
  h += '<button class="l360-action-btn l360-action-convert" id="l360-convert">' + svgIcon('opportunities',13,'#fff') + '<span>Convert to Opportunity</span></button>';
  h += crmActionButtons('l360', 'leads', rec.id);
  h += '</div>';

  h += '</div>'; /* header-card */

  /* ── KPI Cards ── */
  h += '<div class="l360-kpi-row">';
  h += l360KpiCard(leadScore, 'Lead Score', temperature.color, temperature.icon + ' ' + temperature.label + ' Lead', temperature.color);
  h += l360KpiCard(engagementLevel, 'Engagement', engagementLevel==='High'?'var(--success)':engagementLevel==='Medium'?'var(--warning)':'var(--text-light)', activityCount+' touchpoints', 'var(--text-muted)');
  h += l360KpiCard(activityCount, 'Activities', 'var(--accent)', 'Last: 2 days ago', 'var(--text-muted)');
  h += l360KpiCard(quotesSent, 'Quotes Sent', 'var(--warning)', quotesSent>0?'Pending review':'None yet', 'var(--text-muted)');
  h += '</div>';

  /* ── Qualification Funnel ── */
  h += '<div class="l360-funnel-card">';
  h += '<div class="l360-funnel-title">Qualification Funnel</div>';
  h += '<div class="l360-funnel">';
  var stages = STAGES.leads || [];
  stages.forEach(function(st, i) {
    var isCurrent = st.key === rec.stage;
    var isPast = false;
    var currentIdx = stages.findIndex(function(s){return s.key===rec.stage;});
    if (i < currentIdx) isPast = true;
    var cls = isCurrent ? 'l360-funnel-step l360-funnel-current' : (isPast ? 'l360-funnel-step l360-funnel-done' : 'l360-funnel-step');
    h += '<div class="'+cls+'" data-stage="'+st.key+'">';
    h += '<div class="l360-funnel-dot" style="background:'+(isCurrent||isPast?st.color:'#e2e8f0')+'">';
    if (isPast) h += '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>';
    if (isCurrent) h += '<div class="l360-funnel-pulse"></div>';
    h += '</div>';
    h += '<div class="l360-funnel-label">' + st.label + '</div>';
    if (i < stages.length - 1) h += '<div class="l360-funnel-line" style="background:'+(isPast?st.color:'#e2e8f0')+'"></div>';
    h += '</div>';
  });
  h += '</div></div>';

  /* ── 2-Column Grid ── */
  h += '<div class="l360-grid2">';

  /* LEFT COLUMN */
  h += '<div class="l360-col">';

  /* Lead Insights */
  h += l360SectionOpen('Lead Insights', 'leads');
  h += '<div class="l360-insights">';
  h += '<div class="l360-insight-row"><span class="l360-insight-label">Lead Name</span><span class="l360-insight-value">' + rec.name + '</span></div>';
  h += '<div class="l360-insight-row"><span class="l360-insight-label">Source</span><span class="l360-insight-value">' + (rec.source||'—') + '</span></div>';
  h += '<div class="l360-insight-row"><span class="l360-insight-label">Priority</span><span class="l360-insight-value">';
  if (rec.priority) {
    var pc = {High:'var(--danger)',Medium:'var(--warning)',Low:'var(--text-light)'};
    h += '<span class="stage-badge" style="color:'+(pc[rec.priority]||'var(--text-muted)')+'"><span class="dot" style="background:'+(pc[rec.priority]||'var(--text-muted)')+'"></span>'+rec.priority+'</span>';
  } else { h += '—'; }
  h += '</span></div>';
  h += '<div class="l360-insight-row"><span class="l360-insight-label">Estimated Value</span><span class="l360-insight-value" style="font-weight:800;color:var(--text)">' + estValStr + '</span></div>';
  h += '<div class="l360-insight-row"><span class="l360-insight-label">Stage</span><span class="l360-insight-value">';
  var stObj = stages.find(function(s){return s.key===rec.stage;});
  if (stObj) h += '<span class="stage-badge" style="color:'+stObj.color+'"><span class="dot" style="background:'+stObj.color+'"></span>'+stObj.label+'</span>';
  else h += rec.stage||'—';
  h += '</span></div>';
  h += '</div></div>';

  /* Company Information */
  h += l360SectionOpen('Company Information', 'accounts');
  h += '<div class="l360-company-card">';
  h += '<div class="l360-co-top">';
  h += '<div class="l360-co-avatar">' + accInitials + '</div>';
  h += '<div class="l360-co-info">';
  h += '<div class="l360-co-name" id="l360-acct-nav" data-acct-id="'+(rec.account||'')+'">' + accountName + '</div>';
  h += '<div class="l360-co-industry">' + (account ? (account.industry||'') : '') + (account && account.city ? ' · '+account.city : '') + '</div>';
  h += '</div></div>';
  if (account) {
    var accPipe = account.pipeline ? (typeof fmtAmount==='function' ? fmtAmount(account.pipeline) : (account.pipeline/1e6).toFixed(1)+'M') : '—';
    h += '<div class="l360-co-fields">';
    h += '<div class="l360-co-field"><span class="l360-co-field-label">Pipeline</span><span class="l360-co-field-value">' + accPipe + '</span></div>';
    h += '<div class="l360-co-field"><span class="l360-co-field-label">Open Opps</span><span class="l360-co-field-value">' + (account.opps||0) + '</span></div>';
    h += '<div class="l360-co-field"><span class="l360-co-field-label">Status</span><span class="l360-co-field-value">';
    var asc = account.status==='Active'?'var(--success)':'var(--text-light)';
    h += '<span class="stage-badge" style="color:'+asc+'"><span class="dot" style="background:'+asc+'"></span>'+account.status+'</span>';
    h += '</span></div>';
    h += '</div>';
  }
  h += '</div></div>';

  /* Related Opportunities */
  h += l360SectionOpen('Related Opportunities', 'opportunities');
  if (!opps.length) h += '<div class="l360-empty">No opportunities linked to this account</div>';
  else opps.forEach(function(o,i) {
    var st = (STAGES.opportunities||[]).find(function(s){return s.key===o.stage;});
    var amtStr = typeof fmtAmount==='function' ? fmtAmount(o.amount||0) : ((o.amount||0)/1e6).toFixed(1)+'M';
    h += '<div class="l360-row'+(i===opps.length-1?' l360-row-last':'')+'" data-nav-obj="opportunities" data-nav-id="'+o.id+'">';
    h += '<div class="l360-row-left"><div class="l360-row-title">'+o.name+'</div>';
    h += '<div class="l360-row-sub">Close '+fmtDate(o.close)+' · Prob '+(o.prob||0)+'%</div></div>';
    h += '<div class="l360-row-right"><div class="l360-row-amount">'+amtStr+'</div>';
    if(st) h += '<span class="stage-badge" style="color:'+st.color+'"><span class="dot" style="background:'+st.color+'"></span>'+st.label+'</span>';
    h += '</div></div>';
  });
  h += '</div>';

  /* Details */
  h += crmDetailsSection('l360', 'leads', rec);

  h += '</div>'; /* l360-col left */

  /* RIGHT COLUMN */
  h += '<div class="l360-col">';

  /* Next Recommended Action */
  h += '<div class="l360-next-action">';
  h += '<div class="l360-na-icon" style="background:'+nextAction.color+'14;border-color:'+nextAction.color+'40">'+svgIcon(nextAction.icon,14,nextAction.color)+'</div>';
  h += '<div class="l360-na-body">';
  h += '<div class="l360-na-label">Next Recommended Action</div>';
  h += '<div class="l360-na-text">' + nextAction.text + '</div>';
  h += '</div></div>';

  /* Activity Timeline */
  h += l360SectionOpen('Activity Timeline', 'activities');
  if (!activities.length) h += '<div class="l360-empty">No activities recorded</div>';
  else {
    h += '<div class="l360-timeline">';
    activities.forEach(function(a,i) {
      var isLast = i===activities.length-1;
      var typeLabel = (a.type||'call').charAt(0).toUpperCase()+(a.type||'call').slice(1);
      var typeColors = {call:'#3b82f6',meeting:'#8b5cf6',email:'#10b981','site visit':'#ef4444',phone:'#3b82f6',users:'#8b5cf6',mail:'#10b981',mapPin:'#ef4444'};
      var tc = typeColors[a.type] || typeColors[a.icon] || 'var(--text-light)';
      var iconKey = a.icon || (a.type==='call'||a.type==='phone'?'phone':a.type==='meeting'||a.type==='users'?'users':a.type==='email'||a.type==='mail'?'mail':'activities');
      h += '<div class="l360-tl-item">';
      if(!isLast) h += '<div class="l360-tl-line"></div>';
      h += '<div class="l360-tl-icon" style="background:'+tc+'14;border-color:'+tc+'40">'+svgIcon(iconKey,11,tc)+'</div>';
      h += '<div class="l360-tl-body">';
      h += '<div class="l360-tl-top"><span class="l360-tl-subject">'+(a.subject||a.name||typeLabel)+'</span><span class="l360-tl-type" style="color:'+tc+'">'+typeLabel+'</span></div>';
      h += '<div class="l360-tl-meta">'+(a.date||'')+((a.time)?' · '+a.time:'')+'</div>';
      h += '</div></div>';
    });
    h += '</div>';
  }
  h += '</div>';

  /* Notes */
  h += l360SectionOpen('Notes', 'activities');
  if (!notes.length) h += '<div class="l360-empty">No notes</div>';
  else {
    notes.forEach(function(n,i) {
      h += '<div class="l360-note'+(i===notes.length-1?' l360-row-last':'')+'">';
      h += '<div class="l360-note-date">'+(n.date||'')+'</div>';
      h += '<div class="l360-note-text">'+(n.text||'')+'</div>';
      h += '</div>';
    });
  }
  h += '</div>';

  h += '</div>'; /* l360-col right */
  h += '</div>'; /* l360-grid2 */
  h += '</div>'; /* l360 */

  container.innerHTML = h;
  container.scrollTop = 0;

  /* ── Bind Events ── */
  document.getElementById('l360-back').addEventListener('click', function(){ navigate('leads'); });

  /* Photo: overlay click = upload, avatar click = preview */
  var l360PhotoWrap = document.getElementById('l360-photo-wrap');
  var l360PhotoInput = document.getElementById('l360-photo-input');
  if (l360PhotoWrap && l360PhotoInput) {
    var l360Overlay = l360PhotoWrap.querySelector('.l360-photo-overlay');
    if (l360Overlay) {
      l360Overlay.addEventListener('click', function(e){ e.stopPropagation(); l360PhotoInput.click(); });
    }
    var l360AvatarEl = document.getElementById('l360-avatar');
    if (l360AvatarEl) {
      l360AvatarEl.addEventListener('click', function(e){
        e.stopPropagation();
        var currentUrl = rec.photoURL || rec.photo || '';
        if (currentUrl && typeof fbShowPhotoPreview === 'function') {
          fbShowPhotoPreview(currentUrl, rec.name);
        } else {
          l360PhotoInput.click();
        }
      });
    }
    l360PhotoInput.addEventListener('change', function(e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var avatar = document.getElementById('l360-avatar');
      if (avatar) {
        avatar.className = 'l360-photo l360-photo-loading';
        avatar.innerHTML = '<div class="l360-spinner"></div>';
      }
      if (typeof fbCompressAndSavePhoto === 'function') {
        fbCompressAndSavePhoto(file, 'leads', rec.id).then(function(url) {
          if (avatar) { avatar.className = 'l360-photo'; avatar.innerHTML = '<img src="'+url+'" alt="'+rec.name+'" />'; }
          fbShowStatus('Photo uploaded');
        }).catch(function(err) {
          console.error('[L360] Photo error:', err);
          if (avatar) { avatar.className = 'l360-photo l360-photo-initials'; avatar.innerHTML = initials; }
          fbShowStatus('Photo upload failed', true);
        });
      } else {
        var reader = new FileReader();
        reader.onload = function(ev) {
          rec.photo = ev.target.result;
          if (avatar) { avatar.className = 'l360-photo'; avatar.innerHTML = '<img src="'+ev.target.result+'" alt="'+rec.name+'" />'; }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  var compLink = document.getElementById('l360-company-link');
  if (compLink && rec.account) {
    compLink.addEventListener('click', function(){ navigate('record','accounts',rec.account); });
  }

  var acctNav = document.getElementById('l360-acct-nav');
  if (acctNav) {
    acctNav.addEventListener('click', function(){
      var aid = acctNav.getAttribute('data-acct-id');
      if(aid) navigate('record','accounts',aid);
    });
  }

  /* Convert button */
  var convertBtn = document.getElementById('l360-convert');
  if (convertBtn) {
    convertBtn.addEventListener('click', function(){
      rec.stage = 'converted';
      renderLead360(container, rec);
      showDragToast && showDragToast(rec.name, 'converted', 'leads');
    });
  }

  /* Funnel step click to change stage */
  container.querySelectorAll('.l360-funnel-step[data-stage]').forEach(function(step) {
    step.style.cursor = 'pointer';
    step.addEventListener('click', function(){
      var ns = step.getAttribute('data-stage');
      if (ns && ns !== rec.stage) {
        rec.stage = ns;
        renderLead360(container, rec);
        showDragToast && showDragToast(rec.name, ns, 'leads');
      }
    });
  });

  container.querySelectorAll('.l360-row[data-nav-id]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate('record', el.getAttribute('data-nav-obj'), el.getAttribute('data-nav-id')); });
  });
  container.querySelectorAll('.l360-section-link[data-nav]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate(el.getAttribute('data-nav')); });
  });
  bindCrmActionButtons(container);
  bindDetailsLinks(container);
}

/* ─── Lead 360 Helpers ─── */

function l360ComputeScore(rec) {
  var score = 30;
  if (rec.priority === 'High') score += 30;
  else if (rec.priority === 'Medium') score += 15;
  if (rec.source === 'Referral') score += 15;
  else if (rec.source === 'Trade Show') score += 10;
  else if (rec.source === 'Website') score += 5;
  if (rec.stage === 'qualified') score += 12;
  else if (rec.stage === 'contacted') score += 6;
  else if (rec.stage === 'proposal') score += 18;
  else if (rec.stage === 'converted') score += 25;
  if (rec.estimatedValue && rec.estimatedValue >= 20000000) score += 10;
  return Math.min(score, 100);
}

function l360Temperature(score) {
  if (score >= 70) return {key:'hot',   label:'Hot Lead',  icon:'\uD83D\uDD25', color:'var(--danger)'};
  if (score >= 40) return {key:'warm',  label:'Warm Lead', icon:'\u26C5',       color:'var(--warning)'};
  return                  {key:'cold',  label:'Cold Lead', icon:'\u2744\uFE0F', color:'var(--text-light)'};
}

function l360Engagement(rec) {
  if (rec.stage === 'qualified' || rec.stage === 'proposal' || rec.stage === 'converted') return 'High';
  if (rec.stage === 'contacted') return 'Medium';
  return 'Low';
}

function l360NextAction(rec) {
  if (rec.stage === 'new') return {icon:'phone', color:'#3b82f6', text:'Schedule an initial discovery call to qualify this lead.'};
  if (rec.stage === 'contacted') return {icon:'users', color:'#8b5cf6', text:'Book a face-to-face meeting to assess project scope and budget.'};
  if (rec.stage === 'qualified') return {icon:'quotes', color:'#f59e0b', text:'Prepare and send a tailored proposal with pricing.'};
  if (rec.stage === 'proposal') return {icon:'opportunities', color:'#10b981', text:'Follow up on proposal and negotiate to close.'};
  return {icon:'chart', color:'#10b981', text:'Lead converted. Create opportunity and assign project team.'};
}

function l360KpiCard(value, label, color, insight, insightColor) {
  return '<div class="l360-kpi">' +
    '<div class="l360-kpi-value" style="color:'+color+'">' + value + '</div>' +
    '<div class="l360-kpi-label">' + label + '</div>' +
    (insight ? '<div class="l360-kpi-insight" style="color:'+(insightColor||'var(--text-muted)')+'">' + insight + '</div>' : '') +
    '</div>';
}

function l360SectionOpen(title, navKey) {
  return '<div class="l360-section"><div class="l360-section-head">' +
    '<span class="l360-section-title">' + title + '</span>' +
    '<span class="l360-section-link" data-nav="' + navKey + '">View all</span></div>';
}


/* ════════════════════════════════════════════════════════
   OPPORTUNITY 360 — Deal Command Center
   ════════════════════════════════════════════════════════ */

function renderOpp360(container, rec) {
  injectO360Styles();
  var D = window.DATA;
  var oppId = rec.id;

  /* ── Resolve related data ── */
  var account = (D.accounts||[]).find(function(a){ return a.id === rec.account; });
  var accountName = account ? account.name : '—';

  var contacts = (D.contacts||[]).filter(function(c){ return c.account === rec.account; });
  var quotes = (D.quotes||[]).filter(function(q){ return q.opportunity === oppId || q.account === rec.account; });

  /* Activities */
  var activities = (D.activities||[]).filter(function(a){ return a.opportunity === oppId; });
  if (!activities.length) {
    activities = (D.upcoming||[]).slice(0,4).map(function(u,i){
      return {id:'oa'+i, type:u.icon||'call', subject:u.name, date:u.date, time:u.time, contact:u.contact};
    });
  }

  var tasks = (D.tasks||[]).slice(0,3);

  /* Computed */
  var amtStr = typeof fmtAmount==='function' ? fmtAmount(rec.amount||0) : ((rec.amount||0)/1e6).toFixed(1)+'M€';
  var weighted = (rec.amount||0) * ((rec.prob||0)/100);
  var weightedStr = typeof fmtAmount==='function' ? fmtAmount(weighted) : (weighted/1e6).toFixed(1)+'M€';
  var closeStr = rec.close ? fmtDate(rec.close) : '—';
  var stages = STAGES.opportunities||[];
  var currentIdx = stages.map(function(s){return s.key;}).indexOf(rec.stage);
  var stObj = stages[currentIdx] || {};
  var nextAction = o360NextAction(rec);
  var probColor = (rec.prob||0) >= 60 ? 'var(--success)' : (rec.prob||0) >= 30 ? 'var(--warning)' : 'var(--text-light)';

  /* Initials for avatar fallback */
  var initials = rec.name ? rec.name.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase() : 'OP';

  /* ── BUILD HTML ── */
  var h = '<div class="o360">';

  /* Back */
  h += '<div class="o360-back" id="o360-back">' + svgIcon('arrowLeft',14,'var(--text-muted)') + '<span>Opportunities</span></div>';

  /* ── Header Card (Lead-style) ── */
  h += '<div class="o360-header-card">';
  h += '<div class="o360-header-top">';

  /* Photo/Avatar with upload */
  var photoUrl = rec.photoURL || rec.photo || '';
  h += '<div class="o360-photo-wrap" id="o360-photo-wrap" title="Click to change photo">';
  if (photoUrl) {
    h += '<div class="o360-photo" id="o360-avatar"><img src="'+photoUrl+'" alt="'+rec.name+'" /></div>';
  } else {
    h += '<div class="o360-photo o360-photo-initials" id="o360-avatar">' + svgIcon('opportunities',24,'#fff') + '</div>';
  }
  h += '<div class="o360-photo-overlay">' + svgIcon('plus',16,'#fff') + '</div>';
  h += '<input type="file" id="o360-photo-input" accept="image/*" style="display:none" />';
  h += '</div>';

  h += '<div class="o360-header-info">';
  h += '<div class="o360-name-row"><h1 class="o360-name">' + rec.name + '</h1></div>';
  h += '<div class="o360-company" id="o360-acct-link" data-acct-id="'+(rec.account||'')+'">' + svgIcon('accounts',13,'var(--accent)') + '<span>' + accountName + '</span></div>';

  /* Detail chips */
  h += '<div class="o360-details-row">';
  h += '<div class="o360-detail-chip"><span class="dot" style="display:inline-block;width:6px;height:6px;border-radius:50%;background:'+stObj.color+';margin-right:3px"></span>' + stObj.label + '</div>';
  h += '<div class="o360-detail-chip">' + svgIcon('activities',12,'var(--text-muted)') + '<span>Close ' + closeStr + '</span></div>';
  h += '</div>';

  /* Meta row */
  h += '<div class="o360-meta-row">';
  h += '<div class="o360-meta-tag">Owner: <strong>'+(rec.owner||'Me')+'</strong></div>';
  if (rec.createdDate) h += '<div class="o360-meta-tag">Created: <strong>'+fmtDate(rec.createdDate)+'</strong></div>';
  h += '</div>';

  h += '</div>'; /* header-info */

  /* Header right metrics */
  h += '<div class="o360-header-metrics">';
  h += '<div class="o360-hmetric"><div class="o360-hmetric-val" style="color:var(--accent)">' + amtStr + '</div><div class="o360-hmetric-label">Deal Value</div></div>';
  h += '<div class="o360-hmetric"><div class="o360-hmetric-val" style="color:'+probColor+'">' + (rec.prob||0) + '%</div><div class="o360-hmetric-label">Probability</div></div>';
  h += '</div>';

  h += '</div>'; /* header-top */

  /* Quick Actions */
  h += '<div class="o360-actions">';
  h += '<button class="o360-action-btn o360-action-primary">' + svgIcon('phone',13,'#fff') + '<span>Call</span></button>';
  h += '<button class="o360-action-btn o360-action-primary">' + svgIcon('mail',13,'#fff') + '<span>Send Email</span></button>';
  h += '<button class="o360-action-btn o360-action-outline">' + svgIcon('activities',13,'var(--text-muted)') + '<span>Add Activity</span></button>';
  h += '<button class="o360-action-btn o360-action-outline">' + svgIcon('quotes',13,'var(--text-muted)') + '<span>Create Quote</span></button>';
  h += '<button class="o360-action-btn o360-action-success" id="o360-advance">' + svgIcon('check',13,'#fff') + '<span>Mark Stage Complete</span></button>';
  h += crmActionButtons('o360', 'opportunities', oppId);
  h += '</div></div>';

  /* ── 4 KPI Cards (like Lead) ── */
  h += '<div class="o360-kpi-row">';
  h += o360KpiCard(amtStr, 'Deal Value', 'var(--accent)', 'Weighted: '+weightedStr, 'var(--success)');
  h += o360KpiCard((rec.prob||0)+'%', 'Probability', probColor, 'Stage: '+stObj.label, 'var(--text-muted)');
  h += o360KpiCard(activities.length, 'Activities', 'var(--purple)', 'Last: recently', 'var(--text-muted)');
  h += o360KpiCard(quotes.length, 'Quotes', 'var(--warning)', quotes.length>0?'Latest active':'None yet', 'var(--text-muted)');
  h += '</div>';

  /* ── Pipeline Progression ── */
  h += '<div class="o360-funnel-card">';
  h += '<div class="o360-funnel-title">Pipeline Progression</div>';
  h += '<div class="o360-funnel">';
  stages.forEach(function(st, i) {
    var isCurrent = st.key === rec.stage;
    var isPast = i < currentIdx;
    var cls = isCurrent ? 'o360-funnel-step o360-funnel-current' : (isPast ? 'o360-funnel-step o360-funnel-done' : 'o360-funnel-step');
    h += '<div class="'+cls+'" data-stage="'+st.key+'">';
    h += '<div class="o360-funnel-dot" style="background:'+(isCurrent||isPast?st.color:'#e2e8f0')+'">';
    if (isPast) h += '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>';
    if (isCurrent) h += '<div class="o360-funnel-pulse"></div>';
    h += '</div>';
    h += '<div class="o360-funnel-label">' + st.label + '</div>';
    if (i < stages.length - 1) h += '<div class="o360-funnel-line" style="background:'+(isPast?st.color:'#e2e8f0')+'"></div>';
    h += '</div>';
  });
  h += '</div></div>';

  /* ── 2-Column Layout ── */
  h += '<div class="o360-grid2">';

  /* LEFT — Business Context */
  h += '<div class="o360-col">';

  /* Quotes */
  h += o360SectionOpen('Quotes', 'quotes', quotes.length);
  if (!quotes.length) h += '<div class="o360-empty">No quotes linked</div>';
  else quotes.forEach(function(q,i) {
    var qAmt = typeof fmtAmount==='function' ? fmtAmount(q.amount||0) : ((q.amount||0)/1e6).toFixed(1)+'M€';
    var stColor = q.status==='Sent'?'var(--accent)':q.status==='Accepted'?'var(--success)':'var(--text-light)';
    h += '<div class="o360-row'+(i===quotes.length-1?' o360-row-last':'')+'">';
    h += '<div class="o360-row-left"><div class="o360-row-title">'+(q.name||'Quote #'+q.id)+'</div>';
    h += '<div class="o360-row-sub">'+(q.date||'')+(q.status?' · '+q.status:'')+'</div></div>';
    h += '<div class="o360-row-right">';
    if(q.amount) h += '<span class="o360-row-amount">'+qAmt+'</span>';
    h += '<span class="stage-badge" style="color:'+stColor+'"><span class="dot" style="background:'+stColor+'"></span>'+(q.status||'Draft')+'</span>';
    h += '</div></div>';
  });
  h += '</div>';

  /* Contacts */
  h += o360SectionOpen('Contacts Involved', 'contacts', contacts.length);
  if (!contacts.length) h += '<div class="o360-empty">No contacts linked</div>';
  else contacts.forEach(function(c,i) {
    var ci = c.name ? c.name.split(' ').map(function(w){return w[0];}).join('').substring(0,2).toUpperCase() : '?';
    h += '<div class="o360-row'+(i===contacts.length-1?' o360-row-last':'')+'" data-nav-obj="contacts" data-nav-id="'+c.id+'">';
    h += '<div class="o360-contact-avatar">'+ci+'</div>';
    h += '<div class="o360-row-left"><div class="o360-row-title">'+c.name+'</div><div class="o360-row-sub">'+(c.role||'—')+'</div></div>';
    h += '<div style="display:flex;gap:4px">';
    h += '<div class="o360-contact-btn" title="Call">'+svgIcon('phone',11,'var(--text-light)')+'</div>';
    h += '<div class="o360-contact-btn" title="Email">'+svgIcon('mail',11,'var(--text-light)')+'</div>';
    h += '</div></div>';
  });
  h += '</div>';

  /* Tasks (moved to left for balance) */
  h += o360SectionOpen('Tasks', 'activities', tasks.length);
  if (!tasks.length) h += '<div class="o360-empty">No tasks</div>';
  else tasks.forEach(function(t,i) {
    var pc = {High:'var(--danger)',Medium:'var(--warning)',Low:'var(--text-light)'};
    h += '<div class="o360-row'+(i===tasks.length-1?' o360-row-last':'')+'">';
    h += '<div style="display:flex;align-items:flex-start;gap:7px;flex:1;min-width:0"><span class="o360-task-dot" style="background:'+(pc[t.priority]||'var(--text-light)')+'"></span>';
    h += '<div style="flex:1;min-width:0"><div class="o360-row-title">'+t.name+'</div><div class="o360-row-sub">'+(t.ref||'')+(t.status?' · '+t.status:'')+'</div></div></div>';
    h += '<span style="font-size:10px;font-weight:500;color:'+(t.status==='In Progress'?'var(--accent)':'var(--text-muted)')+'">'+t.status+'</span>';
    h += '</div>';
  });
  h += '</div>';

  /* Details */
  h += crmDetailsSection('o360', 'opportunities', rec);

  h += '</div>'; /* end left col */

  /* RIGHT — Sales Action */
  h += '<div class="o360-col">';

  /* Next Action */
  h += '<div class="o360-next-action">';
  h += '<div class="o360-na-icon" style="background:'+nextAction.color+'14;border-color:'+nextAction.color+'40">'+svgIcon(nextAction.icon,14,nextAction.color)+'</div>';
  h += '<div class="o360-na-body">';
  h += '<div class="o360-na-label">Next Recommended Action</div>';
  h += '<div class="o360-na-text">' + nextAction.text + '</div>';
  h += '</div></div>';

  /* Activity Timeline */
  h += o360SectionOpen('Activity Timeline', 'activities', activities.length);
  if (!activities.length) h += '<div class="o360-empty">No activities recorded</div>';
  else {
    h += '<div class="o360-timeline">';
    activities.forEach(function(a,i) {
      var isLast = i===activities.length-1;
      var typeColors = {call:'#3b82f6',phone:'#3b82f6',meeting:'#8b5cf6',users:'#8b5cf6',email:'#10b981',mail:'#10b981','site visit':'#ef4444',mapPin:'#ef4444'};
      var tc = typeColors[a.type] || typeColors[a.icon] || 'var(--text-light)';
      var iconKey = a.icon || (a.type==='call'||a.type==='phone'?'phone':a.type==='meeting'||a.type==='users'?'users':a.type==='email'||a.type==='mail'?'mail':'activities');
      var typeLabels = {phone:'Call',call:'Call',users:'Meeting',meeting:'Meeting',mail:'Email',email:'Email',mapPin:'Site Visit','site visit':'Site Visit'};
      var tl = typeLabels[a.type] || typeLabels[a.icon] || 'Activity';
      h += '<div class="o360-tl-item">';
      if(!isLast) h += '<div class="o360-tl-line"></div>';
      h += '<div class="o360-tl-icon" style="background:'+tc+'14;border-color:'+tc+'40">'+svgIcon(iconKey,11,tc)+'</div>';
      h += '<div class="o360-tl-body">';
      h += '<div class="o360-tl-top"><span class="o360-tl-subject">'+(a.subject||a.name||tl)+'</span><span class="o360-tl-type" style="color:'+tc+'">'+tl+'</span></div>';
      h += '<div class="o360-tl-meta">'+(a.contact||'')+(a.date?' · '+a.date:'')+'</div>';
      h += '</div></div>';
    });
    h += '</div>';
  }
  h += '</div>';

  h += '</div>'; /* end right col */
  h += '</div>'; /* end grid */
  h += '</div>'; /* end o360 */

  container.innerHTML = h;
  container.scrollTop = 0;

  /* ── Bind Events ── */
  document.getElementById('o360-back').addEventListener('click', function(){ navigate('opportunities'); });

  /* Photo: overlay click = upload, avatar click = preview */
  var photoWrap = document.getElementById('o360-photo-wrap');
  var photoInput = document.getElementById('o360-photo-input');
  if (photoWrap && photoInput) {
    var o360Overlay = photoWrap.querySelector('.o360-photo-overlay');
    if (o360Overlay) {
      o360Overlay.addEventListener('click', function(e){ e.stopPropagation(); photoInput.click(); });
    }
    var o360AvatarEl = document.getElementById('o360-avatar');
    if (o360AvatarEl) {
      o360AvatarEl.addEventListener('click', function(e){
        e.stopPropagation();
        var currentUrl = rec.photoURL || rec.photo || '';
        if (currentUrl && typeof fbShowPhotoPreview === 'function') {
          fbShowPhotoPreview(currentUrl, rec.name);
        } else {
          photoInput.click();
        }
      });
    }
    photoInput.addEventListener('change', function(e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var avatar = document.getElementById('o360-avatar');
      if (avatar) {
        avatar.className = 'o360-photo o360-photo-loading';
        avatar.innerHTML = '<div class="o360-spinner"></div>';
      }
      if (typeof fbCompressAndSavePhoto === 'function') {
        fbCompressAndSavePhoto(file, 'opportunities', oppId).then(function(url) {
          if (avatar) { avatar.className = 'o360-photo'; avatar.innerHTML = '<img src="'+url+'" alt="'+rec.name+'" />'; }
          fbShowStatus('Photo uploaded');
        }).catch(function(err) {
          console.error('[O360] Photo error:', err);
          if (avatar) { avatar.className = 'o360-photo o360-photo-initials'; avatar.innerHTML = svgIcon('opportunities',24,'#fff'); }
          fbShowStatus('Photo upload failed', true);
        });
      } else {
        var reader = new FileReader();
        reader.onload = function(ev) {
          rec.photo = ev.target.result;
          if (avatar) { avatar.className = 'o360-photo'; avatar.innerHTML = '<img src="'+ev.target.result+'" alt="'+rec.name+'" />'; }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  /* Account link */
  var acctLink = document.getElementById('o360-acct-link');
  if (acctLink && rec.account) {
    acctLink.addEventListener('click', function(){ navigate('record','accounts',rec.account); });
  }

  /* Mark Stage Complete */
  var advBtn = document.getElementById('o360-advance');
  if (advBtn) {
    advBtn.addEventListener('click', function(){
      var ks = stages.map(function(s){return s.key;});
      var idx = ks.indexOf(rec.stage);
      if (idx < ks.length - 1) {
        rec.stage = ks[idx + 1];
        renderOpp360(container, rec);
        if (typeof showDragToast === 'function') showDragToast(rec.name, rec.stage, 'opportunities');
      }
    });
  }

  /* Pipeline step click */
  container.querySelectorAll('.o360-funnel-step[data-stage]').forEach(function(step) {
    step.addEventListener('click', function(){
      var ns = step.getAttribute('data-stage');
      if (ns && ns !== rec.stage) {
        rec.stage = ns;
        renderOpp360(container, rec);
        if (typeof showDragToast === 'function') showDragToast(rec.name, ns, 'opportunities');
      }
    });
  });

  /* Row navigation */
  container.querySelectorAll('.o360-row[data-nav-id]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate('record', el.getAttribute('data-nav-obj'), el.getAttribute('data-nav-id')); });
  });
  container.querySelectorAll('.o360-section-link[data-nav]').forEach(function(el) {
    el.addEventListener('click', function(){ navigate(el.getAttribute('data-nav')); });
  });
  bindCrmActionButtons(container);
  bindDetailsLinks(container);
}

/* ─── Opp 360 Helpers ─── */

function o360SectionOpen(title, navKey, count) {
  return '<div class="o360-section"><div class="o360-section-head">' +
    '<span class="o360-section-title">'+title+'</span>' +
    (count!==null&&count!==undefined?'<span class="o360-section-count">'+count+'</span>':'') +
    '<span class="o360-section-link" data-nav="'+navKey+'">View all</span></div>';
}

function o360KpiCard(value, label, color, insight, insightColor) {
  return '<div class="o360-kpi">' +
    '<div class="o360-kpi-value" style="color:'+color+'">' + value + '</div>' +
    '<div class="o360-kpi-label">' + label + '</div>' +
    (insight ? '<div class="o360-kpi-insight" style="color:'+(insightColor||'var(--text-muted)')+'">' + insight + '</div>' : '') +
    '</div>';
}

function o360NextAction(rec) {
  if (rec.stage === 'lead') return {icon:'phone', color:'#3b82f6', text:'Schedule a discovery call to qualify this opportunity.'};
  if (rec.stage === 'study') return {icon:'users', color:'#8b5cf6', text:'Arrange a technical meeting to define project scope and requirements.'};
  if (rec.stage === 'tender') return {icon:'quotes', color:'#f59e0b', text:'Prepare and submit tender documentation before deadline.'};
  if (rec.stage === 'proposal') return {icon:'mail', color:'#10b981', text:'Send the commercial proposal and follow up with the decision maker.'};
  if (rec.stage === 'negotiation') return {icon:'phone', color:'#3b82f6', text:'Follow up on revised pricing to close negotiations.'};
  if (rec.stage === 'closed_won') return {icon:'projects', color:'#10b981', text:'Initiate project kickoff and assign delivery team.'};
  return {icon:'chart', color:'#6366f1', text:'Project launched — monitor delivery and client satisfaction.'};
}


/* ═══════════════════════════════════════════
   OPP 360 — CSS INJECTION
   ═══════════════════════════════════════════ */

function injectO360Styles() {
  if (document.getElementById('o360-css')) return;
  var s = document.createElement('style'); s.id = 'o360-css';
  s.textContent = '\
.o360{padding:14px 20px 36px;max-width:1280px;margin:0 auto}\
.o360-back{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted);cursor:pointer;margin-bottom:8px;font-weight:500}\
.o360-back:hover{color:var(--text)}\
\
/* Header Card — Lead style */\
.o360-header-card{background:var(--card);border-radius:10px;box-shadow:0 1px 4px rgba(0,0,0,.06);border:1px solid var(--border);margin-bottom:14px;overflow:hidden}\
.o360-header-top{padding:22px 26px 18px;display:flex;gap:20px;align-items:flex-start}\
\
/* Photo/Avatar */\
.o360-photo{width:92px;height:92px;border-radius:50%;flex-shrink:0;overflow:hidden;border:1px solid #E6E8EC;box-shadow:0 2px 8px rgba(0,0,0,.06);background:#fff;transition:transform .18s ease,box-shadow .18s ease}\
.o360-photo img{width:100%;height:100%;object-fit:cover}\
.o360-photo.o360-photo-initials{display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--accent),var(--accent-hover));font-size:28px;font-weight:800;color:#fff;letter-spacing:-.5px}\
.o360-photo-wrap{position:relative;cursor:pointer;flex-shrink:0}\
.o360-photo-wrap:hover .o360-photo{transform:scale(1.05);box-shadow:0 6px 20px rgba(0,0,0,.12)}\
.o360-photo-overlay{position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s}\
.o360-photo-wrap:hover .o360-photo-overlay{opacity:1}\
.o360-photo-loading{display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--accent),var(--accent-hover))}\
.o360-spinner{width:22px;height:22px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:o360spin .6s linear infinite}\
@keyframes o360spin{to{transform:rotate(360deg)}}\
\
.o360-header-info{flex:1;min-width:0}\
.o360-name-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:2px}\
.o360-name{font-size:20px;font-weight:800;color:var(--text);letter-spacing:-.3px;line-height:1.2;margin:0}\
.o360-company{display:flex;align-items:center;gap:5px;color:var(--accent);font-size:13px;font-weight:600;cursor:pointer;margin-bottom:8px}\
.o360-company:hover{text-decoration:underline}\
.o360-details-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}\
.o360-detail-chip{display:inline-flex;align-items:center;gap:5px;background:#f8f9fb;border:1px solid var(--border);padding:4px 10px;border-radius:6px;font-size:11px;color:var(--text-muted);font-weight:500}\
.o360-meta-row{display:flex;flex-wrap:wrap;gap:8px}\
.o360-meta-tag{font-size:10px;color:var(--text-light);font-weight:500}\
.o360-meta-tag strong{color:var(--text-muted);font-weight:600}\
\
/* Header metrics */\
.o360-header-metrics{display:flex;flex-direction:column;gap:12px;flex-shrink:0;align-items:center;padding-left:20px;border-left:1px solid var(--border)}\
.o360-hmetric{display:flex;flex-direction:column;align-items:center}\
.o360-hmetric-val{font-size:22px;font-weight:800;letter-spacing:-.5px;line-height:1;font-variant-numeric:tabular-nums}\
.o360-hmetric-label{font-size:9px;color:var(--text-light);font-weight:500;margin-top:2px;text-transform:uppercase;letter-spacing:.3px}\
\
/* Actions */\
.o360-actions{display:flex;gap:7px;padding:12px 26px 14px;border-top:1px solid var(--border);flex-wrap:wrap}\
.o360-action-btn{display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:7px;border:none;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;transition:all .12s}\
.o360-action-primary{background:var(--accent);color:#fff}\
.o360-action-primary:hover{background:var(--accent-hover)}\
.o360-action-outline{background:transparent;border:1px solid var(--border);color:var(--text-muted)}\
.o360-action-outline:hover{border-color:#bbb;color:var(--text);background:#f8f9fb}\
.o360-action-success{background:var(--success);color:#fff}\
.o360-action-success:hover{background:#059669}\
\
/* KPI Row — 4 cards like Lead */\
.o360-kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}\
.o360-kpi{background:var(--card);border-radius:10px;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,.04);padding:16px 18px;text-align:center;transition:all .15s}\
.o360-kpi:hover{box-shadow:0 4px 14px rgba(0,0,0,.08);transform:translateY(-2px)}\
.o360-kpi-value{font-size:28px;font-weight:800;letter-spacing:-1px;line-height:1;margin-bottom:3px;font-variant-numeric:tabular-nums}\
.o360-kpi-label{font-size:10.5px;color:var(--text-muted);font-weight:500;text-transform:uppercase;letter-spacing:.4px}\
.o360-kpi-insight{font-size:9.5px;font-weight:600;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)}\
\
/* Funnel card */\
.o360-funnel-card{background:var(--card);border-radius:10px;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,.04);padding:18px 24px;margin-bottom:14px}\
.o360-funnel-title{font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:16px}\
.o360-funnel{display:flex;align-items:center;gap:0;width:100%;padding-bottom:38px}\
.o360-funnel-step{display:flex;align-items:center;flex:1;position:relative;cursor:pointer}\
.o360-funnel-step:last-child{flex:0 0 auto}\
.o360-funnel-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;z-index:1;transition:all .2s}\
.o360-funnel-dot:hover{transform:scale(1.1)}\
.o360-funnel-current .o360-funnel-dot{box-shadow:0 0 0 4px rgba(37,99,235,.15)}\
.o360-funnel-pulse{width:10px;height:10px;border-radius:50%;background:#fff;animation:o360pulse 1.5s ease-in-out infinite}\
@keyframes o360pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.7)}}\
.o360-funnel-label{position:absolute;top:40px;left:50%;transform:translateX(-50%);font-size:9.5px;font-weight:600;color:var(--text-muted);white-space:nowrap;text-transform:uppercase;letter-spacing:.3px}\
.o360-funnel-current .o360-funnel-label{color:var(--accent);font-weight:700}\
.o360-funnel-done .o360-funnel-label{color:var(--success)}\
.o360-funnel-line{flex:1;height:3px;border-radius:2px;margin:0 6px;transition:background .2s}\
\
/* 2-Column Grid */\
.o360-grid2{display:grid;grid-template-columns:1.12fr 1fr;gap:14px;align-items:start}\
.o360-col{display:flex;flex-direction:column;gap:12px}\
\
/* Sections */\
.o360-section{background:var(--card);border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,.04);border:1px solid var(--border);overflow:hidden}\
.o360-section-head{padding:11px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:7px}\
.o360-section-title{font-size:11.5px;font-weight:700;color:var(--text);text-transform:uppercase;letter-spacing:.5px}\
.o360-section-count{font-size:10px;font-weight:600;color:var(--accent);background:var(--accent-light);padding:1px 7px;border-radius:8px}\
.o360-section-link{margin-left:auto;font-size:10px;font-weight:500;color:var(--text-light);cursor:pointer;transition:color .12s}\
.o360-section-link:hover{color:var(--accent)}\
\
/* Rows */\
.o360-row{padding:10px 16px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .08s;display:flex;align-items:center;gap:10px}\
.o360-row:hover{background:#fafbfc}\
.o360-row-last{border-bottom:none}\
.o360-row-left{flex:1;min-width:0}\
.o360-row-right{display:flex;align-items:center;gap:8px;flex-shrink:0}\
.o360-row-title{font-size:12.5px;font-weight:700;color:var(--text);line-height:1.2}\
.o360-row-sub{font-size:10px;color:var(--text-light);margin-top:2px}\
.o360-row-amount{font-size:15px;font-weight:800;color:var(--text);font-variant-numeric:tabular-nums;letter-spacing:-.3px;margin-right:4px}\
.o360-empty{padding:20px 16px;text-align:center;color:var(--text-light);font-size:11px}\
\
/* Contact */\
.o360-contact-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--accent-light),#bfdbfe);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--accent);flex-shrink:0}\
.o360-contact-btn{width:28px;height:28px;border-radius:6px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .12s}\
.o360-contact-btn:hover{background:#f1f5f9;border-color:#d1d5db}\
.o360-task-dot{width:7px;height:7px;border-radius:50%;margin-top:5px;flex-shrink:0}\
\
/* Next Action */\
.o360-next-action{background:var(--card);border-radius:10px;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,.04);padding:16px 18px;display:flex;gap:14px;align-items:center}\
.o360-na-icon{width:36px;height:36px;border-radius:10px;border:1.5px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0}\
.o360-na-body{flex:1;min-width:0}\
.o360-na-label{font-size:9px;font-weight:700;color:var(--text-light);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px}\
.o360-na-text{font-size:12.5px;font-weight:600;color:var(--text);line-height:1.4}\
\
/* Timeline */\
.o360-timeline{padding:12px 16px}\
.o360-tl-item{display:flex;gap:10px;position:relative;padding-bottom:16px}\
.o360-tl-item:last-child{padding-bottom:0}\
.o360-tl-line{position:absolute;left:13px;top:28px;bottom:0;width:1.5px;background:var(--border);border-radius:1px}\
.o360-tl-item:last-child .o360-tl-line{display:none}\
.o360-tl-icon{width:26px;height:26px;border-radius:8px;border:1.5px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0;z-index:1;background:var(--card)}\
.o360-tl-body{flex:1;min-width:0;padding-top:2px}\
.o360-tl-top{display:flex;justify-content:space-between;align-items:baseline}\
.o360-tl-subject{font-size:12px;font-weight:600;color:var(--text);line-height:1.2}\
.o360-tl-type{font-size:10px;font-weight:600;flex-shrink:0;margin-left:8px}\
.o360-tl-meta{font-size:10px;color:var(--text-light);margin-top:2px}\
\
@media(max-width:1100px){\
  .o360-grid2{grid-template-columns:1fr}\
  .o360-kpi-row{grid-template-columns:repeat(2,1fr)}\
  .o360-header-top{flex-wrap:wrap}\
  .o360-header-metrics{border-left:none;padding-left:0;flex-direction:row;gap:20px;margin-top:10px}\
}\
@media(max-width:768px){\
  .o360-kpi-row{grid-template-columns:repeat(2,1fr)}\
  .o360-actions{flex-wrap:wrap}\
  .o360-funnel{flex-wrap:wrap;gap:8px;padding-bottom:10px}\
  .o360-funnel-line{display:none}\
  .o360-funnel-label{position:static;transform:none;margin-top:4px}\
  .o360-funnel-step{flex-direction:column;align-items:center;flex:0 0 auto}\
}\
@media(max-width:640px){\
  .o360{padding:10px 10px 32px}\
  .o360-header-top{padding:16px 14px 12px;gap:12px}\
  .o360-photo{width:64px;height:64px;font-size:20px}\
  .o360-name{font-size:17px}\
  .o360-kpi-value{font-size:22px}\
  .o360-actions{padding:10px 14px}\
  .o360-action-btn{padding:6px 10px;font-size:11px}\
  .o360-funnel-card{padding:14px 12px}\
  .o360-funnel-dot{width:22px;height:22px}\
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
    '<div style="font-size:11px;color:var(--text-light)">'+parentLabel+'</div></div></div>'+
    '<div style="display:flex;gap:6px">'+
    '<button class="crm-edit-btn" data-obj="'+objKey+'" data-rec="'+rec.id+'" style="display:inline-flex;align-items:center;gap:5px;padding:6px 14px;border-radius:7px;border:1px solid var(--border);background:#fff;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;color:var(--text-muted);transition:all .12s">'+svgIcon('edit',13,'var(--text-muted)')+' Edit</button>'+
    '<button class="crm-delete-btn" data-obj="'+objKey+'" data-rec="'+rec.id+'" style="display:inline-flex;align-items:center;gap:5px;padding:6px 14px;border-radius:7px;border:1px solid #fecaca;background:#fff;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;color:#ef4444;transition:all .12s">'+svgIcon('trash',13,'#ef4444')+' Delete</button>'+
    '</div></div>';

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
  bindCrmActionButtons(headerEl);
}


/* ════════════════════════════════════════════════════════
   EDIT / DELETE — Centralized Modal System
   Shared across ALL 360 layouts
   ════════════════════════════════════════════════════════ */

/* ── Editable fields per object ── */
var EDIT_FIELDS = {
  accounts: [
    {key:'name',      label:'Account Name',  type:'text'},
    {key:'industry',  label:'Industry',      type:'select', options:['General Contractor','Real Estate Developer','Civil Engineering','Road & Rail','Foundations & Piling','Building Materials','Infrastructure','Energy','Other']},
    {key:'city',      label:'City',          type:'text'},
    {key:'phone',     label:'Phone',         type:'text'},
    {key:'website',   label:'Website',       type:'text'},
    {key:'pipeline',  label:'Pipeline Value', type:'number'},
    {key:'opps',      label:'Open Opps',     type:'number'},
    {key:'status',    label:'Status',        type:'select', options:['Active','Prospect','Inactive']}
  ],
  contacts: [
    {key:'name',      label:'Contact Name',  type:'text'},
    {key:'role',      label:'Role / Title',  type:'text'},
    {key:'email',     label:'Email',         type:'text'},
    {key:'phone',     label:'Phone',         type:'text'},
    {key:'city',      label:'City',          type:'text'},
    {key:'account',   label:'Account',       type:'text', ref:'accounts'},
    {key:'influence', label:'Influence',     type:'select', options:['Decision Maker','Influencer','Champion','Technical','Other']}
  ],
  leads: [
    {key:'name',          label:'Lead Name',       type:'text'},
    {key:'account',       label:'Account',         type:'text', ref:'accounts'},
    {key:'source',        label:'Source',           type:'select', options:['Website','Trade Show','Referral','Cold Call','Inbound','Partner']},
    {key:'priority',      label:'Priority',         type:'select', options:['High','Medium','Low']},
    {key:'stage',         label:'Stage',            type:'select', options:['new','contacted','qualified','proposal','converted']},
    {key:'estimatedValue',label:'Estimated Value',  type:'number'}
  ],
  opportunities: [
    {key:'name',    label:'Opportunity Name', type:'text'},
    {key:'account', label:'Account',          type:'text', ref:'accounts'},
    {key:'amount',  label:'Amount',           type:'number'},
    {key:'prob',    label:'Probability (%)',   type:'number'},
    {key:'stage',   label:'Stage',            type:'select', options:['lead','study','tender','proposal','negotiation','closed_won','launched']},
    {key:'close',   label:'Close Date',       type:'date'},
    {key:'owner',   label:'Owner',            type:'text'},
    {key:'projectId',label:'Project ID',      type:'text'}
  ],
  projects: [
    {key:'name',              label:'Project Name',       type:'text'},
    {key:'account',           label:'Account',            type:'text', ref:'accounts'},
    {key:'phase',             label:'Phase',              type:'select', options:['prestudy','tender','contracting','construction','delivered']},
    {key:'location',          label:'Location',           type:'text'},
    {key:'budget',            label:'Budget',             type:'number'},
    {key:'value',             label:'Project Value',      type:'number'},
    {key:'owner',             label:'Owner',              type:'text'},
    {key:'commercialLead',    label:'Commercial Lead',    type:'text'},
    {key:'technicalLead',     label:'Technical Lead',     type:'text'},
    {key:'source',            label:'Source',             type:'select', options:['Tender','Referral','Website','Cold Call','Partner']},
    {key:'startDate',         label:'Start Date',         type:'date'},
    {key:'expectedDelivery',  label:'Expected Delivery',  type:'date'},
    {key:'health',            label:'Health',             type:'select', options:['Healthy','Attention','At Risk']},
    {key:'description',       label:'Description',        type:'textarea'}
  ],
  claims: [
    {key:'title',           label:'Claim Title',      type:'text'},
    {key:'status',          label:'Status',           type:'select', options:['Open','In Progress','Investigation','Negotiation','Resolved','Closed']},
    {key:'priority',        label:'Priority',         type:'select', options:['Critical','High','Medium','Low']},
    {key:'risk',            label:'Risk Level',       type:'select', options:['High','Medium','Low']},
    {key:'impact',          label:'Impact Value',     type:'number'},
    {key:'category',        label:'Category',         type:'text'},
    {key:'projectId',       label:'Project',          type:'text', ref:'projects'},
    {key:'accountId',       label:'Account',          type:'text', ref:'accounts'},
    {key:'owner',           label:'Owner',            type:'text'},
    {key:'reportedDate',    label:'Reported Date',    type:'date'},
    {key:'resolvedDate',    label:'Resolved Date',    type:'date'},
    {key:'rootCause',       label:'Root Cause',       type:'textarea'},
    {key:'rootCauseCategory',label:'Root Cause Category',type:'text'},
    {key:'description',     label:'Description',      type:'textarea'}
  ],
  activities: [
    {key:'subject',         label:'Subject',            type:'text'},
    {key:'type',            label:'Type',               type:'select', options:['Call','Meeting','Email','Site Visit']},
    {key:'status',          label:'Status',             type:'select', options:['Planned','In Progress','Completed']},
    {key:'date',            label:'Date',               type:'date'},
    {key:'time',            label:'Time',               type:'text'},
    {key:'duration',        label:'Duration (min)',     type:'number'},
    {key:'location',        label:'Location',           type:'text'},
    {key:'owner',           label:'Owner',              type:'text'},
    {key:'accountId',       label:'Account',            type:'text', ref:'accounts'},
    {key:'contactId',       label:'Contact',            type:'text', ref:'contacts'},
    {key:'opportunityId',   label:'Opportunity',        type:'text', ref:'opportunities'},
    {key:'projectId',       label:'Project',            type:'text', ref:'projects'},
    {key:'purpose',         label:'Purpose / Notes',    type:'textarea'},
    {key:'outcome',         label:'Outcome',            type:'textarea'}
  ],
  quotes: [
    {key:'name',            label:'Quote Name',         type:'text'},
    {key:'stage',           label:'Stage',              type:'select', options:['Draft','Sent','Negotiation','Won','Lost','Expired']},
    {key:'value',           label:'Value',              type:'number'},
    {key:'netValue',        label:'Net Value',          type:'number'},
    {key:'discount',        label:'Discount (%)',       type:'number'},
    {key:'margin',          label:'Margin (%)',         type:'number'},
    {key:'revision',        label:'Revision',           type:'number'},
    {key:'validUntil',      label:'Valid Until',        type:'date'},
    {key:'createdDate',     label:'Created Date',       type:'date'},
    {key:'createdBy',       label:'Created By',         type:'text'},
    {key:'paymentTerms',    label:'Payment Terms',      type:'text'},
    {key:'deliveryTerms',   label:'Delivery Terms',     type:'text'},
    {key:'contact',         label:'Contact',            type:'text'},
    {key:'opportunityId',   label:'Opportunity',        type:'text', ref:'opportunities'},
    {key:'accountId',       label:'Account',            type:'text', ref:'accounts'},
    {key:'winProb',         label:'Win Probability',    type:'text'},
    {key:'competitors',     label:'Competitors',        type:'text'},
    {key:'negoNote',        label:'Negotiation Note',   type:'textarea'}
  ],
  users: [
    {key:'name',       label:'Full Name',    type:'text'},
    {key:'email',      label:'Email',        type:'text'},
    {key:'phone',      label:'Phone',        type:'text'},
    {key:'title',      label:'Job Title',    type:'text'},
    {key:'department', label:'Department',   type:'select', options:['IT Direction','Sales','Sales Management','Operations','Field Ops','Marketing','Finance','HR']},
    {key:'location',   label:'Location',     type:'text'},
    {key:'role',       label:'Role',         type:'select', options:['admin','user']},
    {key:'status',     label:'Status',       type:'select', options:['active','inactive']}
  ]
};


/* ═══════════════════════════════════════════════════
   DETAILS SECTION — Reusable across all 360 pages
   Renders a structured card showing ALL record fields
   ═══════════════════════════════════════════════════ */

/* Hidden keys — never shown in Details panel */
var DETAILS_HIDDEN_KEYS = ['id','photoURL','photo','keyRelationship','lineItems','revisions','activities','documents','siteVisits','claims','participants','notes','tasks','clientStakeholders'];

function crmDetailsSection(prefix, objKey, rec) {
  injectDetailsStyles();
  var fields = EDIT_FIELDS[objKey] || [];

  /* Also discover fields from rec that aren't in EDIT_FIELDS */
  var knownKeys = {};
  fields.forEach(function(f){ knownKeys[f.key] = true; });
  var extraFields = [];
  Object.keys(rec).forEach(function(k) {
    if (knownKeys[k] || DETAILS_HIDDEN_KEYS.indexOf(k) !== -1) return;
    if (typeof rec[k] === 'object' && rec[k] !== null && !Array.isArray(rec[k])) return; /* skip nested objects */
    if (Array.isArray(rec[k])) return; /* skip arrays */
    extraFields.push({key: k, label: _detailsLabel(k), type: 'text'});
  });

  var allFields = fields.concat(extraFields);

  var h = '<div class="crm-details-section ' + prefix + '-section">';
  h += '<div class="crm-details-head ' + prefix + '-section-head">';
  h += '<span class="crm-details-title ' + prefix + '-section-title">' + svgIcon('list', 14, 'var(--text-light)') + ' Record Details</span>';
  h += '<button class="crm-details-edit-btn crm-edit-btn" data-obj="' + objKey + '" data-rec="' + rec.id + '">' + svgIcon('edit', 12, 'var(--accent)') + ' Edit</button>';
  h += '</div>';
  h += '<div class="crm-details-body">';

  allFields.forEach(function(f) {
    var v = rec[f.key];
    if (v === undefined || v === null || v === '') v = '';
    var display = _detailsFormat(f, v, objKey, rec);
    h += '<div class="crm-details-row">';
    h += '<div class="crm-details-label">' + f.label + '</div>';
    h += '<div class="crm-details-value">' + display + '</div>';
    h += '</div>';
  });

  h += '</div></div>';
  return h;
}

/* Format a field value for display */
function _detailsFormat(f, v, objKey, rec) {
  if (v === '' || v === undefined || v === null) return '<span style="color:var(--text-light)">\u2014</span>';

  /* Account reference — resolve name */
  if (f.ref === 'accounts') {
    var acc = (window.DATA.accounts||[]).find(function(a){ return a.id === v; });
    if (acc) return '<span class="crm-details-link" data-nav-obj="accounts" data-nav-id="'+v+'">' + acc.name + '</span>';
    return String(v);
  }
  if (f.ref === 'contacts') {
    var ct = (window.DATA.contacts||[]).find(function(c){ return c.id === v; });
    if (ct) return '<span class="crm-details-link" data-nav-obj="contacts" data-nav-id="'+v+'">' + ct.name + '</span>';
    return String(v);
  }
  if (f.ref === 'opportunities') {
    var op = (window.DATA.opportunities||[]).find(function(o){ return o.id === v; });
    if (op) return '<span class="crm-details-link" data-nav-obj="opportunities" data-nav-id="'+v+'">' + op.name + '</span>';
    return String(v);
  }
  if (f.ref === 'projects') {
    var pj = (window.DATA.projects||[]).find(function(p){ return p.id === v; });
    if (pj) return '<span class="crm-details-link" data-nav-obj="projects" data-nav-id="'+v+'">' + pj.name + '</span>';
    return String(v);
  }

  /* Amount fields */
  if (f.type === 'number' && (f.key.match(/amount|value|budget|pipeline|impact|netValue/) || f.key === 'estimatedValue')) {
    return typeof fmtAmount === 'function' ? fmtAmount(Number(v)) : String(v);
  }

  /* Date fields */
  if (f.type === 'date' || f.key.match(/date|Date|close|start|end|validUntil|createdDate/i)) {
    return typeof fmtDate === 'function' ? fmtDate(v) : String(v);
  }

  /* Stage/phase fields */
  if (f.key === 'stage' || f.key === 'phase') {
    var stArr = STAGES[objKey] || STAGES.projects || [];
    var st = stArr.find(function(s){ return s.key === v; });
    if (st) return '<span class="stage-badge" style="color:'+st.color+'"><span class="dot" style="background:'+st.color+'"></span>'+st.label+'</span>';
    return String(v).replace(/_/g,' ').replace(/\b\w/g, function(c){ return c.toUpperCase(); });
  }

  /* Status fields */
  if (f.key === 'status') {
    var col = v==='Active'||v==='active'||v==='Completed'||v==='Resolved'?'var(--success)':v==='Inactive'||v==='inactive'||v==='Closed'?'var(--text-light)':v==='In Progress'||v==='Investigation'||v==='Negotiation'?'var(--warning)':v==='Open'?'var(--danger)':'var(--text-muted)';
    return '<span class="stage-badge" style="color:'+col+'"><span class="dot" style="background:'+col+'"></span>'+v+'</span>';
  }

  /* Priority / risk */
  if (f.key === 'priority' || f.key === 'risk' || f.key === 'riskLevel') {
    var pc = {High:'var(--danger)',Critical:'var(--danger)',Medium:'var(--warning)',Low:'var(--text-light)'};
    var c = pc[v] || 'var(--text-muted)';
    return '<span class="stage-badge" style="color:'+c+'"><span class="dot" style="background:'+c+'"></span>'+v+'</span>';
  }

  /* Health */
  if (f.key === 'health') {
    var hc = v==='Healthy'?'var(--success)':v==='Attention'?'var(--warning)':'var(--danger)';
    return '<span class="stage-badge" style="color:'+hc+'"><span class="dot" style="background:'+hc+'"></span>'+v+'</span>';
  }

  /* Probability */
  if (f.key === 'prob') return v + '%';
  if (f.key === 'discount' || f.key === 'margin') return v + '%';
  if (f.key === 'duration') return v + ' min';

  return String(v);
}

/* Label formatter for auto-detected fields */
function _detailsLabel(k) {
  return k.replace(/([A-Z])/g, ' $1').replace(/^./, function(c){ return c.toUpperCase(); }).replace(/Id$/, '').replace(/  +/g, ' ').trim();
}

/* Bind clickable links in Details section */
function bindDetailsLinks(container) {
  container.querySelectorAll('.crm-details-link[data-nav-id]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      navigate('record', el.getAttribute('data-nav-obj'), el.getAttribute('data-nav-id'));
    });
  });
}

/* ── Inject Details styles (once) ── */
function injectDetailsStyles() {
  if (document.getElementById('crm-details-css')) return;
  var s = document.createElement('style'); s.id = 'crm-details-css';
  s.textContent = '\
.crm-details-section{background:var(--card);border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,.04);border:1px solid var(--border);overflow:hidden}\
.crm-details-head{padding:11px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:7px}\
.crm-details-title{font-size:11.5px;font-weight:700;color:var(--text);text-transform:uppercase;letter-spacing:.5px;display:flex;align-items:center;gap:6px}\
.crm-details-edit-btn{margin-left:auto;display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:6px;border:1px solid var(--border);background:#fff;cursor:pointer;font-size:11px;font-weight:600;font-family:inherit;color:var(--accent);transition:all .12s}\
.crm-details-edit-btn:hover{background:var(--accent-light);border-color:var(--accent)}\
.crm-details-body{padding:4px 0}\
.crm-details-row{display:flex;align-items:flex-start;padding:9px 16px;border-bottom:1px solid #f3f4f6}\
.crm-details-row:last-child{border-bottom:none}\
.crm-details-label{width:140px;flex-shrink:0;font-size:11px;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.3px;padding-top:1px}\
.crm-details-value{flex:1;font-size:12.5px;font-weight:500;color:var(--text);line-height:1.4;word-break:break-word}\
.crm-details-link{color:var(--accent);cursor:pointer;font-weight:600;transition:opacity .12s}\
.crm-details-link:hover{opacity:.7;text-decoration:underline}\
\
@media(max-width:640px){\
  .crm-details-row{flex-direction:column;gap:2px}\
  .crm-details-label{width:auto}\
}\
';
  document.head.appendChild(s);
}

/* ── Inject modal styles (once) ── */
function injectEditModalStyles() {
  /* Record edit/delete modal CSS (crm-modal-backdrop) */
  if (document.getElementById('crm-edit-modal-css')) return;
  var s = document.createElement('style'); s.id = 'crm-edit-modal-css';
  s.textContent = '\
.crm-modal-backdrop{position:fixed;inset:0;z-index:10000;background:rgba(15,23,42,.45);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s ease}\
.crm-modal-backdrop.crm-modal-show{opacity:1}\
.crm-modal{background:#fff;border-radius:14px;box-shadow:0 24px 64px rgba(0,0,0,.18);width:min(520px,92vw);max-height:85vh;display:flex;flex-direction:column;transform:translateY(12px) scale(.97);transition:transform .25s ease}\
.crm-modal-backdrop.crm-modal-show .crm-modal{transform:translateY(0) scale(1)}\
.crm-modal-header{display:flex;align-items:center;justify-content:space-between;padding:18px 22px 14px;border-bottom:1px solid #e8eaed}\
.crm-modal-title{font-size:15px;font-weight:700;color:#0f172a;letter-spacing:-.2px}\
.crm-modal-close{width:30px;height:30px;border-radius:8px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#94a3b8;transition:all .12s}\
.crm-modal-close:hover{background:#f0f2f5;color:#1e293b}\
.crm-modal-body{padding:18px 22px;overflow-y:auto;flex:1}\
.crm-modal-footer{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:14px 22px;border-top:1px solid #e8eaed}\
.crm-modal-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;border:none;font-family:inherit;transition:all .12s}\
.crm-modal-btn-cancel{background:#f0f2f5;color:#475569}\
.crm-modal-btn-cancel:hover{background:#e2e5e9}\
.crm-modal-btn-save{background:#2563eb;color:#fff}\
.crm-modal-btn-save:hover{background:#1d4ed8}\
.crm-modal-btn-delete{background:#ef4444;color:#fff}\
.crm-modal-btn-delete:hover{background:#dc2626}\
.crm-modal-btn[disabled]{opacity:.5;pointer-events:none}\
\
.crm-field-group{margin-bottom:14px}\
.crm-field-label{display:block;font-size:10.5px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px}\
.crm-field-input{width:100%;padding:9px 12px;border:1.5px solid #e2e5e9;border-radius:8px;font-size:13px;font-family:inherit;color:#1e293b;background:#fff;transition:border-color .15s,box-shadow .15s;box-sizing:border-box}\
.crm-field-input:focus{outline:none;border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}\
select.crm-field-input{appearance:auto;cursor:pointer}\
\
.crm-delete-icon{width:52px;height:52px;border-radius:50%;background:#fef2f2;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}\
.crm-delete-title{font-size:16px;font-weight:700;color:#0f172a;text-align:center;margin-bottom:6px}\
.crm-delete-msg{font-size:13px;color:#64748b;text-align:center;line-height:1.5;margin-bottom:4px}\
.crm-delete-name{font-weight:700;color:#1e293b}\
\
@media(max-width:640px){\
  .crm-modal{width:96vw;max-height:90vh;border-radius:12px}\
  .crm-modal-header{padding:14px 16px 12px}\
  .crm-modal-body{padding:14px 16px}\
  .crm-modal-footer{padding:12px 16px}\
}\
';
  document.head.appendChild(s);
}


/* ── Open Edit Modal ──
   Usage: openEditModal('accounts', 'a1')
   Finds the record in window.DATA, builds form,
   saves via fbUpdate + updates DATA + re-renders page
   ─────────────────────────────────────────────────── */
function openEditModal(objKey, recId) {
  injectEditModalStyles();
  var records = objKey === 'users' ? (typeof UM_USERS !== 'undefined' ? UM_USERS : []) : (window.DATA[objKey] || []);
  var rec = records.find(function(r) { return r.id === recId; });
  if (!rec) { console.error('[Edit] Record not found:', objKey, recId); return; }

  var fields = EDIT_FIELDS[objKey];
  if (!fields) {
    /* Fallback: auto-detect fields from record */
    fields = Object.keys(rec).filter(function(k) {
      return k !== 'id' && k !== 'photoURL' && k !== 'photo' && k !== 'keyRelationship';
    }).map(function(k) {
      return {key: k, label: k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g,' $1'), type: 'text'};
    });
  }

  var recName = rec.name || rec.title || rec.subject || rec.id;
  var objLabel = objKey.charAt(0).toUpperCase() + objKey.slice(1);

  /* Build form fields */
  var formHtml = '';
  fields.forEach(function(f) {
    var val = rec[f.key];
    if (val === undefined || val === null) val = '';
    formHtml += '<div class="crm-field-group">';
    formHtml += '<label class="crm-field-label">' + f.label + '</label>';
    if (f.type === 'select' && f.options) {
      formHtml += '<select class="crm-field-input" data-field="' + f.key + '">';
      formHtml += '<option value="">— Select —</option>';
      f.options.forEach(function(opt) {
        formHtml += '<option value="' + opt + '"' + (String(val) === opt ? ' selected' : '') + '>' + opt + '</option>';
      });
      formHtml += '</select>';
    } else if (f.type === 'textarea') {
      formHtml += '<textarea class="crm-field-input" data-field="' + f.key + '" rows="3" style="resize:vertical;min-height:60px;line-height:1.5">' + String(val).replace(/</g, '&lt;') + '</textarea>';
    } else if (f.type === 'date') {
      formHtml += '<input class="crm-field-input" type="date" data-field="' + f.key + '" value="' + (val || '') + '" />';
    } else if (f.type === 'number') {
      formHtml += '<input class="crm-field-input" type="number" data-field="' + f.key + '" value="' + (val || '') + '" step="any" />';
    } else {
      formHtml += '<input class="crm-field-input" type="text" data-field="' + f.key + '" value="' + String(val).replace(/"/g, '&quot;') + '" />';
    }
    formHtml += '</div>';
  });

  /* Build modal */
  var backdrop = document.createElement('div');
  backdrop.className = 'crm-modal-backdrop';
  backdrop.innerHTML = '\
<div class="crm-modal">\
  <div class="crm-modal-header">\
    <div class="crm-modal-title">' + svgIcon('edit', 15, 'var(--accent)') + ' Edit ' + objLabel.replace(/s$/, '') + '</div>\
    <button class="crm-modal-close" id="crm-edit-close">' + svgIcon('x', 16) + '</button>\
  </div>\
  <div class="crm-modal-body">' + formHtml + '</div>\
  <div class="crm-modal-footer">\
    <button class="crm-modal-btn crm-modal-btn-cancel" id="crm-edit-cancel">Cancel</button>\
    <button class="crm-modal-btn crm-modal-btn-save" id="crm-edit-save">' + svgIcon('save', 14, '#fff') + ' Save Changes</button>\
  </div>\
</div>';
  document.body.appendChild(backdrop);
  requestAnimationFrame(function() { backdrop.classList.add('crm-modal-show'); });

  /* Close */
  function closeEdit() {
    backdrop.classList.remove('crm-modal-show');
    setTimeout(function() { backdrop.remove(); }, 220);
  }

  backdrop.querySelector('#crm-edit-close').addEventListener('click', closeEdit);
  backdrop.querySelector('#crm-edit-cancel').addEventListener('click', closeEdit);
  backdrop.addEventListener('click', function(e) { if (e.target === backdrop) closeEdit(); });

  /* Save */
  backdrop.querySelector('#crm-edit-save').addEventListener('click', function() {
    var saveBtn = backdrop.querySelector('#crm-edit-save');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<div style="width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite"></div> Saving...';

    var updates = {};
    backdrop.querySelectorAll('[data-field]').forEach(function(input) {
      var fieldKey = input.getAttribute('data-field');
      var fieldDef = fields.find(function(f) { return f.key === fieldKey; });
      var newVal = input.value;
      if (fieldDef && fieldDef.type === 'number' && newVal !== '') {
        newVal = parseFloat(newVal);
        if (isNaN(newVal)) newVal = 0;
      }
      updates[fieldKey] = newVal;
    });

    /* Update in-memory */
    Object.keys(updates).forEach(function(k) { rec[k] = updates[k]; });

    /* Update Firestore */
    var savePromise;
    if (objKey === 'users' && typeof umUpdateUser === 'function') {
      savePromise = umUpdateUser(recId, updates);
    } else if (typeof fbUpdate === 'function') {
      savePromise = fbUpdate(objKey, recId, updates);
    } else {
      savePromise = Promise.resolve();
    }

    savePromise.then(function() {
        if (typeof fbShowStatus === 'function') fbShowStatus('Record updated');
        closeEdit();
        renderCurrentPage();
      }).catch(function(err) {
        console.error('[Edit] Save error:', err);
        if (typeof fbShowStatus === 'function') fbShowStatus('Save failed — local changes kept', true);
        closeEdit();
        renderCurrentPage();
      });
  });
}


/* ── Open Delete Modal ──
   Usage: openDeleteModal('accounts', 'a1')
   Confirms, then removes from Firestore + DATA + navigates to list
   ─────────────────────────────────────────────────── */
function openDeleteModal(objKey, recId) {
  injectEditModalStyles();
  var records = objKey === 'users' ? (typeof UM_USERS !== 'undefined' ? UM_USERS : []) : (window.DATA[objKey] || []);
  var rec = records.find(function(r) { return r.id === recId; });
  if (!rec) { console.error('[Delete] Record not found:', objKey, recId); return; }

  var recName = rec.name || rec.title || rec.subject || rec.id;
  var objLabel = objKey.charAt(0).toUpperCase() + objKey.slice(1).replace(/s$/, '');

  var backdrop = document.createElement('div');
  backdrop.className = 'crm-modal-backdrop';
  backdrop.innerHTML = '\
<div class="crm-modal" style="max-width:400px">\
  <div class="crm-modal-header">\
    <div class="crm-modal-title">Delete ' + objLabel + '</div>\
    <button class="crm-modal-close" id="crm-del-close">' + svgIcon('x', 16) + '</button>\
  </div>\
  <div class="crm-modal-body" style="text-align:center;padding:24px 22px">\
    <div class="crm-delete-icon">' + svgIcon('trash', 24, '#ef4444') + '</div>\
    <div class="crm-delete-title">Delete this ' + objLabel.toLowerCase() + '?</div>\
    <div class="crm-delete-msg">You are about to permanently delete<br/><span class="crm-delete-name">' + recName + '</span></div>\
    <div class="crm-delete-msg" style="font-size:11.5px;color:#94a3b8;margin-top:6px">This action cannot be undone.</div>\
  </div>\
  <div class="crm-modal-footer" style="justify-content:center;gap:10px">\
    <button class="crm-modal-btn crm-modal-btn-cancel" id="crm-del-cancel">Cancel</button>\
    <button class="crm-modal-btn crm-modal-btn-delete" id="crm-del-confirm">' + svgIcon('trash', 14, '#fff') + ' Delete</button>\
  </div>\
</div>';
  document.body.appendChild(backdrop);
  requestAnimationFrame(function() { backdrop.classList.add('crm-modal-show'); });

  function closeDel() {
    backdrop.classList.remove('crm-modal-show');
    setTimeout(function() { backdrop.remove(); }, 220);
  }

  backdrop.querySelector('#crm-del-close').addEventListener('click', closeDel);
  backdrop.querySelector('#crm-del-cancel').addEventListener('click', closeDel);
  backdrop.addEventListener('click', function(e) { if (e.target === backdrop) closeDel(); });

  backdrop.querySelector('#crm-del-confirm').addEventListener('click', function() {
    var delBtn = backdrop.querySelector('#crm-del-confirm');
    delBtn.disabled = true;
    delBtn.innerHTML = '<div style="width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite"></div> Deleting...';

    /* Remove from in-memory array */
    var idx = records.findIndex(function(r) { return r.id === recId; });
    if (idx !== -1) records.splice(idx, 1);

    /* Remove from Firestore */
    var delPromise;
    if (objKey === 'users') {
      delPromise = fbDB.collection('users').doc(recId).delete();
    } else if (typeof fbDelete === 'function') {
      delPromise = fbDelete(objKey, recId);
    } else {
      delPromise = Promise.resolve();
    }

    var navTarget = objKey === 'users' ? 'agentConsole' : objKey;
    if (objKey === 'users') AC_TAB = 'users';

    delPromise.then(function() {
      if (typeof fbShowStatus === 'function') fbShowStatus('Record deleted');
      closeDel();
      navigate(navTarget);
    }).catch(function(err) {
      console.error('[Delete] Error:', err);
      if (typeof fbShowStatus === 'function') fbShowStatus('Delete failed', true);
      closeDel();
      navigate(navTarget);
    });
  });
}


/* ── Helper: Generate Edit + Delete buttons HTML ──
   Returns HTML string for 2 buttons with consistent style
   prefix = CSS class prefix (e.g. 'a360', 'c360', 'o360')
   objKey = 'accounts', 'contacts', etc.
   recId  = record ID
   ─────────────────────────────────────────────────── */
function crmActionButtons(prefix, objKey, recId) {
  return '<button class="' + prefix + '-action-btn ' + prefix + '-action-outline crm-edit-btn" data-obj="' + objKey + '" data-rec="' + recId + '">' +
    svgIcon('edit', 13, 'var(--text-muted)') + '<span>Edit</span></button>' +
    '<button class="' + prefix + '-action-btn ' + prefix + '-action-outline crm-delete-btn" data-obj="' + objKey + '" data-rec="' + recId + '" style="color:#ef4444;border-color:#fecaca">' +
    svgIcon('trash', 13, '#ef4444') + '<span>Delete</span></button>';
}


/* ── Bind Edit/Delete buttons (call after container.innerHTML is set) ── */
function bindCrmActionButtons(container) {
  container.querySelectorAll('.crm-edit-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      openEditModal(btn.getAttribute('data-obj'), btn.getAttribute('data-rec'));
    });
  });
  container.querySelectorAll('.crm-delete-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      openDeleteModal(btn.getAttribute('data-obj'), btn.getAttribute('data-rec'));
    });
  });
}

function injectA360Styles() {
  if (document.getElementById('a360-css')) return;
  var s = document.createElement('style'); s.id = 'a360-css';
  s.textContent = '\
.a360{max-width:1140px;margin:0 auto;padding:14px 18px 48px}\
.a360-back{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;color:var(--text-muted);cursor:pointer;padding:4px 0;margin-bottom:10px;transition:color .12s}\
.a360-back:hover{color:var(--accent)}\
.a360-header-card{background:var(--card);border-radius:10px;box-shadow:0 1px 4px rgba(0,0,0,.06);border:1px solid var(--border);margin-bottom:14px;overflow:hidden}\
.a360-header-top{padding:22px 26px 18px;display:flex;gap:22px;align-items:center}\
.a360-avatar{width:92px;height:92px;border-radius:50%;background:#fff;border:1px solid #E6E8EC;box-shadow:0 2px 8px rgba(0,0,0,.06);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;transition:transform .18s ease,box-shadow .18s ease}\
.a360-avatar-initials{background:linear-gradient(135deg,#e0e7ff 0%,#dbeafe 100%);font-size:28px;font-weight:800;color:var(--accent);letter-spacing:-.5px}\
.a360-avatar-img img{width:100%;height:100%;object-fit:cover}\
.a360-photo-wrap{position:relative;cursor:pointer;flex-shrink:0}\
.a360-photo-wrap:hover .a360-avatar{transform:scale(1.05);box-shadow:0 6px 20px rgba(0,0,0,.12)}\
.a360-photo-overlay{position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s}\
.a360-photo-wrap:hover .a360-photo-overlay{opacity:1}\
.a360-avatar-loading{background:linear-gradient(135deg,#e0e7ff 0%,#dbeafe 100%)}\
.a360-spinner{width:22px;height:22px;border:2.5px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:a360spin .6s linear infinite}\
@keyframes a360spin{to{transform:rotate(360deg)}}\
.a360-subtitle{font-size:13px;color:var(--text-muted);font-weight:500;margin-top:2px}\
.a360-detail-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}\
.a360-chip{display:inline-flex;align-items:center;gap:5px;background:#f8f9fb;border:1px solid var(--border);padding:4px 10px;border-radius:6px;font-size:11px;color:var(--text-muted);font-weight:500}\
.a360-header-info{flex:1;min-width:0}\
.a360-name-row{display:flex;align-items:center;gap:10px;margin-bottom:5px}\
.a360-name{font-size:24px;font-weight:800;color:var(--text);letter-spacing:-.6px;margin:0;line-height:1}\
.a360-meta{display:flex;gap:14px;font-size:11.5px;color:var(--text-muted);flex-wrap:wrap}\
.a360-dot{color:var(--text-light)}\
.a360-header-metrics{display:flex;align-items:center;flex-shrink:0}\
.a360-hmetric{display:flex;flex-direction:column;align-items:center;padding:0 16px;border-left:1px solid var(--border)}\
.a360-hmetric-val{font-size:18px;font-weight:800;letter-spacing:-.5px;line-height:1;font-variant-numeric:tabular-nums}\
.a360-hmetric-label{font-size:9px;color:var(--text-light);font-weight:500;margin-top:2px;text-transform:uppercase;letter-spacing:.3px}\
.a360-header-actions{padding:12px 26px 14px;border-top:1px solid var(--border);display:flex;align-items:center}\
.a360-qa-row{display:flex;gap:7px}\
.a360-qa{display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;transition:all .12s}\
.a360-qa.a360-qa-primary{background:var(--accent);color:#fff;border:none}\
.a360-qa.a360-qa-primary:hover{background:var(--accent-hover)}\
.a360-qa.a360-qa-outline{background:transparent;border:1px solid var(--border);color:var(--text-muted)}\
.a360-qa.a360-qa-outline:hover{border-color:#bbb;color:var(--text);background:#f8f9fb}\
.a360-kpi-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:14px}\
.a360-kpi-card{background:var(--card);border-radius:10px;padding:16px 18px;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,.04);cursor:pointer;transition:all .15s;text-align:center}\
.a360-kpi-card:hover{box-shadow:0 4px 14px rgba(0,0,0,.08);transform:translateY(-2px)}\
.a360-kpi-card:hover .a360-kpi-view{opacity:1}\
.a360-kpi-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px}\
.a360-kpi-view{font-size:9px;font-weight:500;color:var(--text-light);opacity:0;transition:opacity .15s}\
.a360-kpi-value{font-size:28px;font-weight:800;letter-spacing:-1px;line-height:1;margin-bottom:3px;font-variant-numeric:tabular-nums}\
.a360-kpi-label{font-size:10.5px;color:var(--text-muted);font-weight:500;text-transform:uppercase;letter-spacing:.4px}\
.a360-kpi-insight{display:flex;align-items:center;justify-content:center;gap:5px;padding-top:9px;margin-top:9px;border-top:1px solid var(--border);font-size:9.5px;font-weight:600}\
.a360-kpi-insight-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}\
.a360-grid2{display:grid;grid-template-columns:1.12fr 1fr;gap:14px;align-items:start}\
.a360-col{display:flex;flex-direction:column;gap:12px}\
.a360-section{background:var(--card);border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,.04);border:1px solid var(--border);overflow:hidden}\
.a360-section-head{padding:11px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:7px}\
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
.a360-tl-item{display:flex;gap:10px;position:relative;padding-bottom:16px}\
.a360-tl-item:last-child{padding-bottom:0}\
.a360-tl-line{position:absolute;left:13px;top:28px;bottom:0;width:1.5px;background:var(--border);border-radius:1px}\
.a360-tl-item:last-child .a360-tl-line{display:none}\
.a360-tl-icon{width:26px;height:26px;border-radius:8px;border:1.5px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0;z-index:1;background:var(--card)}\
.a360-tl-body{flex:1;min-width:0;padding-top:2px}\
.a360-tl-top{display:flex;justify-content:space-between;align-items:baseline}\
.a360-tl-subject{font-size:12px;font-weight:600;color:var(--text);line-height:1.2}\
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
@media(max-width:640px){.a360{padding:10px 10px 32px}.a360-header-top{padding:16px 14px 12px;gap:12px}.a360-avatar{width:64px;height:64px;font-size:20px}\
.a360-name{font-size:18px}.a360-kpi-grid{grid-template-columns:1fr 1fr}.a360-kpi-value{font-size:22px}\
.a360-header-actions{padding:10px 14px}.a360-qa{padding:6px 10px;font-size:11px}\
.rec-fields{grid-template-columns:1fr}.rec-field:nth-child(odd){border-right:none}}\
';
  document.head.appendChild(s);
}


/* ════════════════════════════════════════════════════════
   CSS INJECTION — CONTACT 360
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
.c360-photo{width:92px;height:92px;border-radius:50%;flex-shrink:0;overflow:hidden;border:1px solid #E6E8EC;box-shadow:0 2px 8px rgba(0,0,0,.06);background:#fff;transition:transform .18s ease,box-shadow .18s ease}\
.c360-photo img{width:100%;height:100%;object-fit:cover}\
.c360-photo.c360-photo-initials{display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#e0e7ff 0%,#dbeafe 100%);font-size:28px;font-weight:800;color:var(--accent);letter-spacing:-.5px}\
\
.c360-photo-wrap{position:relative;cursor:pointer;flex-shrink:0}\
.c360-photo-wrap:hover .c360-photo{transform:scale(1.05);box-shadow:0 6px 20px rgba(0,0,0,.12)}\
.c360-photo-overlay{position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s}\
.c360-photo-wrap:hover .c360-photo-overlay{opacity:1}\
.c360-photo-loading{display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#e0e7ff 0%,#dbeafe 100%)}\
.c360-spinner{width:22px;height:22px;border:2.5px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:c360spin .6s linear infinite}\
@keyframes c360spin{to{transform:rotate(360deg)}}\
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
@media(max-width:640px){\
  .c360{padding:10px 10px 32px}\
  .c360-header-top{padding:16px 14px 12px;gap:12px}\
  .c360-photo{width:64px;height:64px;font-size:20px}\
  .c360-name{font-size:18px}\
  .c360-kpi-value{font-size:22px}\
  .c360-header-actions{padding:10px 14px}\
  .c360-action-btn{padding:6px 10px;font-size:11px}\
}\
';
  document.head.appendChild(s);
}


/* ════════════════════════════════════════════════════════
   CSS INJECTION — LEAD 360
   ════════════════════════════════════════════════════════ */

function injectL360Styles() {
  if (document.getElementById('l360-css')) return;
  var s = document.createElement('style'); s.id = 'l360-css';
  s.textContent = '\
.l360{max-width:1140px;margin:0 auto;padding:14px 18px 48px}\
.l360-back{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;color:var(--text-muted);cursor:pointer;padding:4px 0;margin-bottom:10px;transition:color .12s}\
.l360-back:hover{color:var(--accent)}\
\
/* Header Card */\
.l360-header-card{background:var(--card);border-radius:10px;box-shadow:0 1px 4px rgba(0,0,0,.06);border:1px solid var(--border);margin-bottom:14px;overflow:hidden}\
.l360-header-top{padding:22px 26px 18px;display:flex;gap:20px;align-items:flex-start}\
.l360-avatar{width:64px;height:64px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#fef3c7 0%,#fde68a 50%,#fbbf24 100%);border:2.5px solid var(--border);box-shadow:0 2px 8px rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:#92400e;letter-spacing:-.5px}\
.l360-photo{width:92px;height:92px;border-radius:50%;flex-shrink:0;overflow:hidden;border:1px solid #E6E8EC;box-shadow:0 2px 8px rgba(0,0,0,.06);background:#fff;transition:transform .18s ease,box-shadow .18s ease}\
.l360-photo img{width:100%;height:100%;object-fit:cover}\
.l360-photo.l360-photo-initials{display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#fef3c7 0%,#fde68a 50%,#fbbf24 100%);font-size:28px;font-weight:800;color:#92400e;letter-spacing:-.5px}\
.l360-photo-wrap{position:relative;cursor:pointer;flex-shrink:0}\
.l360-photo-wrap:hover .l360-photo{transform:scale(1.05);box-shadow:0 6px 20px rgba(0,0,0,.12)}\
.l360-photo-overlay{position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s}\
.l360-photo-wrap:hover .l360-photo-overlay{opacity:1}\
.l360-photo-loading{display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#e0e7ff 0%,#dbeafe 100%)}\
.l360-spinner{width:22px;height:22px;border:2.5px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:l360spin .6s linear infinite}\
@keyframes l360spin{to{transform:rotate(360deg)}}\
.l360-header-info{flex:1;min-width:0}\
.l360-name-row{display:flex;align-items:center;gap:10px;margin-bottom:4px;flex-wrap:wrap}\
.l360-name{font-size:22px;font-weight:800;color:var(--text);letter-spacing:-.5px;margin:0;line-height:1.1}\
.l360-role{font-size:12.5px;color:var(--text-muted);font-weight:500;margin-bottom:4px}\
.l360-company{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:var(--accent);cursor:pointer;margin-bottom:8px;transition:opacity .12s}\
.l360-company:hover{opacity:.75}\
\
/* Temperature Badge */\
.l360-temp-badge{font-size:11px;font-weight:700;padding:3px 10px;border-radius:8px;display:inline-flex;align-items:center;gap:4px;white-space:nowrap}\
.l360-temp-hot{background:#fef2f2;color:#dc2626;border:1px solid #fecaca}\
.l360-temp-warm{background:#fffbeb;color:#d97706;border:1px solid #fde68a}\
.l360-temp-cold{background:#f0f9ff;color:#64748b;border:1px solid #e0e7ff}\
\
/* Contact chips */\
.l360-details-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}\
.l360-detail-chip{display:inline-flex;align-items:center;gap:5px;background:#f8f9fb;border:1px solid var(--border);padding:4px 10px;border-radius:6px;font-size:11px;color:var(--text-muted);font-weight:500}\
\
/* Meta row */\
.l360-meta-row{display:flex;flex-wrap:wrap;gap:8px}\
.l360-meta-tag{font-size:10px;color:var(--text-light);font-weight:500}\
.l360-meta-tag strong{color:var(--text-muted);font-weight:600}\
\
/* Header metrics */\
.l360-header-metrics{display:flex;flex-direction:column;gap:12px;flex-shrink:0;align-items:center;padding-left:20px;border-left:1px solid var(--border)}\
.l360-hmetric{display:flex;flex-direction:column;align-items:center}\
.l360-hmetric-val{font-size:22px;font-weight:800;letter-spacing:-.5px;line-height:1;font-variant-numeric:tabular-nums}\
.l360-hmetric-label{font-size:9px;color:var(--text-light);font-weight:500;margin-top:2px;text-transform:uppercase;letter-spacing:.3px}\
\
/* Actions */\
.l360-actions{display:flex;gap:7px;padding:12px 26px 14px;border-top:1px solid var(--border);flex-wrap:wrap}\
.l360-action-btn{display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:7px;border:none;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;transition:all .12s}\
.l360-action-primary{background:var(--accent);color:#fff}\
.l360-action-primary:hover{background:var(--accent-hover)}\
.l360-action-outline{background:transparent;border:1px solid var(--border);color:var(--text-muted)}\
.l360-action-outline:hover{border-color:#bbb;color:var(--text);background:#f8f9fb}\
.l360-action-convert{background:var(--success);color:#fff}\
.l360-action-convert:hover{background:#059669}\
\
/* KPI Row */\
.l360-kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}\
.l360-kpi{background:var(--card);border-radius:10px;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,.04);padding:16px 18px;text-align:center;transition:all .15s}\
.l360-kpi:hover{box-shadow:0 4px 14px rgba(0,0,0,.08);transform:translateY(-2px)}\
.l360-kpi-value{font-size:28px;font-weight:800;letter-spacing:-1px;line-height:1;margin-bottom:3px;font-variant-numeric:tabular-nums}\
.l360-kpi-label{font-size:10.5px;color:var(--text-muted);font-weight:500;text-transform:uppercase;letter-spacing:.4px}\
.l360-kpi-insight{font-size:9.5px;font-weight:600;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)}\
\
/* Qualification Funnel */\
.l360-funnel-card{background:var(--card);border-radius:10px;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,.04);padding:18px 24px;margin-bottom:14px}\
.l360-funnel-title{font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:16px}\
.l360-funnel{display:flex;align-items:center;gap:0;width:100%;padding-bottom:38px}\
.l360-funnel-step{display:flex;align-items:center;flex:1;position:relative}\
.l360-funnel-step:last-child{flex:0 0 auto}\
.l360-funnel-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;z-index:1;transition:all .2s}\
.l360-funnel-current .l360-funnel-dot{box-shadow:0 0 0 4px rgba(37,99,235,.15)}\
.l360-funnel-pulse{width:10px;height:10px;border-radius:50%;background:#fff;animation:l360pulse 1.5s ease-in-out infinite}\
@keyframes l360pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.7)}}\
.l360-funnel-label{position:absolute;top:40px;left:50%;transform:translateX(-50%);font-size:9.5px;font-weight:600;color:var(--text-muted);white-space:nowrap;text-transform:uppercase;letter-spacing:.3px}\
.l360-funnel-current .l360-funnel-label{color:var(--accent);font-weight:700}\
.l360-funnel-done .l360-funnel-label{color:var(--success)}\
.l360-funnel-line{flex:1;height:3px;border-radius:2px;margin:0 6px;transition:background .2s}\
\
/* 2-Column Grid */\
.l360-grid2{display:grid;grid-template-columns:1.12fr 1fr;gap:14px;align-items:start;margin-top:28px}\
.l360-col{display:flex;flex-direction:column;gap:12px}\
\
/* Sections */\
.l360-section{background:var(--card);border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,.04);border:1px solid var(--border);overflow:hidden}\
.l360-section-head{padding:11px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:7px}\
.l360-section-title{font-size:11.5px;font-weight:700;color:var(--text);text-transform:uppercase;letter-spacing:.5px}\
.l360-section-link{margin-left:auto;font-size:10px;font-weight:500;color:var(--text-light);cursor:pointer;transition:color .12s}\
.l360-section-link:hover{color:var(--accent)}\
\
/* Rows */\
.l360-row{padding:10px 16px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .08s;display:flex;align-items:center;gap:10px}\
.l360-row:hover{background:#fafbfc}\
.l360-row-last{border-bottom:none}\
.l360-row-left{flex:1;min-width:0}\
.l360-row-right{display:flex;align-items:center;gap:8px;flex-shrink:0}\
.l360-row-title{font-size:12.5px;font-weight:700;color:var(--text);line-height:1.2}\
.l360-row-sub{font-size:10px;color:var(--text-light);margin-top:2px}\
.l360-row-amount{font-size:15px;font-weight:800;color:var(--text);font-variant-numeric:tabular-nums;letter-spacing:-.3px;margin-right:4px}\
.l360-empty{padding:20px 16px;text-align:center;color:var(--text-light);font-size:11px}\
\
/* Insight Rows */\
.l360-insights{padding:4px 0}\
.l360-insight-row{display:flex;justify-content:space-between;align-items:center;padding:9px 16px;border-bottom:1px solid var(--border)}\
.l360-insight-row:last-child{border-bottom:none}\
.l360-insight-label{font-size:11px;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.3px}\
.l360-insight-value{font-size:12.5px;font-weight:600;color:var(--text)}\
\
/* Company Card */\
.l360-company-card{padding:16px}\
.l360-co-top{display:flex;gap:12px;align-items:center;margin-bottom:14px}\
.l360-co-avatar{width:40px;height:40px;border-radius:8px;background:#f0f0f2;border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:var(--text-muted);flex-shrink:0}\
.l360-co-info{flex:1;min-width:0}\
.l360-co-name{font-size:14px;font-weight:700;color:var(--accent);cursor:pointer;transition:opacity .12s}\
.l360-co-name:hover{opacity:.75}\
.l360-co-industry{font-size:11px;color:var(--text-light);margin-top:1px}\
.l360-co-fields{display:flex;flex-direction:column;gap:8px}\
.l360-co-field{display:flex;justify-content:space-between;align-items:center}\
.l360-co-field-label{font-size:10px;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.4px}\
.l360-co-field-value{font-size:12px;font-weight:600;color:var(--text)}\
\
/* Next Action */\
.l360-next-action{background:var(--card);border-radius:10px;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,.04);padding:16px 18px;display:flex;gap:14px;align-items:center}\
.l360-na-icon{width:36px;height:36px;border-radius:10px;border:1.5px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0}\
.l360-na-body{flex:1;min-width:0}\
.l360-na-label{font-size:9px;font-weight:700;color:var(--text-light);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px}\
.l360-na-text{font-size:12.5px;font-weight:600;color:var(--text);line-height:1.4}\
\
/* Timeline */\
.l360-timeline{padding:12px 16px}\
.l360-tl-item{display:flex;gap:10px;position:relative;padding-bottom:16px}\
.l360-tl-item:last-child{padding-bottom:0}\
.l360-tl-line{position:absolute;left:13px;top:28px;bottom:0;width:1.5px;background:var(--border);border-radius:1px}\
.l360-tl-item:last-child .l360-tl-line{display:none}\
.l360-tl-icon{width:26px;height:26px;border-radius:8px;border:1.5px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0;z-index:1;background:var(--card)}\
.l360-tl-body{flex:1;min-width:0;padding-top:2px}\
.l360-tl-top{display:flex;justify-content:space-between;align-items:baseline}\
.l360-tl-subject{font-size:12px;font-weight:600;color:var(--text);line-height:1.2}\
.l360-tl-type{font-size:10px;font-weight:600;flex-shrink:0;margin-left:8px}\
.l360-tl-meta{font-size:10px;color:var(--text-light);margin-top:2px}\
\
/* Notes */\
.l360-note{padding:12px 16px;border-bottom:1px solid var(--border)}\
.l360-note:last-child,.l360-note.l360-row-last{border-bottom:none}\
.l360-note-date{font-size:9px;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px}\
.l360-note-text{font-size:12px;color:var(--text);line-height:1.55}\
\
@media(max-width:1100px){\
  .l360-grid2{grid-template-columns:1fr}\
  .l360-kpi-row{grid-template-columns:repeat(2,1fr)}\
  .l360-header-top{flex-wrap:wrap}\
  .l360-header-metrics{border-left:none;padding-left:0;flex-direction:row;gap:20px;margin-top:10px}\
}\
@media(max-width:768px){\
  .l360-kpi-row{grid-template-columns:repeat(2,1fr)}\
  .l360-actions{flex-wrap:wrap}\
  .l360-funnel{flex-wrap:wrap;gap:8px}\
  .l360-funnel-line{display:none}\
  .l360-funnel-label{position:static;transform:none;margin-top:4px}\
  .l360-funnel-step{flex-direction:column;align-items:center;flex:0 0 auto}\
}\
@media(max-width:640px){\
  .l360{padding:10px 10px 32px}\
  .l360-header-top{padding:16px 14px 12px;gap:12px}\
  .l360-photo{width:64px;height:64px;font-size:20px}\
  .l360-name{font-size:17px}\
  .l360-kpi-value{font-size:22px}\
  .l360-actions{padding:10px 14px}\
  .l360-action-btn{padding:6px 10px;font-size:11px}\
}\
';
  document.head.appendChild(s);
}
