import { apiFetch } from '../lib/apiFetch';
import type { AnnonceFinance } from '../types/models';

export const annonceFinanceService = {
  recupererAnnonces: async (): Promise<AnnonceFinance[]> => {
    return apiFetch<AnnonceFinance[]>('/api/annonces-finances');
  },

  recupererAnnonce: async (id: string): Promise<AnnonceFinance> => {
    return apiFetch<AnnonceFinance>(`/api/annonces-finances/${id}`);
  },

  creerAnnonce: async (
    annonce: Omit<AnnonceFinance, 'id' | 'dateCreation' | 'dateModification'>
  ): Promise<AnnonceFinance> => {
    return apiFetch<AnnonceFinance>('/api/annonces-finances', {
      method: 'POST',
      body: JSON.stringify(annonce),
    });
  },

  modifierAnnonce: async (
    id: string,
    annonce: Partial<Omit<AnnonceFinance, 'id' | 'dateCreation'>>
  ): Promise<AnnonceFinance> => {
    return apiFetch<AnnonceFinance>(`/api/annonces-finances/${id}`, {
      method: 'PUT',
      body: JSON.stringify(annonce),
    });
  },

  supprimerAnnonce: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/annonces-finances/${id}`, {
      method: 'DELETE',
    });
  },

  marquerPresentee: async (id: string): Promise<AnnonceFinance> => {
    return apiFetch<AnnonceFinance>(`/api/annonces-finances/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ statut: 'PRESENTEE' }),
    });
  },

  archiverAnnonce: async (id: string): Promise<AnnonceFinance> => {
    return apiFetch<AnnonceFinance>(`/api/annonces-finances/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ statut: 'ARCHIVEE' }),
    });
  },
};

export default annonceFinanceService;
