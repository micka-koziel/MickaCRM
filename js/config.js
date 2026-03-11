/* ============================================
   MickaCRM — config.js
   Firebase config + Global namespace
   ============================================ */

// Global namespace
window.MickaCRM = window.MickaCRM || {};

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBY0KrO3hSsL0VKiWGmPbBJwMveRtmMNRY",
  authDomain: "micka-crm-sales-hyper-force.firebaseapp.com",
  projectId: "micka-crm-sales-hyper-force",
  storageBucket: "micka-crm-sales-hyper-force.appspot.com",
  messagingSenderId: "481aborné878631",
  appId: "1:481878631:web:placeholder"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Expose
MickaCRM.db = db;
