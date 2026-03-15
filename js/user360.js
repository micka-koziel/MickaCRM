/* ═══════════════════════════════════════════════════════════════
   user360.js — User 360 Detail Page
   Firestore-backed: users + audit_log collections
   CSS prefix: u36-  |  Accent: #7c3aed (Agent purple)
   ═══════════════════════════════════════════════════════════════ */

/* ── Render User 360 ── */
function renderUser360(container, rec) {
  injectU360Styles();

  var userId = rec.id;
  var userName = rec.name || 'Unknown';
  var initials = userName.split(' ').map(function(w){ return w[0]; }).join('').substring(0,2).toUpperCase();
  var isActive = rec.status === 'active';
  var roleColor = rec.role === 'admin' ? '#7c3aed' : '#64748b';
  var statusColor = isActive ? '#10b981' : '#ef4444';
  var photoUrl = rec.photoURL || rec.photo || '';

  /* Gather audit entries for this user */
  var userAudit = (typeof UM_AUDIT !== 'undefined' ? UM_AUDIT : []).filter(function(a) {
    return a.targetUserId === userId;
  }).slice(0, 10);

  var h = '<div class="u36">';

  /* ── Back nav ── */
  h += '<div class="u36-back" id="u36-back">' + svgIcon('arrowLeft',14,'var(--text-muted)') + '<span>Users</span></div>';

  /* ── Header Card ── */
  h += '<div class="u36-header-card">';
  h += '<div class="u36-header-top">';

  /* Avatar */
  h += '<div class="u36-photo-wrap" id="u36-photo-wrap" title="Click to change photo">';
  if (photoUrl) {
    h += '<div class="u36-photo" id="u36-avatar"><img src="' + photoUrl + '" alt="' + userName + '" /></div>';
  } else {
    h += '<div class="u36-photo u36-photo-initials" id="u36-avatar">' + initials + '</div>';
  }
  h += '<div class="u36-photo-overlay">' + svgIcon('plus',16,'#fff') + '</div>';
  h += '<input type="file" id="u36-photo-input" accept="image/*" style="display:none" />';
  h += '</div>';

  /* Info */
  h += '<div class="u36-header-info">';
  h += '<div class="u36-name-row">';
  h += '<h1 class="u36-name">' + userName + '</h1>';
  /* Status badge */
  h += '<span class="u36-status-badge" style="background:' + statusColor + '12;color:' + statusColor + '">';
  h += '<span class="u36-status-dot" style="background:' + statusColor + '"></span>' + rec.status + '</span>';
  /* Role badge */
  h += '<span class="u36-role-badge" style="background:' + roleColor + '12;color:' + roleColor + '">' + rec.role.toUpperCase() + '</span>';
  h += '</div>';

  h += '<div class="u36-subtitle">' + (rec.title || '—') + ' — ' + (rec.department || '—') + '</div>';

  /* Detail chips */
  h += '<div class="u36-chips">';
  if (rec.email) h += '<div class="u36-chip">' + svgIcon('mail',12,'var(--text-muted)') + '<span>' + rec.email + '</span></div>';
  if (rec.phone) h += '<div class="u36-chip">' + svgIcon('phone',12,'var(--text-muted)') + '<span>' + rec.phone + '</span></div>';
  if (rec.location) h += '<div class="u36-chip">' + svgIcon('mapPin',12,'var(--text-muted)') + '<span>' + rec.location + '</span></div>';
  h += '</div>';
  h += '</div>';

  /* Header metrics */
  h += '<div class="u36-header-metrics">';
  h += '<div class="u36-hmetric"><div class="u36-hmetric-val" style="color:var(--accent)">' + (rec.sessions || 0) + '</div><div class="u36-hmetric-label">Sessions</div></div>';
  h += '<div class="u36-hmetric"><div class="u36-hmetric-val u36-hmetric-sm">' + _u36FormatDate(rec.createdAt) + '</div><div class="u36-hmetric-label">Member Since</div></div>';
  h += '</div>';

  h += '</div>'; /* close header-top */

  /* Actions bar */
  h += '<div class="u36-actions">';
  if (isActive) {
    h += '<button class="u36-action-btn u36-action-danger" id="u36-toggle-status">' + svgIcon('x',13,'#fff') + '<span>Deactivate</span></button>';
  } else {
    h += '<button class="u36-action-btn u36-action-success" id="u36-toggle-status">' + svgIcon('plus',13,'#fff') + '<span>Activate</span></button>';
  }
  h += '<button class="u36-action-btn u36-action-outline" id="u36-toggle-role">' + svgIcon('users',13,'var(--text-muted)') + '<span>Toggle Role</span></button>';
  h += '<button class="u36-action-btn u36-action-outline" id="u36-reset-pwd">' + svgIcon('edit',13,'var(--text-muted)') + '<span>Reset Password</span></button>';
  h += crmActionButtons('u36', 'users', userId);
  h += '</div>';

  h += '</div>'; /* close header-card */

  /* ── KPI Row ── */
  h += '<div class="u36-kpi-row">';
  h += _u36Kpi(rec.sessions || 0, 'Sessions', 'var(--accent)');
  h += _u36Kpi(_u36FormatDateTime(rec.lastLogin), 'Last Login', '#10b981', true);
  h += _u36Kpi(_u36FormatDate(rec.createdAt), 'Member Since', '#7c3aed', true);
  h += _u36Kpi(rec.role.toUpperCase(), 'Role', roleColor);
  h += '</div>';

  /* ── 2-Column Grid ── */
  h += '<div class="u36-grid2">';

  /* LEFT COLUMN */
  h += '<div class="u36-col">';

  /* User Details */
  h += '<div class="u36-section">';
  h += '<div class="u36-section-head">' + svgIcon('users',14,'var(--text-light)') + '<span class="u36-section-title">User Details</span></div>';
  h += '<div class="u36-insights">';
  h += _u36Row('Full Name', userName);
  h += _u36Row('Email', rec.email || '—');
  h += _u36Row('Phone', rec.phone || '—');
  h += _u36Row('Title', rec.title || '—');
  h += _u36Row('Department', rec.department || '—');
  h += _u36Row('Location', rec.location || '—');
  h += _u36Row('Role', rec.role.charAt(0).toUpperCase() + rec.role.slice(1));
  h += _u36Row('Status', rec.status.charAt(0).toUpperCase() + rec.status.slice(1), true);
  h += '</div></div>';

  /* Login Activity */
  h += '<div class="u36-section">';
  h += '<div class="u36-section-head">' + svgIcon('calendar',14,'var(--text-light)') + '<span class="u36-section-title">Login Activity</span></div>';
  h += '<div class="u36-insights">';
  h += _u36Row('Last Login', _u36FormatDateTime(rec.lastLogin));
  h += _u36Row('Total Sessions', String(rec.sessions || 0));
  h += _u36Row('Account Created', _u36FormatDate(rec.createdAt), true);
  h += '</div></div>';

  h += '</div>'; /* close left col */

  /* RIGHT COLUMN */
  h += '<div class="u36-col">';

  /* Audit Log */
  h += '<div class="u36-section">';
  h += '<div class="u36-section-head">' + svgIcon('leads',14,'#7c3aed') + '<span class="u36-section-title">Audit Log</span></div>';
  if (userAudit.length === 0) {
    h += '<div class="u36-empty">No audit entries for this user</div>';
  } else {
    h += '<div class="u36-timeline">';
    var actionMap = {
      deactivate: { color:'#ef4444', label:'Deactivated' },
      activate:   { color:'#10b981', label:'Activated' },
      role_change:{ color:'#2563eb', label:'Role Changed' },
      password_reset:{ color:'#f59e0b', label:'Password Reset' },
      create:     { color:'#7c3aed', label:'User Created' }
    };
    userAudit.forEach(function(a, i) {
      var info = actionMap[a.action] || { color:'#94a3b8', label:a.action };
      var isLast = i === userAudit.length - 1;
      h += '<div class="u36-tl-item">';
      if (!isLast) h += '<div class="u36-tl-line"></div>';
      h += '<div class="u36-tl-icon" style="border-color:' + info.color + '">';
      h += '<div style="width:8px;height:8px;border-radius:50%;background:' + info.color + '"></div>';
      h += '</div>';
      h += '<div class="u36-tl-body">';
      h += '<div class="u36-tl-top"><span class="u36-tl-subject" style="color:' + info.color + '">' + info.label + '</span>';
      h += '<span class="u36-tl-type">' + _u36FormatDateTime(a.timestamp) + '</span></div>';
      if (a.details) h += '<div class="u36-tl-meta">' + a.details + '</div>';
      h += '<div class="u36-tl-meta">by ' + (a.performedBy || 'System') + '</div>';
      h += '</div></div>';
    });
    h += '</div>';
  }
  h += '</div>';

  /* Permissions */
  h += '<div class="u36-section">';
  h += '<div class="u36-section-head">' + svgIcon('users',14,'var(--text-light)') + '<span class="u36-section-title">Permissions</span></div>';
  h += '<div style="padding:14px 16px"><div class="u36-perm-list">';
  var perms = rec.role === 'admin'
    ? ['Full CRM Access','User Management','Data Export','System Configuration','Audit Logs','API Access']
    : ['CRM Read/Write','Own Records','Standard Reports','Calendar Access'];
  perms.forEach(function(p) {
    h += '<span class="u36-perm-tag" style="background:' + roleColor + '08;border-color:' + roleColor + '20;color:' + roleColor + '">';
    h += svgIcon('plus',11, roleColor) + ' ' + p + '</span>';
  });
  h += '</div></div></div>';

  h += '</div>'; /* close right col */
  h += '</div>'; /* close grid2 */
  h += '</div>'; /* close u36 */

  container.innerHTML = h;

  /* ── Event bindings ── */

  /* Back button */
  var backBtn = container.querySelector('#u36-back');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      /* Navigate back to Agent Console Users tab */
      AC_TAB = 'users';
      navigate('agentConsole');
    });
  }

  /* Photo upload */
  var photoWrap = container.querySelector('#u36-photo-wrap');
  var photoInput = container.querySelector('#u36-photo-input');
  if (photoWrap && photoInput) {
    photoWrap.addEventListener('click', function(e) {
      /* Don't trigger file picker if clicking on an existing photo (show lightbox) */
      if (photoUrl && e.target.tagName === 'IMG') {
        if (typeof fbShowPhotoPreview === 'function') fbShowPhotoPreview(photoUrl, userName);
        return;
      }
      photoInput.click();
    });
    photoInput.addEventListener('change', function() {
      var file = photoInput.files && photoInput.files[0];
      if (!file) return;
      var avatar = container.querySelector('#u36-avatar');
      if (typeof fbCompressAndSavePhoto === 'function') {
        if (avatar) { avatar.className = 'u36-photo u36-photo-loading'; avatar.innerHTML = '<div class="u36-spinner"></div>'; }
        fbCompressAndSavePhoto(file, 'users', userId).then(function(base64) {
          /* Update UM_USERS in-memory (fbCompressAndSavePhoto only updates window.DATA) */
          var umRec = UM_USERS.find(function(u){ return u.id === userId; });
          if (umRec) umRec.photoURL = base64;
          rec.photoURL = base64;
          renderUser360(container, rec);
        }).catch(function(err) {
          console.error('[User360] Photo upload failed:', err);
          if (avatar) { avatar.className = 'u36-photo u36-photo-initials'; avatar.innerHTML = initials; }
        });
      } else {
        var reader = new FileReader();
        reader.onload = function(ev) {
          rec.photoURL = ev.target.result;
          /* Also save to Firestore manually */
          if (typeof fbSaveField === 'function') fbSaveField('users', userId, 'photoURL', ev.target.result);
          var umRec = UM_USERS.find(function(u){ return u.id === userId; });
          if (umRec) umRec.photoURL = ev.target.result;
          renderUser360(container, rec);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  /* Toggle status */
  var toggleStatusBtn = container.querySelector('#u36-toggle-status');
  if (toggleStatusBtn) {
    toggleStatusBtn.addEventListener('click', function() {
      if (isActive) {
        if (typeof umDeactivateUser === 'function') {
          umDeactivateUser(userId).then(function() {
            if (typeof acShowToast === 'function') acShowToast('User Deactivated', userName + ' — account disabled', '#ef4444');
            var updated = UM_USERS.find(function(u){ return u.id === userId; });
            if (updated) renderUser360(container, updated);
          });
        }
      } else {
        if (typeof umActivateUser === 'function') {
          umActivateUser(userId).then(function() {
            if (typeof acShowToast === 'function') acShowToast('User Activated', userName + ' — account enabled', '#10b981');
            var updated = UM_USERS.find(function(u){ return u.id === userId; });
            if (updated) renderUser360(container, updated);
          });
        }
      }
    });
  }

  /* Toggle role */
  var toggleRoleBtn = container.querySelector('#u36-toggle-role');
  if (toggleRoleBtn) {
    toggleRoleBtn.addEventListener('click', function() {
      var newRole = rec.role === 'admin' ? 'user' : 'admin';
      if (typeof umChangeRole === 'function') {
        umChangeRole(userId, newRole).then(function() {
          if (typeof acShowToast === 'function') acShowToast('Role Updated', userName + ' → ' + newRole.toUpperCase(), '#2563eb');
          var updated = UM_USERS.find(function(u){ return u.id === userId; });
          if (updated) renderUser360(container, updated);
        });
      }
    });
  }

  /* Reset password */
  var resetPwdBtn = container.querySelector('#u36-reset-pwd');
  if (resetPwdBtn) {
    resetPwdBtn.addEventListener('click', function() {
      if (typeof umResetPassword === 'function') {
        umResetPassword(userId).then(function() {
          if (typeof acShowToast === 'function') acShowToast('Password Reset', 'Email sent to ' + userName, '#f59e0b');
          /* Reload audit */
          if (typeof umLoadAudit === 'function') {
            umLoadAudit().then(function() {
              var updated = UM_USERS.find(function(u){ return u.id === userId; });
              if (updated) renderUser360(container, updated);
            });
          }
        });
      }
    });
  }

  /* Edit / Delete buttons */
  bindCrmActionButtons(container);
}


/* ── Helpers ── */
function _u36FormatDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }); }
  catch(e) { return d; }
}

