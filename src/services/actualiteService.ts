import { apiFetch } from '../lib/apiFetch';
import type { Actualite } from '../types/models';

export const actualiteService = {
  recupererActualites: async (): Promise<Actualite[]> => {
    return apiFetch<Actualite[]>('/api/actualites');
  },
  creerActualite: async (actu: Omit<Actualite, 'id' | 'datePublication'>): Promise<Actualite> => {
    return apiFetch<Actualite>('/api/actualites', { method: 'POST', body: JSON.stringify(actu) });
  },
  modifierActualite: async (id: string, actu: Partial<Actualite>): Promise<Actualite> => {
    return apiFetch<Actualite>(`/api/actualites/${id}`, { method: 'PUT', body: JSON.stringify(actu) });
  },
  supprimerActualite: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/actualites/${id}`, { method: 'DELETE' });
  },
};
export default actualiteService;
