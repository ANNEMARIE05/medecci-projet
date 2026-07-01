'use client';

import GardeRoute from '../../../routes/GardeRoute';
import DonsAdmin from '../../../views/admin/DonsAdmin';

export default function Page() {
  return (
    <GardeRoute rolesAutorises={['ADMIN', 'TRESORIER']}>
      <DonsAdmin />
    </GardeRoute>
  );
}
