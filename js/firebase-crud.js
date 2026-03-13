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
      // If doc doesn't exist, create it
      if (err.code === 'not-found') {
        cleanData.id = docId;
        return fbCollection(collectionKey).doc(docId).set(cleanData).then(function() {
          console.log('[Firebase] Created (upsert) ' + collectionKey + '/' + docId);
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
    // Check if collection has docs
    return fbCollection(key).limit(1).get().then(function(snapshot) {
      if (snapshot.empty && window.DATA[key] && window.DATA[key].length > 0) {
        return fbSeedCollection(key);
      }
      return null;
    });
  });
  return Promise.all(promises).then(function(results) {
    var seeded = results.filter(function(r) { return r !== null; });
    if (seeded.length > 0) {
      console.log('[Firebase] Seeded ' + seeded.length + ' collections');
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
   PHOTO UPLOAD — Firebase Storage + Firestore URL
   
   Usage:
     fbUploadPhoto(file, 'accounts', 'acc1')
       → uploads to photos/accounts/acc1.jpg
       → saves photoURL field in Firestore doc
       → updates window.DATA record
       → returns Promise<url>
   ═══════════════════════════════════════════════════════ */

function fbUploadPhoto(file, collectionKey, docId) {
  if (!file || !collectionKey || !docId) {
    return Promise.reject(new Error('Missing file, collection, or docId'));
  }

  /* Build storage path: photos/{collection}/{docId}.jpg */
  var ext = (file.name || '').split('.').pop() || 'jpg';
  var storagePath = 'photos/' + collectionKey + '/' + docId + '.' + ext;

  var storageRef = firebase.storage().ref(storagePath);

  /* Metadata for correct content-type */
  var metadata = { contentType: file.type || 'image/jpeg' };

  return storageRef.put(file, metadata).then(function(snapshot) {
    return snapshot.ref.getDownloadURL();
  }).then(function(downloadURL) {
    /* Persist URL in Firestore */
    return fbSaveField(collectionKey, docId, 'photoURL', downloadURL).then(function() {
      /* Update window.DATA in memory */
      var records = window.DATA[collectionKey] || [];
      var rec = records.find(function(r) { return r.id === docId; });
      if (rec) {
        rec.photoURL = downloadURL;
        /* Clean up old base64 photo if present */
        if (rec.photo && rec.photo.indexOf('data:') === 0) {
          delete rec.photo;
          /* Also remove base64 from Firestore (async, fire-and-forget) */
          fbSaveField(collectionKey, docId, 'photo', firebase.firestore.FieldValue.delete()).catch(function(){});
        }
      }
      console.log('[Firebase] Photo uploaded: ' + storagePath);
      return downloadURL;
    });
  });
}
