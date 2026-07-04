import Actualite from '../../../../models/Actualite';
import { createCrudDetailRoutes } from '../../../../lib/crudFactory';

export const { GET, PUT, DELETE } = createCrudDetailRoutes(Actualite, {
  menuCode: 'ACTUALITES',
  entiteLabel: 'Actualité',
  publicRead: true,
  libelleDe: (doc) => String(doc.titre),
});
