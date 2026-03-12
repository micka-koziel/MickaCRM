// ============================================================
// MICKACRM 360 — DATA.JS
// Mock data for all CRM objects
// When Firebase is branched, this file will be replaced by
// Firestore reads. Structure stays identical.
// ============================================================

const ACCOUNTS = [
  { id:"a1", name:"Bouygues Construction", city:"Paris", industry:"Constructeur Général", owner:"Micka", phone:"+33 1 44 20 10 00", revenue:"37.5B€", employees:58000, status:"Client", created:"2024-01-15", website:"bouygues-construction.com", address:"1 Av Eugène Freyssinet, 78280 Guyancourt" },
  { id:"a2", name:"Vinci Construction", city:"Nanterre", industry:"BTP & Concessions", owner:"Micka", phone:"+33 1 47 16 35 00", revenue:"58.4B€", employees:272000, status:"Client", created:"2024-02-03", website:"vinci-construction.com", address:"1 Cours Ferdinand de Lesseps, 92851 Rueil-Malmaison" },
  { id:"a3", name:"Eiffage Construction", city:"Vélizy", industry:"BTP & Infrastructure", owner:"Micka", phone:"+33 1 34 65 89 89", revenue:"20.4B€", employees:73500, status:"Prospect", created:"2024-03-10", website:"eiffage.com", address:"3-7 Place de l'Europe, 78140 Vélizy" },
  { id:"a4", name:"Colas Group", city:"Paris", industry:"Routes & Infra", owner:"Micka", phone:"+33 1 47 61 75 00", revenue:"15.8B€", employees:65000, status:"Client", created:"2024-01-28", website:"colas.com", address:"7 Place René Clair, 92653 Boulogne" },
  { id:"a5", name:"Spie Batignolles", city:"Neuilly", industry:"Constructeur Général", owner:"Micka", phone:"+33 1 47 47 47 47", revenue:"2.1B€", employees:8500, status:"Prospect", created:"2024-04-12", website:"spiebatignolles.com", address:"10 Av de l'Entreprise, 95863 Cergy" },
  { id:"a6", name:"Demathieu Bard", city:"Metz", industry:"BTP & Génie Civil", owner:"Micka", phone:"+33 3 87 34 85 85", revenue:"1.4B€", employees:4200, status:"Client", created:"2024-05-01", website:"demathieu-bard.com", address:"1 Rue de Pont-à-Mousson, 57000 Metz" },
];

const CONTACTS = [
  { id:"c1", firstName:"Pierre", lastName:"Dupont", email:"p.dupont@bouygues.com", phone:"+33 6 12 34 56 78", title:"Directeur Achats", accountId:"a1", accountName:"Bouygues Construction", created:"2024-01-15" },
  { id:"c2", firstName:"Marie", lastName:"Laurent", email:"m.laurent@vinci.com", phone:"+33 6 23 45 67 89", title:"Chef de Projet", accountId:"a2", accountName:"Vinci Construction", created:"2024-02-10" },
  { id:"c3", firstName:"Jean", lastName:"Martin", email:"j.martin@eiffage.com", phone:"+33 6 34 56 78 90", title:"Resp. Technique", accountId:"a3", accountName:"Eiffage Construction", created:"2024-03-15" },
  { id:"c4", firstName:"Sophie", lastName:"Bernard", email:"s.bernard@colas.com", phone:"+33 6 45 67 89 01", title:"Dir. Commerciale", accountId:"a4", accountName:"Colas Group", created:"2024-02-20" },
  { id:"c5", firstName:"Luc", lastName:"Moreau", email:"l.moreau@spiebat.com", phone:"+33 6 56 78 90 12", title:"Ingénieur Travaux", accountId:"a5", accountName:"Spie Batignolles", created:"2024-04-18" },
  { id:"c6", firstName:"Claire", lastName:"Petit", email:"c.petit@demathieu.com", phone:"+33 6 67 89 01 23", title:"Resp. Appels d'Offres", accountId:"a6", accountName:"Demathieu Bard", created:"2024-05-05" },
];

