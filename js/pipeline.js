// ============================================================
// MICKACRM 360 v3 — PIPELINE.JS — Kanban
// ============================================================
var pipelineState = { opps:null, draggedId:null };

function renderPipeline() {
  if (!pipelineState.opps) pipelineState.opps = OPPORTUNITIES.map(function(o){return Object.assign({},o);});
  var container = document.getElementById("main-content");
  var opps = pipelineState.opps;
  var html = '<div class="kanban" style="animation:fadeSlide .2s ease">';
  STAGES.forEach(function(st) {
    var so = opps.filter(function(o){return o.stage===st.key;}); var total = so.reduce(function(s,o){return s+o.amountNum;},0);
    html += '<div class="kanban-col" data-stage="' + st.key + '">';
    html += '<div style="margin-bottom:10px"><div style="display:flex;align-items:center;gap:5px;margin-bottom:3px"><div style="width:7px;height:7px;border-radius:50%;background:' + st.color + '"></div><span style="font-size:11px;font-weight:600;color:var(--text)">' + st.short + '</span><span style="font-size:10px;color:var(--muted);margin-left:auto">' + so.length + '</span></div><div style="font-size:10px;color:var(--muted)">' + total + 'M€</div></div>';
    html += '<div style="display:flex;flex-direction:column;gap:8px;flex:1">';
    so.forEach(function(opp) {
      html += '<div class="kanban-card" draggable="true" data-opp-id="' + opp.id + '">';
      html += '<div style="font-size:12px;font-weight:600;color:var(--text);margin-bottom:4px;line-height:1.3">' + opp.name + '</div>';
      html += '<div style="font-size:10.5px;color:var(--muted);margin-bottom:6px">' + opp.accountName + '</div>';
      html += '<div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:13px;font-weight:700;color:var(--text)">' + opp.amount + '</span><span style="font-size:9px;color:var(--muted);background:var(--bg);padding:2px 6px;border-radius:4px;font-weight:500">' + opp.probability + '%</span></div>';
      html += '</div>';
    });
    html += '</div></div>';
  });
  html += '</div>';
  container.innerHTML = html;

  container.querySelectorAll(".kanban-card[draggable]").forEach(function(card) {
    card.ondragstart = function() { pipelineState.draggedId = card.getAttribute("data-opp-id"); card.style.opacity = "0.5"; };
    card.ondragend = function() { card.style.opacity = "1"; };
    card.onclick = function() { navigate("record","opportunities",card.getAttribute("data-opp-id")); };
  });
  container.querySelectorAll(".kanban-col[data-stage]").forEach(function(col) {
    col.ondragover = function(e) { e.preventDefault(); col.style.background = "rgba(37,99,235,0.04)"; };
    col.ondragleave = function() { col.style.background = "var(--bg)"; };
    col.ondrop = function(e) { e.preventDefault(); col.style.background = "var(--bg)";
      var newStage = col.getAttribute("data-stage");
      if (pipelineState.draggedId && newStage) { pipelineState.opps = pipelineState.opps.map(function(o){return o.id===pipelineState.draggedId?Object.assign({},o,{stage:newStage}):o;}); pipelineState.draggedId=null; renderPipeline(); }
    };
  });
}
