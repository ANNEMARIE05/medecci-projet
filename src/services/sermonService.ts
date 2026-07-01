import client from '../api/client';
import type { Sermon } from '../stores/useDonneesStore';

export const sermonService = {
  recupererSermons: async (): Promise<Sermon[]> => {
    const response = await client.get('/sermons');
    return response.data;
  },
  creerSermon: async (sermon: Omit<Sermon, 'id'>): Promise<Sermon> => {
    const response = await client.post('/sermons', sermon);
    return response.data;
  },
  modifierSermon: async (id: string, sermon: Partial<Sermon>): Promise<Sermon> => {
    const response = await client.put(`/sermons/${id}`, sermon);
    return response.data;
  },
  supprimerSermon: async (id: string): Promise<{ success: boolean }> => {
    const response = await client.delete(`/sermons/${id}`);
    return response.data;
  }
};
export default sermonService;
