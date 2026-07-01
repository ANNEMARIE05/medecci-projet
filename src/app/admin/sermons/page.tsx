'use client';

import GardeRoute from '../../../routes/GardeRoute';
import Sermons from '../../../views/admin/Sermons';

export default function Page() {
  return (
    <GardeRoute rolesAutorises={['ADMIN', 'PASTEUR']}>
      <Sermons />
    </GardeRoute>
  );
}
