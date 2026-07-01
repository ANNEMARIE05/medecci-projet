import client from '../api/client';
import type { Meditation } from '../stores/useDonneesStore';

export const meditationService = {
  recupererMeditations: async (): Promise<Meditation[]> => {
    const response = await client.get('/meditations');
    return response.data;
  },
  ajouterMeditation: async (med: Omit<Meditation, 'id' | 'date'>): Promise<Meditation> => {
    const response = await client.post('/meditations', med);
    return response.data;
  },
  modifierMeditation: async (id: string, med: Partial<Meditation>): Promise<Meditation> => {
    const response = await client.put(`/meditations/${id}`, med);
    return response.data;
  },
  supprimerMeditation: async (id: string): Promise<{ success: boolean }> => {
    const response = await client.delete(`/meditations/${id}`);
    return response.data;
  }
};
export default meditationService;
