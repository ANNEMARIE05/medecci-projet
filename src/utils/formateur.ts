/**
 * Utilitaires de formatage pour l'application MEDECCI
 */

/**
 * Formate un montant en Franc CFA (XOF)
 * @param montant Le nombre à formater
 * @returns Une chaîne formatée (ex: "50 000 FCFA")
 */
export const formaterDevise = (montant: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(montant)
    .replace('XOF', 'FCFA')
    .trim();
};

/**
 * Formate une date au format français lisible
 * @param dateStr Chaîne de date ISO ou objet Date
 * @param inclureHeure Si vrai, ajoute l'heure au format "HH:MM"
 * @returns Date au format "28 juin 2026"
 */
export const formaterDate = (dateStr: string | Date, inclureHeure = false): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const dateFormatee = date.toLocaleDateString('fr-FR', options);

  if (inclureHeure) {
    const heures = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${dateFormatee} à ${heures}h${minutes}`;
  }

  return dateFormatee;
};

/**
 * Formate un numéro de téléphone ivoirien (10 chiffres) par paires
 * @param tel Le numéro brut (ex: "0707894512")
 * @returns Le numéro formaté (ex: "07 07 89 45 12")
 */
export const formaterTelephone = (tel: string): string => {
  if (!tel) return '';
  const cleanTel = tel.replace(/\s+/g, '');
  if (cleanTel.length === 10) {
    return cleanTel.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  return tel;
};
