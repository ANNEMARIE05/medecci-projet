/**
 * Utilitaires CSV — MEDECCI
 * Fonctions pour exporter, importer et générer des modèles CSV
 */

export interface ColonneCSV<T = Record<string, unknown>> {
  /** En-tête de colonne affiché dans le fichier CSV */
  entete: string;
  /** Accesseur : clé de l'objet ou fonction de transformation */
  accesseur: keyof T | ((ligne: T) => string | number | boolean | null | undefined);
}

/**
 * Échappe une valeur pour le format CSV (gère les virgules, guillemets, sauts de ligne)
 */
function echapperCSV(valeur: unknown): string {
  if (valeur === null || valeur === undefined) return '';
  const str = String(valeur);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Exporte un tableau de données en fichier CSV et déclenche le téléchargement
 */
export function exporterCSV<T extends Record<string, unknown>>(
  colonnes: ColonneCSV<T>[],
  donnees: T[],
  nomFichier = 'export.csv'
): void {
  const entetes = colonnes.map((c) => echapperCSV(c.entete)).join(',');

  const lignes = donnees.map((ligne) =>
    colonnes
      .map((col) => {
        const valeur =
          typeof col.accesseur === 'function'
            ? col.accesseur(ligne)
            : ligne[col.accesseur];
        return echapperCSV(valeur);
      })
      .join(',')
  );

  const contenu = [entetes, ...lignes].join('\n');
  const blob = new Blob(['\uFEFF' + contenu], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const lien = document.createElement('a');
  lien.href = url;
  lien.download = nomFichier.endsWith('.csv') ? nomFichier : `${nomFichier}.csv`;
  document.body.appendChild(lien);
  lien.click();
  document.body.removeChild(lien);
  URL.revokeObjectURL(url);
}

/**
 * Génère et télécharge un fichier CSV vide avec seulement les en-têtes (modèle d'import)
 */
export function telechargerModeleCSV<T extends Record<string, unknown>>(
  colonnes: ColonneCSV<T>[],
  nomFichier = 'modele.csv'
): void {
  const entetes = colonnes.map((c) => echapperCSV(c.entete)).join(',');
  const blob = new Blob(['\uFEFF' + entetes + '\n'], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const lien = document.createElement('a');
  lien.href = url;
  lien.download = nomFichier.endsWith('.csv') ? nomFichier : `${nomFichier}.csv`;
  document.body.appendChild(lien);
  lien.click();
  document.body.removeChild(lien);
  URL.revokeObjectURL(url);
}

export interface ResultatImport<T> {
  lignes: T[];
  erreurs: { ligne: number; message: string }[];
}

/**
 * Parse un contenu CSV en un tableau d'objets
 * La première ligne est considérée comme les en-têtes
 */
export function parserCSV(contenu: string): { entetes: string[]; lignes: string[][] } {
  // Nettoyer le BOM UTF-8
  const texte = contenu.replace(/^\uFEFF/, '').trim();
  const rangees = texte.split(/\r?\n/).filter((r) => r.trim().length > 0);

  if (rangees.length === 0) return { entetes: [], lignes: [] };

  const entetes = parseLigneCSV(rangees[0]);
  const lignes = rangees.slice(1).map(parseLigneCSV);

  return { entetes, lignes };
}

/**
 * Parse une ligne CSV en tenant compte des guillemets
 */
function parseLigneCSV(ligne: string): string[] {
  const champs: string[] = [];
  let courant = '';
  let dansGuillemets = false;

  for (let i = 0; i < ligne.length; i++) {
    const car = ligne[i];

    if (car === '"') {
      if (dansGuillemets && ligne[i + 1] === '"') {
        courant += '"';
        i++;
      } else {
        dansGuillemets = !dansGuillemets;
      }
    } else if (car === ',' && !dansGuillemets) {
      champs.push(courant.trim());
      courant = '';
    } else {
      courant += car;
    }
  }
  champs.push(courant.trim());
  return champs;
}

/**
 * Lit un fichier File et retourne son contenu texte
 */
export function lireFichierTexte(fichier: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lecteur = new FileReader();
    lecteur.onload = (e) => resolve(e.target?.result as string);
    lecteur.onerror = () => reject(new Error('Impossible de lire le fichier.'));
    lecteur.readAsText(fichier, 'UTF-8');
  });
}
