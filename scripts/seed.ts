import bcrypt from 'bcryptjs';
import { connectDB } from '../src/lib/mongodb';
import Membre from '../src/models/Membre';
import Actualite from '../src/models/Actualite';
import Sermon from '../src/models/Sermon';
import Evenement from '../src/models/Evenement';
import Don from '../src/models/Don';
import DemandePriere from '../src/models/DemandePriere';
import Notification from '../src/models/Notification';
import Meditation from '../src/models/Meditation';
import Suggestion from '../src/models/Suggestion';
import Caisse from '../src/models/Caisse';
import Transaction from '../src/models/Transaction';
import Categorie from '../src/models/Categorie';
import Statut from '../src/models/Statut';
import Action from '../src/models/Action';
import Menu from '../src/models/Menu';
import Profil from '../src/models/Profil';
import UtilisateurDashboard from '../src/models/UtilisateurDashboard';
import AuditTrace from '../src/models/AuditTrace';

// ─────────────────────────────────────────────────────────────────────────────
// DONNÉES SOURCES (reprises de l'ancien state mock)
// ─────────────────────────────────────────────────────────────────────────────

const actionsInitiales = [
  { mockId: 'act-1', code: 'VOIR', libelle: 'Voir', description: 'Consulter et visualiser les données' },
  { mockId: 'act-2', code: 'CREER', libelle: 'Créer', description: 'Ajouter de nouveaux enregistrements' },
  { mockId: 'act-3', code: 'MODIFIER', libelle: 'Modifier', description: 'Éditer des enregistrements existants' },
  { mockId: 'act-4', code: 'SUPPRIMER', libelle: 'Supprimer', description: 'Supprimer des enregistrements' },
  { mockId: 'act-5', code: 'EXPORTER', libelle: 'Exporter', description: 'Exporter les données (PDF, Excel...)' },
];