const OPPORTUNITIES = [
  { id:"o1", name:"Grand Paris Express - Lot 7", accountId:"a1", accountName:"Bouygues Construction", amount:"45M€", amountNum:45, stage:"Négociation", probability:70, closeDate:"2025-06-30", owner:"Micka", created:"2024-06-01" },
  { id:"o2", name:"Tour Triangle - Façades", accountId:"a2", accountName:"Vinci Construction", amount:"12M€", amountNum:12, stage:"Proposition soumise", probability:50, closeDate:"2025-04-15", owner:"Micka", created:"2024-07-10" },
  { id:"o3", name:"Rénovation Gare du Nord", accountId:"a3", accountName:"Eiffage Construction", amount:"8.5M€", amountNum:8.5, stage:"Étude préalable", probability:30, closeDate:"2025-09-01", owner:"Micka", created:"2024-08-05" },
  { id:"o4", name:"Autoroute A69 - Section 2", accountId:"a4", accountName:"Colas Group", amount:"32M€", amountNum:32, stage:"Contrat signé", probability:95, closeDate:"2025-03-01", owner:"Micka", created:"2024-05-20" },
  { id:"o5", name:"Campus Saclay - Bât. R", accountId:"a5", accountName:"Spie Batignolles", amount:"18M€", amountNum:18, stage:"Appel d'offres", probability:40, closeDate:"2025-07-15", owner:"Micka", created:"2024-09-01" },
  { id:"o6", name:"Pont Flaubert Phase 2", accountId:"a6", accountName:"Demathieu Bard", amount:"22M€", amountNum:22, stage:"Lead identifié", probability:15, closeDate:"2025-12-01", owner:"Micka", created:"2024-10-01" },
  { id:"o7", name:"Data Center Marseille", accountId:"a1", accountName:"Bouygues Construction", amount:"56M€", amountNum:56, stage:"Négociation", probability:65, closeDate:"2025-05-15", owner:"Micka", created:"2024-08-20" },
  { id:"o8", name:"Résidence Les Jardins", accountId:"a2", accountName:"Vinci Construction", amount:"6M€", amountNum:6, stage:"Contrat signé", probability:100, closeDate:"2025-02-01", owner:"Micka", created:"2024-04-10" },
];

const PROJECTS = [
  { id:"p1", name:"Grand Paris Express - Lot 7", accountId:"a1", accountName:"Bouygues Construction", address:"Saint-Denis, 93200", budget:"45M€", startDate:"2025-03-01", endDate:"2027-06-30", manager:"Micka", status:"Construction", phase:"Gros œuvre" },
  { id:"p2", name:"Résidence Les Jardins", accountId:"a2", accountName:"Vinci Construction", address:"Lyon 3ème, 69003", budget:"6M€", startDate:"2025-02-15", endDate:"2026-08-30", manager:"Micka", status:"Construction", phase:"Fondations" },
  { id:"p3", name:"Autoroute A69 - Section 2", accountId:"a4", accountName:"Colas Group", address:"Toulouse - Castres", budget:"32M€", startDate:"2025-04-01", endDate:"2027-12-31", manager:"Micka", status:"Pré-étude", phase:"Études techniques" },
];

const LEADS = [
  { id:"l1", firstName:"Antoine", lastName:"Roux", company:"BTP Innovations", email:"a.roux@btpinnov.fr", phone:"+33 6 78 90 12 34", source:"Salon BatiMat", status:"Nouveau", created:"2025-01-10" },
  { id:"l2", firstName:"Isabelle", lastName:"Girard", company:"EcoConstruct", email:"i.girard@ecoconstruct.fr", phone:"+33 6 89 01 23 45", source:"Site Web", status:"Contacté", created:"2025-01-18" },
  { id:"l3", firstName:"Thomas", lastName:"Leroy", company:"Matériaux Plus", email:"t.leroy@matplus.fr", phone:"+33 6 90 12 34 56", source:"Recommandation", status:"Qualifié", created:"2025-02-01" },
  { id:"l4", firstName:"Nathalie", lastName:"Simon", company:"ArchiDesign Studio", email:"n.simon@archidesign.fr", phone:"+33 6 01 23 45 67", source:"LinkedIn", status:"Nouveau", created:"2025-02-15" },
];

