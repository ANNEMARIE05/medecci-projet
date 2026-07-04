import { apiFetch } from '../lib/apiFetch';
import type { Caisse } from '../types/models';

export const caisseService = {
  recupererCaisses: async (): Promise<Caisse[]> => {
    return apiFetch<Caisse[]>('/api/caisses');
  },
  creerCaisse: async (data: {
    nom: string;
    description?: string;
    code?: string;
    responsable?: string;
    objectif?: number;
    categorie?: string;
  }): Promise<Caisse> => {
    return apiFetch<Caisse>('/api/caisses', { method: 'POST', body: JSON.stringify(data) });
  },
  modifierCaisse: async (
    id: string,
    data: { nom: string; description?: string; code?: string; responsable?: string; objectif?: number; categorie?: string }
  ): Promise<Caisse> => {
    return apiFetch<Caisse>(`/api/caisses/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  archiverCaisse: async (id: string): Promise<Caisse> => {
    return apiFetch<Caisse>(`/api/caisses/${id}/archiver`, { method: 'PUT' });
  },
  desarchiverCaisse: async (id: string): Promise<Caisse> => {
    return apiFetch<Caisse>(`/api/caisses/${id}/desarchiver`, { method: 'PUT' });
  },
  supprimerCaisse: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/caisses/${id}`, { method: 'DELETE' });
  },
};
export default caisseService;
