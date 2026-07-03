import { useSyncExternalStore } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

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
  actionsDisponibles: string[]; // IDs des actions assignées à ce menu
}

export interface HabilitationProfil {
  menuId: string;
  actions: string[]; // IDs des actions autorisées pour ce menu
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
  motDePasse: string;
  profilId: string;
  actif: boolean;
  dateCreation: string;
}

export interface AuditTrace {
  id: string;
  date: string;
  utilisateur: string; // ex: "admin@medec-ci.org" ou "Super ADMIN"
  action: string;      // ex: "CRÉATION", "MODIFICATION", "SUPPRESSION", "COMMUTATION STATUT"
  entite: string;      // ex: "Profil", "Utilisateur", "Membre", "Caisse", "Catégorie", "Statut"
  details: string;     // Description lisible
}

export interface HabilitationsStateData {
  actions: Action[];
  menus: Menu[];
  profils: Profil[];
  utilisateursDashboard: UtilisateurDashboard[];
  tracesAudit: AuditTrace[];
}

// ─────────────────────────────────────────────────────────────────────────────
// DONNÉES INITIALES
// ─────────────────────────────────────────────────────────────────────────────

const actionsInitiales: Action[] = [
  { id: 'act-1', code: 'VOIR',      libelle: 'Voir',      description: 'Consulter et visualiser les données' },
  { id: 'act-2', code: 'CREER',     libelle: 'Créer',     description: 'Ajouter de nouveaux enregistrements' },
  { id: 'act-3', code: 'MODIFIER',  libelle: 'Modifier',  description: 'Éditer des enregistrements existants' },
  { id: 'act-4', code: 'SUPPRIMER', libelle: 'Supprimer', description: 'Supprimer des enregistrements' },
  { id: 'act-5', code: 'EXPORTER',  libelle: 'Exporter',  description: 'Exporter les données (PDF, Excel...)' },
];