const QUOTES = [
  { id:"q1", name:"Devis GPE Lot 7 - Rev.3", opportunityName:"Grand Paris Express - Lot 7", accountName:"Bouygues Construction", amount:"44.8M€", status:"Envoyé", validUntil:"2025-04-30", created:"2025-01-20" },
  { id:"q2", name:"Devis Tour Triangle", opportunityName:"Tour Triangle - Façades", accountName:"Vinci Construction", amount:"12.2M€", status:"Brouillon", validUntil:"2025-05-15", created:"2025-02-10" },
  { id:"q3", name:"Devis A69 Section 2", opportunityName:"Autoroute A69 - Section 2", accountName:"Colas Group", amount:"31.5M€", status:"Accepté", validUntil:"2025-03-30", created:"2024-12-15" },
];

const ACTIVITIES = [
  { id:"ac1", type:"Appel", subject:"Suivi devis GPE", date:"2025-03-10", time:"14:30", accountName:"Bouygues Construction", contactName:"Pierre Dupont", notes:"Dupont confirme intérêt, demande révision budget façades." },
  { id:"ac2", type:"Réunion", subject:"Revue projet Résidence", date:"2025-03-08", time:"10:00", accountName:"Vinci Construction", contactName:"Marie Laurent", notes:"Point d'avancement chantier. RAS sur planning." },
  { id:"ac3", type:"Visite chantier", subject:"Inspection fondations A69", date:"2025-03-06", time:"09:00", accountName:"Colas Group", contactName:"Sophie Bernard", notes:"Fondations conformes. Prochaine étape : coulage dalle." },
  { id:"ac4", type:"Email", subject:"Envoi doc technique", date:"2025-03-05", time:"16:45", accountName:"Eiffage Construction", contactName:"Jean Martin", notes:"Fiches techniques isolation envoyées." },
  { id:"ac5", type:"Réunion", subject:"Kick-off Campus Saclay", date:"2025-03-04", time:"11:00", accountName:"Spie Batignolles", contactName:"Luc Moreau", notes:"Réunion de lancement. Équipes mobilisées." },
];

const TASKS = [
  { id:"t1", subject:"Finaliser devis Tour Triangle", dueDate:"2025-03-15", priority:"Haute", status:"En cours", relatedTo:"Tour Triangle - Façades", owner:"Micka" },
  { id:"t2", subject:"Relancer Eiffage Gare du Nord", dueDate:"2025-03-12", priority:"Moyenne", status:"À faire", relatedTo:"Rénovation Gare du Nord", owner:"Micka" },
  { id:"t3", subject:"Présentation Campus Saclay", dueDate:"2025-03-20", priority:"Haute", status:"À faire", relatedTo:"Campus Saclay - Bât. R", owner:"Micka" },
  { id:"t4", subject:"MAJ contacts Colas", dueDate:"2025-03-18", priority:"Basse", status:"En cours", relatedTo:"Autoroute A69", owner:"Micka" },
];

const CASES = [
  { id:"cs1", subject:"Retard livraison Lot 7", accountName:"Bouygues Construction", priority:"Haute", status:"Ouvert", created:"2025-03-01", type:"Réclamation" },
  { id:"cs2", subject:"Non-conformité béton", accountName:"Vinci Construction", priority:"Critique", status:"En cours", created:"2025-02-28", type:"Qualité" },
  { id:"cs3", subject:"Modif devis A69", accountName:"Colas Group", priority:"Moyenne", status:"Résolu", created:"2025-02-15", type:"Demande" },
];

const CAMPAIGNS = [
  { id:"cm1", name:"Salon BatiMat 2025", type:"Salon", status:"Planifié", startDate:"2025-09-29", endDate:"2025-10-03", budget:"45 000€", leads:0 },
  { id:"cm2", name:"Webinar Isolation", type:"Webinar", status:"Terminé", startDate:"2025-01-15", endDate:"2025-01-15", budget:"2 500€", leads:34 },
  { id:"cm3", name:"LinkedIn BTP", type:"Digital", status:"Actif", startDate:"2025-02-01", endDate:"2025-04-30", budget:"8 000€", leads:12 },
];
