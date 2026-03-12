// ============================================================
// MICKACRM 360 v3 — OBJECTS.JS
// ============================================================
var OBJ = {
  accounts:{label:"Accounts",data:ACCOUNTS,cols:["name","city","industry","owner","status","created"],colLabels:{name:"Name",city:"City",industry:"Industry",owner:"Owner",status:"Status",created:"Created"},fullWidthFields:["address"]},
  contacts:{label:"Contacts",data:CONTACTS,cols:["firstName","lastName","title","accountName","email","phone"],colLabels:{firstName:"First Name",lastName:"Last Name",title:"Title",accountName:"Account",email:"Email",phone:"Phone"},fullWidthFields:[]},
  leads:{label:"Leads",data:LEADS,cols:["firstName","lastName","company","source","status","created"],colLabels:{firstName:"First Name",lastName:"Last Name",company:"Company",source:"Source",status:"Status",created:"Created"},fullWidthFields:[]},
  opportunities:{label:"Opportunities",data:OPPORTUNITIES,cols:["name","accountName","amount","stage","probability","closeDate"],colLabels:{name:"Name",accountName:"Account",amount:"Amount",stage:"Stage",probability:"Prob. %",closeDate:"Close Date"},fullWidthFields:[]},
  projects:{label:"Projects",data:PROJECTS,cols:["name","accountName","budget","status","phase","endDate"],colLabels:{name:"Name",accountName:"Client",budget:"Budget",status:"Status",phase:"Phase",endDate:"End Date"},fullWidthFields:["address"]},
  quotes:{label:"Quotes",data:QUOTES,cols:["name","accountName","amount","status","validUntil"],colLabels:{name:"Name",accountName:"Account",amount:"Amount",status:"Status",validUntil:"Valid Until"},fullWidthFields:[]},
  activities:{label:"Activities",data:ACTIVITIES,cols:["type","subject","date","accountName","contactName"],colLabels:{type:"Type",subject:"Subject",date:"Date",accountName:"Account",contactName:"Contact"},fullWidthFields:["notes"]},
  tasks:{label:"Tasks",data:TASKS,cols:["subject","dueDate","priority","status","relatedTo","owner"],colLabels:{subject:"Subject",dueDate:"Due Date",priority:"Priority",status:"Status",relatedTo:"Related To",owner:"Assigned To"},fullWidthFields:[]},
  cases:{label:"Cases",data:CASES,cols:["subject","accountName","type","priority","status","created"],colLabels:{subject:"Subject",accountName:"Account",type:"Type",priority:"Priority",status:"Status",created:"Created"},fullWidthFields:[]},
  campaigns:{label:"Campaigns",data:CAMPAIGNS,cols:["name","type","status","startDate","budget","leads"],colLabels:{name:"Name",type:"Type",status:"Status",startDate:"Start Date",budget:"Budget",leads:"Leads"},fullWidthFields:[]},
};

var FIELD_LABELS = {name:"Name",firstName:"First Name",lastName:"Last Name",company:"Company",email:"Email",phone:"Phone",title:"Title",accountName:"Account",accountId:"Account ID",city:"City",industry:"Industry",owner:"Owner",revenue:"Revenue",employees:"Employees",status:"Status",created:"Created",website:"Website",address:"Address",amount:"Amount",stage:"Stage",probability:"Probability",closeDate:"Close Date",budget:"Budget",startDate:"Start Date",endDate:"End Date",manager:"Manager",phase:"Phase",source:"Source",opportunityName:"Opportunity",validUntil:"Valid Until",type:"Type",subject:"Subject",date:"Date",time:"Time",contactName:"Contact",notes:"Notes",dueDate:"Due Date",priority:"Priority",relatedTo:"Related To",leads:"Leads"};
