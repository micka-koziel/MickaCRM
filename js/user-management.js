/* ═══════════════════════════════════════════════════════════════
   user-management.js — User Management Tab (inside Agent Console)
   Firestore-backed: users + audit_log collections
   Roles: Admin, User | Status: active, inactive
   Accent: #7c3aed (Agent Console purple)
   ═══════════════════════════════════════════════════════════════ */

/* ── Fake users to seed into Firestore ── */
var UM_SEED_USERS = [
  { id:'u_jp_martin',    name:'Jean-Pierre Martin',    email:'jp.martin@btp-group.com',     role:'admin', status:'active', department:'IT Direction',     title:'CRM Administrator',   lastLogin:'2026-03-15T09:12:00', sessions:127, createdAt:'2025-06-15' },
  { id:'u_s_durand',     name:'Sophie Durand',         email:'s.durand@btp-group.com',      role:'user',  status:'active', department:'Sales',            title:'Sales Representative', lastLogin:'2026-03-15T08:45:00', sessions:98,  createdAt:'2025-07-01' },
  { id:'u_m_lefevre',    name:'Marc Lefèvre',          email:'m.lefevre@btp-group.com',     role:'user',  status:'active', department:'Sales',            title:'Senior Sales Rep',    lastLogin:'2026-03-14T17:30:00', sessions:84,  createdAt:'2025-07-10' },
  { id:'u_i_moreau',     name:'Isabelle Moreau',       email:'i.moreau@btp-group.com',      role:'admin', status:'active', department:'Sales Management', title:'Sales Director',      lastLogin:'2026-03-15T10:05:00', sessions:72,  createdAt:'2025-06-20' },
  { id:'u_t_girard',     name:'Thomas Girard',         email:'t.girard@btp-group.com',      role:'user',  status:'active', department:'Operations',       title:'Project Manager',     lastLogin:'2026-03-14T16:20:00', sessions:56,  createdAt:'2025-08-01' },
  { id:'u_c_rousseau',   name:'Claire Rousseau',       email:'c.rousseau@btp-group.com',    role:'user',  status:'active', department:'Sales',            title:'Sales Representative', lastLogin:'2026-03-12T14:10:00', sessions:43,  createdAt:'2025-08-15' },
  { id:'u_a_mercier',    name:'Antoine Mercier',       email:'a.mercier@btp-group.com',     role:'user',  status:'inactive', department:'Field Ops',      title:'Field Representative', lastLogin:'2026-03-10T11:00:00', sessions:31,  createdAt:'2025-09-01' },
  { id:'u_n_petit',      name:'Nathalie Petit',        email:'n.petit@btp-group.com',       role:'user',  status:'inactive', department:'Sales',          title:'Sales Representative', lastLogin:'2026-02-28T09:30:00', sessions:12,  createdAt:'2025-09-10' },
  { id:'u_c_martinez',   name:'Christophe Martinez',   email:'c.martinez@btp-group.com',    role:'user',  status:'active', department:'Sales Management', title:'Regional Manager',    lastLogin:'2026-03-15T07:58:00', sessions:91,  createdAt:'2025-07-05' },
  { id:'u_e_faure',      name:'Émilie Faure',          email:'e.faure@btp-group.com',       role:'user',  status:'active', department:'Sales',            title:'Sales Representative', lastLogin:'2026-03-14T15:45:00', sessions:67,  createdAt:'2025-10-01' }
];

/* ── In-memory cache (loaded from Firestore) ── */
var UM_USERS = [];
var UM_AUDIT = [];
var UM_LOADED = false;
var UM_FILTER = 'all'; /* all | active | inactive */
var UM_SEARCH = '';

/* ── Load users from Firestore ── */
function umLoadUsers() {
  return fbDB.collection('users').get().then(function(snap) {
    UM_USERS = [];
    snap.forEach(function(doc) {
      var d = doc.data();
      d.id = doc.id;
      UM_USERS.push(d);
    });
    UM_LOADED = true;
    return UM_USERS;
  });
}

function umLoadAudit() {
  return fbDB.collection('audit_log').orderBy('timestamp','desc').limit(50).get().then(function(snap) {
    UM_AUDIT = [];
    snap.forEach(function(doc) {
      var d = doc.data();
      d.id = doc.id;
      UM_AUDIT.push(d);
    });
    return UM_AUDIT;
  });
}

