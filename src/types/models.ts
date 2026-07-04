export interface Membre {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  dateInscription: string;
  statut: string;
}

export interface Actualite {
  id: string;
  titre: string;
  description: string;
  contenu: string;
  datePublication: string;
  image: string;
  auteur: string;
}

export interface Sermon {
  id: string;
  titre: string;
  predicateur: string;
  date: string;
  versetRef: string;
  description: string;
  lienYoutube: string;
  lienAudio: string;
}

export interface Evenement {
  id: string;
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  lieu: string;
  image: string;
  categorie: string;
}

export interface Don {
  id: string;
  nomDonateur: string;
  telephone: string;
  montant: number;
  typeDon: 'Dîme' | 'Offrande' | 'Construction' | 'Social' | 'Mission';
  modePaiement: 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money' | 'Carte Bancaire';
  date: string;
  commentaire?: string;
}

export interface DemandePriere {
  id: string;
  nom: string;
  telephone: string;
  sujet: string;
  message: string;
  date: string;
  statut: 'A_TRAITER' | 'EN_PRIERE' | 'EXAUCE';
}

export interface NotificationMed {
  id: string;
  message: string;
  date: string;
  lu: boolean;
}

export interface Meditation {
  id: string;
  titre: string;
  versetRef: string;
  versetTexte: string;
  contenu: string;
  date: string;
  auteur: string;
}

export interface Suggestion {
  id: string;
  nom: string;
  telephone: string;
  sujet: string;
  message: string;
  date: string;
}

export interface ModificationTx {
  date: string;
  ancienMontant: number;
  nouveauMontant: number;
}

export interface Transaction {
  id: string;
  idCaisse: string;
  idMembre: string;
  montant: number;
  commentaire: string;
  date: string;
  modifications?: ModificationTx[];
  typeDon?: string;
  modePaiement?: string;
}

export interface Caisse {
  id: string;
  nom: string;
  code: string;
  responsable: string;
  objectif: number;
  categorie: string;
  description: string;
  dateCreation: string;
  cotisants: Record<string, number>;
  archivee: boolean;
}

export interface Action {
  id: string;
  code: string;
  libelle: string;
  description: string;
}

export interface Menu {
  id: string;
  code: string;
  libelle: string;
  chemin: string;
  icone: string;
  actionsDisponibles: string[];
}

export interface HabilitationProfil {
  menuId: string;
  actions: string[];
}

export interface Profil {
  id: string;
  code: string;
  libelle: string;
  description: string;
  habilitations: HabilitationProfil[];
}

export interface UtilisateurDashboard {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  profilId: string;
  actif: boolean;
  dateCreation: string;
}

export interface AuditTrace {
  id: string;
  date: string;
  utilisateur: string;
  action: string;
  entite: string;
  details: string;
}
