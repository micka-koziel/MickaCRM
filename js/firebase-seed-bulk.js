/* ═══════════════════════════════════════════════════════
   firebase-seed-bulk.js — One-time bulk seed script
   
   HOW TO USE:
   1. Add <script src="js/firebase-seed-bulk.js"></script> 
      at the END of index.html (after app.js)
   2. Load the page once → check console for progress
   3. REMOVE the script tag after seeding
   
   This adds ~50+ records per object ON TOP of existing data.
   Safe to run once — uses unique IDs that won't collide.
   ═══════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* Wait for Firebase to be ready */
  if (typeof firebase === 'undefined' || typeof fbDB === 'undefined') {
    console.error('[Seed] Firebase not ready. Make sure this loads after firebase-crud.js');
    return;
  }

  console.log('[Seed] Starting bulk seed...');

  /* ── Helpers ──────────────────────────────────────── */
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function randAmount(min, max) { return Math.round((Math.random() * (max - min) + min) / 100000) * 100000; }
  function futureDate(minDays, maxDays) {
    var d = new Date();
    d.setDate(d.getDate() + randInt(minDays, maxDays));
    return d.toISOString().split('T')[0];
  }
  function pastDate(minDays, maxDays) {
    var d = new Date();
    d.setDate(d.getDate() - randInt(minDays, maxDays));
    return d.toISOString().split('T')[0];
  }

  /* ── Reference Data ──────────────────────────────── */
  var cities = ['Paris','Lyon','Marseille','Toulouse','Bordeaux','Nantes','Strasbourg','Lille','Nice','Rennes','Montpellier','Grenoble','Rouen','Toulon','Clermont-Ferrand','Dijon','Angers','Reims','Le Havre','Metz'];
  var industries = ['General Contractor','Civil Engineering','Real Estate Developer','Road & Rail','Foundations & Piling','Electrical & HVAC','Building Materials','Engineering Consultancy'];
  var roles = ['CEO / Managing Director','Project Director','Project Manager','Site Manager','Procurement Manager','Design Engineer','Sales Manager','Technical Director','HSE Manager','BIM Manager'];
  var stages_opp = ['lead','study','tender','proposal','negotiation','closed_won','launched'];
  var stages_lead = ['new','contacted','qualified','proposal','converted'];
  var stages_project = ['prestudy','tender','contracting','construction','delivered'];
  var sources = ['Website','Trade Show','Referral','Cold Call','LinkedIn','Existing Client','Partner','Tender Platform'];
  var priorities = ['High','Medium','Low'];
  var health = ['Healthy','Healthy','Healthy','Attention','At Risk'];
  var claimStatuses = ['Open','Investigation','Negotiation','Resolved','Closed'];
  var claimCategories = ['Supply Chain','Quality','Logistics','Safety','Contractual','Other'];
  var activityTypes = ['Call','Meeting','Site Visit','Email'];
  var activityStatuses = ['Planned','In Progress','Completed'];
  var quoteStages = ['Draft','Internal Review','Sent','Negotiation','Accepted'];
  var products = [
    'SG Cool-Lite SKN 176','SG Planitherm Ultra N','SG Stadip Protect','SG Climalit Plus',
    'Isover Multimax 30','Isover Vario KM Duplex','Isover GR32','Isover Optima',
    'Weber Joint Flex','Weber Prim RP','Weber Floor 4150','Weber Therm XM',
    'Placo Placoplatre BA13','Placo Habito','PAM Saint-Gobain Pipes','Sekurit Windshields'
  ];

  var firstNames = ['Jean','Pierre','Marc','Thomas','François','Nicolas','Philippe','Laurent','Julien','Antoine','Sébastien','Christophe','Olivier','David','Stéphane','Alexandre','Maxime','Guillaume','Vincent','Benoît','Sophie','Marie','Isabelle','Catherine','Anne','Nathalie','Caroline','Céline','Sandrine','Valérie','Aurélie','Claire','Élise','Laura','Camille','Léa','Julie','Margaux','Émilie','Charlotte'];
  var lastNames = ['Martin','Bernard','Dubois','Thomas','Robert','Richard','Petit','Durand','Leroy','Moreau','Simon','Laurent','Lefèvre','Michel','Garcia','David','Bertrand','Roux','Vincent','Fournier','Morel','Girard','André','Mercier','Dupont','Lambert','Bonnet','François','Martinez','Legrand'];

  var companyPrefixes = ['Bouygues','Vinci','Eiffage','Spie','Colas','NGE','Demathieu Bard','Razel-Bec','Fayat','Léon Grosse','Sogea','GCC','Chantiers Modernes','Quille','Pertuy','Screg','Eurovia','GTM','Dodin Campenon','Campenon Bernard','Soletanche Bachy','Implenia','BAM','Besix','Strabag','Salini','Hochtief','Skanska','Kier','Wates','Laing O\'Rourke','Balfour Beatty','Mace','Multiplex','Lendlease'];
  var companySuffixes = ['Construction','Immobilier','Génie Civil','Bâtiment','TP','Fondations','Environnement','Énergie','Habitat','Rénovation','Infrastructure'];

  var projectNames = [
    'Grand Paris Express – Lot ','Tour Montparnasse Rénovation','Gare Saint-Lazare Modernization',
    'Lyon Part-Dieu Tower','Euratlantique – Phase ','Bordeaux Métropole Arena',
    'CHU Toulouse Extension','Campus Condorcet – Bldg ','EuropaCity – Retail Wing',
    'Nantes CHU – New Wing','Data Center Lyon-Est','Marseille Waterfront Offices',
    'A69 Highway – Section ','Tramway T9 Extension','RER E – Éole Stations',
    'Seine Musicale Phase 2','La Défense – Tower ','Parc des Expositions Villepinte',
    'Stadium Décines Extension','Nice Eco-Vallée – Block ','Rennes Metro Line B – Station ',
    'Montpellier TGV Hub','Grenoble Presqu\'île Science','Strasbourg EU Quarter Renovation',
    'Saclay Innovation Park – Bldg ','Toulouse Aerospace Campus','Angers Smart City Hub',
    'Le Havre Port Extension','Dijon Food Valley','Reims Arena Complex',
    'Clermont Biotech Campus','Toulon Naval Base Upgrade','Rouen Flaubert Eco-Quarter',
    'Lille Grand Stade Annex','Metz Pompidou Extension','Solar Farm Provence',
    'Wind Farm Normandy Coast','Hydro Dam Isère Upgrade','Rail Tunnel Alpine Phase ',
    'Hospital Robert Debré Extension','University Paris-Saclay Lab','Metro Line 15 – Station ',
    'Airport CDG – Terminal ','Port Marseille Fos – Quay ','Highway A10 Widening – Sector ',
    'Bridge Pont de Normandie Repair','Nuclear Plant Flamanville Support','LGV Sud-Ouest – Section '
  ];

  /* ── Generate Accounts ───────────────────────────── */
  var newAccounts = [];
  for (var ai = 0; ai < 45; ai++) {
    var id = 'a' + (100 + ai);
    newAccounts.push({
      id: id,
      name: pick(companyPrefixes) + ' ' + pick(companySuffixes),
      industry: pick(industries),
      city: pick(cities),
      pipeline: randAmount(0, 80000000),
      opps: randInt(0, 6),
      status: Math.random() > 0.25 ? 'Active' : 'Prospect'
    });
  }

  /* ── Generate Contacts ───────────────────────────── */
  var allAccountIds = ['a1','a2','a3','a4','a5','a6','a7','a8'].concat(newAccounts.map(function(a){return a.id;}));
  var newContacts = [];
  for (var ci = 0; ci < 55; ci++) {
    var cid = 'c' + (100 + ci);
    var fn = pick(firstNames);
    var ln = pick(lastNames);
    newContacts.push({
      id: cid,
      name: fn + ' ' + ln,
      account: pick(allAccountIds),
      role: pick(roles),
      email: (fn.charAt(0) + '.' + ln).toLowerCase().replace(/[éèê]/g,'e').replace(/[àâ]/g,'a').replace(/[ùû]/g,'u').replace(/[ôö]/g,'o').replace(/[îï]/g,'i').replace(/[ç]/g,'c') + '@' + pick(['bouygues.fr','vinci.com','eiffage.com','spie.com','colas.com','nge.fr','demathieu-bard.fr','fayat.com','implenia.com','strabag.com','hochtief.com','skanska.com','company.fr']),
      phone: '+33 6 ' + randInt(10,99) + ' ' + randInt(10,99) + ' ' + randInt(10,99) + ' ' + randInt(10,99)
    });
  }

  /* ── Generate Opportunities ──────────────────────── */
  var newOpps = [];
  for (var oi = 0; oi < 50; oi++) {
    var oid = 'o' + (100 + oi);
    var stage = pick(stages_opp);
    var probMap = {lead:15,study:25,tender:35,proposal:50,negotiation:70,closed_won:100,launched:100};
    newOpps.push({
      id: oid,
      name: pick(projectNames) + (Math.random()>0.5 ? randInt(2,12) : ''),
      account: pick(allAccountIds),
      amount: randAmount(500000, 65000000),
      prob: probMap[stage] + randInt(-10, 10),
      stage: stage,
      close: futureDate(30, 540)
    });
  }

  /* ── Generate Leads ──────────────────────────────── */
  var newLeads = [];
  for (var li = 0; li < 50; li++) {
    var lid = 'l' + (100 + li);
    newLeads.push({
      id: lid,
      name: pick(companyPrefixes) + ' – ' + pick(['Warehouse','Office Tower','Hospital Wing','School Complex','Retail Park','Logistics Hub','Residential Block','Underground Parking','Sports Arena','Data Center','Lab Building','Renovation','Extension','Facade Upgrade','Bridge Repair']),
      account: pick(allAccountIds),
      stage: pick(stages_lead),
      source: pick(sources),
      estimatedValue: randAmount(1000000, 40000000),
      priority: pick(priorities)
    });
  }

  /* ── Generate Projects ───────────────────────────── */
  var newProjects = [];
  for (var pi = 0; pi < 40; pi++) {
    var pid = 'p' + (100 + pi);
    var phase = pick(stages_project);
    var phaseLabelMap = {prestudy:'Pre-study',tender:'Tender',contracting:'Contracting',construction:'Construction',delivered:'Delivered'};
    var val = randAmount(2000000, 55000000);
    var accId = pick(allAccountIds);
    var ownerName = pick(firstNames) + ' ' + pick(lastNames);
    newProjects.push({
      id: pid,
      name: pick(projectNames) + (Math.random()>0.4 ? randInt(2,9) : ''),
      phase: phaseLabelMap[phase] || phase,
      stage: phase,
      account: accId,
      value: val,
      budget: val,
      start: pastDate(180, 720),
      end: futureDate(90, 900),
      startDate: pastDate(180, 720),
      expectedDelivery: futureDate(90, 900),
      health: pick(health),
      owner: ownerName,
      commercialLead: pick(firstNames) + ' ' + pick(lastNames),
      technicalLead: pick(firstNames) + ' ' + pick(lastNames),
      source: pick(sources),
      createdDate: pastDate(200, 800),
      description: 'Saint-Gobain materials supply for ' + pick(['glazing','insulation','facade','structural glass','thermal solutions','pipes','plasterboard','exterior cladding','roofing','flooring']) + ' package.',
      siteVisits: [],
      claims: [],
      documents: [
        {name:'Project_Charter.pdf',type:'PDF',date:pastDate(60,300),size:randInt(1,8)+'.'+randInt(1,9)+' MB'},
        {name:'Technical_Specs.pdf',type:'PDF',date:pastDate(30,200),size:randInt(2,12)+'.'+randInt(1,9)+' MB'}
      ]
    });
  }

  /* ── Generate Quotes ─────────────────────────────── */
  var allOppIds = ['o1','o2','o3','o4','o5','o6','o7','o8'].concat(newOpps.map(function(o){return o.id;}));
  var newQuotes = [];
  for (var qi = 0; qi < 45; qi++) {
    var qid = 'q' + (100 + qi);
    var qval = randAmount(200000, 12000000);
    var disc = pick([0,0,3,5,5,8,10]);
    var oppId = pick(allOppIds);
    var qAccId = pick(allAccountIds);
    var qAccName = '';
    var found = newAccounts.find(function(a){return a.id===qAccId;});
    qAccName = found ? found.name : pick(companyPrefixes) + ' ' + pick(companySuffixes);

    var numItems = randInt(2, 5);
    var lineItems = [];
    var runningTotal = 0;
    for (var ii = 0; ii < numItems; ii++) {
      var prod = pick(products);
      var qty = randInt(100, 8000);
      var unit = pick(['m²','m²','kg','unit','ml']);
      var up = randInt(20, 1200);
      var tot = qty * up;
      runningTotal += tot;
      lineItems.push({product:prod,qty:qty,unit:unit,unitPrice:up,total:tot});
    }

    newQuotes.push({
      id: qid,
      name: pick(projectNames).split(' – ')[0] + ' — ' + pick(['Glazing Package','Insulation Bundle','Facade Kit','Thermal Solution','Plasterboard Supply','Pipe Network','Floor System','Roofing Package']),
      opportunityId: oppId,
      opportunity: pick(projectNames),
      accountId: qAccId,
      accountName: qAccName,
      contact: pick(firstNames) + ' ' + pick(lastNames),
      contactRole: pick(roles),
      stage: pick(quoteStages),
      value: runningTotal,
      netValue: Math.round(runningTotal * (1 - disc/100)),
      discount: disc,
      margin: randInt(12, 30),
      revision: randInt(1, 4),
      validUntil: futureDate(30, 180),
      createdDate: pastDate(10, 180),
      createdBy: pick(firstNames) + ' ' + pick(lastNames),
      lastModified: pastDate(1, 30),
      paymentTerms: pick(['Net 30','Net 45','Net 60','Net 90']),
      deliveryTerms: pick(['DDP Site','Ex Works','FOB','CIF']),
      lineItems: lineItems,
      revisions: [{name:'v1 — Initial proposal',status:'Current',value:runningTotal,date:pastDate(10,120),note:'First submission'}],
      activities: [],
      documents: [{name:'Quote_'+qid+'.pdf',type:'PDF',date:pastDate(5,60),size:randInt(1,3)+'.'+randInt(1,9)+' MB'}]
    });
  }

  /* ── Generate Claims ─────────────────────────────── */
  var allProjectIds = ['p1','p2','p3'].concat(newProjects.map(function(p){return p.id;}));
  var claimTitles = [
    'Delivery delay — Glass batch','Damaged panels on arrival','Wrong specification delivered',
    'Missing insulation rolls','Cracked glazing units','Late shipment — pipes','Color mismatch — facade panels',
    'Moisture damage in transit','Undersized steel beams','Incorrect plasterboard grade',
    'Installation defect — joints','Water infiltration — roof panels','Thermal performance below spec',
    'Adhesive failure — cladding','Surface scratch — glass','Short delivery — 200m² missing',
    'Wrong thickness — insulation','Broken pallets on arrival','Certificate mismatch','Billing discrepancy',
    'Site access delay — supplier fault','Non-conformance report — welds','Paint peeling — 3 months post-install',
    'Acoustic performance below spec','Fire rating documentation missing'
  ];
  var newClaims = [];
  for (var cli = 0; cli < 35; cli++) {
    var clid = 'clm' + (100 + cli);
    var projId = pick(allProjectIds);
    var clAccId = pick(allAccountIds);
    newClaims.push({
      id: clid,
      title: pick(claimTitles) + ' #' + randInt(1,99),
      name: pick(claimTitles) + ' #' + randInt(1,99),
      projectId: projId,
      projectName: pick(projectNames).split(' – ')[0],
      accountId: clAccId,
      accountName: (newAccounts.find(function(a){return a.id===clAccId;}) || {name:pick(companyPrefixes)+' '+pick(companySuffixes)}).name,
      status: pick(claimStatuses),
      stage: pick(claimStatuses),
      priority: pick(priorities),
      riskLevel: pick(priorities),
      impactValue: randAmount(10000, 2000000),
      category: pick(claimCategories),
      owner: pick(firstNames) + ' ' + pick(lastNames),
      reportedDate: pastDate(5, 300),
      date: pastDate(5, 300),
      description: 'Claim related to ' + pick(['delivery','quality','installation','documentation','billing','logistics']) + ' issue on project materials.',
      rootCause: pick(['Supplier error','Transport damage','Specification change','Manufacturing defect','Human error','Weather conditions','Communication gap']),
      timeline: [
        {date:pastDate(5,200),event:'Claim reported',user:pick(firstNames)+' '+pick(lastNames)},
        {date:pastDate(1,100),event:'Investigation started',user:pick(firstNames)+' '+pick(lastNames)}
      ],
      tasks: [],
      documents: []
    });
  }

  /* ── Generate Activities ─────────────────────────── */
  var allContactIds = ['c1','c2','c3','c4','c5'].concat(newContacts.map(function(c){return c.id;}));
  var actSubjects = [
    'Quarterly business review','Technical deep-dive','Pricing discussion','Project kickoff',
    'Site progress inspection','Material selection meeting','Budget review call','Contract negotiation',
    'Post-delivery follow-up','Scope change discussion','Risk assessment review','Design validation',
    'Supplier performance review','Quality audit','Safety walkthrough','BIM coordination',
    'Stakeholder alignment','Tender preparation','Pre-qualification meeting','Warranty review',
    'Energy performance review','Sustainability assessment','Change order discussion','Punch list review',
    'Commissioning support','Handover preparation','Annual account review','New product presentation',
    'Competitive analysis debrief','Market update briefing','Innovation workshop','Digital twin demo'
  ];
  var locations = ['Microsoft Teams','Google Meet','Client HQ','Saint-Gobain Offices — La Défense','On-site','Zoom','Client factory','Trade show booth','Restaurant','Phone'];

  var newActivities = [];
  for (var ati = 0; ati < 55; ati++) {
    var atid = 'act' + (100 + ati);
    var type = pick(activityTypes);
    var status = pick(activityStatuses);
    var accId = pick(allAccountIds);
    var contId = pick(allContactIds);
    var contName = pick(firstNames) + ' ' + pick(lastNames);
    var contRole = pick(roles);
    var oppId = Math.random() > 0.3 ? pick(allOppIds) : null;
    var projId = Math.random() > 0.5 ? pick(allProjectIds) : null;
    var isUpcoming = Math.random() > 0.4;
    var actDate = isUpcoming ? futureDate(1, 90) : pastDate(1, 180);

    var act = {
      id: atid,
      type: type,
      subject: pick(actSubjects) + ' — ' + pick(companyPrefixes),
      date: actDate,
      time: pick(['08:00','08:30','09:00','09:30','10:00','10:30','11:00','13:00','14:00','14:30','15:00','16:00','17:00']),
      duration: type === 'Email' ? null : pick([30,30,45,60,60,90,120,180,240]),
      status: status,
      accountId: accId,
      accountName: (newAccounts.find(function(a){return a.id===accId;}) || {name:pick(companyPrefixes)+' '+pick(companySuffixes)}).name,
      contactId: contId,
      contact: contName,
      contactRole: contRole,
      owner: pick(['Me',pick(firstNames)+' '+pick(lastNames)]),
      location: type === 'Site Visit' ? 'On-site — ' + pick(cities) : (type === 'Email' ? null : pick(locations)),
      createdDate: pastDate(1, 200),
      purpose: 'Discuss ' + pick(['pricing','technical specs','delivery timeline','project scope','material selection','contract terms','quality issues','next steps','partnership opportunities','budget allocation']) + '.',
      outcome: status === 'Completed' ? pick(['Positive outcome. Next steps defined.','Agreement reached on main terms.','Additional info requested by client.','Follow-up meeting scheduled.','Quote revision needed.','Scope confirmed, moving to next phase.','Minor issues raised, to be resolved.','Deal progressing well.']) : '',
      participants: [
        {name:contName,company:pick(companyPrefixes),role:contRole,contactId:contId},
        {name:pick(firstNames)+' '+pick(lastNames),company:'Saint-Gobain',role:pick(['Key Account Manager','Technical Specialist','Business Development','Sales Director'])}
      ],
      notes: status === 'Completed' ? [{date:actDate,author:'Me',text:pick(['Good discussion. Client engaged.','Need to follow up on open items.','Competitor mentioned — need to strengthen our offer.','Client budget confirmed.','Technical validation passed.','Decision expected within 2 weeks.'])}] : [],
      tasks: [],
      documents: []
    };
    if (oppId) { act.opportunityId = oppId; act.opportunityName = pick(projectNames); }
    if (projId) { act.projectId = projId; act.projectName = pick(projectNames).split(' – ')[0]; }

    newActivities.push(act);
  }

  /* ═══════════════════════════════════════════════════════
     WRITE TO FIRESTORE — Batch writes (max 500 per batch)
     ═══════════════════════════════════════════════════════ */

  function writeBatch(collectionKey, records) {
    // Split into chunks of 450 (Firestore limit is 500 per batch)
    var chunks = [];
    for (var i = 0; i < records.length; i += 450) {
      chunks.push(records.slice(i, i + 450));
    }

    var chain = Promise.resolve();
    chunks.forEach(function(chunk, idx) {
      chain = chain.then(function() {
        var batch = fbDB.batch();
        chunk.forEach(function(rec) {
          var cleanRec = {};
          Object.keys(rec).forEach(function(k) {
            if (rec[k] !== undefined && rec[k] !== null) cleanRec[k] = rec[k];
          });
          var ref = fbDB.collection(collectionKey).doc(rec.id);
          batch.set(ref, cleanRec);
        });
        return batch.commit().then(function() {
          console.log('[Seed] ' + collectionKey + ' batch ' + (idx+1) + '/' + chunks.length + ' — ' + chunk.length + ' docs');
        });
      });
    });
    return chain;
  }

  /* Also push into window.DATA so the UI refreshes */
  function pushToWindowData(key, records) {
    if (!window.DATA[key]) window.DATA[key] = [];
    records.forEach(function(r) { window.DATA[key].push(r); });
  }

  /* ── Execute ─────────────────────────────────────── */
  var t0 = Date.now();

  writeBatch('accounts', newAccounts)
    .then(function() { pushToWindowData('accounts', newAccounts); return writeBatch('contacts', newContacts); })
    .then(function() { pushToWindowData('contacts', newContacts); return writeBatch('opportunities', newOpps); })
    .then(function() { pushToWindowData('opportunities', newOpps); return writeBatch('leads', newLeads); })
    .then(function() { pushToWindowData('leads', newLeads); return writeBatch('projects', newProjects); })
    .then(function() { pushToWindowData('projects', newProjects); return writeBatch('quotes', newQuotes); })
    .then(function() { pushToWindowData('quotes', newQuotes); return writeBatch('claims', newClaims); })
    .then(function() { pushToWindowData('claims', newClaims); return writeBatch('activities', newActivities); })
    .then(function() {
      pushToWindowData('activities', newActivities);
      var elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      var total = newAccounts.length + newContacts.length + newOpps.length + newLeads.length + newProjects.length + newQuotes.length + newClaims.length + newActivities.length;
      console.log('[Seed] ✓ DONE — ' + total + ' records seeded in ' + elapsed + 's');
      console.log('[Seed] Accounts: +' + newAccounts.length + ' | Contacts: +' + newContacts.length + ' | Opps: +' + newOpps.length + ' | Leads: +' + newLeads.length);
      console.log('[Seed] Projects: +' + newProjects.length + ' | Quotes: +' + newQuotes.length + ' | Claims: +' + newClaims.length + ' | Activities: +' + newActivities.length);

      /* Visual toast */
      if (typeof fbShowStatus === 'function') {
        fbShowStatus('Seeded ' + total + ' records in ' + elapsed + 's');
      }

      /* Refresh the current page to show new data */
      if (typeof renderCurrentPage === 'function') {
        setTimeout(function() { renderCurrentPage(); }, 500);
      }
    })
    .catch(function(err) {
      console.error('[Seed] ERROR:', err);
      if (typeof fbShowStatus === 'function') {
        fbShowStatus('Seed error — check console', true);
      }
    });

})();
