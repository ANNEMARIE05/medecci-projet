import client from '../api/client';
import type { Don } from '../stores/useDonneesStore';

export const donService = {
  recupererDons: async (): Promise<Don[]> => {
    const response = await client.get('/dons');
    return response.data;
  },
  enregistrerDon: async (don: Omit<Don, 'id' | 'date'>): Promise<Don> => {
    const response = await client.post('/dons', don);
    return response.data;
  },
  supprimerDon: async (id: string): Promise<{ success: boolean }> => {
    const response = await client.delete(`/dons/${id}`);
    return response.data;
  }
};
export default donService;
