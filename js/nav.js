// ============================================================
// MICKACRM 360 — NAV.JS
// Navigation, routing, breadcrumbs, TopBar interactivity
// ============================================================

// ─── App State ─────────────────────────────────────────────────
var APP = {
  page: "home",        // home | list | record | pipeline
  currentObj: null,    // current object key (e.g. "accounts")
  currentRec: null,    // current record ID
  breadcrumbs: [{ label: "Accueil", page: "home" }],
};

// ─── Navigate ──────────────────────────────────────────────────
function navigate(page, objKey, recId) {
  APP.page = page;

  if (page === "home") {
    APP.currentObj = null;
    APP.currentRec = null;
    APP.breadcrumbs = [{ label: "Accueil", page: "home" }];
  }
  else if (page === "pipeline") {
    APP.currentObj = "opportunities";
    APP.currentRec = null;
    APP.breadcrumbs = [
      { label: "Accueil", page: "home" },
      { label: "Pipeline", page: "pipeline" }
    ];
  }
  else if (page === "list" && objKey) {
    APP.currentObj = objKey;
    APP.currentRec = null;
    APP.breadcrumbs = [
      { label: "Accueil", page: "home" },
      { label: OBJ[objKey].label, page: "list", obj: objKey }
    ];
  }
  else if (page === "record" && objKey && recId) {
    APP.currentObj = objKey;
    APP.currentRec = recId;
    var rec = findRecord(objKey, recId);
    var name = rec ? getRecordName(rec) : recId;
    APP.breadcrumbs = [
      { label: "Accueil", page: "home" },
      { label: OBJ[objKey].label, page: "list", obj: objKey },
      { label: name, page: "record" }
    ];
  }

  renderApp();
}

// ─── Breadcrumbs Renderer ──────────────────────────────────────
function renderBreadcrumbs() {
  var container = document.getElementById("breadcrumbs");
  container.innerHTML = "";

  APP.breadcrumbs.forEach(function(bc, i) {
    if (i > 0) {
      var sep = document.createElement("span");
      sep.textContent = " › ";
      container.appendChild(sep);
    }

    var span = document.createElement("span");
    span.textContent = bc.label;
    var isLast = i === APP.breadcrumbs.length - 1;

    if (!isLast) {
      span.className = "bc-link";
      span.onclick = (function(b) {
        return function() {
          if (b.page === "home") navigate("home");
          else if (b.page === "pipeline") navigate("pipeline");
          else if (b.page === "list" && b.obj) navigate("list", b.obj);
        };
      })(bc);
    } else {
      span.className = "bc-current";
    }
    container.appendChild(span);
  });
}

// ─── TopBar Setup ──────────────────────────────────────────────
function setupTopBar() {
  // Logo click → home
  document.getElementById("logo").onclick = function() { navigate("home"); };

  // Nav pills
  document.getElementById("nav-home").onclick = function() { navigate("home"); };
  document.getElementById("nav-pipeline").onclick = function() { navigate("pipeline"); };

  // Objects dropdown
  setupObjectsDropdown();

  // Search
  setupSearch();

  // Quick create
  setupQuickCreate();
}

function updateNavPills() {
  var homeBtn = document.getElementById("nav-home");
  var pipeBtn = document.getElementById("nav-pipeline");
  homeBtn.className = "topbar-pill" + (APP.page === "home" ? " active" : "");
  pipeBtn.className = "topbar-pill" + (APP.page === "pipeline" ? " active" : "");
}

// ─── Objects Dropdown ──────────────────────────────────────────
function setupObjectsDropdown() {
  var btn = document.getElementById("menu-btn");
  var dd = document.getElementById("menu-dropdown");

  // Build items
  dd.innerHTML = "";
  Object.keys(OBJ).forEach(function(key) {
    var obj = OBJ[key];
    var item = document.createElement("button");
    item.className = "dropdown-item";
    item.innerHTML = '<span class="icon">' + obj.icon + '</span>' +
                     '<span class="label">' + obj.label + '</span>' +
                     '<span class="count">' + obj.data.length + '</span>';
    item.onclick = function() {
      dd.style.display = "none";
      navigate("list", key);
    };
    dd.appendChild(item);
  });

  btn.onclick = function(e) {
    e.stopPropagation();
    dd.style.display = dd.style.display === "none" ? "block" : "none";
  };

  document.addEventListener("click", function(e) {
    if (!btn.contains(e.target) && !dd.contains(e.target)) {
      dd.style.display = "none";
    }
  });
}

// ─── Global Search ─────────────────────────────────────────────
function setupSearch() {
  var wrapper = document.getElementById("search-wrapper");
  var icon = document.getElementById("search-icon");
  var input = document.getElementById("search-input");
  var results = document.getElementById("search-results");
  var isOpen = false;

  icon.onclick = function() {
    isOpen = !isOpen;
    wrapper.className = "search-wrapper " + (isOpen ? "open" : "closed");
    if (isOpen) {
      input.style.display = "block";
      input.focus();
    } else {
      input.style.display = "none";
      input.value = "";
      results.style.display = "none";
    }
  };

  input.oninput = function() {
    var q = input.value.toLowerCase();
    results.innerHTML = "";
    if (q.length < 2) { results.style.display = "none"; return; }

    var hits = [];
    Object.keys(OBJ).forEach(function(key) {
      var obj = OBJ[key];
      obj.data.forEach(function(rec) {
        var match = Object.values(rec).some(function(v) {
          return String(v).toLowerCase().includes(q);
        });
        if (match && hits.length < 8) {
          hits.push({ objKey: key, record: rec, objLabel: obj.label, icon: obj.icon });
        }
      });
    });

    if (hits.length === 0) { results.style.display = "none"; return; }
    results.style.display = "block";

    hits.forEach(function(hit) {
      var item = document.createElement("button");
      item.className = "dropdown-item";
      var name = getRecordName(hit.record);
      item.innerHTML = '<span>' + hit.icon + '</span>' +
                       '<div><div class="search-result-name">' + name + '</div>' +
                       '<div class="search-result-type">' + hit.objLabel + '</div></div>';
      item.onclick = function() {
        navigate("record", hit.objKey, hit.record.id);
        input.value = "";
        results.style.display = "none";
        isOpen = false;
        wrapper.className = "search-wrapper closed";
        input.style.display = "none";
      };
      results.appendChild(item);
    });
  };

  input.onblur = function() {
    setTimeout(function() {
      if (!input.value) {
        isOpen = false;
        wrapper.className = "search-wrapper closed";
        input.style.display = "none";
        results.style.display = "none";
      }
    }, 200);
  };
}

// ─── Quick Create Dropdown ─────────────────────────────────────
function setupQuickCreate() {
  var btn = document.getElementById("create-btn");
  var dd = document.getElementById("create-dropdown");

  dd.innerHTML = "";
  QUICK_CREATE.forEach(function(key) {
    var obj = OBJ[key];
    var item = document.createElement("button");
    item.className = "dropdown-item";
    item.innerHTML = '<span>' + obj.icon + '</span> Nouveau ' + obj.label.slice(0, -1);
    item.onclick = function() {
      dd.style.display = "none";
      showToast("Création " + obj.label.slice(0, -1) + " — bientôt disponible", "info");
    };
    dd.appendChild(item);
  });

  btn.onclick = function(e) {
    e.stopPropagation();
    dd.style.display = dd.style.display === "none" ? "block" : "none";
  };

  document.addEventListener("click", function(e) {
    if (!btn.contains(e.target) && !dd.contains(e.target)) {
      dd.style.display = "none";
    }
  });
}
