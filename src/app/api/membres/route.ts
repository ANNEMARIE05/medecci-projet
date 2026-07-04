import Membre from '../../../models/Membre';
import { createCrudListRoutes } from '../../../lib/crudFactory';

export const { GET, POST } = createCrudListRoutes(Membre, {
  menuCode: 'MEMBRES',
  entiteLabel: 'Membre',
  sort: { dateInscription: -1 },
  libelleDe: (doc) => `${doc.prenom} ${doc.nom}`,
});
