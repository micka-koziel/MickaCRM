// ═══════════════════════════════════════════
// app.js — Firebase Config + CRUD MickaCRM
// ═══════════════════════════════════════════

// ── Firebase Config ──
const firebaseConfig = {
  apiKey: "AIzaSyCzjB9jKMNqY-Elw9OZ83UISqWMuhqEHSU",
  authDomain: "micka-crm-sales-hyper-force.firebaseapp.com",
  projectId: "micka-crm-sales-hyper-force",
  storageBucket: "micka-crm-sales-hyper-force.firebasestorage.app",
  messagingSenderId: "620928131928",
  appId: "1:620928131928:web:e4893cc6c5ecc9637d3b2d"
};

// ── Init Firebase & Firestore ──
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ═══════════════════════════════════════════
// CRUD GÉNÉRIQUE
// ═══════════════════════════════════════════

// Ajouter un document
async function addDoc(collection, data) {
  try {
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    const ref = await db.collection(collection).add(data);
    console.log(`✅ Ajouté dans ${collection} : ${ref.id}`);
    return ref.id;
  } catch (e) {
    console.error(`❌ Erreur ajout ${collection}:`, e);
    return null;
  }
}

// Lire tous les documents d'une collection
async function getDocs(collection, orderByField = 'createdAt', direction = 'desc') {
  try {
    const snapshot = await db.collection(collection)
      .orderBy(orderByField, direction)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error(`❌ Erreur lecture ${collection}:`, e);
    return [];
  }
}

// Lire un seul document par ID
async function getDoc(collection, docId) {
  try {
    const doc = await db.collection(collection).doc(docId).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    }
    console.warn(`⚠️ Document ${docId} introuvable dans ${collection}`);
    return null;
  } catch (e) {
    console.error(`❌ Erreur lecture doc ${collection}/${docId}:`, e);
    return null;
  }
}

// Mettre à jour un document
async function updateDoc(collection, docId, data) {
  try {
    data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection(collection).doc(docId).update(data);
    console.log(`✅ Mis à jour ${collection}/${docId}`);
    return true;
  } catch (e) {
    console.error(`❌ Erreur update ${collection}/${docId}:`, e);
    return false;
  }
}

// Supprimer un document
async function deleteDoc(collection, docId) {
  try {
    await db.collection(collection).doc(docId).delete();
    console.log(`✅ Supprimé ${collection}/${docId}`);
    return true;
  } catch (e) {
    console.error(`❌ Erreur suppression ${collection}/${docId}:`, e);
    return false;
  }
}

// Recherche simple (un champ == une valeur)
async function queryDocs(collection, field, operator, value) {
  try {
    const snapshot = await db.collection(collection)
      .where(field, operator, value)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error(`❌ Erreur query ${collection}:`, e);
    return [];
  }
}

// Compter les documents d'une collection
async function countDocs(collection) {
  try {
    const snapshot = await db.collection(collection).get();
    return snapshot.size;
  } catch (e) {
    console.error(`❌ Erreur count ${collection}:`, e);
    return 0;
  }
}