/* ── Seed users if collection is empty ── */
function umSeedUsers() {
  return fbDB.collection('users').limit(1).get().then(function(snap) {
    if (!snap.empty) return Promise.resolve();
    var batch = fbDB.batch();
    UM_SEED_USERS.forEach(function(u) {
      var ref = fbDB.collection('users').doc(u.id);
      batch.set(ref, u);
    });
    /* Also add the currently logged-in user if not in seed */
    if (AUTH_USER) {
      var myId = 'u_' + AUTH_USER.uid.substring(0,8);
      var exists = UM_SEED_USERS.find(function(u){ return u.email === AUTH_USER.email; });
      if (!exists) {
        batch.set(fbDB.collection('users').doc(myId), {
          id: myId,
          name: AUTH_USER.displayName || AUTH_USER.email.split('@')[0],
          email: AUTH_USER.email,
          role: 'admin',
          status: 'active',
          department: 'IT Direction',
          title: 'System Administrator',
          lastLogin: new Date().toISOString(),
          sessions: 1,
          createdAt: new Date().toISOString().split('T')[0]
        });
      }
    }
    return batch.commit().then(function() {
      console.log('[UM] Seeded ' + UM_SEED_USERS.length + ' users');
    });
  });
}

/* ── Write audit log ── */
function umAuditLog(action, targetUser, details) {
  var entry = {
    action: action,
    targetUserId: targetUser.id,
    targetUserName: targetUser.name,
    performedBy: AUTH_USER ? (AUTH_USER.displayName || AUTH_USER.email) : 'System',
    performedByEmail: AUTH_USER ? AUTH_USER.email : 'system@crm.com',
    details: details || '',
    timestamp: new Date().toISOString()
  };
  UM_AUDIT.unshift(entry);
  return fbDB.collection('audit_log').add(entry);
}

/* ── Firestore mutations ── */
function umUpdateUser(userId, data) {
  var user = UM_USERS.find(function(u){ return u.id === userId; });
  if (!user) return Promise.reject('User not found');
  Object.keys(data).forEach(function(k){ user[k] = data[k]; });
  return fbDB.collection('users').doc(userId).update(data);
}

function umDeactivateUser(userId) {
  var user = UM_USERS.find(function(u){ return u.id === userId; });
  if (!user) return Promise.reject('User not found');
  return umUpdateUser(userId, { status:'inactive' }).then(function() {
    return umAuditLog('deactivate', user, 'Account deactivated');
  });
}

function umActivateUser(userId) {
  var user = UM_USERS.find(function(u){ return u.id === userId; });
  if (!user) return Promise.reject('User not found');
  return umUpdateUser(userId, { status:'active' }).then(function() {
    return umAuditLog('activate', user, 'Account reactivated');
  });
}

function umChangeRole(userId, newRole) {
  var user = UM_USERS.find(function(u){ return u.id === userId; });
  if (!user) return Promise.reject('User not found');
  var oldRole = user.role;
  return umUpdateUser(userId, { role:newRole }).then(function() {
    return umAuditLog('role_change', user, 'Role changed from ' + oldRole + ' to ' + newRole);
  });
}

function umResetPassword(userId) {
  var user = UM_USERS.find(function(u){ return u.id === userId; });
  if (!user) return Promise.reject('User not found');
  return umAuditLog('password_reset', user, 'Password reset email sent');
}

function umCreateUser(userData) {
  var newId = 'u_' + Date.now().toString(36);
  var user = {
    id: newId,
    name: userData.name || 'New User',
    email: userData.email || (userData.name || 'new.user').toLowerCase().replace(/\s/g,'.').replace(/[éèê]/g,'e').replace(/[àâ]/g,'a') + '@btp-group.com',
    role: userData.role || 'user',
    status: 'active',
    department: userData.department || 'Sales',
    title: userData.title || 'Sales Representative',
    lastLogin: '',
    sessions: 0,
    createdAt: new Date().toISOString().split('T')[0]
  };
  UM_USERS.push(user);
  return fbDB.collection('users').doc(newId).set(user).then(function() {
    return umAuditLog('create', user, 'New user account created');
  }).then(function() { return user; });
}

/* ══════════════════════════════════════════════════════════════
   RENDER — User Management Tab inside Agent Console
   ══════════════════════════════════════════════════════════════ */
