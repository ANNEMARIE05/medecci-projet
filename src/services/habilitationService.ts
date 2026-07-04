import { apiFetch } from '../lib/apiFetch';
import type { Action, Menu, Profil, HabilitationProfil, UtilisateurDashboard, AuditTrace } from '../types/models';

export interface MesHabilitations {
  profilId: string | null;
  profilLibelle?: string;
  menus: Array<{ code: string; libelle: string; chemin: string; icone: string }>;
  permissions: Record<string, string[]>;
}

export const habilitationService = {
  // Actions
  recupererActions: async (): Promise<Action[]> => apiFetch<Action[]>('/api/habilitations/actions'),
  ajouterAction: async (data: Omit<Action, 'id'>): Promise<Action> =>
    apiFetch<Action>('/api/habilitations/actions', { method: 'POST', body: JSON.stringify(data) }),
  modifierAction: async (id: string, data: Partial<Omit<Action, 'id'>>): Promise<Action> =>
    apiFetch<Action>(`/api/habilitations/actions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  supprimerAction: async (id: string): Promise<{ success: boolean }> =>
    apiFetch<{ success: boolean }>(`/api/habilitations/actions/${id}`, { method: 'DELETE' }),

  // Menus
  recupererMenus: async (): Promise<Menu[]> => apiFetch<Menu[]>('/api/habilitations/menus'),
  ajouterMenu: async (data: Omit<Menu, 'id' | 'actionsDisponibles'>): Promise<Menu> =>
    apiFetch<Menu>('/api/habilitations/menus', { method: 'POST', body: JSON.stringify(data) }),
  modifierMenu: async (id: string, data: Partial<Omit<Menu, 'id'>>): Promise<Menu> =>
    apiFetch<Menu>(`/api/habilitations/menus/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  supprimerMenu: async (id: string): Promise<{ success: boolean }> =>
    apiFetch<{ success: boolean }>(`/api/habilitations/menus/${id}`, { method: 'DELETE' }),
  assignerActionsMenu: async (menuId: string, actionIds: string[]): Promise<Menu> =>
    apiFetch<Menu>(`/api/habilitations/menus/${menuId}/actions`, { method: 'PUT', body: JSON.stringify({ actionIds }) }),

  // Profils
  recupererProfils: async (): Promise<Profil[]> => apiFetch<Profil[]>('/api/habilitations/profils'),
  ajouterProfil: async (data: Omit<Profil, 'id' | 'habilitations'>): Promise<Profil> =>
    apiFetch<Profil>('/api/habilitations/profils', { method: 'POST', body: JSON.stringify(data) }),
  modifierProfil: async (id: string, data: Partial<Omit<Profil, 'id'>>): Promise<Profil> =>
    apiFetch<Profil>(`/api/habilitations/profils/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  supprimerProfil: async (id: string): Promise<{ success: boolean }> =>
    apiFetch<{ success: boolean }>(`/api/habilitations/profils/${id}`, { method: 'DELETE' }),
  mettreAJourHabilitations: async (profilId: string, habilitations: HabilitationProfil[]): Promise<Profil> =>
    apiFetch<Profil>(`/api/habilitations/profils/${profilId}/habilitations`, {
      method: 'PUT',
      body: JSON.stringify({ habilitations }),
    }),

  // Utilisateurs dashboard
  recupererUtilisateurs: async (): Promise<UtilisateurDashboard[]> =>
    apiFetch<UtilisateurDashboard[]>('/api/habilitations/utilisateurs'),
  ajouterUtilisateur: async (data: {
    nom: string;
    prenom: string;
    email: string;
    motDePasse: string;
    profilId: string;
    actif?: boolean;
  }): Promise<UtilisateurDashboard> =>
    apiFetch<UtilisateurDashboard>('/api/habilitations/utilisateurs', { method: 'POST', body: JSON.stringify(data) }),
  modifierUtilisateur: async (
    id: string,
    data: Partial<{ nom: string; prenom: string; email: string; motDePasse: string; profilId: string; actif: boolean }>
  ): Promise<UtilisateurDashboard> =>
    apiFetch<UtilisateurDashboard>(`/api/habilitations/utilisateurs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  supprimerUtilisateur: async (id: string): Promise<{ success: boolean }> =>
    apiFetch<{ success: boolean }>(`/api/habilitations/utilisateurs/${id}`, { method: 'DELETE' }),
  toggleActifUtilisateur: async (id: string): Promise<UtilisateurDashboard> =>
    apiFetch<UtilisateurDashboard>(`/api/habilitations/utilisateurs/${id}/toggle-actif`, { method: 'PUT' }),

  // Session courante
  recupererMesHabilitations: async (): Promise<MesHabilitations> =>
    apiFetch<MesHabilitations>('/api/habilitations/mon-profil'),

  // Audit
  recupererAudit: async (): Promise<AuditTrace[]> => apiFetch<AuditTrace[]>('/api/habilitations/audit'),
};
export default habilitationService;
