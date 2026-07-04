import { apiFetch } from '../lib/apiFetch';
import type { Membre } from '../types/models';

export const membreService = {
  recupererMembres: async (): Promise<Membre[]> => {
    return apiFetch<Membre[]>('/api/membres');
  },
  creerMembre: async (membre: Omit<Membre, 'id' | 'dateInscription'>): Promise<Membre> => {
    return apiFetch<Membre>('/api/membres', { method: 'POST', body: JSON.stringify(membre) });
  },
  modifierMembre: async (id: string, membre: Partial<Membre>): Promise<Membre> => {
    return apiFetch<Membre>(`/api/membres/${id}`, { method: 'PUT', body: JSON.stringify(membre) });
  },
  supprimerMembre: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/membres/${id}`, { method: 'DELETE' });
  },
};
export default membreService;
