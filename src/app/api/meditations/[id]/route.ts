import Meditation from '../../../../models/Meditation';
import { createCrudDetailRoutes } from '../../../../lib/crudFactory';

export const { GET, PUT, DELETE } = createCrudDetailRoutes(Meditation, {
  menuCode: 'MEDITATIONS',
  entiteLabel: 'Méditation',
  publicRead: true,
  libelleDe: (doc) => String(doc.titre),
});
