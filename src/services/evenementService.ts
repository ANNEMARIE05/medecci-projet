import { apiFetch } from '../lib/apiFetch';
import type { Evenement } from '../types/models';

export const evenementService = {
  recupererEvenements: async (): Promise<Evenement[]> => {
    return apiFetch<Evenement[]>('/api/evenements');
  },
  creerEvenement: async (evenement: Omit<Evenement, 'id'>): Promise<Evenement> => {
    return apiFetch<Evenement>('/api/evenements', { method: 'POST', body: JSON.stringify(evenement) });
  },
  modifierEvenement: async (id: string, evenement: Partial<Evenement>): Promise<Evenement> => {
    return apiFetch<Evenement>(`/api/evenements/${id}`, { method: 'PUT', body: JSON.stringify(evenement) });
  },
  supprimerEvenement: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/evenements/${id}`, { method: 'DELETE' });
  },
};
export default evenementService;
