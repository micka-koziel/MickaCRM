// ============================================================
// MICKACRM 360 v3 — CONFIG.JS
// ============================================================

var COLORS = {
  primary:"#2563eb", primaryLight:"#3b82f6", primarySubtle:"#eff6ff",
  bg:"#f8f9fb", white:"#ffffff",
  border:"#e5e7eb", borderLight:"#f0f1f3",
  text:"#0f172a", text2:"#475569", muted:"#94a3b8", subtle:"#cbd5e1",
  success:"#059669", warn:"#d97706", red:"#dc2626",
  stageGray:"#94a3b8", stageTeal:"#0d9488", stageBlue:"#2563eb",
  stageAmber:"#d97706", stageOrange:"#ea580c", stageGreen:"#059669",
};

var BADGE_COLORS = {
  Client:COLORS.success, Prospect:COLORS.primary, Nouveau:COLORS.stageTeal,
  "Contacté":COLORS.warn, "Qualifié":COLORS.primary,
  Haute:COLORS.red, Critique:"#9f1239", Moyenne:COLORS.warn, Basse:COLORS.stageTeal,
  Ouvert:COLORS.red, "En cours":COLORS.warn, "Résolu":COLORS.success,
  "À faire":COLORS.muted, Brouillon:COLORS.muted,
  "Envoyé":COLORS.primary, "Accepté":COLORS.success,
  Actif:COLORS.success, "Planifié":COLORS.primary, "Terminé":COLORS.muted,
  Construction:COLORS.warn, "Pré-étude":COLORS.stageTeal,
};

var STAGES = [
  {key:"Lead identifié",     short:"Lead",       color:COLORS.stageGray},
  {key:"Étude préalable",    short:"Étude",      color:COLORS.stageTeal},
  {key:"Appel d'offres",     short:"AO",         color:COLORS.stageBlue},
  {key:"Proposition soumise",short:"Proposition", color:COLORS.stageAmber},
  {key:"Négociation",        short:"Négo",       color:COLORS.stageOrange},
  {key:"Contrat signé",      short:"Signé",      color:COLORS.stageGreen},
];

var ACTIVITY_ICONS  = {"Appel":"phone","Réunion":"users","Visite chantier":"hardhat","Email":"mail"};
var ACTIVITY_COLORS = {"Appel":COLORS.primary,"Réunion":"#7c3aed","Visite chantier":COLORS.warn,"Email":COLORS.stageTeal};

var QUICK_CREATE = ["accounts","contacts","leads","opportunities","projects"];

// ─── SVG Icon Data (Lucide-style) ─────────────────────────────
var ICON_DATA = {
  pipeline:  {paths:["M12 20V10","M18 20V4","M6 20v-4"]},
  trophy:    {paths:["M6 9H4.5a2.5 2.5 0 0 1 0-5H6","M18 9h1.5a2.5 2.5 0 0 0 0-5H18","M4 22h16","M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22","M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22","M18 2H6v7a6 6 0 0 0 12 0V2Z"]},
  building:  {rects:[[4,2,16,20,2]],paths:["M9 22v-4h6v4","M8 6h.01","M16 6h.01","M12 6h.01","M12 10h.01","M12 14h.01","M16 10h.01","M16 14h.01","M8 10h.01","M8 14h.01"]},
  target:    {circles:[[12,12,10],[12,12,6],[12,12,2]]},
  user:      {paths:["M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"],circles:[[12,7,4]]},
  briefcase: {rects:[[2,7,20,14,2]],paths:["M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"]},
  layers:    {paths:["m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.84Z","m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65","m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"]},
  plus:      {paths:["M5 12h14","M12 5v14"]},
  phone:     {paths:["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"]},
  mail:      {rects:[[2,4,20,16,2]],paths:["m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"]},
  hardhat:   {paths:["M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2Z","M10 15V6.5a2 2 0 0 1 4 0V15","M4 15v-3a8 8 0 0 1 16 0v3"]},
  users:     {paths:["M18 21a8 8 0 0 0-16 0","M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"],circles:[[10,8,5]]},
  chevRight: {paths:["m9 18 6-6-6-6"]},
  search:    {circles:[[11,11,8]],paths:["m21 21-4.3-4.3"]},
  clock:     {circles:[[12,12,10]],paths:["M12 6v6l4 2"]},
  check:     {paths:["M20 6 9 17l-5-5"]},
  file:      {paths:["M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z","M14 2v4a2 2 0 0 0 2 2h4"]},
  megaphone: {paths:["m3 11 18-5v12L3 13v-2Z","M11.6 16.8a3 3 0 1 1-5.8-1.6"]},
  wrench:    {paths:["M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"]},
  kanban:    {rects:[[3,3,18,18,2]],paths:["M8 7v7","M12 7v4","M16 7v10"]},
};

var OBJ_ICON_MAP = {
  accounts:"building", contacts:"user", leads:"target", opportunities:"briefcase",
  projects:"layers", quotes:"file", activities:"phone", tasks:"check",
  cases:"wrench", campaigns:"megaphone",
};
