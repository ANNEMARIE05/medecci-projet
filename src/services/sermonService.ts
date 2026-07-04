import { apiFetch } from '../lib/apiFetch';
import type { Sermon } from '../types/models';

export const sermonService = {
  recupererSermons: async (): Promise<Sermon[]> => {
    return apiFetch<Sermon[]>('/api/sermons');
  },
  creerSermon: async (sermon: Omit<Sermon, 'id'>): Promise<Sermon> => {
    return apiFetch<Sermon>('/api/sermons', { method: 'POST', body: JSON.stringify(sermon) });
  },
  modifierSermon: async (id: string, sermon: Partial<Sermon>): Promise<Sermon> => {
    return apiFetch<Sermon>(`/api/sermons/${id}`, { method: 'PUT', body: JSON.stringify(sermon) });
  },
  supprimerSermon: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/sermons/${id}`, { method: 'DELETE' });
  },
};
export default sermonService;
