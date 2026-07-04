import Evenement from '../../../../models/Evenement';
import { createCrudDetailRoutes } from '../../../../lib/crudFactory';

export const { GET, PUT, DELETE } = createCrudDetailRoutes(Evenement, {
  menuCode: 'EVENEMENTS',
  entiteLabel: 'Événement',
  publicRead: true,
  libelleDe: (doc) => String(doc.titre),
});
