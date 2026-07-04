import { apiFetch } from '../lib/apiFetch';
import type { Don } from '../types/models';

export const donService = {
  recupererDons: async (): Promise<Don[]> => {
    return apiFetch<Don[]>('/api/dons');
  },
  enregistrerDon: async (don: Omit<Don, 'id' | 'date'>): Promise<Don> => {
    return apiFetch<Don>('/api/dons', { method: 'POST', body: JSON.stringify(don) });
  },
  modifierDon: async (id: string, don: Partial<Don>): Promise<Don> => {
    return apiFetch<Don>(`/api/dons/${id}`, { method: 'PUT', body: JSON.stringify(don) });
  },
  supprimerDon: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/dons/${id}`, { method: 'DELETE' });
  },
};
export default donService;
