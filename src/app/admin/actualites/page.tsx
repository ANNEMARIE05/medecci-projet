'use client';

import GardeRoute from '../../../routes/GardeRoute';
import Actualites from '../../../views/admin/Actualites';

export default function Page() {
  return (
    <GardeRoute rolesAutorises={['ADMIN', 'PASTEUR']}>
      <Actualites />
    </GardeRoute>
  );
}
