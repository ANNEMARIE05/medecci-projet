import type { Caisse, Transaction } from '../types/models';

export function calculerTotalCaisse(caisse: Caisse | undefined): number {
  if (!caisse) return 0;
  return Object.values(caisse.cotisants || {}).reduce((sum, val) => sum + val, 0);
}

export function calculerTotalGeneral(caisses: Caisse[]): number {
  return caisses.reduce((total, caisse) => {
    if (caisse.archivee) return total;
    return total + calculerTotalCaisse(caisse);
  }, 0);
}

export function obtenirCotisationsMembre(transactions: Transaction[], idMembre: string): Transaction[] {
  return transactions.filter((tx) => tx.idMembre === idMembre);
}

export interface SoldeMembreCaisse {
  idCaisse: string;
  nomCaisse: string;
  montant: number;
  archivee: boolean;
}

export function obtenirSoldeMembreParCaisse(caisses: Caisse[], idMembre: string): SoldeMembreCaisse[] {
  const resultats: SoldeMembreCaisse[] = [];
  for (const caisse of caisses) {
    const montant = caisse.cotisants?.[idMembre] || 0;
    if (montant > 0) {
      resultats.push({ idCaisse: caisse.id, nomCaisse: caisse.nom, montant, archivee: caisse.archivee });
    }
  }
  return resultats;
}
