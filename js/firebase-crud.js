/* ═══════════════════════════════════════════════════════
   firebase-crud.js — Firestore CRUD Layer for MickaCRM
   
   Provides:
     fbDB               — Firestore instance
     fbCollection(name)  — returns collection ref
     fbLoadAll()         — loads ALL collections → window.DATA
     fbCreate(col, rec)  — add doc (auto-ID or rec.id)
     fbUpdate(col, id, data) — update single doc
     fbDelete(col, id)   — delete single doc
     fbSaveField(col, id, field, value) — update one field
     fbSeedIfEmpty()     — seed Firestore from window.DATA mock
   
   All writes update window.DATA + Firestore in parallel.
   ═══════════════════════════════════════════════════════ */

var fbDB = firebase.firestore();

/* ── Collection mapping ─────────────────────────────────
   Maps window.DATA keys → Firestore collection names     */
var FB_COLLECTIONS = {
  accounts:      'accounts',
  contacts:      'contacts',
  opportunities: 'opportunities',
  leads:         'leads',
  projects:      'projects',
  quotes:        'quotes',
  claims:        'claims',
  activities:    'activities',
  products:      'products',
  campaigns:     'campaigns',
  cases:         'cases'
};

/* ── Helper: get collection ref ─────────────────────── */
function fbCollection(name) {
  return fbDB.collection(FB_COLLECTIONS[name] || name);
}

/* ═══════════════════════════════════════════════════════
   LOAD ALL — Firestore → window.DATA
   ═══════════════════════════════════════════════════════ */
function fbLoadAll() {
  var keys = Object.keys(FB_COLLECTIONS);
  var promises = keys.map(function(key) {
    return fbCollection(key).get().then(function(snapshot) {
      var docs = [];
      snapshot.forEach(function(doc) {
        var d = doc.data();
        d.id = doc.id;
        docs.push(d);
      });
      return { key: key, docs: docs };
    });
  });

  return Promise.all(promises).then(function(results) {
    var totalDocs = 0;
    results.forEach(function(r) {
      if (r.docs.length > 0) {
        window.DATA[r.key] = r.docs;
        totalDocs += r.docs.length;
      }
      // If 0 docs, keep existing mock data (for first run before seed)
    });
    console.log('[Firebase] Loaded ' + totalDocs + ' docs from Firestore');
    return totalDocs;
  });
}

/* ═══════════════════════════════════════════════════════
   CREATE — Add a new record
   Writes to Firestore + pushes to window.DATA
   ═══════════════════════════════════════════════════════ */
function fbCreate(collectionKey, record) {
  var col = fbCollection(collectionKey);
  var docId = record.id;
  
  // Clean undefined values (Firestore doesn't accept undefined)
  var cleanRec = {};
  Object.keys(record).forEach(function(k) {
    if (record[k] !== undefined) cleanRec[k] = record[k];
  });

  // Use the record's id as doc ID for consistency
  var promise;
  if (docId) {
    promise = col.doc(docId).set(cleanRec);
  } else {
    promise = col.add(cleanRec).then(function(docRef) {
      record.id = docRef.id;
      cleanRec.id = docRef.id;
      // Update the doc with its own ID
      return docRef.update({ id: docRef.id });
    });
  }

  return promise.then(function() {
    console.log('[Firebase] Created ' + collectionKey + '/' + record.id);
    return record;
  }).catch(function(err) {
    console.error('[Firebase] Create error:', err);
    // Record is already in window.DATA (pushed by caller), so UI still works
  });
}

/* ═══════════════════════════════════════════════════════
   UPDATE — Update an existing record (full or partial)
   ═══════════════════════════════════════════════════════ */
function fbUpdate(collectionKey, docId, data) {
  // Clean undefined values
  var cleanData = {};
  Object.keys(data).forEach(function(k) {
    if (data[k] !== undefined) cleanData[k] = data[k];
  });

  return fbCollection(collectionKey).doc(docId).update(cleanData)
    .then(function() {
      console.log('[Firebase] Updated ' + collectionKey + '/' + docId);
    })
    .catch(function(err) {
      // If doc doesn't exist, create it with merge to preserve any existing fields
      if (err.code === 'not-found') {
        cleanData.id = docId;
        return fbCollection(collectionKey).doc(docId).set(cleanData, {merge: true}).then(function() {
          console.log('[Firebase] Created (upsert/merge) ' + collectionKey + '/' + docId);
        });
      }
      console.error('[Firebase] Update error:', err);
    });
}

