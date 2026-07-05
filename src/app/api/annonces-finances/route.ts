import AnnonceFinance from '../../../models/AnnonceFinance';
import { createCrudListRoutes } from '../../../lib/crudFactory';

export const { GET, POST } = createCrudListRoutes(AnnonceFinance, {
  menuCode: 'ANNONCES_FINANCES',
  entiteLabel: 'Annonce Finance',
  sort: { dateDimanche: -1 },
  libelleDe: (doc) => String(doc.titreSession),
});
