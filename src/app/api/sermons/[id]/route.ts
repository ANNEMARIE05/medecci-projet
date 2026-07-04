import Sermon from '../../../../models/Sermon';
import { createCrudDetailRoutes } from '../../../../lib/crudFactory';

export const { GET, PUT, DELETE } = createCrudDetailRoutes(Sermon, {
  menuCode: 'SERMONS',
  entiteLabel: 'Sermon',
  publicRead: true,
  libelleDe: (doc) => String(doc.titre),
});
