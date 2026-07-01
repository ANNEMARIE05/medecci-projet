import client from '../api/client';
import type { Membre } from '../stores/useDonneesStore';

export const membreService = {
  recupererMembres: async (): Promise<Membre[]> => {
    const response = await client.get('/membres');
    return response.data;
  },
  creerMembre: async (membre: Omit<Membre, 'id' | 'dateInscription'>): Promise<Membre> => {
    const response = await client.post('/membres', membre);
    return response.data;
  },
  modifierMembre: async (id: string, membre: Partial<Membre>): Promise<Membre> => {
    const response = await client.put(`/membres/${id}`, membre);
    return response.data;
  },
  supprimerMembre: async (id: string): Promise<{ success: boolean }> => {
    const response = await client.delete(`/membres/${id}`);
    return response.data;
  }
};
export default membreService;
