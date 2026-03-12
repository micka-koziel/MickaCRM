// ============================================================
// MICKACRM 360 v3 — NAV.JS
// ============================================================
var APP = { page:"home", currentObj:null, currentRec:null, breadcrumbs:[{label:"Home",page:"home"}] };

function navigate(page, objKey, recId) {
  APP.page = page;
  if (page === "home") { APP.currentObj=null; APP.currentRec=null; APP.breadcrumbs=[{label:"Home",page:"home"}]; }
  else if (page === "pipeline") { APP.currentObj="opportunities"; APP.currentRec=null; APP.breadcrumbs=[{label:"Home",page:"home"},{label:"Pipeline",page:"pipeline"}]; }
  else if (page === "calendar") { APP.currentObj="activities"; APP.currentRec=null; APP.breadcrumbs=[{label:"Home",page:"home"},{label:"Calendar",page:"calendar"}]; }
  else if (page === "list" && objKey) { APP.currentObj=objKey; APP.currentRec=null; APP.breadcrumbs=[{label:"Home",page:"home"},{label:OBJ[objKey].label,page:"list",obj:objKey}]; }
  else if (page === "record" && objKey && recId) { APP.currentObj=objKey; APP.currentRec=recId; var rec=findRecord(objKey,recId); var name=rec?getRecordName(rec):recId; APP.breadcrumbs=[{label:"Home",page:"home"},{label:OBJ[objKey].label,page:"list",obj:objKey},{label:name,page:"record"}]; }
  renderApp();
}

function renderBreadcrumbs() {
  var c = document.getElementById("breadcrumbs"); c.innerHTML = "";
  APP.breadcrumbs.forEach(function(bc, i) {
    if (i > 0) { var sep = document.createElement("span"); sep.textContent = " › "; sep.style.color = COLORS.subtle; c.appendChild(sep); }
    var span = document.createElement("span"); span.textContent = bc.label;
    if (i < APP.breadcrumbs.length - 1) { span.className = "bc-link"; span.onclick = (function(b) { return function() { if(b.page==="home")navigate("home"); else if(b.page==="pipeline")navigate("pipeline"); else if(b.page==="list"&&b.obj)navigate("list",b.obj); }; })(bc); }
    else { span.className = "bc-current"; }
    c.appendChild(span);
  });
}

function setupTopBar() {
  document.getElementById("logo").onclick = function() { navigate("home"); };
  document.getElementById("nav-home").onclick = function() { navigate("home"); };
  document.getElementById("nav-pipeline").onclick = function() { navigate("pipeline"); };
  document.getElementById("nav-calendar").onclick = function() { navigate("calendar"); };
  setupObjectsDropdown();
  setupSearch();
  setupQuickCreate();
}

function updateNavPills() {
  document.getElementById("nav-home").className = "topbar-pill" + (APP.page==="home"?" active":"");
  document.getElementById("nav-pipeline").className = "topbar-pill" + (APP.page==="pipeline"?" active":"");
  document.getElementById("nav-calendar").className = "topbar-pill" + (APP.page==="calendar"?" active":"");
}

function setupObjectsDropdown() {
  var btn = document.getElementById("menu-btn"), dd = document.getElementById("menu-dropdown");
  dd.innerHTML = "";
  Object.keys(OBJ).forEach(function(key) {
    var obj = OBJ[key];
    var item = document.createElement("button"); item.className = "dropdown-item";
    item.innerHTML = renderObjIcon(key,15,COLORS.text2) + '<span style="font-weight:500;flex:1">' + obj.label + '</span><span style="font-size:10px;color:' + COLORS.muted + '">' + obj.data.length + '</span>';
    item.onclick = function() { dd.style.display="none"; navigate("list",key); };
    dd.appendChild(item);
  });
  btn.onclick = function(e) { e.stopPropagation(); dd.style.display = dd.style.display==="none"?"block":"none"; };
  document.addEventListener("click", function(e) { if (!btn.contains(e.target) && !dd.contains(e.target)) dd.style.display="none"; });
}

function setupSearch() {
  var wrapper=document.getElementById("search-wrapper"), icon=document.getElementById("search-icon"), input=document.getElementById("search-input"), results=document.getElementById("search-results");
  var isOpen = false;
  icon.onclick = function() { isOpen=!isOpen; wrapper.className="search-wrapper "+(isOpen?"open":"closed"); if(isOpen){input.style.display="block";input.focus();}else{input.style.display="none";input.value="";results.style.display="none";} };
  input.oninput = function() { var q=input.value.toLowerCase(); results.innerHTML=""; if(q.length<2){results.style.display="none";return;}
    var hits=[]; Object.keys(OBJ).forEach(function(key){var obj=OBJ[key];obj.data.forEach(function(rec){if(hits.length>=8)return;if(Object.values(rec).some(function(v){return String(v).toLowerCase().indexOf(q)>=0;}))hits.push({objKey:key,record:rec,objLabel:obj.label});});});
    if(!hits.length){results.style.display="none";return;} results.style.display="block";
    hits.forEach(function(hit){var item=document.createElement("button");item.className="dropdown-item";item.innerHTML=renderObjIcon(hit.objKey,14,COLORS.text2)+'<div><div style="font-weight:600;font-size:12px">'+getRecordName(hit.record)+'</div><div style="font-size:10px;color:'+COLORS.muted+'">'+hit.objLabel+'</div></div>';
      item.onclick=function(){navigate("record",hit.objKey,hit.record.id);input.value="";results.style.display="none";isOpen=false;wrapper.className="search-wrapper closed";input.style.display="none";};results.appendChild(item);});
  };
  input.onblur = function() { setTimeout(function() { if(!input.value){isOpen=false;wrapper.className="search-wrapper closed";input.style.display="none";results.style.display="none";} },200); };
}

function setupQuickCreate() {
  var btn=document.getElementById("create-btn"), dd=document.getElementById("create-dropdown");
  dd.innerHTML="";
  QUICK_CREATE.forEach(function(key) {
    var obj=OBJ[key]; var singular=obj.label.replace(/s$/,""); var item=document.createElement("button"); item.className="dropdown-item";
    item.innerHTML = renderObjIcon(key,14,COLORS.text2) + "New " + singular;
    item.onclick = function() { dd.style.display="none"; showToast("Create "+singular+" — coming soon","info"); };
    dd.appendChild(item);
  });
  btn.onclick = function(e) { e.stopPropagation(); dd.style.display=dd.style.display==="none"?"block":"none"; };
  document.addEventListener("click", function(e) { if(!btn.contains(e.target)&&!dd.contains(e.target))dd.style.display="none"; });
}
