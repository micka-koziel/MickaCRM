/* js/core/i18n.js — Internationalisation maison (FR/EN)
 * Dépendances : namespace.js
 * Expose : MickaCRM.core.i18n = { t, setLocale, getLocale, addDict }
 *
 * Usage : t('auth.login'), t('common.save'), t('list.empty')
 */
(function(){
  var DICTS = {
    fr: {
      common: {
        save: 'Enregistrer',
        cancel: 'Annuler',
        delete: 'Supprimer',
        edit: 'Modifier',
        close: 'Fermer',
        loading: 'Chargement…',
        empty: 'Aucune donnée',
        search: 'Rechercher',
        yes: 'Oui',
        no: 'Non',
        confirm: 'Confirmer',
        error: 'Erreur',
        success: 'Succès'
      },
      auth: {
        title: 'Micka CRM',
        subtitle: 'Connectez-vous pour continuer',
        email: 'Email',
        password: 'Mot de passe',
        login: 'Se connecter',
        signup: 'Créer un compte',
        google: 'Continuer avec Google',
        magic: 'Lien magique par email',
        logout: 'Se déconnecter',
        forgot: 'Mot de passe oublié ?',
        or: 'ou'
      },
      nav: {
        dashboard: 'Tableau de bord',
        leads: 'Leads',
        accounts: 'Comptes',
        opportunities: 'Opportunités',
        projects: 'Projets',
        quotes: 'Devis',
        claims: 'Réclamations',
        activities: 'Activités',
        products: 'Produits',
        users: 'Utilisateurs',
        agents: 'Agents IA'
      }
    },
    en: {
      common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        loading: 'Loading…',
        empty: 'No data',
        search: 'Search',
        yes: 'Yes',
        no: 'No',
        confirm: 'Confirm',
        error: 'Error',
        success: 'Success'
      },
      auth: {
        title: 'Micka CRM',
        subtitle: 'Sign in to continue',
        email: 'Email',
        password: 'Password',
        login: 'Sign in',
        signup: 'Create account',
        google: 'Continue with Google',
        magic: 'Magic email link',
        logout: 'Sign out',
        forgot: 'Forgot password?',
        or: 'or'
      },
      nav: {
        dashboard: 'Dashboard',
        leads: 'Leads',
        accounts: 'Accounts',
        opportunities: 'Opportunities',
        projects: 'Projects',
        quotes: 'Quotes',
        claims: 'Claims',
        activities: 'Activities',
        products: 'Products',
        users: 'Users',
        agents: 'AI Agents'
      }
    }
  };

  function getLocale(){ return MickaCRM.state.locale || 'fr'; }

  function setLocale(loc){
    if (!DICTS[loc]) {
      console.warn('[i18n] Locale non supportée :', loc);
      return;
    }
    MickaCRM.state.locale = loc;
    document.documentElement.setAttribute('lang', loc);
    document.dispatchEvent(new CustomEvent('mickacrm:locale-changed', {detail:{locale:loc}}));
  }

  function t(key, vars){
    var loc = getLocale();
    var dict = DICTS[loc] || DICTS.fr;
    var parts = String(key).split('.');
    var val = dict;
    for (var i = 0; i < parts.length; i++) {
      if (val && typeof val === 'object') val = val[parts[i]];
      else { val = null; break; }
    }
    if (val == null) {
      // fallback FR
      val = DICTS.fr;
      for (var j = 0; j < parts.length; j++) val = val ? val[parts[j]] : null;
    }
    if (val == null) return key;
    if (vars && typeof val === 'string') {
      Object.keys(vars).forEach(function(k){
        val = val.replace(new RegExp('\\{'+k+'\\}', 'g'), vars[k]);
      });
    }
    return val;
  }

  // Fusionne un dict de module dans le dict principal
  function addDict(loc, dict){
    if (!DICTS[loc]) DICTS[loc] = {};
    Object.keys(dict).forEach(function(k){
      DICTS[loc][k] = Object.assign(DICTS[loc][k] || {}, dict[k]);
    });
  }

  MickaCRM.core.i18n = {
    t: t,
    setLocale: setLocale,
    getLocale: getLocale,
    addDict: addDict
  };

  // Raccourci global optionnel
  window.t = t;
})();
