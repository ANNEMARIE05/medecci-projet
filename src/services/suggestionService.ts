import { apiFetch } from '../lib/apiFetch';
import type { Suggestion } from '../types/models';

export const suggestionService = {
  recupererSuggestions: async (): Promise<Suggestion[]> => {
    return apiFetch<Suggestion[]>('/api/suggestions');
  },
  soumettreSuggestion: async (sug: Omit<Suggestion, 'id' | 'date'>): Promise<Suggestion> => {
    return apiFetch<Suggestion>('/api/suggestions', { method: 'POST', body: JSON.stringify(sug) });
  },
  supprimerSuggestion: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/suggestions/${id}`, { method: 'DELETE' });
  },
};
export default suggestionService;
