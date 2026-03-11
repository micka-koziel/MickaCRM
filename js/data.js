/* ============================================
   MickaCRM — data.js
   Demo seed data for all objects
   Secteur Construction / BTP
   ============================================ */

MickaCRM.data = {

  accounts: [
    { id:'a1', name:'Bouygues Construction', industry:'Gros Œuvre', type:'Client', phone:'01 30 60 33 00', email:'contact@bouygues-construction.com', city:'Guyancourt', revenue:12800000, employees:52000, status:'Active', website:'bouygues-construction.com', address:'1 av. Eugène Freyssinet, 78280 Guyancourt' },
    { id:'a2', name:'Vinci Construction', industry:'Travaux Publics', type:'Client', phone:'01 47 16 35 00', email:'info@vinci-construction.fr', city:'Nanterre', revenue:25400000, employees:68000, status:'Active', website:'vinci-construction.com', address:'5 cours Ferdinand de Lesseps, 92500 Rueil-Malmaison' },
    { id:'a3', name:'Eiffage BTP', industry:'Bâtiment', type:'Client', phone:'01 71 59 10 00', email:'contact@eiffage.com', city:'Vélizy', revenue:8500000, employees:38000, status:'Active', website:'eiffage.com', address:'3 av. Morane-Saulnier, 78140 Vélizy' },
    { id:'a4', name:'Colas Rail', industry:'Infrastructure', type:'Prospect', phone:'01 47 61 75 00', email:'info@colasrail.com', city:'Courbevoie', revenue:3200000, employees:12000, status:'Active', website:'colasrail.com', address:'18 rue de Mantes, 92700 Colombes' },
    { id:'a5', name:'Spie Batignolles', industry:'Génie Civil', type:'Client', phone:'01 44 20 10 00', email:'contact@spiebatignolles.fr', city:'Neuilly', revenue:2100000, employees:8400, status:'Active', website:'spiebatignolles.fr', address:'10 av. de l\'Arche, 92400 Courbevoie' },
    { id:'a6', name:'Legrand SA', industry:'Électricité', type:'Partenaire', phone:'05 55 06 87 87', email:'info@legrand.fr', city:'Limoges', revenue:6700000, employees:37000, status:'Active', website:'legrand.fr', address:'128 av. du Maréchal de Lattre de Tassigny, 87000 Limoges' },
    { id:'a7', name:'Lafarge Holcim', industry:'Matériaux', type:'Fournisseur', phone:'01 58 86 86 86', email:'contact@lafargeholcim.com', city:'Paris', revenue:21000000, employees:70000, status:'Active', website:'lafargeholcim.com', address:'12 place de l\'Iris, 92062 Paris La Défense' },
    { id:'a8', name:'Chantiers Rénovation Sud', industry:'Rénovation', type:'Prospect', phone:'04 67 92 44 10', email:'contact@renovsud.fr', city:'Montpellier', revenue:890000, employees:120, status:'Inactive', website:'renovsud.fr', address:'25 rue de la Loge, 34000 Montpellier' },
  ],

  contacts: [
    { id:'c1', firstName:'Jean-Pierre', lastName:'Dumont', title:'Directeur Achats', accountId:'a1', account:'Bouygues Construction', email:'jp.dumont@bouygues-construction.com', phone:'06 12 34 56 78', city:'Guyancourt', status:'Active' },
    { id:'c2', firstName:'Sophie', lastName:'Martin', title:'Chef de Projet', accountId:'a2', account:'Vinci Construction', email:'s.martin@vinci-construction.fr', phone:'06 23 45 67 89', city:'Nanterre', status:'Active' },
    { id:'c3', firstName:'Pierre', lastName:'Lefèvre', title:'Responsable Technique', accountId:'a3', account:'Eiffage BTP', email:'p.lefevre@eiffage.com', phone:'06 34 56 78 90', city:'Vélizy', status:'Active' },
    { id:'c4', firstName:'Marie', lastName:'Bernard', title:'Directrice Commerciale', accountId:'a4', account:'Colas Rail', email:'m.bernard@colasrail.com', phone:'06 45 67 89 01', city:'Courbevoie', status:'Active' },
    { id:'c5', firstName:'Thomas', lastName:'Girard', title:'Ingénieur BIM', accountId:'a5', account:'Spie Batignolles', email:'t.girard@spiebatignolles.fr', phone:'06 56 78 90 12', city:'Neuilly', status:'Active' },
    { id:'c6', firstName:'Isabelle', lastName:'Moreau', title:'Responsable Achats', accountId:'a6', account:'Legrand SA', email:'i.moreau@legrand.fr', phone:'06 67 89 01 23', city:'Limoges', status:'Active' },
    { id:'c7', firstName:'François', lastName:'Petit', title:'Directeur Général', accountId:'a8', account:'Chantiers Rénovation Sud', email:'f.petit@renovsud.fr', phone:'06 78 90 12 34', city:'Montpellier', status:'Inactive' },
    { id:'c8', firstName:'Nathalie', lastName:'Robert', title:'Acheteuse Matériaux', accountId:'a7', account:'Lafarge Holcim', email:'n.robert@lafargeholcim.com', phone:'06 89 01 23 45', city:'Paris', status:'Active' },
    { id:'c9', firstName:'Luc', lastName:'Dubois', title:'Conducteur de Travaux', accountId:'a1', account:'Bouygues Construction', email:'l.dubois@bouygues-construction.com', phone:'06 90 12 34 56', city:'Lyon', status:'Active' },
    { id:'c10', firstName:'Camille', lastName:'Fournier', title:'Architecte', accountId:'a2', account:'Vinci Construction', email:'c.fournier@vinci-construction.fr', phone:'06 01 23 45 67', city:'Marseille', status:'Active' },
    { id:'c11', firstName:'Antoine', lastName:'Blanc', title:'Chef de Chantier', accountId:'a3', account:'Eiffage BTP', email:'a.blanc@eiffage.com', phone:'06 11 22 33 44', city:'Toulouse', status:'Active' },
    { id:'c12', firstName:'Julie', lastName:'Mercier', title:'Responsable QSE', accountId:'a5', account:'Spie Batignolles', email:'j.mercier@spiebatignolles.fr', phone:'06 55 66 77 88', city:'Bordeaux', status:'Active' },
  ],

  leads: [
    { id:'l1', firstName:'Marc', lastName:'Delcourt', company:'BTP Normandie', title:'Gérant', email:'m.delcourt@btpnormandie.fr', phone:'06 11 22 33 44', source:'Salon BatiExpo', status:'Nouveau', city:'Rouen', notes:'Intéressé par solutions isolation thermique' },
    { id:'l2', firstName:'Audrey', lastName:'Voisin', company:'Constructions Alpines', title:'Directrice', email:'a.voisin@constalp.fr', phone:'06 22 33 44 55', source:'LinkedIn', status:'Contacté', city:'Grenoble', notes:'Besoin devis matériaux toiture 200+ logements' },
    { id:'l3', firstName:'Éric', lastName:'Renard', company:'Atelier Bois & Co', title:'Fondateur', email:'e.renard@atelierbois.fr', phone:'06 33 44 55 66', source:'Site web', status:'Qualifié', city:'Nantes', notes:'Projet construction bois éco-responsable' },
    { id:'l4', firstName:'Sarah', lastName:'Karim', company:'Méditerranée Travaux', title:'Responsable Projets', email:'s.karim@medtravaux.com', phone:'06 44 55 66 77', source:'Recommandation', status:'Nouveau', city:'Nice', notes:'Recherche partenaire béton préfabriqué' },
    { id:'l5', firstName:'Philippe', lastName:'Roux', company:'Éco-Habitat 2030', title:'Directeur Technique', email:'p.roux@ecohabitat.fr', phone:'06 55 66 77 88', source:'Conférence RE2020', status:'Contacté', city:'Strasbourg', notes:'Intéressé par solutions bas carbone' },
    { id:'l6', firstName:'Laura', lastName:'Sanchez', company:'TP Express Aquitaine', title:'Gérante', email:'l.sanchez@tpexpress.fr', phone:'06 66 77 88 99', source:'Appel entrant', status:'Qualifié', city:'Bordeaux', notes:'Besoin urgence en matériaux VRD' },
  ],

  opportunities: [
    { id:'o1', name:'Fourniture béton Tour Montparnasse II', accountId:'a1', account:'Bouygues Construction', amount:2450000, stage:'Négociation', probability:60, closeDate:'2026-06-15', contact:'Jean-Pierre Dumont', type:'Fourniture' },
    { id:'o2', name:'Lot Électricité Campus RATP', accountId:'a2', account:'Vinci Construction', amount:890000, stage:'Proposition', probability:40, closeDate:'2026-07-30', contact:'Sophie Martin', type:'Sous-traitance' },
    { id:'o3', name:'Réhab Gare du Nord - Matériaux', accountId:'a3', account:'Eiffage BTP', amount:1800000, stage:'Qualification', probability:25, closeDate:'2026-09-01', contact:'Pierre Lefèvre', type:'Fourniture' },
    { id:'o4', name:'Contrat cadre Canalisation IDF', accountId:'a4', account:'Colas Rail', amount:3200000, stage:'Prospection', probability:15, closeDate:'2026-12-31', contact:'Marie Bernard', type:'Contrat cadre' },
    { id:'o5', name:'Isolation thermique Résidence Soleil', accountId:'a5', account:'Spie Batignolles', amount:420000, stage:'Gagné', probability:100, closeDate:'2026-03-01', contact:'Thomas Girard', type:'Fourniture' },
  ],

  projects: [
    { id:'p1', name:'Tour Triangle - La Défense', accountId:'a1', account:'Bouygues Construction', status:'En cours', startDate:'2025-09-01', endDate:'2027-06-30', budget:45000000, manager:'Luc Dubois', phase:'Gros Œuvre', progress:35 },
    { id:'p2', name:'Extension Ligne 15 Sud', accountId:'a2', account:'Vinci Construction', status:'En cours', startDate:'2024-01-15', endDate:'2026-12-31', budget:120000000, manager:'Camille Fournier', phase:'Terrassement', progress:62 },
    { id:'p3', name:'Éco-Quartier Belvédère', accountId:'a3', account:'Eiffage BTP', status:'Planifié', startDate:'2026-06-01', endDate:'2028-12-31', budget:28000000, manager:'Antoine Blanc', phase:'Études', progress:10 },
    { id:'p4', name:'Rénovation Lycée Victor Hugo', accountId:'a5', account:'Spie Batignolles', status:'En cours', startDate:'2025-11-01', endDate:'2026-08-31', budget:4200000, manager:'Julie Mercier', phase:'Second Œuvre', progress:78 },
  ],

  quotes: [
    { id:'q1', number:'DEV-2026-001', accountId:'a1', account:'Bouygues Construction', opportunity:'Fourniture béton Tour Montparnasse II', amount:2450000, status:'Envoyé', date:'2026-02-15', validUntil:'2026-04-15', contact:'Jean-Pierre Dumont' },
    { id:'q2', number:'DEV-2026-002', accountId:'a2', account:'Vinci Construction', opportunity:'Lot Électricité Campus RATP', amount:890000, status:'Brouillon', date:'2026-03-01', validUntil:'2026-05-01', contact:'Sophie Martin' },
    { id:'q3', number:'DEV-2026-003', accountId:'a3', account:'Eiffage BTP', opportunity:'Réhab Gare du Nord - Matériaux', amount:1800000, status:'Envoyé', date:'2026-02-28', validUntil:'2026-04-28', contact:'Pierre Lefèvre' },
    { id:'q4', number:'DEV-2026-004', accountId:'a5', account:'Spie Batignolles', opportunity:'Isolation thermique Résidence Soleil', amount:420000, status:'Accepté', date:'2026-01-10', validUntil:'2026-03-10', contact:'Thomas Girard' },
    { id:'q5', number:'DEV-2026-005', accountId:'a4', account:'Colas Rail', opportunity:'Contrat cadre Canalisation IDF', amount:3200000, status:'Envoyé', date:'2026-03-05', validUntil:'2026-05-05', contact:'Marie Bernard' },
  ],

  orders: [
    { id:'or1', number:'CMD-2026-001', accountId:'a5', account:'Spie Batignolles', quote:'DEV-2026-004', amount:420000, status:'Livrée', date:'2026-02-01', deliveryDate:'2026-02-28', items:'Panneaux isolation thermique x 2400 unités' },
    { id:'or2', number:'CMD-2026-002', accountId:'a1', account:'Bouygues Construction', quote:'DEV-2025-018', amount:1250000, status:'En production', date:'2026-01-20', deliveryDate:'2026-04-15', items:'Béton spécial haute performance 3500m³' },
    { id:'or3', number:'CMD-2026-003', accountId:'a3', account:'Eiffage BTP', quote:'DEV-2025-022', amount:680000, status:'Confirmée', date:'2026-03-01', deliveryDate:'2026-05-20', items:'Armatures acier + coffrages modulaires' },
    { id:'or4', number:'CMD-2026-004', accountId:'a6', account:'Legrand SA', quote:'DEV-2025-025', amount:320000, status:'En livraison', date:'2026-02-15', deliveryDate:'2026-03-15', items:'Appareillage électrique chantier lot 7' },
  ],

  invoices: [
    { id:'i1', number:'FAC-2026-001', accountId:'a5', account:'Spie Batignolles', order:'CMD-2026-001', amount:420000, status:'Payée', date:'2026-02-28', dueDate:'2026-03-30', paidDate:'2026-03-15' },
    { id:'i2', number:'FAC-2026-002', accountId:'a1', account:'Bouygues Construction', order:'CMD-2026-002', amount:625000, status:'En attente', date:'2026-03-01', dueDate:'2026-04-01', paidDate:null },
    { id:'i3', number:'FAC-2026-003', accountId:'a6', account:'Legrand SA', order:'CMD-2026-004', amount:320000, status:'En attente', date:'2026-03-05', dueDate:'2026-04-05', paidDate:null },
    { id:'i4', number:'FAC-2025-042', accountId:'a2', account:'Vinci Construction', order:'CMD-2025-019', amount:1450000, status:'Payée', date:'2025-12-15', dueDate:'2026-01-15', paidDate:'2026-01-10' },
    { id:'i5', number:'FAC-2025-045', accountId:'a3', account:'Eiffage BTP', order:'CMD-2025-021', amount:780000, status:'En retard', date:'2025-11-30', dueDate:'2025-12-30', paidDate:null },
  ],

  campaigns: [
    { id:'ca1', name:'Salon BatiExpo 2026', type:'Événement', status:'Active', startDate:'2026-04-10', endDate:'2026-04-13', budget:85000, leadsGenerated:45, costPerLead:1889, channel:'Salon professionnel' },
    { id:'ca2', name:'Webinar RE2020 Solutions', type:'Digital', status:'Planifiée', startDate:'2026-05-15', endDate:'2026-05-15', budget:5000, leadsGenerated:0, costPerLead:0, channel:'Webinar' },
    { id:'ca3', name:'Email Promo Matériaux Q1', type:'Email', status:'Terminée', startDate:'2026-01-10', endDate:'2026-02-28', budget:2500, leadsGenerated:22, costPerLead:114, channel:'Emailing' },
  ],

  cases: [
    { id:'cs1', number:'TIC-2026-001', subject:'Retard livraison béton chantier Défense', accountId:'a1', account:'Bouygues Construction', contact:'Luc Dubois', priority:'Haute', status:'Ouvert', createdDate:'2026-03-05', category:'Logistique' },
    { id:'cs2', number:'TIC-2026-002', subject:'Non-conformité panneaux lot 12', accountId:'a5', account:'Spie Batignolles', contact:'Julie Mercier', priority:'Critique', status:'En cours', createdDate:'2026-03-08', category:'Qualité' },
    { id:'cs3', number:'TIC-2026-003', subject:'Demande avoir facture FAC-2025-045', accountId:'a3', account:'Eiffage BTP', contact:'Pierre Lefèvre', priority:'Moyenne', status:'Ouvert', createdDate:'2026-03-10', category:'Facturation' },
    { id:'cs4', number:'TIC-2026-004', subject:'Info technique gamme coffrages', accountId:'a4', account:'Colas Rail', contact:'Marie Bernard', priority:'Basse', status:'Résolu', createdDate:'2026-02-20', category:'Information' },
  ],

  calendarEvents: [
    { day:5, month:3, label:'Visite chantier Défense', color:'var(--blue-light)' },
    { day:8, month:3, label:'Réunion Eiffage QSE', color:'var(--teal)' },
    { day:10, month:3, label:'Salon BatiExpo prep', color:'var(--orange)' },
    { day:11, month:3, label:'Revue pipeline Q1', color:'var(--blue-imperial)' },
    { day:15, month:3, label:'Livraison CMD-002', color:'var(--raspberry)' },
    { day:18, month:3, label:'Demo produit Colas', color:'var(--teal)' },
    { day:22, month:3, label:'Comité projet Tour Triangle', color:'var(--blue-light)' },
    { day:25, month:3, label:'Deadline devis DEV-005', color:'var(--red)' },
    { day:28, month:3, label:'Bilan campagne email', color:'var(--orange)' },
  ]
};
