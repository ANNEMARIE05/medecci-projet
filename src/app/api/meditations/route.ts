import Meditation from '../../../models/Meditation';
import { createCrudListRoutes } from '../../../lib/crudFactory';

export const { GET, POST } = createCrudListRoutes(Meditation, {
  menuCode: 'MEDITATIONS',
  entiteLabel: 'Méditation',
  publicRead: true,
  sort: { date: -1 },
  libelleDe: (doc) => String(doc.titre),
});
