import Sermon from '../../../models/Sermon';
import { createCrudListRoutes } from '../../../lib/crudFactory';

export const { GET, POST } = createCrudListRoutes(Sermon, {
  menuCode: 'SERMONS',
  entiteLabel: 'Sermon',
  publicRead: true,
  sort: { date: -1 },
  libelleDe: (doc) => String(doc.titre),
});
