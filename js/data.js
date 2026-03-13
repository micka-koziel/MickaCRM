/* data.js — Mock Data with strategic fields */
window.DATA = {
  accounts: [
    {id:'a1',name:'Bouygues Construction',industry:'General Contractor',city:'Paris',pipeline:101000000,opps:3,status:'Active'},
    {id:'a2',name:'Vinci Immobilier',industry:'Real Estate Developer',city:'Nanterre',pipeline:12000000,opps:1,status:'Active'},
    {id:'a3',name:'Eiffage Génie Civil',industry:'Civil Engineering',city:'Vélizy',pipeline:32000000,opps:1,status:'Active'},
    {id:'a4',name:'Spie Batignolles',industry:'General Contractor',city:'Neuilly-sur-Seine',pipeline:19000000,opps:1,status:'Active'},
    {id:'a5',name:'Colas Group',industry:'Road & Rail',city:'Boulogne',pipeline:32000000,opps:1,status:'Active'},
    {id:'a6',name:'NGE Fondations',industry:'Foundations & Piling',city:'Lyon',pipeline:0,opps:0,status:'Prospect'},
    {id:'a7',name:'Demathieu Bard',industry:'General Contractor',city:'Metz',pipeline:22000000,opps:1,status:'Active'},
    {id:'a8',name:'Razel-Bec',industry:'Civil Engineering',city:'Saclay',pipeline:0,opps:0,status:'Prospect'}
  ],
  contacts: [
    {id:'c1',name:'Jean-Pierre Martin',account:'a1',role:'Directeur Travaux',email:'jp.martin@bouygues.fr',phone:'+33 6 12 34 56 78'},
    {id:'c2',name:'Sophie Durand',account:'a2',role:'Chef de Projet',email:'s.durand@vinci.com',phone:'+33 6 23 45 67 89'},
    {id:'c3',name:'Marc Lefèvre',account:'a3',role:'Responsable Achats',email:'m.lefevre@eiffage.com',phone:'+33 6 34 56 78 90'},
    {id:'c4',name:'Isabelle Moreau',account:'a4',role:'DG Adjoint',email:'i.moreau@spie.com',phone:'+33 6 45 67 89 01'},
    {id:'c5',name:'Thomas Girard',account:'a5',role:'Ingénieur Études',email:'t.girard@colas.com',phone:'+33 6 56 78 90 12'}
  ],
  opportunities: [
    {id:'o1',name:'Grand Paris Express – Lot 7',account:'a1',amount:45000000,prob:70,stage:'negotiation',close:'2026-06-15'},
    {id:'o2',name:'Tour Triangle – Fondations',account:'a2',amount:12000000,prob:45,stage:'proposal',close:'2026-08-01',projectId:'p3'},
    {id:'o3',name:'A69 Highway – Section 2',account:'a5',amount:32000000,prob:30,stage:'tender',close:'2026-12-01'},
    {id:'o4',name:'Gare du Nord Renovation',account:'a3',amount:23000000,prob:85,stage:'closed_won',close:'2026-03-30',projectId:'p1'},
    {id:'o5',name:'Centre Aquatique – Extension',account:'a1',amount:8500000,prob:60,stage:'study',close:'2026-09-15'},
    {id:'o6',name:'Flaubert Bridge Phase 2',account:'a7',amount:22000000,prob:25,stage:'lead',close:'2027-01-01'},
    {id:'o7',name:'Data Center Marseille',account:'a1',amount:56000000,prob:55,stage:'negotiation',close:'2026-07-20'},
    {id:'o8',name:'Campus Saclay – Bldg R',account:'a4',amount:19000000,prob:40,stage:'closed_won',close:'2026-11-01',projectId:'p2'}
  ],
  leads: [
    {id:'l1',name:'Vinci – Warehouse project',account:'a2',stage:'new',source:'Website',estimatedValue:15000000,priority:'High'},
    {id:'l2',name:'Eiffage – Highway extension',account:'a3',stage:'contacted',source:'Trade Show',estimatedValue:45000000,priority:'Medium'},
    {id:'l3',name:'Spie – Underground parking',account:'a4',stage:'qualified',source:'Referral',estimatedValue:8000000,priority:'High'},
    {id:'l4',name:'Bouygues – Tech campus',account:'a1',stage:'new',source:'Cold Call',estimatedValue:28000000,priority:'Low'}
  ],
  projects: [
    {id:'p1',name:'Gare du Nord Renovation',phase:'Construction',account:'a3',value:23000000,budget:23000000,start:'2025-01-15',end:'2026-12-01',startDate:'2025-01-15',expectedDelivery:'2026-12-01',health:'Healthy',owner:'Marc Lefèvre',commercialLead:'Sophie Durand',technicalLead:'Jean-Pierre Martin',clientStakeholders:['Isabelle Moreau'],source:'Tender',createdDate:'2024-11-20',description:'Complete renovation of Gare du Nord main hall — structural reinforcement, glass facade replacement, insulation upgrade. Saint-Gobain providing glazing and thermal solutions.',
      siteVisits:[
        {date:'2025-11-28',inspector:'Jean-Pierre Martin',status:'Completed',notes:'Facade glazing alignment verified. Minor adjustments level 3.'},
        {date:'2025-12-10',inspector:'Marc Lefèvre',status:'Scheduled',notes:'Mid-point structural review before Phase 2.'}
      ],
      claims:[
        {id:'CLM-001',title:'Delivery delay — Glass batch #4',status:'Open',priority:'High',date:'2025-11-18'}
      ],
      documents:[
        {name:'Project_Charter_v2.pdf',type:'PDF',date:'2025-01-20',size:'2.4 MB'},
        {name:'Facade_Specs.pdf',type:'PDF',date:'2025-02-15',size:'8.1 MB'},
        {name:'Budget_Tracking.xlsx',type:'XLSX',date:'2025-11-25',size:'340 KB'}
      ]
    },
    {id:'p2',name:'Campus Saclay – Bldg R',phase:'Construction',account:'a4',value:19000000,budget:19000000,start:'2025-03-01',end:'2026-11-01',startDate:'2025-03-01',expectedDelivery:'2026-11-01',health:'Attention',owner:'Isabelle Moreau',commercialLead:'Marc Lefèvre',technicalLead:'Thomas Girard',clientStakeholders:['Sophie Durand'],source:'Referral',createdDate:'2025-01-10',description:'New research building with high-performance insulation, smart glazing, and energy-efficient envelope. Full Saint-Gobain materials package.',
      siteVisits:[
        {date:'2025-10-15',inspector:'Thomas Girard',status:'Completed',notes:'Foundation OK. Curtain wall install greenlit.'}
      ],
      claims:[],
      documents:[
        {name:'Proposal_Saclay.pdf',type:'PDF',date:'2025-02-01',size:'3.2 MB'}
      ]
    },
    {id:'p3',name:'Tour Triangle – Facades',phase:'Pre-study',account:'a2',value:12000000,budget:12000000,start:'2025-06-01',end:'2027-06-01',startDate:'2025-06-01',expectedDelivery:'2027-06-01',health:'Healthy',owner:'Sophie Durand',commercialLead:'Jean-Pierre Martin',technicalLead:'Marc Lefèvre',clientStakeholders:['Thomas Girard'],source:'Website',createdDate:'2025-05-10',description:'Iconic triangular tower facade — advanced glazing solutions, high-altitude wind resistance testing, and custom insulation panels.',
      siteVisits:[],
      claims:[],
      documents:[
        {name:'Feasibility_Study.pdf',type:'PDF',date:'2025-05-20',size:'1.8 MB'}
      ]
    }
  ],
  quotes: [
    {id:'q1',name:'GPE Lot 7 — Glazing Package',opportunityId:'o1',opportunity:'Grand Paris Express – Lot 7',accountId:'a1',accountName:'Bouygues Construction',contact:'Jean-Pierre Martin',contactRole:'Directeur Travaux',stage:'Negotiation',value:8200000,netValue:7790000,discount:5,margin:22,revision:2,validUntil:'2026-07-01',createdDate:'2026-01-15',createdBy:'Sophie Durand',lastModified:'2026-03-05',paymentTerms:'Net 60',deliveryTerms:'DDP Site',
      lineItems:[
        {product:'SG Cool-Lite SKN 176',qty:4200,unit:'m²',unitPrice:850,total:3570000},
        {product:'Isover Multimax 30',qty:6000,unit:'m²',unitPrice:420,total:2520000},
        {product:'Weber Joint Flex',qty:8500,unit:'kg',unitPrice:38,total:323000},
        {product:'Installation & Supervision',qty:1,unit:'',unitPrice:1787000,total:1787000}
      ],
      revisions:[
        {name:'v2 — Revised pricing',status:'Current',value:8200000,date:'2026-03-05',note:'Adjusted unit prices after site survey'},
        {name:'v1 — Initial proposal',status:'Superseded',value:8800000,date:'2026-01-15',note:'First submission'}
      ],
      activities:[
        {type:'Meeting',date:'2026-03-03',contact:'Jean-Pierre Martin',desc:'Reviewed v2 pricing with procurement team'},
        {type:'Call',date:'2026-02-20',contact:'Jean-Pierre Martin',desc:'Discussed discount structure and payment terms'},
        {type:'Email',date:'2026-01-15',contact:'Jean-Pierre Martin',desc:'Sent initial quote v1'}
      ],
      documents:[
        {name:'Quote_GPE_v2.pdf',type:'PDF',date:'2026-03-05',size:'1.2 MB'},
        {name:'Technical_Specs_Glazing.pdf',type:'PDF',date:'2026-01-10',size:'4.8 MB'}
      ],
      winProb:'70%',competitors:'2',negoNote:'Client requested 5% volume discount — approved by management'
    },
    {id:'q2',name:'Tour Triangle — Facade Solutions',opportunityId:'o2',opportunity:'Tour Triangle – Fondations',accountId:'a2',accountName:'Vinci Immobilier',contact:'Sophie Durand',contactRole:'Chef de Projet',stage:'Sent',value:3400000,netValue:3230000,discount:5,margin:18,revision:1,validUntil:'2026-08-15',createdDate:'2026-02-10',createdBy:'Marc Lefèvre',lastModified:'2026-02-10',paymentTerms:'Net 45',deliveryTerms:'Ex Works',
      lineItems:[
        {product:'SG Planitherm Ultra N',qty:2800,unit:'m²',unitPrice:720,total:2016000},
        {product:'Isover Vario KM Duplex',qty:3200,unit:'m²',unitPrice:310,total:992000},
        {product:'Project Management',qty:1,unit:'',unitPrice:392000,total:392000}
      ],
      revisions:[{name:'v1 — Initial proposal',status:'Current',value:3400000,date:'2026-02-10',note:'First submission based on feasibility study'}],
      activities:[
        {type:'Email',date:'2026-02-10',contact:'Sophie Durand',desc:'Sent quote with technical annexes'},
        {type:'Meeting',date:'2026-02-05',contact:'Sophie Durand',desc:'On-site measurement and scope review'}
      ],
      documents:[{name:'Quote_TourTriangle_v1.pdf',type:'PDF',date:'2026-02-10',size:'2.1 MB'}],
      winProb:'45%',competitors:'3',negoNote:'Awaiting client feedback — follow-up scheduled March 20'
    },
    {id:'q3',name:'Campus Saclay — Insulation Package',opportunityId:'o8',opportunity:'Campus Saclay – Bldg R',accountId:'a4',accountName:'Spie Batignolles',contact:'Isabelle Moreau',contactRole:'DG Adjoint',stage:'Accepted',value:5100000,netValue:4845000,discount:5,margin:25,revision:3,validUntil:'2026-04-30',createdDate:'2025-11-01',createdBy:'Thomas Girard',lastModified:'2026-02-28',paymentTerms:'Net 30',deliveryTerms:'DDP Site',
      lineItems:[
        {product:'Isover Multimax 30',qty:8500,unit:'m²',unitPrice:380,total:3230000},
        {product:'Placo Phonique BA13',qty:5000,unit:'m²',unitPrice:220,total:1100000},
        {product:'Weber Therm Mineral',qty:3500,unit:'kg',unitPrice:55,total:192500},
        {product:'Installation Support',qty:1,unit:'',unitPrice:577500,total:577500}
      ],
      revisions:[
        {name:'v3 — Final accepted',status:'Current',value:5100000,date:'2026-02-28',note:'Final pricing after negotiation round 2'},
        {name:'v2 — Counter-offer',status:'Superseded',value:5300000,date:'2026-01-20',note:'Adjusted after client feedback'},
        {name:'v1 — Initial',status:'Superseded',value:5600000,date:'2025-11-01',note:'First submission'}
      ],
      activities:[
        {type:'Meeting',date:'2026-02-25',contact:'Isabelle Moreau',desc:'Final negotiation — quote accepted'},
        {type:'Call',date:'2026-01-18',contact:'Isabelle Moreau',desc:'Discussed counter-offer terms'},
        {type:'Email',date:'2025-11-01',contact:'Isabelle Moreau',desc:'Sent initial proposal'}
      ],
      documents:[
        {name:'Quote_Saclay_v3_signed.pdf',type:'PDF',date:'2026-02-28',size:'1.8 MB'},
        {name:'PO_Saclay_Bldg_R.pdf',type:'PDF',date:'2026-03-01',size:'520 KB'}
      ],
      winProb:'100%',competitors:'0',negoNote:'Quote accepted — PO received March 1'
    },
    {id:'q4',name:'A69 Highway — Materials Supply',opportunityId:'o3',opportunity:'A69 Highway – Section 2',accountId:'a5',accountName:'Colas Group',contact:'Thomas Girard',contactRole:'Ingénieur Études',stage:'Draft',value:6800000,netValue:6800000,discount:0,margin:15,revision:1,validUntil:'2026-09-30',createdDate:'2026-03-10',createdBy:'Sophie Durand',lastModified:'2026-03-10',paymentTerms:'Net 60',deliveryTerms:'FCA',
      lineItems:[
        {product:'Weber Road Binder HM',qty:12000,unit:'t',unitPrice:320,total:3840000},
        {product:'SG Aggregates Premium',qty:18000,unit:'t',unitPrice:105,total:1890000},
        {product:'Logistics & Delivery',qty:1,unit:'',unitPrice:1070000,total:1070000}
      ],
      revisions:[{name:'v1 — Draft',status:'Current',value:6800000,date:'2026-03-10',note:'Initial draft — pending internal review'}],
      activities:[{type:'Call',date:'2026-03-08',contact:'Thomas Girard',desc:'Scoping call — confirmed volumes and timeline'}],
      documents:[{name:'Quote_A69_Draft.pdf',type:'PDF',date:'2026-03-10',size:'980 KB'}],
      winProb:'30%',competitors:'4',negoNote:'Draft stage — requires internal approval before sending'
    },
    {id:'q5',name:'Gare du Nord — Phase 2 Glazing',opportunityId:'o4',opportunity:'Gare du Nord Renovation',accountId:'a3',accountName:'Eiffage Génie Civil',contact:'Marc Lefèvre',contactRole:'Responsable Achats',stage:'Internal Review',value:4200000,netValue:3990000,discount:5,margin:20,revision:1,validUntil:'2026-06-30',createdDate:'2026-03-01',createdBy:'Jean-Pierre Martin',lastModified:'2026-03-08',paymentTerms:'Net 45',deliveryTerms:'DDP Site',
      lineItems:[
        {product:'SG Stadip Protect SP 510',qty:1800,unit:'m²',unitPrice:1250,total:2250000},
        {product:'SG Climalit Plus',qty:2200,unit:'m²',unitPrice:580,total:1276000},
        {product:'Engineering & QA',qty:1,unit:'',unitPrice:674000,total:674000}
      ],
      revisions:[{name:'v1 — Under review',status:'Current',value:4200000,date:'2026-03-01',note:'Submitted for pricing committee approval'}],
      activities:[
        {type:'Meeting',date:'2026-02-28',contact:'Marc Lefèvre',desc:'Technical review of Phase 2 requirements'},
        {type:'Site Visit',date:'2026-02-15',contact:'Marc Lefèvre',desc:'On-site assessment for Phase 2 glazing areas'}
      ],
      documents:[{name:'Quote_GdN_Phase2_v1.pdf',type:'PDF',date:'2026-03-01',size:'1.5 MB'}],
      winProb:'85%',competitors:'1',negoNote:'Strong position — existing relationship from Phase 1'
    }
  ],
  tasks: [
    {id:'t1',name:'Finalize Tour Triangle quote',ref:'Tour Triangle – Facades · 2025-03-15',status:'In Progress',color:'#ef4444'},
    {id:'t2',name:'Follow up Eiffage Gare du Nord',ref:'Gare du Nord Renovation · 2025-03-12',status:'To Do',color:'#f59e0b'},
    {id:'t3',name:'Campus Saclay presentation',ref:'Campus Saclay – Bldg R · 2025-03-20',status:'To Do',color:'#f59e0b'},
    {id:'t4',name:'Update Colas contacts',ref:'A69 Highway · 2025-03-18',status:'In Progress',color:'#ef4444'}
  ],
  upcoming: [
    {id:'u1',name:'GPE quote follow-up',contact:'Pierre Dupont',date:'2025-03-10',time:'14:30',icon:'phone',color:'#3b82f6'},
    {id:'u2',name:'Residence project review',contact:'Marie Laurent',date:'2025-03-08',time:'10:00',icon:'users',color:'#8b5cf6'},
    {id:'u3',name:'A69 foundations inspection',contact:'Sophie Bernard',date:'2025-03-06',time:'09:00',icon:'mapPin',color:'#ef4444'},
    {id:'u4',name:'Technical docs sent',contact:'Jean Martin',date:'2025-03-05',time:'16:45',icon:'mail',color:'#10b981'}
  ]
};