/* ═══════════════════════════════════════════════════════
   SAVE FIELD — Update a single field
   ═══════════════════════════════════════════════════════ */
function fbSaveField(collectionKey, docId, field, value) {
  var upd = {};
  upd[field] = value;
  return fbUpdate(collectionKey, docId, upd);
}

/* ═══════════════════════════════════════════════════════
   DELETE — Remove a record
   ═══════════════════════════════════════════════════════ */
function fbDelete(collectionKey, docId) {
  return fbCollection(collectionKey).doc(docId).delete()
    .then(function() {
      console.log('[Firebase] Deleted ' + collectionKey + '/' + docId);
    })
    .catch(function(err) {
      console.error('[Firebase] Delete error:', err);
    });
}

/* ═══════════════════════════════════════════════════════
   SEED — Push mock window.DATA → Firestore (first run)
   Only seeds collections that are EMPTY in Firestore.
   ═══════════════════════════════════════════════════════ */
function fbSeedIfEmpty() {
  var keys = Object.keys(FB_COLLECTIONS);
  var promises = keys.map(function(key) {
    var mockData = window.DATA[key];
    if (!mockData || !mockData.length) return Promise.resolve(null);

    /* Load ALL doc IDs from Firestore for this collection */
    return fbCollection(key).get().then(function(snapshot) {
      if (snapshot.empty) {
        /* Empty collection — full seed */
        console.log('[Firebase] Collection ' + key + ' is empty — seeding ' + mockData.length + ' docs');
        return fbSeedCollection(key);
      }
      /* Collection has some docs — check for missing ones */
      var existingIds = {};
      snapshot.forEach(function(doc) { existingIds[doc.id] = true; });
      var missing = mockData.filter(function(r) { return r.id && !existingIds[r.id]; });
      if (missing.length > 0) {
        console.log('[Firebase] Collection ' + key + ' has ' + Object.keys(existingIds).length + ' docs, adding ' + missing.length + ' missing');
        var batch = fbDB.batch();
        var col = fbCollection(key);
        missing.forEach(function(record) {
          var cleanRec = {};
          Object.keys(record).forEach(function(k) {
            if (record[k] !== undefined) cleanRec[k] = record[k];
          });
          batch.set(col.doc(record.id), cleanRec, {merge: true});
        });
        return batch.commit().then(function() {
          console.log('[Firebase] Completed ' + key + ': added ' + missing.length + ' missing docs');
          return key;
        });
      }
      return null;
    });
  });
  return Promise.all(promises).then(function(results) {
    var seeded = results.filter(function(r) { return r !== null; });
    if (seeded.length > 0) {
      console.log('[Firebase] Seeded/completed ' + seeded.length + ' collections');
    }
  });
}

function fbSeedCollection(key) {
  var batch = fbDB.batch();
  var col = fbCollection(key);
  var count = 0;

  (window.DATA[key] || []).forEach(function(record) {
    // Clean undefined values
    var cleanRec = {};
    Object.keys(record).forEach(function(k) {
      if (record[k] !== undefined) cleanRec[k] = record[k];
    });
    var docRef = record.id ? col.doc(record.id) : col.doc();
    if (!record.id) cleanRec.id = docRef.id;
    batch.set(docRef, cleanRec);
    count++;
  });

  return batch.commit().then(function() {
    console.log('[Firebase] Seeded ' + key + ': ' + count + ' docs');
    return key;
  });
}

/* ═══════════════════════════════════════════════════════
   STATUS INDICATOR — Visual feedback in UI
   ═══════════════════════════════════════════════════════ */
function fbShowStatus(msg, isError) {
  var old = document.getElementById('fb-status-toast');
  if (old) old.remove();

  var toast = document.createElement('div');
  toast.id = 'fb-status-toast';
  toast.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;' +
    'background:' + (isError ? '#ef4444' : '#0f172a') + ';color:#fff;' +
    'padding:10px 18px;border-radius:10px;font-size:12px;font-weight:600;' +
    'font-family:DM Sans,sans-serif;box-shadow:0 8px 32px rgba(0,0,0,.18);' +
    'display:flex;align-items:center;gap:8px;opacity:0;transform:translateY(8px);' +
    'transition:all .3s ease';
  toast.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' +
    (isError ? '#fff' : '#10b981') + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
    (isError ? '<path d="M12 9v2m0 4h.01"/>' : '<path d="M20 6L9 17l-5-5"/>') +
    '</svg><span>' + msg + '</span>';
  document.body.appendChild(toast);

  requestAnimationFrame(function() {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(function() { toast.remove(); }, 300);
  }, 2500);
}