const menusInitiaux = [
  { mockId: 'mnu-1', code: 'TABLEAU_BORD', libelle: 'Tableau de bord', chemin: '/admin', icone: 'LayoutDashboard', actionsDisponibles: ['act-1'] },
  { mockId: 'mnu-2', code: 'CAISSES', libelle: 'Caisses (Fonds)', chemin: '/admin/caisses', icone: 'Folder', actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4', 'act-5'] },
  { mockId: 'mnu-3', code: 'MEMBRES', libelle: 'Fidèles Cotisants', chemin: '/admin/membres', icone: 'Users', actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4', 'act-5'] },
  { mockId: 'mnu-4', code: 'ARCHIVES', libelle: 'Archives Caisses', chemin: '/admin/archives', icone: 'Trash2', actionsDisponibles: ['act-1', 'act-4'] },
  { mockId: 'mnu-5', code: 'HISTORIQUE', libelle: 'Historique Global', chemin: '/admin/historique', icone: 'History', actionsDisponibles: ['act-1', 'act-5'] },
  { mockId: 'mnu-6', code: 'PARAMETRAGE', libelle: 'Paramétrages', chemin: '/admin/parametrage', icone: 'Sliders', actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4'] },
  { mockId: 'mnu-7', code: 'DONS', libelle: 'Dons en Ligne', chemin: '/admin/dons', icone: 'Heart', actionsDisponibles: ['act-1', 'act-3', 'act-4', 'act-5'] },
  { mockId: 'mnu-8', code: 'MEDITATIONS', libelle: 'Méditations', chemin: '/admin/meditations', icone: 'BookOpen', actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4'] },
  { mockId: 'mnu-9', code: 'SUGGESTIONS', libelle: 'Suggestions', chemin: '/admin/suggestions', icone: 'Inbox', actionsDisponibles: ['act-1', 'act-4'] },
  { mockId: 'mnu-10', code: 'ACTUALITES', libelle: 'Actualités', chemin: '/admin/actualites', icone: 'Newspaper', actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4'] },
  { mockId: 'mnu-11', code: 'SERMONS', libelle: 'Sermons', chemin: '/admin/sermons', icone: 'Mic', actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4'] },
  { mockId: 'mnu-12', code: 'EVENEMENTS', libelle: 'Événements', chemin: '/admin/evenements', icone: 'Calendar', actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4'] },
  { mockId: 'mnu-13', code: 'PRIERES', libelle: 'Demandes de Prière', chemin: '/admin/prieres', icone: 'HeartHandshake', actionsDisponibles: ['act-1', 'act-3', 'act-4'] },
  { mockId: 'mnu-14', code: 'PARAMETRES', libelle: 'Mon Profil', chemin: '/admin/parametres', icone: 'Settings', actionsDisponibles: ['act-1', 'act-3'] },
  { mockId: 'mnu-15', code: 'PROFILS', libelle: 'Profils & Habilitations', chemin: '/admin/profils', icone: 'ShieldCheck', actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4'] },
  { mockId: 'mnu-16', code: 'UTILISATEURS', libelle: 'Utilisateurs Dashboard', chemin: '/admin/utilisateurs-dashboard', icone: 'UserCog', actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4'] },
];

const profilsInitiaux = [
  {
    mockId: 'prf-1',
    code: 'ADMIN_COMPLET',
    libelle: 'Administrateur Complet',
    description: 'Accès total à toutes les fonctionnalités du dashboard',
    habilitations: menusInitiaux.map((m) => ({ menuMockId: m.mockId, actionsMockIds: [...m.actionsDisponibles] })),
  },
  {
    mockId: 'prf-2',
    code: 'TRESORIER',
    libelle: 'Trésorier',
    description: 'Accès limité aux modules financiers',
    habilitations: [
      { menuMockId: 'mnu-1', actionsMockIds: ['act-1'] },
      { menuMockId: 'mnu-2', actionsMockIds: ['act-1', 'act-2', 'act-3', 'act-4', 'act-5'] },
      { menuMockId: 'mnu-3', actionsMockIds: ['act-1', 'act-2', 'act-3', 'act-4', 'act-5'] },
      { menuMockId: 'mnu-4', actionsMockIds: ['act-1', 'act-4'] },
      { menuMockId: 'mnu-5', actionsMockIds: ['act-1', 'act-5'] },
      { menuMockId: 'mnu-6', actionsMockIds: ['act-1', 'act-2', 'act-3', 'act-4'] },
      { menuMockId: 'mnu-7', actionsMockIds: ['act-1', 'act-3', 'act-4', 'act-5'] },
    ],
  },
  {
    mockId: 'prf-3',
    code: 'PASTEUR',
    libelle: 'Pasteur',
    description: 'Accès aux contenus spirituels et publications',
    habilitations: [
      { menuMockId: 'mnu-1', actionsMockIds: ['act-1'] },
      { menuMockId: 'mnu-8', actionsMockIds: ['act-1', 'act-2', 'act-3', 'act-4'] },
      { menuMockId: 'mnu-9', actionsMockIds: ['act-1', 'act-4'] },
      { menuMockId: 'mnu-10', actionsMockIds: ['act-1', 'act-2', 'act-3', 'act-4'] },
      { menuMockId: 'mnu-11', actionsMockIds: ['act-1', 'act-2', 'act-3', 'act-4'] },
      { menuMockId: 'mnu-12', actionsMockIds: ['act-1', 'act-2', 'act-3', 'act-4'] },
      { menuMockId: 'mnu-13', actionsMockIds: ['act-1', 'act-3', 'act-4'] },
    ],
  },
];

const utilisateursDashboardInitiaux = [
  { nom: 'ADMIN', prenom: 'Super', email: 'admin@medec-ci.org', motDePasse: 'admin123', profilMockId: 'prf-1', actif: true },
  { nom: 'Yao', prenom: 'Pasteur Koffi', email: 'pasteur@medecci.org', motDePasse: 'pasteur123', profilMockId: 'prf-3', actif: true },
  { nom: 'Kouassi', prenom: 'Jean-Pierre', email: 'tresorier@medecci.org', motDePasse: 'tresorier123', profilMockId: 'prf-2', actif: true },
];

const membresInitiaux = [
  { mockId: 'm-1', nom: 'Koffi', prenom: 'Yao Emmanuel', telephone: '0707894512', email: 'koffi.yao@gmail.com', dateInscription: '2026-01-12T10:15:00Z', statut: 'Pasteur' },
  { mockId: 'm-2', nom: 'Amenan', prenom: 'Marie Grâce', telephone: '0505123456', email: 'grace.amenan@yahoo.fr', dateInscription: '2026-01-15T11:20:00Z', statut: 'Diaconesse' },
  { mockId: 'm-3', nom: 'Kouassi', prenom: 'Jean-Pierre', telephone: '0102030405', email: 'jp.kouassi@outlook.com', dateInscription: '2026-01-20T09:45:00Z', statut: 'Fidèle' },
  { mockId: 'm-4', nom: 'Aka', prenom: 'Marie-Therese', telephone: '0708091011', email: 'mt.aka@gmail.com', dateInscription: '2026-02-05T14:30:00Z', statut: 'Responsable' },
  { mockId: 'm-5', nom: 'Bamba', prenom: 'Moussa Christian', telephone: '0506070809', email: 'christian.bamba@gmail.com', dateInscription: '2026-02-18T16:00:00Z', statut: 'Fidèle' },
];

const actualitesInitiales = [
  { titre: 'Moi, je choisis la bonne part (Luc 10 V 42)', description: 'Le mot d\'ordre de la MEDEC-CI pour l\'année 2026 décrypté par notre Président, le Prophète ASSANDE Jacques.', contenu: 'ANNEE 2026 : « Moi, je choisis la bonne Part » ( Luc 10 V 42 )', datePublication: '2026-02-03T18:00:00Z', image: '/prophete_assande.png', auteur: 'Prophète ASSANDE Jacques' },
  { titre: 'Assemblée Générale Ordinaire de la MEDEC-CI', description: 'Rencontre de grande portée de la classe dirigeante au siège national de Koumassi.', contenu: 'La Mission Evangélique de Dieu En Christ de Côte d\'Ivoire, en abrégé MEDEC-CI organisait le dimanche 25 janvier 2026, une rencontre extraordinaire.', datePublication: '2026-01-29T18:00:00Z', image: '/photos/536271791_122121480098950124_7054135074380181107_n.jpg', auteur: 'Secrétariat Général' },
  { titre: 'Le "Culte des Cultes" Annuel à Lakota Centre', description: 'Une journée de reconnaissance intense sous le thème : "Les Adorateurs que le Père demande" (Jean 4 V 23).', contenu: 'La Mission Evangélique de Dieu En Christ Côte d\'Ivoire (MEDEC-CI) tenait le dimanche 16 novembre 2025, à Lakota Centre, son programme spécial annuel dénommé le " culte des cultes ".', datePublication: '2025-11-28T08:00:00Z', image: '/photos/547269147_122130082358950124_2503084973218367825_n.jpg', auteur: 'Apôtre NOUDE Hubert Tia' },
  { titre: 'Culte spécial d\'actions de Grâce au Siège', description: 'Une journée de reconnaissance d\'une ferveur exceptionnelle sous le thème "Remplissez d\'eau ces vases".', contenu: 'La Mission Evangélique de Dieu En Christ Côte d\'Ivoire, en abrégé MEDEC-CI, tenait le dimanche 28 septembre 2025 son culte spécial d\'actions de Grâce à l\'Eternel.', datePublication: '2025-10-01T10:00:00Z', image: '/photos/547839573_122130082790950124_5058513394213390579_n.jpg', auteur: 'Pasteur MORIBA Komon Joseph' },
  { titre: 'Journée du Jeune Serviteur de Dieu (2JSD) 2025', description: 'MEDEC-CI Gens bénis (Jean Folly) remporte la couronne après une compétition mémorable.', contenu: 'La Mission Evangélique de Dieu En Christ Côte d\'Ivoire en abrégé MEDEC-CI tenait le dimanche 14 septembre 2025 sa journée spéciale annuelle baptisée " Journée du Jeune serviteur de Dieu (2JSD) ".', datePublication: '2025-09-16T14:30:00Z', image: '/photos/529335511_122116495502950124_8998173950549340091_n.jpg', auteur: 'Pasteur DABONE Pascal' },
  { titre: 'Culte des Cultes de la Zone d\'Abidjan à Adjouffou', description: 'Rassemblement exceptionnel et ferveur divine autour du thème "Nous adorons ce que nous connaissons".', contenu: 'La Mission Évangélique de Dieu en Christ Côte d\'Ivoire ( MEDEC-CI) tenait le dimanche 17 août 2025, son culte spécial annuel, lequel baptisé Culte des cultes.', datePublication: '2025-08-23T18:00:00Z', image: '/photos/557089713_122134580036950124_8321083741924789744_n.jpg', auteur: 'Pasteur NAHOUNOU Éric' },
  { titre: 'Convention Nationale des Femmes - 7ème Édition', description: 'Deux journées glorieuses d\'intercession sous la présence du Prophète ASSANDE Jacques.', contenu: 'La Mission Evangélique de Dieu En Christ Côte d\'Ivoire en abrégé " MEDEC-CI " organisait à son siège la septième édition de la convention nationale des femmes.', datePublication: '2025-07-24T18:00:00Z', image: '/epouse_assande.png', auteur: 'Apôtre Christine ASSANDE' },
];

const sermonsInitiaux = [
  { titre: 'La Puissance de l\'Obéissance de la Foi', predicateur: 'Pasteur Koffi Yao Emmanuel', date: '2026-06-28', versetRef: 'Genèse 12:1-4 & Hébreux 11:8', description: 'Ce message explore comment l\'obéissance inconditionnelle à la Parole de Dieu déclenche des bénédictions générationnelles, à l\'image d\'Abraham.', lienYoutube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', lienAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { titre: 'Surmonter les Tempêtes de la Vie', predicateur: 'Pasteur Koffi Yao Emmanuel', date: '2026-06-21', versetRef: 'Marc 4:35-41', description: 'Comment réagir face aux tempêtes inattendues ? Le Pasteur nous enseigne à activer notre foi au lieu de succomber à la panique.', lienYoutube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', lienAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { titre: 'Bâtir une Famille selon le Cœur de Dieu', predicateur: 'Pasteur invité Kassi Jean-Baptiste', date: '2026-06-14', versetRef: 'Josué 24:14-18', description: 'Les clés bibliques indispensables pour restaurer l\'harmonie, le respect mutuel et l\'autel de prière dans nos foyers modernes.', lienYoutube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', lienAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

const evenementsInitiaux = [
  { titre: 'Grande Veillée de Prière - Impact & Onction', description: 'Une nuit de combat spirituel, de délivrance et d\'adoration pour terrasser les œuvres du mal.', dateDebut: '2026-07-03T22:00:00Z', dateFin: '2026-07-04T05:00:00Z', lieu: 'Temple Principal, Cocody Angré', image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=800', categorie: 'Prière' },
  { titre: 'Camp National de la Jeunesse (JMEDECCI)', description: '5 jours de ressourcement, de fraternité et de sport en forêt du Banco.', dateDebut: '2026-07-15T08:00:00Z', dateFin: '2026-07-19T18:00:00Z', lieu: 'Centre de Retraite JMEDECCI', image: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=800', categorie: 'Jeunesse' },
  { titre: 'Célébration Spéciale de la Fête des Mères', description: 'Un culte d\'honneur avec remise de présents à toutes les mamans de la communauté.', dateDebut: '2026-07-05T08:00:00Z', dateFin: '2026-07-05T12:00:00Z', lieu: 'Temple Principal, Cocody Angré', image: 'https://images.unsplash.com/photo-1544717277-994b96273b24?auto=format&fit=crop&q=80&w=800', categorie: 'Célébration' },
];

const donsInitiaux = [
  { nomDonateur: 'Kouassi Jean-Pierre', telephone: '0102030405', montant: 50000, typeDon: 'Dîme', modePaiement: 'Wave', date: '2026-06-28T11:45:00Z', commentaire: 'Dîme de Juin' },
  { nomDonateur: 'Amenan Marie Grâce', telephone: '0505123456', montant: 25000, typeDon: 'Offrande', modePaiement: 'Orange Money', date: '2026-06-28T12:00:00Z', commentaire: 'Offrande d\'action de grâce' },
  { nomDonateur: 'Anonyme', telephone: '0707070707', montant: 200000, typeDon: 'Construction', modePaiement: 'Carte Bancaire', date: '2026-06-25T15:30:00Z', commentaire: 'Soutien aux travaux du temple' },
  { nomDonateur: 'Bamba Moussa Christian', telephone: '0506070809', montant: 15000, typeDon: 'Social', modePaiement: 'MTN MoMo', date: '2026-06-24T18:20:00Z' },
];

const demandesPriereInitiales = [
  { nom: 'Kouamé Christiane', telephone: '0709485123', sujet: 'Guérison de ma mère', message: 'Ma mère souffre d\'une grave pneumonie depuis 2 semaines. Elle est hospitalisée. Je demande le soutien en prière de l\'église.', date: '2026-06-29T10:00:00Z', statut: 'EN_PRIERE' },
  { nom: 'Diomandé Lassina', telephone: '0505481236', sujet: 'Recherche d\'emploi', message: 'Je passe un entretien final de recrutement ce vendredi. Je prie pour la faveur de Dieu et la réussite.', date: '2026-06-29T15:45:00Z', statut: 'A_TRAITER' },
  { nom: 'Aka Amenan Rebecca', telephone: '0101458974', sujet: 'Voyage missionnaire', message: 'Action de grâce pour la protection de Dieu lors de mon retour de voyage de la semaine passée.', date: '2026-06-27T08:15:00Z', statut: 'EXAUCE' },
];

const meditationsInitiales = [
  { titre: 'La Puissance de la Persévérance dans la Prière', versetRef: 'Luc 18:1', versetTexte: 'Jésus leur adressa une parabole, pour montrer qu\'il faut toujours prier, et ne point se relâcher.', contenu: 'Dans notre marche avec Dieu, il y a des moments où les réponses à nos prières semblent tarder.', date: '2026-07-01T06:00:00Z', auteur: 'Prophète ASSANDE Jacques' },
  { titre: 'Choisir la Bonne Part au Quotidien', versetRef: 'Luc 10:42', versetTexte: 'Une seule chose est nécessaire. Marie a choisi la bonne part, qui ne lui sera point ôtée.', contenu: 'Comme Marthe, nous courons souvent après de nombreuses tâches quotidiennes légitimes, mais secondaires.', date: '2026-06-30T06:00:00Z', auteur: 'Pasteur Koffi Yao Emmanuel' },
];

const suggestionsInitiales = [
  { nom: 'Kouadio Kouamé Marc', telephone: '0707123456', sujet: 'Mise en place d\'une bibliothèque de livres chrétiens', message: 'Je suggère que nous mettions en place une petite bibliothèque physique au temple ou numérique sur le site web.', date: '2026-06-29T14:30:00Z' },
  { nom: 'Anonyme', telephone: '0505987654', sujet: 'Sonorisation extérieure', message: 'Il serait bien d\'ajuster la sonorisation extérieure lors des cultes du dimanche pour éviter de déranger le voisinage.', date: '2026-06-28T09:15:00Z' },
];

const categoriesInitiales = ['Dîmes & Offrandes', 'Investissement', 'Social & Assistance', 'Mission & Évangélisation'];
const statutsInitiales = ['Fidèle', 'Diacre', 'Diaconesse', 'Pasteur', 'Responsable'];

const caissesInitiales = [
  { mockId: 'caisse-dimes', nom: 'Dîmes ordinaires', code: 'DIM-ORD', responsable: 'Pasteur Koffi', objectif: 10000000, categorie: 'Dîmes & Offrandes', description: 'Collecte des dîmes mensuelles des fidèles pour le fonctionnement de l\'église.', dateCreation: '2026-01-10T08:30:00Z', cotisants: { 'm-1': 50000, 'm-2': 30000 }, archivee: false },
  { mockId: 'caisse-offrandes', nom: 'Offrandes de culte', code: 'OFF-CUL', responsable: 'Diacre Yao', objectif: 5000000, categorie: 'Dîmes & Offrandes', description: 'Offrandes collectées lors des cultes dominicaux et des veillées.', dateCreation: '2026-01-11T09:00:00Z', cotisants: { 'm-2': 15000, 'm-3': 25000 }, archivee: false },
  { mockId: 'caisse-construction', nom: 'Construction du Temple', code: 'CST-TMP', responsable: 'M. Kouassi (Comité Construction)', objectif: 50000000, categorie: 'Investissement', description: 'Fonds spécial destiné aux travaux d\'extension et d\'embellissement du temple principal.', dateCreation: '2026-02-01T10:00:00Z', cotisants: { 'm-1': 100000, 'm-3': 150000 }, archivee: false },
  { mockId: 'caisse-social', nom: 'Action Sociale & Entraide', code: 'SOC-ENT', responsable: 'Mme. Amenan Marie', objectif: 3000000, categorie: 'Social & Assistance', description: 'Soutien financier aux familles en difficulté, orphelins et veuves de la communauté.', dateCreation: '2026-02-15T14:00:00Z', cotisants: { 'm-2': 10000 }, archivee: false },
];

const transactionsInitiales = [
  { idCaisseMock: 'caisse-dimes', idMembreMock: 'm-1', montant: 50000, commentaire: 'Dîme du mois de Mai 2026', date: '2026-05-10T10:00:00Z' },
  { idCaisseMock: 'caisse-dimes', idMembreMock: 'm-2', montant: 30000, commentaire: 'Dîme du mois de Mai 2026', date: '2026-05-12T11:30:00Z' },
  { idCaisseMock: 'caisse-offrandes', idMembreMock: 'm-2', montant: 15000, commentaire: 'Offrande d\'action de grâce', date: '2026-05-15T09:15:00Z' },
  { idCaisseMock: 'caisse-offrandes', idMembreMock: 'm-3', montant: 25000, commentaire: 'Action de grâce pour la guérison de sa fille', date: '2026-05-18T16:20:00Z' },
  { idCaisseMock: 'caisse-construction', idMembreMock: 'm-1', montant: 100000, commentaire: 'Contribution spéciale travaux de toiture', date: '2026-05-20T14:00:00Z' },
  { idCaisseMock: 'caisse-construction', idMembreMock: 'm-3', montant: 150000, commentaire: 'Don de la famille Kouassi pour le carrelage', date: '2026-05-25T17:10:00Z' },
  { idCaisseMock: 'caisse-social', idMembreMock: 'm-2', montant: 10000, commentaire: 'Soutien veuves et orphelins', date: '2026-05-28T10:45:00Z' },
];

// ─────────────────────────────────────────────────────────────────────────────
// EXÉCUTION DU SEED
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  await connectDB();
  console.log('Connecté à MongoDB. Nettoyage des collections...');

  await Promise.all([
    Action.deleteMany({}),
    Menu.deleteMany({}),
    Profil.deleteMany({}),
    UtilisateurDashboard.deleteMany({}),
    Membre.deleteMany({}),
    Actualite.deleteMany({}),
    Sermon.deleteMany({}),
    Evenement.deleteMany({}),
    Don.deleteMany({}),
    DemandePriere.deleteMany({}),
    Notification.deleteMany({}),
    Meditation.deleteMany({}),
    Suggestion.deleteMany({}),
    Caisse.deleteMany({}),
    Transaction.deleteMany({}),
    Categorie.deleteMany({}),
    Statut.deleteMany({}),
    AuditTrace.deleteMany({}),
  ]);

  // Actions
  const actionDocs = await Action.insertMany(
    actionsInitiales.map(({ mockId, ...a }) => a)
  );
  const actionIdByMockId = new Map(actionsInitiales.map((a, i) => [a.mockId, String(actionDocs[i]._id)]));
  console.log(`${actionDocs.length} actions créées.`);

  // Menus
  const menuDocs = await Menu.insertMany(
    menusInitiaux.map((m) => ({
      code: m.code,
      libelle: m.libelle,
      chemin: m.chemin,
      icone: m.icone,
      actionsDisponibles: m.actionsDisponibles.map((mockId) => actionIdByMockId.get(mockId)),
    }))
  );
  const menuIdByMockId = new Map(menusInitiaux.map((m, i) => [m.mockId, String(menuDocs[i]._id)]));
  console.log(`${menuDocs.length} menus créés.`);

  // Profils
  const profilDocs = await Profil.insertMany(
    profilsInitiaux.map((p) => ({
      code: p.code,
      libelle: p.libelle,
      description: p.description,
      habilitations: p.habilitations.map((h) => ({
        menuId: menuIdByMockId.get(h.menuMockId),
        actions: h.actionsMockIds.map((mockId) => actionIdByMockId.get(mockId)),
      })),
    }))
  );
  const profilIdByMockId = new Map(profilsInitiaux.map((p, i) => [p.mockId, String(profilDocs[i]._id)]));
  console.log(`${profilDocs.length} profils créés.`);

  // Utilisateurs dashboard
  const utilisateurDocs = await UtilisateurDashboard.insertMany(
    await Promise.all(
      utilisateursDashboardInitiaux.map(async (u) => ({
        nom: u.nom,
        prenom: u.prenom,
        email: u.email,
        passwordHash: await bcrypt.hash(u.motDePasse, 10),
        profilId: profilIdByMockId.get(u.profilMockId),
        actif: u.actif,
      }))
    )
  );
  console.log(`${utilisateurDocs.length} comptes utilisateurs dashboard créés.`);
  utilisateursDashboardInitiaux.forEach((u) => console.log(`  - ${u.email} / ${u.motDePasse}`));

  // Membres
  const membreDocs = await Membre.insertMany(membresInitiaux.map(({ mockId, ...m }) => m));
  const membreIdByMockId = new Map(membresInitiaux.map((m, i) => [m.mockId, String(membreDocs[i]._id)]));
  console.log(`${membreDocs.length} membres créés.`);

  // Contenus
  await Actualite.insertMany(actualitesInitiales);
  await Sermon.insertMany(sermonsInitiaux);
  await Evenement.insertMany(evenementsInitiaux);
  await Don.insertMany(donsInitiaux);
  await DemandePriere.insertMany(demandesPriereInitiales);
  await Meditation.insertMany(meditationsInitiales);
  await Suggestion.insertMany(suggestionsInitiales);
  await Categorie.insertMany(categoriesInitiales.map((nom) => ({ nom })));
  await Statut.insertMany(statutsInitiales.map((nom) => ({ nom })));
  console.log('Actualités, sermons, événements, dons, prières, méditations, suggestions, catégories et statuts créés.');

  // Caisses (remappage des cotisants vers les vrais IDs membres)
  const caisseDocs = await Caisse.insertMany(
    caissesInitiales.map((c) => {
      const cotisants: Record<string, number> = {};
      for (const [mockMembreId, montant] of Object.entries(c.cotisants)) {
        const realId = membreIdByMockId.get(mockMembreId);
        if (realId) cotisants[realId] = montant;
      }
      return {
        nom: c.nom,
        code: c.code,
        responsable: c.responsable,
        objectif: c.objectif,
        categorie: c.categorie,
        description: c.description,
        dateCreation: c.dateCreation,
        cotisants,
        archivee: c.archivee,
      };
    })
  );
  const caisseIdByMockId = new Map(caissesInitiales.map((c, i) => [c.mockId, String(caisseDocs[i]._id)]));
  console.log(`${caisseDocs.length} caisses créées.`);

  // Transactions (remappage idCaisse / idMembre)
  const transactionDocs = await Transaction.insertMany(
    transactionsInitiales.map((t) => ({
      idCaisse: caisseIdByMockId.get(t.idCaisseMock),
      idMembre: membreIdByMockId.get(t.idMembreMock),
      montant: t.montant,
      commentaire: t.commentaire,
      date: t.date,
    }))
  );
  console.log(`${transactionDocs.length} transactions créées.`);

  console.log('\nSeed terminé avec succès.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Erreur lors du seed :', error);
  process.exit(1);
});
