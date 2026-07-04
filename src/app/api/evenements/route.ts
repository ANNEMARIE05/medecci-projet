import Evenement from '../../../models/Evenement';
import { createCrudListRoutes } from '../../../lib/crudFactory';

export const { GET, POST } = createCrudListRoutes(Evenement, {
  menuCode: 'EVENEMENTS',
  entiteLabel: 'Événement',
  publicRead: true,
  sort: { dateDebut: -1 },
  libelleDe: (doc) => String(doc.titre),
});
