import AnnonceFinance from '../../../../models/AnnonceFinance';
import { createCrudDetailRoutes } from '../../../../lib/crudFactory';

export const { GET, PUT, DELETE } = createCrudDetailRoutes(AnnonceFinance, {
  menuCode: 'ANNONCES_FINANCES',
  entiteLabel: 'Annonce Finance',
  libelleDe: (doc) => String(doc.titreSession),
});
