import { apiFetch } from '../lib/apiFetch';

export interface Categorie {
  id: string;
  nom: string;
}

export const categorieService = {
  recupererCategories: async (): Promise<Categorie[]> => {
    return apiFetch<Categorie[]>('/api/categories');
  },
  ajouterCategorie: async (nom: string): Promise<Categorie> => {
    return apiFetch<Categorie>('/api/categories', { method: 'POST', body: JSON.stringify({ nom }) });
  },
  modifierCategorie: async (id: string, nom: string): Promise<Categorie> => {
    return apiFetch<Categorie>(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify({ nom }) });
  },
  supprimerCategorie: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/categories/${id}`, { method: 'DELETE' });
  },
};
export default categorieService;
