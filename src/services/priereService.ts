import { apiFetch } from '../lib/apiFetch';
import type { DemandePriere } from '../types/models';

export const priereService = {
  recupererDemandesPriere: async (): Promise<DemandePriere[]> => {
    return apiFetch<DemandePriere[]>('/api/prieres');
  },
  soumettreDemandePriere: async (demande: Omit<DemandePriere, 'id' | 'date' | 'statut'>): Promise<DemandePriere> => {
    return apiFetch<DemandePriere>('/api/prieres', { method: 'POST', body: JSON.stringify(demande) });
  },
  modifierStatutPriere: async (id: string, statut: DemandePriere['statut']): Promise<DemandePriere> => {
    return apiFetch<DemandePriere>(`/api/prieres/${id}`, { method: 'PUT', body: JSON.stringify({ statut }) });
  },
  supprimerDemandePriere: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/prieres/${id}`, { method: 'DELETE' });
  },
};
export default priereService;
