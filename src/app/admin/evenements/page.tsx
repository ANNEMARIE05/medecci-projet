'use client';

import GardeRoute from '../../../routes/GardeRoute';
import Evenements from '../../../views/admin/Evenements';

export default function Page() {
  return (
    <GardeRoute rolesAutorises={['ADMIN', 'PASTEUR']}>
      <Evenements />
    </GardeRoute>
  );
}