function _u36FormatDateTime(d) {
  if (!d) return 'Never';
  try {
    var dt = new Date(d);
    return dt.toLocaleDateString('en-US', { month:'short', day:'numeric' }) + ' ' +
           dt.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
  } catch(e) { return d; }
}

function _u36Kpi(value, label, color, small) {
  return '<div class="u36-kpi">' +
    '<div class="u36-kpi-value' + (small ? ' u36-kpi-sm' : '') + '" style="color:' + color + '">' + value + '</div>' +
    '<div class="u36-kpi-label">' + label + '</div></div>';
}

function _u36Row(label, value, isLast) {
  return '<div class="u36-insight-row' + (isLast ? ' u36-row-last' : '') + '">' +
    '<span class="u36-insight-label">' + label + '</span>' +
    '<span class="u36-insight-value">' + value + '</span></div>';
}


/* ══════════════════════════════════════════════════════════════
   STYLES
   ══════════════════════════════════════════════════════════════ */
function injectU360Styles() {
  if (document.getElementById('u36-css')) return;
  var s = document.createElement('style'); s.id = 'u36-css';
  s.textContent = '\
.u36{max-width:1140px;margin:0 auto;padding:14px 18px 48px}\
.u36-back{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;color:var(--text-muted);cursor:pointer;padding:4px 0;margin-bottom:10px;transition:color .12s}\
.u36-back:hover{color:var(--accent)}\
\
/* Header card */\
.u36-header-card{background:var(--card);border-radius:10px;box-shadow:0 1px 4px rgba(0,0,0,.06);border:1px solid var(--border);margin-bottom:14px;overflow:hidden}\
.u36-header-top{padding:22px 26px 18px;display:flex;gap:22px;align-items:center}\
\
/* Avatar */\
.u36-photo-wrap{position:relative;cursor:pointer;flex-shrink:0}\
.u36-photo-wrap:hover .u36-photo{transform:scale(1.05);box-shadow:0 6px 20px rgba(0,0,0,.12)}\
.u36-photo-wrap:hover .u36-photo-overlay{opacity:1}\
.u36-photo{width:92px;height:92px;border-radius:50%;background:#fff;border:1px solid #E6E8EC;box-shadow:0 2px 8px rgba(0,0,0,.06);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;transition:transform .18s ease,box-shadow .18s ease}\
.u36-photo img{width:100%;height:100%;object-fit:cover}\
.u36-photo-initials{background:linear-gradient(135deg,#ede9fe 0%,#ddd6fe 100%);font-size:28px;font-weight:800;color:#7c3aed;letter-spacing:-.5px}\
.u36-photo-overlay{position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s}\
.u36-photo-loading{background:linear-gradient(135deg,#ede9fe 0%,#ddd6fe 100%)}\
.u36-spinner{width:22px;height:22px;border:2.5px solid var(--border);border-top-color:#7c3aed;border-radius:50%;animation:u36spin .6s linear infinite}\
@keyframes u36spin{to{transform:rotate(360deg)}}\
\
/* Header info */\
.u36-header-info{flex:1;min-width:0}\
.u36-name-row{display:flex;align-items:center;gap:10px;margin-bottom:5px;flex-wrap:wrap}\
.u36-name{font-size:22px;font-weight:800;color:var(--text);margin:0;letter-spacing:-.5px}\
.u36-status-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700;text-transform:capitalize}\
.u36-status-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}\
.u36-role-badge{padding:3px 10px;border-radius:10px;font-size:10px;font-weight:700;letter-spacing:.3px}\
.u36-subtitle{font-size:13px;color:var(--text-muted);font-weight:500;margin-bottom:8px}\
.u36-chips{display:flex;flex-wrap:wrap;gap:6px}\
.u36-chip{display:inline-flex;align-items:center;gap:5px;background:#f8f9fb;border:1px solid var(--border);padding:4px 10px;border-radius:6px;font-size:11px;color:var(--text-muted);font-weight:500}\
\
/* Header metrics */\
.u36-header-metrics{display:flex;flex-direction:column;gap:12px;flex-shrink:0;align-items:center;padding-left:20px;border-left:1px solid var(--border)}\
.u36-hmetric{display:flex;flex-direction:column;align-items:center}\
.u36-hmetric-val{font-size:22px;font-weight:800;letter-spacing:-.5px;line-height:1;font-variant-numeric:tabular-nums}\
.u36-hmetric-sm{font-size:12px;font-weight:700;letter-spacing:-.3px}\
.u36-hmetric-label{font-size:9px;color:var(--text-light);font-weight:500;margin-top:2px;text-transform:uppercase;letter-spacing:.3px}\
\
/* Actions */\
.u36-actions{display:flex;gap:7px;padding:12px 26px 14px;border-top:1px solid var(--border);flex-wrap:wrap}\
.u36-action-btn{display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:7px;border:none;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;transition:all .12s}\
.u36-action-danger{background:#ef4444;color:#fff}\
.u36-action-danger:hover{background:#dc2626}\
.u36-action-success{background:#10b981;color:#fff}\
.u36-action-success:hover{background:#059669}\
.u36-action-outline{background:transparent;border:1px solid var(--border);color:var(--text-muted)}\
.u36-action-outline:hover{border-color:#bbb;color:var(--text);background:#f8f9fb}\
\
/* KPI Row */\
.u36-kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}\
.u36-kpi{background:var(--card);border-radius:10px;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,.04);padding:16px 18px;text-align:center;transition:all .15s}\
.u36-kpi:hover{box-shadow:0 4px 14px rgba(0,0,0,.08);transform:translateY(-2px)}\
.u36-kpi-value{font-size:28px;font-weight:800;letter-spacing:-1px;line-height:1;margin-bottom:3px;font-variant-numeric:tabular-nums}\
.u36-kpi-sm{font-size:14px;letter-spacing:0}\
.u36-kpi-label{font-size:10.5px;color:var(--text-muted);font-weight:500;text-transform:uppercase;letter-spacing:.4px}\
\
/* Grid */\
.u36-grid2{display:grid;grid-template-columns:1.12fr 1fr;gap:14px;align-items:start}\
.u36-col{display:flex;flex-direction:column;gap:12px}\
\
/* Sections */\
.u36-section{background:var(--card);border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,.04);border:1px solid var(--border);overflow:hidden}\
.u36-section-head{padding:11px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:7px}\
.u36-section-title{font-size:11.5px;font-weight:700;color:var(--text);text-transform:uppercase;letter-spacing:.5px}\
\
/* Insight rows */\
.u36-insights{padding:4px 0}\
.u36-insight-row{display:flex;justify-content:space-between;align-items:center;padding:9px 16px;border-bottom:1px solid var(--border)}\
.u36-insight-row:last-child,.u36-row-last{border-bottom:none}\
.u36-insight-label{font-size:11px;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.3px}\
.u36-insight-value{font-size:12.5px;font-weight:600;color:var(--text)}\
\
/* Timeline (audit) */\
.u36-timeline{padding:12px 16px}\
.u36-tl-item{display:flex;gap:10px;position:relative;padding-bottom:16px}\
.u36-tl-item:last-child{padding-bottom:0}\
.u36-tl-line{position:absolute;left:13px;top:28px;bottom:0;width:1.5px;background:var(--border);border-radius:1px}\
.u36-tl-item:last-child .u36-tl-line{display:none}\
.u36-tl-icon{width:26px;height:26px;border-radius:8px;border:1.5px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0;z-index:1;background:var(--card)}\
.u36-tl-body{flex:1;min-width:0;padding-top:2px}\
.u36-tl-top{display:flex;justify-content:space-between;align-items:baseline}\
.u36-tl-subject{font-size:12px;font-weight:600;line-height:1.2}\
.u36-tl-type{font-size:10px;color:var(--text-light);flex-shrink:0;margin-left:8px}\
.u36-tl-meta{font-size:10px;color:var(--text-light);margin-top:2px}\
\
/* Permissions */\
.u36-perm-list{display:flex;flex-wrap:wrap;gap:6px}\
.u36-perm-tag{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:6px;border:1px solid;font-size:11px;font-weight:500}\
\
/* Empty */\
.u36-empty{padding:20px 16px;text-align:center;color:var(--text-light);font-size:11px}\
\
/* Responsive */\
@media(max-width:1100px){\
  .u36-grid2{grid-template-columns:1fr}\
  .u36-kpi-row{grid-template-columns:repeat(2,1fr)}\
  .u36-header-top{flex-wrap:wrap}\
  .u36-header-metrics{border-left:none;padding-left:0;flex-direction:row;gap:20px;margin-top:10px}\
}\
@media(max-width:640px){\
  .u36{padding:10px 10px 32px}\
  .u36-header-top{padding:16px 14px 12px;gap:12px}\
  .u36-photo{width:64px;height:64px;font-size:20px}\
  .u36-name{font-size:17px}\
  .u36-kpi-value{font-size:22px}\
  .u36-kpi-row{grid-template-columns:1fr 1fr}\
  .u36-actions{padding:10px 14px}\
  .u36-action-btn{padding:6px 10px;font-size:11px}\
}\
';
  document.head.appendChild(s);
}
