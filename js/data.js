/* data.js — Mock Data (10 per object, BTP/Construction sector) */
window.DATA = {
  accounts: [
    {id:'a1',name:'Bouygues Construction',industry:'General Contractor',city:'Paris',pipeline:109500000,opps:3,status:'Active',keyRelationship:true},
    {id:'a2',name:'Vinci Immobilier',industry:'Real Estate Developer',city:'Nanterre',pipeline:12000000,opps:1,status:'Active',keyRelationship:true},
    {id:'a3',name:'Eiffage Génie Civil',industry:'Civil Engineering',city:'Vélizy',pipeline:23000000,opps:1,status:'Active',keyRelationship:true},
    {id:'a4',name:'Spie Batignolles',industry:'General Contractor',city:'Neuilly-sur-Seine',pipeline:19000000,opps:1,status:'Active'},
    {id:'a5',name:'Colas Group',industry:'Road & Rail',city:'Boulogne',pipeline:32000000,opps:1,status:'Active'},
    {id:'a6',name:'NGE Fondations',industry:'Foundations & Piling',city:'Lyon',pipeline:0,opps:0,status:'Prospect'},
    {id:'a7',name:'Demathieu Bard',industry:'General Contractor',city:'Metz',pipeline:22000000,opps:1,status:'Active'},
    {id:'a8',name:'Razel-Bec',industry:'Civil Engineering',city:'Saclay',pipeline:0,opps:0,status:'Prospect'},
    {id:'a9',name:'Implenia TP',industry:'Building Materials',city:'Lille',pipeline:14000000,opps:1,status:'Active'},
    {id:'a10',name:'Soletanche Bachy',industry:'Foundations & Piling',city:'Nice',pipeline:18000000,opps:1,status:'Active'}
  ],
  contacts: [
    {id:'c1',name:'Jean-Pierre Martin',account:'a1',role:'Directeur Travaux',email:'jp.martin@bouygues.fr',phone:'+33 6 12 34 56 78',keyRelationship:true},
    {id:'c2',name:'Sophie Durand',account:'a2',role:'Chef de Projet',email:'s.durand@vinci.com',phone:'+33 6 23 45 67 89',keyRelationship:true},
    {id:'c3',name:'Marc Lefèvre',account:'a3',role:'Responsable Achats',email:'m.lefevre@eiffage.com',phone:'+33 6 34 56 78 90',keyRelationship:true},
    {id:'c4',name:'Isabelle Moreau',account:'a4',role:'DG Adjoint',email:'i.moreau@spie.com',phone:'+33 6 45 67 89 01'},
    {id:'c5',name:'Thomas Girard',account:'a5',role:'Ingénieur Études',email:'t.girard@colas.com',phone:'+33 6 56 78 90 12'},
    {id:'c6',name:'Claire Rousseau',account:'a6',role:'Directrice Commerciale',email:'c.rousseau@nge.fr',phone:'+33 6 67 89 01 23'},
    {id:'c7',name:'Antoine Mercier',account:'a7',role:'Chef de Chantier',email:'a.mercier@demathieu.com',phone:'+33 6 78 90 12 34'},
    {id:'c8',name:'Nathalie Petit',account:'a8',role:'Responsable Technique',email:'n.petit@razel-bec.com',phone:'+33 6 89 01 23 45'},
    {id:'c9',name:'Christophe Martinez',account:'a9',role:'Directeur Projets',email:'c.martinez@implenia.com',phone:'+33 6 90 12 34 56'},
    {id:'c10',name:'Émilie Faure',account:'a10',role:'Ingénieure Structures',email:'e.faure@soletanche.com',phone:'+33 6 01 23 45 67'}
  ],
  opportunities: [
    {id:'o1',name:'Grand Paris Express – Lot 7',account:'a1',amount:45000000,prob:70,stage:'negotiation',close:'2026-06-15'},
    {id:'o2',name:'Tour Triangle – Fondations',account:'a2',amount:12000000,prob:45,stage:'proposal',close:'2026-08-01',projectId:'p3'},
    {id:'o3',name:'A69 Highway – Section 2',account:'a5',amount:32000000,prob:30,stage:'tender',close:'2026-12-01'},
    {id:'o4',name:'Gare du Nord Renovation',account:'a3',amount:23000000,prob:85,stage:'closed_won',close:'2026-03-30',projectId:'p1'},
    {id:'o5',name:'Centre Aquatique – Extension',account:'a1',amount:8500000,prob:60,stage:'study',close:'2026-09-15'},
    {id:'o6',name:'Flaubert Bridge Phase 2',account:'a7',amount:22000000,prob:25,stage:'lead',close:'2027-01-01'},
    {id:'o7',name:'Data Center Marseille',account:'a1',amount:56000000,prob:55,stage:'negotiation',close:'2026-07-20'},
    {id:'o8',name:'Campus Saclay – Bldg R',account:'a4',amount:19000000,prob:40,stage:'closed_won',close:'2026-11-01',projectId:'p2'},
    {id:'o9',name:'Résidence Verte – Lille',account:'a9',amount:14000000,prob:50,stage:'proposal',close:'2026-10-15'},
    {id:'o10',name:'Port de Nice – Quai Sud',account:'a10',amount:18000000,prob:35,stage:'tender',close:'2026-11-30'}
  ],
  leads: [
    {id:'l1',name:'Vinci – Warehouse project',account:'a2',stage:'new',source:'Website',estimatedValue:15000000,priority:'High'},
    {id:'l2',name:'Eiffage – Highway extension',account:'a3',stage:'contacted',source:'Trade Show',estimatedValue:45000000,priority:'Medium'},
    {id:'l3',name:'Spie – Underground parking',account:'a4',stage:'qualified',source:'Referral',estimatedValue:8000000,priority:'High'},
    {id:'l4',name:'Bouygues – Tech campus',account:'a1',stage:'new',source:'Cold Call',estimatedValue:28000000,priority:'Low'},
    {id:'l5',name:'NGE – Hospital Wing',account:'a6',stage:'new',source:'Website',estimatedValue:12000000,priority:'Medium'},
    {id:'l6',name:'Razel-Bec – Dam upgrade',account:'a8',stage:'contacted',source:'Trade Show',estimatedValue:35000000,priority:'High'},
    {id:'l7',name:'Implenia – School complex',account:'a9',stage:'qualified',source:'Referral',estimatedValue:9000000,priority:'Medium'},
    {id:'l8',name:'Soletanche – Metro Line 18',account:'a10',stage:'new',source:'Cold Call',estimatedValue:52000000,priority:'High'},
    {id:'l9',name:'Demathieu – Sports arena',account:'a7',stage:'contacted',source:'Website',estimatedValue:18000000,priority:'Low'},
    {id:'l10',name:'Colas – Solar farm',account:'a5',stage:'qualified',source:'Trade Show',estimatedValue:6000000,priority:'Medium'}
  ],
  projects: [
    {id:'p1',name:'Gare du Nord Renovation',phase:'construction',account:'a3',accountId:'a3',value:23000000,budget:23000000,start:'2025-01-15',end:'2026-12-01',startDate:'2025-01-15',expectedDelivery:'2026-12-01',health:'Healthy',owner:'Marc Lefèvre',commercialLead:'Sophie Durand',technicalLead:'Jean-Pierre Martin',clientStakeholders:['Isabelle Moreau'],source:'Tender',createdDate:'2024-11-20',description:'Complete renovation of Gare du Nord main hall — structural reinforcement, glass facade replacement, insulation upgrade.',
      siteVisits:[{date:'2025-11-28',inspector:'Jean-Pierre Martin',status:'Completed',notes:'Facade glazing alignment verified.'},{date:'2025-12-10',inspector:'Marc Lefèvre',status:'Scheduled',notes:'Mid-point structural review.'}],
      claims:[{id:'CLM-001',title:'Delivery delay — Glass batch #4',status:'Open',priority:'High',date:'2025-11-18'}],
      documents:[{name:'Project_Charter_v2.pdf',type:'PDF',date:'2025-01-20',size:'2.4 MB'},{name:'Facade_Specs.pdf',type:'PDF',date:'2025-02-15',size:'8.1 MB'}]
    },
    {id:'p2',name:'Campus Saclay – Bldg R',phase:'construction',account:'a4',accountId:'a4',value:19000000,budget:19000000,start:'2025-03-01',end:'2026-11-01',startDate:'2025-03-01',expectedDelivery:'2026-11-01',health:'Attention',owner:'Isabelle Moreau',commercialLead:'Marc Lefèvre',technicalLead:'Thomas Girard',clientStakeholders:['Sophie Durand'],source:'Referral',createdDate:'2025-01-10',description:'New research building with high-performance insulation and smart glazing.',
      siteVisits:[{date:'2025-10-15',inspector:'Thomas Girard',status:'Completed',notes:'Foundation OK. Curtain wall install greenlit.'}],
      claims:[],documents:[{name:'Proposal_Saclay.pdf',type:'PDF',date:'2025-02-01',size:'3.2 MB'}]
    },
    {id:'p3',name:'Tour Triangle – Facades',phase:'prestudy',account:'a2',accountId:'a2',value:12000000,budget:12000000,start:'2025-06-01',end:'2027-06-01',startDate:'2025-06-01',expectedDelivery:'2027-06-01',health:'Healthy',owner:'Sophie Durand',commercialLead:'Jean-Pierre Martin',technicalLead:'Marc Lefèvre',clientStakeholders:['Thomas Girard'],source:'Website',createdDate:'2025-05-10',description:'Iconic triangular tower facade — advanced glazing solutions.',
      siteVisits:[],claims:[],documents:[{name:'Feasibility_Study.pdf',type:'PDF',date:'2025-05-20',size:'1.8 MB'}]
    },
    {id:'p4',name:'A69 Highway – Materials Supply',phase:'tender',account:'a5',accountId:'a5',value:32000000,budget:32000000,start:'2026-01-01',end:'2027-12-01',startDate:'2026-01-01',expectedDelivery:'2027-12-01',health:'Healthy',owner:'Thomas Girard',commercialLead:'Sophie Durand',technicalLead:'Jean-Pierre Martin',clientStakeholders:['Thomas Girard'],source:'Tender',createdDate:'2025-09-15',description:'Road infrastructure materials for A69 highway section 2.',
      siteVisits:[],claims:[],documents:[]
    },
    {id:'p5',name:'Data Center Marseille',phase:'contracting',account:'a1',accountId:'a1',value:56000000,budget:56000000,start:'2026-03-01',end:'2028-06-01',startDate:'2026-03-01',expectedDelivery:'2028-06-01',health:'Healthy',owner:'Jean-Pierre Martin',commercialLead:'Marc Lefèvre',technicalLead:'Thomas Girard',clientStakeholders:['Jean-Pierre Martin'],source:'Referral',createdDate:'2026-01-20',description:'Cooling-optimized glazing for hyperscale data center in Marseille.',
      siteVisits:[],claims:[],documents:[]
    },
    {id:'p6',name:'Résidence Verte – Lille',phase:'prestudy',account:'a9',accountId:'a9',value:14000000,budget:14000000,start:'2026-06-01',end:'2028-01-01',startDate:'2026-06-01',expectedDelivery:'2028-01-01',health:'Healthy',owner:'Christophe Martinez',commercialLead:'Sophie Durand',technicalLead:'Marc Lefèvre',clientStakeholders:['Christophe Martinez'],source:'Website',createdDate:'2026-02-10',description:'Green residential complex with energy-efficient envelope.',
      siteVisits:[],claims:[],documents:[]
    },
    {id:'p7',name:'Port de Nice – Quai Sud',phase:'tender',account:'a10',accountId:'a10',value:18000000,budget:18000000,start:'2026-04-01',end:'2027-10-01',startDate:'2026-04-01',expectedDelivery:'2027-10-01',health:'Attention',owner:'Émilie Faure',commercialLead:'Jean-Pierre Martin',technicalLead:'Thomas Girard',clientStakeholders:['Émilie Faure'],source:'Tender',createdDate:'2026-01-05',description:'Port infrastructure reinforcement and quay extension.',
      siteVisits:[],claims:[],documents:[]
    },
    {id:'p8',name:'Flaubert Bridge Phase 2',phase:'prestudy',account:'a7',accountId:'a7',value:22000000,budget:22000000,start:'2026-09-01',end:'2028-09-01',startDate:'2026-09-01',expectedDelivery:'2028-09-01',health:'Healthy',owner:'Antoine Mercier',commercialLead:'Marc Lefèvre',technicalLead:'Jean-Pierre Martin',clientStakeholders:['Antoine Mercier'],source:'Cold Call',createdDate:'2026-03-01',description:'Second phase of Flaubert bridge construction in Rouen.',
      siteVisits:[],claims:[],documents:[]
    },
    {id:'p9',name:'Centre Aquatique Extension',phase:'prestudy',account:'a1',accountId:'a1',value:8500000,budget:8500000,start:'2026-07-01',end:'2027-09-01',startDate:'2026-07-01',expectedDelivery:'2027-09-01',health:'Healthy',owner:'Jean-Pierre Martin',commercialLead:'Sophie Durand',technicalLead:'Thomas Girard',clientStakeholders:['Jean-Pierre Martin'],source:'Website',createdDate:'2026-02-15',description:'Pool hall extension with humidity-resistant glazing.',
      siteVisits:[],claims:[],documents:[]
    },
    {id:'p10',name:'GPE Lot 7 – Glazing Works',phase:'construction',account:'a1',accountId:'a1',value:45000000,budget:45000000,start:'2025-06-01',end:'2027-06-01',startDate:'2025-06-01',expectedDelivery:'2027-06-01',health:'Attention',owner:'Jean-Pierre Martin',commercialLead:'Marc Lefèvre',technicalLead:'Thomas Girard',clientStakeholders:['Jean-Pierre Martin'],source:'Tender',createdDate:'2025-04-01',description:'Glazing and insulation package for Grand Paris Express Lot 7.',
      siteVisits:[{date:'2026-02-15',inspector:'Jean-Pierre Martin',status:'Completed',notes:'Glazing installation on schedule. Minor caulking issues on level 2.'}],
      claims:[{id:'CLM-002',title:'Humidity damage — insulation batch #12',status:'In Progress',priority:'Medium',date:'2026-02-20'}],
      documents:[{name:'GPE_Lot7_Progress.pdf',type:'PDF',date:'2026-03-01',size:'4.2 MB'}]
    }
  ],
  claims: [
    {id:'clm1',title:'Delivery delay — Glass batch #4',status:'Open',priority:'High',risk:'High',impact:450000,projectId:'p1',accountId:'a3',description:'Glass batch #4 delayed by 3 weeks, impacting facade installation schedule.'},
    {id:'clm2',title:'Humidity damage — insulation batch #12',status:'In Progress',priority:'Medium',risk:'Medium',impact:120000,projectId:'p10',accountId:'a1',description:'Water ingress during storage damaged 15% of insulation panels.'},
    {id:'clm3',title:'Cracked glazing panels – Lot B',status:'Open',priority:'High',risk:'High',impact:280000,projectId:'p2',accountId:'a4',description:'Thermal stress cracks found on 8 panels after installation.'},
    {id:'clm4',title:'Wrong spec delivered – Weber grout',status:'Resolved',priority:'Low',risk:'Low',impact:15000,projectId:'p1',accountId:'a3',description:'Weber grout delivered was wrong spec. Replaced within 48h.'},
    {id:'clm5',title:'Site access delay – Quai Sud',status:'Open',priority:'Medium',risk:'Medium',impact:90000,projectId:'p7',accountId:'a10',description:'Port authority delayed site access permits by 2 weeks.'},
    {id:'clm6',title:'Paint color mismatch – Bldg R',status:'In Progress',priority:'Low',risk:'Low',impact:25000,projectId:'p2',accountId:'a4',description:'External cladding paint color does not match approved RAL reference.'},
    {id:'clm7',title:'Missing bolts – Steel structure',status:'Resolved',priority:'Medium',risk:'Low',impact:8000,projectId:'p4',accountId:'a5',description:'Bolt delivery incomplete for steel structure connection.'},
    {id:'clm8',title:'Foundation settlement – Tower base',status:'Open',priority:'High',risk:'High',impact:600000,projectId:'p3',accountId:'a2',description:'Unexpected settlement observed at tower base. Geotechnical review required.'},
    {id:'clm9',title:'Noise complaint – Night works',status:'In Progress',priority:'Low',risk:'Low',impact:5000,projectId:'p10',accountId:'a1',description:'Residents filed noise complaint for night glazing installation works.'},
    {id:'clm10',title:'Material theft – Insulation rolls',status:'Resolved',priority:'Medium',risk:'Medium',impact:35000,projectId:'p5',accountId:'a1',description:'12 rolls of Isover insulation stolen from unsecured site storage.'}
  ],
  quotes: [
    {id:'q1',name:'GPE Lot 7 — Glazing Package',opportunityId:'o1',opportunity:'Grand Paris Express – Lot 7',accountId:'a1',accountName:'Bouygues Construction',contact:'Jean-Pierre Martin',contactRole:'Directeur Travaux',stage:'Negotiation',value:8200000,netValue:7790000,discount:5,margin:22,revision:2,validUntil:'2026-07-01',createdDate:'2026-01-15',createdBy:'Sophie Durand',lastModified:'2026-03-05',paymentTerms:'Net 60',deliveryTerms:'DDP Site',
      lineItems:[{product:'SG Cool-Lite SKN 176',qty:4200,unit:'m²',unitPrice:850,total:3570000},{product:'Isover Multimax 30',qty:6000,unit:'m²',unitPrice:420,total:2520000},{product:'Weber Joint Flex',qty:8500,unit:'kg',unitPrice:38,total:323000},{product:'Installation & Supervision',qty:1,unit:'',unitPrice:1787000,total:1787000}],
      revisions:[{name:'v2 — Revised pricing',status:'Current',value:8200000,date:'2026-03-05',note:'Adjusted after site survey'},{name:'v1 — Initial',status:'Superseded',value:8800000,date:'2026-01-15',note:'First submission'}],
      activities:[{type:'Meeting',date:'2026-03-03',contact:'Jean-Pierre Martin',desc:'Reviewed v2 pricing'},{type:'Call',date:'2026-02-20',contact:'Jean-Pierre Martin',desc:'Discussed discount structure'}],
      documents:[{name:'Quote_GPE_v2.pdf',type:'PDF',date:'2026-03-05',size:'1.2 MB'}],winProb:'70%',competitors:'2',negoNote:'5% volume discount approved'
    },
    {id:'q2',name:'Tour Triangle — Facade Solutions',opportunityId:'o2',opportunity:'Tour Triangle – Fondations',accountId:'a2',accountName:'Vinci Immobilier',contact:'Sophie Durand',contactRole:'Chef de Projet',stage:'Sent',value:3400000,netValue:3230000,discount:5,margin:18,revision:1,validUntil:'2026-08-15',createdDate:'2026-02-10',createdBy:'Marc Lefèvre',lastModified:'2026-02-10',paymentTerms:'Net 45',deliveryTerms:'Ex Works',
      lineItems:[{product:'SG Planitherm Ultra N',qty:2800,unit:'m²',unitPrice:720,total:2016000},{product:'Isover Vario KM Duplex',qty:3200,unit:'m²',unitPrice:310,total:992000},{product:'Project Management',qty:1,unit:'',unitPrice:392000,total:392000}],
      revisions:[{name:'v1 — Initial',status:'Current',value:3400000,date:'2026-02-10',note:'Based on feasibility study'}],
      activities:[{type:'Email',date:'2026-02-10',contact:'Sophie Durand',desc:'Sent quote with annexes'}],
      documents:[{name:'Quote_TourTriangle_v1.pdf',type:'PDF',date:'2026-02-10',size:'2.1 MB'}],winProb:'45%',competitors:'3',negoNote:'Vinci evaluating 3 suppliers'
    },
    {id:'q3',name:'Campus Saclay — Insulation Package',opportunityId:'o8',opportunity:'Campus Saclay – Bldg R',accountId:'a4',accountName:'Spie Batignolles',contact:'Isabelle Moreau',contactRole:'DG Adjoint',stage:'Won',value:5100000,netValue:4845000,discount:5,margin:20,revision:3,validUntil:'2026-04-01',createdDate:'2025-11-20',createdBy:'Marc Lefèvre',lastModified:'2026-02-25',paymentTerms:'Net 30',deliveryTerms:'DDP Site',
      lineItems:[{product:'Isover Optima',qty:5500,unit:'m²',unitPrice:520,total:2860000},{product:'Weber Therm',qty:4800,unit:'m²',unitPrice:280,total:1344000},{product:'Installation',qty:1,unit:'',unitPrice:896000,total:896000}],
      revisions:[{name:'v3 — Final',status:'Current',value:5100000,date:'2026-02-25',note:'Accepted by client'}],
      activities:[{type:'Call',date:'2026-02-25',contact:'Isabelle Moreau',desc:'PO confirmed'}],
      documents:[{name:'Quote_Saclay_v3.pdf',type:'PDF',date:'2026-02-25',size:'1.8 MB'}],winProb:'100%',competitors:'2',negoNote:'Won — PO received'
    },
    {id:'q4',name:'A69 Highway — Road Materials',opportunityId:'o3',opportunity:'A69 Highway – Section 2',accountId:'a5',accountName:'Colas Group',contact:'Thomas Girard',contactRole:'Ingénieur Études',stage:'Draft',value:6800000,netValue:6800000,discount:0,margin:15,revision:1,validUntil:'2026-06-30',createdDate:'2026-03-10',createdBy:'Sophie Durand',lastModified:'2026-03-10',paymentTerms:'Net 60',deliveryTerms:'Ex Works',
      lineItems:[{product:'Weber Road Mix',qty:12000,unit:'t',unitPrice:340,total:4080000},{product:'Aggregate Supply',qty:8000,unit:'t',unitPrice:220,total:1760000},{product:'Logistics',qty:1,unit:'',unitPrice:960000,total:960000}],
      revisions:[{name:'v1 — Draft',status:'Current',value:6800000,date:'2026-03-10',note:'Awaiting volume confirmation'}],
      activities:[],documents:[],winProb:'30%',competitors:'4',negoNote:'Awaiting Colas volume confirmation'
    },
    {id:'q5',name:'Data Center — Cooling Glazing',opportunityId:'o7',opportunity:'Data Center Marseille',accountId:'a1',accountName:'Bouygues Construction',contact:'Jean-Pierre Martin',contactRole:'Directeur Travaux',stage:'Negotiation',value:12500000,netValue:11875000,discount:5,margin:25,revision:2,validUntil:'2026-08-01',createdDate:'2026-02-01',createdBy:'Thomas Girard',lastModified:'2026-03-10',paymentTerms:'Net 45',deliveryTerms:'DDP Site',
      lineItems:[{product:'SG Cool-Lite Xtreme',qty:8000,unit:'m²',unitPrice:1100,total:8800000},{product:'Isover Clima 34',qty:4500,unit:'m²',unitPrice:480,total:2160000},{product:'Technical Supervision',qty:1,unit:'',unitPrice:1540000,total:1540000}],
      revisions:[{name:'v2 — Technical update',status:'Current',value:12500000,date:'2026-03-10',note:'Added Clima 34 spec'},{name:'v1 — Initial',status:'Superseded',value:11800000,date:'2026-02-01',note:'First proposal'}],
      activities:[{type:'Meeting',date:'2026-03-12',contact:'Jean-Pierre Martin',desc:'Technical deep-dive scheduled'}],
      documents:[{name:'Quote_DC_v2.pdf',type:'PDF',date:'2026-03-10',size:'3.4 MB'}],winProb:'55%',competitors:'2',negoNote:'Bouygues evaluating thermal performance data'
    },
    {id:'q6',name:'Résidence Verte — Envelope Package',opportunityId:'o9',opportunity:'Résidence Verte – Lille',accountId:'a9',accountName:'Implenia TP',contact:'Christophe Martinez',contactRole:'Directeur Projets',stage:'Sent',value:2900000,netValue:2755000,discount:5,margin:19,revision:1,validUntil:'2026-09-01',createdDate:'2026-03-01',createdBy:'Sophie Durand',lastModified:'2026-03-01',paymentTerms:'Net 45',deliveryTerms:'DDP Site',
      lineItems:[{product:'SG Planitherm One',qty:2200,unit:'m²',unitPrice:650,total:1430000},{product:'Isover GR 32',qty:3000,unit:'m²',unitPrice:290,total:870000},{product:'Installation',qty:1,unit:'',unitPrice:600000,total:600000}],
      revisions:[{name:'v1 — Initial',status:'Current',value:2900000,date:'2026-03-01',note:'Based on architect specs'}],
      activities:[{type:'Email',date:'2026-03-01',contact:'Christophe Martinez',desc:'Quote sent'}],
      documents:[],winProb:'50%',competitors:'3',negoNote:'Competing against local suppliers'
    },
    {id:'q7',name:'Port de Nice — Marine Concrete',opportunityId:'o10',opportunity:'Port de Nice – Quai Sud',accountId:'a10',accountName:'Soletanche Bachy',contact:'Émilie Faure',contactRole:'Ingénieure Structures',stage:'Draft',value:4200000,netValue:4200000,discount:0,margin:16,revision:1,validUntil:'2026-07-15',createdDate:'2026-03-05',createdBy:'Marc Lefèvre',lastModified:'2026-03-05',paymentTerms:'Net 60',deliveryTerms:'Ex Works',
      lineItems:[{product:'Weber Marine Concrete',qty:5000,unit:'m³',unitPrice:520,total:2600000},{product:'Corrosion Protection',qty:3000,unit:'m²',unitPrice:340,total:1020000},{product:'Site Supervision',qty:1,unit:'',unitPrice:580000,total:580000}],
      revisions:[{name:'v1 — Draft',status:'Current',value:4200000,date:'2026-03-05',note:'Pending structural review'}],
      activities:[],documents:[],winProb:'35%',competitors:'2',negoNote:'Soletanche prefers local sourcing'
    },
    {id:'q8',name:'Flaubert Bridge — Steel & Glazing',opportunityId:'o6',opportunity:'Flaubert Bridge Phase 2',accountId:'a7',accountName:'Demathieu Bard',contact:'Antoine Mercier',contactRole:'Chef de Chantier',stage:'Draft',value:5600000,netValue:5600000,discount:0,margin:17,revision:1,validUntil:'2026-10-01',createdDate:'2026-03-08',createdBy:'Jean-Pierre Martin',lastModified:'2026-03-08',paymentTerms:'Net 60',deliveryTerms:'DDP Site',
      lineItems:[{product:'SG Securit Glazing',qty:1800,unit:'m²',unitPrice:1200,total:2160000},{product:'Steel Connectors',qty:4500,unit:'pcs',unitPrice:420,total:1890000},{product:'Installation',qty:1,unit:'',unitPrice:1550000,total:1550000}],
      revisions:[{name:'v1 — Draft',status:'Current',value:5600000,date:'2026-03-08',note:'Initial estimate'}],
      activities:[],documents:[],winProb:'25%',competitors:'3',negoNote:'Early stage — scope not finalized'
    },
    {id:'q9',name:'Centre Aquatique — Humid Glazing',opportunityId:'o5',opportunity:'Centre Aquatique – Extension',accountId:'a1',accountName:'Bouygues Construction',contact:'Jean-Pierre Martin',contactRole:'Directeur Travaux',stage:'Draft',value:1800000,netValue:1800000,discount:0,margin:21,revision:1,validUntil:'2026-08-01',createdDate:'2026-03-12',createdBy:'Thomas Girard',lastModified:'2026-03-12',paymentTerms:'Net 45',deliveryTerms:'DDP Site',
      lineItems:[{product:'SG Stadip Protect',qty:900,unit:'m²',unitPrice:1100,total:990000},{product:'Anti-Condensation Coating',qty:900,unit:'m²',unitPrice:450,total:405000},{product:'Installation',qty:1,unit:'',unitPrice:405000,total:405000}],
      revisions:[{name:'v1 — Draft',status:'Current',value:1800000,date:'2026-03-12',note:'Post feasibility inspection'}],
      activities:[],documents:[],winProb:'60%',competitors:'1',negoNote:'Strong technical fit for humid environment'
    },
    {id:'q10',name:'Gare du Nord — Phase 2 Glazing',opportunityId:'o4',opportunity:'Gare du Nord Renovation',accountId:'a3',accountName:'Eiffage Génie Civil',contact:'Marc Lefèvre',contactRole:'Responsable Achats',stage:'Won',value:4600000,netValue:4370000,discount:5,margin:20,revision:2,validUntil:'2026-05-01',createdDate:'2025-12-01',createdBy:'Sophie Durand',lastModified:'2026-01-20',paymentTerms:'Net 30',deliveryTerms:'DDP Site',
      lineItems:[{product:'SG Cool-Lite SKN 176',qty:2800,unit:'m²',unitPrice:850,total:2380000},{product:'Isover Multimax',qty:3500,unit:'m²',unitPrice:420,total:1470000},{product:'Installation',qty:1,unit:'',unitPrice:750000,total:750000}],
      revisions:[{name:'v2 — Final',status:'Current',value:4600000,date:'2026-01-20',note:'Accepted'},{name:'v1 — Initial',status:'Superseded',value:5000000,date:'2025-12-01',note:'First quote'}],
      activities:[{type:'Meeting',date:'2026-01-18',contact:'Marc Lefèvre',desc:'Final negotiation — accepted'}],
      documents:[{name:'Quote_GdN_v2.pdf',type:'PDF',date:'2026-01-20',size:'1.5 MB'}],winProb:'100%',competitors:'2',negoNote:'Won — works underway'
    }
  ],
  activities: [
    {id:'act1',type:'Call',subject:'GPE Lot 7 — Quote follow-up',date:'2026-03-03',time:'14:30',duration:30,status:'Completed',accountId:'a1',accountName:'Bouygues Construction',contactId:'c1',contact:'Jean-Pierre Martin',contactRole:'Directeur Travaux',opportunityId:'o1',opportunityName:'Grand Paris Express – Lot 7',owner:'Me',purpose:'Follow up on v2 quote pricing.',outcome:'Client reviewing internally. Decision expected by end of month.',participants:[{name:'Jean-Pierre Martin',company:'Bouygues Construction',role:'Directeur Travaux',contactId:'c1'}],notes:[],tasks:[],documents:[]},
    {id:'act2',type:'Meeting',subject:'Gare du Nord — Progress review',date:'2026-02-28',time:'10:00',duration:90,status:'Completed',accountId:'a3',accountName:'Eiffage Génie Civil',contactId:'c3',contact:'Marc Lefèvre',contactRole:'Responsable Achats',opportunityId:'o4',opportunityName:'Gare du Nord Renovation',projectId:'p1',projectName:'Gare du Nord Renovation',owner:'Sophie Durand',location:'Gare du Nord — Site Office',purpose:'Monthly progress review.',outcome:'Phase 1 on track. Phase 2 glazing starting April.',participants:[{name:'Marc Lefèvre',company:'Eiffage',role:'Responsable Achats',contactId:'c3'},{name:'Sophie Durand',company:'Saint-Gobain',role:'Business Development'}],notes:[{date:'2026-02-28',author:'Sophie Durand',text:'Eiffage satisfied with Phase 1 delivery quality.'}],tasks:[],documents:[]},
    {id:'act3',type:'Site Visit',subject:'Campus Saclay — Curtain wall inspection',date:'2026-03-05',time:'09:00',duration:180,status:'Completed',accountId:'a4',accountName:'Spie Batignolles',contactId:'c4',contact:'Isabelle Moreau',contactRole:'DG Adjoint',projectId:'p2',projectName:'Campus Saclay – Bldg R',owner:'Thomas Girard',location:'Campus Saclay — Building R',purpose:'Inspect curtain wall installation progress.',outcome:'90% installed. Minor alignment issues on north facade.',participants:[{name:'Isabelle Moreau',company:'Spie Batignolles',role:'DG Adjoint',contactId:'c4'},{name:'Thomas Girard',company:'Saint-Gobain',role:'Technical Lead'}],notes:[],tasks:[{name:'Fix north facade alignment',assignee:'Thomas Girard',dueDate:'2026-03-15',status:'In Progress'}],documents:[]},
    {id:'act4',type:'Email',subject:'Tour Triangle — Technical specs sent',date:'2026-02-10',time:'16:00',duration:null,status:'Completed',accountId:'a2',accountName:'Vinci Immobilier',contactId:'c2',contact:'Sophie Durand',contactRole:'Chef de Projet',opportunityId:'o2',opportunityName:'Tour Triangle – Fondations',owner:'Me',purpose:'Send technical annexes for facade solutions.',outcome:'Received. Sophie reviewing.',participants:[{name:'Sophie Durand',company:'Vinci Immobilier',role:'Chef de Projet',contactId:'c2'}],notes:[],tasks:[],documents:[]},
    {id:'act5',type:'Call',subject:'Campus Saclay — Final negotiation',date:'2026-02-25',time:'15:00',duration:45,status:'Completed',accountId:'a4',accountName:'Spie Batignolles',contactId:'c4',contact:'Isabelle Moreau',contactRole:'DG Adjoint',opportunityId:'o8',opportunityName:'Campus Saclay – Bldg R',projectId:'p2',projectName:'Campus Saclay – Bldg R',owner:'Marc Lefèvre',purpose:'Close on v3 terms.',outcome:'Quote accepted. PO expected within 5 days.',participants:[{name:'Isabelle Moreau',company:'Spie Batignolles',role:'DG Adjoint',contactId:'c4'}],notes:[{date:'2026-02-25',author:'Marc Lefèvre',text:'5% discount on 5.1M€ package — approved.'}],tasks:[{name:'Confirm PO reception',assignee:'Marc Lefèvre',dueDate:'2026-03-05',status:'Completed'}],documents:[]},
    {id:'act6',type:'Meeting',subject:'A69 Highway — Scoping session',date:'2026-03-08',time:'10:00',duration:60,status:'In Progress',accountId:'a5',accountName:'Colas Group',contactId:'c5',contact:'Thomas Girard',contactRole:'Ingénieur Études',opportunityId:'o3',opportunityName:'A69 Highway – Section 2',owner:'Sophie Durand',location:'Colas HQ — Boulogne',purpose:'Confirm material volumes for bid.',participants:[{name:'Thomas Girard',company:'Colas Group',role:'Ingénieur Études',contactId:'c5'}],notes:[],tasks:[{name:'Finalize volume estimates',assignee:'Sophie Durand',dueDate:'2026-03-12',status:'In Progress'}],documents:[]},
    {id:'act7',type:'Meeting',subject:'Data Center — Technical deep-dive',date:'2026-03-12',time:'14:00',duration:120,status:'Planned',accountId:'a1',accountName:'Bouygues Construction',contactId:'c1',contact:'Jean-Pierre Martin',contactRole:'Directeur Travaux',opportunityId:'o7',opportunityName:'Data Center Marseille',owner:'Me',location:'Microsoft Teams',purpose:'Present SG Cool-Lite performance data.',participants:[{name:'Jean-Pierre Martin',company:'Bouygues Construction',role:'Directeur Travaux',contactId:'c1'}],notes:[],tasks:[{name:'Prepare Cool-Lite presentation',assignee:'Thomas Girard',dueDate:'2026-03-11',status:'In Progress'}],documents:[]},
    {id:'act8',type:'Meeting',subject:'Flaubert Bridge — Pre-study kickoff',date:'2026-03-15',time:'10:00',duration:60,status:'Planned',accountId:'a7',accountName:'Demathieu Bard',contactId:'c7',contact:'Antoine Mercier',contactRole:'Chef de Chantier',opportunityId:'o6',opportunityName:'Flaubert Bridge Phase 2',owner:'Marc Lefèvre',location:'Demathieu Bard — Metz',purpose:'Kickoff pre-study phase for Flaubert Bridge.',participants:[{name:'Antoine Mercier',company:'Demathieu Bard',role:'Chef de Chantier',contactId:'c7'}],notes:[],tasks:[],documents:[]},
    {id:'act9',type:'Call',subject:'NGE — Hospital Wing intro',date:'2026-03-10',time:'11:00',duration:25,status:'Completed',accountId:'a6',accountName:'NGE Fondations',contactId:'c6',contact:'Claire Rousseau',contactRole:'Directrice Commerciale',owner:'Sophie Durand',purpose:'Introduction call for hospital wing lead.',outcome:'Claire interested. Meeting scheduled for next week.',participants:[{name:'Claire Rousseau',company:'NGE Fondations',role:'Directrice Commerciale',contactId:'c6'}],notes:[],tasks:[{name:'Prepare hospital wing presentation',assignee:'Sophie Durand',dueDate:'2026-03-14',status:'To Do'}],documents:[]},
    {id:'act10',type:'Email',subject:'Résidence Verte — Quote sent',date:'2026-03-01',time:'09:00',duration:null,status:'Completed',accountId:'a9',accountName:'Implenia TP',contactId:'c9',contact:'Christophe Martinez',contactRole:'Directeur Projets',opportunityId:'o9',opportunityName:'Résidence Verte – Lille',owner:'Sophie Durand',purpose:'Send envelope package quote.',outcome:'Received. Review in progress.',participants:[{name:'Christophe Martinez',company:'Implenia TP',role:'Directeur Projets',contactId:'c9'}],notes:[],tasks:[],documents:[]},

    /* ── Week Mar 16–20 seed (sales agenda) ── */
    {id:'act11',type:'Call',subject:'GPE Lot 7 — Decision follow-up',date:'2026-03-16',time:'09:00',duration:20,status:'Planned',accountId:'a1',accountName:'Bouygues Construction',contactId:'c1',contact:'Jean-Pierre Martin',contactRole:'Directeur Travaux',opportunityId:'o1',opportunityName:'Grand Paris Express – Lot 7',owner:'Me',purpose:'Check if decision was made on v2 quote.',participants:[],notes:[],tasks:[],documents:[]},
    {id:'act12',type:'Meeting',subject:'NGE — Hospital Wing presentation',date:'2026-03-16',time:'11:00',duration:60,status:'Planned',accountId:'a6',accountName:'NGE Fondations',contactId:'c6',contact:'Claire Rousseau',contactRole:'Directrice Commerciale',owner:'Sophie Durand',location:'NGE Lyon Office',purpose:'Present glazing solutions for hospital wing project.',participants:[{name:'Claire Rousseau',company:'NGE Fondations',role:'Directrice Commerciale',contactId:'c6'}],notes:[],tasks:[],documents:[]},
    {id:'act13',type:'Email',subject:'Colas — Volume estimates follow-up',date:'2026-03-16',time:'14:00',duration:null,status:'Planned',accountId:'a5',accountName:'Colas Group',contactId:'c5',contact:'Thomas Girard',contactRole:'Ingénieur Études',opportunityId:'o3',opportunityName:'A69 Highway – Section 2',owner:'Sophie Durand',purpose:'Send updated volume estimates after scoping session.',participants:[],notes:[],tasks:[],documents:[]},
    {id:'act14',type:'Call',subject:'Demathieu — Sports arena intro',date:'2026-03-16',time:'16:00',duration:30,status:'Planned',accountId:'a7',accountName:'Demathieu Bard',contactId:'c7',contact:'Antoine Mercier',contactRole:'Chef de Chantier',owner:'Me',purpose:'Initial discovery call for sports arena lead.',participants:[],notes:[],tasks:[],documents:[]},

    {id:'act15',type:'Meeting',subject:'Tour Triangle — Design review',date:'2026-03-17',time:'09:30',duration:90,status:'Planned',accountId:'a2',accountName:'Vinci Immobilier',contactId:'c2',contact:'Sophie Durand',contactRole:'Chef de Projet',opportunityId:'o2',opportunityName:'Tour Triangle – Fondations',owner:'Me',location:'Vinci HQ — Nanterre',purpose:'Review facade design options with Vinci team.',participants:[{name:'Sophie Durand',company:'Vinci Immobilier',role:'Chef de Projet',contactId:'c2'}],notes:[],tasks:[],documents:[]},
    {id:'act16',type:'Call',subject:'Implenia — Quote clarification',date:'2026-03-17',time:'11:30',duration:25,status:'Planned',accountId:'a9',accountName:'Implenia TP',contactId:'c9',contact:'Christophe Martinez',contactRole:'Directeur Projets',opportunityId:'o9',opportunityName:'Résidence Verte – Lille',owner:'Sophie Durand',purpose:'Clarify insulation specs in submitted quote.',participants:[],notes:[],tasks:[],documents:[]},
    {id:'act17',type:'Meeting',subject:'Internal — Weekly pipeline review',date:'2026-03-17',time:'14:00',duration:60,status:'Planned',owner:'Me',location:'Microsoft Teams',purpose:'Weekly team pipeline review and forecast update.',participants:[],notes:[],tasks:[],documents:[]},
    {id:'act18',type:'Email',subject:'Soletanche — Port de Nice specs',date:'2026-03-17',time:'16:30',duration:null,status:'Planned',accountId:'a10',accountName:'Soletanche Bachy',contactId:'c10',contact:'Émilie Faure',contactRole:'Ingénieure Structures',opportunityId:'o10',opportunityName:'Port de Nice – Quai Sud',owner:'Me',purpose:'Send technical specs for marine-grade glazing.',participants:[],notes:[],tasks:[],documents:[]},

    {id:'act19',type:'Site Visit',subject:'Centre Aquatique — Feasibility',date:'2026-03-18',time:'08:30',duration:240,status:'Planned',accountId:'a1',accountName:'Bouygues Construction',contactId:'c1',contact:'Jean-Pierre Martin',contactRole:'Directeur Travaux',opportunityId:'o5',opportunityName:'Centre Aquatique – Extension',owner:'Thomas Girard',location:'Centre Aquatique — Aubervilliers',purpose:'Assess glazing and humidity conditions on site.',participants:[{name:'Jean-Pierre Martin',company:'Bouygues Construction',role:'Directeur Travaux',contactId:'c1'}],notes:[],tasks:[],documents:[]},
    {id:'act20',type:'Call',subject:'Eiffage — Phase 2 planning',date:'2026-03-18',time:'14:00',duration:30,status:'Planned',accountId:'a3',accountName:'Eiffage Génie Civil',contactId:'c3',contact:'Marc Lefèvre',contactRole:'Responsable Achats',opportunityId:'o4',opportunityName:'Gare du Nord Renovation',projectId:'p1',projectName:'Gare du Nord Renovation',owner:'Sophie Durand',purpose:'Align on Phase 2 glazing delivery schedule.',participants:[],notes:[],tasks:[],documents:[]},
    {id:'act21',type:'Email',subject:'Razel-Bec — Dam upgrade proposal',date:'2026-03-18',time:'15:30',duration:null,status:'Planned',accountId:'a8',accountName:'Razel-Bec',contactId:'c8',contact:'Nathalie Petit',contactRole:'Responsable Technique',owner:'Me',purpose:'Send initial proposal for dam upgrade glazing solutions.',participants:[],notes:[],tasks:[],documents:[]},

    {id:'act22',type:'Meeting',subject:'Data Center — Cooling glazing workshop',date:'2026-03-19',time:'09:00',duration:120,status:'Planned',accountId:'a1',accountName:'Bouygues Construction',contactId:'c1',contact:'Jean-Pierre Martin',contactRole:'Directeur Travaux',opportunityId:'o7',opportunityName:'Data Center Marseille',owner:'Me',location:'Bouygues HQ — Paris',purpose:'Workshop on cooling-optimized glazing specs with engineering team.',participants:[{name:'Jean-Pierre Martin',company:'Bouygues Construction',role:'Directeur Travaux',contactId:'c1'}],notes:[],tasks:[],documents:[]},
    {id:'act23',type:'Call',subject:'NGE — Hospital feedback',date:'2026-03-19',time:'14:00',duration:20,status:'Planned',accountId:'a6',accountName:'NGE Fondations',contactId:'c6',contact:'Claire Rousseau',contactRole:'Directrice Commerciale',owner:'Sophie Durand',purpose:'Get feedback on Monday presentation.',participants:[],notes:[],tasks:[],documents:[]},
    {id:'act24',type:'Meeting',subject:'Spie — Saclay punch list review',date:'2026-03-19',time:'15:30',duration:60,status:'Planned',accountId:'a4',accountName:'Spie Batignolles',contactId:'c4',contact:'Isabelle Moreau',contactRole:'DG Adjoint',projectId:'p2',projectName:'Campus Saclay – Bldg R',owner:'Thomas Girard',location:'Campus Saclay — Building R',purpose:'Review punch list items before final inspection.',participants:[{name:'Isabelle Moreau',company:'Spie Batignolles',role:'DG Adjoint',contactId:'c4'}],notes:[],tasks:[],documents:[]},

    {id:'act25',type:'Call',subject:'Bouygues — GPE Lot 7 pricing update',date:'2026-03-20',time:'09:00',duration:30,status:'Planned',accountId:'a1',accountName:'Bouygues Construction',contactId:'c1',contact:'Jean-Pierre Martin',contactRole:'Directeur Travaux',opportunityId:'o1',opportunityName:'Grand Paris Express – Lot 7',owner:'Me',purpose:'Discuss revised pricing after internal review.',participants:[],notes:[],tasks:[],documents:[]},
    {id:'act26',type:'Site Visit',subject:'Gare du Nord — Phase 2 pre-inspection',date:'2026-03-20',time:'10:30',duration:150,status:'Planned',accountId:'a3',accountName:'Eiffage Génie Civil',contactId:'c3',contact:'Marc Lefèvre',contactRole:'Responsable Achats',projectId:'p1',projectName:'Gare du Nord Renovation',owner:'Thomas Girard',location:'Gare du Nord — Main Hall',purpose:'Pre-inspection before Phase 2 glazing works begin.',participants:[{name:'Marc Lefèvre',company:'Eiffage',role:'Responsable Achats',contactId:'c3'}],notes:[],tasks:[],documents:[]},
    {id:'act27',type:'Meeting',subject:'Internal — Week wrap-up and forecasting',date:'2026-03-20',time:'15:00',duration:45,status:'Planned',owner:'Me',location:'Microsoft Teams',purpose:'End-of-week forecast update and action items.',participants:[],notes:[],tasks:[],documents:[]},
    {id:'act28',type:'Email',subject:'Demathieu — Sports arena follow-up',date:'2026-03-20',time:'17:00',duration:null,status:'Planned',accountId:'a7',accountName:'Demathieu Bard',contactId:'c7',contact:'Antoine Mercier',contactRole:'Chef de Chantier',owner:'Me',purpose:'Send product catalog and case studies after intro call.',participants:[],notes:[],tasks:[],documents:[]}
  ],
  tasks: [
    {id:'t1',name:'Finalize Tour Triangle quote',ref:'Tour Triangle – Facades · 2026-03-15',status:'In Progress',color:'#ef4444'},
    {id:'t2',name:'Follow up Eiffage Gare du Nord',ref:'Gare du Nord Renovation · 2026-03-12',status:'To Do',color:'#f59e0b'},
    {id:'t3',name:'Campus Saclay presentation',ref:'Campus Saclay – Bldg R · 2026-03-20',status:'To Do',color:'#f59e0b'},
    {id:'t4',name:'Update Colas contacts',ref:'A69 Highway · 2026-03-18',status:'In Progress',color:'#ef4444'}
  ],
  upcoming: [
    {id:'u1',name:'GPE quote follow-up',contact:'Jean-Pierre Martin',date:'2026-03-14',time:'14:30',icon:'phone',color:'#3b82f6'},
    {id:'u2',name:'Data Center deep-dive',contact:'Jean-Pierre Martin',date:'2026-03-12',time:'14:00',icon:'users',color:'#8b5cf6'},
    {id:'u3',name:'Centre Aquatique inspection',contact:'Jean-Pierre Martin',date:'2026-03-18',time:'08:30',icon:'mapPin',color:'#ef4444'},
    {id:'u4',name:'Résidence Verte follow-up',contact:'Christophe Martinez',date:'2026-03-20',time:'10:00',icon:'mail',color:'#10b981'}
  ]
};
