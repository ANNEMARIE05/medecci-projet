import { apiFetch } from '../lib/apiFetch';
import type { Meditation } from '../types/models';

export const meditationService = {
  recupererMeditations: async (): Promise<Meditation[]> => {
    return apiFetch<Meditation[]>('/api/meditations');
  },
  ajouterMeditation: async (med: Omit<Meditation, 'id' | 'date'>): Promise<Meditation> => {
    return apiFetch<Meditation>('/api/meditations', { method: 'POST', body: JSON.stringify(med) });
  },
  modifierMeditation: async (id: string, med: Partial<Meditation>): Promise<Meditation> => {
    return apiFetch<Meditation>(`/api/meditations/${id}`, { method: 'PUT', body: JSON.stringify(med) });
  },
  supprimerMeditation: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/meditations/${id}`, { method: 'DELETE' });
  },
};
export default meditationService;