// ═══════════════════════════════════════════
// SEED : Données de démo
// ═══════════════════════════════════════════
async function seedDemoData() {
  // Vérifier si les données existent déjà
  const existingAccounts = await getDocs('accounts');
  if (existingAccounts.length > 0) {
    console.log('ℹ️ Données démo déjà présentes, seed ignoré.');
    return;
  }

  console.log('🌱 Insertion des données de démo...');

  // Accounts
  const acc1 = await addDoc('accounts', { name: 'Bouygues Construction', industry: 'BTP', city: 'Paris', phone: '01 42 00 00 00', status: 'Actif' });
  const acc2 = await addDoc('accounts', { name: 'Vinci Immobilier', industry: 'Immobilier', city: 'Lyon', phone: '04 78 00 00 00', status: 'Actif' });
  const acc3 = await addDoc('accounts', { name: 'Eiffage Énergie', industry: 'Énergie', city: 'Marseille', phone: '04 91 00 00 00', status: 'Nouveau' });

  // Contacts
  await addDoc('contacts', { firstName: 'Jean', lastName: 'Valjean', email: 'jean.v@bouygues.fr', phone: '06 12 34 56 78', accountId: acc1, accountName: 'Bouygues Construction', role: 'Directeur achats' });
  await addDoc('contacts', { firstName: 'Marie', lastName: 'Curie', email: 'm.curie@vinci.fr', phone: '06 98 76 54 32', accountId: acc2, accountName: 'Vinci Immobilier', role: 'Responsable projets' });
  await addDoc('contacts', { firstName: 'Paul', lastName: 'Durand', email: 'p.durand@eiffage.fr', phone: '06 11 22 33 44', accountId: acc3, accountName: 'Eiffage Énergie', role: 'Chef de chantier' });

  // Opportunities
  await addDoc('opportunities', { name: 'Rénovation Tour Eiffel', accountId: acc1, accountName: 'Bouygues Construction', amount: 320000, stage: 'Négociation', closeDate: '2026-04-15', probability: 60 });
  await addDoc('opportunities', { name: 'Vitrage Résidence Azur', accountId: acc2, accountName: 'Vinci Immobilier', amount: 85000, stage: 'Gagné', closeDate: '2026-03-01', probability: 100 });
  await addDoc('opportunities', { name: 'Isolation Hôpital Nord', accountId: acc3, accountName: 'Eiffage Énergie', amount: 540000, stage: 'Proposition', closeDate: '2026-06-30', probability: 40 });
  await addDoc('opportunities', { name: 'Façade Campus Tech', accountId: acc1, accountName: 'Bouygues Construction', amount: 210000, stage: 'Perdu', closeDate: '2026-02-28', probability: 0 });

  // Leads
  await addDoc('leads', { firstName: 'Thomas', lastName: 'Petit', company: 'Lafarge SA', source: 'Salon BTP', status: 'Nouveau', email: 't.petit@lafarge.fr' });
  await addDoc('leads', { firstName: 'Claire', lastName: 'Bonnet', company: 'Nexity', source: 'Site web', status: 'Contacté', email: 'c.bonnet@nexity.fr' });

  // Cases
  await addDoc('cases', { number: 'CAS-0042', subject: 'Fissure vitrage lot 3', priority: 'Haute', status: 'Ouvert', assignedTo: 'Marc Dupont' });
  await addDoc('cases', { number: 'CAS-0041', subject: 'Retard livraison', priority: 'Moyenne', status: 'Résolu', assignedTo: 'Sophie Martin' });

  // Campaigns
  await addDoc('campaigns', { name: 'Salon BTP 2026', type: 'Événement', status: 'Active', budget: 25000, startDate: '2026-05-01' });
  await addDoc('campaigns', { name: 'Emailing Q2', type: 'Email', status: 'Planifiée', budget: 5000, startDate: '2026-04-01' });

  console.log('✅ Données de démo insérées !');
}

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════

// Formater un montant en euros
function formatEuro(amount) {
  if (!amount && amount !== 0) return '—';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
}

// Formater une date Firestore en DD/MM/YYYY
function formatDate(timestamp) {
  if (!timestamp) return '—';
  let date;
  if (timestamp.toDate) {
    date = timestamp.toDate();
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else {
    return '—';
  }
  return date.toLocaleDateString('fr-FR');
}

// Générer un badge statut HTML
function statusBadge(status) {
  const map = {
    'Actif': 'active', 'Active': 'active', 'En cours': 'active',
    'Nouveau': 'new', 'Nouvelle': 'new', 'Planifiée': 'new', 'Planifié': 'new',
    'Négociation': 'open', 'Proposition': 'open', 'En attente': 'open', 'Ouvert': 'open', 'Contacté': 'open',
    'Gagné': 'won', 'Accepté': 'won', 'Résolu': 'won', 'Payée': 'won', 'Livrée': 'won',
    'Perdu': 'lost', 'Fermé': 'lost', 'Annulé': 'lost',
  };
  const cls = map[status] || 'open';
  return `<span class="status-badge ${cls}">${status}</span>`;
}

// Notification toast simple
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
