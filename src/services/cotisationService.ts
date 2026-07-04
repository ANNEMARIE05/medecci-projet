import { apiFetch } from '../lib/apiFetch';
import type { Transaction } from '../types/models';

export const cotisationService = {
  recupererTransactions: async (): Promise<Transaction[]> => {
    return apiFetch<Transaction[]>('/api/transactions');
  },
  enregistrerCotisation: async (
    idCaisse: string,
    idMembre: string,
    montant: number,
    commentaire?: string,
    typeDon?: string,
    modePaiement?: string
  ): Promise<Transaction> => {
    return apiFetch<Transaction>('/api/cotisations', {
      method: 'POST',
      body: JSON.stringify({ idCaisse, idMembre, montant, commentaire, typeDon, modePaiement }),
    });
  },
  modifierCotisation: async (idTx: string, nouveauMontant: number): Promise<Transaction> => {
    return apiFetch<Transaction>(`/api/cotisations/${idTx}`, {
      method: 'PUT',
      body: JSON.stringify({ montant: nouveauMontant }),
    });
  },
};
export default cotisationService;