const menusInitiaux: Menu[] = [
  { id: 'mnu-1',  code: 'TABLEAU_BORD',      libelle: 'Tableau de bord',         chemin: '/admin',                     icone: 'LayoutDashboard', actionsDisponibles: ['act-1'] },
  { id: 'mnu-2',  code: 'CAISSES',           libelle: 'Caisses (Fonds)',          chemin: '/admin/caisses',             icone: 'Folder',          actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4', 'act-5'] },
  { id: 'mnu-3',  code: 'MEMBRES',           libelle: 'Fidèles Cotisants',        chemin: '/admin/membres',             icone: 'Users',           actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4', 'act-5'] },
  { id: 'mnu-4',  code: 'ARCHIVES',          libelle: 'Archives Caisses',         chemin: '/admin/archives',            icone: 'Trash2',          actionsDisponibles: ['act-1', 'act-4'] },
  { id: 'mnu-5',  code: 'HISTORIQUE',        libelle: 'Historique Global',        chemin: '/admin/historique',          icone: 'History',         actionsDisponibles: ['act-1', 'act-5'] },
  { id: 'mnu-6',  code: 'PARAMETRAGE',       libelle: 'Paramétrages',            chemin: '/admin/parametrage',         icone: 'Sliders',         actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4'] },
  { id: 'mnu-7',  code: 'DONS',              libelle: 'Dons en Ligne',            chemin: '/admin/dons',                icone: 'Heart',           actionsDisponibles: ['act-1', 'act-3', 'act-4', 'act-5'] },
  { id: 'mnu-8',  code: 'MEDITATIONS',       libelle: 'Méditations',              chemin: '/admin/meditations',         icone: 'BookOpen',        actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4'] },
  { id: 'mnu-9',  code: 'SUGGESTIONS',       libelle: 'Suggestions',              chemin: '/admin/suggestions',         icone: 'Inbox',           actionsDisponibles: ['act-1', 'act-4'] },
  { id: 'mnu-10', code: 'ACTUALITES',        libelle: 'Actualités',               chemin: '/admin/actualites',          icone: 'Newspaper',       actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4'] },
  { id: 'mnu-11', code: 'SERMONS',           libelle: 'Sermons',                  chemin: '/admin/sermons',             icone: 'Mic',             actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4'] },
  { id: 'mnu-12', code: 'EVENEMENTS',        libelle: 'Événements',               chemin: '/admin/evenements',          icone: 'Calendar',        actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4'] },
  { id: 'mnu-13', code: 'PRIERES',           libelle: 'Demandes de Prière',       chemin: '/admin/prieres',             icone: 'HeartHandshake',  actionsDisponibles: ['act-1', 'act-3', 'act-4'] },
  { id: 'mnu-14', code: 'PARAMETRES',        libelle: 'Mon Profil',               chemin: '/admin/parametres',          icone: 'Settings',        actionsDisponibles: ['act-1', 'act-3'] },
  { id: 'mnu-15', code: 'PROFILS',           libelle: 'Profils & Habilitations',  chemin: '/admin/profils',             icone: 'ShieldCheck',     actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4'] },
  { id: 'mnu-16', code: 'UTILISATEURS',      libelle: 'Utilisateurs Dashboard',   chemin: '/admin/utilisateurs-dashboard', icone: 'UserCog',      actionsDisponibles: ['act-1', 'act-2', 'act-3', 'act-4'] },
];

const profilsInitiaux: Profil[] = [
  {
    id: 'prf-1',
    code: 'ADMIN_COMPLET',
    libelle: 'Administrateur Complet',
    description: 'Accès total à toutes les fonctionnalités du dashboard',
    habilitations: menusInitiaux.map(m => ({ menuId: m.id, actions: [...m.actionsDisponibles] })),
  },
  {
    id: 'prf-2',
    code: 'TRESORIER',
    libelle: 'Trésorier',
    description: 'Accès limité aux modules financiers',
    habilitations: [
      { menuId: 'mnu-1',  actions: ['act-1'] },
      { menuId: 'mnu-2',  actions: ['act-1', 'act-2', 'act-3', 'act-4', 'act-5'] },
      { menuId: 'mnu-3',  actions: ['act-1', 'act-2', 'act-3', 'act-4', 'act-5'] },
      { menuId: 'mnu-4',  actions: ['act-1', 'act-4'] },
      { menuId: 'mnu-5',  actions: ['act-1', 'act-5'] },
      { menuId: 'mnu-6',  actions: ['act-1', 'act-2', 'act-3', 'act-4'] },
      { menuId: 'mnu-7',  actions: ['act-1', 'act-3', 'act-4', 'act-5'] },
    ],
  },
  {
    id: 'prf-3',
    code: 'PASTEUR',
    libelle: 'Pasteur',
    description: 'Accès aux contenus spirituels et publications',
    habilitations: [
      { menuId: 'mnu-1',  actions: ['act-1'] },
      { menuId: 'mnu-8',  actions: ['act-1', 'act-2', 'act-3', 'act-4'] },
      { menuId: 'mnu-9',  actions: ['act-1', 'act-4'] },
      { menuId: 'mnu-10', actions: ['act-1', 'act-2', 'act-3', 'act-4'] },
      { menuId: 'mnu-11', actions: ['act-1', 'act-2', 'act-3', 'act-4'] },
      { menuId: 'mnu-12', actions: ['act-1', 'act-2', 'act-3', 'act-4'] },
      { menuId: 'mnu-13', actions: ['act-1', 'act-3', 'act-4'] },
    ],
  },
];

const utilisateursDashboardInitiaux: UtilisateurDashboard[] = [
  {
    id: 'usr-1',
    nom: 'ADMIN',
    prenom: 'Super',
    email: 'admin@medec-ci.org',
    motDePasse: 'admin123',
    profilId: 'prf-1',
    actif: true,
    dateCreation: '2026-01-01T00:00:00Z',
  },
];

const tracesAuditInitiales: AuditTrace[] = [
  {
    id: 'trc-1',
    date: '2026-07-02T10:00:00Z',
    utilisateur: 'admin@medec-ci.org',
    action: 'CRÉATION',
    entite: 'Configuration',
    details: 'Initialisation du système de traçabilité et de sécurité.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ÉTAT INITIAL
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'medecci-habilitations-store';

const getInitialState = (): HabilitationsStateData => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.state) return parsed.state;
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
  }
  return {
    actions: actionsInitiales,
    menus: menusInitiaux,
    profils: profilsInitiaux,
    utilisateursDashboard: utilisateursDashboardInitiaux,
    tracesAudit: tracesAuditInitiales,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────

let state = getInitialState();
const listeners = new Set<() => void>();

function sauvegarder() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state }));
  }
  listeners.forEach((l) => l());
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const store = {
  getState() { return state; },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },

  // ── AUDIT TRACING ──────────────────────────────────────────────────────────
  ajouterTrace(utilisateur: string, action: string, entite: string, details: string): void {
    const nouvelleTrace: AuditTrace = {
      id: genId('trc'),
      date: new Date().toISOString(),
      utilisateur: utilisateur || 'Système',
      action,
      entite,
      details,
    };
    state = {
      ...state,
      tracesAudit: [nouvelleTrace, ...state.tracesAudit].slice(0, 1000), // Limiter à 1000 traces max pour performance
    };
    sauvegarder();
  },

  // ── ACTIONS ────────────────────────────────────────────────────────────────
  ajouterAction(data: Omit<Action, 'id'>, utilisateur?: string): { success: boolean; error?: string } {
    const code = data.code.trim().toUpperCase();
    if (!code || !data.libelle.trim()) return { success: false, error: 'Code et libellé requis.' };
    if (state.actions.some(a => a.code === code)) return { success: false, error: `Le code "${code}" existe déjà.` };
    
    state = { ...state, actions: [...state.actions, { ...data, id: genId('act'), code }] };
    store.ajouterTrace(utilisateur || 'admin@medec-ci.org', 'CRÉATION', 'Action', `Création de l'action "${data.libelle}" [${code}].`);
    sauvegarder();
    return { success: true };
  },
  modifierAction(id: string, data: Partial<Omit<Action, 'id'>>, utilisateur?: string): { success: boolean; error?: string } {
    const idx = state.actions.findIndex(a => a.id === id);
    if (idx === -1) return { success: false, error: 'Action introuvable.' };
    if (data.code) {
      const code = data.code.trim().toUpperCase();
      if (state.actions.some(a => a.code === code && a.id !== id)) return { success: false, error: `Le code "${code}" est déjà utilisé.` };
      data.code = code;
    }
    const ancien = state.actions[idx];
    const updated = [...state.actions];
    updated[idx] = { ...updated[idx], ...data };
    state = { ...state, actions: updated };
    store.ajouterTrace(utilisateur || 'admin@medec-ci.org', 'MODIFICATION', 'Action', `Modification de l'action "${ancien.libelle}" -> "${data.libelle || ancien.libelle}".`);
    sauvegarder();
    return { success: true };
  },
  supprimerAction(id: string, utilisateur?: string): { success: boolean; error?: string } {
    const idx = state.actions.findIndex(a => a.id === id);
    if (idx === -1) return { success: false, error: 'Action introuvable.' };
    const utiliseeDansMenu = state.menus.some(m => m.actionsDisponibles.includes(id));
    if (utiliseeDansMenu) return { success: false, error: 'Cette action est assignée à un ou plusieurs menus. Retirez-la d\'abord.' };
    
    const ancien = state.actions[idx];
    state = { ...state, actions: state.actions.filter(a => a.id !== id) };
    store.ajouterTrace(utilisateur || 'admin@medec-ci.org', 'SUPPRESSION', 'Action', `Suppression de l'action "${ancien.libelle}" [${ancien.code}].`);
    sauvegarder();
    return { success: true };
  },

  // ── MENUS ──────────────────────────────────────────────────────────────────
  ajouterMenu(data: Omit<Menu, 'id' | 'actionsDisponibles'>, utilisateur?: string): { success: boolean; error?: string } {
    const code = data.code.trim().toUpperCase();
    if (!code || !data.libelle.trim()) return { success: false, error: 'Code et libellé requis.' };
    if (state.menus.some(m => m.code === code)) return { success: false, error: `Le code "${code}" existe déjà.` };
    
    state = { ...state, menus: [...state.menus, { ...data, id: genId('mnu'), code, actionsDisponibles: [] }] };
    store.ajouterTrace(utilisateur || 'admin@medec-ci.org', 'CRÉATION', 'Menu', `Création du menu "${data.libelle}" [${code}].`);
    sauvegarder();
    return { success: true };
  },
  modifierMenu(id: string, data: Partial<Omit<Menu, 'id'>>, utilisateur?: string): { success: boolean; error?: string } {
    const idx = state.menus.findIndex(m => m.id === id);
    if (idx === -1) return { success: false, error: 'Menu introuvable.' };
    
    const ancien = state.menus[idx];
    const updated = [...state.menus];
    updated[idx] = { ...updated[idx], ...data };
    state = { ...state, menus: updated };
    store.ajouterTrace(utilisateur || 'admin@medec-ci.org', 'MODIFICATION', 'Menu', `Modification du menu "${ancien.libelle}" -> "${data.libelle || ancien.libelle}".`);
    sauvegarder();
    return { success: true };
  },
  supprimerMenu(id: string, utilisateur?: string): { success: boolean; error?: string } {
    const idx = state.menus.findIndex(m => m.id === id);
    if (idx === -1) return { success: false, error: 'Menu introuvable.' };
    const utilise = state.profils.some(p => p.habilitations.some(h => h.menuId === id));
    if (utilise) return { success: false, error: 'Ce menu est utilisé dans un ou plusieurs profils.' };
    
    const ancien = state.menus[idx];
    state = { ...state, menus: state.menus.filter(m => m.id !== id) };
    store.ajouterTrace(utilisateur || 'admin@medec-ci.org', 'SUPPRESSION', 'Menu', `Suppression du menu "${ancien.libelle}" [${ancien.code}].`);
    sauvegarder();
    return { success: true };
  },
  assignerActionsMenu(menuId: string, actionIds: string[], utilisateur?: string): { success: boolean; error?: string } {
    const idx = state.menus.findIndex(m => m.id === menuId);
    if (idx === -1) return { success: false, error: 'Menu introuvable.' };
    
    const menu = state.menus[idx];
    const updated = [...state.menus];
    updated[idx] = { ...updated[idx], actionsDisponibles: actionIds };
    state = { ...state, menus: updated };
    store.ajouterTrace(utilisateur || 'admin@medec-ci.org', 'AUTORISATION', 'Menu', `Changement des actions associées au menu "${menu.libelle}" (${actionIds.length} actions associées).`);
    sauvegarder();
    return { success: true };
  },

  // ── PROFILS ────────────────────────────────────────────────────────────────
  ajouterProfil(data: Omit<Profil, 'id' | 'habilitations'>, utilisateur?: string): { success: boolean; error?: string } {
    const code = data.code.trim().toUpperCase();
    if (!code || !data.libelle.trim()) return { success: false, error: 'Code et libellé requis.' };
    if (state.profils.some(p => p.code === code)) return { success: false, error: `Le code "${code}" existe déjà.` };
    
    state = { ...state, profils: [...state.profils, { ...data, id: genId('prf'), code, habilitations: [] }] };
    store.ajouterTrace(utilisateur || 'admin@medec-ci.org', 'CRÉATION', 'Profil', `Création du profil "${data.libelle}" [${code}].`);
    sauvegarder();
    return { success: true };
  },
  modifierProfil(id: string, data: Partial<Omit<Profil, 'id'>>, utilisateur?: string): { success: boolean; error?: string } {
    const idx = state.profils.findIndex(p => p.id === id);
    if (idx === -1) return { success: false, error: 'Profil introuvable.' };
    
    const ancien = state.profils[idx];
    const updated = [...state.profils];
    updated[idx] = { ...updated[idx], ...data };
    state = { ...state, profils: updated };
    store.ajouterTrace(utilisateur || 'admin@medec-ci.org', 'MODIFICATION', 'Profil', `Modification du profil "${ancien.libelle}" -> "${data.libelle || ancien.libelle}".`);
    sauvegarder();
    return { success: true };
  },
  supprimerProfil(id: string, utilisateur?: string): { success: boolean; error?: string } {
    const idx = state.profils.findIndex(p => p.id === id);
    if (idx === -1) return { success: false, error: 'Profil introuvable.' };
    const utilise = state.utilisateursDashboard.some(u => u.profilId === id);
    if (utilise) return { success: false, error: 'Ce profil est assigné à un ou plusieurs utilisateurs.' };
    
    const ancien = state.profils[idx];
    state = { ...state, profils: state.profils.filter(p => p.id !== id) };
    store.ajouterTrace(utilisateur || 'admin@medec-ci.org', 'SUPPRESSION', 'Profil', `Suppression du profil "${ancien.libelle}" [${ancien.code}].`);
    sauvegarder();
    return { success: true };
  },
  mettreAJourHabilitations(profilId: string, habilitations: HabilitationProfil[], utilisateur?: string): { success: boolean; error?: string } {
    const idx = state.profils.findIndex(p => p.id === profilId);
    if (idx === -1) return { success: false, error: 'Profil introuvable.' };
    
    const profil = state.profils[idx];
    const updated = [...state.profils];
    updated[idx] = { ...updated[idx], habilitations };
    state = { ...state, profils: updated };
    store.ajouterTrace(utilisateur || 'admin@medec-ci.org', 'AUTORISATION', 'Habilitations', `Mise à jour des habilitations du profil "${profil.libelle}" (${habilitations.length} menus assignés).`);
    sauvegarder();
    return { success: true };
  },

  // ── UTILISATEURS DASHBOARD ─────────────────────────────────────────────────
  ajouterUtilisateurDashboard(data: Omit<UtilisateurDashboard, 'id' | 'dateCreation'>, utilisateur?: string): { success: boolean; error?: string } {
    if (!data.email.trim() || !data.nom.trim() || !data.prenom.trim()) return { success: false, error: 'Nom, prénom et email requis.' };
    if (state.utilisateursDashboard.some(u => u.email.toLowerCase() === data.email.toLowerCase())) return { success: false, error: 'Cet email est déjà utilisé.' };
    if (!data.motDePasse || data.motDePasse.length < 6) return { success: false, error: 'Le mot de passe doit comporter au moins 6 caractères.' };
    if (!state.profils.some(p => p.id === data.profilId)) return { success: false, error: 'Profil invalide.' };
    
    state = {
      ...state,
      utilisateursDashboard: [
        ...state.utilisateursDashboard,
        { ...data, id: genId('usr'), dateCreation: new Date().toISOString() },
      ],
    };
    store.ajouterTrace(utilisateur || 'admin@medec-ci.org', 'CRÉATION', 'Utilisateur', `Création du compte utilisateur "${data.prenom} ${data.nom}" (${data.email}).`);
    sauvegarder();
    return { success: true };
  },
  modifierUtilisateurDashboard(id: string, data: Partial<Omit<UtilisateurDashboard, 'id' | 'dateCreation'>>, utilisateur?: string): { success: boolean; error?: string } {
    const idx = state.utilisateursDashboard.findIndex(u => u.id === id);
    if (idx === -1) return { success: false, error: 'Utilisateur introuvable.' };
    if (data.email) {
      const emailExiste = state.utilisateursDashboard.some(u => u.email.toLowerCase() === data.email!.toLowerCase() && u.id !== id);
      if (emailExiste) return { success: false, error: 'Cet email est déjà utilisé.' };
    }
    const ancien = state.utilisateursDashboard[idx];
    const updated = [...state.utilisateursDashboard];
    updated[idx] = { ...updated[idx], ...data };
    state = { ...state, utilisateursDashboard: updated };
    store.ajouterTrace(utilisateur || 'admin@medec-ci.org', 'MODIFICATION', 'Utilisateur', `Modification du compte utilisateur "${ancien.prenom} ${ancien.nom}" (${ancien.email}).`);
    sauvegarder();
    return { success: true };
  },
  supprimerUtilisateurDashboard(id: string, utilisateur?: string): { success: boolean; error?: string } {
    const idx = state.utilisateursDashboard.findIndex(u => u.id === id);
    if (idx === -1) return { success: false, error: 'Utilisateur introuvable.' };
    
    const ancien = state.utilisateursDashboard[idx];
    state = { ...state, utilisateursDashboard: state.utilisateursDashboard.filter(u => u.id !== id) };
    store.ajouterTrace(utilisateur || 'admin@medec-ci.org', 'SUPPRESSION', 'Utilisateur', `Suppression du compte utilisateur "${ancien.prenom} ${ancien.nom}" (${ancien.email}).`);
    sauvegarder();
    return { success: true };
  },
  toggleActifUtilisateur(id: string, utilisateur?: string): { success: boolean; error?: string } {
    const idx = state.utilisateursDashboard.findIndex(u => u.id === id);
    if (idx === -1) return { success: false, error: 'Utilisateur introuvable.' };
    
    const u = state.utilisateursDashboard[idx];
    const updated = [...state.utilisateursDashboard];
    updated[idx] = { ...updated[idx], actif: !updated[idx].actif };
    state = { ...state, utilisateursDashboard: updated };
    store.ajouterTrace(utilisateur || 'admin@medec-ci.org', 'COMMUTATION STATUT', 'Utilisateur', `Modification de l'état d'activité pour "${u.prenom} ${u.nom}" -> ${!u.actif ? 'ACTIF' : 'INACTIF'}.`);
    sauvegarder();
    return { success: true };
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

const SERVER_INITIAL_STATE: HabilitationsStateData = {
  actions: [],
  menus: [],
  profils: [],
  utilisateursDashboard: [],
  tracesAudit: [],
};

type StoreActions = Omit<typeof store, 'getState' | 'subscribe'>;
type FullStoreType = HabilitationsStateData & StoreActions;

export function useHabilitationsStore(): FullStoreType;
export function useHabilitationsStore<T>(selector: (s: FullStoreType) => T): T;
export function useHabilitationsStore<T>(selector?: (s: FullStoreType) => T): any {
  const currentState = useSyncExternalStore(store.subscribe, store.getState, () => SERVER_INITIAL_STATE);

  const full: FullStoreType = {
    ...currentState,
    ajouterTrace: store.ajouterTrace.bind(store),
    ajouterAction: store.ajouterAction.bind(store),
    modifierAction: store.modifierAction.bind(store),
    supprimerAction: store.supprimerAction.bind(store),
    ajouterMenu: store.ajouterMenu.bind(store),
    modifierMenu: store.modifierMenu.bind(store),
    supprimerMenu: store.supprimerMenu.bind(store),
    assignerActionsMenu: store.assignerActionsMenu.bind(store),
    ajouterProfil: store.ajouterProfil.bind(store),
    modifierProfil: store.modifierProfil.bind(store),
    supprimerProfil: store.supprimerProfil.bind(store),
    mettreAJourHabilitations: store.mettreAJourHabilitations.bind(store),
    ajouterUtilisateurDashboard: store.ajouterUtilisateurDashboard.bind(store),
    modifierUtilisateurDashboard: store.modifierUtilisateurDashboard.bind(store),
    supprimerUtilisateurDashboard: store.supprimerUtilisateurDashboard.bind(store),
    toggleActifUtilisateur: store.toggleActifUtilisateur.bind(store),
  };

  return selector ? selector(full) : full;
}

useHabilitationsStore.getState = () => {
  const s = store.getState();
  return {
    ...s,
    ajouterTrace: store.ajouterTrace.bind(store),
    ajouterAction: store.ajouterAction.bind(store),
    modifierAction: store.modifierAction.bind(store),
    supprimerAction: store.supprimerAction.bind(store),
    ajouterMenu: store.ajouterMenu.bind(store),
    modifierMenu: store.modifierMenu.bind(store),
    supprimerMenu: store.supprimerMenu.bind(store),
    assignerActionsMenu: store.assignerActionsMenu.bind(store),
    ajouterProfil: store.ajouterProfil.bind(store),
    modifierProfil: store.modifierProfil.bind(store),
    supprimerProfil: store.supprimerProfil.bind(store),
    mettreAJourHabilitations: store.mettreAJourHabilitations.bind(store),
    ajouterUtilisateurDashboard: store.ajouterUtilisateurDashboard.bind(store),
    modifierUtilisateurDashboard: store.modifierUtilisateurDashboard.bind(store),
    supprimerUtilisateurDashboard: store.supprimerUtilisateurDashboard.bind(store),
    toggleActifUtilisateur: store.toggleActifUtilisateur.bind(store),
  };
};
