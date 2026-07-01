import axios from 'axios';
import { useDonneesStore } from '../stores/useDonneesStore';
import { useAuthStore } from '../stores/useAuthStore';

// Création de l'instance Axios
const client = axios.create({
  baseURL: 'https://api.medecci.org/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour injecter le token d'authentification JWT
client.interceptors.request.use(
  (config) => {
    const jeton = useAuthStore.getState().jeton;
    if (jeton && config.headers) {
      config.headers.Authorization = `Bearer ${jeton}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs globales (ex: expiration de session 401)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().deconnexion();
    }
    return Promise.reject(error);
  }
);

// Simulation de l'API avec un adaptateur Axios customisé
client.defaults.adapter = async (config: any): Promise<any> => {
  // Simuler le délai réseau (latence de 400ms pour voir les loaders et squelettes de chargement)
  await new Promise((resolve) => setTimeout(resolve, 400));

  const url = config.url || '';
  const methode = config.method?.toUpperCase() || 'GET';
  const donneesStore = useDonneesStore.getState();

  // Extraction du corps de la requête
  let corps: any = {};
  if (config.data) {
    try {
      corps = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch {
      corps = config.data;
    }
  }

  // 1. Authentification avec Habilitations (multi-comptes)
  if (url.includes('/auth/connexion') && methode === 'POST') {
    const { email, password } = corps;
    
    let utilisateurObj: any = null;
    
    if (email === 'admin@medecci.org' && password === 'admin123') {
      utilisateurObj = {
        id: 'u-admin',
        nom: 'Koffi',
        prenom: 'Yao Emmanuel',
        email: 'admin@medecci.org',
        role: 'ADMIN' as const,
      };
    } else if (email === 'pasteur@medecci.org' && password === 'pasteur123') {
      utilisateurObj = {
        id: 'u-pasteur',
        nom: 'Yao',
        prenom: 'Pasteur Koffi',
        email: 'pasteur@medecci.org',
        role: 'PASTEUR' as const,
      };
    } else if (email === 'tresorier@medecci.org' && password === 'tresorier123') {
      utilisateurObj = {
        id: 'u-tresorier',
        nom: 'Kouassi',
        prenom: 'Jean-Pierre',
        email: 'tresorier@medecci.org',
        role: 'TRESORIER' as const,
      };
    }

    if (utilisateurObj) {
      return {
        data: { utilisateur: utilisateurObj, jeton: 'simulated-jwt-token-xyz' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    } else {
      return Promise.reject({
        response: {
          status: 400,
          data: { message: 'Identifiants de connexion incorrects. Utilisez admin@medecci.org / admin123, pasteur@medecci.org / pasteur123, ou tresorier@medecci.org / tresorier123' },
        },
      });
    }
  }

  // 2. Modification Profil Utilisateur
  if (url.includes('/profil') && methode === 'PUT') {
    const { nom, prenom, email, telephone } = corps;
    const currentUtilisateur = useAuthStore.getState().utilisateur;
    if (currentUtilisateur) {
      const updatedUser = {
        ...currentUtilisateur,
        nom: nom || currentUtilisateur.nom,
        prenom: prenom || currentUtilisateur.prenom,
        email: email || currentUtilisateur.email,
        telephone: telephone || currentUtilisateur.telephone
      };
      return {
        data: updatedUser,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
  }

  // 3. Gestion des Membres
  if (url.includes('/membres')) {
    if (methode === 'GET') {
      return {
        data: donneesStore.membres,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (methode === 'POST') {
      donneesStore.ajouterMembre(corps);
      const membresMisAJour = useDonneesStore.getState().membres;
      return {
        data: membresMisAJour[0],
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }
    if (methode === 'PUT') {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || '';
      donneesStore.modifierMembre(id, corps);
      const membreModifie = useDonneesStore.getState().membres.find((m) => m.id === id);
      return {
        data: membreModifie,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (methode === 'DELETE') {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || '';
      donneesStore.supprimerMembre(id);
      return {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
  }

  // 4. Gestion des Actualités
  if (url.includes('/actualites')) {
    if (methode === 'GET') {
      return {
        data: donneesStore.actualites,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (methode === 'POST') {
      donneesStore.ajouterActualite(corps);
      const actus = useDonneesStore.getState().actualites;
      return {
        data: actus[0],
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }
    if (methode === 'PUT') {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || '';
      donneesStore.modifierActualite(id, corps);
      const actuModifiee = useDonneesStore.getState().actualites.find((a) => a.id === id);
      return {
        data: actuModifiee,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (methode === 'DELETE') {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || '';
      donneesStore.supprimerActualite(id);
      return {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
  }

  // 5. Gestion des Sermons
  if (url.includes('/sermons')) {
    if (methode === 'GET') {
      return {
        data: donneesStore.sermons,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (methode === 'POST') {
      donneesStore.ajouterSermon(corps);
      const sermons = useDonneesStore.getState().sermons;
      return {
        data: sermons[0],
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }
    if (methode === 'PUT') {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || '';
      donneesStore.modifierSermon(id, corps);
      const sermonModifie = useDonneesStore.getState().sermons.find((s) => s.id === id);
      return {
        data: sermonModifie,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (methode === 'DELETE') {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || '';
      donneesStore.supprimerSermon(id);
      return {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
  }

  // 6. Gestion des Événements
  if (url.includes('/evenements')) {
    if (methode === 'GET') {
      return {
        data: donneesStore.evenements,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (methode === 'POST') {
      donneesStore.ajouterEvenement(corps);
      const evs = useDonneesStore.getState().evenements;
      return {
        data: evs[0],
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }
    if (methode === 'PUT') {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || '';
      donneesStore.modifierEvenement(id, corps);
      const evModifie = useDonneesStore.getState().evenements.find((e) => e.id === id);
      return {
        data: evModifie,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (methode === 'DELETE') {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || '';
      donneesStore.supprimerEvenement(id);
      return {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
  }

  // 7. Gestion des Dons
  if (url.includes('/dons')) {
    if (methode === 'GET') {
      return {
        data: donneesStore.dons,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (methode === 'POST') {
      donneesStore.enregistrerDon(corps);
      const ds = useDonneesStore.getState().dons;
      return {
        data: ds[0],
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }
    if (methode === 'DELETE') {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || '';
      donneesStore.supprimerDon(id);
      return {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
  }

  // 8. Gestion des Prières
  if (url.includes('/prieres')) {
    if (methode === 'GET') {
      return {
        data: donneesStore.demandesPriere,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (methode === 'POST') {
      donneesStore.soumettreDemandePriere(corps);
      const prieres = useDonneesStore.getState().demandesPriere;
      return {
        data: prieres[0],
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }
    if (methode === 'PUT') {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || '';
      if (corps.statut) {
        donneesStore.modifierStatutPriere(id, corps.statut);
      }
      const priereModifiee = useDonneesStore.getState().demandesPriere.find((dp) => dp.id === id);
      return {
        data: priereModifiee,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (methode === 'DELETE') {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || '';
      donneesStore.supprimerDemandePriere(id);
      return {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
  }

  // 9. Gestion des Notifications
  if (url.includes('/notifications')) {
    if (methode === 'GET') {
      return {
        data: donneesStore.notifications,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (url.includes('/lu') && methode === 'PUT') {
      const parts = url.split('/');
      const id = parts[parts.length - 2] || '';
      donneesStore.marquerNotificationLue(id);
      return {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (methode === 'DELETE') {
      donneesStore.effacerNotifications();
      return {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
  }

  // 10. Mocks financiers pour Caisses, Archives et Cotisations
  if (url.includes('/caisses')) {
    const parts = url.split('/');
    
    // PUT /caisses/:id/archiver
    if (url.endsWith('/archiver') && methode === 'PUT') {
      const id = parts[parts.length - 2] || '';
      donneesStore.archiverCaisse(id);
      const caisse = useDonneesStore.getState().caisses.find(c => c.id === id);
      return {
        data: caisse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    
    // PUT /caisses/:id/desarchiver
    if (url.endsWith('/desarchiver') && methode === 'PUT') {
      const id = parts[parts.length - 2] || '';
      donneesStore.desarchiverCaisse(id);
      const caisse = useDonneesStore.getState().caisses.find(c => c.id === id);
      return {
        data: caisse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }

    if (methode === 'GET') {
      return {
        data: donneesStore.caisses,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }

    if (methode === 'POST') {
      const { nom, description, code, responsable, objectif, categorie } = corps;
      const res = donneesStore.creerCaisse(nom, description, code, responsable, objectif, categorie);
      return {
        data: res.caisse,
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }

    if (methode === 'PUT') {
      const id = parts[parts.length - 1] || '';
      const { nom, description, code, responsable, objectif, categorie } = corps;
      const res = donneesStore.modifierCaisse(id, nom, description, code, responsable, objectif, categorie);
      return {
        data: res.caisse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }

    if (methode === 'DELETE') {
      const id = parts[parts.length - 1] || '';
      donneesStore.supprimerCaisse(id);
      return {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
  }

  if (url.includes('/cotisations')) {
    const parts = url.split('/');
    if (methode === 'POST') {
      const { idCaisse, idMembre, montant, commentaire } = corps;
      const res = donneesStore.enregistrerCotisation(idCaisse, idMembre, montant, commentaire);
      return {
        data: res.transaction,
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }

    if (methode === 'PUT') {
      const idTx = parts[parts.length - 1] || '';
      const { montant } = corps;
      const res = donneesStore.modifierCotisation(idTx, montant);
      return {
        data: res.transaction,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
  }

  // 11. Mock Méditations
  if (url.includes('/meditations')) {
    if (methode === 'GET') {
      return {
        data: donneesStore.meditations,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (methode === 'POST') {
      donneesStore.ajouterMeditation(corps);
      const meds = useDonneesStore.getState().meditations;
      return {
        data: meds[0],
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }
    if (methode === 'PUT') {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || '';
      donneesStore.modifierMeditation(id, corps);
      const medModifiee = useDonneesStore.getState().meditations.find((m) => m.id === id);
      return {
        data: medModifiee,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (methode === 'DELETE') {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || '';
      donneesStore.supprimerMeditation(id);
      return {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
  }

  // 12. Mock Suggestions
  if (url.includes('/suggestions')) {
    if (methode === 'GET') {
      return {
        data: donneesStore.suggestions,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    if (methode === 'POST') {
      donneesStore.soumettreSuggestion(corps);
      const sugs = useDonneesStore.getState().suggestions;
      return {
        data: sugs[0],
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }
    if (methode === 'DELETE') {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || '';
      donneesStore.supprimerSuggestion(id);
      return {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
  }

  return Promise.reject({
    response: {
      status: 404,
      data: { message: 'Ressource non trouvée dans le mock API.' },
    },
  });
};

export default client;
