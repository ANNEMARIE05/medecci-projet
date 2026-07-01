import client from '../api/client';
import type { Actualite } from '../stores/useDonneesStore';

export const actualiteService = {
  recupererActualites: async (): Promise<Actualite[]> => {
    const response = await client.get('/actualites');
    return response.data;
  },
  creerActualite: async (actu: Omit<Actualite, 'id' | 'datePublication'>): Promise<Actualite> => {
    const response = await client.post('/actualites', actu);
    return response.data;
  },
  modifierActualite: async (id: string, actu: Partial<Actualite>): Promise<Actualite> => {
    const response = await client.put(`/actualites/${id}`, actu);
    return response.data;
  },
  supprimerActualite: async (id: string): Promise<{ success: boolean }> => {
    const response = await client.delete(`/actualites/${id}`);
    return response.data;
  }
};
export default actualiteService;
