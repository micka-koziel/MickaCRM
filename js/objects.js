// ============================================================
// MICKACRM 360 v3 — OBJECTS.JS
// ============================================================
var OBJ = {
  accounts:{label:"Comptes",data:ACCOUNTS,cols:["name","city","industry","owner","status","created"],colLabels:{name:"Nom",city:"Ville",industry:"Secteur",owner:"Propriétaire",status:"Statut",created:"Créé le"},fullWidthFields:["address"]},
  contacts:{label:"Contacts",data:CONTACTS,cols:["firstName","lastName","title","accountName","email","phone"],colLabels:{firstName:"Prénom",lastName:"Nom",title:"Fonction",accountName:"Compte",email:"Email",phone:"Tél"},fullWidthFields:[]},
  leads:{label:"Leads",data:LEADS,cols:["firstName","lastName","company","source","status","created"],colLabels:{firstName:"Prénom",lastName:"Nom",company:"Société",source:"Source",status:"Statut",created:"Créé le"},fullWidthFields:[]},
  opportunities:{label:"Opportunités",data:OPPORTUNITIES,cols:["name","accountName","amount","stage","probability","closeDate"],colLabels:{name:"Nom",accountName:"Compte",amount:"Montant",stage:"Étape",probability:"Proba %",closeDate:"Clôture"},fullWidthFields:[]},
  projects:{label:"Projets",data:PROJECTS,cols:["name","accountName","budget","status","phase","endDate"],colLabels:{name:"Nom",accountName:"Client",budget:"Budget",status:"Statut",phase:"Phase",endDate:"Fin"},fullWidthFields:["address"]},
  quotes:{label:"Devis",data:QUOTES,cols:["name","accountName","amount","status","validUntil"],colLabels:{name:"Nom",accountName:"Compte",amount:"Montant",status:"Statut",validUntil:"Valide"},fullWidthFields:[]},
  activities:{label:"Activités",data:ACTIVITIES,cols:["type","subject","date","accountName","contactName"],colLabels:{type:"Type",subject:"Sujet",date:"Date",accountName:"Compte",contactName:"Contact"},fullWidthFields:["notes"]},
  tasks:{label:"Tâches",data:TASKS,cols:["subject","dueDate","priority","status","relatedTo","owner"],colLabels:{subject:"Sujet",dueDate:"Échéance",priority:"Priorité",status:"Statut",relatedTo:"Lié à",owner:"Assigné"},fullWidthFields:[]},
  cases:{label:"Cases",data:CASES,cols:["subject","accountName","type","priority","status","created"],colLabels:{subject:"Sujet",accountName:"Compte",type:"Type",priority:"Priorité",status:"Statut",created:"Créé le"},fullWidthFields:[]},
  campaigns:{label:"Campagnes",data:CAMPAIGNS,cols:["name","type","status","startDate","budget","leads"],colLabels:{name:"Nom",type:"Type",status:"Statut",startDate:"Début",budget:"Budget",leads:"Leads"},fullWidthFields:[]},
};

var FIELD_LABELS = {name:"Nom",firstName:"Prénom",lastName:"Nom",company:"Société",email:"Email",phone:"Tél",title:"Fonction",accountName:"Compte",accountId:"ID Compte",city:"Ville",industry:"Secteur",owner:"Propriétaire",revenue:"CA",employees:"Effectif",status:"Statut",created:"Créé le",website:"Site web",address:"Adresse",amount:"Montant",stage:"Étape",probability:"Probabilité",closeDate:"Clôture",budget:"Budget",startDate:"Début",endDate:"Fin",manager:"Manager",phase:"Phase",source:"Source",opportunityName:"Opportunité",validUntil:"Valide",type:"Type",subject:"Sujet",date:"Date",time:"Heure",contactName:"Contact",notes:"Notes",dueDate:"Échéance",priority:"Priorité",relatedTo:"Lié à",leads:"Leads"};