/* ═══════════════════════════════════════════════════════
   PHOTO — Compress + Save as base64 in Firestore
   
   Resizes to max 200x200, JPEG quality 0.7
   Resulting base64 is ~10-30KB → safe for Firestore (1MB limit)
   
   Usage:
     fbCompressAndSavePhoto(file, 'accounts', 'acc1')
       → compresses image via canvas
       → saves photoURL field (base64) in Firestore doc
       → updates window.DATA record
       → returns Promise<base64string>
   ═══════════════════════════════════════════════════════ */

function fbCompressAndSavePhoto(file, collectionKey, docId, maxSize, quality) {
  maxSize = maxSize || 200;
  quality = quality || 0.7;

  return new Promise(function(resolve, reject) {
    if (!file || !collectionKey || !docId) {
      return reject(new Error('Missing file, collection, or docId'));
    }

    var reader = new FileReader();
    reader.onerror = function() { reject(new Error('File read failed')); };
    reader.onload = function(e) {
      var img = new Image();
      img.onerror = function() { reject(new Error('Image load failed')); };
      img.onload = function() {
        /* ── Compute target size (fit in maxSize box) ── */
        var w = img.width, h = img.height;
        if (w > h) {
          if (w > maxSize) { h = Math.round(h * maxSize / w); w = maxSize; }
        } else {
          if (h > maxSize) { w = Math.round(w * maxSize / h); h = maxSize; }
        }

        /* ── Draw on canvas ── */
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        /* ── Export compressed JPEG base64 ── */
        var base64 = canvas.toDataURL('image/jpeg', quality);

        /* ── Save to Firestore ── */
        fbSaveField(collectionKey, docId, 'photoURL', base64).then(function() {
          /* Update window.DATA */
          var records = window.DATA[collectionKey] || [];
          var rec = records.find(function(r) { return r.id === docId; });
          if (rec) {
            rec.photoURL = base64;
            /* Clean old photo field if different */
            if (rec.photo && rec.photo !== base64) delete rec.photo;
          }
          console.log('[Firebase] Photo compressed & saved: ' + collectionKey + '/' + docId + ' (' + Math.round(base64.length / 1024) + 'KB)');
          resolve(base64);
        }).catch(reject);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}


/* ═══════════════════════════════════════════════════════
   PHOTO PREVIEW — Full-screen lightbox on avatar click
   
   Usage: fbShowPhotoPreview(imageUrl, altText)
   Shows a centered modal with the full image.
   Click backdrop or X to close.
   ═══════════════════════════════════════════════════════ */

function fbShowPhotoPreview(imageUrl, altText) {
  if (!imageUrl) return;
  /* Inject CSS once */
  if (!document.getElementById('fb-preview-css')) {
    var s = document.createElement('style');
    s.id = 'fb-preview-css';
    s.textContent = '\
.fb-preview-backdrop{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s ease;cursor:pointer}\
.fb-preview-backdrop.fb-preview-show{opacity:1}\
.fb-preview-img{max-width:min(420px,85vw);max-height:min(420px,85vh);border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.35);border:3px solid #fff;object-fit:cover;transform:scale(.9);transition:transform .25s ease}\
.fb-preview-backdrop.fb-preview-show .fb-preview-img{transform:scale(1)}\
.fb-preview-close{position:absolute;top:20px;right:24px;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.15);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}\
.fb-preview-close:hover{background:rgba(255,255,255,.3)}\
';
    document.head.appendChild(s);
  }

  var backdrop = document.createElement('div');
  backdrop.className = 'fb-preview-backdrop';
  backdrop.innerHTML = '<img class="fb-preview-img" src="'+imageUrl+'" alt="'+(altText||'Photo')+'" />' +
    '<button class="fb-preview-close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>';
  document.body.appendChild(backdrop);

  requestAnimationFrame(function() { backdrop.classList.add('fb-preview-show'); });

  function closePreview() {
    backdrop.classList.remove('fb-preview-show');
    setTimeout(function() { backdrop.remove(); }, 200);
  }
  backdrop.addEventListener('click', function(e) {
    if (e.target === backdrop || e.target.classList.contains('fb-preview-close') || e.target.closest('.fb-preview-close')) {
      closePreview();
    }
  });
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape') { closePreview(); document.removeEventListener('keydown', onKey); }
  });
}
