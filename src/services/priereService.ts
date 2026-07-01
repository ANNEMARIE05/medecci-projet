import client from '../api/client';
import type { DemandePriere } from '../stores/useDonneesStore';

export const priereService = {
  recupererDemandesPriere: async (): Promise<DemandePriere[]> => {
    const response = await client.get('/prieres');
    return response.data;
  },
  soumettreDemandePriere: async (demande: Omit<DemandePriere, 'id' | 'date' | 'statut'>): Promise<DemandePriere> => {
    const response = await client.post('/prieres', demande);
    return response.data;
  },
  modifierStatutPriere: async (id: string, statut: DemandePriere['statut']): Promise<DemandePriere> => {
    const response = await client.put(`/prieres/${id}`, { statut });
    return response.data;
  },
  supprimerDemandePriere: async (id: string): Promise<{ success: boolean }> => {
    const response = await client.delete(`/prieres/${id}`);
    return response.data;
  }
};
export default priereService;
