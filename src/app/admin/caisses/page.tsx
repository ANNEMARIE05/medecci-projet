'use client';

import GardeRoute from '../../../routes/GardeRoute';
import Caisses from '../../../views/admin/Caisses';

export default function Page() {
  return (
    <GardeRoute rolesAutorises={['ADMIN', 'TRESORIER']}>
      <Caisses />
    </GardeRoute>
  );
}
