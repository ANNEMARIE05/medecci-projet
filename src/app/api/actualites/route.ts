import Actualite from '../../../models/Actualite';
import { createCrudListRoutes } from '../../../lib/crudFactory';

export const { GET, POST } = createCrudListRoutes(Actualite, {
  menuCode: 'ACTUALITES',
  entiteLabel: 'Actualité',
  publicRead: true,
  sort: { datePublication: -1 },
  libelleDe: (doc) => String(doc.titre),
});
