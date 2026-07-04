import Membre from '../../../../models/Membre';
import { createCrudDetailRoutes } from '../../../../lib/crudFactory';

export const { GET, PUT, DELETE } = createCrudDetailRoutes(Membre, {
  menuCode: 'MEMBRES',
  entiteLabel: 'Membre',
  libelleDe: (doc) => `${doc.prenom} ${doc.nom}`,
});
