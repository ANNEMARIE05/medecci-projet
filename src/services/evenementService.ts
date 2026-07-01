import client from '../api/client';
import type { Evenement } from '../stores/useDonneesStore';

export const evenementService = {
  recupererEvenements: async (): Promise<Evenement[]> => {
    const response = await client.get('/evenements');
    return response.data;
  },
  creerEvenement: async (evenement: Omit<Evenement, 'id'>): Promise<Evenement> => {
    const response = await client.post('/evenements', evenement);
    return response.data;
  },
  modifierEvenement: async (id: string, evenement: Partial<Evenement>): Promise<Evenement> => {
    const response = await client.put(`/evenements/${id}`, evenement);
    return response.data;
  },
  supprimerEvenement: async (id: string): Promise<{ success: boolean }> => {
    const response = await client.delete(`/evenements/${id}`);
    return response.data;
  }
};
export default evenementService;
