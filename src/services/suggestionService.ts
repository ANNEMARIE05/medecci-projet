import client from '../api/client';
import type { Suggestion } from '../stores/useDonneesStore';

export const suggestionService = {
  recupererSuggestions: async (): Promise<Suggestion[]> => {
    const response = await client.get('/suggestions');
    return response.data;
  },
  soumettreSuggestion: async (sug: Omit<Suggestion, 'id' | 'date'>): Promise<Suggestion> => {
    const response = await client.post('/suggestions', sug);
    return response.data;
  },
  supprimerSuggestion: async (id: string): Promise<{ success: boolean }> => {
    const response = await client.delete(`/suggestions/${id}`);
    return response.data;
  }
};
export default suggestionService;