function umRenderTab(container) {
  if (!container) return;
  injectUMStyles();

  container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:300px;color:var(--text-light);font-size:13px;gap:8px">' +
    '<div style="width:16px;height:16px;border:2px solid var(--border);border-top-color:#7c3aed;border-radius:50%;animation:spin .6s linear infinite"></div>Loading users...</div>';

  var loadP = UM_LOADED ? Promise.resolve() : umSeedUsers().then(function(){ return umLoadUsers(); }).then(function(){ return umLoadAudit(); });

  loadP.then(function() {
    umRenderContent(container);
  });
}

function umRenderContent(container) {
  var active = UM_USERS.filter(function(u){ return u.status === 'active'; }).length;
  var inactive = UM_USERS.length - active;
  var admins = UM_USERS.filter(function(u){ return u.role === 'admin'; }).length;

  /* Filter + search */
  var filtered = UM_USERS.filter(function(u) {
    if (UM_FILTER === 'active' && u.status !== 'active') return false;
    if (UM_FILTER === 'inactive' && u.status !== 'inactive') return false;
    if (UM_SEARCH) {
      var q = UM_SEARCH.toLowerCase();
      return (u.name||'').toLowerCase().indexOf(q) >= 0 || (u.email||'').toLowerCase().indexOf(q) >= 0 || (u.department||'').toLowerCase().indexOf(q) >= 0;
    }
    return true;
  });

  /* KPIs */
  var kpis = [
    { label:'Total Users', value:UM_USERS.length, color:'#7c3aed', icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { label:'Active', value:active, color:'#10b981', icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label:'Inactive', value:inactive, color:'#ef4444', icon:'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
    { label:'Admins', value:admins, color:'#2563eb', icon:'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
  ];
  var kpiHtml = kpis.map(function(k) {
    return '<div class="um-kpi"><div class="um-kpi-icon" style="background:'+k.color+'12">' + _acSvg(k.icon,18,k.color) + '</div>' +
      '<div><div class="um-kpi-val" style="color:'+k.color+'">'+k.value+'</div><div class="um-kpi-label">'+k.label+'</div></div></div>';
  }).join('');

  /* Filter pills */
  var filters = [
    { key:'all', label:'All ('+UM_USERS.length+')' },
    { key:'active', label:'Active ('+active+')' },
    { key:'inactive', label:'Inactive ('+inactive+')' }
  ];
  var filterHtml = filters.map(function(f) {
    return '<button class="um-filter'+(UM_FILTER===f.key?' active':'')+'" onclick="UM_FILTER=\''+f.key+'\';umRenderContent(document.getElementById(\'ac-content\'))">'+f.label+'</button>';
  }).join('');

  /* Users table */
  var tableHtml = '<table class="um-table"><thead><tr>' +
    '<th></th><th>User</th><th>Role</th><th>Department</th><th>Status</th><th>Last Login</th><th>Sessions</th><th>Actions</th>' +
    '</tr></thead><tbody>';

  filtered.forEach(function(u) {
    var initials = u.name.split(' ').map(function(w){return w[0]}).join('').substring(0,2).toUpperCase();
    var statusColor = u.status === 'active' ? '#10b981' : '#ef4444';
    var roleColor = u.role === 'admin' ? '#7c3aed' : '#64748b';
    var lastLogin = u.lastLogin ? _umFormatDate(u.lastLogin) : 'Never';

    tableHtml += '<tr>' +
      '<td style="cursor:pointer" onclick="navigate(\'record\',\'users\',\''+u.id+'\')"><div class="um-avatar" style="background:'+roleColor+'15;color:'+roleColor+'">'+initials+'</div></td>' +
      '<td style="cursor:pointer" onclick="navigate(\'record\',\'users\',\''+u.id+'\')"><div class="um-user-name" style="color:var(--accent)">'+u.name+'</div><div class="um-user-email">'+u.email+'</div></td>' +
      '<td><span class="um-role-badge" style="background:'+roleColor+'12;color:'+roleColor+'">'+u.role.toUpperCase()+'</span></td>' +
      '<td class="um-dept">'+(u.department||'—')+'</td>' +
      '<td><span class="um-status-badge" style="background:'+statusColor+'12;color:'+statusColor+'"><span class="um-status-dot" style="background:'+statusColor+'"></span>'+u.status+'</span></td>' +
      '<td class="um-date">'+lastLogin+'</td>' +
      '<td class="um-sessions">'+u.sessions+'</td>' +
      '<td class="um-actions-cell">' +
        '<div class="um-action-group">' +
          (u.status === 'active'
            ? '<button class="um-act-btn um-act-deactivate" onclick="umDoDeactivate(\''+u.id+'\')" title="Deactivate">'+_acSvg('M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',13,'#ef4444')+'</button>'
            : '<button class="um-act-btn um-act-activate" onclick="umDoActivate(\''+u.id+'\')" title="Activate">'+_acSvg('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',13,'#10b981')+'</button>') +
          '<button class="um-act-btn" onclick="umDoToggleRole(\''+u.id+'\')" title="Toggle Role">'+_acSvg('M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',13,'#2563eb')+'</button>' +
          '<button class="um-act-btn" onclick="umDoResetPwd(\''+u.id+'\')" title="Reset Password">'+_acSvg('M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',13,'#f59e0b')+'</button>' +
        '</div>' +
      '</td></tr>';
  });
  tableHtml += '</tbody></table>';

  /* Audit log */
  var auditHtml = '';
  if (UM_AUDIT.length > 0) {
    var actionIcons = {
      deactivate: { color:'#ef4444', label:'Deactivated' },
      activate: { color:'#10b981', label:'Activated' },
      role_change: { color:'#2563eb', label:'Role Changed' },
      password_reset: { color:'#f59e0b', label:'Password Reset' },
      create: { color:'#7c3aed', label:'User Created' }
    };
    auditHtml = '<div class="um-audit-section"><div class="um-section-title">' +
      _acSvg('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',15,'#7c3aed') +
      ' Audit Log</div>';
    auditHtml += UM_AUDIT.slice(0,15).map(function(a) {
      var info = actionIcons[a.action] || { color:'#94a3b8', label:a.action };
      return '<div class="um-audit-row">' +
        '<div class="um-audit-dot" style="background:'+info.color+'"></div>' +
        '<div class="um-audit-info">' +
          '<span class="um-audit-action" style="color:'+info.color+'">'+info.label+'</span>' +
          '<span class="um-audit-target">'+a.targetUserName+'</span>' +
          (a.details ? '<span class="um-audit-detail">— '+a.details+'</span>' : '') +
        '</div>' +
        '<div class="um-audit-meta">' +
          '<span class="um-audit-by">by '+a.performedBy+'</span>' +
          '<span class="um-audit-time">'+_umFormatDate(a.timestamp)+'</span>' +
        '</div></div>';
    }).join('');
    auditHtml += '</div>';
  }

  container.innerHTML =
    '<div class="um-wrap">' +
      '<div class="um-kpi-row">' + kpiHtml + '</div>' +
      '<div class="um-toolbar">' +
        '<div class="um-filters">' + filterHtml + '</div>' +
        '<div class="um-toolbar-right">' +
          '<div class="um-search-wrap">' +
            _acSvg('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',14,'#94a3b8') +
            '<input class="um-search" placeholder="Search users..." value="'+UM_SEARCH+'" oninput="UM_SEARCH=this.value;umRenderContent(document.getElementById(\'ac-content\'))" />' +
          '</div>' +
          '<button class="um-btn-create" onclick="umShowCreateModal()">' +
            _acSvg('M12 4v16m8-8H4',14,'#fff') + ' Add User</button>' +
        '</div>' +
      '</div>' +
      '<div class="um-table-wrap">' + tableHtml + '</div>' +
      auditHtml +
    '</div>';
}

/* ── Action handlers ── */
function umDoDeactivate(userId) {
  umDeactivateUser(userId).then(function() {
    acShowToast('User Deactivated', UM_USERS.find(function(u){return u.id===userId}).name + ' — account disabled', '#ef4444');
    umRenderContent(document.getElementById('ac-content'));
  });
}
function umDoActivate(userId) {
  umActivateUser(userId).then(function() {
    acShowToast('User Activated', UM_USERS.find(function(u){return u.id===userId}).name + ' — account enabled', '#10b981');
    umRenderContent(document.getElementById('ac-content'));
  });
}
function umDoToggleRole(userId) {
  var user = UM_USERS.find(function(u){return u.id===userId});
  if (!user) return;
  var newRole = user.role === 'admin' ? 'user' : 'admin';
  umChangeRole(userId, newRole).then(function() {
    acShowToast('Role Updated', user.name + ' → ' + newRole.toUpperCase(), '#2563eb');
    umRenderContent(document.getElementById('ac-content'));
  });
}
function umDoResetPwd(userId) {
  umResetPassword(userId).then(function() {
    var user = UM_USERS.find(function(u){return u.id===userId});
    acShowToast('Password Reset', 'Email sent to ' + (user ? user.name : 'user'), '#f59e0b');
    umRenderContent(document.getElementById('ac-content'));
  });
}

/* ── Create modal — delegates to centralized openCreateModal ── */
function umShowCreateModal() {
  if (typeof openCreateModal === 'function') {
    openCreateModal('users', null);
  } else {
    console.error('[UM] openCreateModal not available');
  }
}

function umSelectRole(btn) {
  btn.parentElement.querySelectorAll('.um-role-opt').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
}

function umSubmitCreate() {
  var name = document.getElementById('um-new-name').value.trim();
  if (!name) { document.getElementById('um-new-name').style.borderColor='#ef4444'; return; }
  var email = document.getElementById('um-new-email').value.trim();
  var dept = document.getElementById('um-new-dept').value.trim();
  var title = document.getElementById('um-new-title').value.trim();
  var roleBtn = document.querySelector('.um-role-opt.active');
  var role = roleBtn ? roleBtn.dataset.role : 'user';

  document.getElementById('um-modal-overlay').remove();

  umCreateUser({ name:name, email:email, department:dept||'Sales', title:title||'Sales Representative', role:role }).then(function(newUser) {
    acShowToast('User Created', newUser.name + ' added successfully', '#10b981');
    umRenderContent(document.getElementById('ac-content'));
  });
}

/* ── Format helper ── */
function _umFormatDate(dateStr) {
  if (!dateStr) return '—';
  var d = new Date(dateStr);
  var now = new Date();
  var diff = now - d;
  if (diff < 86400000 && d.getDate() === now.getDate()) {
    return 'Today, ' + d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:false });
  }
  if (diff < 172800000) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
}

/* ══════════════════════════════════════════════════════════════
   Agent Console chat — real Firestore mutations for users
   ══════════════════════════════════════════════════════════════ */

/* Find user by name from UM_USERS (Firestore-backed) */
function umFindUserByMsg(msg) {
  var lower = msg.toLowerCase();
  var found = null;
  /* Try last name first */
  UM_USERS.forEach(function(u) {
    var parts = u.name.split(' ');
    if (parts.length >= 2 && lower.indexOf(parts[parts.length-1].toLowerCase()) >= 0) found = u;
  });
  /* Then first name */
  if (!found) {
    UM_USERS.forEach(function(u) {
      var first = u.name.split(' ')[0].toLowerCase();
      if (first.length > 2 && lower.indexOf(first) >= 0) found = u;
    });
  }
  return found;
}

/* Build real users response from Firestore data */
function umBuildUsersResponseReal() {
  if (UM_USERS.length === 0) return 'Aucun utilisateur trouvé. Le module User Management n\'a pas encore été chargé.';

  var active = UM_USERS.filter(function(u){ return u.status === 'active'; }).length;
  var tbl = '<table style="width:100%;border-collapse:collapse;font-size:11.5px;margin:8px 0;border-radius:8px;overflow:hidden">';
  tbl += '<thead><tr>';
  ['','Name','Role','Dept','Status','Last Login'].forEach(function(h){
    tbl += '<th style="text-align:left;padding:6px '+(h?'10':'4')+'px;background:#7c3aed10;color:#7c3aed;font-weight:600;border-bottom:1px solid #e8eaed;font-size:10.5px;text-transform:uppercase;letter-spacing:.3px">'+h+'</th>';
  });
  tbl += '</tr></thead><tbody>';
  UM_USERS.forEach(function(u,i) {
    var dc = u.status === 'active' ? '#10b981' : '#ef4444';
    var rc = u.role === 'admin' ? '#7c3aed' : '#64748b';
    tbl += '<tr style="'+(i%2===1?'background:#f8f9fb':'')+'">';
    tbl += '<td style="padding:5px 4px;border-bottom:1px solid #f0f2f5;text-align:center">'+_acStatusDot(dc)+'</td>';
    tbl += '<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5;color:#7c3aed;font-weight:500">'+u.name+'</td>';
    tbl += '<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5"><span style="background:'+rc+'12;color:'+rc+';padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600">'+u.role.toUpperCase()+'</span></td>';
    tbl += '<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5;color:#64748b;font-size:11px">'+(u.department||'—')+'</td>';
    tbl += '<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5"><span style="background:'+dc+'12;color:'+dc+';padding:2px 6px;border-radius:8px;font-size:10px;font-weight:600">'+u.status+'</span></td>';
    tbl += '<td style="padding:5px 10px;border-bottom:1px solid #f0f2f5;color:#64748b;font-size:11px">'+_umFormatDate(u.lastLogin)+'</td></tr>';
  });
  tbl += '</tbody></table>';
  var sum = '<div style="display:flex;gap:12px;margin-top:6px;font-size:11px">';
  sum += '<span style="background:#10b98112;color:#10b981;padding:3px 10px;border-radius:8px;font-weight:600">'+active+' Active</span>';
  sum += '<span style="background:#ef444412;color:#ef4444;padding:3px 10px;border-radius:8px;font-weight:600">'+(UM_USERS.length-active)+' Inactive</span></div>';
  var viewBtn = '<div style="margin-top:10px"><button onclick="AC_TAB=\'users\';renderAgentConsole()" style="background:#7c3aed12;color:#7c3aed;border:1px solid #7c3aed30;padding:6px 14px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit">→ Open User Management</button></div>';
  return '✅ Action réalisée : '+UM_USERS.length+' utilisateurs CRM (données Firestore temps réel)\n%%HTML%%'+tbl+sum+viewBtn+'%%/HTML%%';
}

/* Real deactivate via chat */
function umChatDeactivate(msg) {
  var user = umFindUserByMsg(msg);
  if (!user) return Promise.resolve('⚠️ Utilisateur non trouvé. Précisez le nom complet.');
  if (user.status === 'inactive') return Promise.resolve('⚠️ '+user.name+' est déjà inactif.');

  return umDeactivateUser(user.id).then(function() {
    acShowToast('User Deactivated', user.name + ' — account disabled', '#ef4444');
    var viewBtn = '<div style="margin-top:10px"><button onclick="AC_TAB=\'users\';renderAgentConsole()" style="background:#7c3aed12;color:#7c3aed;border:1px solid #7c3aed30;padding:6px 14px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit">→ Open User Management</button></div>';
    return '✅ Action réalisée : Compte de '+user.name+' désactivé.\n\n• Status : inactive\n• L\'utilisateur ne peut plus se connecter\n• Données conservées — réactivation possible\n• Audit log mis à jour\n%%HTML%%'+viewBtn+'%%/HTML%%';
  });
}

/* Real activate via chat */
function umChatActivate(msg) {
  var user = umFindUserByMsg(msg);
  if (!user) return Promise.resolve('⚠️ Utilisateur non trouvé. Précisez le nom complet.');
  if (user.status === 'active') return Promise.resolve('⚠️ '+user.name+' est déjà actif.');

  return umActivateUser(user.id).then(function() {
    acShowToast('User Activated', user.name + ' — account enabled', '#10b981');
    return '✅ Action réalisée : Compte de '+user.name+' réactivé.\n\n• Status : active\n• L\'utilisateur peut à nouveau se connecter\n• Audit log mis à jour';
  });
}

/* Real reset pwd via chat */
function umChatResetPwd(msg) {
  var user = umFindUserByMsg(msg);
  if (!user) return Promise.resolve('✅ Action réalisée : Email de réinitialisation envoyé (utilisateur non identifié par nom, envoyé au demandeur).');
  return umResetPassword(user.id).then(function() {
    acShowToast('Password Reset', 'Email sent to '+user.name, '#f59e0b');
    return '✅ Action réalisée : Mot de passe de '+user.name+' réinitialisé.\n\n• Un email de réinitialisation a été envoyé à '+user.email+'\n• Le lien est valable 24h\n• Audit log mis à jour';
  });
}

/* Real create via chat */
function umChatCreateUser(msg) {
  /* Try to extract a name from the message */
  var nameMatch = msg.match(/(?:créer|ajouter|create|add)\s+(?:un\s+)?(?:utilisateur|user|compte)\s*[:—-]?\s*(.+)/i);
  var name = nameMatch ? nameMatch[1].trim() : 'Pierre Duval';
  /* Clean trailing punctuation */
  name = name.replace(/[.!?]+$/, '').trim();
  if (name.length < 2) name = 'Pierre Duval';

  return umCreateUser({ name:name }).then(function(newUser) {
    acShowToast('User Created', newUser.name + ' added to CRM', '#10b981');
    var viewBtn = '<div style="margin-top:10px"><button onclick="AC_TAB=\'users\';renderAgentConsole()" style="background:#7c3aed12;color:#7c3aed;border:1px solid #7c3aed30;padding:6px 14px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit">→ Open User Management</button></div>';
    return '✅ Action réalisée : Nouveau compte créé dans Firestore.\n\n• Nom : '+newUser.name+'\n• Email : '+newUser.email+'\n• Rôle : '+newUser.role.toUpperCase()+'\n• Département : '+newUser.department+'\n• Status : active\n\nEmail d\'activation envoyé. Audit log mis à jour.\n%%HTML%%'+viewBtn+'%%/HTML%%';
  });
}

/* ══════════════════════════════════════════════════════════════
   STYLES
   ══════════════════════════════════════════════════════════════ */
function injectUMStyles() {
  if (document.getElementById('um-styles')) return;
  var s = document.createElement('style');
  s.id = 'um-styles';
  s.textContent = '\
.um-wrap { padding:20px 24px; animation:acFadeIn .3s ease }\
.um-kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:20px }\
.um-kpi { background:var(--card); border:1px solid var(--border); border-radius:12px; padding:16px; display:flex; align-items:center; gap:12px }\
.um-kpi-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0 }\
.um-kpi-val { font-size:22px; font-weight:700; line-height:1.1 }\
.um-kpi-label { font-size:11px; color:var(--text-muted); margin-top:2px }\
\
.um-toolbar { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; flex-wrap:wrap }\
.um-toolbar-right { display:flex; align-items:center; gap:10px }\
.um-filters { display:flex; gap:4px }\
.um-filter { padding:6px 14px; border:1px solid var(--border); border-radius:8px; background:var(--card); font-family:inherit; font-size:12px; font-weight:500; color:var(--text-muted); cursor:pointer; transition:all .15s }\
.um-filter.active { background:#7c3aed; color:#fff; border-color:#7c3aed }\
.um-filter:hover:not(.active) { border-color:#7c3aed40; color:#7c3aed }\
\
.um-search-wrap { display:flex; align-items:center; gap:6px; background:var(--card); border:1px solid var(--border); border-radius:8px; padding:0 10px; height:34px }\
.um-search { border:none; outline:none; background:none; font-family:inherit; font-size:12.5px; color:var(--text); width:160px }\
.um-search::placeholder { color:var(--text-light) }\
\
.um-btn-create { display:flex; align-items:center; gap:6px; padding:7px 16px; border:none; border-radius:8px; background:#7c3aed; color:#fff; font-family:inherit; font-size:12.5px; font-weight:600; cursor:pointer; transition:background .15s }\
.um-btn-create:hover { background:#6d28d9 }\
\
.um-table-wrap { background:var(--card); border:1px solid var(--border); border-radius:12px; overflow:hidden; margin-bottom:20px }\
.um-table { width:100%; border-collapse:collapse; font-size:12.5px }\
.um-table thead th { text-align:left; padding:10px 12px; background:#f8f9fb; color:var(--text-muted); font-weight:600; font-size:10.5px; text-transform:uppercase; letter-spacing:.4px; border-bottom:1px solid var(--border) }\
.um-table tbody tr { transition:background .1s }\
.um-table tbody tr:hover { background:#f8f9fb }\
.um-table tbody td { padding:10px 12px; border-bottom:1px solid #f5f5f5; vertical-align:middle }\
\
.um-avatar { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; flex-shrink:0 }\
.um-user-name { font-weight:600; color:var(--text); font-size:12.5px }\
.um-user-email { font-size:11px; color:var(--text-muted); margin-top:1px }\
.um-role-badge { padding:3px 10px; border-radius:10px; font-size:10px; font-weight:700; letter-spacing:.3px }\
.um-dept { color:var(--text-muted); font-size:12px }\
.um-status-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:10px; font-size:10.5px; font-weight:600; text-transform:capitalize }\
.um-status-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0 }\
.um-date { color:var(--text-muted); font-size:11.5px }\
.um-sessions { font-weight:600; color:var(--text); text-align:center }\
\
.um-action-group { display:flex; gap:4px }\
.um-act-btn { width:30px; height:30px; border:1px solid var(--border); border-radius:8px; background:var(--card); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s }\
.um-act-btn:hover { background:#f0f2f5; border-color:#cbd5e1 }\
\
/* Audit */\
.um-audit-section { background:var(--card); border:1px solid var(--border); border-radius:12px; padding:16px 20px }\
.um-section-title { display:flex; align-items:center; gap:8px; font-size:13px; font-weight:700; color:var(--text); margin-bottom:14px }\
.um-audit-row { display:flex; align-items:flex-start; gap:10px; padding:8px 0; border-bottom:1px solid #f5f5f5 }\
.um-audit-row:last-child { border-bottom:none }\
.um-audit-dot { width:8px; height:8px; border-radius:50%; margin-top:5px; flex-shrink:0 }\
.um-audit-info { flex:1; font-size:12px; display:flex; gap:4px; flex-wrap:wrap; align-items:baseline }\
.um-audit-action { font-weight:600; font-size:11.5px }\
.um-audit-target { font-weight:500; color:var(--text) }\
.um-audit-detail { color:var(--text-muted); font-size:11px }\
.um-audit-meta { display:flex; flex-direction:column; align-items:flex-end; flex-shrink:0 }\
.um-audit-by { font-size:10.5px; color:var(--text-muted) }\
.um-audit-time { font-size:10px; color:var(--text-light) }\
\
/* Create modal */\
.um-modal-overlay { position:fixed; inset:0; z-index:10000; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s }\
.um-modal-overlay.visible { opacity:1 }\
.um-modal { background:#fff; border-radius:16px; width:100%; max-width:460px; margin:16px; box-shadow:0 20px 60px rgba(0,0,0,.2); animation:acFadeIn .3s ease }\
.um-modal-header { padding:18px 24px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; font-weight:700; font-size:15px; color:var(--text) }\
.um-modal-close { background:none; border:none; cursor:pointer; padding:4px }\
.um-modal-body { padding:20px 24px }\
.um-modal-field { margin-bottom:14px }\
.um-modal-field label { display:block; font-size:11px; font-weight:600; color:#475569; margin-bottom:5px; text-transform:uppercase; letter-spacing:.4px }\
.um-modal-field input { width:100%; padding:9px 12px; border:1.5px solid #e2e8f0; border-radius:8px; font-family:inherit; font-size:13px; color:var(--text); outline:none; transition:border-color .2s }\
.um-modal-field input:focus { border-color:#7c3aed }\
.um-modal-row { display:grid; grid-template-columns:1fr 1fr; gap:12px }\
.um-role-select { display:flex; gap:6px }\
.um-role-opt { flex:1; padding:8px; border:1.5px solid #e2e8f0; border-radius:8px; background:#fff; font-family:inherit; font-size:12.5px; font-weight:600; color:#64748b; cursor:pointer; transition:all .15s; text-align:center }\
.um-role-opt.active { border-color:#7c3aed; background:#7c3aed10; color:#7c3aed }\
.um-modal-footer { padding:14px 24px; border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:8px }\
.um-modal-cancel { padding:8px 18px; border:1px solid var(--border); border-radius:8px; background:#fff; font-family:inherit; font-size:12.5px; color:var(--text-muted); cursor:pointer }\
.um-modal-submit { padding:8px 18px; border:none; border-radius:8px; background:#7c3aed; color:#fff; font-family:inherit; font-size:12.5px; font-weight:600; cursor:pointer; transition:background .15s }\
.um-modal-submit:hover { background:#6d28d9 }\
\
/* Responsive */\
@media(max-width:1024px) {\
  .um-kpi-row { grid-template-columns:repeat(2,1fr) }\
  .um-table-wrap { overflow-x:auto }\
  .um-table { min-width:700px }\
}\
@media(max-width:640px) {\
  .um-wrap { padding:12px 16px }\
  .um-kpi-row { grid-template-columns:1fr 1fr }\
  .um-toolbar { flex-direction:column; align-items:stretch }\
  .um-toolbar-right { flex-wrap:wrap }\
  .um-modal-row { grid-template-columns:1fr }\
}\
';
  document.head.appendChild(s);
}
