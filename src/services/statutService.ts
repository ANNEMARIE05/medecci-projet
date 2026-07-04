import { apiFetch } from '../lib/apiFetch';

export interface Statut {
  id: string;
  nom: string;
}

export const statutService = {
  recupererStatuts: async (): Promise<Statut[]> => {
    return apiFetch<Statut[]>('/api/statuts');
  },
  ajouterStatut: async (nom: string): Promise<Statut> => {
    return apiFetch<Statut>('/api/statuts', { method: 'POST', body: JSON.stringify({ nom }) });
  },
  modifierStatut: async (id: string, nom: string): Promise<Statut> => {
    return apiFetch<Statut>(`/api/statuts/${id}`, { method: 'PUT', body: JSON.stringify({ nom }) });
  },
  supprimerStatut: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/statuts/${id}`, { method: 'DELETE' });
  },
};
export default statutService;
