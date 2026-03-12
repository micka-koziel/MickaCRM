// ============================================================
// MICKACRM 360 — CONFIG.JS
// Firebase configuration + App constants
// ============================================================

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "micka-crm-sales-hyper-force.firebaseapp.com",
  projectId: "micka-crm-sales-hyper-force",
  storageBucket: "micka-crm-sales-hyper-force.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxxxxxxxxxx"
};

// ─── Design Tokens (JS mirror of CSS variables) ────────────────
const COLORS = {
  imperial: "#0F5299",
  blu: "#0195D6",
  teal: "#4DB1B3",
  red: "#E83430",
  rasp: "#C5284C",
  orange: "#E66407",
  purp: "#7c3aed",
  success: "#10b981",
  warn: "#f59e0b",
  bg: "#f3f4f7",
  white: "#ffffff",
  border: "#e4e8ee",
  borderLight: "#eef1f5",
  text: "#111827",
  text2: "#5b6478",
  muted: "#9ca3af",
};

// ─── Badge Color Map ───────────────────────────────────────────
const BADGE_COLORS = {
  Client: COLORS.success,
  Prospect: COLORS.blu,
  Nouveau: COLORS.teal,
  "Contacté": COLORS.orange,
  "Qualifié": COLORS.imperial,
  Haute: COLORS.red,
  Critique: COLORS.rasp,
  Moyenne: COLORS.orange,
  Basse: COLORS.teal,
  Ouvert: COLORS.red,
  "En cours": COLORS.orange,
  "Résolu": COLORS.success,
  "À faire": COLORS.muted,
  Brouillon: COLORS.muted,
  "Envoyé": COLORS.blu,
  "Accepté": COLORS.success,
  Actif: COLORS.success,
  "Planifié": COLORS.blu,
  "Terminé": COLORS.muted,
  Construction: COLORS.orange,
  "Pré-étude": COLORS.teal,
};

// ─── Pipeline Stages ───────────────────────────────────────────
const STAGES = [
  { key: "Lead identifié",      short: "Lead",        color: COLORS.muted   },
  { key: "Étude préalable",     short: "Étude",       color: COLORS.teal    },
  { key: "Appel d'offres",      short: "AO",          color: COLORS.blu     },
  { key: "Proposition soumise", short: "Proposition",  color: COLORS.orange  },
  { key: "Négociation",         short: "Négo",        color: COLORS.warn    },
  { key: "Contrat signé",       short: "Signé",       color: COLORS.success },
];

// ─── Activity Icons & Colors ───────────────────────────────────
const ACTIVITY_ICONS = {
  "Appel": "📞",
  "Réunion": "🤝",
  "Visite chantier": "🏗️",
  "Email": "✉️"
};
const ACTIVITY_COLORS = {
  "Appel": COLORS.blu,
  "Réunion": COLORS.purp,
  "Visite chantier": COLORS.orange,
  "Email": COLORS.teal
};

// ─── Quick Create Options ──────────────────────────────────────
const QUICK_CREATE = ["accounts", "contacts", "leads", "opportunities", "projects"];

// ─── Quick Actions (Dashboard) ─────────────────────────────────
const QUICK_ACTIONS = [
  { icon: "🏢", label: "Compte",      obj: "accounts",      bg: "linear-gradient(135deg,#0F5299,#0B6BCB)" },
  { icon: "👤", label: "Contact",     obj: "contacts",      bg: "linear-gradient(135deg,#0195D6,#4DB1B3)" },
  { icon: "🎯", label: "Lead",        obj: "leads",         bg: "linear-gradient(135deg,#7c3aed,#a78bfa)" },
  { icon: "💰", label: "Opportunité", obj: "opportunities", bg: "linear-gradient(135deg,#E66407,#f59e0b)" },
  { icon: "🏗️", label: "Projet",      obj: "projects",      bg: "linear-gradient(135deg,#C5284C,#E83430)" },
];
