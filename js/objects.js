// ============================================================
// MICKACRM 360 — OBJECTS.JS
// CRM Object Registry
// Defines all 10 objects: icon, label, data source, columns
// To ADD a new object: add an entry here + its data in data.js
// ============================================================

const OBJ = {
  accounts: {
    label: "Comptes",
    icon: "🏢",
    data: ACCOUNTS,
    cols: ["name", "city", "industry", "owner", "status", "created"],
    colLabels: { name:"Nom", city:"Ville", industry:"Secteur", owner:"Propriétaire", status:"Statut", created:"Créé le" },
    // Fields that should render as Badge in tables/details
    badgeFields: ["status"],
    // Fields that span full width in record detail
    fullWidthFields: ["address"],
  },
  contacts: {
    label: "Contacts",
    icon: "👤",
    data: CONTACTS,
    cols: ["firstName", "lastName", "title", "accountName", "email", "phone"],
    colLabels: { firstName:"Prénom", lastName:"Nom", title:"Fonction", accountName:"Compte", email:"Email", phone:"Tél" },
    badgeFields: [],
    fullWidthFields: [],
  },
  leads: {
    label: "Leads",
    icon: "🎯",
    data: LEADS,
    cols: ["firstName", "lastName", "company", "source", "status", "created"],
    colLabels: { firstName:"Prénom", lastName:"Nom", company:"Société", source:"Source", status:"Statut", created:"Créé le" },
    badgeFields: ["status"],
    fullWidthFields: [],
  },
  opportunities: {
    label: "Opportunités",
    icon: "💰",
    data: OPPORTUNITIES,
    cols: ["name", "accountName", "amount", "stage", "probability", "closeDate"],
    colLabels: { name:"Nom", accountName:"Compte", amount:"Montant", stage:"Étape", probability:"Proba %", closeDate:"Clôture" },
    badgeFields: ["stage"],
    fullWidthFields: [],
  },
  projects: {
    label: "Projets",
    icon: "🏗️",
    data: PROJECTS,
    cols: ["name", "accountName", "budget", "status", "phase", "endDate"],
    colLabels: { name:"Nom", accountName:"Client", budget:"Budget", status:"Statut", phase:"Phase", endDate:"Fin" },
    badgeFields: ["status"],
    fullWidthFields: ["address"],
  },
  quotes: {
    label: "Devis",
    icon: "📄",
    data: QUOTES,
    cols: ["name", "accountName", "amount", "status", "validUntil"],
    colLabels: { name:"Nom", accountName:"Compte", amount:"Montant", status:"Statut", validUntil:"Valide" },
    badgeFields: ["status"],
    fullWidthFields: [],
  },
  activities: {
    label: "Activités",
    icon: "📞",
    data: ACTIVITIES,
    cols: ["type", "subject", "date", "accountName", "contactName"],
    colLabels: { type:"Type", subject:"Sujet", date:"Date", accountName:"Compte", contactName:"Contact" },
    badgeFields: [],
    fullWidthFields: ["notes"],
  },
  tasks: {
    label: "Tâches",
    icon: "✅",
    data: TASKS,
    cols: ["subject", "dueDate", "priority", "status", "relatedTo", "owner"],
    colLabels: { subject:"Sujet", dueDate:"Échéance", priority:"Priorité", status:"Statut", relatedTo:"Lié à", owner:"Assigné" },
    badgeFields: ["priority", "status"],
    fullWidthFields: [],
  },
  cases: {
    label: "Cases",
    icon: "🔧",
    data: CASES,
    cols: ["subject", "accountName", "type", "priority", "status", "created"],
    colLabels: { subject:"Sujet", accountName:"Compte", type:"Type", priority:"Priorité", status:"Statut", created:"Créé le" },
    badgeFields: ["priority", "status"],
    fullWidthFields: [],
  },
  campaigns: {
    label: "Campagnes",
    icon: "📢",
    data: CAMPAIGNS,
    cols: ["name", "type", "status", "startDate", "budget", "leads"],
    colLabels: { name:"Nom", type:"Type", status:"Statut", startDate:"Début", budget:"Budget", leads:"Leads" },
    badgeFields: ["status"],
    fullWidthFields: [],
  },
};

// ─── Field Labels (for Record Detail view) ─────────────────────
const FIELD_LABELS = {
  name:"Nom", firstName:"Prénom", lastName:"Nom", company:"Société",
  email:"Email", phone:"Tél", title:"Fonction", accountName:"Compte",
  accountId:"ID Compte", city:"Ville", industry:"Secteur", owner:"Propriétaire",
  revenue:"CA", employees:"Effectif", status:"Statut", created:"Créé le",
  website:"Site web", address:"Adresse", amount:"Montant", stage:"Étape",
  probability:"Probabilité", closeDate:"Clôture", budget:"Budget",
  startDate:"Début", endDate:"Fin", manager:"Manager", phase:"Phase",
  source:"Source", opportunityName:"Opportunité", validUntil:"Valide",
  type:"Type", subject:"Sujet", date:"Date", time:"Heure",
  contactName:"Contact", notes:"Notes", dueDate:"Échéance",
  priority:"Priorité", relatedTo:"Lié à", leads:"Leads",
};
