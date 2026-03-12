// ============================================================
// MICKACRM 360 — PIPELINE.JS
// Pipeline Kanban View with drag & drop
// ============================================================

var pipelineState = {
  opps: null, // local copy for drag & drop
  draggedId: null,
};

function renderPipeline() {
  // Init local copy
  if (!pipelineState.opps) {
    pipelineState.opps = OPPORTUNITIES.map(function(o) { return Object.assign({}, o); });
  }

  var container = document.getElementById("main-content");
  var opps = pipelineState.opps;

  var html = '<div class="kanban anim-fade-slide">';

  STAGES.forEach(function(st) {
    var stageOpps = opps.filter(function(o) { return o.stage === st.key; });
    var total = stageOpps.reduce(function(s, o) { return s + o.amountNum; }, 0);

    html += '<div class="kanban-col" data-stage="' + st.key + '">';

    // Column header
    html += '<div class="kanban-col-header">';
    html += '<div class="kanban-col-stage">';
    html += '<div class="kanban-col-dot" style="background:' + st.color + '"></div>';
    html += '<span class="kanban-col-name">' + st.short + '</span>';
    html += '<span class="kanban-col-count">' + stageOpps.length + '</span>';
    html += '</div>';
    html += '<div class="kanban-col-total">' + total + 'M€</div>';
    html += '</div>';

    // Cards
    html += '<div class="kanban-cards">';
    stageOpps.forEach(function(opp) {
      html += '<div class="kanban-card" draggable="true" data-opp-id="' + opp.id + '">';
      html += '<div class="opp-name">' + opp.name + '</div>';
      html += '<div class="opp-account">' + opp.accountName + '</div>';
      html += '<div class="opp-footer">';
      html += '<span class="opp-amount">' + opp.amount + '</span>';
      html += '<span class="opp-proba">' + opp.probability + '%</span>';
      html += '</div></div>';
    });
    html += '</div></div>';
  });

  html += '</div>';
  container.innerHTML = html;

  // ─── Bind drag & drop ───
  var cards = container.querySelectorAll(".kanban-card[draggable]");
  cards.forEach(function(card) {
    card.ondragstart = function(e) {
      pipelineState.draggedId = card.getAttribute("data-opp-id");
      card.style.opacity = "0.5";
    };
    card.ondragend = function() {
      card.style.opacity = "1";
    };
    card.onclick = function() {
      navigate("record", "opportunities", card.getAttribute("data-opp-id"));
    };
  });

  var cols = container.querySelectorAll(".kanban-col[data-stage]");
  cols.forEach(function(col) {
    col.ondragover = function(e) {
      e.preventDefault();
      col.style.background = "rgba(1,149,214,0.06)";
    };
    col.ondragleave = function() {
      col.style.background = "var(--bg)";
    };
    col.ondrop = function(e) {
      e.preventDefault();
      col.style.background = "var(--bg)";
      var newStage = col.getAttribute("data-stage");
      if (pipelineState.draggedId && newStage) {
        pipelineState.opps = pipelineState.opps.map(function(o) {
          if (o.id === pipelineState.draggedId) {
            return Object.assign({}, o, { stage: newStage });
          }
          return o;
        });
        pipelineState.draggedId = null;
        renderPipeline();
      }
    };
  });
}
